const express =  require('express');

const Promise = require('bluebird');

const app = new express();

let db = require('./db');
let {USER} = require('./user');

let responses = require('./responses');

const controller = require('./controller');






app.post('/registerUser',(req,res)=>{
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
        console.log('error is this-->',err);
        responses.sendError(res,err);
    }
  
})

app.post('/addBook',async (req,res)=>{
    try{
       let book =  await controller.addBook(req.body);
       responses.sendSuccess(res,book)
    } catch (err){
        console.log('error while adding booking')
        responses.sendError(res,err);
    }
})

app.post('/deleteBook',(req,res)=>{
    controller.deleteBook((err,result)=>{
        if (err) {
            responses.sendError(res,err);
        } else {
            responses.sendSuccess(res,result);
        }
    })
})

app.listen(3000,()=>{
    console.log('server is running at 3000');
})