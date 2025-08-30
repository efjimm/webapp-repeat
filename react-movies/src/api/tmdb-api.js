async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) throw new Error();

  return await response.json();
}

export const login = async (username, password) => {
  const response = await fetch("http://localhost:8080/api/users", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "post",
    body: JSON.stringify({ username: username, password: password }),
  });
  return response.json();
};

export const signup = async (username, password) => {
  const response = await fetch(
    "http://localhost:8080/api/users?action=register",
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "post",
      body: JSON.stringify({ username: username, password: password }),
    },
  );
  return response.json();
};

export async function getMovies(args) {
  const page = args.queryKey[1].page;
  const response = await fetch(
    `http://localhost:8080/api/movies?page=${page}`,
    // {
    //   headers: {
    //     Authorization: window.localStorage.getItem("token"),
    //   },
    // },
  );
  console.log(response);
  return response.json();
}

export function getPersonMovies(args) {
  const id = args.queryKey[1].id;
  return fetchJson(
    `https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US`,
  );
}

export function getPerson(args) {
  const id = args.queryKey[1].id;
  return fetchJson(
    `https://api.themoviedb.org/3/person/${id}?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US`,
  );
}

export function getTrendingMovies() {
  return fetchJson(
    `https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US`,
  );
}

export function getTopRatedMovies(args) {
  const page = args.queryKey[1].page;
  return fetchJson(
    `https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US&page=${page}`,
  );
}

export function getMovieCredits(args) {
  const id = args.queryKey[1].id;
  return fetchJson(`http://localhost:8080/api/movies/${id}/credits`);
}

export function getMovie(args) {
  const [, idPart] = args.queryKey;
  const { id } = idPart;
  return fetchJson(`http://localhost:8080/api/movies/${id}/details`);
}

export function getGenres() {
  return fetchJson(`http://localhost:8080/api/movies/genres`);
}

export function getMovieImages({ queryKey }) {
  const id = queryKey[1].id;
  return fetchJson(`http://localhost:8080/api/movies/${id}/images`);
}

export function getMovieReviews({ queryKey }) {
  const id = queryKey[1].id;
  return fetchJson(`http://localhost:8080/api/movies/${id}/reviews`);
}

export function getUpcomingMovies() {
  return fetchJson(`http://localhost:8080/api/movies/upcoming`);
}
