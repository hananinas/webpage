import { z } from "astro:content";

export const blogSchema = z
  .object({
    format: z.string().optional().default("blog"),
    postslug: z.string(),
    title: z.string(),
    description: z.string().optional().default(""),
    authors: z.array(z.string()).default(["unknown"]),
    tags: z.array(z.string()).default(["others"]),
    draft: z.boolean().optional(),
    ogImage: z.object(
      {
        src: z.string(),
        alt: z.string(),
      }
    ),
    banner: z.object(
      {
        src: z.string(),
        alt: z.string(),
      }
    ),
    published: z.string(),
  })
  .strict();

export type BlogFrontmatter = z.infer<typeof blogSchema>;

export const eventSchema = z
.object({
  format: z.string().optional().default("events"),
  postslug: z.string(),
  title: z.string(),
  description: z.string().optional().default(""),
  authors: z.array(z.string()).default(["unknown"]),
  tags: z.array(z.string()).default(["others"]),
  draft: z.boolean().optional(),
  ogImage: z.object(
    {
      src: z.string(),
      alt: z.string(),
    }
  ),
  banner: z.object(
    {
      src: z.string(),
      alt: z.string(),
    }
  ),
  published: z.string(),
})
.strict();

export type EventFrontmatter = z.infer<typeof eventSchema>;


export const memberSchema = z
.object({
  format: z.string().optional().default("members"),
  postslug: z.string(),
  name: z.string(),
  role: z.string(),
  since: z.number(),
  ogImage: z.object(
    {
      src: z.string(),
      alt: z.string(),
    }
  ),
})
.strict();

export type MemberFrontmatter = z.infer<typeof memberSchema>;