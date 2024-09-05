import React, { useEffect, useState } from "react";
import AnalyticCard from "../../components/Admin/AnalyticCard";
import { BarChart } from "@mui/x-charts/BarChart";
import Axios from "axios";

export default function DashBoardPage() {
  const [pData, setPData] = useState([2400, 1398, 9800, 390]);
  const [oData, setOData] = useState([5,55,6,66]);
  const [topItemsSold, setTopItemssold] = useState([{}, {}, {}]);
  const xLabels = ["June", "July", "August", "September"];

  const [data, setData] = useState();

  const setRevenue = (monthlyRevenue) => {
    let monthlyRevenueData = [];
    let monthlyOrderData = [];
    console.log("received reven ", monthlyRevenue);
    monthlyRevenue.forEach((element) => {
      monthlyRevenueData.push(element.totalRevenue);
      monthlyOrderData.push(element.totalOrders);
    });
    console.log("monthly revenues - ", monthlyRevenueData);

    setPData(monthlyRevenueData);
    setOData(monthlyOrderData);
  };

  const getAnalytics = async () => {
    try {
      const res = await Axios.get(
        "http://localhost:8000/api/v1/admin/analytics",
        { withCredentials: true }
      );

      console.log(res.data);
      setData(res.data);
      setRevenue(res.data.monthlyOrderRevenue);
      setTopItemssold(res.data.topSoldProductList);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAnalytics();
  }, []);

  return (
    <div className="bg-orange-200 min-h-screen">
      <div
        id="first_section"
        className="w-full flex justify-center flex-wrap  gap-10 "
      >
        <AnalyticCard
          title={"Revenue"}
          content={`₹ ${data?.totalSales || 5}`}
        />
        <AnalyticCard
          title={"Registered Users"}
          content={`${data?.registeredUserCount || 5}`}
        />
        <AnalyticCard
          title={"Products Sold"}
          content={`${data?.productsSoldCount || 5}`}
        />
        <AnalyticCard title={"orders"} content={data?.totalOrderCount || 5} />
      </div>
      <div className="w-full flex flex-wrap justify-center mt-5">
        <div className=" bg-white mr-3 p-2 rounded-md">
          <h1 className="font-bold text-3xl">Monthly Sales</h1>
          <BarChart
            width={500}
            height={300}
            series={[{ data: pData, label: "Total Revenue", id: "pvId" }]}
            xAxis={[{ data: xLabels, scaleType: "band" }]}
          />
        </div>
        <div className=" bg-white mr-3 p-2 rounded-md">
          <h1 className="font-bold text-3xl">Monthly orders</h1>
          <BarChart
            width={500}
            height={300}
            series={[{ data: oData, label: "Total orders", id: "pvId",color:"green" }]}
            xAxis={[{ data: xLabels, scaleType: "band" }]}
          />
        </div>
      </div>
      <div className="max-w-3xl bg-slate-50 rounded-xl mx-auto ">
        {/* Table Heading */}
        <h2 className="text-3xl font-bold text-center mt-4 text-gray-800">
          Top Sold Products
        </h2>

        {/* Table */}
        <div className="overflow-x-auto mx-2 shadow-md sm:rounded-lg">
          <table className="min-w-full mx-2 bg-white divide-y divide-gray-200 table-auto">
            <thead className="bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Sr. no
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Product Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Quantity sold
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topItemsSold &&
                topItemsSold.map(
                  (ele, index) =>
                    index < 3 && (
                      <tr className={``}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {ele?.productName || "boxing glove"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {ele?.totalQuantitySold || 5}
                        </td>
                      </tr>
                    )
                )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


