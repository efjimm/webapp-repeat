import express from "express";
import asyncHandler from "express-async-handler";

import { watchlistModel } from "./models.js";

const router = express.Router(); // eslint-disable-line

router.get(
  "/:username",
  asyncHandler(async (req, res) => {
    const username = req.params.username;
    const movies = await watchlistModel.findByUsername(username);
    if (!movies) {
      return res.status(404).json({ success: false, msg: "User not found." });
    }
    res.status(200).json(movies);
  }),
);

router.put(
  "/:username",
  asyncHandler(async (req, res) => {
    const username = req.params.username;
    const doc = await watchlistModel.findOne({ username: username });
    if (!doc) {
      return res.status(404).json({ success: false, msg: "User not found." });
    }

    [req.body].flat().forEach((movie) => {
      if (!doc.movies.includes(movie)) {
        doc.movies.push(movie);
      }
    });
    await doc.save();
    res.status(200).json(doc.movies);
  }),
);

router.delete(
  "/:username",
  asyncHandler(async (req, res) => {
    const username = req.params.username;
    const doc = await watchlistModel.findOne({ username: username });
    if (!doc) {
      return res.status(404).json({ success: false, msg: "User not found." });
    }

    const del = [req.body].flat();
    doc.movies = doc.movies.filter((m) => !del.includes(m));
    await doc.save();
    res.status(200).json(doc.movies);
  }),
);

export default router;
