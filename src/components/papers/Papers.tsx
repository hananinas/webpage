import React from "react";
import { supabase } from "@supabase";
import { slug as slugger } from "github-slugger";
import { slugifyPaper } from "@utils/slugifyPaper";

export type PaperItem = {
  abstract: string | null;
  author: string | null;
  id: number;
  image_src: string | null;
  title: string | null;
  category: string | null;
};

interface Props {
  paperList: PaperItem[] | undefined;
}

export default function Papers({ paperList }: Props) {
  return (
    <div className="grid grid-cols-1 mt-5 sm:grid-cols-4 gap-4">
      {paperList?.map((item, index) => (
        <a href={"/papers/" + slugifyPaper(item)}>
          <div key={index} className="m-4">
            <div
              className={`w-full h-[200px] max-w-[400px] flex 
      will-change-transform items-center justify-center rounded-lg overflow-hidden object-cover`}
            >
              <img
                src={item.image_src as string | undefined}
                alt={item.title as string | undefined}
                className="group-hover:scale-105 transition-transform"
              />
            </div>
            <div className=" w-[70px]"></div>
            <h1 className="my-2 text-3xl font-medium leading-snug text-primary">
              {item.title}
            </h1>
            <p className="text-gray-600">Author: {item.author}</p>
            {item.abstract && (
              <p className="mt-2 text-gray-800">{item.abstract}</p>
            )}
          </div>
        </a>
      ))}
    </div>
  );
}
