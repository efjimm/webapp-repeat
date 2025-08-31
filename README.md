# Assignment 2 - Web API

Name: Evan Bonner

## New Features

- Provides all endpoints necessary for the frontend
- Favorite movies stored in MongoDB with associated endpoints implemented
- Watchlist stored in MongoDB with associated endpoints implemented
- Protected routes for favorites and watchlist

## Setup requirements.

Run `npm install` in the `react-movies` and `movies-api` subdirectories. Run `npm start` in both subdirectories to launch the backend and frontend respectively.

## API Configuration

In the `movies-api` subdirectory, create a file called `.env` with the following contents, adjusting as necessary:

```env
NODE_ENV=development
PORT=8080
MONGO_DB=path/to/mongodb
TMDB_KEY="your tmdb api key"
SECRET=JWTsecret
```

## API Design

| Route                           | Method | Description                                                     | Info                                                                                                                     |
|---------------------------------|--------|-----------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------|
| /api/movies                     | GET    | Gets a list of movies.                                          | Can take a `page` query parameter.                                                                                      |
| /api/movies/top_rated           | GET    | Gets a list of top rated movies.                                | Can take a `page` query parameter.                                                                                      |
| /api/movies/upcoming            | GET    | Get a list of upcoming movies.                                  |                                                                                                                         |
| /api/movies/trending            | GET    | Get a list of trending movies.                                  |                                                                                                                         |
| /api/movies/genres              | GET    | Get a list of movie genres.                                     |                                                                                                                         |
| /api/movies/{id}/details        | GET    | Get details for the specified movie.                            |                                                                                                                         |
| /api/movies/{id}/credits        | GET    | Get credits information for the specified movie.                |                                                                                                                         |
| /api/movies/{id}/images         | GET    | Get images for the specified movie.                             |                                                                                                                         |
| /api/movies/{id}/reviews        | GET    | Get reviews for the specified movie.                            |                                                                                                                         |
| /api/movies/person/{id}         | GET    | Get a list of movies associated with the given person.          |                                                                                                                         |
| /api/movies/person/{id}/details | GET    | Get details for a person.                                       |                                                                                                                         |
| /api/users                      | GET    | Get a list of all users.                                        |                                                                                                                         |
| /api/users/{id}                 | POST   | Register or authenticate a user.                                | Body should include username and password. Authenticates by default, unless the `action=register` parameter is present. |
| /api/users/{id}                 | PUT    | Update a user's details.                                        |                                                                                                                         |
| /api/favorites/{username}       | GET    | Get the favorite movies list of the given user.                 | Requires authorization.                                                                                                 |
| /api/favorites/{username}       | PUT    | Add one or more movies to the favorites of the given user.      | Requires authorization.                                                                                                 |
| /api/favorites/{username}       | DELETE | Delete one or more movies from the favorites of the given user. | Requires authorization.                                                                                                 |
| /api/watchlist/{username}       | GET    | Get the watchlist of the given user.                            | Requires authorization.                                                                                                 |
| /api/watchlist/{username}       | PUT    | Add one or more movies to the watchlist of the given user.      | Requires authorization.                                                                                                 |
| /api/watchlist/{username}       | DELETE | Delete one or more movies from the watchlist of the given user. | Requires authorization.                                                                                                 |

## Security and Authentication

Uses JSON web tokens, same as the labs. Favorites and watchlists routes are protected. Other routes
could be protected with a one line change but aren't for convenvience.

## Integrating with React App

All fetches from the fronted go to the backend instead of TMDB. The backend fetches from TMDB
for movie information, and uses MongoDB for user information including logins, favorites, and
watchlists. All fetches from the backend are done in `src/endpoints.js`.
