import axios from "axios";

const DEFAULT_ERROR_TEXT =
  "An error occurred while processing your request. Please try again later.";

axios.defaults.headers.put["Content-Type"] = "application/json";
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.delete["Content-Type"] = "application/json";
axios.defaults.withCredentials = true;
