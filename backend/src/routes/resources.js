import express from "express";
import Resource from "../models/Resource.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// GET all resources (public)
router.get("/", async (req, res) => {
  try {
    const resources = await Resource.find().sort({ createdAt: -1 });
    res.json(resources);
  } catch (err) {
    console.error("Error fetching resources:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST new resource (PROTECTED)
router.post("/", auth, async (req, res) => {
  try {
    const { title, link, desc, tags } = req.body;

    if (!title?.trim() || !link?.trim()) {
      return res.status(400).json({ message: "Title and link required" });
    }

    const resource = await Resource.create({
      title: title.trim(),
      link: link.trim(),
      desc: desc || "",
      tags: tags || [],
      user: req.user.id, // logged in user ID coming from JWT
    });

    res.json(resource);
  } catch (err) {
    console.error("Error creating resource:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE resource (PROTECTED)
router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    await Resource.findByIdAndDelete(id);
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("Error deleting resource:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
