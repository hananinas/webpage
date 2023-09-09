import { defineCollection } from "astro:content";
import { blogSchema,eventSchema,memberSchema } from "./_schemas";

const blog = defineCollection({
  schema: blogSchema,
});

const event = defineCollection({
  schema: eventSchema,
});

const member = defineCollection({
  schema: memberSchema,
});

export const collections = { blog, event,member };