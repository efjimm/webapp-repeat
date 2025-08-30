import React, { useState, useContext } from "react";
import { useQuery } from "react-query";
import truncate from "lodash/truncate";
import { useForm, Controller } from "react-hook-form";
import {
  Link,
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import * as ui from "@mui/material";
import * as icons from "@mui/icons-material";
import { styled, useTheme } from "@mui/material/styles";

import * as context from "./contexts.js";
import * as endpoints from "./endpoints.js";
import placeholderImg from "./images/film-poster-placeholder.png";
import filterImg from "./images/pexels-dziana-hasanbekava-5480827.jpg";

export function ProtectedRoutes() {
  const ctx = useContext(context.Auth);
  const location = useLocation();

  return ctx.isAuthenticated === true ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
}

export function WriteReviewIcon({ movie }) {
  return (
    <Link
      to={`/reviews/form`}
      state={{
        movieId: movie.id,
      }}
    >
      <icons.RateReview color="primary" fontSize="large" />
    </Link>
  );
}

export function AddToFavoritesIcon({ movie }) {
  const ctx = useContext(context.Movies);

  const handleAddToFavorites = (e) => {
    e.preventDefault();
    ctx.addToFavorites(movie);
  };

  return (
    <ui.IconButton aria-label="add to favorites" onClick={handleAddToFavorites}>
      <icons.Favorite color="primary" fontSize="large" />
    </ui.IconButton>
  );
}

export function AddToMustWatchIcon({ movie }) {
  const ctx = useContext(context.Movies);

  const handleAddToMustWatch = (e) => {
    e.preventDefault();
    ctx.addMustWatch(movie);
  };
  return (
    <ui.IconButton
      aria-label="Add to must watch"
      onClick={handleAddToMustWatch}
    >
      <icons.PlaylistAdd color="primary" fontSize="large" />
    </ui.IconButton>
  );
}

export function RemoveFromFavoritesIcon({ movie }) {
  const ctx = useContext(context.Movies);

  const handleRemoveFromFavorites = (e) => {
    e.preventDefault();
    ctx.removeFromFavorites(movie);
  };
  return (
    <ui.IconButton
      aria-label="remove from favorites"
      onClick={handleRemoveFromFavorites}
    >
      <icons.Delete color="primary" fontSize="large" />
    </ui.IconButton>
  );
}

const formControl = {
  margin: 1,
  minWidth: 220,
  backgroundColor: "rgb(255, 255, 255)",
};

export function FilterMoviesCard(props) {
  const { data, error, isLoading, isError } = useQuery(
    "genres",
    endpoints.getGenres,
  );

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <h1>{error.message}</h1>;
  }
  const genres = data.genres;
  if (genres[0].name !== "All") {
    genres.unshift({ id: "0", name: "All" });
  }

  const handleChange = (e, type, value) => {
    e.preventDefault();
    props.onUserInput(type, value);
  };

  const handleTextChange = (e, _) => {
    handleChange(e, "name", e.target.value);
  };

  const handleGenreChange = (e) => {
    handleChange(e, "genre", e.target.value);
  };

  return (
    <ui.Card
      sx={{
        backgroundColor: "rgb(204, 204, 0)",
      }}
      variant="outlined"
    >
      <ui.CardContent>
        <ui.Typography variant="h5" component="h1">
          <icons.Search fontSize="large" />
          Filter the movies.
        </ui.Typography>
        <ui.TextField
          sx={{ ...formControl }}
          id="filled-search"
          label="Search field"
          type="search"
          variant="filled"
          value={props.titleFilter}
          onChange={handleTextChange}
        />
        <ui.FormControl sx={{ ...formControl }}>
          <ui.InputLabel id="genre-label">Genre</ui.InputLabel>
          <ui.Select
            labelId="genre-label"
            id="genre-select"
            defaultValue=""
            value={props.genreFilter}
            onChange={handleGenreChange}
          >
            {genres.map((genre) => {
              return (
                <ui.MenuItem key={genre.id} value={genre.id}>
                  {genre.name}
                </ui.MenuItem>
              );
            })}
          </ui.Select>
        </ui.FormControl>
      </ui.CardContent>
      <ui.CardMedia sx={{ height: 300 }} image={filterImg} title="Filter" />
      <ui.CardContent>
        <ui.Typography variant="h5" component="h1">
          <icons.Search fontSize="large" />
          Filter the movies.
          <br />
        </ui.Typography>
      </ui.CardContent>
    </ui.Card>
  );
}

