// function to calculate desired time to go to sleep

function subtractMinutes(inputTime, minutesToSubtract) {
    // parse the input time to separate hours, minutes, and am/pm
    const match = inputTime.match(/^(\d{1,2}):(\d{2})\s+(am|pm)$/i);

    if (!match) {
        return "";
    }

    const [, hourStr, minuteStr, amPm] = match;
    let hours = parseInt(hourStr, 10);
    let minutes = parseInt(minuteStr, 10);

    if (amPm.toLowerCase() === "pm") {
        // convert PM hours to 24-hour format
        hours += 12;
    }

    // calculate the total minutes
    const totalMinutes = hours * 60 + minutes;

    // subtract the specified minutes
    let newTotalMinutes = totalMinutes - minutesToSubtract;

    // check if the result is negative
    if (newTotalMinutes < 0) {
        // handle the case of a negative result by adding 24 hours (1440 minutes)
        newTotalMinutes += 1440;
    }

    // convert the result back to hours and minutes
    const newHours = Math.floor(newTotalMinutes / 60) % 24;
    const newMinutes = newTotalMinutes % 60;

    // determine AM/PM based on the newHours
    const newAmPm = newHours < 12 ? "AM" : "PM";

    // format the result as "hh:mm am/pm"
    const displayHours = newHours % 12 || 12;
    const resultTime = `${String(displayHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')} ${newAmPm}`;

    return resultTime;
}

  module.exports = {
    subtractMinutes
  };