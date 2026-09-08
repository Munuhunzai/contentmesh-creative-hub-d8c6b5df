import imageUrlBuilder from "@sanity/image-url";
import { SANITY_PROJECT_ID, SANITY_DATASET } from "./client";

const builder = imageUrlBuilder({ projectId: SANITY_PROJECT_ID, dataset: SANITY_DATASET });

export function urlFor(source: unknown) {
  return builder.image(source as Parameters<typeof builder.image>[0]);
}
