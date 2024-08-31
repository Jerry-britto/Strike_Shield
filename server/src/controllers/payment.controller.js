import mongoose from "mongoose";
import { Payment } from "../models/payment.model.js";
import { User } from "../models/user.model.js";

// generate invoice
const generateReceipt = async (paymentId) => {
  const receipt = await Payment.aggregate([
    {
      $match: {
        _id: paymentId,
      },
    },
    {
      $lookup: {
        from: "orderdetails",
        localField: "orderId",
        foreignField: "orderId",
        as: "items",
      },
    },
    {
      $unwind: "$items",
    },
    {
      $lookup: {
        from: "products",
        localField: "items.productId",
        foreignField: "_id",
        as: "productData",
      },
    },
    {
      $group: {
        _id: null, // Group all documents into a single result
        bill: {
          $push: {
            quantity: "$items.quantity",
            productData: {
              id: { $first: "$productData._id" },
              name: { $first: "$productData.name" },
              price: { $first: "$productData.price" },
            },
          },
        }, // Combine items and productData
      },
    },
  ]);

  const items = receipt[0]["bill"];
  // console.log(items);
  if (items.length === 0) {
    return null;
  }
  return items;
};

// place payment for pending orders
export async function makePayment(req, res) {
  try {
    const { paymentId } = req.params;

    if (!paymentId || !mongoose.isValidObjectId(paymentId))
      return res.status(400).json({ message: "id not found", success: false });

    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res
        .status(404)
        .json({ message: "Order not placed for the payment" });
    }

    const orderDetails = await generateReceipt(payment._id);

    if (!orderDetails) {
      return res.status(404).json({ message: "Order not found" });
    }

    const userTokens = req.user.tokens;

    const admin = await User.findOne({ isAdmin: true });

    let originalTotalCost = payment.paymentAmount;

    if (originalTotalCost < 500) {
      originalTotalCost += 50; // delivery charges
      payment.paymentAmount += 50; // updating it in db
      payment.deliveryCharge = true;
    }

    if (userTokens < originalTotalCost) {
      return res
        .status(400)
        .json({ message: "Do not have enough tokens", success: false });
    }

    console.log("user tokens before deduction - ", req.user.tokens);
    console.log("admin tokens before deduction - ", admin.tokens);

    // debit and credit
    req.user.tokens -= originalTotalCost;
    admin.tokens += originalTotalCost;

    console.log("user tokens after deduction - ", req.user.tokens);
    console.log("admin tokens after deduction - ", admin.tokens);
    payment.status = "SUCCESS";

    const receipt = {
      paymentId: payment._id,
      orderId: payment.orderId,
      orderDetails,
      totalCost: originalTotalCost,
      GST: "3%",
      discount: payment.discount,
      deliveryCharges: payment.deliveryCharge,
      paymentStatus: payment.status,
    };

    // saving updated details
    await req.user.save();
    await admin.save();
    await payment.save();

    return res
      .status(200)
      .json({ message: "Payment successful", success: true, receipt });
  } catch (error) {
    return res.status().json({
      message: "payment fail",
      reason: error.message,
      success: false,
    });
  }
}

// get payments
export async function getPayment(req, res) {
  try {
    const userId = req.user._id;

    const payments = await Payment.find({ userId });

    if (!payments || payments.length === 0) {
      return res
        .status(200)
        .json({ message: "No payments made", success: true });
    }

    console.log(payments);

    const receiptPromises = payments.map(async (payment) => {
      return {
        paymentId: payment._id,
        details: await generateReceipt(payment._id),
        totalCost: payment.paymentAmount,
        discount: payment.discount,
        status: payment.status,
      };
    });

    let paymentDetails = await Promise.all(receiptPromises);

    return res.status(200).json({
      message: "Payments retrevied successfully",
      success: true,
      paymentDetails,
    });
  } catch (error) {
    return res.status(500).json({ message: "Could not get your payments" });
  }
}

// get orders based on pending payments
export async function getPendingPayments(req, res) {
  try {
    const userId = req.user._id;

    const pendingPayments = await Payment.find({ status: "PENDING" });

    if (!pendingPayments || pendingPayments.length === 0) {
      return res.status(404).json({ message: "No Pending payments" });
    }

    const pendingOrderDetals = await Payment.aggregate([
      {
        $match: {
          userId,
        },
      },
      {
        $lookup: {
          from: "orderdetails",
          localField: "orderId",
          foreignField: "orderId",
          as: "items",
        },
      },
      {
        $unwind: "$items",
      },
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "productData",
        },
      },
      {
        $group: {
          _id: "$items.orderId", // Group by product ID
          productDetails: {
            $push: {
              productid: "$productData._id",
              productName: "$productData.name",
              image: "$productData.coverImage",
              quantity: "$items.quantity",
              price: "$productData.price",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          productDetails: 1,
        },
      },
    ]);

    console.log(pendingOrderDetals);
    return res.json(pendingOrderDetals);
  } catch (error) {
    return res.status(500).json({
      message: "Could not retrieve pending payments",
      reason: error.message,
    });
  }
}
