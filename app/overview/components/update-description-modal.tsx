import Title from "@/components/title";
import { Button } from "@/components/ui/button";
import { Expense } from "@/types";
import { X } from "lucide-react";

interface UpdateDescriptionModalProps {
  expense: Expense;
  onClose: () => void;
}

const UpdateDescriptionModal = ({
  expense,
  onClose,
}: UpdateDescriptionModalProps) => {
  return (
    <div className="h-[444px] p-6">
      <div className="flex items-center justify-between pb-6">
        {/* <Title text="Update Description" level={4} weight="bold" /> */}
        <h1 className="text-[20px] text-[#343A46] font-bold">Update Description</h1>
        <button
          onClick={onClose}
          className="rounded-full border border-[#D6D8DA] p-1.5 hover:bg-gray-100"
        >
          <X size={12} color="#343A46" />
        </button>
      </div>

      {/* your form fields */}
      <div className="mb-10">
        <div className="mb-2">
          {/* <Title text="Description" weight="semibold" level={7} /> */}
          <h1 className="font-semibold text-[#343A46] text-[14px]">Description</h1>
        </div>

        <textarea
          defaultValue=" Our platform is designed to simplify complex workflows and provide clear insights at every stage. Each dashboard element updates in real time, allowing you to track progress, performance, and key metrics"
          className="mb-4 h-[199px] w-full resize-none text-black text-sm font-normal rounded-md border p-2 outline-none"
        />
      </div>
      <div className="flex justify-between space-x-3">
        <Button
          variant="outline"
          onClick={onClose}
          className="max-h-12 cursor-pointer font-semibold  w-[200px] bg-white rounded-lg border-[#080808] text-[13px] text-[#080808]"
        >
          Cancel
        </Button>
        <Button className="px-13 max-h-12 cursor-pointer font-semibold w-[200px] py-4 text-[13px]">
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default UpdateDescriptionModal;
