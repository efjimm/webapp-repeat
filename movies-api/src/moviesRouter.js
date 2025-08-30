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
  getPersonMovies,
  getPerson,
  getTrendingMovies,
  getTopRatedMovies,
} from "./tmdb.js";

const router = express.Router();

/// Calls the given fetch function and returns the response as JSON.
async function doFetch(res, fetchFn, errMsg, ...args) {
  try {
    const data = await fetchFn(...args);
    res.status(200).json(data);
  } catch (error) {
    console.error(errMsg, error);
    res.status(500).json({ error: errMsg });
  }
}

/// Returns a route handler that simply calls the fetch function with no arguments and
/// returns the JSON data received.
function simpleRoute(fetchFn, name) {
  return asyncHandler(async (_, res) => {
    doFetch(res, fetchFn, `Failed to fetch ${name}`);
  });
}

/// Returns a route handler that passes a movie ID from the URL to the fetch function.
function movieDataRoute(fetchFn, name) {
  return asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    doFetch(res, fetchFn, `Failed to fetch ${name}`, id);
  });
}

router.get("/:id/details", movieDataRoute(getMovie, "details"));
router.get("/:id/credits", movieDataRoute(getMovieCredits, "credits"));
router.get("/:id/images", movieDataRoute(getMovieImages, "images"));
router.get("/:id/reviews", movieDataRoute(getMovieReviews, "reviews"));

router.get("/upcoming", simpleRoute(getUpcomingMovies, "upcoming movies"));
router.get("/trending", simpleRoute(getTrendingMovies, "trending movies"));
router.get("/genres", simpleRoute(getGenres, "genres"));

router.get(
  "/person/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const errMsg = `Failed to fetch movies for person ${id}`;
    doFetch(res, getPersonMovies, errMsg, id);
  }),
);

router.get(
  "/person/:id/details",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const errMsg = `Failed to fetch details for person ${id}`;
    doFetch(res, getPerson, errMsg, id);
  }),
);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    let { page = 1 } = req.query;
    [page] = [+page];

    doFetch(res, getMovies, "Failed to fetch movies", page);
  }),
);

router.get(
  "/top_rated",
  asyncHandler(async (req, res) => {
    let { page = 1 } = req.query;
    [page] = [+page];

    doFetch(res, getTopRatedMovies, "Failed to fetch top rated movies", page);
  }),
);

export default router;
