import express from "express";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// An admin-only route example
router.get("/admin", authenticate, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Welcome, Admin!" });
});

// Route accessible by admin and authorized personnel
router.get("/staff", authenticate, authorizeRoles("admin", "authorizedPersonnel"), (req, res) => {
  res.json({ message: "Welcome, staff member!" });
});

export default router;
