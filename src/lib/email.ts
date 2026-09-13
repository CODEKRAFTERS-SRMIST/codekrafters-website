import { Resend } from "resend";
import {
  DEFAULT_SUPPORT_EMAIL,
  generateShortlistEmailHtml,
  generateTasksLiveEmailHtml,
  generateApplicationReceivedEmailHtml,
  generateTaskSubmissionEmailHtml,
  generateFinalSelectionEmailHtml,
  generateCustomBroadcastEmailHtml,
  ShortlistEmailProps,
  TasksLiveEmailProps,
  ApplicationReceivedEmailProps,
  TaskSubmissionEmailProps,
  FinalSelectionEmailProps,
  CustomBroadcastEmailProps,
} from "./email-templates";

const resendApiKey = process.env.RESEND_API_KEY;
export const resend = resendApiKey ? new Resend(resendApiKey) : null;

export const SENDER_EMAIL = process.env.RESEND_FROM_EMAIL || `CodeKrafters <${DEFAULT_SUPPORT_EMAIL}>`;
export const REPLY_TO_EMAIL = DEFAULT_SUPPORT_EMAIL;

export interface SendEmailPayload {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  simulated?: boolean;
}

/**
 * Core email sender function using Resend
 * Supports graceful debug simulation if RESEND_API_KEY is not configured yet.
 */
export async function sendEmail({
  to,
  subject,
  html,
  replyTo = REPLY_TO_EMAIL,
}: SendEmailPayload): Promise<SendEmailResult> {
  const recipients = Array.isArray(to) ? to : [to];

  if (!resendApiKey || !resend) {
    console.info(
      `[Resend Debug Mode - No RESEND_API_KEY set] Simulated sending email:\n` +
      `  From: ${SENDER_EMAIL}\n` +
      `  To: ${recipients.join(", ")}\n` +
      `  Subject: ${subject}`
    );
    return {
      success: true,
      simulated: true,
      messageId: `simulated_${Date.now()}`,
    };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: SENDER_EMAIL,
      to: recipients,
      replyTo: replyTo,
      subject: subject,
      html: html,
    });

    if (error) {
      console.error("[Resend Error]:", error);
      return {
        success: false,
        error: error.message || "Failed to send email via Resend",
      };
    }

    return {
      success: true,
      messageId: data?.id,
    };
  } catch (err: any) {
    console.error("[Resend Exception]:", err);
    return {
      success: false,
      error: err.message || "An unexpected error occurred sending email",
    };
  }
}

/**
 * Send Shortlist & Interview Email to candidate
 */
export async function sendShortlistEmail(
  to: string,
  props: ShortlistEmailProps
): Promise<SendEmailResult> {
  const { subject, html } = generateShortlistEmailHtml(props);
  return sendEmail({ to, subject, html });
}

/**
 * Send Tasks Live Announcement Email to candidate
 */
export async function sendTasksLiveEmail(
  to: string,
  props: TasksLiveEmailProps
): Promise<SendEmailResult> {
  const { subject, html } = generateTasksLiveEmailHtml(props);
  return sendEmail({ to, subject, html });
}

/**
 * Send Application Received Confirmation
 */
export async function sendApplicationReceivedEmail(
  to: string,
  props: ApplicationReceivedEmailProps
): Promise<SendEmailResult> {
  const { subject, html } = generateApplicationReceivedEmailHtml(props);
  return sendEmail({ to, subject, html });
}

/**
 * Send Task Submission Confirmation
 */
export async function sendTaskSubmissionEmail(
  to: string,
  props: TaskSubmissionEmailProps
): Promise<SendEmailResult> {
  const { subject, html } = generateTaskSubmissionEmailHtml(props);
  return sendEmail({ to, subject, html });
}

/**
 * Send Final Selection / Offer
 */
export async function sendFinalSelectionEmail(
  to: string,
  props: FinalSelectionEmailProps
): Promise<SendEmailResult> {
  const { subject, html } = generateFinalSelectionEmailHtml(props);
  return sendEmail({ to, subject, html });
}

/**
 * Send Custom Announcement
 */
export async function sendCustomBroadcastEmail(
  to: string | string[],
  props: CustomBroadcastEmailProps
): Promise<SendEmailResult> {
  const { subject, html } = generateCustomBroadcastEmailHtml(props);
  return sendEmail({ to, subject, html });
}
