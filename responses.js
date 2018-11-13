function sendSuccess(res,data){
    var response = {
        message:  "Success" ,
        status : 200 ,
        data   : data
      };
      return res.send(JSON.stringify(response)); 
}

function sendError(res,error) {
    var response = {
        message:  error ,
        status : 400 ,
        data   : {}
      };
      return res.send(JSON.stringify(response)); 
}

module.exports = {
    sendSuccess ,
    sendError
}