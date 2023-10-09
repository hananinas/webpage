import { slug as slugger } from "github-slugger";
import type { BlogFrontmatter } from "@content/_schemas";
import type { PaperItem } from "@components/papers/Papers";

export const slugifyStr = (str: string) => slugger(str);

const slugify = (post: BlogFrontmatter) =>
  post.postslug ? slugger(post.postslug) : slugger(post.title);

export const slugifyAll = (arr: string[]) => arr.map(str => slugifyStr(str));

export const slugifyPaper = (Paper: PaperItem) =>
   slugger(Paper.title as string);


export default slugify;