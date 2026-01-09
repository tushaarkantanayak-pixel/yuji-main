import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import PricingConfig from "@/models/PricingConfig";

/* ================= MEMBERSHIP CONFIG ================= */
const MEMBERSHIPS = {
  "silver-membership": {
    gameName: "Silver Membership",
    gameFrom: "Your Platform",
    gameImageId: {
      image:
        "https://res.cloudinary.com/dk0sslz1q/image/upload/v1767096434/rs_klee62.png",
    },
    gameDescription: "Unlock premium pricing and basic benefits.",
    inputFieldOne: "User Email / Phone",
    inputFieldTwoOption: [],
    isValidationRequired: false,
    gameAvailablity: true,
    itemId: [
      {
        itemName: "1 Month",
        itemSlug: "silver-1m",
        sellingPrice: 99,
        dummyPrice: 299,
        itemAvailablity: true,
        index: 1,
        itemImageId: {
          image:
            "https://res.cloudinary.com/dk0sslz1q/image/upload/v1767096434/rs_klee62.png",
        },
      },
      {
        itemName: "3 Month",
        itemSlug: "silver-3m",
        sellingPrice: 299,
        dummyPrice: 1099,
        itemAvailablity: true,
        index: 3,
        itemImageId: {
          image:
            "https://res.cloudinary.com/dk0sslz1q/image/upload/v1767096434/rs_klee62.png",
        },
      },
    ],
  },

  "reseller-membership": {
    gameName: "Reseller Membership",
    gameFrom: "Your Platform",
    gameImageId: {
      image:
        "https://res.cloudinary.com/dk0sslz1q/image/upload/v1767096434/sew_zcz775.png",
    },
    gameDescription: "Get reseller pricing, bulk access & dashboard.",
    inputFieldOne: "User Email / Phone",
    inputFieldTwoOption: [],
    isValidationRequired: false,
    gameAvailablity: true,
    itemId: [
      {
        itemName: "1 Month",
        itemSlug: "reseller-1m",
        sellingPrice: 99,
        dummyPrice: 299,
        itemAvailablity: true,
        index: 1,
        itemImageId: {
          image:
            "https://res.cloudinary.com/dk0sslz1q/image/upload/v1767096434/sew_zcz775.png",
        },
      },
      {
        itemName: "3 Month",
        itemSlug: "reseller-3m",
        sellingPrice: 299,
        dummyPrice: 1099,
        itemAvailablity: true,
        index: 3,
        itemImageId: {
          image:
            "https://res.cloudinary.com/dk0sslz1q/image/upload/v1767096434/sew_zcz775.png",
        },
      },
    ],
  },
};

/* ================= OTT CONFIG ================= */
const OTTS = {
  "youtube-premium": {
    gameName: "YouTube Premium",
    gameFrom: "Google",
    gameImageId: {
      image:
        "https://res.cloudinary.com/dk0sslz1q/image/upload/v1767027180/aa_avjoox.jpg",
    },
    gameDescription: "Ad-free YouTube, background play, YouTube Music.",
    inputFieldOne: "Email / Phone",
    inputFieldTwoOption: [],
    isValidationRequired: true,
    gameAvailablity: true,
    itemId: [
      {
        itemName: "1 Month",
        itemSlug: "yt-1m",
        sellingPrice: 30,
        dummyPrice: 199,
        itemAvailablity: true,
        index: 1,
        itemImageId: {
          image:
            "https://res.cloudinary.com/dk0sslz1q/image/upload/v1767027180/aa_avjoox.jpg",
        },
      },
      {
        itemName: "3 Months",
        itemSlug: "yt-3m",
        sellingPrice: 90,
        dummyPrice: 499,
        itemAvailablity: true,
        index: 2,
        itemImageId: {
          image:
            "https://res.cloudinary.com/dk0sslz1q/image/upload/v1767027180/aa_avjoox.jpg",
        },
      },
    ],
  },

  netflix: {
    gameName: "Netflix",
    gameFrom: "Netflix Inc.",
    gameImageId: {
      image:
        "https://res.cloudinary.com/dk0sslz1q/image/upload/v1767027180/s_d5mln0.jpg",
    },
    gameDescription: "Movies & series streaming subscription.",
    inputFieldOne: "Account Email",
    inputFieldTwoOption: [],
    isValidationRequired: true,
    gameAvailablity: true,
    itemId: [
      {
        itemName: "1 Month",
        itemSlug: "nf-1m",
        sellingPrice: 99,
        dummyPrice: 299,
        itemAvailablity: true,
        index: 1,
        itemImageId: {
          image:
            "https://res.cloudinary.com/dk0sslz1q/image/upload/v1767027180/s_d5mln0.jpg",
        },
      },
      {
        itemName: "3 Months",
        itemSlug: "nf-3m",
        sellingPrice: 249,
        dummyPrice: 799,
        itemAvailablity: true,
        index: 2,
        itemImageId: {
          image:
            "https://res.cloudinary.com/dk0sslz1q/image/upload/v1767027180/s_d5mln0.jpg",
        },
      },
    ],
  },

  instagram: {
    gameName: "Instagram Services",
    gameFrom: "Meta",
    gameImageId: {
      image:
        "https://res.cloudinary.com/dk0sslz1q/image/upload/v1767027180/a_jnlvg0.jpg",
    },
    gameDescription: "Followers, likes & engagement services.",
    inputFieldOne: "Username",
    inputFieldTwoOption: [],
    isValidationRequired: true,
    gameAvailablity: true,
    itemId: [
      {
        itemName: "1K Followers",
        itemSlug: "ig-1k",
        sellingPrice: 249,
        dummyPrice: 499,
        itemAvailablity: true,
        index: 1,
        itemImageId: {
          image:
            "https://res.cloudinary.com/dk0sslz1q/image/upload/v1767027180/a_jnlvg0.jpg",
        },
      },
      {
        itemName: "5K Followers",
        itemSlug: "ig-5k",
        sellingPrice: 1099,
        dummyPrice: 1999,
        itemAvailablity: true,
        index: 2,
        itemImageId: {
          image:
            "https://res.cloudinary.com/dk0sslz1q/image/upload/v1767027180/a_jnlvg0.jpg",
        },
      },
    ],
  },
};

