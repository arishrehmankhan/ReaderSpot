import axios from "axios";

export default axios.create({
    // backend base URL
    baseURL: process.env.REACT_APP_SERVER_URL + "/api"
});