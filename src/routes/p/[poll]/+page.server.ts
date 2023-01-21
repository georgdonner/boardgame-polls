import { error } from '@sveltejs/kit';

import { connect } from '$lib/server/db';
import type { Boardgame, Entry, Poll } from '$lib/server/db';
import type { Actions, PageServerLoad } from './$types';
import type { Filter, UpdateFilter } from 'mongodb';

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

export const actions: Actions = {
  vote: async ({ request, params }) => {
    const db = await connect();
    const data = await request.formData();
    
    const poll = await db.collection<Poll>('polls')
      .findOne({ _id: params.poll });

    if (!poll) {
      throw error(404, 'Poll not found');
    }
  
    const entry: Entry = {
      name: String(data.get('name')),
      ranking: (data.get('ranking') as string).split(','),
      rankingShort: (data.get('rankingShort') as string).split(','),
    };

    const alreadyEntered = Boolean(poll.entries.find(it => it.name === entry.name));

    let filter: Filter<Poll>; 
    let update: UpdateFilter<Poll>;

    if (alreadyEntered) {
      filter = { _id: params.poll, 'entries.name': entry.name };
      update = {
        $set: {
          'entries.$.ranking': entry.ranking,
          'entries.$.rankingShort': entry.rankingShort,
          ...(poll.participants <= poll.entries.length + 1 && {
            ended: new Date(),
          }),
        },
      };
    } else {
      filter = { _id: params.poll };
      update = {
        $push: { entries: entry },
        ...(poll.participants <= poll.entries.length + 1 && {
          $set: {ended: new Date()},
        }),
      };
    }

    await db.collection<Poll>('polls')
      .updateOne(filter, update);

    return {
      success: true,
    };
  }
};
