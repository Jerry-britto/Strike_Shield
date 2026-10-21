import { useEffect, useMemo, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import api from "../../api/axios.js";
import { TableSkeleton } from "../Loader/Skeletons.jsx";
import { formatINR, shortId } from "../../utils/format.js";

const PLACEHOLDER = "https://placehold.co/80x80/0f172a/ea580c?text=G";

export default function ViewProducts() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    let isActive = true;

    const getData = async () => {
      try {
        const res = await api.get("/admin/productanalytics/");
        if (res.status === 200 && isActive) {
          setData(res.data.results || []);
        }
      } catch (error) {
        console.log(error);
      } finally {
        if (isActive) setLoading(false);
      }
    };

    getData();
    return () => {
      isActive = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const term = searchInput.toLowerCase().trim();
    if (!term) return data;
    return data.filter((item) => item?.name?.toLowerCase().includes(term));
  }, [data, searchInput]);

  return (
    <div>
      <form
        className="relative w-full"
        onSubmit={(e) => e.preventDefault()}
        role="search"
      >
        <SearchIcon
          fontSize="small"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-navy-400"
        />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="input-base pl-10"
          placeholder="Search products by name…"
          aria-label="Search products"
        />
      </form>

      <div className="card mt-5 overflow-hidden">
        {loading ? (
          <div className="p-4">
            <TableSkeleton rows={6} cols={5} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-navy-100">
              <thead className="bg-navy-50 text-left text-sm uppercase tracking-wider text-navy-500">
                <tr>
                  <th className="px-5 py-3">Product</th>
                  <th className="px-5 py-3">ID</th>
                  <th className="px-5 py-3">Price</th>
                  <th className="px-5 py-3">Stock</th>
                  <th className="px-5 py-3">Sold</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {filtered.length > 0 ? (
                  filtered.map((item, index) => (
                    <tr
                      key={item?._id || index}
                      className="transition hover:bg-navy-50"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={item?.coverImage || PLACEHOLDER}
                            alt={item?.name || "Product"}
                            loading="lazy"
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-lg object-cover"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = PLACEHOLDER;
                            }}
                          />
                          <span className="font-medium text-navy-900">
                            {item?.name || "Unnamed"}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3 font-mono text-xs text-navy-500">
                        {shortId(item?._id)}
                      </td>
                      <td className="px-5 py-3 font-semibold text-navy-900">
                        {formatINR(item?.price)}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`rounded-full px-3 py-1 text-sm font-semibold ${
                            (item?.stock ?? 0) <= 20
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {item?.stock ?? 0}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-navy-700">
                        {item?.totalQuantitySold ?? 0}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-8 text-center text-navy-400"
                    >
                      No products found.
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
