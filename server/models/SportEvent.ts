import mongoose from "mongoose";

interface ISportEvent extends mongoose.Document {
  name: string;
  sport: string;
  maxParticipants: number;
  createdBy: mongoose.Schema.Types.ObjectId;
  timestamps: true;
  participants: mongoose.Schema.Types.ObjectId[];
}

const sportEventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sport: { type: String, required: true },
    maxParticipants: { type: Number, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
