import React from "react";

interface TitleProps {
  text: string;
  level?: number; // allow any number, but >6 will render as <p>
  weight?:
    | "thin"
    | "extralight"
    | "light"
    | "normal"
    | "medium"
    | "semibold"
    | "bold"
    | "extrabold"
    | "black";
  className?: string;
}

const Title: React.FC<TitleProps> = ({
  text,
  level = 4,
  weight = "bold",
  className,
}) => {
  // Use <h1>-<h6> for levels 1-6, otherwise fallback to <p>
  const HeadingTag = (
    level >= 1 && level <= 6 ? `h${level}` : "p"
  ) as keyof React.JSX.IntrinsicElements;

  // Base styles per level
  const levelStyles: Record<number, string> = {
    1: "text-[36px] sm:text-[42px]",
    2: "text-[36px] sm:text-[30px]",
    3: "text-[24px] sm:text-[28px]",
    4: "text-[26px] sm:text-[24px]",
    5: "text-[22px] sm:text-[20px]",
    6: "text-[16px] sm:text-[18px]",
  };

  // Default style for levels beyond 6
  const fallbackStyle = "text-[14px] sm:text-[16px]";

  const classNames = `${
    levelStyles[level] || fallbackStyle
  } font-${weight} text-[#080808] ${className || ""}`;

  return React.createElement(HeadingTag, { className: classNames }, text);
};

export default Title;
