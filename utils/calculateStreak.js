// utils/calculateStreak.js

export function calculateStreak(completedDates) {
  const sortedDates = [...completedDates].sort((a, b) => new Date(b) - new Date(a));
  let streak = 0;

  for (let i = 0; i < sortedDates.length; i++) {
    const current = new Date();
    current.setDate(current.getDate() - streak);
    const currentDate = current.toISOString().split("T")[0];

    if (sortedDates.includes(currentDate)) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
