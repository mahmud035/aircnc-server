const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { MongoClient } = require('mongodb');
require('colors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

//* Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

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
