const app = require('./app');
const { MongoClient } = require('mongodb');
require('dotenv').config();
require('colors');

const PORT = process.env.PORT || 5000;

//* Database Connection
const url = process.env.URL;
const client = new MongoClient(url);

const dbConnect = async () => {
  try {
    await client.connect();

    console.log(`Database Connected`.yellow.italic);

    app.listen(PORT, () => {
      console.log(`Server Up and Running`.cyan.bold);
    });
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold, error.stack);
  }
};
dbConnect();

//* Create Database Collections
const User = client.db('aircncDB').collection('users');
const Room = client.db('aircncDB').collection('rooms');
const Booking = client.db('aircncDB').collection('bookings');

app.get('/', (req, res) => {
  res.send('AirCNC Server is running..');
});

module.exports = { client, User, Room, Booking };
