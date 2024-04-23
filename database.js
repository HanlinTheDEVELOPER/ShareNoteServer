import mongoose from "mongoose";
import { seeds } from "./dummies/seed.js";

const mongodb = process.env.MONGO_URL || "";

mongoose.connect(mongodb);

const database = mongoose.connection;

database.on("error", (err) => console.log(err.message));

database.once("connected", () => {
  console.log("Connected to database");
});

// seeds();
// seeds();
