// Common constants
const COMPANY_EMAIL = PropertiesService.getScriptProperties().getProperty('COMPANY_EMAIL');
const ERROR_EMAIL = PropertiesService.getScriptProperties().getProperty('ERROR_EMAIL');

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
    data.feelingAfter = getFieldValue('Як ти почувалась після тренувань?');
    data.hardestPart = getFieldValue('Що було найважче?');
    data.dislikedExercises = getFieldValue('Які вправи не сподобались взагалі?');
    data.painAfter = getFieldValue('Щось боліло/тягнуло після тренувань?');
    data.wellBeingRating = getFieldValue('Загальна оцінка самопочуття (від 1 до 10)');
  }

  if (formId === FORM_TYPE.DIAGNOSTIC) {
    data.currentFeeling = getFieldValue('Як ви зараз себе почуваєте?');
    data.energyLevel = getFieldValue('Скільки у вас енергії та чи взагалі є єнергі:');
    data.healthStatus = getFieldValue('Який наразі ваш стан здоров\'я? Які є хвор');
    data.sleepQuality = getFieldValue('Як спите? Який ваш сон?');
    data.stressLevel = getFieldValue('Маєте стреси в житті? Які с');
    data.additionalInfo = getFieldValue('Яка в тебе a');
  }

  if (formId === FORM_TYPE.REGISTRATION) {
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
    notificationService.sendEmail("Empty Form Submission",
      `Form '${formId}' submitted with no data at ${logMessage.timestamp}`, ERROR_EMAIL);
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

    notificationService.sendEmail("Training Feedback Received",
      `New training feedback from ${formData.email}`);
    telegramService.sendFormNotification(FORM_TYPE.TRAINING, formData);
  } catch (error) {
    console.error("Error processing feedback:", error);
    notificationService.sendEmail("Error", `Error processing feedback: ${error.toString()}`, ERROR_EMAIL);
  }
};

const processHealthDiagnostics = (formData) => {
  try {
    console.log(`Processing health diagnostics from ${formData.email}`);

    notificationService.sendEmail("Health Diagnostics Received",
      `New health diagnostics from ${formData.email}`);
    telegramService.sendFormNotification(FORM_TYPE.DIAGNOSTIC, formData);
  } catch (error) {
    console.error("Error processing health diagnostics:", error);
    notificationService.sendEmail("Error", `Error processing health diagnostics: ${error.toString()}`, ERROR_EMAIL);
  }
};

const processRegistration = (formData) => {
  try {
    const { name, email, phone, serviceType, workoutType, startDate } = formData;
    console.log(`Processing registration for ${name} (${email})`);
    checkAndInviteUser(name, email);
    notificationService.sendEmail("New Registration",
      `New registration from ${name}\nEmail: ${email}\nPhone: ${phone}\nService: ${serviceType}\nWorkout: ${workoutType}\nStart Date: ${startDate}`);
    telegramService.sendFormNotification(FORM_TYPE.REGISTRATION, formData);

  } catch (error) {
    console.error("Error processing registration:", error);
    notificationService.sendEmail("Error", `Error processing registration: ${error.toString()}`, ERROR_EMAIL);
  }
};

async function checkAndInviteUser(name, email) {
  try {
    const result = await notionService.checkAndInviteUser(name, email);

    if (result.exists) {
      notificationService.sendEmail("User already exists", result.message, ERROR_EMAIL);
      return;
    }

    if (result.created) {
      notificationService.sendEmail("Success", result.message);
    } else {
      notificationService.sendEmail("Error", result.message, ERROR_EMAIL);
    }

  } catch (error) {
    console.error("Error checking user:", error);
    notificationService.sendEmail("Error", `Error checking user: ${error.toString()}`, ERROR_EMAIL);
  }
}

function sendNotionInvite(email, name) {
  try {
    const subject = "Welcome! Your Notion Access is Ready";
    const message = `
Hello ${name}!

Welcome to our platform! Your account has been created successfully.

🔗 **Access Your Dashboard:**
${notionService.getNotionShareLink()}

�� **What you can do:**
• View your personal dashboard
• Track your progress
• Access your documents and resources

If you have any questions or need assistance, please don't hesitate to reach out.

Best regards,
Nataly Oren

---
This is an automated message. Please do not reply to this email.
    `.trim();

    notificationService.sendEmail(subject, message, email, {
      name: "Nataly Oren",
      replyTo: COMPANY_EMAIL
    });

    notificationService.sendEmail("Invitation Sent",
      `Invitation email sent to ${name} (${email}) with Notion access link.`);

    return true;
  } catch (error) {
    console.error("Error in sendNotionInvite:", error);
    notificationService.sendEmail("Error", `Error in invite process: ${error.toString()}`, ERROR_EMAIL);
    return false;
  }
}
