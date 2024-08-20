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
      if (
        !mongoose.isValidObjectId(products[i].id) ||
        Object.keys(products).length !== 2
      )
        throw Error("Invalid Product");

      pr = await isValidProduct(products[i].id);

      if (!pr || pr == null) {
        return res
          .status(400)
          .json({ message: "Invalid Product", success: false });
      }

      totalAmount += pr.price * products[i].quantity; // summing up amount

      pr.stock -= products[i].quantity; // reduce the stock
      productCount += products[i].quantity;

      //saving the details of product wrt to an specific order
      orderData = await OrderDetail.create({
        orderId: order._id,
        productId: pr._id,
        price: pr.price,
        quantity: products[i].quantity,
      });

      data = await OrderDetail.findById(orderData._id);

      if (!data)
        return res.status(500).json({ message: "Product could not processed" });

      console.log("---------------------");
      await pr.save(); // saving updated stock of product
    }

    console.log("amount before discount ", totalAmount);

    // fill in other order details and save it
    order.customer = req.user?._id;
    if (productCount > 10) order.totalCost = totalAmount - totalAmount * 0.1;
    else order.totalCost = totalAmount;

    console.log("amount post discount ", order.totalCost);

    const date = new Date();
    order.orderDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

    await order.save(); // saving order

    const isOrderExists = await Order.findById(order._id);

    if (!isOrderExists) throw Error("Order was not saved");

    await Payment.create({
      orderId: order._id,
      paymentAmount: isOrderExists.totalCost,
      userId:req.user._id
    });

    return res
      .status(200)
      .json({ message: "Order created and payment is pending" });
  } catch (error) {
    return res.json({
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

    const products = await OrderDetail.deleteMany({ orderId });

    if (!products)
      return res
        .status(404)
        .json({ message: "Products with order id not found" });

    for (let i = 0; i < products.length; i++) {
      if (!mongoose.isValidObjectId(products[i].productId))
        throw Error("Invalid product id");

      let product = await isValidProduct(products[i].productId);

      if (!product) throw Error("Product does not exist");

      product.stock += products[i].quantity;

      await product.save();
    }

    await Payment.deleteOne({ orderId }); // deleting payment record
    await Order.findByIdAndDelete(orderId);

    return res
      .status(200)
      .json({ message: "Order cleared succesfully", success: true });
  } catch (error) {
    return res.json({
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
