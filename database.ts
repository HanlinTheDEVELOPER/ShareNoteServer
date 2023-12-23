import mongoose from "mongoose";
import "dotenv/config";

const mongodb: string = process.env.MONGO_URL || "";

mongoose.connect(mongodb);

const database = mongoose.connection;

database.on("error", (err) => console.log(err));

database.once("connected", () => {
  console.log("Connected to database");
});
