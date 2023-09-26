import mongoose from "mongoose";

const connectDB = async () => {
  const dbUri = process.env.dbURI || '';
  console.log(`⚡️[server]: Connecting to DB...`)
  console.log(dbUri)
  try {
    await mongoose.connect(dbUri);
    mongoose.set({ debug: true })
  } catch (error) {
    console.log("⚡️[server]: Could not connect to db");
    console.log(error)
    process.exit(1);
  }
}

export default connectDB;