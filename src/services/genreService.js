import http from "./httpService";

const apiEndpoint = "/genres";

export async function getGenres() {
  try {
    const { data: genres } = await http.get(apiEndpoint);
    return genres;
  } catch (ex) {
    if (ex.response && ex.response.status === 404) {
      alert("Not found!");
    }
  }
}
