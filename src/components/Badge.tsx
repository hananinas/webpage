import type { ReactElement } from "react";

type Props = {
  id?: string;
  hover?: boolean;
  children: ReactElement; 
  color?: string;
};

export default function Badge({ id, hover, children,color }: Props) {

    return (
      <div
        id={id}
        className={`m-0.5 no-underline tracking-wider text-accent ${color} px-1 font-medium rounded-lg ${
          hover ? "hover:shadow-accent-small transition-shadow" : ""
        }`}
      >
        {children}
      </div>      
    );

}
