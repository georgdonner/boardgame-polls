import type { WithId } from 'mongodb';
import boardgames from './tests/data/boardgames.js';
import { connect } from './tests/utils/db.js';

interface Boardgame {
  _id: string;
  name: string;
  emoji: string;
  neverPlayed?: boolean;
  short?: boolean;
}

async function globalSetup() {
  const client = await connect();
  const db = client.db();

  const boardgamesCount = await db
    .collection('boardgames')
    .countDocuments();

  if (! boardgamesCount) {
    await db
      .collection<Boardgame>('boardgames')
      .insertMany(boardgames as WithId<Boardgame>[]);
  }

  await client.close();
}

export default globalSetup;