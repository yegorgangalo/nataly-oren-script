// Form Configuration for your three forms
const FORM_CONFIGS = {
  trainings: {
    hiddenFieldColumn: 7,  // Column H: Hidden form identifier
    hiddenFieldValue: "trainings",
    nameColumn: null, // No name field in trainings form
    emailColumn: 1,   // Column B: Email address
    feedbackColumn: 2, // Column C: How did you feel after training?
    requiredColumns: [1, 7], // Email and hidden field are required
    description: "Training feedback form",
    templateType: "training_feedback",
    notificationRecipients: ["admin@example.com"]
  },
  diagnostics: {
    hiddenFieldColumn: 8,  // Column I: Hidden form identifier
    hiddenFieldValue: "diagnostics",
    nameColumn: null, // No name field in diagnostics form
    emailColumn: 1,   // Column B: Email address
    healthQuestions: [2, 3, 4, 5, 6, 7], // Columns C through H: Health questions
    requiredColumns: [1, 8], // Email and hidden field are required
    description: "Health diagnostics form",
    templateType: "health_assessment",
    notificationRecipients: ["health@example.com"]
  },
  registrations: {
    hiddenFieldColumn: 7,  // Column H: Hidden form identifier
    hiddenFieldValue: "registrations",
    nameColumn: 1,    // Column B: Name Surname
    phoneColumn: 2,   // Column C: Phone number
    emailColumn: 3,   // Column D: Email address
    startDateColumn: 4, // Column E: Start collaboration date
    serviceTypeColumn: 5, // Column F: Service type (package)
    workoutTypeColumn: 6, // Column G: Workout type
    requiredColumns: [1, 2, 3, 7], // Name, phone, email, and hidden field are required
    description: "Registration form",
    templateType: "registration",
    notificationRecipients: ["registrations@example.com"]
  }
};

// Column mapping for different form types
const COLUMN_MAPPINGS = {
  // Common columns
  timestamp: 0,

  // Trainings form (feedback)
  trainings: {
    email: 1,           // Column B: Email address
    feelingAfter: 2,    // Column C: How did you feel after training?
    hardestPart: 3,     // Column D: What was the hardest part?
    dislikedExercises: 4, // Column E: Which exercises did you not like?
    painAfter: 5,       // Column F: Did anything hurt/pull after training?
    wellBeingRating: 6, // Column G: Overall well-being rating (1-10)
    hiddenField: 7      // Column H: Hidden form identifier
  },

  // Diagnostics form (health assessment)
  diagnostics: {
    email: 1,           // Column B: Email address
    currentFeeling: 2,  // Column C: How do you feel right now?
    energyLevel: 3,     // Column D: How much energy do you have?
    healthStatus: 4,    // Column E: Current state of health/diseases
    sleepQuality: 5,    // Column F: How do you sleep?
    stressLevel: 6,     // Column G: Do you have stress in life?
    additionalInfo: 7,  // Column H: Additional information
    hiddenField: 8      // Column I: Hidden form identifier
  },

  // Registrations form
  registrations: {
    name: 1,            // Column B: Name Surname
    phone: 2,           // Column C: Phone number
    email: 3,           // Column D: Email address
    startDate: 4,       // Column E: Start collaboration date
    serviceType: 5,     // Column F: Service type (package)
    workoutType: 6,     // Column G: Workout type
    hiddenField: 7      // Column H: Hidden form identifier
  }
};

// Validation rules for each form
const VALIDATION_RULES = {
  trainings: {
    required: ['email'],
    emailValidation: true,
    ratingValidation: true // Check if rating is between 1-10
  },
  diagnostics: {
    required: ['email'],
    emailValidation: true,
    healthDataValidation: true
  },
  registrations: {
    required: ['name', 'phone', 'email'],
    emailValidation: true,
    phoneValidation: true,
    minNameLength: 2
  }
};

const getColumnIndex = (formId, fieldName) => {
  if (COLUMN_MAPPINGS[formId] && COLUMN_MAPPINGS[formId][fieldName] !== undefined) {
    return COLUMN_MAPPINGS[formId][fieldName];
  }
  return COLUMN_MAPPINGS[fieldName] || null;
};

const validateFormData = (formId, data) => {
  const rules = VALIDATION_RULES[formId];
  if (!rules) return { isValid: false, errors: ['Unknown form type'] };

  const errors = [];

  // Check required fields
  for (const field of rules.required) {
    if (!data[field] || data[field].toString().trim() === '') {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Email validation
  if (rules.emailValidation && data.email) {
    if (!isValidEmail(data.email)) {
      errors.push('Invalid email format');
    }
  }

  // Phone validation for registrations
  if (rules.phoneValidation && data.phone) {
    if (!isValidPhone(data.phone)) {
      errors.push('Invalid phone number format');
    }
  }

  // Rating validation for trainings
  if (rules.ratingValidation && data.wellBeingRating) {
    const rating = parseInt(data.wellBeingRating);
    if (isNaN(rating) || rating < 1 || rating > 10) {
      errors.push('Rating must be between 1 and 10');
    }
  }

  // Name length validation
  if (rules.minNameLength && data.name && data.name.length < rules.minNameLength) {
    errors.push(`Name must be at least ${rules.minNameLength} characters`);
  }

  return {
    isValid: errors.length === 0,
    errors: errors
  };
};

const isValidPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  // Basic phone validation - adjust for your phone number format
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone.trim()) && phone.trim().length >= 10;
};