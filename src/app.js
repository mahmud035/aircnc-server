const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { client, User, Room, Booking } = require('./server');

const app = express();

//* Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

//* Application Routes

module.exports = app;
