import {IOSNotificationCategory} from '@kubric/notifee-react-native';

export const categories: IOSNotificationCategory[] = [
  {
    id: 'quickActions',
    actions: [
      {
        id: 'first_action_reply',
        title: 'Reply, Open & Cancel',
        input: true,
      },
      {
        id: 'second_action_nothing',
        title: 'Nothing',
      },
    ],
  },
];
