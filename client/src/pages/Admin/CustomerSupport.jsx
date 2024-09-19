import React, { useState } from "react";
import RegisteredUsers from "../../components/Admin/RegisteredUsers";
import CustomerFeedback from "../../components/Admin/CustomerFeedback";

export default function CustomerSupport() {
  const [activeTab, setActiveTab] = useState("registeredUsers");

  const renderContent = () => {
    switch (activeTab) {
      case "registeredUsers":
        return <RegisteredUsers />
      case "customerQueries":
        return <CustomerFeedback/>
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 w-full bg-gradient-to-r from-purple-400 via-pink-500 to-red-400">
      {/* Tabs Section */}
      <div className="flex justify-center">
        <div className="flex w-full">
          <button
            onClick={() => setActiveTab("registeredUsers")}
            className={`w-1/2 py-3 rounded-t-lg text-lg font-semibold ${
              activeTab === "registeredUsers"
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-800"
            }`}
          >
            Registered Users
          </button>
          <button
            onClick={() => setActiveTab("customerQueries")}
            className={`w-1/2 py-3 rounded-t-lg text-lg font-semibold ${
              activeTab === "customerQueries"
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-800"
            }`}
          >
            Customer Queries
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex justify-center items-center">
        {/* <div className="w-full p-8 bg-white rounded-lg shadow-lg mt-8"> */}
          {renderContent()}
        {/* </div> */}
      </div>
    </div>
  );
}
