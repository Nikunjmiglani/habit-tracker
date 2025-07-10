// /app/api/habits/route.js

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import connectMongo from "@/lib/mongoose";
import Habit from "@/models/Habit";

// GET: Fetch habits
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  await connectMongo();
  const habits = await Habit.find({ userEmail: session.user.email });

  return new Response(JSON.stringify(habits), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

// ✅ POST: Add a new habit
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { title } = await req.json();

  if (!title || typeof title !== "string") {
    return new Response(JSON.stringify({ error: "Invalid title" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  await connectMongo();
  const habit = await Habit.create({
    title,
    userEmail: session.user.email,
    completedDates: [],
    streak: 0,
  });

  return new Response(JSON.stringify(habit), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}


