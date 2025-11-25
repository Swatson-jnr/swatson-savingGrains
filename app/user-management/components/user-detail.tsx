"use client"


import { useState } from "react";
import DetailsModal from "./details";

interface ViewDetailsProps {
  onClose?: () => void;
  visible: boolean;
  onSuccess?: () => void;
  mode?: "view" | "edit";
}

const ViewDetails = ({ onClose }: ViewDetailsProps) => {
  const [showApproveModal, setShowApproveModal] = useState(false);

  const closeModal = () => {
    setShowApproveModal(false);
  };

  const handleUserAddSuccess = () => {
    setTimeout(() => {}, 5000);
  };

  return (
    <div className="mb-8 flex flex-col p-3">
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
        {/* Avatar */}
        <div className="mb-8 flex justify-start">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
            <span className="text-lg font-medium text-gray-700">JD</span>
          </div>
        </div>

        {/* User Information - Two Columns */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="mb-2 block text-sm text-gray-500">Name</label>
              <p className="text-base font-medium text-gray-900">John Doe</p>
            </div>

            {/* Created */}
            <div>
              <label className="mb-2 block text-sm text-gray-500">
                Created
              </label>
              <p className="text-base font-medium text-gray-900">01/02/2024</p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Phone Number */}
            <div>
              <label className="mb-2 block text-sm text-gray-500">
                Phone number
              </label>
              <p className="text-base font-medium text-gray-900">024444444</p>
            </div>

            {/* Role */}
            <div>
              <label className="mb-2 block text-sm text-gray-500">Role</label>
              <p className="text-base font-medium text-gray-900">Paymaster</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-80 flex flex-col-reverse gap-3 p-6 sm:flex-row">
        <button
          onClick={onClose}
          className="flex-1 rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-900 transition-colors hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={() => setShowApproveModal(true)}
          className="flex-1 rounded-lg bg-yellow-500 px-6 py-3 font-medium text-white transition-colors hover:bg-yellow-600"
        >
          Edit User Details
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
                />
              </div>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default ViewDetails;
