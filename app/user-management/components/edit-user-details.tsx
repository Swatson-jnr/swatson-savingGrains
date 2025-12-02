import React from "react";
import { X } from "lucide-react";


interface UserData {
  name: string;
  country: string;
  phoneNumber: string;
  dateCreated: string;
  role: string;
}
interface UserEditModalProps {
  visible: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
  userData?: UserData; // Added userData prop
}

const UserEditModal: React.FC<UserEditModalProps> = ({
  visible,
  onClose,
  userData,
  onSuccess,
}) => {
  if (!visible) return null;

  return (
    <div
      className="min-h-screen bg-gray-50 p-4 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              User Details
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Check user details below
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            {/* Avatar */}
            <div className="flex justify-start mb-8">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-700 font-medium text-lg">JD</span>
              </div>
            </div>

            {/* User Information - Two Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label className="text-sm text-gray-500 block mb-2">
                    Name
                  </label>
                  <p className="text-gray-900 font-medium text-base">
                    John Doe
                  </p>
                </div>

                {/* Created */}
                <div>
                  <label className="text-sm text-gray-500 block mb-2">
                    Created
                  </label>
                  <p className="text-gray-900 font-medium text-base">
                    01/02/2024
                  </p>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Phone Number */}
                <div>
                  <label className="text-sm text-gray-500 block mb-2">
                    Phone number
                  </label>
                  <p className="text-gray-900 font-medium text-base">
                    024444444
                  </p>
                </div>

                {/* Role */}
                <div>
                  <label className="text-sm text-gray-500 block mb-2">
                    Role
                  </label>
                  <p className="text-gray-900 font-medium text-base">
                    Paymaster
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 p-6">
          <button
            onClick={onClose}
            className="flex-1 bg-white hover:bg-gray-50 text-gray-900 font-medium py-3 px-6 rounded-lg border border-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-3 px-6 rounded-lg transition-colors">
            Edit User Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserEditModal;
