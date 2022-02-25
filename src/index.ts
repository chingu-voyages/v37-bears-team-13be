import mongoose from 'mongoose';
import { app, PORT, MONGO_URI, JWT_KEY } from './app';

const start = async () => {
  // Check for key environment variables.
  if (!MONGO_URI) {
    throw new Error('MONGO_URI key must be defined');
  }

  if (!JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  // Try to connect to the database.
  try {
    await mongoose.connect(MONGO_URI);
  } catch (error) {
    console.error(error);
  }
  // Listen.
  app.listen(PORT || 5000, () => {
    console.log(`Server running on port ${PORT || 5000}`);
  });
};

// Start the application.
start();
