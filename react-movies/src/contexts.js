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
  const [mustWatch, setMustWatch] = useState([]);

  const addToFavorites = async (movie) => {
    if (!isAuthenticated) {
      console.log("Not authed");
      return;
    }

    let newFavorites = [];
    if (!favorites.includes(movie.id)) {
      newFavorites = [...favorites, movie.id];
      await endpoints.putFavorites(userName, movie.id);
    } else {
      newFavorites = [...favorites];
    }
    setFavorites(newFavorites);
  };

  const removeFromFavorites = async (movie) => {
    if (!isAuthenticated) return;
    await endpoints.deleteFavourites(userName, movie.id);
    setFavorites(favorites.filter((mId) => mId !== movie.id));
  };
  const addReview = (movie, review) => {
    if (!isAuthenticated) return;
    setMyReviews({ ...myReviews, [movie.id]: review });
  };

  const initFavorites = async () => {
    if (!isAuthenticated) return;
    const movies = await endpoints.getFavorites(userName);
    setFavorites(movies);
  };

  const addMustWatch = (movie) => {
    let newMustWatch = [];
    if (!mustWatch.includes(movie.id)) {
      newMustWatch = [...mustWatch, movie.id];
    } else {
      newMustWatch = [...mustWatch];
    }
    setMustWatch(newMustWatch);
    console.log(newMustWatch);
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
      const entry = await endpoints.getFavorites(username);
      setFavorites(entry.movies);
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
          addToFavorites,
          removeFromFavorites,
          addReview,
          mustWatch,
          addMustWatch,
          initFavorites,
        }}
      >
        {props.children}
      </Movies.Provider>
    </Auth.Provider>
  );
}
