// TOU Period Configuration based on SDGE rates with seasonal variations
const touSchedule = {
    summer: {
        weekdays: [
            { start: '16:00', end: '21:00', period: 'On-Peak' },
            { start: '06:00', end: '16:00', period: 'Off-Peak' },
            { start: '21:00', end: '00:00', period: 'Off-Peak' },
            { start: '00:00', end: '06:00', period: 'Super Off-Peak' }
        ],
        weekends: [
            { start: '16:00', end: '21:00', period: 'On-Peak' },
            { start: '14:00', end: '16:00', period: 'Off-Peak' },
            { start: '21:00', end: '00:00', period: 'Off-Peak' },
            { start: '00:00', end: '14:00', period: 'Super Off-Peak' }
        ]
    },
    winter: {
        weekdays: [
            { start: '16:00', end: '21:00', period: 'On-Peak' },
            { start: '06:00', end: '16:00', period: 'Off-Peak' },
            { start: '21:00', end: '00:00', period: 'Off-Peak' },
            { start: '00:00', end: '06:00', period: 'Super Off-Peak' }
        ],
        weekends: [
            { start: '16:00', end: '21:00', period: 'On-Peak' },
            { start: '14:00', end: '16:00', period: 'Off-Peak' },
            { start: '21:00', end: '00:00', period: 'Off-Peak' },
            { start: '00:00', end: '14:00', period: 'Super Off-Peak' }
        ]
    },
    winterMarchApril: {
        weekdays: [
            { start: '16:00', end: '21:00', period: 'On-Peak' },
            { start: '06:00', end: '16:00', period: 'Off-Peak' },
            { start: '21:00', end: '00:00', period: 'Off-Peak' },
            { start: '00:00', end: '06:00', period: 'Super Off-Peak' }
        ],
        weekends: [
            { start: '16:00', end: '21:00', period: 'On-Peak' },
            { start: '14:00', end: '16:00', period: 'Off-Peak' },
            { start: '21:00', end: '00:00', period: 'Off-Peak' },
            { start: '00:00', end: '14:00', period: 'Super Off-Peak' }
        ]
    }
};

// DOM Elements
const currentPeriodEl = document.getElementById('periodName');
const periodTimeEl = document.getElementById('periodTime');
const currentTimeEl = document.getElementById('currentTime');
const nextChangeEl = document.getElementById('nextChange');
const scheduleGridEl = document.getElementById('scheduleGrid');

// Utility functions
function timeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}

function minutesToTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

function formatTime12Hour(time24) {
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
}

function getCurrentSeason() {
    const now = new Date();
    const month = now.getMonth() + 1; // getMonth() returns 0-11

    // Summer: June (6) through October (10)
    // Winter: November (11) through May (5)
    // Special case: March (3) and April (4) have different winter schedule
    if (month >= 6 && month <= 10) {
        return 'summer';
    } else if (month === 3 || month === 4) {
        return 'winterMarchApril';
    } else {
        return 'winter';
    }
}

function getCurrentPeriod() {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    const isWeekend = now.getDay() === 0 || now.getDay() === 6;
    const season = getCurrentSeason();
    const schedule = isWeekend ? touSchedule[season].weekends : touSchedule[season].weekdays;

    const currentMinutes = timeToMinutes(currentTime);

    for (let i = 0; i < schedule.length; i++) {
        const period = schedule[i];
        const startMinutes = timeToMinutes(period.start);
        const endMinutes = timeToMinutes(period.end);

        if (endMinutes < startMinutes) {
            // Period spans midnight
            if (currentMinutes >= startMinutes || currentMinutes < endMinutes) {
                return { ...period, index: i, season: season };
            }
        } else {
            // Normal period
            if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
                return { ...period, index: i, season: season };
            }
        }
    }

    return null;
}

function getNextChange() {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    const isWeekend = now.getDay() === 0 || now.getDay() === 6;
    const season = getCurrentSeason();
    const schedule = isWeekend ? touSchedule[season].weekends : touSchedule[season].weekdays;

    const currentPeriod = getCurrentPeriod();
    if (!currentPeriod) return null;

    const currentMinutes = timeToMinutes(currentTime);

    // Find the next period chronologically
    for (let i = 0; i < schedule.length; i++) {
        const period = schedule[i];
        const startMinutes = timeToMinutes(period.start);
        const endMinutes = timeToMinutes(period.end);

        // Check if this period starts after the current time
        if (startMinutes > currentMinutes) {
            return period.start;
        }

        // Handle periods that span midnight
        if (endMinutes < startMinutes && currentMinutes >= startMinutes) {
            // We're in a period that spans midnight, so the next period is the first one tomorrow
            return schedule[0].start;
        }
    }

    // If no next period found today, return the first period of tomorrow
    return schedule[0].start;
}

function updateDisplay() {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    const currentPeriod = getCurrentPeriod();
    const nextChange = getNextChange();
    const season = getCurrentSeason();

    // Update current time
    currentTimeEl.textContent = formatTime12Hour(currentTime);

    if (currentPeriod) {
        // Update current period
        currentPeriodEl.textContent = currentPeriod.period;
        periodTimeEl.textContent = `${formatTime12Hour(currentPeriod.start)} - ${formatTime12Hour(currentPeriod.end)}`;

        // Update next change
        if (nextChange) {
            nextChangeEl.textContent = formatTime12Hour(nextChange);
        }

        // Update status card styling based on current period
        updateStatusCardStyle(currentPeriod);

        // Update schedule highlighting
        updateScheduleHighlight(currentPeriod);

        // Update current time and next change box styling
        updateTimeBoxStyling(currentPeriod, nextChange);
    } else {
        currentPeriodEl.textContent = 'Unknown';
        periodTimeEl.textContent = '--:--';
        nextChangeEl.textContent = '--:--';

        // Reset time box styling
        resetTimeBoxStyling();
    }
}

