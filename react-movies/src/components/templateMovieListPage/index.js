import React, { useState } from "react";
import Header from "../headerMovieList";
import FilterCard from "../filterMoviesCard";
import MovieList from "../movieList";
import Grid from "@mui/material/Grid2";

import { Button, ButtonGroup, Typography } from "@mui/material";

function Navigation({ page, setPage }) {
  // We use < and > characters instead of icons because they're the same height as the number text
  // which makes it easier to line up
  return (
    <ButtonGroup
      sx={{
        margin: "auto",
        display: "flex",
        textAlign: "center",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        sx={{ border: 1, padding: 1 }}
      >
        <Typography component="p">&lt;</Typography>
      </Button>
      <Button sx={{ border: 1, padding: 1 }}>
        <Typography component="p">{page}</Typography>
      </Button>
      <Button onClick={() => setPage(page + 1)} sx={{ border: 1, padding: 1 }}>
        <Typography component="p">&gt;</Typography>
      </Button>
    </ButtonGroup>
  );
}

export default function MovieListPageTemplate({
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
    <Grid container>
      <Grid size={12}>
        <Header title={title} />
      </Grid>
      <Grid container direction="column" size={12}>
        {children}
        <Grid container sx={{ flex: "1 1 500px" }}>
          <Grid
            key="find"
            size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}
            sx={{ padding: "20px" }}
          >
            <FilterCard
              onUserInput={handleChange}
              titleFilter={nameFilter}
              genreFilter={genreFilter}
            />
          </Grid>
          <MovieList action={action} movies={displayedMovies}></MovieList>
        </Grid>
      </Grid>
      {page && setPage ? <Navigation page={page} setPage={setPage} /> : <></>}
    </Grid>
  );
}
