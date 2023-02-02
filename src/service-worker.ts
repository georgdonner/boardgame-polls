/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />
 
const sw = self as unknown as ServiceWorkerGlobalScope;

import { version } from '$service-worker';

sw.addEventListener('install', () => {
  console.log(`Service worker installed with version ${version}.`);
});

sw.addEventListener('push', (event) => {
  if (event.data) {
    try {
      const data = event.data.json();

      event.waitUntil(sw.registration.showNotification(data.text, {
        data: {
          link: data.link,
        },
      }));
    } catch (error) {
      console.error('Failed to process push event payload');
    }
  } else {
    console.log('This push event has no data.');
  }
});

const openPage = async (url: string) => {
  const clients = await sw.clients
    .matchAll({
      type: 'window',
      includeUncontrolled: true,
    });

  let matchingClient: WindowClient|undefined = undefined;

  for (const client of clients) {
    if (client.url === url) {
      matchingClient = client;
      break;
    }
  }

  if (matchingClient) {
    return matchingClient.focus();
  } else {
    return sw.clients.openWindow(url);
  }
}

sw.addEventListener('notificationclick', async (event) => {
  const { notification } = event;
  notification.close();

  const page = notification.data?.link || '/';
  const url = new URL(page, sw.location.origin).href;

  event.waitUntil(openPage(url));
});
