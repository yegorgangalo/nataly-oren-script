class TelegramService {
  constructor() {
    if (TelegramService.instance) {
      return TelegramService.instance;
    }

    this.botToken = PropertiesService.getScriptProperties().getProperty('TELEGRAM_BOT_TOKEN');
    this.chatId = PropertiesService.getScriptProperties().getProperty('TELEGRAM_CHAT_ID');
    this.apiUrl = `https://api.telegram.org/bot${this.botToken}`;
    TelegramService.instance = this;
  }

  sendMessage(message, parseMode = 'HTML') {
    try {
      if (!this.botToken || !this.chatId) {
        console.log("Telegram configuration missing - skipping Telegram notification");
        return false;
      }

      const url = `${this.apiUrl}/sendMessage`;
      const payload = {
        chat_id: this.chatId,
        text: message,
        parse_mode: parseMode
      };

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        payload: JSON.stringify(payload)
      };

      const response = UrlFetchApp.fetch(url, options);
      const responseData = JSON.parse(response.getContentText());

      if (responseData.ok) {
        console.log("Telegram message sent successfully");
        return true;
      } else {
        console.error("Telegram API error:", responseData.description);
        return false;
      }
    } catch (error) {
      console.error("Error sending Telegram message:", error);
      return false;
    }
  }

  sendFormNotification(formType, formData) {
    const timestamp = new Date().toLocaleString('uk-UA');
    let message = `<b>📋 New ${formType} Form Submission</b>\n`;
    message += `⏰ <i>${timestamp}</i>\n\n`;

    if (formData.email) {
      message += `📧 <b>Email:</b> ${formData.email}\n`;
    }

    if (formData.name) {
      message += `👤 <b>Name:</b> ${formData.name}\n`;
    }

    if (formData.phone) {
      message += `📞 <b>Phone:</b> ${formData.phone}\n`;
    }

    if (formType === 'Training') {
      message += `\n🏃‍♀️ <b>Training Feedback:</b>\n`;
      if (formData.feelingAfter) message += `• Feeling: ${formData.feelingAfter}\n`;
      if (formData.wellBeingRating) message += `• Rating: ${formData.wellBeingRating}/10\n`;
      if (formData.hardestPart) message += `• Hardest part: ${formData.hardestPart}\n`;
    }

    if (formType === 'Diagnostic') {
      message += `\n🏥 <b>Health Diagnostics:</b>\n`;
      if (formData.currentFeeling) message += `• Current feeling: ${formData.currentFeeling}\n`;
      if (formData.energyLevel) message += `• Energy level: ${formData.energyLevel}\n`;
      if (formData.healthStatus) message += `• Health status: ${formData.healthStatus}\n`;
    }

    if (formType === 'Registration') {
      message += `\n📝 <b>Registration Details:</b>\n`;
      if (formData.serviceType) message += `• Service: ${formData.serviceType}\n`;
      if (formData.workoutType) message += `• Workout type: ${formData.workoutType}\n`;
      if (formData.startDate) message += `• Start date: ${formData.startDate}\n`;
    }

    return this.sendMessage(message);
  }

  sendErrorNotification(error, context = '') {
    const timestamp = new Date().toLocaleString('uk-UA');
    let message = `<b>❌ Error Notification</b>\n`;
    message += `⏰ <i>${timestamp}</i>\n\n`;

    if (context) {
      message += `📍 <b>Context:</b> ${context}\n`;
    }

    message += `🔍 <b>Error:</b> ${error.toString()}`;

    return this.sendMessage(message);
  }

  static getInstance() {
    if (!TelegramService.instance) {
      TelegramService.instance = new TelegramService();
    }
    return TelegramService.instance;
  }

  static resetInstance() {
    TelegramService.instance = null;
  }
}

const telegramService = TelegramService.getInstance();
