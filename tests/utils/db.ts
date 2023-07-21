import { MongoClient } from 'mongodb';

export const connect = async () => {
  const client = new MongoClient(process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/boardgameplanner');
  await client.connect();
  return client;
}