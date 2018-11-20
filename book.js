
const mongoose = require('mongoose');

let schema = mongoose.Schema;
   
let book  = new mongoose.Schema({
    bookName : { type :   String} ,
    author   : { type :   String} ,
    isBookedForReading : { type : Boolean } ,
    amount : { type : Number} ,
    assignedToUser : { type : schema.Types.ObjectId , ref : "Users"}  ,
    bookReturnedDate : {type : Date }
})


let BOOK = mongoose.model('Books',book);

module.exports ={
    BOOK
}