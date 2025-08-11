const mongoose = require('mongoose');

require('dotenv').config();
const dbstring = process.env.DB_string;
mongoose.connect(dbstring);
const connection = mongoose.connection;
connection.on('connected', ()=>{
    console.log('Connection to database successful')
})
connection.on('error', ()=>{
    console.log('Connection to database unsuccessful')
})    