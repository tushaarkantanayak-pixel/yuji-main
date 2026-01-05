import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User";
import crypto from "crypto";

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

    /* ================= VALIDATION ================= */
    if (
      !gameSlug ||
      !itemSlug ||
      !playerId ||
      !zoneId ||
      !paymentMethod ||
      !price
    ) {
      return NextResponse.json({
        success: false,
        message: "Missing required fields",
      });
    }

    if (!email && !phone) {
      return NextResponse.json({
        success: false,
        message: "Provide either email or phone",
      });
    }

    /* ================= CREATE SECURE ORDER ID ================= */
    const orderId =
      "TOPUP_" +
      Date.now().toString(36) +
      "_" +
      crypto.randomBytes(8).toString("hex");

    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 mins

    /* ================= CREATE LOCAL ORDER ================= */
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

      status: "pending",
      paymentStatus: "pending",
      topupStatus: "pending",

      expiresAt,
    });

    /* ================= UPDATE USER ORDER COUNT ================= */
    if (userId) {
      await User.findOneAndUpdate(
        { userId },
        { $inc: { order: 1 } },
        { new: true }
      );
    }

    /* ================= CREATE PAYMENT (XTRAGATEWAY) ================= */
    const formData = new URLSearchParams();
    if (phone) formData.append("customer_mobile", phone);
    formData.append("user_token", process.env.XTRA_USER_TOKEN!);
    formData.append("amount", String(price));
    formData.append("order_id", orderId);

    formData.append(
      "redirect_url",
      `${process.env.NEXT_PUBLIC_BASE_URLU}/payment/topup-complete`
    );

    // Metadata
    formData.append("remark1", userId || "NO-USER");
    formData.append("remark2", itemSlug);

    const resp = await fetch("https://xyzpay.site/api/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    });

    const data = await resp.json();

    /* ================= PAYMENT ORDER CREATION FAILED ================= */
    if (!data?.status) {
      return NextResponse.json({
        success: false,
        message: data?.message || "Payment gateway error",
      });
    }

    /* ================= SAVE GATEWAY ORDER ID ================= */
    newOrder.gatewayOrderId = data.result.orderId;
    await newOrder.save();

    /* ================= RESPONSE ================= */
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
      {
        success: false,
        message: "Server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
