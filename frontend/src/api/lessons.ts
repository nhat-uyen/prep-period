import axios from "axios";

/*
Connect to the backend API using Axios with a base URL of "http://localhost:5173". 
This allows for making HTTP requests to the backend server for lesson-related operations. 
The code also demonstrates how to send a POST request to create a new lesson with specific details such as subject, topic, grade, and duration. 
The response from the server is logged to the console for verification.
*/


// Configure Axios instance with the base URL for the backend API
const api = axios.create({ baseURL: "http://localhost:8000"});

export default api