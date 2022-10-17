import React from "react";

export default function Movies(props) {
  return (
    <>
      {props.movies.map((movie, index) => (
        <div className="movie" key={index}>
          <img src={movie.poster_path} alt="" />
          <div className="overlay">
            <div className="title">{movie.title}</div>
            <div className="rating">{movie.vote_average}/10</div>
            <div className="plot">{movie.overview}</div>
            <div
              data-toggled={movie.my_list}
              className="listToggle"
              onClick={() => props.onClickPlus(movie)}
            >
              <div>
                <i className="fa fa-fw fa-plus"></i>
                <i className="fa fa-fw fa-check"></i>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
/*
 * This component uses an array of movies to display them on the screen.
 */
