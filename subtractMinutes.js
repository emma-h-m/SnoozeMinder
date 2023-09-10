// function to calculate desired time to go to sleep

function subtractMinutes(inputTime, minutesToSubtract) {
    // Parse the input time to separate hours, minutes, and am/pm
    const match = inputTime.match(/^(\d{1,2}):(\d{2})\s+(am|pm)$/i);

    if (!match) {
        return "";
    }

    const [, hourStr, minuteStr, amPm] = match;
    let hours = parseInt(hourStr, 10);
    let minutes = parseInt(minuteStr, 10);

    if (amPm.toLowerCase() === "pm") {
        // Convert PM hours to 24-hour format
        hours += 12;
    }

    // Calculate the total minutes
    const totalMinutes = hours * 60 + minutes;

    // Subtract the specified minutes
    let newTotalMinutes = totalMinutes - minutesToSubtract;

    // Check if the result is negative
    if (newTotalMinutes < 0) {
        // Handle the case of a negative result by adding 24 hours (1440 minutes)
        newTotalMinutes += 1440;
    }

    // Convert the result back to hours and minutes
    const newHours = Math.floor(newTotalMinutes / 60) % 24;
    const newMinutes = newTotalMinutes % 60;

    // Determine AM/PM based on the newHours
    const newAmPm = newHours < 12 ? "AM" : "PM";

    // Format the result as "hh:mm am/pm"
    const displayHours = newHours % 12 || 12;
    const resultTime = `${String(displayHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')} ${newAmPm}`;

    return resultTime;
}


  module.exports = {
    subtractMinutes
  };