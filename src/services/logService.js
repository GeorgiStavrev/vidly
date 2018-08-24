import Raven from "raven-js";
import "bootstrap/dist/css/bootstrap.css";

function init() {
  Raven.config("https://0cd69a6661974a0ab6ee7981a9bd5b95@sentry.io/1268100", {
    relese: "1-0-0",
    environment: "development-test"
  }).install();
}

function log(error) {
  Raven.captureException(error);
}

export default {
  init: init,
  log: log
};
