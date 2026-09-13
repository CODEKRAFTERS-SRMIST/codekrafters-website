export interface BaseTemplateProps {
  previewText?: string;
  supportEmail?: string;
}

export interface ShortlistEmailProps extends BaseTemplateProps {
  candidateName: string;
  domainName: string;
  subject?: string;
  customMessage?: string;
  interviewDate?: string;
  interviewTime?: string;
  meetingLink?: string;
  venue?: string;
}

export interface TasksLiveEmailProps extends BaseTemplateProps {
  candidateName: string;
  domains: string[];
  deadline?: string;
  portalUrl?: string;
  customMessage?: string;
}

export interface ApplicationReceivedEmailProps extends BaseTemplateProps {
  candidateName: string;
  domains: string[];
  portalUrl?: string;
}

export interface TaskSubmissionEmailProps extends BaseTemplateProps {
  candidateName: string;
  domainName?: string;
  submissionUrl: string;
}

export interface FinalSelectionEmailProps extends BaseTemplateProps {
  candidateName: string;
  domainName: string;
  customMessage?: string;
  onboardingLink?: string;
}

export interface CustomBroadcastEmailProps extends BaseTemplateProps {
  candidateName?: string;
  title: string;
  message: string;
  actionText?: string;
  actionUrl?: string;
}

export const DEFAULT_SUPPORT_EMAIL = "support@codekraftersrmp.in";
export const DEFAULT_PORTAL_URL = "https://codekrafters.in/profile";

/**
 * Escapes HTML characters to prevent HTML injection in email clients
 */
export function escapeHtml(unsafe?: string | null): string {
  if (!unsafe) return "";
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Validates and sanitizes URLs to ensure only safe http/https links are rendered
 */
export function sanitizeUrl(url?: string | null, fallback = DEFAULT_PORTAL_URL): string {
  if (!url) return fallback;
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed) || /^mailto:/i.test(trimmed)) {
    return escapeHtml(trimmed);
  }
  return fallback;
}

/**
 * Base email layout with neo-brutalist CodeKrafters styling
 */
