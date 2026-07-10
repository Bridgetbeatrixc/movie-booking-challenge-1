import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    poster: {
      type: String,
      required: true
    },
    genres: [String],
    runtime: String,
    rating: Number,
    year: Number,
    status: {
      type: String,
      enum: ["showing", "coming-soon", "advance-sale"],
      default: "showing"
    },
    releaseDate: Date,
    price: {
      type: Number,
      default: 35000
    }
  },
  { timestamps: true }
);

export const Movie = mongoose.model("Movie", movieSchema);
