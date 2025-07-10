export const dynamic = 'force-dynamic'; // ✅ Add this

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectMongo from "@/lib/mongoose";
import Habit from "@/models/Habit";

export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { id } = params;
    const { date } = await req.json();

    await connectMongo();

    const habit = await Habit.findById(id);
    if (!habit) {
      return new Response(JSON.stringify({ error: "Habit not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const index = habit.completedDates.indexOf(date);

    if (index > -1) {
      habit.completedDates.splice(index, 1);
    } else {
      habit.completedDates.push(date);
    }

    habit.streak = calculateStreak(habit.completedDates);
    await habit.save();

    return new Response(JSON.stringify({ habit }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("API ERROR in /complete:", err);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

function calculateStreak(dates) {
  const sorted = [...dates].sort((a, b) => new Date(b) - new Date(a));
  let streak = 0;
  let currentDate = new Date().toISOString().split("T")[0];

  for (let d of sorted) {
    if (d === currentDate) {
      streak++;
      const next = new Date(currentDate);
      next.setDate(next.getDate() - 1);
      currentDate = next.toISOString().split("T")[0];
    } else {
      break;
    }
  }

  return streak;
}



