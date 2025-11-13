import mongoose from "mongoose";

interface IPasswordResetToken extends mongoose.Document {
  token: string;
  userId: mongoose.Schema.Types.ObjectId;
  expiresAt: Date;
  createdAt: Date;
}

const passwordResetTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
  },
  { timestamps: true }
);

const PasswordResetToken = mongoose.model<IPasswordResetToken>(
  "PasswordResetToken",
  passwordResetTokenSchema
);

export default PasswordResetToken;
