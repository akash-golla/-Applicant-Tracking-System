import app from './app.js';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { ensureDemoSeedData } from './utils/seedData.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await ensureDemoSeedData();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
