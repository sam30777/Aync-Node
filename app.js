const express =  require('express');

const Promise = require('bluebird');

const app = new express();

let db = require('./db');
let {USER} = require('./user');

let responses = require('./responses');

const controller = require('./controller');






app.post('/registerUser',(req,res)=>{
    console.log('in register user--->',req.body);
    controller.resgisterUser(req.body,(err,response)=>{
        if(err){
           responses.sendError(res,err);
        }else{
            responses.sendSuccess(res,response)
        }
    })

})

//the setiimediate will work after all events 
app.get('/eventCheck',(req,res)=>{
    setImmediate(()=>{
        console.log('last function of the event loop-->');
        res.send({});
    })
    controller.setImmediateExample();
    
})


app.post('/loginUser',async (req,res)=>{
    try {
        let loginedUser = await controller.loginUser(req.body);
        responses.sendSuccess(res,loginedUser)
    } catch (err){
        
        responses.sendError(res,err);
    }
  
})

function generateAccessToken() {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (let i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }


app.post('/addBook',async (req,res)=>{
    try{
       let book =  await controller.addBook(req.body);
       responses.sendSuccess(res,book)
    } catch (err){
        responses.sendError(res,err);
    }
})

app.post('/pickBookForReading',(req,res)=>{
    controller.pickBookForReading((err,result)=>{
        if (err) {
            responses.sendError(res,err);
        } else {
            responses.sendSuccess(res,result);
        }
    })
})

app.post('/bulKInsert',()=>{
    

    let insertArray= [];
    for( let i = 0 ; i < 2000 ; i++ ) {
           obj ={
            userName : "santosh" ,
            deviceToken : generateAccessToken()
           } 
        insertArray.push(obj);
        
    }
    USER.insertMany(insertArray,(err,result)=>{
        if (err) {
            responses.sendError(res,'SOMETHING WENT WRONG');
        } else {
            responses.sendSuccess(res,result);
        }
    })

})


app.post('/checkDelayedBooks',async (req,res)=>{
   
          checkDelayedBooks((error,result)=>{
                if(error){
                    responses.sendError(res,'SOMETHING WENT WRONG');
                } else {
                    responses.sendSuccess(res,result);
                }
          });
     
    
})

app.listen(3001,()=>{
    console.log('server is running at 3000');
})