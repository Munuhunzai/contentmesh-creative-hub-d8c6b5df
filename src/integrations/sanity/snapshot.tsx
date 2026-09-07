import { createContext, useContext, type ReactNode } from "react";
import * as queries from "./queries";

export const publicQueries = {
  settings: queries.siteSettingsQuery,
  homepage: queries.homepageQuery,
  services: queries.servicesQuery,
  portfolio: queries.portfolioQuery,
  testimonials: queries.testimonialsQuery,
  team: queries.teamQuery,
  faq: queries.faqQuery,
  blog: queries.blogListQuery,
  contact: queries.contactQuery,
};
export type Snapshot = Record<string, unknown>;
export const snapshotQuery = `{${Object.entries(publicQueries)
  .map(([key, query]) => `"${key}": ${query}`)
  .join(",")}}`;
const SnapshotContext = createContext<Snapshot>({});
export function SanitySnapshot({ data, children }: { data: Snapshot; children: ReactNode }) {
  return <SnapshotContext.Provider value={data}>{children}</SnapshotContext.Provider>;
}
export function useSnapshotValue<T>(query: string): T | undefined {
  const snapshot = useContext(SnapshotContext);
  const entry = Object.entries(publicQueries).find(([, value]) => value === query);
  return entry ? (snapshot[entry[0]] as T | undefined) : undefined;
}
