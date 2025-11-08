import mongoose from "mongoose";

interface IRefreshToken extends mongoose.Document {
  token: string;
  userId: mongoose.Schema.Types.ObjectId;
  expiresAt: Date;
  createdAt: Date;
}

const refreshTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
      index: true, // for faster lookups
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // Reference to User model
      index: true,
    },
    expiresAt: { type: Date, required: true, index: { expires: 0 } }, // auto-delete expired tokens
  },
  { timestamps: true }
);

const RefreshToken = mongoose.model<IRefreshToken>(
  "RefreshToken",
  refreshTokenSchema
);

export default RefreshToken;