/* ================= HELPERS ================= */
const normalizePricingRole = (role) =>
  role === "member" ? "admin" : role;

/* ================= API ================= */
export async function GET(req, { params }) {
  const { slug } = await params;

  try {
    /* ===== SHORT-CIRCUIT STATIC PRODUCTS ===== */
    if (OTTS[slug]) {
      return NextResponse.json({
        success: true,
        data: { gameSlug: slug, ...OTTS[slug] },
      });
    }

    if (MEMBERSHIPS[slug]) {
      return NextResponse.json({
        success: true,
        data: { gameSlug: slug, ...MEMBERSHIPS[slug] },
      });
    }

    /* ===== OPTIONAL JWT ===== */
    let userType = "user";
    const auth = req.headers.get("authorization");

    if (auth?.startsWith("Bearer ")) {
      try {
        const decoded = jwt.verify(
          auth.split(" ")[1],
          process.env.JWT_SECRET
        );
        if (decoded?.userType) userType = decoded.userType;
      } catch {}
    }

    const pricingUserType = normalizePricingRole(userType);

    /* ===== FETCH BASE GAME ===== */
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/game/${slug}`,
      {
        headers: {
          "x-api-key": process.env.API_SECRET_KEY,
        },
      }
    );

    const data = await response.json();
    if (!data?.data?.itemId) return NextResponse.json(data);

    /* ===== DB PRICING ===== */
    await connectDB();

    let pricingConfig = null;
    if (!["owner", "user"].includes(pricingUserType)) {
      pricingConfig = await PricingConfig.findOne({
        userType: pricingUserType,
      }).lean();
    }

    /* ===== APPLY PRICING ===== */
    const gameSlug = data.data.gameSlug;

    data.data.itemId = data.data.itemId
      .filter((item) => {
        if (data.data.gameName === "MLBB SMALL/PHP") {
          const price = Number(item.sellingPrice);
          if (item.itemName === "Weekly Pass") return false;
          if (price > 170) return false;
        }
        return true;
      })
      .map((item) => {
        const basePrice = Number(item.sellingPrice);
        let finalPrice = basePrice;

        const override = pricingConfig?.overrides?.find(
          (o) =>
            o.gameSlug === gameSlug &&
            o.itemSlug === item.itemSlug
        );

        if (override?.fixedPrice != null) {
          finalPrice = override.fixedPrice;
        } else {
          const slab = pricingConfig?.slabs?.find(
            (s) => basePrice >= s.min && basePrice < s.max
          );
          if (slab) {
            finalPrice = basePrice * (1 + slab.percent / 100);
          }
        }

        return {
          ...item,
          sellingPrice: Math.ceil(finalPrice),
        };
      });

    return NextResponse.json(data);
  } catch (err) {
    console.error("Game Fetch Error:", err);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
