// import Title from "@base/resources/js/components/title";
// import { Button } from "@base/resources/js/components/ui/button";
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
        <Title text="Update Description" level={4} weight="bold" />
        <button
          onClick={onClose}
          className="rounded-full border p-1.5 hover:bg-gray-100"
        >
          <X size={11} />
        </button>
      </div>

      {/* your form fields */}
      <div className="mb-10">
        <div className="mb-2">
          <Title text="Description" weight="semibold" level={7} />
        </div>

        <textarea
          defaultValue=" Our platform is designed to simplify complex workflows and provide clear insights at every stage. Each dashboard element updates in real time, allowing you to track progress, performance, and key metrics"
          className="mb-4 h-[199px] w-full resize-none rounded-md border p-2 outline-none"
        />
      </div>
      <div className="flex justify-between space-x-3">
        <Button
          variant="outline"
          onClick={onClose}
          className="max-h-[48px] w-[200px] rounded-[8px] border-[#080808] text-[13px] text-[#080808]"
        >
          Cancel
        </Button>
        <Button className="px-13 max-h-[48px] w-[200px] py-4 text-[13px]">
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default UpdateDescriptionModal;
