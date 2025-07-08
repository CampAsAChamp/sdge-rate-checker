# SDGE Time of Use (TOU) Period Tracker

A real-time web application that shows your current SDGE Time of Use period and rate information.

## Features

- **Real-time Updates**: Shows your current TOU period with live updates every second
- **Current Status**: Displays the current period name, time range, and rate level
- **Next Change**: Shows when the next period change will occur
- **Daily Schedule**: Visual representation of all periods for the current day
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Automatic Day Detection**: Automatically switches between weekday and weekend schedules

## TOU Schedule

The app automatically detects the current season and adjusts the schedule accordingly:

### Summer Schedule (June - October)

#### Weekdays (Monday - Friday)
- **Super Off-Peak**: 12:00 AM - 6:00 AM (Lowest Rate)
- **Off-Peak**: 6:00 AM - 2:00 PM (Medium Rate)
- **Peak**: 2:00 PM - 8:00 PM (Highest Rate)
- **Off-Peak**: 8:00 PM - 12:00 AM (Medium Rate)

#### Weekends (Saturday - Sunday)
- **Super Off-Peak**: 12:00 AM - 6:00 AM (Lowest Rate)
- **Off-Peak**: 6:00 AM - 12:00 AM (Medium Rate)

### Winter Schedule (November - February, May)

#### Weekdays (Monday - Friday)
- **Super Off-Peak**: 12:00 AM - 6:00 AM (Lowest Rate)
- **Off-Peak**: 6:00 AM - 4:00 PM (Medium Rate)
- **On-Peak**: 4:00 PM - 9:00 PM (Highest Rate)
- **Off-Peak**: 9:00 PM - 12:00 AM (Medium Rate)

#### Weekends (Saturday - Sunday)
- **Super Off-Peak**: 12:00 AM - 2:00 PM (Lowest Rate)
- **Off-Peak**: 2:00 PM - 4:00 PM (Medium Rate)
- **On-Peak**: 4:00 PM - 9:00 PM (Highest Rate)
- **Off-Peak**: 9:00 PM - 12:00 AM (Medium Rate)

### Winter Schedule (March - April)

#### Weekdays (Monday - Friday)
- **Super Off-Peak**: 12:00 AM - 6:00 AM (Lowest Rate)
- **Off-Peak**: 6:00 AM - 4:00 PM (Medium Rate)
- **On-Peak**: 4:00 PM - 9:00 PM (Highest Rate)
- **Off-Peak**: 9:00 PM - 12:00 AM (Medium Rate)

#### Weekends (Saturday - Sunday)
- **Super Off-Peak**: 12:00 AM - 2:00 PM (Lowest Rate)
- **Off-Peak**: 2:00 PM - 4:00 PM (Medium Rate)
- **On-Peak**: 4:00 PM - 9:00 PM (Highest Rate)
- **Off-Peak**: 9:00 PM - 12:00 AM (Medium Rate)

## How to Use

1. Open `index.html` in your web browser
2. The app will automatically detect your current time and show your TOU period
3. The current period will be highlighted in the schedule grid
4. The "Next Change" time shows when your current period will end

## Files

- `index.html` - Main HTML structure
- `styles.css` - Modern, responsive CSS styling
- `script.js` - JavaScript functionality for real-time updates
- `rates.png` - Reference image with SDGE rate information

## Browser Compatibility

This web app works in all modern browsers including:
- Chrome
- Firefox
- Safari
- Edge

## Local Development

To run the app locally:

1. Download all files to a folder
2. Open `index.html` in your web browser
3. No server required - it's a static web application

## Rate Information

The app shows three rate levels:
- **Lowest**: Super Off-Peak periods
- **Medium**: Off-Peak periods  
- **Highest**: Peak periods

For exact rate amounts, please refer to your SDGE bill or the rates.png reference image.

## Updates

The app updates automatically:
- Every second for current time and period
- At midnight for day type changes (weekday/weekend)
- When the page is refreshed

## Customization

You can modify the TOU schedule in `script.js` by editing the `touSchedule` object to match your specific rate plan or utility provider. 
