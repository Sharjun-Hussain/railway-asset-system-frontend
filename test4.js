import axios from 'axios';
const baseURL = "http://localhost:5000/api/v1";
axios.delete(baseURL + '/users/1234')
  .catch(err => {
    console.log("DELETE Status:", err.response?.status);
    console.log("DELETE Data:", typeof err.response?.data === 'string' ? err.response?.data.substring(0,50) : err.response?.data);
  });
