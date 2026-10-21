import { useEffect, useState } from "react";
import { lazy, Suspense } from "react";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import GroupsIcon from "@mui/icons-material/Groups";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AnalyticCard from "../../components/Admin/AnalyticCard.jsx";
import api from "../../api/axios.js";
import { formatINR, formatNumber } from "../../utils/format.js";

// MUI X Charts is heavy — load it only when the dashboard is actually shown.
const BarChart = lazy(() =>
  import("@mui/x-charts/BarChart").then((m) => ({ default: m.BarChart }))
);

const MONTHS = ["June", "July", "August", "September"];

function ChartFallback() {
  return (
    <div className="skeleton h-[300px] w-full" aria-label="Loading chart" />
  );
}

export default function DashBoardPage() {
  const [pData, setPData] = useState([]);
  const [oData, setOData] = useState([]);
  const [topItemsSold, setTopItemsSold] = useState([]);
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const getAnalytics = async () => {
      try {
        const res = await api.get("/admin/analytics");
        if (!isActive) return;
        const monthlyRevenue = res.data?.monthlyOrderRevenue || [];
        setData(res.data);
        setPData(monthlyRevenue.map((el) => el.totalRevenue));
        setOData(monthlyRevenue.map((el) => el.totalOrders));
        setTopItemsSold(res.data?.topSoldProductList || []);
      } catch (error) {
        console.log(error);
      } finally {
        if (isActive) setLoading(false);
      }
    };

    getAnalytics();
    return () => {
      isActive = false;
    };
  }, []);

  const stats = [
    {
      icon: AttachMoneyIcon,
      title: "Total Revenue",
      content: formatINR(data?.totalSales ?? 0),
      hint: "Lifetime",
    },
    {
      icon: GroupsIcon,
      title: "Registered Users",
      content: formatNumber(data?.registeredUserCount ?? 0),
      hint: "All accounts",
    },
    {
      icon: ShoppingCartIcon,
      title: "Products Sold",
      content: formatNumber(data?.productsSoldCount ?? 0),
      hint: "Units",
    },
    {
      icon: ReceiptIcon,
      title: "Orders",
      content: formatNumber(data?.totalOrderCount ?? 0),
      hint: "Total placed",
    },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-navy-900">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <AnalyticCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="text-lg font-bold text-navy-900">Monthly Sales</h2>
          <div className="mt-3">
            <Suspense fallback={<ChartFallback />}>
              <BarChart
                height={300}
                series={[{ data: pData, label: "Revenue", id: "rev" }]}
                xAxis={[{ data: MONTHS, scaleType: "band" }]}
                colors={["#ea580c"]}
              />
            </Suspense>
          </div>
        </div>
        <div className="card p-5">
          <h2 className="text-lg font-bold text-navy-900">Monthly Orders</h2>
          <div className="mt-3">
            <Suspense fallback={<ChartFallback />}>
              <BarChart
                height={300}
                series={[{ data: oData, label: "Orders", id: "ord" }]}
                xAxis={[{ data: MONTHS, scaleType: "band" }]}
                colors={["#0f172a"]}
              />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Top products */}
      <div className="card mt-6 overflow-hidden">
        <h2 className="px-5 pt-5 text-lg font-bold text-navy-900">
          Top Sold Products
        </h2>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full divide-y divide-navy-100">
            <thead className="bg-navy-50 text-left text-sm uppercase tracking-wider text-navy-500">
              <tr>
                <th className="px-5 py-3">#</th>
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">Quantity sold</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-5 py-6 text-center text-navy-400">
                    Loading…
                  </td>
                </tr>
              ) : topItemsSold.length > 0 ? (
                topItemsSold.slice(0, 5).map((ele, index) => (
                  <tr key={ele?.productName || index} className="hover:bg-navy-50">
                    <td className="px-5 py-4 font-semibold text-navy-400">
                      {index + 1}
                    </td>
                    <td className="px-5 py-4 font-medium text-navy-900">
                      {ele?.productName || "—"}
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700">
                        {ele?.totalQuantitySold ?? 0}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-5 py-6 text-center text-navy-400">
                    No sales data yet.
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
