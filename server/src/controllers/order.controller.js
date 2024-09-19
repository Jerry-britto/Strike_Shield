import mongoose from "mongoose";
import { Order } from "../models/order.model.js";
import { OrderDetail } from "../models/orderDetails.model.js";
import { Product } from "../models/product.model.js";
import { Payment } from "../models/payment.model.js";

async function isValidProduct(id) {
  const product = await Product.findById(id);
  if (product) return product;
  return null;
}

// add order
export async function placeOrder(req, res) {
  try {
    const { products } = req.body;

    // verifying the input
    if (!Array.isArray(products) && products.length === 0) {
      return res
        .status(400)
        .json({ message: "Kindly provide a list of products" });
    }

    const order = new Order(); // creating new order

    let totalAmount = 0,
      productCount = 0; // for calculating total amount
    let pr; // for holding each product
    let orderData; // holding created order detail data
    let data;

    // process all the products and check whether it exists or not and calculate total amount
    for (let i = 0; i < products.length; i++) {
      console.log(products[i]);

      if (!mongoose.isValidObjectId(products[i].id))
        throw Error("Invalid Product");

      pr = await isValidProduct(products[i].id);

      if (!pr) {
        return res
          .status(400)
          .json({ message: "Invalid Product", success: false });
      }

      if (pr.stock < products[i].quantity) {
        // managing inventory
        return res
          .status(409)
          .json({ message: "Out of stock", pname: pr.name, success: false });
      }

      totalAmount += pr.price * products[i].quantity; // summing up amount

      pr.stock -= products[i].quantity; // reduce the stock
      productCount += products[i].quantity;

      //saving the details of product wrt to an specific order
      orderData = await OrderDetail.create({
        orderId: order._id,
        productId: pr._id,
        quantity: products[i].quantity,
      });

      data = await OrderDetail.findById(orderData._id);

      if (!data)
        return res.status(500).json({ message: "Product could not processed" });

      console.log("---------------------");
      await pr.save(); // saving updated stock of product
    }

    // fill in other order details and save it
    order.customer = req.user?._id;
    order.totalCost = totalAmount;
    const date = new Date();
    order.orderDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    await order.save(); // saving order

    const payment = new Payment();
    let discountedCost = 0,
      gstCost = totalAmount * 0.03; // applying gst

    if (productCount >= 10) {
      // applying discount
      discountedCost = totalAmount * 0.1;
      payment.discount = true;
    }

    payment.paymentAmount = totalAmount + gstCost - discountedCost;
    payment.orderId = order._id;
    payment.userId = req.user._id;
    await payment.save();

    return res.status(200).json({
      message: "Order created and payment is pending",
      paymentId: payment._id,
      orderId: payment.orderId,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "could not process order",
      reason: error.message,
      success: false,
    });
  }
}

// clear order
export async function clearOrder(req, res) {
  try {
    const { orderId } = req.params;

    if (orderId === "")
      return res.status(400).json({ message: "No order id received" });

    const order = await Order.findById(orderId);

    if (!order) {
      throw Error("Order does not exist");
    }

    const orderDetails = await OrderDetail.find({ orderId });

    console.log(orderDetails);

    if (!orderDetails)
      return res
        .status(404)
        .json({ message: "Products with order id not found" });

    for (let i = 0; i < orderDetails.length; i++) {
      if (!mongoose.isValidObjectId(orderDetails[i].productId))
        throw Error("Invalid product id");

      let product = await isValidProduct(orderDetails[i].productId);

      if (!product) throw Error("Product does not exist");
      console.log("product - ", product);

      product.stock += orderDetails[i].quantity;

      await product.save();
    }

    await OrderDetail.deleteMany({ orderId });
    await Payment.deleteOne({ orderId }); // deleting payment record
    await Order.findByIdAndDelete(orderId);

    return res
      .status(200)
      .json({ message: "Order cleared succesfully", success: true });
  } catch (error) {
    return res.status(500).json({
      message: "could not clear order",
      success: false,
      reason: error.message,
    });
  }
}

/*
[
  {
  product Id,
  quantity,
  }
]
*/
