import React, { useState } from "react";
import { toast } from "react-toastify";
import { putRequest } from "../../../../api";
import { CustomButton } from "@/common/components/CustomButton";

const AdminResetPasswordModal = ({ setShowPasswordModal, userId }) => {
  const [passwordForm, setPasswordForm] = useState({
    new_password: "",
    confirm_password: "",
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!passwordForm.new_password || !passwordForm.confirm_password) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      toast.error("New passwords do not match.");
      return;
    }

    try {
      const response = await putRequest(`/user/admin-reset-password`, {
        user_id: userId,
        password: passwordForm.new_password,
      });

      if (response.code !== 200) {
        toast.error(response.message || "Failed to reset password.");
      } else {
        toast.success("Password reset successfully.");
        setShowPasswordModal(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while resetting the password.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <h2 className="text-xl font-semibold mb-4">Reset User Password</h2>

        <form className="space-y-4" onSubmit={handlePasswordSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              required
              type="password"
              name="new_password"
              value={passwordForm.new_password}
              onChange={handlePasswordChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              required
              type="password"
              name="confirm_password"
              value={passwordForm.confirm_password}
              onChange={handlePasswordChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <CustomButton
              // @ts-ignore
              type="button"
              color="danger"
              onClick={() => setShowPasswordModal(false)}
              title="Cancel"
            />
            {/* Cancel
            </CustomButton> */}
            <CustomButton
              type="submit"
              variant="primary"
              title="Reset Password"
            />
          </div>
        </form>

        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={() => setShowPasswordModal(false)}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default AdminResetPasswordModal;