export function MovieHeader(props) {
  const movie = props.movie;
  const navigate = useNavigate();

  return (
    <ui.Paper
      component="div"
      sx={{
        display: "flex",
        justifyContent: "space-around",
        flexWrap: "wrap",
        padding: 1.5,
        margin: 0,
      }}
    >
      <ui.IconButton aria-label="go back" onClick={() => navigate(-1)}>
        <icons.ArrowBack color="primary" fontSize="large" />
      </ui.IconButton>

      <ui.Typography variant="h4" component="h3">
        {movie.title}
        <a href={movie.homepage}>
          <icons.Home color="primary" />
        </a>
        <br />
        <span sx={{ fontSize: "1.5rem" }}>{`   "${movie.tagline}"`} </span>
      </ui.Typography>

      <ui.IconButton aria-label="go forward" onClick={() => navigate(+1)}>
        <icons.ArrowForward color="primary" fontSize="large" />
      </ui.IconButton>
    </ui.Paper>
  );
}

function Header(props) {
  const title = props.title;
  const navigate = useNavigate();
  return (
    <ui.Paper
      component="div"
      sx={{
        display: "flex",
        justifyContent: "space-around",
        flexWrap: "wrap",
        marginBottom: 1.5,
      }}
    >
      <ui.IconButton aria-label="go back" onClick={() => navigate(-1)}>
        <icons.ArrowBack color="primary" fontSize="large" />
      </ui.IconButton>

      <ui.Typography variant="h4" component="h3">
        {title}
      </ui.Typography>
      <ui.IconButton aria-label="go forward" onClick={() => navigate(+1)}>
        <icons.ArrowForward color="primary" fontSize="large" />
      </ui.IconButton>
    </ui.Paper>
  );
}

function MovieCard({ movie, action }) {
  const { favorites } = useContext(context.Movies);

  if (favorites.find((id) => id === movie.id)) {
    movie.favorite = true;
  } else {
    movie.favorite = false;
  }

  return (
    <ui.Card>
      <ui.CardHeader
        avatar={
          movie.favorite ? (
            <ui.Avatar sx={{ backgroundColor: "red" }}>
              <icons.Favorite />
            </ui.Avatar>
          ) : null
        }
        title={
          <ui.Typography variant="h5" component="p">
            {movie.title}{" "}
          </ui.Typography>
        }
      />
      <ui.CardMedia
        sx={{ height: 500 }}
        image={
          movie.poster_path
            ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
            : placeholderImg
        }
      />
      <ui.CardContent>
        <ui.Grid2 container>
          <ui.Grid2 size={{ xs: 6 }}>
            <ui.Typography variant="h6" component="p">
              <icons.CalendarTodayTwoTone fontSize="small" />
              {movie.release_date}
            </ui.Typography>
          </ui.Grid2>
          <ui.Grid2 size={{ xs: 6 }}>
            <ui.Typography variant="h6" component="p">
              <icons.StarRate fontSize="small" />
              {"  "} {movie.vote_average}{" "}
            </ui.Typography>
          </ui.Grid2>
        </ui.Grid2>
      </ui.CardContent>
      <ui.CardActions disableSpacing>
        {action(movie)}

        <Link to={`/movies/${movie.id}`}>
          <ui.Button variant="outlined" size="medium" color="primary">
            More Info ...
          </ui.Button>
        </Link>
      </ui.CardActions>
    </ui.Card>
  );
}

