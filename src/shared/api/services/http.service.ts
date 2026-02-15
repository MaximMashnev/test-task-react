import axios from "axios";
import config from "../../configs/config.json"

export const httpService = axios.create({
    baseURL: config.api.baseUrl
})