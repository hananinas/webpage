import { slug as slugger } from "github-slugger";
import type { PaperItem } from "@components/papers/Papers";

export const slugifyPaper = (Paper: PaperItem) =>
   slugger(Paper.title as string);


export default slugifyPaper;