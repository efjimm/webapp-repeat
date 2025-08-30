import movieModel from "./movieModel";
import asyncHandler from "express-async-handler";
import express from "express";
import {
  getMovie,
  getMovies,
  getUpcomingMovies,
  getGenres,
  getMovieCredits,
  getMovieImages,
} from "../tmdb-api";

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

router.get(
  "/:id/details",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const movie = await getMovie(id);
      res.status(200).json(movie);
    } catch (error) {
      console.error("Error fetching movie:", error);
      res.status(500).json({ error: "Failed to fetch movie" });
    }
  }),
);

router.get(
  "/:id/credits",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const credits = await getMovieCredits(id);
      res.status(200).json(credits);
    } catch (error) {
      console.error("Error fetching credits:", error);
      res.status(500).json({ error: "Failed to fetch credits" });
    }
  }),
);

router.get(
  "/:id/images",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const credits = await getMovieImages(id);
      res.status(200).json(credits);
    } catch (error) {
      console.error("Error fetching credits:", error);
      res.status(500).json({ error: "Failed to fetch credits" });
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
  "/genres",
  asyncHandler(async (req, res) => {
    const genres = await getGenres();
    res.status(200).json(genres);
  }),
);

export default router;
