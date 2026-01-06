import mongoose from "mongoose";

export interface ISportEvent extends mongoose.Document {
  name: string;
  sport: string;
  maxParticipants: number;
  createdBy: mongoose.Schema.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  timestamps: true;
  participants: mongoose.Schema.Types.ObjectId[];
}

export const SPORT_TYPES = [
  "Soccer",
  "Basketball",
  "Tennis",
  "Baseball",
  "Volleyball",
] as const;

const sportEventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Event name is required"],
      trim: true,
      minlength: [3, "Event name must be at least 3 characters"],
      maxlength: [100, "Event name must not exceed 100 characters"],
    },
    sport: {
      type: String,
      required: [true, "Sport type is required"],
      enum: {
        values: SPORT_TYPES,
        message: "{VALUE} is not a supported sport",
      },
    },
    maxParticipants: {
      type: Number,
      required: [true, "Maximum participants is required"],
      min: [2, "Minimum 2 participants required"],
      max: [100, "Maximum 100 participants allowed"],
    },
    startTime: {
      type: Date,
      required: [true, "Event start time is required"],
    },
    endTime: {
      type: Date,
      required: [true, "Event end time is required"],
      validate: {
        validator: function (value: Date) {
          // 'this' refers to the document being validated
          return value > this.startTime;
        },
        message: "End time must be after start time",
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const SportEvent = mongoose.model<ISportEvent>("SportEvent", sportEventSchema);

export default SportEvent;
