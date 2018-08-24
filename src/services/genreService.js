import http from "./httpService";
import config from "../config.json";

const apiEndpoint = config.apiUrl + "/genres";

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
