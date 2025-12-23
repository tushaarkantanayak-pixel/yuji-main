import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const {
      gameSlug,
      itemSlug,
      itemName,
      playerId,
      zoneId,
      paymentMethod,
      price,
      email,
      phone,
      userId,
      currency = "INR",
    } = body;

    // --------------------------
    // VALIDATION
    // --------------------------
    if (!gameSlug || !itemSlug || !playerId || !zoneId || !paymentMethod || !price) {
      return NextResponse.json({ success: false, message: "Missing required fields" });
    }

    if (!email && !phone) {
      return NextResponse.json({ success: false, message: "Provide either email or phone" });
    }

    // --------------------------
    // CREATE LOCAL ORDER FIRST
    // --------------------------
    const orderId = "TOPUP" + Date.now();
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // Expires in 30 minutes

    const newOrder = await Order.create({
      orderId,
      gatewayOrderId: null,
      userId: userId || null,
      gameSlug,
      itemSlug,
      itemName,
      playerId,
      zoneId,
      paymentMethod,
      price,
      email: email || null,
      phone: phone || null,
      currency,
  status: "pending",           // overall
paymentStatus: "pending",    // payment not verified yet
topupStatus: "pending",      // topup not started yet

      expiresAt,
    });

    // --------------------------
    // UPDATE USER ORDER COUNT
    // --------------------------
    if (userId) {
      await User.findOneAndUpdate(
        { userId },
        { $inc: { order: 1 } },
        { new: true }
      );
    }

    // --------------------------
    // CREATE PAYMENT (XTRAGATEWAY)
    // --------------------------
    const formData = new URLSearchParams();
    formData.append("customer_mobile", phone);
    formData.append("user_token", process.env.XTRA_USER_TOKEN!);
    formData.append("amount", price.toString());
    formData.append("order_id", orderId);

    // UPI redirect URL (must not include trailing slash in env)
    formData.append(
      "redirect_url",
      `${process.env.NEXT_PUBLIC_BASE_URLU}/payment/topup-complete`
    );

    // ✨ Add metadata to remarks
    formData.append("remark1", userId || "NO-USER"); // identify user later
    formData.append("remark2", itemSlug);            // product identifier

    const resp = await fetch("https://xyzpay.site/api/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    });

    const data = await resp.json();

    // --------------------------
    // PAYMENT ORDER CREATION FAILED
    // --------------------------
    if (!data.status) {
      return NextResponse.json({ success: false, message: data.message });
    }

    // --------------------------
    // SAVE GATEWAY ORDER ID
    // --------------------------
    newOrder.gatewayOrderId = data.result.orderId;
    await newOrder.save();

    // --------------------------
    // RETURN PAYMENT URL
    // --------------------------
    return NextResponse.json({
      success: true,
      message: "Order created & payment initialized",
      orderId,
      gatewayOrderId: data.result.orderId,
      paymentUrl: data.result.payment_url,
    });

  } catch (error: any) {
    console.error("ORDER CREATE ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
