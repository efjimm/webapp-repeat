import React, { useContext, useState } from "react";
import * as ui from "@mui/material";
import * as icons from "@mui/icons-material";
import { Link, useParams, useLocation, Navigate } from "react-router-dom";
import { useQuery, useQueries } from "react-query";

import * as context from "./contexts.js";
import * as endpoints from "./endpoints.js";
import * as comp from "./components.js";
import img from "./images/film-poster-placeholder.png";

export function ReviewForm() {
  const location = useLocation();
  const movieId = location.state.movieId;

  const {
    data: movie,
    error,
    isLoading,
    isError,
  } = useQuery(["movie", { id: movieId }], endpoints.getMovie);

  if (isLoading) {
    return <comp.Spinner />;
  }

  if (isError) {
    return <h1>{error.message}</h1>;
  }
  return (
    <comp.MovieDetailsPage movie={movie}>
      <comp.ReviewForm movie={movie} />
    </comp.MovieDetailsPage>
  );
}

function CastCredit({ credit }) {
  return (
    <ui.Grid2
      key={credit.id}
      size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}
      sx={{ m: 2, display: "flex", flexDirection: "column" }}
    >
      <ui.Card sx={{ height: "100%" }}>
        <ui.CardHeader
          title={
            <ui.Typography variant="h5" component="p">
              {credit.name}
            </ui.Typography>
          }
        />
        <ui.CardMedia
          sx={{ height: 300 }}
          image={
            credit.profile_path
              ? `https://image.tmdb.org/t/p/w500/${credit.profile_path}`
              : img
          }
        />
        <ui.CardContent>
          <ui.Grid2 container direction="column">
            <ui.Grid2>
              <ui.Typography component="p">{credit.character}</ui.Typography>
            </ui.Grid2>
            <ui.Grid2>
              <ui.Typography component="p">
                <icons.StarRate fontSize="small" />
                {"  "} {credit.popularity}{" "}
              </ui.Typography>
            </ui.Grid2>
          </ui.Grid2>
        </ui.CardContent>
        <ui.CardActions disableSpacing>
          <Link to={`/person/${credit.id}`}>
            <ui.Button variant="outlined" size="medium" color="primary">
              More Info ...
            </ui.Button>
          </Link>
        </ui.CardActions>
      </ui.Card>
    </ui.Grid2>
  );
}

export function MovieCredits() {
  const { id } = useParams();
  const [credits, movie] = useQueries([
    { queryKey: ["credits", { id: id }], queryFn: endpoints.getMovieCredits },
    { queryKey: ["movie", { id: id }], queryFn: endpoints.getMovie },
  ]);

  if (credits.isLoading || movie.isLoading) {
    return <comp.Spinner />;
  }

  const err = credits.error || movie.error;

  if (err) {
    return <h1>{err.message}</h1>;
  }

  return (
    <>
      {movie.data ? (
        <>
          <comp.MovieDetailsPage movie={movie.data}>
            <ui.Typography variant="h5" component="h3">
              Cast
            </ui.Typography>
            <ui.Divider />
            <ui.Grid2 container sx={{ alignItems: "stretch" }}>
              {credits.data.cast.map((m) => (
                <CastCredit key={m.id} credit={m} />
              ))}
            </ui.Grid2>
          </comp.MovieDetailsPage>
        </>
      ) : (
        <p>Waiting for movie details</p>
      )}
    </>
  );
}

export function FavoriteMovies() {
  const { favorites: movieIds } = useContext(context.Movies);

  // Create an array of queries and run in parallel.
  const favoriteMovieQueries = useQueries(
    movieIds.map((movieId) => {
      return {
        queryKey: ["movie", { id: movieId }],
        queryFn: endpoints.getMovie,
      };
    }),
  );
  // Check if any of the parallel queries is still loading.
  const isLoading = favoriteMovieQueries.find((m) => m.isLoading === true);

  if (isLoading) {
    return <comp.Spinner />;
  }

  const movies = favoriteMovieQueries.map((q) => {
    q.data.genre_ids = q.data.genres.map((g) => g.id);
    return q.data;
  });

  return (
    <comp.MovieListPage
      title="Favorite Movies"
      movies={movies}
      action={(movie) => {
        return (
          <>
            <comp.RemoveFromFavoritesIcon movie={movie} />
            <comp.WriteReviewIcon movie={movie} />
          </>
        );
      }}
    />
  );
}

