import React from "react";
import type { MemberFrontmatter } from "@content/_schemas";
import Badge from "./Badge";

export type MemberItem = {
  name: string;
  role: string;
  since: number;
  data: MemberFrontmatter;
};

interface Props {
  memberList: MemberItem[];
}

export default function Members({ memberList }: Props) {
  return (
    <div className="grid grid-cols-1 mt-5 sm:grid-cols-4">
      {memberList.map((item, index) => (
        <div key={index} className="m-4"> 
          <div
            className={`w-full h-[200px] max-w-[400px] flex 
      will-change-transform items-center justify-center rounded-lg overflow-hidden object-cover`}
          >
            <img
              src={item.data.ogImage.src}
              alt={item.data.ogImage.alt}
              className="group-hover:scale-105 transition-transform"
            />
          </div>
          <div className=" w-[70px]">
          <Badge color="bg-green-500"> 
          <p className="text-sm uppercase"> {item.role}</p>

          </Badge>
          
          </div>
          <h1 className="my-2 text-3xl font-medium leading-snug text-primary">
            {item.name}
          </h1>
          <p>Since {item.since}</p>
        </div>
      ))}
    </div>
  );
}
