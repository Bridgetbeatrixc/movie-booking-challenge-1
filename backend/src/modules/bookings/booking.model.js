import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
        required: false
    },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
      },
    movieTitle: {
      type: String,
      required: true,
      trim: true
    },
    moviePoster: {
      type: String,
      required: true
    },
    cinema: {
      type: String,
      default: "Beatrix Movieplex - Central World"
    },
    showtime: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Showtime",
      required: true,
      index: true
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
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "expired", "failed"],
      default: "pending"
    },
    paymentProvider: {
      type: String,
      default: "xendit_mock"
    },
    payment: {
      externalId: String,
      invoiceId: String,
      invoiceUrl: String,
      paymentMethod: String,
      qrString: String,
      qrExpiresAt: Date,
      amount: Number,
      status: String,
      apiKeyMode: String
    },
    ticket: {
      ticketCode: String,
      qrString: String,
      qrImageDataUrl: String,
      issuedAt: Date,
      emailSent: {
        type: Boolean,
        default: false
      },
      emailTo: String,
      emailSentAt: Date,
      pdfDownloadedAt: Date
    }
  },
  { timestamps: true }
);

export const Booking = mongoose.model("Booking", bookingSchema);
