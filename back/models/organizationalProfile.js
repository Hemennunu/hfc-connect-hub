import mongoose from "mongoose";

const organizationalProfileSchema = new mongoose.Schema({
  history: { type: String, required: true },
  objectives: { type: String, required: true },
  coreValues: { type: String, required: true },
  mission: { type: String, required: true },
  vision: { type: String, required: true },
  logoUrl: { type: String },
  brandColors: { type: [String] }, // Array of hex colors or strings
}, { timestamps: true });

export default mongoose.model("OrganizationalProfile", organizationalProfileSchema);
