import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

import usersRouter from "./users.js";
import moviesRouter from "./moviesRouter.js";
import favoritesRouter from "./favorites.js";
import watchlistRouter from "./watchlist.js";
import authenticate from "./auth.js";

dotenv.config();

// Connect to database
mongoose.connect(process.env.MONGO_DB);
const db = mongoose.connection;

db.on("error", (err) => {
  console.log(`database connection error: ${err}`);
});
db.on("disconnected", () => {
  console.log("database disconnected");
});
db.once("open", () => {
  console.log(`database connected to ${db.name} on ${db.host}`);
});

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use("/api/users", usersRouter);
app.use("/api/movies", moviesRouter);
app.use("/api/favorites", authenticate, favoritesRouter);
app.use("/api/watchlist", authenticate, watchlistRouter);

app.use(defaultErrHandler);

app.listen(port, () => {
  console.info(`Server running at ${port}`);
});

function defaultErrHandler(err, _, res) {
  /* if the error in development then send stack trace to display whole error,
    if it's in production then just send error message  */
  if (process.env.NODE_ENV === "production") {
    return res.status(500).send(`Something went wrong!`);
  }
  res
    .status(500)
    .send(`Hey!! You caught the error 👍👍. Here's the details: ${err.stack} `);
}
