var FCM = require('fcm-node')
    
    var serverKey = 'AAAA07-2ryY:APA91bFQY43k3mre3TDFATvbGePkaamWA0V8gVkPUYuRCGXqexbbyORj0EEbl5z9MFs9ViEiP6mkIL1-MSghQRdUPABAoU1hY4pCVJDJ_xFclZ5HO5hY6c1vFoKvcoIhQlES7Kv1AITI'
    
    var fcm = new FCM(serverKey)
 
   
    function sendFcmPush(ids,messageText){
        return new Promise((resolve,reject)=>{
            var message = {
                registration_ids: ids,
        
                notification: {
                    title: 'hello',
                    body:  messageText
                },
        
            }
            
            fcm.send(message, function(err, response){
                if (err) {
                    console.log("Something has gone wrong!")
                    reject(err);
                } else {
                    console.log("Successfully sent with response: ", response)
                    resolve(response)
                }
            })
        })
    }
    
    module.exports = {
        sendFcmPush
    }