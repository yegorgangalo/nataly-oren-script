// Common constants
const API_KEY = PropertiesService.getScriptProperties().getProperty('NOTION_API_KEY');
const DB_ID = PropertiesService.getScriptProperties().getProperty('NOTION_DB_ID');
const API_BASE_URL = PropertiesService.getScriptProperties().getProperty('NOTION_API_BASE_URL');
const COMPANY_EMAIL = PropertiesService.getScriptProperties().getProperty('COMPANY_EMAIL');

// Common headers
const getHeaders = () => ({
  "Authorization": `Bearer ${API_KEY}`,
  "Notion-Version": "2022-06-28"
});

function onFormSubmit(e) {
  console.log(e)
  const row = e.values;
  const formId = identifyForm(row);

  console.log("Form submission detected:", formId);
  console.log("Row data:", row);

  if (!formId) {
    console.log("Unknown form or no data received");
    return;
  }

  switch (formId) {
    case 'trainings':
      handleTrainingsForm(row);
      break;
    case 'diagnostics':
      handleDiagnosticsForm(row);
      break;
    case 'registrations':
      handleRegistrationsForm(row);
      break;
    default:
      console.log("Unhandled form type:", formId);
  }
}

const identifyForm = (row) => {
  if (!row || row.length === 0) return null;

  // Check if row has any meaningful data
  const hasData = row.some(value => value && value.toString().trim() !== '');
  if (!hasData) return null;

  // Identify form by checking specific patterns for each form type

  // Trainings form: has email in column B and rating in column G
  if (row[1] && isValidEmail(row[1]) && row[6] && !isNaN(parseInt(row[6]))) {
    return 'trainings';
  }

  // Diagnostics form: has email in column B and health questions in columns C-H
  if (row[1] && isValidEmail(row[1]) && (row[2] || row[3] || row[4] || row[5] || row[6] || row[7])) {
    return 'diagnostics';
  }

  // Registrations form: has name in column B, phone in column C, email in column D
  if (row[1] && row[2] && row[3] && isValidEmail(row[3]) && row[1].toString().trim() !== '' && row[2].toString().trim() !== '') {
    return 'registrations';
  }

  return null;
}



const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

const getFormData = (row, formId) => {
  const config = FORM_CONFIGS[formId];
  if (!config) return null;

  const data = {
    formId: formId,
    timestamp: new Date().toISOString()
  };

  if (config.nameColumn !== undefined && config.nameColumn !== null) {
    data.name = row[config.nameColumn]?.toString().trim() || '';
  }

  if (config.emailColumn !== undefined) {
    data.email = row[config.emailColumn]?.toString().trim() || '';
  }

  if (config.phoneColumn !== undefined) {
    data.phone = row[config.phoneColumn]?.toString().trim() || '';
  }

  if (config.feedbackColumn !== undefined) {
    data.feedback = row[config.feedbackColumn]?.toString().trim() || '';
  }

  if (config.startDateColumn !== undefined) {
    data.startDate = row[config.startDateColumn]?.toString().trim() || '';
  }

  if (config.serviceTypeColumn !== undefined) {
    data.serviceType = row[config.serviceTypeColumn]?.toString().trim() || '';
  }

  if (config.workoutTypeColumn !== undefined) {
    data.workoutType = row[config.workoutTypeColumn]?.toString().trim() || '';
  }

  // Add specific fields for each form type
  if (formId === 'trainings') {
    data.feelingAfter = row[2]?.toString().trim() || '';
    data.hardestPart = row[3]?.toString().trim() || '';
    data.dislikedExercises = row[4]?.toString().trim() || '';
    data.painAfter = row[5]?.toString().trim() || '';
    data.wellBeingRating = row[6]?.toString().trim() || '';
  }

  if (formId === 'diagnostics') {
    data.currentFeeling = row[2]?.toString().trim() || '';
    data.energyLevel = row[3]?.toString().trim() || '';
    data.healthStatus = row[4]?.toString().trim() || '';
    data.sleepQuality = row[5]?.toString().trim() || '';
    data.stressLevel = row[6]?.toString().trim() || '';
    data.additionalInfo = row[7]?.toString().trim() || '';
  }

  return data;
}

const logFormSubmission = (formId, data, hasData) => {
  const logMessage = {
    timestamp: new Date().toISOString(),
    formId: formId,
    hasData: hasData,
    data: data,
    rowLength: data ? Object.keys(data).length : 0
  };

  console.log("Form submission log:", JSON.stringify(logMessage, null, 2));

  if (!hasData) {
    sendNotification("Empty Form Submission",
      `Form '${FORM_CONFIGS[formId]?.description || formId}' submitted with no data at ${logMessage.timestamp}`);
  }
}

const handleTrainingsForm = (row) => {
  const formData = getFormData(row, 'trainings');
  const hasData = formData && formData.email;

  logFormSubmission('trainings', formData, hasData);

  if (!hasData) {
    console.log("Trainings form received no data");
    return;
  }

  console.log("Processing trainings feedback form for:", formData.email);
  processTrainingFeedback(formData);
}

const handleDiagnosticsForm = (row) => {
  const formData = getFormData(row, 'diagnostics');
  const hasData = formData && formData.email;

  logFormSubmission('diagnostics', formData, hasData);

  if (!hasData) {
    console.log("Diagnostics form received no data");
    return;
  }

  console.log("Processing diagnostics form for:", formData.email);
  processHealthDiagnostics(formData);
}

const handleRegistrationsForm = (row) => {
  const formData = getFormData(row, 'registrations');
  const hasData = formData && formData.name && formData.email && formData.phone;

  logFormSubmission('registrations', formData, hasData);

  if (!hasData) {
    console.log("Registrations form received no data");
    return;
  }

  console.log("Processing registration form for:", formData.name, formData.email);
  processRegistration(formData);
}



