import axios from 'axios';
axios.get('http://localhost:5000/api/v1/users')
  .then(res => console.log(JSON.stringify(res.data[0], null, 2)))
  .catch(err => console.log(err.message));
