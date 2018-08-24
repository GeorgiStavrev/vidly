import React from "react";
import ReactDOM from "react-dom";
import logger from "./services/logService";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import "./index.css";
import "bootstrap/dist/css/bootstrap.css";
import "font-awesome/css/font-awesome.css";

console.log(process.env.REACT_APP_NAME);
logger.init();

ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();
