import mongoose from "mongoose";
import { validateSeatSelection } from "../utils/seatValidation.js";

const showtimeSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
      index: true
    },
    date: {
      type: String,
      required: true,
      match: [/^\d{4}-\d{2}-\d{2}$/, "Date must use YYYY-MM-DD format."]
    },
    time: {
      type: String,
      required: true,
      match: [/^([01]\d|2[0-3]):[0-5]\d$/, "Time must use HH:mm 24-hour format."]
    },
    studio: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: [1, "Price must be greater than 0."]
    },
    bookedSeats: {
      type: [String],
      default: [],
      validate: {
        validator(value) {
          return validateSeatSelection(value).isValid;
        },
        message: "Booked seats contain invalid or duplicate seat IDs."
      }
    }
  },
  { timestamps: true }
);

showtimeSchema.index({ movie: 1, date: 1, time: 1, studio: 1 }, { unique: true });

showtimeSchema.pre("validate", function normalizeBookedSeats(next) {
  const result = validateSeatSelection(this.bookedSeats);

  if (result.isValid) {
    this.bookedSeats = result.seats;
  }

  next();
});

export const Showtime = mongoose.model("Showtime", showtimeSchema);
