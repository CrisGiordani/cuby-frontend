import { createContactHandler } from '../server/contact.mjs';

// Vercel terminates HTTPS and supplies the trusted forwarding headers.
export default createContactHandler({
  apiKey: process.env.RESEND_API_KEY,
  from: process.env.MAIL_FROM,
  trustProxy: true,
});
