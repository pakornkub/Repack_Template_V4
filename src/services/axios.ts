import axios from "axios";

// Add a request interceptor
axios.interceptors.request.use(async (config) => {

    // Do something before request is sent

    const token = JSON.parse(localStorage.getItem("accessToken") || "{}");
    
    config.url = `${import.meta.env.VITE_APP_API_URL}${config.url}`;
    //config.headers = { 'Content-Type': 'multipart/form-data' }
    
    if (token) {
        config.headers = { /* ...config.headers, */ 'Authorization': token }
    }

    return config;

}, (error) => {

    // Do something with request error

    return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use((response) => {

    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data

    return response;

}, function (error) {

    if (error.response && error.response.status === 401) {

        return
    }

    return Promise.reject(error);
});

export const httpClient = axios

