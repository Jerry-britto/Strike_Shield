import React from "react";

export default function UserList() {
  const users = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      registeredAt: "2024-01-01",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      registeredAt: "2024-02-15",
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike@example.com",
      registeredAt: "2024-03-22",
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex justify-center items-center">
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gradient-to-r from-orange-400 to-red-400 text-white uppercase text-sm font-semibold">
              <th className="px-6 py-3 text-left">User ID</th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Date of Registration</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="bg-white border-b hover:bg-orange-50 transition duration-200"
              >
                <td className="px-6 py-4 text-gray-800">{user.id}</td>
                <td className="px-6 py-4 text-gray-800">{user.name}</td>
                <td className="px-6 py-4 text-gray-800">{user.email}</td>
                <td className="px-6 py-4 text-gray-600">{user.registeredAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
