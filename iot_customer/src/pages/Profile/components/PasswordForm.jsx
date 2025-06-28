import React, { useState } from "react";
import { CustomButton } from "../../../Common/Components/CustomButton";
import { toast } from "react-toastify";
import { putRequest } from "../../../api";

const PasswordForm = ({ setShowPasswordModal }) => {
  const [passwordForm, setPasswordForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async () => {
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      toast.error("New passwords do not match.");
      return;
    }

    if (passwordForm.old_password === passwordForm.new_password) {
      toast.error("New password cannot be the same as old password.");
      return;
    }

    const respone = await putRequest("/user/change-password", passwordForm);

    if (respone.code !== 200) {
      toast.error(respone.message);
      return;
    } else {
      toast.success(respone.message);
    }

    // Submit to backend here
    // console.log("Password submitted", passwordForm);
    setShowPasswordModal(false); // Close modal on success
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <h2 className="text-xl font-semibold mb-4">Update Password</h2>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            handlePasswordSubmit();
          }}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Old Password
            </label>
            <input
              required
              type="password"
              name="old_password"
              value={passwordForm.old_password}
              onChange={handlePasswordChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
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
              type="password"
              name="confirm_password"
              value={passwordForm.confirm_password}
              onChange={handlePasswordChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <CustomButton
              variant="secondary"
              onClick={() => setShowPasswordModal(false)}
            >
              Cancel
            </CustomButton>
            <CustomButton variant="primary">
              Update
            </CustomButton>
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

export default PasswordForm;
