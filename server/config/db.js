import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';

dotenv.config();

let mongoServer;

const connectDB = async () => {
  try {
    let mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      if (!mongoServer) {
        mongoServer = await MongoMemoryServer.create();
      }
      mongoURI = mongoServer.getUri();
      console.log('Using embedded MongoDB for local development');
    }

    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    console.warn('Continuing without MongoDB. API will start, but database-backed routes may fail until MongoDB is available.');
  }
};

export default connectDB;
