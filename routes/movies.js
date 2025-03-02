import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.send("✅ Movies API is working!");
});

export default router;  // ✅ This ensures the correct ES module export
