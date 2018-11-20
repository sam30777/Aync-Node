
const mongoose = require('mongoose');

let schema = mongoose.Schema;
   
let penalty  = new mongoose.Schema({
    user_id          : { type : schema.Types.ObjectId , ref : "Users"} ,
    penaltyForBook   : { type :  schema.Types.ObjectId , ref : "Books" } ,
    penaltyAmount    : { type : Boolean } ,
    
})


let PENALTY = mongoose.model('Penalties',penalty);

module.exports ={
    PENALTY
}