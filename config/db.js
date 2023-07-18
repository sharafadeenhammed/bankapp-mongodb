import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGO_DEV_URI);
    console.log(
      `Mongodb connected to ${db.connection.host}://${db.connection.port} and using ${db.connection.name} database`
    );
  } catch (error) {
    console.error("mongodb database connection error...");
    process.exit(1);
  }
};

export default connectDb;