export function Watchlist() {
  const { watchlist: movieIds } = useContext(context.Movies);

  const queries = useQueries(
    movieIds.map((movieId) => {
      return {
        queryKey: ["movie", { id: movieId }],
        queryFn: endpoints.getMovie,
      };
    }),
  );
  const isLoading = queries.find((m) => m.isLoading === true);

  if (isLoading) {
    return <comp.Spinner />;
  }

  const movies = queries.map((q) => {
    q.data.genre_ids = q.data.genres.map((g) => g.id);
    return q.data;
  });

  return (
    <comp.MovieListPage
      title="Watchlist"
      movies={movies}
      action={(movie) => {
        return <comp.RemoveFromWatchlistIcon movie={movie} />;
      }}
    />
  );
}

export function Home() {
  const [page, setPage] = useState(1);
  const { data, error, isLoading, isError } = useQuery(
    ["discover", { page: page }],
    endpoints.getMovies,
  );

  if (isLoading) {
    return <comp.Spinner />;
  }

  if (isError) {
    return <h1>{error.message}</h1>;
  }

  const movies = data.results;

  return (
    <comp.MovieListPage
      title="Discover Movies"
      movies={movies}
      page={page}
      setPage={setPage}
      action={(movie) => {
        return <CommonMovieActions movie={movie} />;
      }}
    />
  );
}

export function LogIn() {
  const ctx = useContext(context.Auth);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const login = async () => {
    const { success = false, msg } = await ctx.authenticate(username, password);
    if (!success) {
      setError(msg);
    }
  };

  if (ctx.isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <ui.Grid2
      container
      direction="column"
      size={12}
      spacing={4}
      alignItems="center"
      sx={{
        padding: 5,
      }}
    >
      <ui.Grid2
        container
        size={12}
        direction="column"
        spacing={2}
        alignItems="center"
      >
        <ui.Grid2>
          <ui.Typography variant="h3" component="h1">
            Log in
          </ui.Typography>
        </ui.Grid2>
        <ui.Grid2>
          <ui.TextField
            label="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </ui.Grid2>
        <ui.Grid2>
          <ui.TextField
            label="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </ui.Grid2>
      </ui.Grid2>
      <ui.Grid2>
        <ui.Button onClick={login}>Log in</ui.Button>
      </ui.Grid2>
      {error ? (
        <ui.Grid2>
          <ui.Alert severity="error">Error: {error}</ui.Alert>
        </ui.Grid2>
      ) : (
        <></>
      )}
    </ui.Grid2>
  );
}

export function MovieDetails() {
  const { id } = useParams();
  const {
    data: movie,
    error,
    isLoading,
    isError,
  } = useQuery(["movie", { id: id }], endpoints.getMovie);

  if (isLoading) {
    return <comp.Spinner />;
  }

  if (isError) {
    return <h1>{error.message}</h1>;
  }

  return (
    <>
      {movie ? (
        <comp.MovieDetailsPage movie={movie}>
          <comp.MovieDetails movie={movie} />
        </comp.MovieDetailsPage>
      ) : (
        <p>Waiting for movie details</p>
      )}
    </>
  );
}

export function MovieReview() {
  let location = useLocation();
  const { movie, review } = location.state;

  return (
    <comp.MovieDetailsPage movie={movie}>
      <comp.MovieReview review={review} />
    </comp.MovieDetailsPage>
  );
}

export function Person() {
  const { id } = useParams();
  let [movies, person] = useQueries([
    {
      queryKey: ["personMovies", { id: id }],
      queryFn: endpoints.getPersonMovies,
    },
    { queryKey: ["person", { id: id }], queryFn: endpoints.getPerson },
  ]);

  if (movies.isLoading || person.isLoading) {
    return <comp.Spinner />;
  }

  const err = movies.error || person.error;

  if (err) {
    return <h1>{err.message}</h1>;
  }

  person = person.data;

  return (
    <comp.MovieListPage
      title={person.name}
      movies={movies.data.cast}
      action={(movie) => <CommonMovieActions movie={movie} />}
    >
      <ui.Grid2 container>
        <ui.Grid2
          size={2}
          sx={{
            // Required for the maxHeight of the child Box to work for some reason
            height: "100%",
          }}
        >
          <ui.Box
            component="img"
            src={`https://image.tmdb.org/t/p/w500/${person.profile_path}`}
            sx={{
              borderRadius: "20px",
              maxWidth: "100%",
              maxHeight: "100%",
            }}
          />
        </ui.Grid2>
        <ui.Grid2 size={1} />
        <ui.Grid2 size={8}>
          <ui.Typography component="p">{person.biography}</ui.Typography>
        </ui.Grid2>
      </ui.Grid2>
      <ui.Divider sx={{ margin: "20px" }} />
      <ui.Typography variant="h2" component="h1" align="center">
        Appears in
      </ui.Typography>
    </comp.MovieListPage>
  );
}

