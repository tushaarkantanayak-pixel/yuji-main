import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Banner from "@/models/Banner";

export async function GET() {
  try {
    await connectDB();

    const banners = await Banner.find() // 👈 FILTER HERE
      .sort({ bannerDate: -1 })
      .lean();

    return NextResponse.json({
      statusCode: 200,
      success: true,
      message: "All banners retrieved",
      data: banners,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to load banners",
      },
      { status: 500 }
    );
  }
}




// export async function GET() {
//   try {
//     const data = {
//       statusCode: 200,
//       success: true,
//       message: "All banners retrieved",
// data: [
//   {
//     bannerImage:
//       "https://res.cloudinary.com/dk0sslz1q/image/upload/v1766143761/111111off_w8m8ix.jpg",
//     bannerFrom: "Yuji Main Store",
//     bannerLink: "https://meowji.store",
//     bannerTitle: "Christmas Sale – 2% OFF Every Pack 🎄",
//     bannerSlug: "yuji-christmas-sale-2-percent-off",
//     gameId: ["mlbb"],
//     bannerDate: "2025-04-30T00:00:00.000Z",
//     bannerSummary:
//       "Christmas Sale is live! Enjoy 2% OFF on every MLBB Diamond pack. Limited-time festive offer 🎁",
//     isShow: true,
//     __v: 0,
//   },
//   {
//     bannerImage:
//       "https://res.cloudinary.com/dk0sslz1q/image/upload/v1766143761/yujimlb_bkeikj.jpg",
//     bannerFrom: "Yuji Main Store",
//     bannerLink: "https://meowji.store",
//     bannerTitle: "Safe, Secure & Trusted Top-Ups",
//     bannerSlug: "yuji-safe-secure-best-store",
//     gameId: [],
//     bannerDate: "2025-04-29T00:00:00.000Z",
//     bannerSummary:
//       "Safe and secure payments with instant delivery. Yuji Main Store – trusted by gamers for reliable top-ups.",
//     isShow: true,
//     __v: 0,
//   },
//   {
//     bannerImage:
//       "https://res.cloudinary.com/dk0sslz1q/image/upload/v1766143761/mlbd_nc0nhi.jpg",
//     bannerFrom: "Yuji Main Store",
//     bannerLink: "https://meowji.store",
//     bannerTitle: "Top Up in Your ID Today",
//     bannerSlug: "yuji-topup-in-your-id-today",
//     gameId: ["mlbb"],
//     bannerDate: "2025-04-29T00:00:00.000Z",
//     bannerSummary:
//       "Top up directly in your game ID today. Fast processing, instant diamonds, and 24/7 support.",
//     isShow: true,
//     __v: 0,
//   },
// ]



//     };

//     return Response.json(data);
//   } catch (error) {
//     return Response.json(
//       {
//         success: false,
//         message: "Failed to load banners",
//       },
//       { status: 500 }
//     );
//   }
// }
