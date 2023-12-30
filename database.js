import mongoose from "mongoose";

const mongodb = process.env.MONGO_URL || "";

mongoose.connect(mongodb);

const database = mongoose.connection;

database.on("error", (err) => console.log(err));

database.once("connected", () => {
  console.log("Connected to database");
});
