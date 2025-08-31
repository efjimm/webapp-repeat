import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Navigate, Routes } from "react-router-dom";
import * as pages from "./pages.js";
import { ProtectedRoutes, SiteHeader } from "./components.js";
import { QueryClientProvider, QueryClient } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import * as context from "./contexts.js";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 360000,
      refetchInterval: 360000,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <context.AppProvider>
          <SiteHeader />
          <Routes>
            <Route element={<ProtectedRoutes />}>
              <Route
                path="/movies/favorites"
                element={<pages.FavoriteMovies />}
              />
              <Route path="/movies/watchlist" element={<pages.Watchlist />} />
            </Route>
            <Route path="/movies/upcoming" element={<pages.UpcomingMovies />} />
            <Route path="/movies/trending" element={<pages.TrendingMovies />} />
            <Route
              path="/movies/top_rated"
              element={<pages.TopRatedMovies />}
            />
            <Route path="/reviews/:id" element={<pages.MovieReview />} />
            <Route path="/movies/:id" element={<pages.MovieDetails />} />
            <Route
              path="/movies/:id/credits"
              element={<pages.MovieCredits />}
            />
            <Route path="/person/:id" element={<pages.Person />} />
            <Route path="/reviews/form" element={<pages.ReviewForm />} />
            <Route path="/signup" element={<pages.SignUp />} />
            <Route path="/login" element={<pages.LogIn />} />
            <Route path="/" element={<pages.Home />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </context.AppProvider>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

const rootElement = createRoot(document.getElementById("root"));
rootElement.render(<App />);
