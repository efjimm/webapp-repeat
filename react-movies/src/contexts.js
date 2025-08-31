import React, { useState, createContext, useContext } from "react";
import * as endpoints from "./endpoints.js";
import * as context from "./contexts.js";

export const Movies = React.createContext(null);
export const Auth = createContext(null);

export function AppProvider(props) {
  const existingToken = localStorage.getItem("token");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [_, setAuthToken] = useState(existingToken);
  const [userName, setUserName] = useState("");

  const [favorites, setFavorites] = useState([]);
  const [myReviews, setMyReviews] = useState({});
  const [watchlist, setWatchlist] = useState([]);

  const initMovieList = async (setList, endpointGetFn) => {
    if (!isAuthenticated) return;
    const movies = await endpointGetFn(userName);
    setList(movies);
  };

  const addToMovieList = async (movie, list, setList, endpointPutFn) => {
    if (!isAuthenticated) return;
    let newList = [];
    if (!list.includes(movie.id)) {
      newList = [...list, movie.id];
      await endpointPutFn(userName, movie.id);
    } else {
      newList = [...list];
    }
    setList(newList);
  };

  const removeFromMovieList = async (
    movie,
    list,
    setList,
    endpointDeleteFn,
  ) => {
    if (!isAuthenticated) return;
    await endpointDeleteFn(userName, movie.id);
    setList(list.filter((mId) => mId !== movie.id));
  };

  const initFavorites = async () => {
    initMovieList(setFavorites, endpoints.getFavorites);
  };

  const addToFavorites = async (movie) => {
    addToMovieList(movie, favorites, setFavorites, endpoints.putFavorites);
  };

  const removeFromFavorites = async (movie) => {
    removeFromMovieList(
      movie,
      favorites,
      setFavorites,
      endpoints.deleteFavourites,
    );
  };

  const initWatchlist = async () => {
    initMovieList(setWatchlist, endpoints.getWatchlist);
  };

  const addToWatchlist = async (movie) => {
    await addToMovieList(
      movie,
      watchlist,
      setWatchlist,
      endpoints.putWatchlist,
    );
  };

  const removeFromWatchlist = async (movie) => {
    removeFromMovieList(
      movie,
      watchlist,
      setWatchlist,
      endpoints.deleteWatchlist,
    );
  };

  const addReview = (movie, review) => {
    if (!isAuthenticated) return;
    setMyReviews({ ...myReviews, [movie.id]: review });
  };

  //Function to put JWT token in local storage.
  const setToken = (data) => {
    localStorage.setItem("token", data);
    setAuthToken(data);
  };

  const authenticate = async (username, password) => {
    const result = await endpoints.login(username, password);
    if (result.token) {
      setToken(result.token);
      setIsAuthenticated(true);
      setUserName(username);
      const [favs, wl] = await Promise.all([
        endpoints.getFavorites(username),
        endpoints.getWatchlist(username),
      ]);
      setFavorites(favs.movies);
      setWatchlist(wl.movies);
    }
    return result;
  };

  const register = async (username, password) => {
    return await endpoints.signup(username, password);
  };

  const signout = () => {
    setTimeout(() => setIsAuthenticated(false), 100);
  };

  return (
    <Auth.Provider
      value={{
        isAuthenticated,
        authenticate,
        register,
        signout,
        userName,
      }}
    >
      <Movies.Provider
        value={{
          favorites,
          initFavorites,
          addToFavorites,
          removeFromFavorites,

          watchlist,
          initWatchlist,
          addToWatchlist,
          removeFromWatchlist,

          addReview,
        }}
      >
        {props.children}
      </Movies.Provider>
    </Auth.Provider>
  );
}
