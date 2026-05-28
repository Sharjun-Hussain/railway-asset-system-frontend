import axios from 'axios';
const baseURL = "http://localhost:5000/api/v1";
axios.put(baseURL + '/users/1234', { isActive: false })
  .then(res => console.log("PUT works:", res.data))
  .catch(err => {
    console.log("PUT Status:", err.response?.status);
    console.log("PUT Data:", err.response?.data);
  });
