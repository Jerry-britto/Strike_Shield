import mongoose from "mongoose";

export const connectToDb = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URI}/${process.env.DB_NAME}`
    );
    console.log(
      `\n MONGODB CONNECTED!! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("CONNECTION TO DATABASE FAILED ", error.message);
    process.exit(1);
  }
};
