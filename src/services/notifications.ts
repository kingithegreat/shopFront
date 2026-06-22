/**
 * Placeholder for future notification integrations (e.g. Twilio, SendGrid)
 */

export async function sendEmailNotification(to: string, subject: string, templateId: string, payload: any) {
  console.log(`[Email Mock] Sending email to ${to} - Subject: ${subject}`);
  return { success: true };
}

export async function sendSMSNotification(phone: string, message: string) {
  console.log(`[SMS Mock] Sending SMS to ${phone} - Message: ${message}`);
  return { success: true };
}
