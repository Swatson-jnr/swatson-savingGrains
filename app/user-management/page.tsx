"use client"


import { CheckCircle, ChevronLeft, ChevronRight, X } from "lucide-react";
import React, { useState } from "react";
import { AppLayout } from "../layout/app";
import UserTable from "./components/user-table";
import DetailsModal from "./components/details";
// import { AppLayout } from "../../layouts/app";

// import DetailsModal from "./details";
// import UserTable from "./my_table";

type ConflictType = User | null;

interface User {
  actions: string;
  name: string;
  country: string;
  phoneNumber: string;
  dateCreated: string;
  role: string;
}

const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("Ghana");
  const [selectedRole, setSelectedRole] = useState("Role");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditApprovalModal, setShowEditApprovalModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showResetPinModal, setShowResetPinModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedConflict, setSelectedConflict] = useState<ConflictType>(null);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(
    null,
  );

  const closeModal = () => {
    setShowViewModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setShowApproveModal(false);
    setSelectedConflict(null);
    setShowResetPinModal(false);
    setShowAddUserModal(false);
  };

  const handleUserAddSuccess = () => {
    setShowSuccessNotification(true);
    setTimeout(() => {
      setShowSuccessNotification(false);
    }, 5000);
  };

  const handleDelete = () => {
    console.log("Deleting user:", selectedConflict);
    closeModal();
  };

  const handleResetPin = () => {
    console.log("Resetting PIN for user:", selectedConflict);
    closeModal();
  };

  const users: User[] = [
    {
      actions: "",
      name: "John Doe",
      country: "Ghana",
      phoneNumber: "0540977343",
      dateCreated: "May 1, 2025",
      role: "Admin",
    },
    {
      actions: "",
      name: "John Doe",
      country: "Kenya",
      phoneNumber: "0540977343",
      dateCreated: "May 1, 2025",
      role: "Paymaster",
    },
    {
      actions: "",
      name: "John Doe",
      country: "Ghana",
      phoneNumber: "0540977343",
      dateCreated: "May 1, 2025",
      role: "Field Agent",
    },
    {
      actions: "",
      name: "John Doe",
      country: "Ghana",
      phoneNumber: "0540977343",
      dateCreated: "May 1, 2025",
      role: "Paymaster",
    },
    {
      actions: "",
      name: "John Doe",
      country: "Ghana",
      phoneNumber: "0540977343",
      dateCreated: "May 1, 2025",
      role: "Paymaster",
    },
    {
      actions: "",
      name: "John Doe",
      country: "Kenya",
      phoneNumber: "0540977343",
      dateCreated: "May 1, 2025",
      role: "Admin",
    },
    {
      actions: "",
      name: "John Doe",
      country: "Kenya",
      phoneNumber: "0540977343",
      dateCreated: "May 1, 2025",
      role: "Field Agent",
    },
    {
      actions: "",
      name: "John Doe",
      country: "Kenya",
      phoneNumber: "0540977343",
      dateCreated: "May 1, 2025",
      role: "Field Agent",
    },
  ];

  const totalPages = 10;

  return (
    <AppLayout>
      <div className="min-h-screen flex-1 bg-gray-50 p-4 font-['Inter'] md:p-6 lg:p-8">
        <div className="mx-auto max-w-full">
          {/* Success Notification */}
          {showSuccessNotification && (
            <div className="fixed right-4 top-4 z-50 flex items-center gap-3 rounded-lg bg-green-500 px-4 py-3 text-white shadow-lg">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">New user added successfully</span>
              <button
                onClick={() => setShowSuccessNotification(false)}
                className="ml-2 rounded-full p-1 hover:bg-green-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Header */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
                User Management
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                View and manage all users
              </p>
            </div>

            <button
              onClick={() => setShowAddUserModal(true)}
              className="w-full rounded-lg bg-yellow-500 px-6 py-2.5 font-medium text-white transition-colors hover:bg-yellow-600 sm:w-auto"
            >
              Add New User
            </button>
          </div>

          {/* AddNewUserForm Modal */}
          {showAddUserModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div
                className="absolute inset-0 bg-black opacity-50"
                onClick={closeModal}
              ></div>
              <div className="relative z-[60] rounded-lg bg-white shadow-lg">
                <DetailsModal
                  onClose={closeModal}
                  visible={showAddUserModal}
                  onSuccess={handleUserAddSuccess}
                  headerTitle={"Add New User"}
                />
              </div>
            </div>
          )}

          {showDeleteModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div
                className="absolute inset-0 bg-black opacity-50"
                onClick={closeModal}
              ></div>
              <div className="relative z-[60] w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
                <button
                  onClick={closeModal}
                  className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-400 hover:bg-gray-50"
                >
                  ✕
                </button>

                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                    <svg
                      className="h-10 w-10 text-red-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12z" />
                    </svg>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900">
                    Are you sure you want to delete this user?
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    This action cannot be undone
                  </p>

                  <div className="mt-6 flex w-full gap-3">
                    <button
                      onClick={handleDelete}
                      className="flex-1 rounded-lg bg-yellow-500 px-6 py-3 text-sm font-medium text-white hover:bg-yellow-600"
                    >
                      Yes, Delete
                    </button>
                    <button
                      onClick={closeModal}
                      className="flex-1 rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showResetPinModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div
                className="absolute inset-0 bg-black opacity-50"
                onClick={closeModal}
              ></div>
              <div className="relative z-[60] w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
                <button
                  onClick={closeModal}
                  className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-400 hover:bg-gray-50"
                >
                  ✕
                </button>

                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                    <svg
                      className="h-10 w-10 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900">
                    Are you sure you want to reset this user's PIN?
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    This action will invalidate their current PIN and require
                    them to create a new one.
                  </p>

                  <div className="mt-6 flex w-full gap-3">
                    <button
                      onClick={handleResetPin}
                      className="flex-1 rounded-lg bg-yellow-500 px-6 py-3 text-sm font-medium text-white hover:bg-yellow-600"
                    >
                      Yes, Reset PIN
                    </button>
                    <button
                      onClick={closeModal}
                      className="flex-1 rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Filters */}

          {/* User Table */}
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="overflow-x-auto">
              <UserTable tableDetails={users} />
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-lg bg-white p-4 shadow sm:flex-row">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </button>

            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
              {[1, 2, 3, "...", 8, 9, 10].map((page, index) => (
                <button
                  key={index}
                  onClick={() =>
                    typeof page === "number" && setCurrentPage(page)
                  }
                  disabled={page === "..."}
                  className={`min-w-[40px] rounded-lg px-3 py-2 text-sm font-medium ${
                    page === currentPage
                      ? "bg-yellow-500 text-white"
                      : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  } ${page === "..." ? "cursor-default hover:bg-white" : ""}`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default UserManagement;
