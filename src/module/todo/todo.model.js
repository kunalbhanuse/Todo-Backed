import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      minLength: [2, "Min 2 char required "],
      maxLength: [120, "Max 120 allowed "],
      required: true,
    },
    content: {
      type: String,
      trim: true,
      minLength: [10, "Min 10 char required "],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Todo", todoSchema);
