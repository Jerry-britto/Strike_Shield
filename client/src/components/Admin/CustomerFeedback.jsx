import { useState, useEffect, useMemo } from "react";
import SearchIcon from "@mui/icons-material/Search";
import api from "../../api/axios.js";
import { TableSkeleton } from "../Loader/Skeletons.jsx";
import { formatDate } from "../../utils/format.js";

export default function CustomerFeedback() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const getFeedback = async () => {
      try {
        const res = await api.get("/admin/getcustomerresponse/");
        if (res.status === 200 && isActive) {
          setFeedback(res.data.data || []);
        }
      } catch (error) {
        console.log("could not get feedback", error.message);
      } finally {
        if (isActive) setLoading(false);
      }
    };

    getFeedback();
    return () => {
      isActive = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return feedback.filter((item) =>
      searchType === "name"
        ? (item.name || "").toLowerCase().includes(term)
        : (item.email || "").toLowerCase().includes(term)
    );
  }, [feedback, searchTerm, searchType]);

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
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search queries"
            className="input-base pl-10"
          />
        </div>
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
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
            <TableSkeleton rows={5} cols={4} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-navy-100">
              <thead className="bg-navy-50 text-left text-sm uppercase tracking-wider text-navy-500">
                <tr>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {filtered.length > 0 ? (
                  filtered.map((item) => (
                    <tr key={item._id} className="transition hover:bg-navy-50">
                      <td className="px-5 py-3 font-medium text-navy-900">
                        {item.name || "—"}
                      </td>
                      <td className="px-5 py-3 text-navy-700">
                        {item.email || "—"}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-navy-700">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="px-5 py-3 text-navy-700">
                        {item.message || "—"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-5 py-8 text-center text-navy-400"
                    >
                      No queries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
