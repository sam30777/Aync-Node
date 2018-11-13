var mongoose = require('mongoose');


mongoose.connect('mongodb://localhost/trackig_db');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('mongo db connected');
});






module.exports ={
  db
}