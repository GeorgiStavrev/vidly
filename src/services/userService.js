import jwtDecode from "jwt-decode";
import http from "./httpService";
import { apiUrl } from "../config.json";

const tokenKey = "token";

async function register(user) {
  const response = await http.post(`${apiUrl}/users`, user);
  const jwt = response.headers["x-auth-token"];
  localStorage.setItem(tokenKey, jwt);

  return response;
}

async function login(credentials) {
  const { data: jwt } = await http.post(`${apiUrl}/auth`, credentials);
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
