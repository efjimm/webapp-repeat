import express from "express";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

import { favoritesModel } from "./models.js";

const router = express.Router(); // eslint-disable-line

router.get(
  "/:username",
  asyncHandler(async (req, res) => {
    const username = req.params.username;
    const movies = await favoritesModel.findByUsername(username);
    if (!movies) {
      return res.status(404).json({ success: false, msg: "User not found." });
    }
    console.log(movies);
    res.status(200).json(movies);
  }),
);

router.put(
  "/:username",
  asyncHandler(async (req, res) => {
    const username = req.params.username;
    const doc = await favoritesModel.findOne({ username: username });
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
    const doc = await favoritesModel.findOne({ username: username });
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
