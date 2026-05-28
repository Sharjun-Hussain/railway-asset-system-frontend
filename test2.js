import axios from 'axios';
const baseURL = "http://localhost:5000/api/v1"; // Or whatever the API URL is
axios.delete(baseURL + '/users/1234')
  .then(res => console.log(res.data))
  .catch(err => {
    console.log("Status:", err.response?.status);
    console.log("Data:", err.response?.data);
  });
