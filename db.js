const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost/book_user');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('mongo db connected');
});






module.exports ={
  db
}