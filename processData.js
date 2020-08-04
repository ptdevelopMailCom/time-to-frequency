const getData = require("./getData.js");
const fs = require("fs");


setTimeout(processData, 5000);

function processData(){
    var readStream = fs.createReadStream("./signal.txt");
    var port = new getData();
    port.on("dataReceived", function(){
        //console.log(readStream.read());
    });
    

}


