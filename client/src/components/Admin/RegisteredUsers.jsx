import { useState, useEffect, useMemo } from "react";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import api from "../../api/axios.js";
import { TableSkeleton } from "../Loader/Skeletons.jsx";
import { formatDate, shortId } from "../../utils/format.js";

const PAGE_SIZE = 10;

export default function RegisteredUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let isActive = true;

    const getUsers = async () => {
      try {
        const res = await api.get("/admin/getUsers/");
        if (res.status === 200 && isActive) {
          // Normalise to a consistent shape (name = first + last).
          const list = (res.data || []).map((u) => ({
            ...u,
            name:
              u.name || `${u.first_name || ""} ${u.last_name || ""}`.trim(),
          }));
          setUsers(list);
        }
      } catch (error) {
        console.log("could not get users", error.message);
      } finally {
        if (isActive) setLoading(false);
      }
    };

    getUsers();
    return () => {
      isActive = false;
    };
  }, []);

  const filteredUsers = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return users.filter((user) =>
      searchType === "name"
        ? (user.name || "").toLowerCase().includes(term)
        : (user.email || "").toLowerCase().includes(term)
    );
  }, [users, searchTerm, searchType]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const getInitials = (name = "") =>
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return (
    <div>
      {/* Search + filter */}
      <div className="card mb-5 flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <SearchIcon
            fontSize="small"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-navy-400"
          />
          <input
            type="text"
            placeholder={`Search by ${searchType}`}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            aria-label="Search users"
            className="input-base pl-10"
          />
        </div>
        <select
          value={searchType}
          onChange={(e) => {
            setSearchType(e.target.value);
            setPage(1);
          }}
          aria-label="Search field"
          className="input-base sm:w-52"
        >
          <option value="name">Search by Name</option>
          <option value="email">Search by Email</option>
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-4">
            <TableSkeleton rows={8} cols={4} />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-navy-100">
                <thead className="bg-navy-50 text-left text-sm uppercase tracking-wider text-navy-500">
                  <tr>
                    <th className="px-5 py-3">User</th>
                    <th className="px-5 py-3">ID</th>
                    <th className="px-5 py-3">Email</th>
                    <th className="px-5 py-3">Registered</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-100">
                  {paginatedUsers.length > 0 ? (
                    paginatedUsers.map((user) => (
                      <tr
                        key={user._id}
                        className="transition hover:bg-navy-50"
                      >
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                              {getInitials(user.name) || (
                                <PersonIcon fontSize="small" />
                              )}
                            </span>
                            <span className="font-medium text-navy-900">
                              {user.name || "—"}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3 font-mono text-xs text-navy-500">
                          {shortId(user._id)}
                        </td>
                        <td className="px-5 py-3 text-navy-700">
                          {user.email || "—"}
                        </td>
                        <td className="px-5 py-3 text-navy-700">
                          {formatDate(user.createdAt)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-5 py-8 text-center text-navy-400"
                      >
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-navy-100 px-5 py-3">
                <p className="text-sm text-navy-500">
                  Page {currentPage} of {totalPages} ·{" "}
                  {filteredUsers.length} users
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="btn-secondary !py-1.5 text-sm"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="btn-secondary !py-1.5 text-sm"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
