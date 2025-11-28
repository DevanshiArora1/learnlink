import mongoose from "mongoose";

const ResourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    link: { type: String, required: true },
    desc: { type: String },
    tags: { type: [String], default: [] },
    likes: { type: Number, default: 0 },
    userId: { type: String }, // optional for now
  },
  { timestamps: true }
);

export default mongoose.model("Resource", ResourceSchema);
