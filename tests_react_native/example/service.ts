import notifee, { EventType } from '@kubric/notifee-react-native';

function countdown({
  seconds,
  onTick,
  onEnd,
}: {
  seconds: number;
  onTick: (seconds: number) => void;
  onEnd: () => void;
}) {
  let remaining = seconds;

  const intervalId = setInterval(() => {
    console.log({ remaining });

    if (remaining < 0) {
      clearInterval(intervalId);
      onEnd();

      console.log('Countdown finished');
    } else {
      onTick(remaining);
    }

    remaining--;
  }, 1000);

  return intervalId;
}

function secondsToTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  //   return `<span style="background:green;color:white;padding:4px">${minutes} minutes ${remainingSeconds} seconds</span>`;
  return `${minutes} : ${remainingSeconds}`;
}

notifee.registerForegroundService(async notification => {
  console.log('registerForegroundService', notification);
  let interval: ReturnType<typeof setInterval>;
  const discountTime = 1 * 60; // 5 minutes

  return new Promise(async () => {
    // register background event and cancel notification
    const sub = notifee.onForegroundEvent(async event => {
      console.log({ type: event.type });

      if (event.type !== EventType.TRIGGER_NOTIFICATION_CREATED) {
        console.log('onForegroundEvent', event.type);
        clearInterval(interval);
        await notifee.cancelAllNotifications();
        await notifee.cancelTriggerNotifications();
        await notifee.stopForegroundService();
        sub();
      }
    });

    interval = countdown({
      seconds: discountTime,
      onTick: async seconds => {
        const time = secondsToTime(seconds);

        await notifee.displayNotification({
          ...notification,
          id: notification.id,
          body: time,
          android: {
            ...notification.android,
            channelId: 'default',
            asForegroundService: true,
            timestamp: Date.now(),
          },
          data: {
            timer: time,
          },
        });
      },
      onEnd: async () => {
        await notifee.cancelAllNotifications();
        await notifee.cancelTriggerNotifications();
        await notifee.stopForegroundService();
      },
    });

    // let count = 0;
    // interval = setInterval(async () => {
    //   console.log({count});
    //   count += 1;

    //   await notifee.displayNotification({
    //     ...notification,
    //     id: notification.id,
    //     body: `${count} seconds elapsed`,
    //     android: {
    //       ...notification.android,
    //       asForegroundService: false,
    //     },
    //   });

    //   if (count === 20) {
    //     clearInterval(interval);
    //     notifee.cancelAllNotifications();
    //     await notifee.stopForegroundService();
    //   }
    // }, 3000);
  });
});
