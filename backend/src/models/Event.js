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
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const eventSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    shortId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      minlength: 6,
      maxlength: 8,
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
    createdAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
      expires: 0,
      index: true,
    },
    isExpired: {
      type: Boolean,
      default: false,
      index: true,
    },
    responses: {
      type: [responseSchema],
      default: [],
    },
  },
  {
    timestamps: {
      createdAt: false,
      updatedAt: true,
    },
  }
);

export const Event = mongoose.model("Event", eventSchema);

