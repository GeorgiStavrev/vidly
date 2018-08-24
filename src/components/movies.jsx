import React, { Component } from "react";
import { toast } from "react-toastify";
import { getMovies, deleteMovie } from "../services/movieService";
import { getGenres } from "../services/genreService";
import { paginate } from "../utils/paginate";
import { Link } from "react-router-dom";
import SearchBox from "./common/searchBox";
import Pagination from "./common/pagination";
import ListGroup from "./common/listGroup";
import MoviesTable from "./moviesTable";
import _ from "lodash";

class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    currentPage: 1,
    pageSize: 4,
    selectedGenre: null,
    searchQuery: "",
    sortColumn: { path: "title", order: "asc" }
  };

  getPagedData = () => {
    const {
      sortColumn,
      movies: allMovies,
      selectedGenre,
      currentPage,
      pageSize,
      searchQuery
    } = this.state;

    const filtered = selectedGenre
      ? allMovies.filter(m => m.genre._id === selectedGenre)
      : searchQuery
        ? allMovies.filter(m => m.title.toLowerCase().includes(searchQuery))
        : allMovies;

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
    const paginated = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: paginated };
  };

  async componentDidMount() {
    const genres = [{ _id: null, name: "All Genres" }, ...(await getGenres())];
    this.setState({ movies: await getMovies(), genres });
  }

  render() {
    const {
      sortColumn,
      movies,
      selectedGenre,
      currentPage,
      pageSize,
      genres,
      searchQuery
    } = this.state;

    const { totalCount, data } = this.getPagedData();

    return (
      <div className="row">
        <div className="col-3">
          <ListGroup
            items={genres}
            selectedItem={selectedGenre}
            onItemSelect={this.handleGenreSelect}
          />
        </div>
        <div className="col">
          {this.props.user && this.props.user.isAdmin ? (
            <Link to="/movies/new" className="btn btn-primary">
              New Movie
            </Link>
          ) : (
            ""
          )}

          <p className="m-3">Showing {totalCount} movies in the database.</p>
          <SearchBox value={searchQuery} onChange={this.handleSearch} />
          <MoviesTable
            movies={data}
            sortColumn={sortColumn}
            onLike={this.handleLike}
            onDelete={this.handleDeleteMovie}
            onSort={this.handleSort}
          />
          <Pagination
            currentPage={currentPage}
            pageSize={pageSize}
            itemsCount={totalCount}
            onPageChange={this.handlePageChange}
          />
        </div>
      </div>
    );
  }

  handleDeleteMovie = async movie => {
    const originalMovies = this.state.movies;
    const movies = this.state.movies.filter(m => m._id !== movie._id);

    let newState = { movies: movies, currentPage: this.state.currentPage };
    const pages = Math.ceil(movies.length / this.state.pageSize);

    while (pages < newState.currentPage) {
      newState.currentPage = newState.currentPage - 1;
    }

    try {
      await deleteMovie(movie._id);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        toast.error("Movie already deleted");
      }
      this.setState({ movies: originalMovies });
    }
    this.setState(newState);
  };

  handleLike = movie => {
    const movies = [...this.state.movies];
    const index = movies.indexOf(movie);
    movies[index] = { ...movies[index] };
    movies[index].liked = !movies[index].liked;
    this.setState({ movies });
  };

  handlePageChange = newPage => {
    this.setState({ currentPage: newPage });
  };

  handleGenreSelect = genre => {
    let newPage = this.state.currentPage;
    if (this.state.selectedGenre !== genre._id) {
      newPage = 1;
    }
    this.setState({
      selectedGenre: genre._id,
      currentPage: newPage,
      searchQuery: ""
    });
  };

  handleSearch = query => {
    this.setState({ selectedGenre: null, searchQuery: query, currentPage: 1 });
  };

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };

  handleNewMovie = () => {
    this.props.history.push("/movies/new");
  };
}

export default Movies;