export function MovieDetails({ movie }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const root = {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    listStyle: "none",
    padding: 1.5,
    margin: 0,
  };
  const chip = { margin: 0.5 };

  return (
    <>
      <ui.Typography variant="h5" component="h3">
        Overview
      </ui.Typography>

      <ui.Typography variant="h6" component="p">
        {movie.overview}
      </ui.Typography>

      <ui.Paper component="ul" sx={{ ...root }}>
        <li>
          <ui.Chip label="Genres" sx={{ ...chip }} color="primary" />
        </li>
        {movie.genres.map((g) => (
          <li key={g.name}>
            <ui.Chip label={g.name} sx={{ ...chip }} />
          </li>
        ))}
      </ui.Paper>
      <ui.Paper component="ul" sx={{ ...root }}>
        <ui.Chip icon={<icons.AccessTime />} label={`${movie.runtime} min.`} />
        <ui.Chip
          icon={<icons.MonetizationOn />}
          label={`${movie.revenue.toLocaleString()}`}
        />
        <ui.Chip
          icon={<icons.StarRate />}
          label={`${movie.vote_average} (${movie.vote_count}`}
        />
        <ui.Chip label={`Released: ${movie.release_date}`} />
      </ui.Paper>
      <ui.Paper component="ul" sx={{ ...root }}>
        <li>
          <ui.Chip
            label="Production Countries"
            sx={{ ...chip }}
            color="primary"
          />
        </li>
        {movie.production_countries.map((g) => (
          <li key={g.name}>
            <ui.Chip label={g.name} sx={{ ...chip }} />
          </li>
        ))}
      </ui.Paper>
      <ui.Box
        sx={{
          position: "fixed",
          bottom: "1em",
          right: "1em",
        }}
      >
        <ui.Fab
          color="secondary"
          variant="extended"
          onClick={() => setDrawerOpen(true)}
        >
          <icons.Navigation />
          Reviews
        </ui.Fab>
        <ui.Fab
          color="secondary"
          variant="extended"
          component={Link}
          to={`/movies/${movie.id}/credits`}
        >
          <icons.Subject />
          Credits
        </ui.Fab>
      </ui.Box>
      <ui.Drawer
        anchor="top"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <MovieReviews movie={movie} />
      </ui.Drawer>
    </>
  );
}

export function MovieList(props) {
  return props.movies.map((m) => (
    <ui.Grid2
      key={m.id}
      size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}
      sx={{ padding: "20px" }}
    >
      <MovieCard key={m.id} movie={m} action={props.action} />
    </ui.Grid2>
  ));
}

export function MovieReview({ review }) {
  return (
    <>
      <ui.Typography variant="h5" component="h3">
        Review By: {review.author}
      </ui.Typography>

      <ui.Typography variant="h6" component="p">
        {review.content}
      </ui.Typography>
    </>
  );
}

export function MovieReviews({ movie }) {
  const { data, error, isLoading, isError } = useQuery(
    ["reviews", { id: movie.id }],
    endpoints.getMovieReviews,
  );

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <h1>{error.message}</h1>;
  }

  const reviews = data.results;

  return (
    <ui.TableContainer component={ui.Paper}>
      <ui.Table sx={{ minWidth: 550 }} aria-label="reviews table">
        <ui.TableHead>
          <ui.TableRow>
            <ui.TableCell>Author</ui.TableCell>
            <ui.TableCell align="center">Excerpt</ui.TableCell>
            <ui.TableCell align="right">More</ui.TableCell>
          </ui.TableRow>
        </ui.TableHead>
        <ui.TableBody>
          {reviews.map((r) => (
            <ui.TableRow key={r.id}>
              <ui.TableCell component="th" scope="row">
                {r.author}
              </ui.TableCell>
              <ui.TableCell>{excerpt(r.content)}</ui.TableCell>
              <ui.TableCell>
                <Link
                  to={`/reviews/${r.id}`}
                  state={{
                    review: r,
                    movie: movie,
                  }}
                >
                  Full Review
                </Link>
              </ui.TableCell>
            </ui.TableRow>
          ))}
        </ui.TableBody>
      </ui.Table>
    </ui.TableContainer>
  );
}

const ratings = [
  {
    value: 5,
    label: "Excellent",
  },
  {
    value: 4,
    label: "Good",
  },
  {
    value: 3,
    label: "Average",
  },
  {
    value: 2,
    label: "Poor",
  },
  {
    value: 0,
    label: "Terrible",
  },
];

const styles = {
  root: {
    marginTop: 2,
    display: "flex",
    flexDirection: "column",
    alignItems: "left",
  },
  form: {
    width: "100%",
    "& > * ": {
      marginTop: 2,
    },
  },
  textField: {
    width: "40ch",
  },
  submit: {
    marginRight: 2,
  },
  snack: {
    width: "50%",
    "& > * ": {
      width: "100%",
    },
  },
};

