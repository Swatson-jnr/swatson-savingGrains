"use client";

import { useState } from "react";
import DetailsModal from "./details";
import Title from "@/components/title";
import { X } from "lucide-react";

interface UserData {
  name: string;
  country: string;
  phoneNumber: string;
  dateCreated: string;
  role: string;
}

interface ViewDetailsProps {
  onClose?: () => void;
  visible: boolean;
  onSuccess?: () => void;
  mode?: "view" | "edit";
  userData?: UserData; // Added userData prop
}

const ViewDetails = ({ onClose, userData }: ViewDetailsProps) => {
  const [showApproveModal, setShowApproveModal] = useState(false);

  const closeModal = () => {
    setShowApproveModal(false);
  };

  const handleUserAddSuccess = () => {
    setTimeout(() => {}, 5000);
  };

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div>
      <div className="p-10 flex justify-between">
        <div>
          <Title text="User Details" weight="bold" level={5} />
          <h1 className="text-[#373736] text-[16px] font-normal">
            Check user details below
          </h1>
        </div>

        <div>
          <button
            onClick={onClose}
            className="rounded-full border border-[#D6D8DA] p-1.5 hover:bg-gray-100"
          >
            <X size={12} color="#343A46" />
          </button>
        </div>
      </div>
      <div className="mb-0 flex flex-col p-10">
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
          {/* Avatar */}
          <div className="mb-8 flex justify-start">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
              <span className="text-lg font-semibold text-[#080808]">
                {userData?.name ? getInitials(userData.name) : "N/A"}
              </span>
            </div>
          </div>

          {/* User Information - Two Columns */}
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="mb-2 block text-sm text-gray-500">Name</label>
                <p className="text-base font-medium text-gray-900">
                  {userData?.name || "N/A"}
                </p>
              </div>

              {/* Created */}
              <div>
                <label className="mb-2 block text-sm text-gray-500">
                  Created
                </label>
                <p className="text-base font-medium text-gray-900">
                  {userData?.dateCreated || "N/A"}
                </p>
              </div>

              {/* Country */}
              {/* <div>
                <label className="mb-2 block text-sm text-gray-500">
                  Country
                </label>
                <p className="text-base font-medium text-gray-900">
                  {userData?.country || "N/A"}
                </p>
              </div> */}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Phone Number */}
              <div>
                <label className="mb-2 block text-sm text-gray-500">
                  Phone number
                </label>
                <p className="text-base font-medium text-gray-900">
                  {userData?.phoneNumber || "N/A"}
                </p>
              </div>

              {/* Role */}
              <div>
                <label className="mb-2 block text-sm text-gray-500">Role</label>
                <p className="text-base font-medium text-gray-900">
                  {userData?.role || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-95 flex flex-col-reverse gap-3 p-6 sm:flex-row">
          <button
            onClick={() => setShowApproveModal(true)}
            className="flex-1 rounded-lg bg-yellow-500 px-6 py-3 font-medium text-white transition-colors hover:bg-yellow-600"
          >
            Edit User Details
          </button>
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-900 transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>

        {/* Edit Modal */}
        {showApproveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={closeModal}
          ></div>
          <div className="relative z-60 rounded-lg bg-white shadow-lg">
            <DetailsModal
              onClose={closeModal}
              visible={showApproveModal}
              onSuccess={handleUserAddSuccess}
              mode="edit"
              headerTitle={"Edit User"}
              // userData={userData} // Pass userData to edit modal as well
            />
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default ViewDetails;
