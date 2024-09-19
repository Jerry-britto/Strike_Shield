import { useState, useEffect } from "react";
import Axios from "axios";

export default function CustomerFeedback() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("name");

  // Dummy data for the table
  const [users, setUsers] = useState([
    {
      _id: "1",
      name: "John Doe",
      email: "john@example.com",
      message: "good website",
      createdAt: "2023-01-15",
    },
    {
      _id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      message: "product quality could have been better",
      createdAt: "2023-01-15",
    },
    {
      _id: "3",
      name: "Sam Wilson",
      email: "sam@example.com",
      message: "amazing quality products",
      createdAt: "2023-01-15",

    },
  ]);

  const getUsers = async () => {
    try {
      const res = await Axios.get(
        "http://localhost:8000/api/v1/admin/getcustomerresponse/",
        { withCredentials: true }
      );
      if (res.status === 200) {
        console.log("users retrieved successfully");
        console.log(res.data);
        setUsers(res.data.data);
      }
    } catch (error) {
      console.log("could not get users");
      console.log(error.message);
      console.log(error.response?.message);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setSearchType(e.target.value);
  };

  const filteredUsers = users.filter((user) =>
    searchType === "name"
      ? user.name.toLowerCase().includes(searchTerm.toLowerCase())
      : user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen  p-8 w-full">
      <div className="">
        {/* Search Bar with Filters */}
        <div className="flex flex-col md:flex-row justify-between mb-6 bg-white p-6 rounded-xl shadow-lg">
          <input
            type="text"
            placeholder={`Search by ${searchType}`}
            value={searchTerm}
            onChange={handleSearch}
            className="w-full md:w-2/3 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
          />
          <select
            value={searchType}
            onChange={handleFilterChange}
            className="w-full md:w-1/3 p-3 mt-4 md:mt-0 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
          >
            <option value="name">Search by Name</option>
            <option value="email">Search by Email</option>
          </select>
        </div>

        {/* Table with User Data */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow-md">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-500 to-purple-500 text-left text-white text-sm font-semibold">
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">Email</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Message</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-gray-200 hover:bg-indigo-100 transition-colors duration-200"
                  >
                    <td className="py-4 px-6 text-gray-700">{user.name}</td>
                    <td className="py-4 px-6 text-gray-700">{user.email}</td>
                    <td className="py-4 px-6 w-3/12 text-gray-700">{user.createdAt.split('T')[0]}</td>
                    <td className="py-4 px-6 text-gray-700">{user.message}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="py-4 px-6 text-center text-gray-500"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
