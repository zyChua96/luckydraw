const axios = require('axios');

const giftId = 1;

for (let userId = 1; userId <= 10; userId++) {
  axios.post('http://localhost:3000/draw', {
    userId,
    giftId
  }).then(response => {
    console.log(`User ${userId} →`, response.data);
  }).catch(err => {
    console.log(`User ${userId} → Error:`, err.message);
  });
}
