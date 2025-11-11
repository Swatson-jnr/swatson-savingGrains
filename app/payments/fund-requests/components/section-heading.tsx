interface SectionHeadingProps {
  text: string;
}

export default function SectionHeading({ text }: SectionHeadingProps) {
  return (
    <h1 className="mb-4 text-[16px] font-normal text-[#8E8E93]">
      {text}
    </h1>
  );
}