export function ReviewForm({ movie }) {
  const ctx = useContext(context.Movies);

  const [rating, setRating] = useState(3);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleSnackClose = (_) => {
    setOpen(false);
    navigate("/movies/favorites");
  };

  const defaultValues = {
    author: "",
    review: "",
    agree: false,
    rating: "3",
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm(defaultValues);

  const handleRatingChange = (event) => {
    setRating(event.target.value);
  };

  const onSubmit = (review) => {
    review.movieId = movie.id;
    review.rating = rating;
    ctx.addReview(movie, review);
    setOpen(true);
  };

  return (
    <ui.Box component="div" sx={styles.root}>
      <ui.Typography component="h2" variant="h3">
        Write a review
      </ui.Typography>

      <ui.Snackbar
        sx={styles.snack}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={open}
        onClose={handleSnackClose}
      >
        <ui.Alert
          severity="success"
          variant="filled"
          onClose={handleSnackClose}
        >
          <ui.Typography variant="h4">
            Thank you for submitting a review
          </ui.Typography>
        </ui.Alert>
      </ui.Snackbar>

      <form sx={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
        <Controller
          name="author"
          control={control}
          rules={{ required: "Name is required" }}
          defaultValue=""
          render={({ field: { onChange, value } }) => (
            <ui.TextField
              sx={{ width: "40ch" }}
              variant="outlined"
              margin="normal"
              required
              onChange={onChange}
              value={value}
              id="author"
              label="Author's name"
              name="author"
              autoFocus
            />
          )}
        />
        {errors.author && (
          <ui.Typography variant="h6" component="p">
            {errors.author.message}
          </ui.Typography>
        )}
        <Controller
          name="review"
          control={control}
          rules={{
            required: "Review cannot be empty.",
            minLength: { value: 10, message: "Review is too short" },
          }}
          defaultValue=""
          render={({ field: { onChange, value } }) => (
            <ui.TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="review"
              value={value}
              onChange={onChange}
              label="Review text"
              id="review"
              multiline
              minRows={10}
            />
          )}
        />
        {errors.review && (
          <ui.Typography variant="h6" component="p">
            {errors.review.message}
          </ui.Typography>
        )}

        <Controller
          control={control}
          name="rating"
          render={() => (
            <ui.TextField
              id="select-rating"
              select
              variant="outlined"
              label="Rating Select"
              value={rating}
              onChange={handleRatingChange}
              helperText="Don't forget your rating"
            >
              {ratings.map((option) => (
                <ui.MenuItem key={option.value} value={option.value}>
                  {option.label}
                </ui.MenuItem>
              ))}
            </ui.TextField>
          )}
        />

        <ui.Box sx={styles.buttons}>
          <ui.Button
            type="submit"
            variant="contained"
            color="primary"
            sx={styles.submit}
          >
            Submit
          </ui.Button>
          <ui.Button
            type="reset"
            variant="contained"
            color="secondary"
            sx={styles.submit}
            onClick={() => {
              reset({
                author: "",
                content: "",
              });
            }}
          >
            Reset
          </ui.Button>
        </ui.Box>
      </form>
    </ui.Box>
  );
}

const Offset = styled("div")(({ theme }) => theme.mixins.toolbar);

export function SiteHeader() {
  const ctx = useContext(context.Auth);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const theme = useTheme();
  const isMobile = ui.useMediaQuery(theme.breakpoints.down("md"));

  const navigate = useNavigate();

  const menuOptions = [
    { label: "Home", path: "/" },
    { label: "Favorites", path: "/movies/favorites" },
    { label: "Upcoming", path: "/movies/upcoming" },
    { label: "Trending", path: "/movies/trending" },
    { label: "Top Rated", path: "/movies/top_rated" },
  ];
  console.log(`Authed: ${ctx.isAuthenticated}`);
  if (!ctx.isAuthenticated) {
    menuOptions.push(
      { label: "Sign up", path: "/signup" },
      { label: "Log in", path: "/login" },
    );
  }

  const handleMenuSelect = (pageURL) => {
    navigate(pageURL, { replace: true });
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const username = ctx.isAuthenticated ? ctx.userName : "guest";

  return (
    <>
      <ui.AppBar position="fixed" color="secondary">
        <ui.Toolbar>
          <ui.Typography variant="h4" sx={{ flexGrow: 1 }}>
            TMDB Client
          </ui.Typography>
          <ui.Typography variant="h6" sx={{ flexGrow: 1 }}>
            Logged in as {username}
          </ui.Typography>
          {isMobile ? (
            <>
              <ui.IconButton
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <icons.Menu />
              </ui.IconButton>
              <ui.Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={open}
                onClose={() => setAnchorEl(null)}
              >
                {menuOptions.map((opt) => (
                  <ui.MenuItem
                    key={opt.label}
                    onClick={() => handleMenuSelect(opt.path)}
                  >
                    {opt.label}
                  </ui.MenuItem>
                ))}
              </ui.Menu>
            </>
          ) : (
            <>
              {menuOptions.map((opt) => (
                <ui.Button
                  key={opt.label}
                  color="inherit"
                  onClick={() => handleMenuSelect(opt.path)}
                >
                  {opt.label}
                </ui.Button>
              ))}
              {ctx.isAuthenticated ? (
                <ui.Button color="inherit" onClick={ctx.signout}>
                  Log out
                </ui.Button>
              ) : (
                <> </>
              )}
            </>
          )}
        </ui.Toolbar>
      </ui.AppBar>
      <Offset />
    </>
  );
}

export function Spinner() {
  return (
    <div
      sx={{
        display: "flex",
        justifyContent: "center",
        "& > * + *": {
          marginLeft: "2em",
        },
      }}
    >
      <ui.CircularProgress />
      <ui.CircularProgress />
    </div>
  );
}

function Navigation({ page, setPage }) {
  // We use < and > characters instead of icons because they're the same height as the number text
  // which makes it easier to line up
  return (
    <ui.ButtonGroup
      sx={{
        margin: "auto",
        display: "flex",
        textAlign: "center",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ui.Button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        sx={{ border: 1, padding: 1 }}
      >
        <ui.Typography component="p">&lt;</ui.Typography>
      </ui.Button>
      <ui.Button sx={{ border: 1, padding: 1 }}>
        <ui.Typography component="p">{page}</ui.Typography>
      </ui.Button>
      <ui.Button
        onClick={() => setPage(page + 1)}
        sx={{ border: 1, padding: 1 }}
      >
        <ui.Typography component="p">&gt;</ui.Typography>
      </ui.Button>
    </ui.ButtonGroup>
  );
}

export function MovieListPage({
  movies,
  title,
  action,
  children,
  page,
  setPage,
}) {
  const [nameFilter, setNameFilter] = useState("");
  const [genreFilter, setGenreFilter] = useState("0");
  const genreId = Number(genreFilter);

  let displayedMovies = movies
    .filter((m) => {
      return m.title.toLowerCase().search(nameFilter.toLowerCase()) !== -1;
    })
    .filter((m) => {
      return genreId > 0 ? m.genre_ids.includes(genreId) : true;
    });

  const handleChange = (type, value) => {
    if (type === "name") setNameFilter(value);
    else setGenreFilter(value);
  };

  return (
    <ui.Grid2 container>
      <ui.Grid2 size={12}>
        <Header title={title} />
      </ui.Grid2>
      <ui.Grid2 container direction="column" size={12}>
        {children}
        <ui.Grid2 container sx={{ flex: "1 1 500px" }}>
          <ui.Grid2
            key="find"
            size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}
            sx={{ padding: "20px" }}
          >
            <FilterMoviesCard
              onUserInput={handleChange}
              titleFilter={nameFilter}
              genreFilter={genreFilter}
            />
          </ui.Grid2>
          <MovieList action={action} movies={displayedMovies}></MovieList>
        </ui.Grid2>
      </ui.Grid2>
      {page && setPage ? <Navigation page={page} setPage={setPage} /> : <></>}
    </ui.Grid2>
  );
}

export function MovieDetailsPage({ movie, children }) {
  const { data, error, isLoading, isError } = useQuery(
    ["images", { id: movie.id }],
    endpoints.getMovieImages,
  );

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <h1>{error.message}</h1>;
  }
  const images = data.posters;

  return (
    <>
      <MovieHeader movie={movie} />

      <ui.Grid2 container spacing={5} style={{ padding: "15px" }}>
        <ui.Grid2 size={{ xs: 3 }}>
          <div
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-around",
            }}
          >
            <ui.ImageList
              sx={{
                height: "100vh",
              }}
              cols={1}
            >
              {images.map((image) => (
                <ui.ImageListItem key={image.file_path} cols={1}>
                  <img
                    src={`https://image.tmdb.org/t/p/w500/${image.file_path}`}
                    alt={image.poster_path}
                  />
                </ui.ImageListItem>
              ))}
            </ui.ImageList>
          </div>
        </ui.Grid2>

        <ui.Grid2 size={{ xs: 9 }}>{children}</ui.Grid2>
      </ui.Grid2>
    </>
  );
}

function excerpt(string) {
  return truncate(string, {
    length: 400,
    separator: /,?\.* +/,
  });
}
