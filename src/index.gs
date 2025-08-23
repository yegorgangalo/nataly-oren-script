// Common constants
const API_KEY = PropertiesService.getScriptProperties().getProperty('NOTION_API_KEY');
const DB_ID = PropertiesService.getScriptProperties().getProperty('NOTION_DB_ID');
const API_BASE_URL = PropertiesService.getScriptProperties().getProperty('NOTION_API_BASE_URL');
const COMPANY_EMAIL = PropertiesService.getScriptProperties().getScriptProperties().getProperty('COMPANY_EMAIL');

// Common headers
const getHeaders = () => ({
  "Authorization": `Bearer ${API_KEY}`,
  "Notion-Version": "2022-06-28"
});

function onFormSubmit(e) {
  const row = e.values;
  const name = row[1];
  const email = row[3];

  console.log("row=>", row);

  // checkAndInviteUser(name, email);
}

const check = () => {
  checkAndInviteUser("yehor", "gangaloyegor@gmail.com");
};

function checkAndInviteUser(name, email) {
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
      headers: getHeaders(),
      payload: JSON.stringify(searchQuery)
    };

    const searchResponse = UrlFetchApp.fetch(`${API_BASE_URL}/v1/databases/${DB_ID}/query`, searchOptions);

    if (searchResponse.getResponseCode() !== 200) {
      throw new Error(`HTTP ${searchResponse.getResponseCode()}: ${searchResponse.getContentText()}`);
    }

    const searchResult = JSON.parse(searchResponse.getContentText());

    console.log("Search result:", searchResult);

    if (searchResult.results && searchResult.results.length > 0) {
      console.log(`User ${name} (${email}) already exists in Notion`);
      sendNotification("User already exists", `User ${name} (${email}) already exists in Notion database.`);
      return;
    }

    console.log(`User ${name} (${email}) doesn't exist, sending invite...`);

    const pageCreated = createNotionPage(name, email);

    if (pageCreated) {
      sendNotionInvite(email, name);
    }

  } catch (error) {
    console.error("Error checking user:", error);
    sendNotification("Error", `Error checking user: ${error.toString()}`);
  }
}

function createNotionPage(name, email) {
  const payload = {
    parent: { database_id: DB_ID },
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
    headers: getHeaders(),
    payload: JSON.stringify(payload)
  };

  try {
    const result = UrlFetchApp.fetch(`${API_BASE_URL}/v1/pages`, options);
    const responseCode = result.getResponseCode();

    if (responseCode === 200) {
      console.log("Page created successfully");
      sendNotification("Success", `Page created for user ${name} (${email})`);
      return true;
    } else {
      console.error("Failed to create page, response code:", responseCode);
      sendNotification("Error", `Failed to create page for ${name}, response code: ${responseCode}`);
      return false;
    }
  } catch (error) {
    console.error("Error creating page:", error);
    sendNotification("Error", `Error creating page: ${error.toString()}`);
    return false;
  }
}

function sendNotionInvite(email, name) {
  try {
    const invitePayload = {
      email: email,
      type: "person"
    };

    const options = {
      method: "post",
      contentType: "application/json",
      headers: getHeaders(),
      payload: JSON.stringify(invitePayload)
    };

    const response = UrlFetchApp.fetch(`${API_BASE_URL}/v1/invites`, options);
    const responseCode = response.getResponseCode();

    if (responseCode === 200) {
      const result = JSON.parse(response.getContentText());
      console.log(`Invite sent successfully to ${email}`);
      sendNotification("Success", `Invite sent to ${email} for user ${name}`);
      return true;
    } else {
      console.error(`Failed to send invite, response code: ${responseCode}`);
      sendNotification("Error", `Failed to send invite to ${email}, response code: ${responseCode}`);
      return false;
    }

  } catch (error) {
    console.error("Error sending invite:", error);
    sendNotification("Error", `Error sending invite: ${error.toString()}`);
    return false;
  }
}

function sendNotification(title, message, to = COMPANY_EMAIL) {
  try {
    if (!GmailApp) {
      throw Error();
    }
    GmailApp.sendEmail(to, `Notion User Management - ${title}`, message, { name: alias });
    console.log(`Gmail notification sent to ${to}`);
    return;
  } catch (error) {
    console.log("GmailApp not available");
  }
}