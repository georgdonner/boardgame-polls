import { error } from '@sveltejs/kit';

import db from '$lib/server/db';
import type { Boardgame, Entry, Poll } from '$lib/server/db';
import type { Actions, PageServerLoad } from './$types';
import type { UpdateFilter } from 'mongodb';

export const load: PageServerLoad = async ({ params }) => {
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

export const actions: Actions = {
  default: async ({ request, params }) => {
    const data = await request.formData();
    const poll = await db.collection<Poll>('polls')
      .findOne({ _id: params.poll });

    if (!poll) {
      throw error(404, 'Poll not found');
    }
  
    const entry: Entry = {
      name: String(data.get('name')),
      ranking: (data.get('ranking') as string).split(','),
    };

    const update: UpdateFilter<Poll> = {
      $push: { entries: entry }
    };

    if (poll.participants <= poll.entries.length + 1) {
      update.$set = {
        ended: new Date(),
      };
    }

    await db.collection<Poll>('polls')
      .updateOne({ _id: params.poll }, update);

    return {
      success: true,
    };
  }
};
