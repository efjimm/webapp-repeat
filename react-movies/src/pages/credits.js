import React from "react";
import { useParams } from "react-router-dom";
import PageTemplate from "../components/templateMoviePage";
import { getMovie, getMovieCredits } from "../api/tmdb-api";
import { useQueries } from "react-query";
import Spinner from "../components/spinner";
import { Link } from "react-router-dom";
import {
  Grid2 as Grid,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Divider,
  Button,
} from "@mui/material";
import { StarRate } from "@mui/icons-material";
import img from "../images/film-poster-placeholder.png";

function CastCredit({ credit }) {
  return (
    <Grid
      key={credit.id}
      size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}
      sx={{ m: 2, display: "flex", flexDirection: "column" }}
    >
      <Card sx={{ height: "100%" }}>
        <CardHeader
          title={
            <Typography variant="h5" component="p">
              {credit.name}
            </Typography>
          }
        />
        <CardMedia
          sx={{ height: 300 }}
          image={
            credit.profile_path
              ? `https://image.tmdb.org/t/p/w500/${credit.profile_path}`
              : img
          }
        />
        <CardContent>
          <Grid container direction="column">
            <Grid>
              <Typography component="p">{credit.character}</Typography>
            </Grid>
            <Grid>
              <Typography component="p">
                <StarRate fontsize="small" />
                {"  "} {credit.popularity}{" "}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions disableSpacing>
          <Link to={`/person/${credit.id}`}>
            <Button variant="outlined" size="medium" color="primary">
              More Info ...
            </Button>
          </Link>
        </CardActions>
      </Card>
    </Grid>
  );
}

function MovieCredits({ credits }) {
  return credits.cast.map((m) => <CastCredit key={m.id} credit={m} />);
}

export default function CreditsPage() {
  const { id } = useParams();
  const [credits, movie] = useQueries([
    { queryKey: ["credits", { id: id }], queryFn: getMovieCredits },
    { queryKey: ["movie", { id: id }], queryFn: getMovie },
  ]);

  if (credits.isLoading || movie.isLoading) {
    return <Spinner />;
  }

  const err = credits.error || movie.error;

  if (err) {
    return <h1>{err.message}</h1>;
  }

  return (
    <>
      {movie.data ? (
        <>
          <PageTemplate movie={movie.data}>
            <Typography variant="h5" component="h3">
              Cast
            </Typography>
            <Divider />
            <Grid container sx={{ alignItems: "stretch" }}>
              <MovieCredits movie={movie.data} credits={credits.data} />
            </Grid>
          </PageTemplate>
        </>
      ) : (
        <p>Waiting for movie details</p>
      )}
    </>
  );
}
