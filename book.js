
const mongoose = require('mongoose');

let schema = mongoose.Schema;
   
let book  = new mongoose.Schema({
    bookName : { type :   String} ,
    author   : { type :   String} ,
    addedBy  : { type :schema.Types.ObjectId , ref : "User"   }
})


let BOOK = mongoose.model('Books',book);

module.exports ={
    BOOK
}