import { z } from "zod";
export const CONTACT_SERVICES = [
  "AI Video Production",
  "AI Animation",
  "Voiceovers",
  "Video Editing",
  "Motion Graphics",
  "Full Production",
  "Other / Not sure yet",
] as const;
export const CONTACT_BUDGETS = [
  "< $2k",
  "$2k – $5k",
  "$5k – $15k",
  "$15k – $50k",
  "$50k+",
  "Help me estimate",
] as const;
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  email: z.string().trim().email("Enter a valid email").max(200),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  service: z.enum(CONTACT_SERVICES, { errorMap: () => ({ message: "Choose a service" }) }),
  budget: z.enum(CONTACT_BUDGETS, { errorMap: () => ({ message: "Choose a budget" }) }),
  details: z.string().trim().min(10, "Please add at least 10 characters").max(2000),
  _honey: z.string().max(0).optional().default(""),
});
export function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!,
  );
}
