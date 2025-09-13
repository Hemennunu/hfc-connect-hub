import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, password } = req.body;
  // validation, check user, hash password, save user logic here...
  res.json({ message: "User registered successfully" }); // example response
});

export default router;
