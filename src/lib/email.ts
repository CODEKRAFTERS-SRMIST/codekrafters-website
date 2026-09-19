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

export interface BatchEmailItem {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

export interface BatchSendResult {
  success: boolean;
  totalSent: number;
  totalFailed: number;
  errors?: string[];
  simulated?: boolean;
}

/**
 * High-performance batch email sender using Resend Batch API (up to 100 per request)
 * Chunks payloads into groups of 50 to ensure safe payload size and zero rate-limit drops.
 */
export async function sendBatchEmails(
  items: BatchEmailItem[],
  chunkSize = 50
): Promise<BatchSendResult> {
  if (!items || items.length === 0) {
    return { success: true, totalSent: 0, totalFailed: 0 };
  }

  if (!resendApiKey || !resend) {
    console.info(
      `[Resend Debug Mode] Simulated sending batch of ${items.length} emails.`
    );
    return {
      success: true,
      simulated: true,
      totalSent: items.length,
      totalFailed: 0,
    };
  }

  let totalSent = 0;
  let totalFailed = 0;
  const errors: string[] = [];

  // Split into chunks
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    const payload = chunk.map((item) => ({
      from: SENDER_EMAIL,
      to: Array.isArray(item.to) ? item.to : [item.to],
      replyTo: item.replyTo || REPLY_TO_EMAIL,
      subject: item.subject,
      html: item.html,
    }));

    try {
      const { data, error } = await resend.batch.send(payload);

      if (error) {
        console.error(`[Resend Batch Error chunk ${i / chunkSize + 1}]:`, error);
        totalFailed += chunk.length;
        errors.push(error.message || "Batch send failed");
      } else {
        const sentInChunk = data?.data?.length || chunk.length;
        totalSent += sentInChunk;
      }
    } catch (err: any) {
      console.error(`[Resend Batch Exception chunk ${i / chunkSize + 1}]:`, err);
      totalFailed += chunk.length;
      errors.push(err.message || "Batch exception occurred");
    }

    // Small delay between chunks to avoid bursting rate limits
    if (i + chunkSize < items.length) {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }

  return {
    success: totalFailed === 0,
    totalSent,
    totalFailed,
    errors: errors.length > 0 ? errors : undefined,
  };
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

