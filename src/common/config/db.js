import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGODB_URL);
    console.log(`MongoDb Connected succefully to ${mongoose.connection.name}`);
    // console.log("mongoose.connection.host :-", mongoose.connection.host);
    // console.log("mongoose.connection.port :-", mongoose.connection.port);
    // console.log("DB : -", db);
    return db;
  } catch (error) {
    console.log("MONGODB connection FAILED ", error);
    process.exit(1);
  }
};

export default connectDb;
