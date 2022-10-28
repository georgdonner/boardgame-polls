import { MongoClient } from 'mongodb';
import { MONGO_URL } from '$env/static/private';

const client = new MongoClient(MONGO_URL);

export default (await client.connect()).db();
 
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
