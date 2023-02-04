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
  neverPlayed?: boolean;
  short?: boolean;
}

export interface SubscriptionKeys {
  p256dh: string;
  auth: string;
}

export interface Subscription {
  endpoint: string;
  keys: SubscriptionKeys;
}

export interface Entry {
  name: string;
  ranking: string[];
  rankingShort: string[];
  pushSubscription?: Subscription;
}

export interface Poll {
  _id: string;
  name: string;
  participants: number;
  rankingSize: number;
  rankingShortSize: number;
  entries: Entry[];
  ended?: Date;
}
