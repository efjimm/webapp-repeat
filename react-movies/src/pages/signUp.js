import React, { useContext, useState } from "react";
import {
  Alert,
  Button,
  Grid2 as Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { AuthContext } from "../contexts/authContext";
import { Navigate } from "react-router-dom";

export default function SignUpPage() {
  const context = useContext(AuthContext);
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

    const { success = false, msg } = await context.register(username, password);
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
            Sign up
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
        <Grid>
          <TextField
            label="Confirm password"
            onChange={(e) => setPasswordAgain(e.target.value)}
          />
        </Grid>
      </Grid>
      <Grid>
        <Button onClick={register}>Sign up</Button>
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