const processTrainingFeedback = (formData) => {
  try {
    console.log(`Processing training feedback from ${formData.email}`);

    // Create a training feedback entry in Notion
    const feedbackPayload = {
      parent: { database_id: DB_ID },
      properties: {
        Title: { title: [{ text: { content: `Training Feedback: ${formData.email}` } }] },
        Text: { rich_text: [{ text: { content: formData.email } }] },
        Type: { select: { name: "Training Feedback" } },
        Rating: { number: parseInt(formData.wellBeingRating) || 0 }
      }
    };

    // Process the training feedback
    sendNotification("Training Feedback Received",
      `New training feedback from ${formData.email}\nRating: ${formData.wellBeingRating}/10\nFeeling: ${formData.feelingAfter}`);

    // You can add more specific logic here for training feedback

  } catch (error) {
    console.error("Error processing training feedback:", error);
    sendNotification("Error", `Error processing training feedback: ${error.toString()}`);
  }
};

const processHealthDiagnostics = (formData) => {
  try {
    console.log(`Processing health diagnostics from ${formData.email}`);

    // Create a health diagnostics entry in Notion
    const diagnosticsPayload = {
      parent: { database_id: DB_ID },
      properties: {
        Title: { title: [{ text: { content: `Health Diagnostics: ${formData.email}` } }] },
        Text: { rich_text: [{ text: { content: formData.email } }] },
        Type: { select: { name: "Health Diagnostics" } }
      }
    };

    // Process the health diagnostics
    sendNotification("Health Diagnostics Received",
      `New health diagnostics from ${formData.email}\nCurrent Feeling: ${formData.currentFeeling}\nEnergy Level: ${formData.energyLevel}\nHealth Status: ${formData.healthStatus}`);

    // You can add more specific logic here for health diagnostics

  } catch (error) {
    console.error("Error processing health diagnostics:", error);
    sendNotification("Error", `Error processing health diagnostics: ${error.toString()}`);
  }
};

const processRegistration = (formData) => {
  try {
    console.log(`Processing registration for ${formData.name} (${formData.email})`);

    // Check if user already exists (using your existing logic)
    checkAndInviteUser(formData.name, formData.email);

    // Create a registration entry in Notion
    const registrationPayload = {
      parent: { database_id: DB_ID },
      properties: {
        Title: { title: [{ text: { content: `Registration: ${formData.name}` } }] },
        Text: { rich_text: [{ text: { content: formData.email } }] },
        Type: { select: { name: "Registration" } },
        Phone: { phone_number: formData.phone },
        ServiceType: { rich_text: [{ text: { content: formData.serviceType } }] },
        WorkoutType: { rich_text: [{ text: { content: formData.workoutType } }] },
        StartDate: { date: { start: formData.startDate } }
      }
    };

    // Process the registration
    sendNotification("New Registration",
      `New registration from ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nService: ${formData.serviceType}\nWorkout: ${formData.workoutType}\nStart Date: ${formData.startDate}`);

  } catch (error) {
    console.error("Error processing registration:", error);
    sendNotification("Error", `Error processing registration: ${error.toString()}`);
  }
};

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

const testFormIdentification = () => {
  console.log("Testing form identification system...");

  // Test trainings form data (email in column B, rating in column G)
  const trainingsRow = ['', 'john@example.com', 'Great workout!', 'Squats were hard', 'Burpees', 'No pain', '8'];
  const trainingsFormId = identifyForm(trainingsRow);
  console.log("Trainings form test:", trainingsFormId);

  // Test diagnostics form data (email in column B, health questions in C-H)
  const diagnosticsRow = ['', 'jane@example.com', 'Good', 'High energy', 'Healthy', 'Sleeping well', 'Low stress', 'No issues'];
  const diagnosticsFormId = identifyForm(diagnosticsRow);
  console.log("Diagnostics form test:", diagnosticsFormId);

  // Test registrations form data (name in B, phone in C, email in D)
  const registrationsRow = ['', 'Bob Wilson', '380123456789', 'bob@example.com', '2025-01-15', '3 months', 'Gym Workout'];
  const registrationsFormId = identifyForm(registrationsRow);
  console.log("Registrations form test:", registrationsFormId);

  // Test empty row
  const emptyRow = ['', '', '', '', '', '', '', ''];
  const emptyFormId = identifyForm(emptyRow);
  console.log("Empty row test:", emptyFormId);

  // Test invalid data
  const invalidRow = ['Invalid', 'Data', 'Structure'];
  const invalidFormId = identifyForm(invalidRow);
  console.log("Invalid row test:", invalidFormId);

  console.log("Form identification test completed.");
};

const testFormDataExtraction = () => {
  console.log("Testing form data extraction...");

  const trainingsRow = ['', 'john@example.com', 'Great workout!', 'Squats were hard', 'Burpees', 'No pain', '8'];
  const trainingsData = getFormData(trainingsRow, 'trainings');
  console.log("Trainings form data:", trainingsData);

  const diagnosticsRow = ['', 'jane@example.com', 'Good', 'High energy', 'Healthy', 'Sleeping well', 'Low stress', 'No issues'];
  const diagnosticsData = getFormData(diagnosticsRow, 'diagnostics');
  console.log("Diagnostics form data:", diagnosticsData);

  const registrationsRow = ['', 'Bob Wilson', '380123456789', 'bob@example.com', '2025-01-15', '3 months', 'Gym Workout'];
  const registrationsData = getFormData(registrationsRow, 'registrations');
  console.log("Registrations form data:", registrationsData);

  console.log("Form data extraction test completed.");
};