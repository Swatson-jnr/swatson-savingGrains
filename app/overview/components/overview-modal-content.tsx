"use client";

import { Expense } from "@/types";
import { X } from "lucide-react";
import { useState } from "react";
import TransactionDetails from "./transaction-details";
import UpdateDescriptionModal from "./update-description-modal";
import Title from "@/components/title";
import Modal from "@/components/modal";
import { Button } from "@/components/ui/button";

interface OverviewModalContentProps {
  onClose: () => void;
  expense: Expense;
}

const OverviewModalContent = ({
  onClose,
  expense,
}: OverviewModalContentProps) => {
  const [showEditModal, setShowEditModal] = useState(false);
  return (
    <>
      <div>
        <div className="flex items-center justify-between border-b pb-6">
          <Title text="Transaction Details" level={4} weight="bold" />
          <button
            onClick={onClose}
            className="rounded-full border border-[#D6D8DA] p-1.5 hover:bg-gray-100"
          >
            <X size={12} color="#343A46" />
          </button>
        </div>
        <div className="mb-10 mt-4 border-b">
          <TransactionDetails expense={expense} />
        </div>

        {/*  */}
        <div>
          <div className="mb-1 flex items-center justify-between p-2.5">
            <Title text="Description" level={6} weight="normal" />
            <Button
              onClick={() => setShowEditModal(true)}
              className="flex w-[104px] items-center gap-3 p-2.5 cursor-pointer rounded-[100px] border border-black bg-white text-[#000] shadow-none hover:bg-white"
            >
              {/* <Edit2 size={16} /> */}
              <img src="../img/Pen.svg" alt="edit_icon" />
              <h3 className="text-[#080808] text-[16px] font-normal">Edit</h3>
            </Button>
          </div>
          {/*  */}
          <div className="max-h-[116px] max-w-[640px] mb-40 text-black rounded-md border border-[#D6D8DA] bg-[#D6D6D633] px-5 py-7">
            <p>
              Our platform is designed to simplify complex workflows and provide
              clear insights at every stage. Each dashboard element updates in
              real time, allowing you to track progress, performance, and key
              metrics
            </p>
          </div>
        </div>
      </div>
      <Modal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        size="md"
        position="topSmall"
      >
        <UpdateDescriptionModal
          expense={expense}
          onClose={() => setShowEditModal(false)}
        />
      </Modal>
    </>
  );
};

export default OverviewModalContent;
