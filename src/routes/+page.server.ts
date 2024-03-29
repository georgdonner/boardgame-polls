import { nanoid } from 'nanoid';

import { connect } from '$lib/server/db';
import type { Poll } from '$lib/server/db';
import type { Actions } from './$types';
import type { MongoError } from 'mongodb';

export const actions: Actions = {
  default: async ({ request }) => {
    const db = await connect();
    const data = await request.formData();

    const poll: Poll = {
      _id: nanoid(6),
      name: String(data.get('name')),
      participants: Number(data.get('participants')),
      rankingSize: Number(data.get('rankingSize')),
      rankingShortSize: Number(data.get('rankingShortSize')),
      entries: [],
    };

    let inserted;

    while (!inserted) {
      try {

        const { insertedId } = await db.collection<Poll>('polls')
          .insertOne(poll);

        if (insertedId) {
          inserted = insertedId;
        }
      } catch (error) {
        if ((error as Error).name === 'MongoServerError' && (error as MongoError).code === 11000) {
          // Duplicate key error
          poll._id = nanoid(6);
        } else {
          throw error;
        }
      }
    }

    return {
      pollId: inserted,
      pollLink: `${(new URL(request.url)).origin}/p/${inserted}`,
    };
  }
};
