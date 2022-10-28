import { MongoClient } from 'mongodb';
import { MONGO_URL } from '$env/static/private';

const client = new MongoClient(MONGO_URL);

export function connect() {
  console.log('Connecting to database...');
  return client.connect();
}

export default client.db();

export interface Boardgame {
  _id: string;
  name: string;
  emoji: string;
}

export interface Entry {
  name: string;
  ranking: string[];
}

export interface Poll {
  _id: string;
  name: string;
  participants: number;
  rankingSize: number;
  entries: Entry[];
  ended?: Date;
}
