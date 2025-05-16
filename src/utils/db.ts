import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGO_URI || '';
const client = new MongoClient(uri);

let db: Db;

export const connectDB = async () => {
  try {
    await client.connect();
    db = client.db();
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

export const getDB = (): Db => {
  if (!db) {
    throw new Error('Database not connected');
  }
  return db;
};









// import { MongoClient } from 'mongodb';
// import dotenv from 'dotenv';

// dotenv.config();

// let client: MongoClient;

// export const connectToDB = async () => {
//   const uri = process.env.MONGO_URI as string;
//   client = new MongoClient(uri);
//   await client.connect();
//   console.log('Connected to MongoDB');
// };

// export const getDB = () => client.db();
