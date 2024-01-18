import axios from "axios";
// const baseurl = "http://localhost:4000/api/v1/";
const baseurl = process.env.REACT_APP_API_URL;
export default axios.create({
  baseURL: baseurl,
  headers: { "Content-type": "application/json" },
});
