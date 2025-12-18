import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const res = await resolve(event);

  console.log(
    `${event.request.method} ${event.url.pathname}${event.url.search} ${res.status}`
  );

  return res;
};