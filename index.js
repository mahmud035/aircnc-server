const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { MongoClient, ObjectId } = require('mongodb');
require('colors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

//* Middleware
const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
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

//* ============ API REQUEST ============
//* GET
// Get all room
app.get('/rooms', async (req, res) => {
  try {
    const rooms = await Room.find({}).toArray();

    if (rooms.length > 0) {
      res.send({
        success: true,
        message: `Room's data found`,
        data: rooms,
      });
    }
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold, error.stack);
  }
});

// Get single room
app.get('/rooms/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = { _id: new ObjectId(id) };
    const result = await Room.findOne(query);

    if (result) {
      res.send({
        success: true,
        message: 'Room data found',
        data: result,
      });
    }
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold, error.stack);
  }
});

//* POST
// Add a room in DB
app.post('/rooms', async (req, res) => {
  try {
    const room = req.body;
    const result = await Room.insertOne(room);

    if (result.insertedId) {
      res.send({
        success: true,
        message: 'Room added successfully',
      });
    }
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold, error.stack);
  }
});

//* PUT / PATCH
// Save user email and role in DB
app.put('/users/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const user = req.body;
    const filter = { email: email };
    const options = { upsert: true };
    const updateDoc = {
      $set: user,
    };
    const result = await User.updateOne(filter, updateDoc, options);

    if (result.modifiedCount) {
      res.send({
        success: true,
        message: `Save user's email successfully`,
      });
    }
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold, error.stack);
  }
});

//* DELETE
