import express from "express";
import auth from "../middleware/auth.js";
import Group from "../models/Group.js";

const router = express.Router();

// Get all groups
router.get("/", auth, async (req, res) => {
  const groups = await Group.find();
  res.json(groups);
});

// Create group
router.post("/", auth, async (req, res) => {
  const { name, desc, tags } = req.body;

  const g = await Group.create({
    name,
    desc,
    tags,
    createdBy: req.user.id,
    joinedUsers: []        // initially empty
  });

  res.json(g);
});

// JOIN group
router.post("/:id/join", auth, async (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;

  const g = await Group.findById(id);
  if (!g) return res.status(404).json({ message: "Group not found" });

  if (!g.joinedUsers.includes(userId)) {
    g.joinedUsers.push(userId);
  }

  await g.save();
  res.json(g);
});

// LEAVE group
router.post("/:id/leave", auth, async (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;

  const g = await Group.findById(id);
  if (!g) return res.status(404).json({ message: "Group not found" });

  g.joinedUsers = g.joinedUsers.filter((u) => String(u) !== String(userId));

  await g.save();
  res.json(g);
});

// DELETE group
router.delete("/:id", auth, async (req, res) => {
  await Group.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

export default router;
