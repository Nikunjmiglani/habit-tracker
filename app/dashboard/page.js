// app/dashboard/page.js
"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/habits")
        .then((res) => res.json())
        .then((data) => {
          setHabits(data);
          setLoading(false);
        });
    }
  }, [status]);

  const addHabit = async () => {
    if (!newHabit.trim()) return;
   const res = await fetch("/api/habits", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title: newHabit }),
});

console.log("Status:", res.status);

const data = await res.json(); // this will fail if backend didn't return JSON
console.log("Data received:", data);
if (data && data.title) {
  setHabits([...habits, data]);
}
  };

  const deleteHabit = async (id) => {
    await fetch(`/api/habits/${id}`, { method: "DELETE" });
    setHabits(habits.filter((h) => h._id !== id));
  };

  const toggleCompletion = async (habitId, date) => {
    const res = await fetch(`/api/habits/${habitId}/complete`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date }),
    });

    if (res.ok) {
      const { habit: updatedHabit } = await res.json();
      setHabits((prev) =>
        prev.map((h) => (h._id === habitId ? updatedHabit : h))
      );
    }
  };

  if (status === "loading" || loading) return <p>Loading...</p>;
  if (!session) return <p>Please sign in to view your habits.</p>;

  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return date.toISOString().split("T")[0];
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Habit Tracker (Past 30 Days)</h1>

      <div className="flex mb-4 gap-2">
        <input
          type="text"
          className="border px-2 py-1 rounded w-full"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          placeholder="Add a new habit"
        />
        <button
          onClick={addHabit}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          Add
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto border-collapse text-sm">
          <thead>
            <tr>
              <th className="border px-2 py-1">Habit</th>
              {last30Days.map((date) => (
                <th key={date} className="border px-1 py-1 text-xs text-gray-500">
                  {new Date(date).getDate()}
                </th>
              ))}
              <th className="border px-2 py-1">🔥 Streak</th>
              <th className="border px-2 py-1">❌</th>
            </tr>
          </thead>
          <tbody>
            {habits.map((habit) => (
              <tr key={habit._id}>
                <td className="border px-2 py-1 font-semibold whitespace-nowrap">
                  {habit.title}
                </td>
                {last30Days.map((date) => (
                  <td
                    key={date}
                    onClick={() => toggleCompletion(habit._id, date)}
                    className={`border w-6 h-6 text-center cursor-pointer transition-colors duration-150 ${
                      habit.completedDates.includes(date)
                        ? "bg-green-400 text-white"
                        : "bg-gray-100 hover:bg-gray-300"
                    }`}
                  >
                    {habit.completedDates.includes(date) ? "✓" : ""}
                  </td>
                ))}
                <td className="border px-2 py-1 text-center">
                  {habit.streak}
                </td>
                <td className="border px-2 py-1 text-center">
                  <button
                    onClick={() => deleteHabit(habit._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}








