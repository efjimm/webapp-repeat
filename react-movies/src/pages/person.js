import React from "react";
import { useParams } from "react-router-dom";
import PageTemplate from "../components/templateMovieListPage";
import { getPersonMovies, getPerson } from "../api/tmdb-api";
import Spinner from "../components/spinner";
import { useQueries } from "react-query";
import { Box, Divider, Grid2 as Grid, Typography } from "@mui/material";
import AddToFavoritesIcon from "../components/cardIcons/addToFavorites";

export default function PersonPage() {
  const { id } = useParams();
  let [movies, person] = useQueries([
    { queryKey: ["personMovies", { id: id }], queryFn: getPersonMovies },
    { queryKey: ["person", { id: id }], queryFn: getPerson },
  ]);

  if (movies.isLoading || person.isLoading) {
    return <Spinner />;
  }

  const err = movies.error || person.error;

  if (err) {
    return <h1>{err.message}</h1>;
  }

  person = person.data;

  return (
    <PageTemplate
      title={person.name}
      movies={movies.data.cast}
      action={(movie) => <AddToFavoritesIcon movie={movie} />}
    >
      <Grid container>
        <Grid
          size={2}
          sx={{
            // Required for the maxHeight of the child Box to work for some reason
            height: "100%",
          }}
        >
          <Box
            component="img"
            src={`https://image.tmdb.org/t/p/w500/${person.profile_path}`}
            sx={{
              borderRadius: "20px",
              maxWidth: "100%",
              maxHeight: "100%",
            }}
          />
        </Grid>
        <Grid size={1} />
        <Grid size={8}>
          <Typography component="p">{person.biography}</Typography>
        </Grid>
      </Grid>
      <Divider sx={{ margin: "20px" }} />
      <Typography variant="h2" component="h1" align="center">
        Appears in
      </Typography>
    </PageTemplate>
  );
}
