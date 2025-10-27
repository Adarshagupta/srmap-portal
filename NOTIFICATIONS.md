# Push Notifications for Class Reminders

## Overview
The app now sends push notifications 10 minutes before each class starts based on your daily timetable.

## Features
- ✅ Automatic notification scheduling when dashboard loads
- ✅ Notifications sent 10 minutes before each class
- ✅ Includes subject name, room number, and class start time
- ✅ Only schedules for classes that haven't started yet
- ✅ Uses exact alarm for precise timing (Android 13+)

## How It Works

### 1. Notification Service (`lib/services/notification_service.dart`)
- Singleton service that manages all notifications
- Uses `flutter_local_notifications` package
- Timezone set to Asia/Kolkata (IST)
- Automatically requests permissions on Android 13+

### 2. Scheduling Logic
When the dashboard loads and fetches today's timetable:
1. Parses each class time (e.g., "09:00-09:50")
2. Calculates notification time (class start - 10 minutes)
3. Only schedules if notification time is in the future
4. Each class gets a unique notification ID (0-7 for 8 periods)

### 3. Notification Details
- **Title**: "Class Reminder"
- **Body**: "{Subject} in {Room} starts at {Time}"
- **Example**: "CSE 204 in C 303 starts at 09:00"
- **Channel**: "class_reminders" (high priority)

## Permissions Required

### Android
- `POST_NOTIFICATIONS` - Show notifications
- `SCHEDULE_EXACT_ALARM` - Schedule exact time notifications
- `USE_EXACT_ALARM` - Use exact alarms
- `RECEIVE_BOOT_COMPLETED` - Reschedule after device restart
- `VIBRATE` - Vibrate on notification

### iOS
- Alert permission
- Badge permission
- Sound permission

## Usage

### Automatic Scheduling
Notifications are automatically scheduled when:
- User logs in and dashboard loads
- Timetable is refreshed

### Manual Control
To cancel all notifications:
```dart
await NotificationService().cancelAllNotifications();
```

To cancel a specific class notification:
```dart
await NotificationService().cancelNotification(periodIndex);
```

## Example Timeline

If your schedule is:
- **Period 1**: 09:00-09:50 → Notification at 08:50
- **Period 2**: 10:00-10:50 → Notification at 09:50
- **Period 3**: 11:00-11:50 → Notification at 10:50
- etc.

If you open the app at 09:30:
- ❌ Period 1 notification skipped (already passed)
- ✅ Period 2-8 notifications scheduled

## Testing

1. Login to the app
2. Wait for dashboard to load timetable
3. Check notification permissions are granted
4. Wait until 10 minutes before your next class
5. You should receive a notification!

## Troubleshooting

### Notifications not showing?
1. Check app has notification permissions
2. Verify battery optimization is disabled for the app
3. Check Do Not Disturb settings
4. Ensure exact alarm permission is granted (Android 13+)

### Timing issues?
- Timezone is set to Asia/Kolkata (IST)
- Notifications only scheduled for future classes
- App must be opened at least once per day to schedule

## Future Enhancements
- [ ] Daily auto-scheduling (reschedule at midnight)
- [ ] Custom notification time (5, 10, 15 minutes before)
- [ ] Notification sound customization
- [ ] Weekly view with all scheduled notifications
- [ ] Settings to enable/disable per period
