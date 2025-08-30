import mongoose from "mongoose";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

UserSchema.path("password").validate((pw) =>
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(pw),
);

UserSchema.methods.comparePassword = async function (passw) {
  return await bcrypt.compare(passw, this.password);
};

UserSchema.statics.findByUserName = function (username) {
  return this.findOne({ username: username });
};

UserSchema.pre("save", async function (next) {
  const saltRounds = 10; // You can adjust the number of salt rounds
  //const user = this;
  if (this.isModified("password") || this.isNew) {
    try {
      const hash = await bcrypt.hash(this.password, saltRounds);
      this.password = hash;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

const MovieSchema = new Schema({
  adult: { type: Boolean },
  id: { type: Number, required: true, unique: true },
  poster_path: { type: String },
  overview: { type: String },
  release_date: { type: String },
  original_title: { type: String },
  genre_ids: [{ type: Number }],
  original_language: { type: String },
  title: { type: String },
  backdrop_path: { type: String },
  popularity: { type: Number },
  vote_count: { type: Number },
  video: { type: Boolean },
  vote_average: { type: Number },
  production_countries: [
    {
      iso_3166_1: { type: String },
      name: { type: String },
    },
  ],
  runtime: { type: Number },
  spoken_languages: [
    {
      iso_639_1: { type: String },
      name: { type: String },
    },
  ],
  status: { type: String },
  tagline: { type: String },
});

MovieSchema.statics.findByMovieDBId = function (id) {
  return this.findOne({ id: id });
};

const FavoritesSchema = new Schema({
  username: { type: String, unique: true, required: true },
  movies: [{ type: Number }],
});

FavoritesSchema.statics.findByUsername = function (username) {
  return this.findOne({ username: username });
};

export const movieModel = mongoose.model("Movies", MovieSchema);
export const userModel = mongoose.model("User", UserSchema);
export const favoritesModel = mongoose.model("Favorites", FavoritesSchema);
