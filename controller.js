
const {USER} = require('./user');

const {BOOK} = require('./book');

let moment = require('moment');

let Promise = require('bluebird');
const async = require('async');
const EVENTEMITTER = require('events');

const {MAPPING} = require('./bookAndStudentMapping');

const {PENALTY} = require('./penalties');
const e = new EVENTEMITTER();

function generateAccessToken() {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (let i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }

// async.waterfall
function resgisterUser(userDetails,callback){
    console.log('user details are these->',userDetails);
    let  userName  = userDetails.userName;
    let email     = userDetails.email;
    let phoneNumber = userDetails.phoneNumber ;
    let address = userDetails.address ;
    let password = userDetails.password;
    let accessToken = generateAccessToken();

    async.waterfall([
        ()=>{
           USER.find({email:email},(err,response)=>{
                    if(err){
                        cb('Someting went wrong',null);
                    }
                    else if(response.length > 0){
                        cb('User already exists',null);
                    }else {
                        cb();
                    }
           })
        },
        ()=>{
            let user = new USER();
            user.userName = userName;
            user.email = email ;
            user.phoneNumber = phoneNumber ;
            user.address     = address ;
            user.accessToken = accessToken ;
            user.password    = password;
            user.save((err,response)=>{
                if(err){
                    cb('Something went wrong',null);
                }else{
                    cb(null,response);
                }
            })
        }
    ],(err,result)=>{
        if(err){
            callback(err,null)
        }else{
            callback(null,result);
        }
    })
}


//asyn await
async function loginUser(userDetails){
    try {
        let user = await checkIfUserExists(userDetails.email);
        
        if(user){
            if(user.password == userDetails.password){
                return user ;
            }else{
                throw 'Password is inccorrect' ;
            }
        }else{
            throw 'User not found';
        }
    } catch (err){
        throw err;
    }
    
}


 //  callback to promise
function checkIfUserExists(email){
    return new Promise((resolve,reject)=>{
            USER.findOne({email:email},(err,result)=>{
                if(err){
                    reject('Someting went wrong');
                } else {
                    resolve(user);
                }
            })
    })
}
//callback to promise
function authenticateAccessTokenPromisified(accessToken){
    return new Promise((resolve,reject)=>{
            USER.findOne({accessToken:accessToken},(error,response)=>{
                if(error){
                    reject('Something went wrong')
                } else {
                    resolve(response)
                }
            })
    })
}

function authenticateAccessToken(accessToken,callback){
    USER.findOne({accessToken:accessToken},callback)
}

//Promise coroutine and promise.promisify
function addBook(payload){
    return new Promise((resolve,reject)=>{
        Promise.coroutine(function*(){
            let user = yield authenticateAccessTokenPromisified(payload.accessToken);
            if(user){
                book = new BOOK();
                book.bookName = payload.bookName ;
                book.author = payload.author ;
                book.addedBy = user._id
                let bookInfo = yield Promise.promisify(user.save());
                return bookInfo
            } else {
               throw 'User not auterised'
            }
        }).then((result)=>{
           
            resolve(result);
        }).catch((error)=>{
           
            reject(error)
        })
    })
    
}


// async.auto.....
function pickBookForReading(payload,callback){
    async.auto({
        authenticateAccessToken : function(cb){
            authenticateAccessToken(payload.accessToken,(err,result)=>{
                if(err){
                     cb('Something went wrong');
                } else {
                     cb(null,result);
                }
            })
        },
        checkIfBookIsAlreadyPicked :[ 'authenticateAccessToken' ,
            function( result,cb){
                BOOK.findOne({_id : payload.bookId },(err,resultedBook)=>{
                    if(err){
                        cb('Something went wrong')
                    } else {
                       if(!resultedBook) {
                            cb('book not found')
                       } else if (resultedBook.isBookedForReading){
                           cb('Book is not available');
                       }else{
                           cb(null,resultedBook);
                       }
                    }
                })
            }
        ],
        checkUserLimit : ['authenticateAccessToken',
            function(result , cb) {
                BOOK.find({ assignedToUser : mongoose.Types.ObjectId(payload.userId)},(error,bookData)=>{
                    if(error) {
                        cb('Something went wrong')
                    } else if(bookData && bookData.length > 4) {
                            cb('You cannot have more than 4 books return some books to pick new');
                        }  else {
                            cb(null,mapingData);
                        }
                     
                })
            }
    
        ],
        assignBookToUser :[ 'checkIfBookIsAlreadyPicked', 'checkUserLimit' ,
            function(resultsArray,cb){
              BOOK.update({_id : bookId},(error,book)=>{
                    if(error){
                        cb('SOMETHING WENT  WRONG');
                    }else {
                        cb(null,book);
                    }
              })
            }

        ]
    },function(err,resultFinal){
        if(err) callback(err,null);
        else
        callback(null,resultFinal);
    })
}

function getUserInforMation(userId,cb){
    USER.findOne({_id : userId},(error,result)=>{
        if(error){
            cb('S')
        }
    })
}
/*


setimmediate can be used inside heavy i/o insentives task to shedule some callbacks
off the i/o loop so that  the i/o will not be blocked and work in optimized way

checkDelayedBooks function is used for checking the delayed books .
Inside the stream reading , major priority task is to send push notifications to users
if they have not returned the book before expiry date.along with that there can be many tasks that we
have to perform for user like i am saving a penalty for user which  he/she have to pay when returning the book.
So, if we we are performing all tasks inside the i/o phase itself for let's assume millio records then there are chances that
some evens of i/o loop start delaying , so we can priotize the task that we want to ecexute in that loop
and shedule the other tasks using setImmediate . Now all the tasks other then priotized task will be queued
in setImmdeaite queue and will execute immediately after the all i/o callbacks are executed .

*/

 function checkDelayedBooks(callback){


        let stream = USER.find({}).limit().cursor() ; 
        let promiseArray = [] ;
        let stream = USER.find({}).cursor() ;
       let perThousandUser = [] ;
       let i = 0;



    stream.on('data',(doc)=>{
     console.log('doc is this-->',doc);
       let book  = doc ;
       let today = moment();

       if(book.isBookedForReading && moment(doc.bookReturnedDate).isAfter(today)) {
           
            getUserInforMation(book.assignedToUser,(eror,user)=>{
                if(error){
                    callback(error);
                }
                if( i < 1000){
                    perThousandUser.push(user.deviceToken);
                    i++ ;
                } else {
                    promiseArray.push(fcmPush.sendFcmPush(perThousandUser,"PLease return the book"));
                    perThousandUser = [];
                    i = 0;
                }   
            })
             let userID = book.assignedToUser;
             let book_id = book._id ;
             let bookAmount = book.book_amount ;
            setImmediate((userID,book_id,bookAmount)=>{
               let penalty = new PENALTY();
               penalty.user_id = user_id;
               penalty.penaltyForBook = book_id;
               penalty.penaltyAmount = book_amount
               penalty.save((error, response) => {
                   if (error) { } else { console.log('penalty locked for user' + user_id) }
               })
           }); 
       }  
    })

    stream.on('end',()=>{
         if(perThousandUser.length > 0){
            promiseArray.push(fcmPush.sendFcmPush(perThousandUser,"Welcome to app"));
        }
        Promise.all(promiseArray).then(()=>{
            callback(null,{});
        }).catch((err)=>{
            throw err ;
        })

    })
}
 
async function performOperationOnUser(user_id,book_id,book_amount){
    
}



// function setImmediateExample(){
// e.on('event-1',()=>{
//     console.log('event-1 is this');
// })

// e.on('event-2',()=>{
//     console.log('event-2 is this');
// })

// e.on('event-3',()=>{
//     console.log('event-3 is this');
// })

// e.emit('event-1');
// e.emit('event-2');
// e.emit('event-3');

// }


module.exports = {
    resgisterUser,
    loginUser ,
    addBook ,
    pickBookForReading ,
    setImmediateExample ,
    pickBookForReading ,
    checkDelayedBooks
    
}