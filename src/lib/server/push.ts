import webpush from 'web-push';

import { PUBLIC_VAPID_KEY } from '$env/static/public';
import { PRIVATE_VAPID_KEY, VAPID_EMAIL } from '$env/static/private';
import type { Subscription } from '$lib/server/db';

webpush.setVapidDetails(
  `mailto:${VAPID_EMAIL}`,
  PUBLIC_VAPID_KEY,
  PRIVATE_VAPID_KEY,
);

export interface PushData {
  text: string;
  link: string;
}

export const sendPushMessage = (subscription: Subscription, data: PushData) => {
  return webpush.sendNotification(subscription, JSON.stringify(data));
}
