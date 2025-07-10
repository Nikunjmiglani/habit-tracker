import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectMongo from "@/lib/mongoose";
import Habit from "@/models/Habit";

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  await connectMongo();

  try {
    const { id } = params;
    await Habit.deleteOne({ _id: id, userEmail: session.user.email });
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (err) {
    console.error("DELETE habit error:", err);
    return new Response(JSON.stringify({ error: "Delete failed" }), {
      status: 500,
    });
  }
}

