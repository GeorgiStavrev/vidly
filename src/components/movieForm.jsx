import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import { Redirect } from "react-router-dom";
import { getMovie, saveMovie } from "../services/movieService";
import { getGenres } from "../services/genreService";

class MovieForm extends Form {
  state = {
    data: {
      title: "",
      genre: { _id: "", name: "" },
      numberInStock: 0,
      dailyRentalRate: 0
    },
    errors: {},
    genres: []
  };

  schema = {
    _id: Joi.any(),
    title: Joi.string()
      .required()
      .label("Title"),
    genre: Joi.string()
      .required()
      .label("Genre"),
    numberInStock: Joi.number()
      .integer()
      .min(0)
      .max(100)
      .required()
      .label("Number in Stock"),
    dailyRentalRate: Joi.number()
      .min(0)
      .max(10)
      .required()
      .label("Daily Rental Rate")
  };

  handleSave = () => {
    this.props.history.replace("/movies");
  };

  doSubmit = async () => {
    const { params } = this.props.match;
    const { data: movie } = this.state;
    const genre = this.state.genres.find(i => i._id === movie.genre);

    let movieToSave = null;
    movieToSave = {};
    if (params.id !== "new") {
      movieToSave._id = params.id;
    }

    movieToSave.title = movie.title;
    movieToSave.genre = genre;
    movieToSave.numberInStock = movie.numberInStock;
    movieToSave.dailyRentalRate = movie.dailyRentalRate;

    try {
      await saveMovie(movieToSave);
      this.props.history.replace("/movies");
    } catch (ex) {
      console.log(ex);
    }
  };

  async populateGenres(params) {
    const genres = await getGenres();
    this.setState({ genres });
  }

  async populateMovie(params) {
    if (params.id !== "new") {
      try {
        let movie = await getMovie(params.id);
        if (movie) {
          let movieData = {
            title: movie.title,
            genre: movie.genre._id,
            numberInStock: movie.numberInStock,
            dailyRentalRate: movie.dailyRentalRate
          };
          this.setState({ data: movieData });
        } else {
          this.setState({ data: null });
        }
      } catch (ex) {
        this.setState({ data: undefined });
      }
    }
  }

  async componentDidMount() {
    const { params } = this.props.match;
    await this.populateGenres(params);
    await this.populateMovie(params);
  }

  render() {
    const { data: movie } = this.state;
    if (movie === undefined) {
      return <Redirect to="/not-found" />;
    }

    return (
      <div className="m-5">
        <h1>Movie Form {movie._id}</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("title", "title", "Title", "text", true)}
          {this.renderSelectMenu(
            "genre",
            this.state.genres,
            "Genre",
            movie.genre,
            "_id",
            "name"
          )}
          {this.renderInput(
            "numberInStock",
            "numberInStock",
            "Number in Stock",
            "number"
          )}
          {this.renderInput(
            "dailyRentalRate",
            "dailyRentalRate",
            "Rate",
            "text"
          )}
          {this.renderButton("Save")}
        </form>
      </div>
    );
  }
}

export default MovieForm;
