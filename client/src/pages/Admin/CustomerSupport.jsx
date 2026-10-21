import { useState } from "react";
import RegisteredUsers from "../../components/Admin/RegisteredUsers.jsx";
import CustomerFeedback from "../../components/Admin/CustomerFeedback.jsx";

export default function CustomerSupport() {
  const [activeTab, setActiveTab] = useState("registeredUsers");

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-navy-900">User Management</h1>

      <div
        role="tablist"
        aria-label="User management sections"
        className="flex gap-2 rounded-2xl bg-white p-2 shadow-card"
      >
        <button
          role="tab"
          aria-selected={activeTab === "registeredUsers"}
          onClick={() => setActiveTab("registeredUsers")}
          className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
            activeTab === "registeredUsers"
              ? "bg-brand-600 text-white shadow"
              : "text-navy-600 hover:bg-navy-50"
          }`}
        >
          Registered Users
        </button>
        <button
          role="tab"
          aria-selected={activeTab === "customerQueries"}
          onClick={() => setActiveTab("customerQueries")}
          className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
            activeTab === "customerQueries"
              ? "bg-brand-600 text-white shadow"
              : "text-navy-600 hover:bg-navy-50"
          }`}
        >
          Customer Queries
        </button>
      </div>

      <div className="mt-6">
        {activeTab === "registeredUsers" ? (
          <RegisteredUsers />
        ) : (
          <CustomerFeedback />
        )}
      </div>
    </div>
  );
}
