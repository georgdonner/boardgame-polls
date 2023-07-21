import { error } from '@sveltejs/kit';

import { connect } from '$lib/server/db';
import { sendPushMessage } from '$lib/server/push';
import type { Boardgame, Entry, Poll, Subscription } from '$lib/server/db';
import type { Actions, PageServerLoad } from './$types';
import type { Db, Filter, UpdateFilter, WithId } from 'mongodb';

export const load: PageServerLoad = async ({ params }) => {
  const db = await connect();

  const boardgames = await db.collection<Boardgame>('boardgames')
    .find({}, { sort: 'name' })
    .toArray();

  const poll = await db.collection<Poll>('polls')
    .findOne({ _id: params.poll });

  if (poll) {
    return {
      boardgames,
      poll,
    };
  }

  throw error(404, 'Poll not found');
}

const parseEntry = (data: FormData) => {
  const entry: Entry = {
    name: String(data.get('name')),
    ranking: (data.get('ranking') as string).split(','),
    rankingShort: (data.get('rankingShort') as string).split(','),
  };

  const pushSubscriptionParam = String(data.get('pushSubscription'));
  if (pushSubscriptionParam) {
    try {
      const pushSubscription: Subscription = JSON.parse(pushSubscriptionParam);
      entry.pushSubscription = pushSubscription;
    } catch (error) {
      console.error('Failed to parse push subscription');
    }
  }

  return entry;
}

const saveEntry = async (db: Db, poll: Poll, entry: Entry): Promise<WithId<Poll>|null> => {
  const hasAlreadyEntered = Boolean(poll.entries.find(it => it.name === entry.name));
  const hasEnded = poll.participants <= poll.entries.length + 1;

  let filter: Filter<Poll>; 
  let update: UpdateFilter<Poll>;

  if (hasAlreadyEntered) {
    filter = { _id: poll._id, 'entries.name': entry.name };
    update = {
      $set: {
        'entries.$.ranking': entry.ranking,
        'entries.$.rankingShort': entry.rankingShort,
      },
    };
  } else {
    filter = { _id: poll._id };
    update = {
      $push: { entries: entry },
      ...(hasEnded && {
        $set: {ended: new Date()},
      }),
    };
  }

  const updatedPoll = await db.collection<Poll>('polls')
    .findOneAndUpdate(filter, update, { returnDocument: 'after' });

  return updatedPoll.value;
}

const sendPushMessages = async (poll: WithId<Poll>) => {
  return Promise.all(poll.entries.map(async entry => {
    if (entry.pushSubscription) {
      return sendPushMessage(entry.pushSubscription, {
        text: 'Die Ergebnisse der Brettspielumfrage sind da!',
        link: `/p/${poll._id}`,
      });
    }
  }));
}

export const actions: Actions = {
  vote: async ({ request, params }) => {
    const db = await connect();
    const data = await request.formData();

    const poll = await db.collection<Poll>('polls')
      .findOne({ _id: params.poll });

    if (!poll) {
      throw error(404, 'Poll not found');
    }
  
    const entry: Entry = parseEntry(data);

    const updatedPoll = await saveEntry(db, poll, entry);

    if (updatedPoll?.ended) {
      await sendPushMessages(updatedPoll);
    }

    return {
      success: true,
    };
  }
};
