"use client";

import { CheckCircle, ChevronLeft, ChevronRight, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { AppLayout } from "../layout/app";
import UserTable from "./components/user-table";
import DetailsModal from "./components/details";
import Title from "@/components/title";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import { formatDate } from "@/lib/utils";
import apiClient from "@/lib/axios";

interface ApiUser {
  first_name: string;
  last_name: string;
  phone_number: string;
  roles: string[];
  country?: string;
  createdAt?: string;
}

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
  const [showEditApprovalModal, setShowEditApprovalModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showViewModal, setShowViewModal] = useState(false);
  const [showResetPinModal, setShowResetPinModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedConflict, setSelectedConflict] = useState<any>(null);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(
    null
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
    fetchUsers(); // Refresh the user list
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

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("access_token");

      if (!token) {
        setError("No access token found. Please login again.");
        setLoading(false);
        return;
      }

      const res = await apiClient.get("users/all-users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("API Response:", res.data);

      // Handle different response structures
      let list: ApiUser[] = [];

      if (Array.isArray(res.data)) {
        list = res.data;
      } else if (res.data?.data && Array.isArray(res.data.data)) {
        list = res.data.data;
      } else if (res.data?.users && Array.isArray(res.data.users)) {
        list = res.data.users;
      }

      console.log("Extracted users:", list);
      setUsers(list);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      setError(error?.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const usersData: User[] = users.map((item: ApiUser, index: number) => {
    const name =
      `${item.first_name || ""} ${item.last_name || ""}`.trim() ||
      "Unknown User";
    const country = item.country || "Unknown Country";
    const phoneNumber = item.phone_number || "N/A";
    const dateCreated = item.createdAt
      ? formatDate(dayjs(item.createdAt), "MMMM D, YYYY")
      : "N/A";
    const role =
      Array.isArray(item.roles) && item.roles.length > 0
        ? item.roles[0] // Changed from item.roles.join(", ") to item.roles[0]
        : "N/A";

    return {
      actions: "",
      name,
      country,
      phoneNumber,
      dateCreated,
      role,
    };
  });

  console.log("Total users:", users.length);
  console.log("Mapped usersData:", usersData);

  const totalPages = 10;

  return (
    <AppLayout>
      <div className="min-h-screen flex-1 p-4 font-['Inter'] md:p-6 lg:p-8">
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
              <Title text="User Management" weight="bold" level={2} />
              <p className="mt-1 text-[16px] text-[#080808] font-normal">
                View and manage all users
              </p>
            </div>

            <Button
              onClick={() => setShowAddUserModal(true)}
              className="w-[152px] h-10 cursor-pointer text-white text-sm font-medium"
            >
              Add New User
            </Button>
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

          {/* User Table */}
          <div className="overflow-hidden rounded-lg bg-white">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <div className="text-gray-500">Loading users...</div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center p-8">
                <div className="text-red-500">{error}</div>
              </div>
            ) : usersData.length === 0 ? (
              <div className="flex items-center justify-center p-8">
                <div className="text-gray-500">No users found</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <UserTable tableDetails={usersData} />
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default UserManagement;
