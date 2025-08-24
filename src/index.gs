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
  console.log("Event namedValues:", e.namedValues);
  const formId = identifyForm(e.namedValues);

  console.log("Form submission detected:", formId);

  if (!formId) {
    console.log("Unknown form or no data received");
    return;
  }

  const handleMap = {
    [FORM_TYPE.TRAINING]: handleTrainingsForm,
    [FORM_TYPE.DIAGNOSTIC]: handleDiagnosticsForm,
    [FORM_TYPE.REGISTRATION]: handleRegistrationsForm,
  }

  const formHandler = handleMap[formId]

  if (typeof formHandler !== "function") {
    console.log("Unhandled form type:", formId);
    return
  }

  formHandler(e.namedValues)
}

const identifyForm = (namedValues) => {
  if (!namedValues) return null;
  for (const formType of Object.values(FORM_TYPE)) {
    if (formType in namedValues) {
      return formType;
    }
  }
  return null;
}



const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

const getFormData = (namedValues, formId) => {
  // Helper function to safely get field value
  const getFieldValue = (fieldName) => namedValues[fieldName]?.[0]?.toString().trim() || '';

  const email = getFieldValue('Електронна адреса');

  if (!isValidEmail(email)) {
    console.log("Invalid email:", email);
    return null;
  }

  const data = {
    formId,
    email,
    timestamp: new Date().toISOString(),
  };

  if (formId === FORM_TYPE.TRAINING) {
    // Training form specific fields
    data.feelingAfter = getFieldValue('Як ти почувалась після тренувань?');
    data.hardestPart = getFieldValue('Що було найважче?');
    data.dislikedExercises = getFieldValue('Які вправи не сподобались взагалі?');
    data.painAfter = getFieldValue('Щось боліло/тягнуло після тренувань?');
    data.wellBeingRating = getFieldValue('Загальна оцінка самопочуття (від 1 до 10)');
  }

  if (formId === FORM_TYPE.DIAGNOSTIC) {
    // Diagnostic form specific fields
    data.currentFeeling = getFieldValue('Як ви зараз себе почуваєте?');
    data.energyLevel = getFieldValue('Скільки у вас енергії та чи взагалі є єнергі:');
    data.healthStatus = getFieldValue('Який наразі ваш стан здоров\'я? Які є хвор');
    data.sleepQuality = getFieldValue('Як спите? Який ваш сон?');
    data.stressLevel = getFieldValue('Маєте стреси в житті? Які с');
    data.additionalInfo = getFieldValue('Яка в тебе a');
  }

  if (formId === FORM_TYPE.REGISTRATION) {
    // Registration form specific fields
    data.name = getFieldValue('Name Surname (Ім\'я Прізвище)');
    data.phone = getFieldValue('Phone number (номер телефону)');
    data.startDate = getFieldValue('Start colaboration (початок співпраці )');
    data.serviceType = getFieldValue('Service type (пакет послуг)');
    data.workoutType = getFieldValue('Workout type (Тип тренувань)');
  }

  return data;
}

const logFormSubmission = (formId, data) => {
  const logMessage = {
    timestamp: new Date().toISOString(),
    formId,
    data,
    rowLength: Object.keys(data ?? {}).length
  };

  console.log("Form submission log:", JSON.stringify(logMessage, null, 2));

  if (!data) {
    sendNotification("Empty Form Submission",
      `Form '${formId}' submitted with no data at ${logMessage.timestamp}`);
  }
}

const handleTrainingsForm = (row) => {
  const formData = getFormData(row, FORM_TYPE.TRAINING);

  logFormSubmission(FORM_TYPE.TRAINING, formData);

  if (!formData) {
    console.log("Trainings form received no data");
    return;
  }

  console.log("Processing trainings feedback form for:", formData.email);
  processTrainingFeedback(formData);
}

const handleDiagnosticsForm = (row) => {
  const formData = getFormData(row, FORM_TYPE.DIAGNOSTIC);

  logFormSubmission(FORM_TYPE.DIAGNOSTIC, formData);

  if (!formData) {
    console.log("Diagnostics form received no data");
    return;
  }

  console.log("Processing diagnostics form for:", formData.email);
  processHealthDiagnostics(formData);
}

const handleRegistrationsForm = (row) => {
  const formData = getFormData(row, FORM_TYPE.REGISTRATION);

  logFormSubmission(FORM_TYPE.REGISTRATION, formData);

  if (!formData) {
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
    checkAndInviteUser(formData.name, formData.email);
    sendNotification("New Registration",
      `New registration from ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nService: ${formData.serviceType}\nWorkout: ${formData.workoutType}\nStart Date: ${formData.startDate}`);

  } catch (error) {
    console.error("Error processing registration:", error);
    sendNotification("Error", `Error processing registration: ${error.toString()}`);
  }
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

    if (searchResult.results?.length > 0) {
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
      // Create a registration entry in Notion
      // const registrationPayload = {
      //   parent: { database_id: DB_ID },
      //   properties: {
      //     Title: { title: [{ text: { content: `Registration: ${formData.name}` } }] },
      //     Text: { rich_text: [{ text: { content: formData.email } }] },
      //     Type: { select: { name: "Registration" } },
      //     Phone: { phone_number: formData.phone },
      //     ServiceType: { rich_text: [{ text: { content: formData.serviceType } }] },
      //     WorkoutType: { rich_text: [{ text: { content: formData.workoutType } }] },
      //     StartDate: { date: { start: formData.startDate } }
      //   }
      // };

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
