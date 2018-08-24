import jwtDecode from "jwt-decode";
import http from "./httpService";

const tokenKey = "token";

async function register(user) {
  const response = await http.post("/users", user);
  const jwt = response.headers["x-auth-token"];
  localStorage.setItem(tokenKey, jwt);

  return response;
}

async function login(credentials) {
  const { data: jwt } = await http.post("auth", credentials);
  if (jwt) localStorage.setItem(tokenKey, jwt);
  return jwt;
}

function logout() {
  localStorage.removeItem(tokenKey);
}

function getCurrentUser() {
  const jwt = localStorage.getItem(tokenKey);
  if (jwt) {
    const user = jwtDecode(jwt);
    return user;
  }

  return null;
}

function getToken() {
  return localStorage.getItem(tokenKey);
}

http.setJwt(getToken());

export default {
  register,
  login,
  getCurrentUser,
  logout,
  getToken
};
