// const {USER} = require('./user');

// const {BOOK} = require('./book');

const fs = require('fs');



// setTimeout(()=>{
// console.log('set timeout-->')
// },4000)

// setImmediate(()=>{
//     console.log('set immdeiate os this-->');
// })

    // let a = { name : "santosh" , age : "34" , papa : { name : "sas"}};
    // console.log(a);

    // delete a.name ;
    // delete a.papa ;
    // console.log(a);


    fs.readFile('./tempfile.csv', function read(err, data) {
        if (err) {
            throw err;
        }
        console.log('data',data);
        // Invoke the next step here however you like
        // Put all of the code here (not the best solution)
             // Or put the next step in a function and invoke it
    });

setImmediate(()=>{
    console.log('this is set immediate==>');
})

process.nextTick(()=>{
    console.log('next tick is this-->');
})


setTimeout(()=>{
    console.log('async function-->');
},0)
