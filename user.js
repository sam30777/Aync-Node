
const mongoose = require('mongoose');


   
let user  = new mongoose.Schema({
    userName : { type : String} ,
    email : { type : String} ,
    phoneNumber : { type : Number},
    address : { type : String },
    deviceToken : { type : String},
    accessToken : {type:String},
    password:{type : String}
})


let USER = mongoose.model('Users',user);

module.exports ={
    USER
}