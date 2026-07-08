import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true
    },
    cinema: {
      type: String,
      default: "Beatrix Movieplex - Central World"
    },
    showtime: {
      type: Date,
      required: true
    },
    seats: {
      type: [String],
      required: true,
      validate: {
        validator: (value) => value.length > 0,
        message: "Choose at least one seat."
      }
    },
    totalPrice: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

export const Booking = mongoose.model("Booking", bookingSchema);
