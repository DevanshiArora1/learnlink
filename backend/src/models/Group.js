import mongoose from "mongoose";

const GroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  desc: { type: String, default: "" },
  tags: { type: [String], default: [] },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },

  joinedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] // NEW
},
{ timestamps: true }
);

export default mongoose.model("Group", GroupSchema);