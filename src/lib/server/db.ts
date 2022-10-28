import { MongoClient } from 'mongodb';
import { MONGO_URL } from '$env/static/private';

export const connect = async () => {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  return client.db();
}
 
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