export function renderBaseEmailLayout({
  title,
  previewText,
  content,
  supportEmail = DEFAULT_SUPPORT_EMAIL,
}: {
  title: string;
  previewText?: string;
  content: string;
  supportEmail?: string;
}): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f2de;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #0D0D0D;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #f4f2de;
      padding: 30px 15px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #FFFDF5;
      border: 3px solid #0D0D0D;
      border-radius: 20px;
      box-shadow: 6px 6px 0px #0D0D0D;
      overflow: hidden;
    }
    .header {
      background-color: #0D0D0D;
      padding: 24px 30px;
      text-align: left;
      border-bottom: 3px solid #F2A516;
    }
    .logo-text {
      font-size: 22px;
      font-weight: 900;
      letter-spacing: -0.5px;
      text-transform: uppercase;
      margin: 0;
    }
    .logo-white { color: #FFFFFF; }
    .logo-yellow { color: #F2A516; }
    .badge {
      display: inline-block;
      background-color: #F2A516;
      color: #0D0D0D;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      padding: 3px 8px;
      border-radius: 6px;
      margin-top: 6px;
      letter-spacing: 0.5px;
    }
    .body {
      padding: 30px 30px 20px 30px;
    }
    h1 {
      font-size: 24px;
      font-weight: 900;
      color: #0D0D0D;
      margin-top: 0;
      margin-bottom: 16px;
      line-height: 1.2;
      text-transform: uppercase;
    }
    p {
      font-size: 15px;
      line-height: 1.6;
      color: #222222;
      margin: 0 0 16px 0;
    }
    .callout {
      background-color: #FFF2C6;
      border: 2px solid #0D0D0D;
      border-radius: 12px;
      padding: 16px 20px;
      margin: 20px 0;
      box-shadow: 3px 3px 0px #0D0D0D;
    }
    .callout-title {
      font-size: 13px;
      font-weight: 900;
      text-transform: uppercase;
      color: #0D0D0D;
      margin-bottom: 6px;
    }
    .button-container {
      text-align: center;
      margin: 28px 0;
    }
    .button {
      display: inline-block;
      background-color: #F2A516;
      color: #0D0D0D !important;
      font-size: 15px;
      font-weight: 900;
      text-decoration: none;
      text-transform: uppercase;
      padding: 14px 28px;
      border: 2px solid #0D0D0D;
      border-radius: 12px;
      box-shadow: 4px 4px 0px #0D0D0D;
      letter-spacing: 0.5px;
    }
    .details-table {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
    }
    .details-table td {
      padding: 8px 12px;
      border-bottom: 1px solid rgba(13, 13, 13, 0.1);
      font-size: 14px;
    }
    .details-table td.label {
      font-weight: 800;
      color: #0D0D0D;
      width: 35%;
      text-transform: uppercase;
      font-size: 12px;
    }
    .footer {
      background-color: #0D0D0D;
      color: #FFEFB4;
      padding: 24px 30px;
      font-size: 12px;
      line-height: 1.6;
      text-align: center;
      border-top: 2px solid #0D0D0D;
    }
    .footer a {
      color: #F2A516;
      text-decoration: underline;
      font-weight: bold;
    }
  </style>
</head>
<body>
  ${previewText ? `<div style="display:none;font-size:1px;color:#333;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${previewText}</div>` : ""}
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h2 class="logo-text">
          <span class="logo-white">Code</span><span class="logo-yellow">Krafters</span>
        </h2>
        <span class="badge">SRM Ramapuram • Recruitment 2026</span>
      </div>

      <div class="body">
        ${content}
      </div>

      <div class="footer">
        <p style="color: #FFEFB4; margin-bottom: 8px; font-weight: bold;">
          CodeKrafters — Tech & Innovation Community
        </p>
        <p style="color: rgba(255, 239, 180, 0.7); margin-bottom: 12px; font-size: 11px;">
          SRM Institute of Science & Technology, Ramapuram, Chennai 600089
        </p>
        <p style="color: rgba(255, 239, 180, 0.9); margin-bottom: 0;">
          Need help or have questions? Email us directly at <a href="mailto:${supportEmail}">${supportEmail}</a>
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * 1. Shortlist & Interview Invitation Email Template
 */
export function generateShortlistEmailHtml(props: ShortlistEmailProps): { subject: string; html: string } {
  const safeCandidateName = escapeHtml(props.candidateName);
  const safeDomainName = escapeHtml(props.domainName);
  const subject = props.subject || `Congratulations! You're Shortlisted for CodeKrafters (${props.domainName})`;
  const safeMeetingLink = props.meetingLink ? sanitizeUrl(props.meetingLink) : undefined;
  
  const content = `
    <h1>You're Shortlisted! 🎉</h1>
    <p>Hi <strong>${safeCandidateName}</strong>,</p>
    <p>Great news! Following the evaluation of your recruitment application and domain challenge for <strong>${safeDomainName}</strong>, we are thrilled to inform you that you have been <strong>Shortlisted</strong> for the interview round!</p>

    ${props.customMessage ? `
      <div class="callout">
        <div class="callout-title">Note from the Domain Leads:</div>
        <p style="margin-bottom: 0; white-space: pre-line;">${escapeHtml(props.customMessage)}</p>
      </div>
    ` : ""}

    ${(props.interviewDate || props.interviewTime || safeMeetingLink || props.venue) ? `
      <div class="callout" style="background-color: #FFFDF5;">
        <div class="callout-title" style="color: #0D0D0D; border-bottom: 2px solid #F2A516; padding-bottom: 4px; margin-bottom: 10px;">
          📅 Interview Schedule Details
        </div>
        <table class="details-table">
          ${props.domainName ? `<tr><td class="label">Domain</td><td><strong>${safeDomainName}</strong></td></tr>` : ""}
          ${props.interviewDate ? `<tr><td class="label">Date</td><td>${escapeHtml(props.interviewDate)}</td></tr>` : ""}
          ${props.interviewTime ? `<tr><td class="label">Time</td><td>${escapeHtml(props.interviewTime)}</td></tr>` : ""}
          ${props.venue ? `<tr><td class="label">Venue / Mode</td><td>${escapeHtml(props.venue)}</td></tr>` : ""}
          ${safeMeetingLink ? `<tr><td class="label">Meeting Link</td><td><a href="${safeMeetingLink}" target="_blank" style="color: #0D0D0D; font-weight: bold; text-decoration: underline;">Join Online Call</a></td></tr>` : ""}
        </table>
      </div>
    ` : ""}

    ${safeMeetingLink ? `
      <div class="button-container">
        <a href="${safeMeetingLink}" class="button" target="_blank">Join Interview Call ➔</a>
      </div>
    ` : `
      <div class="button-container">
        <a href="${DEFAULT_PORTAL_URL}" class="button" target="_blank">View Status in Portal ➔</a>
      </div>
    `}

    <p style="font-size: 13px; color: #555555;">
      <strong>Tip for the interview:</strong> Be ready to briefly walk through your submitted task repo/Figma files, your problem-solving process, and what drives your passion for tech.
    </p>

    <p style="margin-top: 24px;">Best regards,<br><strong>The CodeKrafters Team</strong></p>
  `;

  return {
    subject,
    html: renderBaseEmailLayout({
      title: subject,
      previewText: `Congratulations ${safeCandidateName}! You've been shortlisted for CodeKrafters recruitment interview.`,
      content,
      supportEmail: props.supportEmail,
    }),
  };
}

/**
 * 2. Tasks Are Live Announcement Email Template
 */
export function generateTasksLiveEmailHtml(props: TasksLiveEmailProps): { subject: string; html: string } {
  const safeCandidateName = escapeHtml(props.candidateName);
  const subject = "🚀 CodeKrafters Recruitment: Domain Tasks are Now LIVE!";
  const deadline = escapeHtml(props.deadline || "24 September (11:59 PM)");
  const domainsList = props.domains && props.domains.length > 0 
    ? props.domains.map(d => escapeHtml(d)).join(", ") 
    : "your applied domain";
  const portalUrl = sanitizeUrl(props.portalUrl, DEFAULT_PORTAL_URL);

  const content = `
    <h1>Domain Tasks Are Now Live! 🚀</h1>
    <p>Hi <strong>${safeCandidateName}</strong>,</p>
    <p>The recruitment challenge for CodeKrafters is officially underway! The problem statements and task requirements for <strong>${domainsList}</strong> have just been unlocked on the portal.</p>

    <div class="callout">
      <div class="callout-title">⏰ Submission Deadline</div>
      <p style="font-weight: 800; font-size: 16px; color: #0D0D0D; margin-bottom: 4px;">
        ${deadline}
      </p>
      <p style="font-size: 13px; color: #444444; margin-bottom: 0;">
        Make sure to complete and submit your GitHub repositories, live demo links, Figma files, or documentation before the deadline.
      </p>
    </div>

    ${props.customMessage ? `
      <div class="callout" style="background-color: #FFFDF5;">
        <div class="callout-title">Important Instructions:</div>
        <p style="margin-bottom: 0; white-space: pre-line;">${escapeHtml(props.customMessage)}</p>
      </div>
    ` : ""}

    <div class="button-container">
      <a href="${portalUrl}" class="button" target="_blank">Access Your Domain Tasks ➔</a>
    </div>

    <div style="background-color: #FFFDF5; border: 2px dashed #0D0D0D; border-radius: 12px; padding: 16px; margin-top: 20px;">
      <h4 style="margin: 0 0 8px 0; font-size: 13px; text-transform: uppercase; font-weight: 900;">📋 Quick Submission Guidelines:</h4>
      <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #333333; line-height: 1.6;">
        <li>Follow the domain guidelines and deliverables outlined in your task briefing.</li>
        <li>For coding tracks, ensure your repository is <strong>public</strong> and includes a comprehensive <code>README.md</code>.</li>
        <li>Submit your project link directly via your candidate dashboard.</li>
      </ul>
    </div>

    <p style="margin-top: 24px;">Good luck crafting your solutions!<br><strong>The CodeKrafters Team</strong></p>
  `;

  return {
    subject,
    html: renderBaseEmailLayout({
      title: subject,
      previewText: `CodeKrafters Domain Tasks are now LIVE! Access your challenges and view submission guidelines.`,
      content,
      supportEmail: props.supportEmail,
    }),
  };
}

/**
 * 3. Application Received Confirmation Template
 */
export function generateApplicationReceivedEmailHtml(props: ApplicationReceivedEmailProps): { subject: string; html: string } {
  const safeCandidateName = escapeHtml(props.candidateName);
  const subject = "Application Received — Welcome to CodeKrafters Recruitment!";
  const portalUrl = sanitizeUrl(props.portalUrl, DEFAULT_PORTAL_URL);
  const domainsText = props.domains?.map(d => escapeHtml(d)).join(", ") || "Technical / Non-Technical";

  const content = `
    <h1>Application Received! 📝</h1>
    <p>Hi <strong>${safeCandidateName}</strong>,</p>
    <p>Thank you for applying to join <strong>CodeKrafters</strong> for the upcoming term! We have successfully registered your application for the following domain(s):</p>

    <div class="callout">
      <div class="callout-title">Applied Domain(s):</div>
      <p style="font-weight: 800; font-size: 15px; margin-bottom: 0;">${domainsText}</p>
    </div>

    <p>Here is what happens next in the recruitment timeline:</p>
    <ol style="font-size: 14px; line-height: 1.7; color: #222222; padding-left: 20px;">
      <li><strong>Round 1 Tasks:</strong> When tasks go live, you will be notified and can view your problem statements on the candidate portal.</li>
      <li><strong>Task Submission:</strong> You'll build and submit your domain challenge solutions.</li>
      <li><strong>Shortlist & Interviews:</strong> Top applicants will be invited for interview rounds.</li>
    </ol>

    <div class="button-container">
      <a href="${portalUrl}" class="button" target="_blank">View Your Candidate Portal ➔</a>
    </div>

    <p style="margin-top: 24px;">Stay tuned and happy coding!<br><strong>The CodeKrafters Team</strong></p>
  `;

  return {
    subject,
    html: renderBaseEmailLayout({
      title: subject,
      previewText: `Your CodeKrafters application has been received. Track your progress on the candidate portal.`,
      content,
      supportEmail: props.supportEmail,
    }),
  };
}

/**
 * 4. Task Submission Confirmation Template
 */
export function generateTaskSubmissionEmailHtml(props: TaskSubmissionEmailProps): { subject: string; html: string } {
  const safeCandidateName = escapeHtml(props.candidateName);
  const safeDomainName = escapeHtml(props.domainName);
  const safeSubmissionUrl = sanitizeUrl(props.submissionUrl, DEFAULT_PORTAL_URL);
  const subject = "Task Submission Received — CodeKrafters Recruitment";

  const content = `
    <h1>Task Submitted Successfully! ✅</h1>
    <p>Hi <strong>${safeCandidateName}</strong>,</p>
    <p>We've received your domain task submission for <strong>${safeDomainName || "CodeKrafters Recruitment"}</strong>.</p>

    <div class="callout">
      <div class="callout-title">Submitted Solution Link:</div>
      <p style="margin-bottom: 0; word-break: break-all; font-family: monospace; font-size: 13px;">
        <a href="${safeSubmissionUrl}" target="_blank" style="color: #0D0D0D; font-weight: bold;">${escapeHtml(props.submissionUrl)}</a>
      </p>
    </div>

    <p>Our domain leads and evaluation panel will review your submission based on creativity, implementation depth, and code quality. Shortlist decisions will be released on the candidate portal soon.</p>

    <div class="button-container">
      <a href="${DEFAULT_PORTAL_URL}" class="button" target="_blank">Track Status in Portal ➔</a>
    </div>

    <p style="margin-top: 24px;">Thank you for your hard work!<br><strong>The CodeKrafters Team</strong></p>
  `;

  return {
    subject,
    html: renderBaseEmailLayout({
      title: subject,
      previewText: `Your task submission has been received and is under review by CodeKrafters domain leads.`,
      content,
      supportEmail: props.supportEmail,
    }),
  };
}

/**
 * 5. Final Selection & Acceptance Offer Template
 */
export function generateFinalSelectionEmailHtml(props: FinalSelectionEmailProps): { subject: string; html: string } {
  const safeCandidateName = escapeHtml(props.candidateName);
  const safeDomainName = escapeHtml(props.domainName);
  const subject = `Welcome to CodeKrafters! Offer of Membership (${props.domainName})`;
  const onboardingLink = sanitizeUrl(props.onboardingLink, DEFAULT_PORTAL_URL);

  const content = `
    <h1>Welcome to the Team! 🎊</h1>
    <p>Dear <strong>${safeCandidateName}</strong>,</p>
    <p>On behalf of the entire executive board and domain leads, we are thrilled to formally offer you a position as a member of <strong>CodeKrafters</strong> in the <strong>${safeDomainName}</strong> domain!</p>

    <div class="callout" style="background-color: #F2A516; color: #0D0D0D;">
      <div class="callout-title" style="color: #0D0D0D;">🌟 You are officially a CodeKrafter!</div>
      <p style="margin-bottom: 0; font-weight: 700;">
        Your technical prowess, passion, and collaborative mindset stood out among hundreds of applicants.
      </p>
    </div>

    ${props.customMessage ? `
      <div class="callout">
        <div class="callout-title">Onboarding Note:</div>
        <p style="margin-bottom: 0; white-space: pre-line;">${escapeHtml(props.customMessage)}</p>
      </div>
    ` : ""}

    <p>Next steps regarding our club orientation, official community onboarding, and upcoming projects will be shared shortly.</p>

    <div class="button-container">
      <a href="${onboardingLink}" class="button" target="_blank">Access Member Dashboard ➔</a>
    </div>

    <p style="margin-top: 24px;">Welcome aboard,<br><strong>Executive Board, CodeKrafters</strong></p>
  `;

  return {
    subject,
    html: renderBaseEmailLayout({
      title: subject,
      previewText: `Congratulations ${safeCandidateName}! Welcome to CodeKrafters as an official member.`,
      content,
      supportEmail: props.supportEmail,
    }),
  };
}

/**
 * 6. Custom Broadcast Announcement Template
 */
export function generateCustomBroadcastEmailHtml(props: CustomBroadcastEmailProps): { subject: string; html: string } {
  const safeCandidateName = props.candidateName ? escapeHtml(props.candidateName) : undefined;
  const safeTitle = escapeHtml(props.title);
  const subject = props.title;
  const actionUrl = sanitizeUrl(props.actionUrl, DEFAULT_PORTAL_URL);
  const actionText = escapeHtml(props.actionText || "View Recruitment Portal");

  const content = `
    <h1>${safeTitle}</h1>
    ${safeCandidateName ? `<p>Hi <strong>${safeCandidateName}</strong>,</p>` : ""}
    <div style="font-size: 15px; line-height: 1.6; color: #222222; white-space: pre-line;">
      ${escapeHtml(props.message)}
    </div>

    <div class="button-container">
      <a href="${actionUrl}" class="button" target="_blank">${actionText} ➔</a>
    </div>

    <p style="margin-top: 24px;">Best regards,<br><strong>The CodeKrafters Team</strong></p>
  `;

  return {
    subject,
    html: renderBaseEmailLayout({
      title: subject,
      previewText: props.title,
      content,
      supportEmail: props.supportEmail,
    }),
  };
}
