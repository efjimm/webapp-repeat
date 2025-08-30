import React, { useContext, useState } from "react";
import {
  Alert,
  Button,
  Grid2 as Grid,
  TextField,
  Typography,
} from "@mui/material";
import { AuthContext } from "../contexts/authContext";
import { Navigate } from "react-router-dom";

export default function LoginPage() {
  const context = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const login = async () => {
    const { success = false, msg } = await context.authenticate(
      username,
      password,
    );
    if (!success) {
      setError(msg);
    }
  };

  if (context.isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <Grid
      container
      direction="column"
      size={12}
      spacing={4}
      alignItems="center"
      sx={{
        padding: 5,
      }}
    >
      <Grid
        container
        size={12}
        direction="column"
        spacing={2}
        alignItems="center"
      >
        <Grid>
          <Typography variant="h3" component="h1">
            Log in
          </Typography>
        </Grid>
        <Grid>
          <TextField
            label="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </Grid>
        <Grid>
          <TextField
            label="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Grid>
      </Grid>
      <Grid>
        <Button onClick={login}>Log in</Button>
      </Grid>
      {error ? (
        <Grid>
          <Alert severity="error">Error: {error}</Alert>
        </Grid>
      ) : (
        <></>
      )}
    </Grid>
  );
}
