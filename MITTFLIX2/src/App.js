import React from "react";
import * as MovieAPI from './MovieAPI';
import Header from "./Header";
import Movies from "./Movies";
import { Switch, Route } from "react-router-dom";

export default class App extends React.Component {
  state = {
    originalGenres: [],
    originalMovies: [],
    genres: [],
    movies: [],
    moviesFound: 0,
  };

  componentDidMount() {
    this.getAllMovies();
    this.getAllGenres();
  }
  /*
   * Loads the movie and genre from the API and stores them in the corresponding array state.
   */
  getAllMovies() {
    MovieAPI.getAllMovies()
    .then((movies) => {
      this.setState({ 
        originalMovies: movies.filter((value) => value.id !== undefined),  
        movies: movies.filter((value) => value.id !== undefined) 
      });
    });
  };

  /*
   * Loads all the movie from the API and stores them in the corresponding array state.
   */


  getAllGenres() {
    MovieAPI.getAllGenres()
    .then((genres) => {
      genres.sort(function (genreA, genreB) {
        if (genreA.name < genreB.name) return -1;
        return 1;
      });
      this.setState({ 
        originalGenres: genres,
        genres: genres,
      });
    });
  }

  /*
   * Loads all the genre from the API and stores them in the corresponding array state.
   */

  getMoviesByGenre = (genres) => {
    //console.log(this.state.movies[0].genre_ids);
    return this.state.movies.filter((movie) => {
      return movie.genre_ids.includes(genres.id);
    });
  };
  /*
   * Returns a list with all the movies that contain the received genre.
   */

  getFilteredMoviesList(query) {
    let filteredMovies = this.state.originalMovies.filter((movie) => {
      return (
        movie.title.toUpperCase().includes(query.toUpperCase()) ||
        movie.overview.toUpperCase().includes(query.toUpperCase())
      );
    });
    this.setState({ movies: filteredMovies });
    return filteredMovies;
  }
  /*
   * Returns a list with all the movies that maches with the querty received and update
   * the state movies, to show the result on screen.
   */

  searchMovies = (query) => {
    let filteredMovies = 0;
    query === ""
      ? this.getAllMovies()
      : (filteredMovies = this.getFilteredMoviesList(query));
    this.setState({ moviesFound: filteredMovies.length });
  };
  /*
   * Returns a list with all the movies that maches with the querty received and update
   * the state moviesFound, to show the count of results on screen.
   */

  toggleMyList = (movieUI) => {
    let index = this.state.movies.findIndex((movie) => movie.id === movieUI.id);
    let movie = this.state.movies.find((movie) => movie.id === movieUI.id);

    movie.my_list = !movie.my_list;
    this.setState({
      movies: [
        ...this.state.movies.slice(0, index),
        movie,
        ...this.state.movies.slice(index + 1),
      ],
    });

    movie.my_list
      ? MovieAPI.addToList(movieUI)
      : MovieAPI.removeFromList(movieUI);
  };
  /*
   * It receives a movie object, looks for it in the state movie, extracts it and alters
   * its my_list attribute, if it is false it makes it true and vice versa. Then go back
   * and insert the already modified movie object into the state movie. and commands to
   * remove or add the movie to the API according to its new state.
   */

  drawMoviesByGenre = () => {
    let genreWithoutMovies = "";
    return this.state.genres.map((genre, index) =>
      this.getMoviesByGenre(genre).length === 0
        ? genreWithoutMovies
        : this.drawMovies(genre, index)
    );
  };
  /*
   * If a genre does not contain movies, it returns an empty string. If it contains movies,
   * it returns the list of movies for that genre.
   */

  getMyListOfMovies = () => {
    return this.state.movies.filter((movie) => movie.my_list === true);
  };
  /*
   * Returns a list of movies that have been added to My List.
   */

  drawMovies = (showByMyListOrGenre, index) => {
    return (
      <div key={index}>
        <h1>
          {showByMyListOrGenre === `My List`
            ? `My List`
            : showByMyListOrGenre.name}
        </h1>
        <div className="titles-wrapper">
          <Movies
            movies={
              showByMyListOrGenre === `My List`
                ? this.getMyListOfMovies()
                : this.getMoviesByGenre(showByMyListOrGenre)
            }
            onClickPlus={this.toggleMyList}
          />
        </div>
      </div>
    );
  };
  /*
   * It receives by parameter a string or an array object of movies by gender.
   * It evaluates if the received argument is a string and if that string is
   * "My List", if so, it returns the list of movies stored in the My List,
   * otherwise it returns the list of movies by genre. All this in JSX format.
   */

  render = () => {
    return (
      <div className="app">
        <Route>
          <Header
            moviesFound={this.state.moviesFound}
            getInputForm={this.searchMovies}
          />
          <Switch>
            <Route exact path="/">
              <div className="titleList">
                <div className="title">{this.drawMoviesByGenre()}</div>
              </div>
            </Route>
            <Route exact path="/my-list">
              <div className="titleList">
                <div className="title">{this.drawMovies(`My List`)}</div>
              </div>
            </Route>
          </Switch>
        </Route>
      </div>
    );
  };
}