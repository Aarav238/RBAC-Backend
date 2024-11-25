const express = require('express');
const connectDB = require('./config/db.js');
const dotenv = require('dotenv');

dotenv.config();

//connect To mongoDB
connectDB();

const app = express();

//middleware to parse JSON
app.use(express.json());




const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`)
})