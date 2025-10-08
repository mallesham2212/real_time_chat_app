import React, { useState, useRef, useEffect } from "react";
import { Camera } from "lucide-react";
import { useAuthStore } from "../utils/useAuthStore";

const ProfilePage = () => {
  const { authUser, updateProfile, isUpdatingProfile } = useAuthStore();
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
     setPreview(base64Image);
     await updateProfile({ profilePic: base64Image });
    };
  };
  const handleCameraClick = () => {
    fileInputRef.current.click();
  };
  console.log(authUser.profilePic);
return (
  authUser ? (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-4 sm:p-6">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Update Profile
        </h2>

        {/* Profile Image with Camera */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto mb-8">
          {preview || authUser?.profilePic ? (
            <img
              src={preview || authUser.profilePic}
              alt="Profile"
              className="w-full h-full rounded-full object-cover border-4 border-gray-200 shadow"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center rounded-full border-4 border-gray-200 bg-gray-100 text-gray-400 shadow">
              No Image
            </div>
          )}

          {/* Overlay spinner while updating */}
          {/* {isUpdatingProfile && (
            <div className="absolute inset-0 bg-white bg-opacity-60 flex justify-center items-center rounded-full">
              <div className="w-10 h-10 border-4 border-blue-600 border-dashed rounded-full animate-spin"></div>
            </div>
          )} */}

          <button
            type="button"
            onClick={handleCameraClick}
            className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full shadow-md hover:bg-blue-700 transition"
          >
            <Camera size={18} />
          </button>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* User Info Section */}
        <div className=" text-gray-700">
          <div className="space-y-5">
            <label className="text-sm font-semibold text-gray-500">Name</label>
            <input
              type="text"
              value={authUser.fullName}
              readOnly
              className="w-full bg-gray-50 rounded-lg px-3 py-2 text-base sm:text-lg font-medium text-gray-800 shadow-sm"
            />
          </div>

          <div  className="space-y-1">
            <label className="text-sm font-semibold text-gray-500">Email</label>
            <input
              type="email"
              value={authUser.email}
              readOnly
              className="w-full bg-gray-50 rounded-lg px-3 py-2 text-base sm:text-lg font-medium text-gray-800 shadow-sm"
            />
          </div>
          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-16 h-16 border-4 border-blue-600 border-dashed rounded-full animate-spin"></div>
    </div>
  )
);
};

export default ProfilePage;
