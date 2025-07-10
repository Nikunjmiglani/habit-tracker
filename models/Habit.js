import mongoose from "mongoose";

const HabitSchema = new mongoose.Schema({
  title: { type: String, required: true },
  userEmail: { type: String, required: true },
  completedDates: [String], // ISO date strings
  streak: { type: Number, default: 0 },
});

export default mongoose.models.Habit || mongoose.model("Habit", HabitSchema);