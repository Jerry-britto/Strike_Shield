import { User } from "../models/user.model.js";
import { Order } from "../models/order.model.js";
import { Payment } from "../models/payment.model.js";
import { OrderDetail } from "../models/orderDetails.model.js";

const topSoldItems = async () => {
  const topProductSold = await OrderDetail.aggregate([
    {
      // Group by productId and sum up the quantity for each product
      $group: {
        _id: "$productId",
        totalQuantitySold: { $sum: "$quantity" },
      },
    },
    {
      // Sort the results by totalQuantitySold in descending order
      $sort: { totalQuantitySold: -1 },
    },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    {
      $unwind: "$productDetails",
    },
    {
      $project: {
        _id: 0,
        productId: "$_id",
        productName: "$productDetails.name",
        totalQuantitySold: 1,
      },
    },
  ]);

  return topProductSold;
};

const ordersWithPayment = async () => {
  const ordersRecord = await Order.aggregate([
    {
      $lookup: {
        from: "payments",
        localField: "_id",
        foreignField: "orderId",
        as: "payment",
      },
    },
    {
      $unwind: "$payment",
    },
    {
      $project: {
        _id: 1,
        customer: 1,
        payment: "$payment.receipt",
      },
    },
  ]);

  return ordersRecord;
};

const getMonthlyOrderAndRevenue = async () => {
  const results = await Payment.aggregate([
    {
      // Group by year and month directly using $dateToString
      $group: {
        _id: {
          yearMonth: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        },
        totalRevenue: { $sum: "$paymentAmount" }, // Sum up the payment amounts for revenue
        totalOrders: { $sum: 1 }, // Count the number of orders
      },
    },
    {
      $sort: {
        // sorting based on year and month
        "_id.yearMonth": 1,
      },
    },
    {
      $project: {
        _id: 0,
        yearMonth: "$_id.yearMonth",
        totalRevenue: 1,
        totalOrders: 1,
      },
    },
  ]);

  return results;
};

export async function getAnalytics(req, res) {
  try {
    // finding total sales
    const totalSales = await Payment.aggregate([
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$paymentAmount" },
        },
      },
    ]);

    console.log("total sales - ", totalSales[0].totalSales.toFixed(2));

    // finding the total number of users registered
    const users = await User.countDocuments();
    console.log("total users - ", users);

    // finding the total products sold
    const totoalProductsSold = await OrderDetail.aggregate([
      {
        $group: {
          _id: null, // Group all documents into a single result
          totalItemsSold: { $sum: "$quantity" },
        },
      },
    ]);
    console.log("Total products sold - ", totoalProductsSold[0].totalItemsSold);

    // finding the total number of orders
    const totalOrders = await Order.countDocuments();
    console.log("orders count - ", totalOrders);

    // top sold items
    const topSoldProducts = await topSoldItems();

    if (topSoldProducts.length === 0) {
      return res.status(500).json({ message: "no items were sold" });
    }

    console.log("top sold items", topSoldProducts);

    // order with payment
    const ordersRecord = await ordersWithPayment();

    if (ordersRecord.length === 0) {
      return res.status(500).json({ message: "no orders were placed" });
    }
    console.log("orders with payments ", ordersRecord);

    // combination of monthly orders and revenue
    const monthlyOrderAndSales = await getMonthlyOrderAndRevenue();

    console.log("monthly order and revenue - ", monthlyOrderAndSales);

    return res.status(200).json({
      message: "retrieved analytics succesfully",
      totalSales: totalSales[0].totalSales.toFixed(2),
      registeredUserCount: users,
      productsSoldCount: totoalProductsSold[0].totalItemsSold,
      totalOrderCount: totalOrders,
      topSoldProductList: topSoldProducts,
      orderHistory: ordersWithPayment,
      monthlyOrderRevenue: monthlyOrderAndSales,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "could not get analytics", reason: error.message });
  }
}
