const express = require('express');
const app = express();
const dbconfig = require('./config/dbconfig');
const userRoute = require('./routes/userRoute');
const blogRoute = require('./routes/blogRoute');

const cors = require('cors')
app.use(cors({origin:"*"})) // allowing all origins 

app.use(express.json());

app.use('/api/users', userRoute);
app.use('/api/blogs', blogRoute);


app.listen('8080', ()=>{
    console.log("Server started on port 8080")
})