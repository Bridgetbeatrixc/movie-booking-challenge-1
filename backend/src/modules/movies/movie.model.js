import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    shortTitle: {
      type: String,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    imdbId: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      index: true
    },
    poster: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: "",
      trim: true
    },
    trailerVideoId: {
      type: String,
      default: "",
      trim: true
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

movieSchema.index({ title: "text", shortTitle: "text", description: "text" });

export const Movie = mongoose.model("Movie", movieSchema);
