class NotificationService {
  constructor() {
    if (NotificationService.instance) {
      return NotificationService.instance;
    }

    this.companyEmail = PropertiesService.getScriptProperties().getProperty('COMPANY_EMAIL');
    NotificationService.instance = this;
  }

  sendEmail(title, message, to = this.companyEmail, options = {}) {
    try {
      if (!GmailApp) {
        throw Error("GmailApp not available");
      }

      // If sending to admin (default), add prefix to title
      const emailTitle = to === this.companyEmail
        ? `Notion User Management - ${title}`
        : title;

      GmailApp.sendEmail(to, emailTitle, message, options);
      console.log(`Email sent successfully to ${to}`);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }

  // Static method to get the singleton instance
  static getInstance() {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Method to reset instance (useful for testing)
  static resetInstance() {
    NotificationService.instance = null;
  }
}

// Create the singleton instance
const notificationService = NotificationService.getInstance();
