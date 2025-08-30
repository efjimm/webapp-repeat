async function fetch2(url) {
  const response = await fetch(url);

  if (!response.ok) throw new Error();

  return await response.json();
}

export function getMovies(page) {
  console.log(`Fetch page ${page}`);
  return fetch2(
    `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_TMDB_KEY}&page=${page}&language=en-US&include_adult=false&include_video=false`,
  );
}

export function getPersonMovies(args) {
  const id = args.queryKey[1].id;
  return fetch2(
    `https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US`,
  );
}

export function getPerson(args) {
  const id = args.queryKey[1].id;
  return fetch2(
    `https://api.themoviedb.org/3/person/${id}?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US`,
  );
}

export function getTrendingMovies() {
  return fetch2(
    `https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US`,
  );
}

export function getTopRatedMovies(args) {
  const page = args.queryKey[1].page;
  return fetch2(
    `https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US&page=${page}`,
  );
}

export function getMovieCredits(id) {
  return fetch2(
    `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US`,
  );
}

export function getMovie(id) {
  return fetch2(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.REACT_APP_TMDB_KEY}`,
  );
}

export function getGenres() {
  return fetch2(
    "https://api.themoviedb.org/3/genre/movie/list?api_key=" +
      process.env.REACT_APP_TMDB_KEY +
      "&language=en-US",
  );
}

export function getMovieImages(id) {
  return fetch2(
    `https://api.themoviedb.org/3/movie/${id}/images?api_key=${process.env.REACT_APP_TMDB_KEY}`,
  );
}

export function getMovieReviews(id) {
  return fetch2(
    `https://api.themoviedb.org/3/movie/${id}/reviews?api_key=${process.env.REACT_APP_TMDB_KEY}`,
  );
}

export function getUpcomingMovies() {
  return fetch2(
    `https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US&page=1`,
  );
}
