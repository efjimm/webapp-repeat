async function fetchJson(url, opts) {
  const response = await fetch(url, opts);

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
  return fetchJson(`http://localhost:8080/api/movies/person/${id}`);
}

export function getPerson(args) {
  const id = args.queryKey[1].id;
  return fetchJson(`http://localhost:8080/api/movies/person/${id}/details`);
}

export function getTrendingMovies() {
  return fetchJson(`http://localhost:8080/api/movies/trending`);
}

export function getTopRatedMovies(args) {
  const page = args.queryKey[1].page;
  return fetchJson(`http://localhost:8080/api/movies/top_rated?page=${page}`);
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

export function getMovieImages(args) {
  const id = args.queryKey[1].id;
  return fetchJson(`http://localhost:8080/api/movies/${id}/images`);
}

export function getMovieReviews(args) {
  const id = args.queryKey[1].id;
  return fetchJson(`http://localhost:8080/api/movies/${id}/reviews`);
}

export function getUpcomingMovies() {
  return fetchJson(`http://localhost:8080/api/movies/upcoming`);
}

export async function putFavorites(username, ids) {
  const response = await fetch(
    `http://localhost:8080/api/favorites/${username}`,
    {
      headers: {
        Authorization: window.localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      method: "put",
      body: JSON.stringify([ids].flat()),
    },
  );

  if (!response.ok) throw new Error();

  return await response.json();
}

export async function deleteFavourites(username, ids) {
  const response = await fetch(
    `http://localhost:8080/api/favorites/${username}`,
    {
      headers: {
        Authorization: window.localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      method: "delete",
      body: JSON.stringify([ids].flat()),
    },
  );

  if (!response.ok) throw new Error();

  return await response.json();
}

export function getFavorites(username) {
  return fetchJson(`http://localhost:8080/api/favorites/${username}`, {
    headers: {
      Authorization: window.localStorage.getItem("token"),
    },
  });
}
export async function putWatchlist(username, ids) {
  const response = await fetch(
    `http://localhost:8080/api/watchlist/${username}`,
    {
      headers: {
        Authorization: window.localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      method: "put",
      body: JSON.stringify([ids].flat()),
    },
  );

  if (!response.ok) throw new Error();

  return await response.json();
}

export async function deleteWatchlist(username, ids) {
  const response = await fetch(
    `http://localhost:8080/api/watchlist/${username}`,
    {
      headers: {
        Authorization: window.localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      method: "delete",
      body: JSON.stringify([ids].flat()),
    },
  );

  if (!response.ok) throw new Error();

  return await response.json();
}

export function getWatchlist(username) {
  return fetchJson(`http://localhost:8080/api/watchlist/${username}`, {
    headers: {
      Authorization: window.localStorage.getItem("token"),
    },
  });
}
