import mongoose from "mongoose";

const connectToMongoDB = async () => {
  try {
    const mongoURI = process.env.MONGO_DB_URI;

    if (!mongoURI) {
      throw new Error("MONGO_DB_URI environment variable is not defined.");
    }

    mongoose.connect(mongoURI);
    console.log("Connected to MongoDB");
  } catch (error: any) {
    if (error instanceof Error) {
      console.log("Error connecting to MongoDB:", error.message);
    } else {
      console.log("An unexpected error occurred:", error);
    }
  }
};

export default connectToMongoDB;
