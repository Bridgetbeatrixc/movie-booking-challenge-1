import mongoose from "mongoose";

const hallSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      required: true,
      trim: true
    },
    seats: {
      type: Number,
      required: true,
      min: 1
    },
    status: {
      type: String,
      required: true,
      trim: true,
      default: "Open"
    }
  },
  {
    timestamps: true
  }
);

export const Hall = mongoose.model("Hall", hallSchema);
