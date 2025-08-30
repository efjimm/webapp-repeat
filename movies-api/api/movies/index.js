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
  getMovieReviews,
} from "../tmdb-api";

const router = express.Router();

function movieDataRoute(fetchFn, name) {
  return asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);

    try {
      const data = await fetchFn(id);
      res.status(200).json(data);
    } catch (error) {
      console.error(`Error fetching ${name}:`, error);
      res.status(500).json({ error: `Failed to fetch ${name}` });
    }
  });
}

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

router.get("/:id/details", movieDataRoute(getMovie, "details"));
router.get("/:id/credits", movieDataRoute(getMovieCredits, "credits"));
router.get("/:id/images", movieDataRoute(getMovieImages, "images"));
router.get("/:id/reviews", movieDataRoute(getMovieReviews, "reviews"));

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
