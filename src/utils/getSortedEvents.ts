import type { CollectionEntry } from "astro:content";

const getSortedPosts = (events: CollectionEntry<"event">[]) =>
  events
    .filter(({ data }) => !data.draft)
    .sort(
      (a, b) =>
        Math.floor(new Date(b.data.published).getTime() / 1000) -
        Math.floor(new Date(a.data.published).getTime() / 1000)
    );

export default getSortedPosts;