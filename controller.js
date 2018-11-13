
let {USER} = require('./user');

let {BOOK} = require('./book');

let Promise = require('bluebird');

const EVENTEMITTER = require('events');

const e = new EVENTEMITTER();

function generateAccessToken() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }

// async.waterfall
function resgisterUser(userDetails,callback){
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
            if(user.paswword == userDetails.paswword){
                return user ;
            }else{
                throw 'Password is inccorrect' ;
            }
        }else{
            throw 'User not found';
        }
    } catch (err){
        console.log('error while login',err);
        throw err;
    }
    
}


 //  callback to promise
function checkIfUserExists(email){
    return new Promise((resolve,reject)=>{
            USER.findOne({email:email},(err,result)=>{
                if(err){
                    console.log('erro while getting user',err);
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
                book = new Book();
                book.bookName = payload.bookName ;
                book.author = payload.author ;
                book.addedBy = user._id
                let bookInfo = yield Promise.promisify(user.save());
                return bookInfo
            } else {
               throw 'User not auterised'
            }
        }).then((result)=>{
            console.log('result of coroutine-->',result);
            resolve(result);
        }).catch((error)=>{
            console.log("error in corotoutine-->",error);
            reject(error)
        })
    })
    
}


// async.auto.....
function deleteBook(payload,callback){
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
        deleteBook :[ 'authenticateAccessToken',
            function(result,cb){
                USER.remove({_id:payload.bookId},(err,response)=>{
                    if(err){
                         cb('Something went wrong');
                    }else{
                        cb(null,response);
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


function setImmediateExample(){
e.on('event-1',()=>{
    console.log('event-1 is this');
})

e.on('event-2',()=>{
    console.log('event-2 is this');
})

e.on('event-3',()=>{
    console.log('event-3 is this');
})

e.emit('event-1');
e.emit('event-2');
e.emit('event-3');

}


module.exports = {
    resgisterUser,
    loginUser ,
    addBook ,
    deleteBook ,
    setImmediateExample
    
}