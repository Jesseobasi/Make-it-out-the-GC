import mongoose from "mongoose";

const responseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    availability: {
      type: Map,
      of: {
        type: String,
        enum: ["yes", "maybe", "no"],
      },
      default: {},
    },
  },
  { _id: false }
);

const eventSchema = new mongoose.Schema(
  {
    eventId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    responses: {
      type: [responseSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Event = mongoose.model("Event", eventSchema);

