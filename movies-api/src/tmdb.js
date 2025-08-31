async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) throw new Error();

  return await response.json();
}

export function getMovies(page) {
  console.log(`Fetch page ${page}`);
  return fetchJson(
    `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_KEY}&page=${page}&language=en-US&include_adult=false&include_video=false`,
  );
}

export function getPersonMovies(id) {
  return fetchJson(
    `https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=${process.env.TMDB_KEY}&language=en-US`,
  );
}

export function getPerson(id) {
  return fetchJson(
    `https://api.themoviedb.org/3/person/${id}?api_key=${process.env.TMDB_KEY}&language=en-US`,
  );
}

/// Trending movies don't support pagination for some reason.
export function getTrendingMovies() {
  return fetchJson(
    `https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.TMDB_KEY}&language=en-US`,
  );
}

export function getTopRatedMovies(page) {
  return fetchJson(
    `https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.TMDB_KEY}&language=en-US&page=${page}`,
  );
}

export function getMovieCredits(id) {
  return fetchJson(
    `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.TMDB_KEY}&language=en-US`,
  );
}

export function getMovie(id) {
  return fetchJson(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_KEY}`,
  );
}

export function getGenres() {
  return fetchJson(
    "https://api.themoviedb.org/3/genre/movie/list?api_key=" +
      process.env.TMDB_KEY +
      "&language=en-US",
  );
}

export function getMovieImages(id) {
  return fetchJson(
    `https://api.themoviedb.org/3/movie/${id}/images?api_key=${process.env.TMDB_KEY}`,
  );
}

export function getMovieReviews(id) {
  return fetchJson(
    `https://api.themoviedb.org/3/movie/${id}/reviews?api_key=${process.env.TMDB_KEY}`,
  );
}

export function getUpcomingMovies() {
  return fetchJson(
    `https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.TMDB_KEY}&language=en-US&page=1`,
  );
}
