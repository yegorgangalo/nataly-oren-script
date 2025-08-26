class NotionService {
  constructor() {
    if (NotionService.instance) {
      return NotionService.instance;
    }

    this.apiKey = PropertiesService.getScriptProperties().getProperty('NOTION_API_KEY');
    this.dbId = PropertiesService.getScriptProperties().getProperty('NOTION_DB_ID');
    this.apiBaseUrl = PropertiesService.getScriptProperties().getProperty('NOTION_API_BASE_URL');

    NotionService.instance = this;
  }

  getHeaders() {
    return {
      "Authorization": `Bearer ${this.apiKey}`,
      "Notion-Version": "2022-06-28"
    };
  }

  getNotionShareLink() {
    // Generate a shareable link to your Notion database
    return `https://www.notion.so/${this.dbId.replace(/-/g, '')}?v=`;
  }

  async checkAndInviteUser(name, email) {
    try {
      const searchQuery = {
        filter: {
          and: [
            {
              property: "Title",
              title: {
                equals: name
              }
            },
            {
              property: "Text",
              rich_text: {
                equals: email
              }
            }
          ]
        },
        page_size: 1
      };

      const searchOptions = {
        method: "post",
        contentType: "application/json",
        headers: this.getHeaders(),
        payload: JSON.stringify(searchQuery)
      };

      const searchResponse = UrlFetchApp.fetch(`${this.apiBaseUrl}/v1/databases/${this.dbId}/query`, searchOptions);

      if (searchResponse.getResponseCode() !== 200) {
        throw new Error(`HTTP ${searchResponse.getResponseCode()}: ${searchResponse.getContentText()}`);
      }

      const searchResult = JSON.parse(searchResponse.getContentText());

      console.log("Search result:", searchResult);

      if (searchResult.results?.length > 0) {
        console.log(`User ${name} (${email}) already exists in Notion`);
        return { exists: true, message: `User ${name} (${email}) already exists in Notion database.` };
      }

      console.log(`User ${name} (${email}) doesn't exist, creating page...`);
      const pageCreated = await this.createNotionPage(name, email);

      if (pageCreated) {
        return { exists: false, created: true, message: `Page created for user ${name} (${email})` };
      }

      return { exists: false, created: false, message: `Failed to create page for ${name}` };

    } catch (error) {
      console.error("Error checking user:", error);
      throw error;
    }
  }

  async createNotionPage(name, email) {
    try {
      const payload = {
        parent: { database_id: this.dbId },
        properties: {
          Title: { title: [{ text: { content: name } }] },
          Text: { rich_text: [{ text: { content: email } }] }
        },
        children: [
          ...getTemplate().children
        ]
      };

      const options = {
        method: "post",
        contentType: "application/json",
        headers: this.getHeaders(),
        payload: JSON.stringify(payload)
      };

      const result = UrlFetchApp.fetch(`${this.apiBaseUrl}/v1/pages`, options);
      const responseCode = result.getResponseCode();

      if (responseCode === 200) {
        console.log("Page created successfully");
        return true;
      } else {
        console.error("Failed to create page, response code:", responseCode);
        throw new Error(`Failed to create page, response code: ${responseCode}`);
      }
    } catch (error) {
      console.error("Error creating page:", error);
      throw error;
    }
  }

  // Static methods for singleton management
  static getInstance() {
    if (!NotionService.instance) {
      NotionService.instance = new NotionService();
    }
    return NotionService.instance;
  }

  static resetInstance() {
    NotionService.instance = null;
  }
}

// Global singleton instance
const notionService = NotionService.getInstance();