export function SignUp() {
  const ctx = useContext(context.Auth);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [registered, setRegistered] = useState(false);
  const [error, setError] = useState(null);

  const register = async () => {
    let pwRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    const validPassword = pwRegex.test(password);

    if (!validPassword) {
      setError(
        "Invalid password. Must contain at least 8 characters and include a number and a symbol.",
      );
      return;
    }

    if (password !== passwordAgain) {
      setError("Passwords do not match.");
      return;
    }

    const { success = false, msg } = await ctx.register(username, password);
    if (success) {
      setRegistered(true);
    } else {
      setError(msg);
    }
  };

  if (registered) {
    return <Navigate to="/" />;
  }

  return (
    <ui.Grid2
      container
      direction="column"
      size={12}
      spacing={4}
      alignItems="center"
      sx={{
        padding: 5,
      }}
    >
      <ui.Grid2
        container
        size={12}
        direction="column"
        spacing={2}
        alignItems="center"
      >
        <ui.Grid2>
          <ui.Typography variant="h3" component="h1">
            Sign up
          </ui.Typography>
        </ui.Grid2>
        <ui.Grid2>
          <ui.TextField
            label="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </ui.Grid2>
        <ui.Grid2>
          <ui.TextField
            label="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </ui.Grid2>
        <ui.Grid2>
          <ui.TextField
            label="Confirm password"
            onChange={(e) => setPasswordAgain(e.target.value)}
          />
        </ui.Grid2>
      </ui.Grid2>
      <ui.Grid2>
        <ui.Button onClick={register}>Sign up</ui.Button>
      </ui.Grid2>
      {error ? (
        <ui.Grid2>
          <ui.Alert severity="error">Error: {error}</ui.Alert>
        </ui.Grid2>
      ) : (
        <></>
      )}
    </ui.Grid2>
  );
}

export function TopRatedMovies() {
  const [page = 1, setPage] = useState(1);
  const { data, error, isLoading, isError } = useQuery(
    ["topRated", { page: page }],
    endpoints.getTopRatedMovies,
  );

  if (isLoading) {
    return <comp.Spinner />;
  }

  if (isError) {
    return <h1>{error.message}</h1>;
  }
  const movies = data.results;

  return (
    <comp.MovieListPage
      title="Top Rated Movies"
      movies={movies}
      action={(movie) => <CommonMovieActions movie={movie} />}
      page={page}
      setPage={setPage}
    />
  );
}

export function TrendingMovies() {
  const { data, error, isLoading, isError } = useQuery(
    "trending",
    endpoints.getTrendingMovies,
  );

  if (isLoading) {
    return <comp.Spinner />;
  }

  if (isError) {
    return <h1>{error.message}</h1>;
  }
  const movies = data.results;

  return (
    <comp.MovieListPage
      title="Trending Movies"
      movies={movies}
      action={(movie) => <CommonMovieActions movie={movie} />}
    />
  );
}

function CommonMovieActions(props) {
  return (
    <>
      <comp.AddToFavoritesIcon movie={props.movie} />
      <comp.AddToWatchlistIcon movie={props.movie} />
    </>
  );
}

export function UpcomingMovies() {
  const { data, error, isLoading, isError } = useQuery(
    "upcoming",
    endpoints.getUpcomingMovies,
  );

  if (isLoading) {
    return <comp.Spinner />;
  }

  if (isError) {
    return <h1>{error.message}</h1>;
  }
  const movies = data.results;

  return (
    <comp.MovieListPage
      title="Upcoming Movies"
      movies={movies}
      action={(movie) => <comp.AddToWatchlistIcon movie={movie} />}
    />
  );
}
