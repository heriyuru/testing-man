import { NextResponse } from "next/server";
import connectionToDatabase from "../../../../../lib/mongoose";
import Order from "../../../../../models/Order";
import AcceptedOrder from "../../../../../models/AcceptedOrder";

export async function POST(request) {
  await connectionToDatabase();

  try {
    const { orderId, rest } = await request.json();

    if (!orderId) {
      return NextResponse.json({ success: false, message: "Order ID is required" }, { status: 400 });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    // --- CRITICAL FIX START ---
    const orderData = order.toObject();

    // 1. Assign the old _id to the 'orderId' field so it is not null
    const newEntryData = {
      ...orderData,
      orderId: orderData._id, // Map the ID here
      rest: rest
    };

    // 2. Remove the original _id and __v so AcceptedOrder generates a fresh unique ID
    delete newEntryData._id;
    delete newEntryData.__v;

    await AcceptedOrder.create(newEntryData);
    // --- CRITICAL FIX END ---

    await Order.findByIdAndDelete(orderId);

    return NextResponse.json({ success: true, message: "Order accepted and moved" });
  } catch (err) {
    console.error("❌ Accept order error:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}