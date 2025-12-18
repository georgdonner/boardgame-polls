import webpush from 'web-push';

import { building } from '$app/environment';
import { env as publicEnv } from '$env/dynamic/public';
import { env as privateEnv } from '$env/dynamic/private';
import type { Subscription } from '$lib/server/db';

if (!building) {
  webpush.setVapidDetails(
    `mailto:${privateEnv.VAPID_EMAIL}`,
    publicEnv.PUBLIC_VAPID_KEY,
    privateEnv.PRIVATE_VAPID_KEY,
  );
}

export interface PushData {
  text: string;
  link: string;
}

export const sendPushMessage = (subscription: Subscription, data: PushData) => {
  return webpush.sendNotification(subscription, JSON.stringify(data));
}