function updateStatusCardStyle(currentPeriod) {
    const statusCard = document.querySelector('.status-card');

    // Remove all period classes
    statusCard.classList.remove('peak', 'on-peak', 'off-peak', 'super-off-peak');

    // Add the appropriate class based on current period
    const periodClass = currentPeriod.period.toLowerCase().replace(/\s+/g, '-');
    statusCard.classList.add(periodClass);
}

function updateScheduleHighlight(currentPeriod) {
    const scheduleItems = document.querySelectorAll('.schedule-item');
    scheduleItems.forEach(item => {
        item.classList.remove('current');

        // Check if this item matches the current period by comparing time range
        const timeText = item.querySelector('.schedule-time').textContent;
        const currentTimeRange = `${formatTime12Hour(currentPeriod.start)} - ${formatTime12Hour(currentPeriod.end)}`;

        if (timeText === currentTimeRange) {
            item.classList.add('current');
        }
    });
}

function updateTimeBoxStyling(currentPeriod, nextChange) {
    const currentTimeBox = document.querySelector('.current-time');
    const nextChangeBox = document.querySelector('.next-change');

    // Reset all period classes
    currentTimeBox.classList.remove('peak', 'on-peak', 'off-peak', 'super-off-peak');
    nextChangeBox.classList.remove('peak', 'on-peak', 'off-peak', 'super-off-peak');

    // Apply current period class to current time box
    const currentPeriodClass = currentPeriod.period.toLowerCase().replace(/\s+/g, '-');
    currentTimeBox.classList.add(currentPeriodClass);

    // Apply next period class to next change box
    if (nextChange) {
        const nextPeriod = getPeriodForTime(nextChange);
        if (nextPeriod) {
            const nextPeriodClass = nextPeriod.period.toLowerCase().replace(/\s+/g, '-');
            nextChangeBox.classList.add(nextPeriodClass);
        }
    }
}

function resetTimeBoxStyling() {
    const currentTimeBox = document.querySelector('.current-time');
    const nextChangeBox = document.querySelector('.next-change');

    // Remove all period classes
    currentTimeBox.classList.remove('peak', 'on-peak', 'off-peak', 'super-off-peak');
    nextChangeBox.classList.remove('peak', 'on-peak', 'off-peak', 'super-off-peak');
}

function getPeriodForTime(time) {
    const now = new Date();
    const isWeekend = now.getDay() === 0 || now.getDay() === 6;
    const season = getCurrentSeason();
    const schedule = isWeekend ? touSchedule[season].weekends : touSchedule[season].weekdays;

    const timeMinutes = timeToMinutes(time);

    for (const period of schedule) {
        const startMinutes = timeToMinutes(period.start);
        const endMinutes = timeToMinutes(period.end);

        if (endMinutes < startMinutes) {
            // Period spans midnight
            if (timeMinutes >= startMinutes || timeMinutes < endMinutes) {
                return period;
            }
        } else {
            // Normal period
            if (timeMinutes >= startMinutes && timeMinutes < endMinutes) {
                return period;
            }
        }
    }

    return null;
}

function createScheduleDisplay() {
    const now = new Date();
    const isWeekend = now.getDay() === 0 || now.getDay() === 6;
    const season = getCurrentSeason();
    const schedule = isWeekend ? touSchedule[season].weekends : touSchedule[season].weekdays;

    scheduleGridEl.innerHTML = '';

    // Add season indicator with special handling for March/April
    const seasonIndicator = document.createElement('div');
    seasonIndicator.className = `season-indicator ${season}`;

    let seasonText = '';
    if (season === 'summer') {
        seasonText = 'Summer Schedule';
    } else if (season === 'winterMarchApril') {
        seasonText = 'Winter Schedule (March/April)';
    } else {
        seasonText = 'Winter Schedule';
    }

    seasonIndicator.textContent = seasonText;
    scheduleGridEl.appendChild(seasonIndicator);

    // Sort schedule by start time (chronological order)
    const sortedSchedule = [...schedule].sort((a, b) => {
        const timeA = timeToMinutes(a.start);
        const timeB = timeToMinutes(b.start);
        return timeA - timeB;
    });

    sortedSchedule.forEach(period => {
        const item = document.createElement('div');
        item.className = `schedule-item ${period.period.toLowerCase().replace(/\s+/g, '-')}`;
        item.dataset.period = period.period;

        item.innerHTML = `
            <div class="schedule-time">${formatTime12Hour(period.start)} - ${formatTime12Hour(period.end)}</div>
            <div class="schedule-period">${period.period}</div>
        `;

        scheduleGridEl.appendChild(item);
    });
}

// Initialize the app
function init() {
    updateDisplay();
    createScheduleDisplay();

    // Update every second
    setInterval(updateDisplay, 1000);

    // Check for day change at midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const timeUntilMidnight = tomorrow - now;
    setTimeout(() => {
        // Set up daily check
        setInterval(() => {
            createScheduleDisplay();
        }, 24 * 60 * 60 * 1000);
    }, timeUntilMidnight);
}

// Start the application
document.addEventListener('DOMContentLoaded', init); 
