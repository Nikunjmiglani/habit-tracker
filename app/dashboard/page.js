// app/dashboard/page.js
"use client";
export const dynamic = "force-dynamic";


import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState("");
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
  if (status === "authenticated") {
    fetch("/api/habits")
      .then((res) => {
        if (!res.ok) {
          console.error("Failed to load habits:", res.status);
          throw new Error(`API returned ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setHabits(data);
      })
      .catch((err) => {
        console.error("Error fetching habits:", err);
      })
      .finally(() => {
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

    const data = await res.json();
    if (data && data.title) {
      setHabits([...habits, data]);
      setNewHabit("");
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

  if (status === "loading" || loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-sm">Loading your habits...</p>
      </div>
    );

  if (!session)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-sm">Please sign in to view your habits.</p>
      </div>
    );

  const lastNDays = Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    return date.toISOString().split("T")[0];
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center text-gray-800">
        Habit Tracker <span className="text-blue-600">(Past {days} Days)</span>
      </h1>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <input
          type="text"
          className="border px-4 py-2 rounded-lg w-full sm:w-auto flex-grow focus:outline-none focus:ring focus:border-blue-400"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          placeholder="Add a new habit"
        />
        <button
          onClick={addHabit}
          className="bg-blue-500 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-600 transition"
        >
          Add Habit
        </button>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Show:</label>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="border px-3 py-1 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={60}>Last 60 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl shadow-md">
        <table className="min-w-full border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-600">
              <th className="px-3 py-2 border text-left">Habit</th>
              {lastNDays.map((date) => (
                <th
                  key={date}
                  className="px-1 py-2 border text-center text-[10px] text-gray-400"
                >
                  {new Date(date).getDate()}
                </th>
              ))}
              <th className="px-2 py-2 border">🔥</th>
              <th className="px-2 py-2 border">❌</th>
            </tr>
          </thead>
          <tbody>
            {habits.map((habit) => (
              <tr key={habit._id} className="odd:bg-white even:bg-gray-50">
                <td className="px-3 py-2 border font-medium whitespace-nowrap rounded-l-xl bg-gray-100">
                  {habit.title}
                </td>
                {lastNDays.map((date) => (
                  <td
                    key={date}
                    onClick={() => toggleCompletion(habit._id, date)}
                    className={`w-6 h-6 sm:w-7 sm:h-7 text-center cursor-pointer border transition-colors duration-150 select-none text-xs sm:text-sm ${
                      habit.completedDates.includes(date)
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {habit.completedDates.includes(date) ? "✓" : ""}
                  </td>
                ))}
                <td className="px-2 py-2 border text-center text-sm font-semibold bg-gray-100">
                  {habit.streak}
                </td>
                <td className="px-2 py-2 border text-center rounded-r-xl cursor-pointer bg-gray-100">
                  <button
                    onClick={() => deleteHabit(habit._id)}
                    className="text-red-600 hover:text-red-800 text-base"
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




