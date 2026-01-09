import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    userId: { type: String, unique: true },   // our generated ID
    name: String,
    email: { type: String, unique: true, sparse: true },
    phone: { type: String, unique: true, sparse: true },
    password: String,
    wallet: { type: Number, default: 0 },
    order: { type: Number, default: 0 },
       userType: {
      type: String,
      enum: ["user", "admin", "owner","member"],
      default: "user",
    },
     resetOtp: String,
  resetOtpExpiry: Date,
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
