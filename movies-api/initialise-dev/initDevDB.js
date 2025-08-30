import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import { userModel as User, favoritesModel } from "../src/models.js";

const users = [
  {
    username: "user1",
    password: "test123@",
  },
  {
    username: "user2",
    password: "test456@",
  },
];

async function main() {
  if (process.env.NODE_ENV !== "development") {
    console.log("This script is only for the development environment.");
    return;
  }
  await mongoose.connect(process.env.MONGO_DB);
  // Drop collections
  await User.collection
    .drop()
    .catch((err) => console.log("User collection not found"));
  await favoritesModel.collection
    .drop()
    .catch((err) => console.log("Favorites collection not found"));
  await User.create(users);
  await favoritesModel.create(
    users.map((u) => {
      return {
        username: u.username,
        movies: [],
      };
    }),
  );
  console.log("Database initialised");
  console.log(`${users.length} users loaded`);
  await mongoose.disconnect();
}

main();
