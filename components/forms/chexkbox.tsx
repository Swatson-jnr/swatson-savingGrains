"use client";

interface CheckBoxProps {
  checked: boolean;
  onChange: () => void;
}

export default function CheckBox({ checked, onChange }: CheckBoxProps) {
  return (
    <div
      onClick={onChange}
      className={`
        w-6 h-6 flex items-center justify-center cursor-pointer rounded-md border
        transition-colors duration-200
        ${
          checked ? "bg-[#E7B00E] border-[#E7B00E]" : "bg-white border-gray-400"
        }
      `}
    >
      {checked && <span className="text-white text-sm font-bold">✓</span>}
    </div>
  );
}
