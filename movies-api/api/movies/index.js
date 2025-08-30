import movieModel from "./movieModel";
import asyncHandler from "express-async-handler";
import express from "express";
import { getMovie, getMovies, getUpcomingMovies, getGenres } from "../tmdb-api";

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    let { page = 1 } = req.query;
    [page] = [+page];

    try {
      const movies = await getMovies(page);
      res.status(200).json(movies);
    } catch (error) {
      console.error("Error fetching movies:", error);
      res.status(500).json({ error: "Failed to fetch movies" });
    }
  }),
);

// Get movie details
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const movies = await getMovie(id);
      res.status(200).json(movies);
    } catch (error) {
      console.error("Error fetching movies:", error);
      res.status(500).json({ error: "Failed to fetch movies" });
    }
  }),
);

router.get(
  "/tmdb/upcoming",
  asyncHandler(async (req, res) => {
    const upcomingMovies = await getUpcomingMovies();
    res.status(200).json(upcomingMovies);
  }),
);

router.get(
  "/tmdb/genres",
  asyncHandler(async (req, res) => {
    const upcomingMovies = await getGenres();
    res.status(200).json(upcomingMovies);
  }),
);

export default router;
