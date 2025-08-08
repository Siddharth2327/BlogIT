const mongoose = require('mongoose');
const dbstring = 'mongodb+srv://Siddharth2302:YTZNopAQyp2lwZue@cluster0.zexdo6l.mongodb.net/BlogIT?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(dbstring);
const connection = mongoose.connection;
connection.on('connected', ()=>{
    console.log('Connection to database successful')
})
connection.on('error', ()=>{
    console.log('Connection to database unsuccessful')
})    