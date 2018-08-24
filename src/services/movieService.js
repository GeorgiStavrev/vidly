import http from "./httpService";

const apiEndpoint = "/movies";

function getMovieUrl(movieId) {
  return `${apiEndpoint}/${movieId}`;
}

export async function getMovies() {
  try {
    const { data: movies } = await http.get(apiEndpoint);
    return movies;
  } catch (ex) {
    if (ex.response && ex.response.status === 404) {
      alert("Not found!");
    }
  }
}

export async function getMovie(id) {
  const { data } = await http.get(getMovieUrl(id));
  return data;
}

export async function saveMovie(movie) {
  try {
    const body = { ...movie };
    body.genreId = body.genre._id;
    delete body.genre;

    if (movie._id) {
      delete body._id;
      await http.put(getMovieUrl(movie._id), body);

      return;
    }

    await http.post(apiEndpoint, body);
  } catch (ex) {
    if (ex.response && ex.response.status === 404) {
      alert("Not found!");
    }
    console.log(ex);
  }
}

export async function deleteMovie(id) {
  await http.delete(getMovieUrl(id));
}
