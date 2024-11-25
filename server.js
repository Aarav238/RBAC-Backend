const express = require('express');
const connectDB = require('./config/db.js');
const dotenv = require('dotenv');
const auth = require('./routes/auth.js')
const protected = require('./routes/protected.js')

dotenv.config();

//connect To mongoDB
connectDB();

const app = express();

//middleware to parse JSON
app.use(express.json());



app.use('/api/auth', auth);
app.use('/api/protected', protected);


app.get('/', (req,res) => {
     res.send("System is running")
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`)
})