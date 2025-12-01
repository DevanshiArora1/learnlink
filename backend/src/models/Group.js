import mongoose from "mongoose";

const GroupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    tags: { type: [String], default: [] },
    createdBy: { type: String, required: true },
    joinedUsers: { type: [String], default: [] }
  },
  { timestamps: true }
);

export default mongoose.model("Group", GroupSchema);
