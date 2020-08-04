const Serialport = require("serialport");
const fs = require("fs");
const EventEmitter = require('events');
const fft = require("./FFT.js");

var dataArray = new Array();

function sine(){
    var array = new Array();
    for(var i = 0; i < 500; i++){
        var value = 2*Math.sin(2*Math.PI/100*i);
        
        array.push(value);
        if(i == 99 || i ==199 || i == 299 || i == 399 || i == 499){
         array.push(-10);   
        }
    }
    
    return array;
        
}

function connectPort(){
    var comPortPromise = Serialport.list();
    var comPort, timeStart, writeStream = fs.createWriteStream("./signal.txt",{falgs: 'w'});
    var remainedChunk = "";
    var regex = new RegExp('[-+]?[0-9]\.[0-9]{2}');
    comPortPromise.then((data)=>{
        comPort = new Serialport(data[0].comName, {baudRate: 9600}, function(err){
            if(err) return console.log(err.message);
        });
        comPort.on("open", function(){
            console.log(data[0].comName + " is open");
            setTimeout(function(){
                comPort.close();
                writeStream.write(dataArray.toString());
                console.log("Finished");
                setTimeout(processData, 500);
            },5000);
        });
        comPort.on("data", function(chunk){
            var data = chunk.toString().split("\r\n");
            if(data[0].toString().charCodeAt(0) == 65533) {data.shift();};
            for(var i = 0; i < data.length; i++){
                if(!data[i].toString().match(regex)){
                    if(!remainedChunk) {remainedChunk = data[i].toString(); continue;}
                    else{
                        data[i] = remainedChunk + data[i].toString() ;
                        remainedChunk = "";
                    }
                }
                var floatData;
                if((floatData = parseFloat(data[i])) != NaN) {
                    dataArray.push(floatData);
                }
                writeStream.write(data[i]+"\n"); 
            }

            writeStream.write(data);
        });
        
    });
    
}
function processData(){
    writeStream2 = fs.createWriteStream("./outputFromProcessData.txt");
    var FFTdata = new Array(), count = 0;
    var i = 0;
    while(count <= 4 && dataArray.length != 0){
        var data = parseFloat(dataArray.shift());
        
        if(data < 0 && data > 5){count ++; if(count > 0)  continue;}
        if(!isNaN(data)){FFTdata.push(data);};
        
    }
    for(var i = 0; i < 2048; i++){
        if(i >= FFTdata.length) FFTdata[i] = 0;
        writeStream2.write(FFTdata[i].toString()+"\n");
    }
    
    
    var fftData = fft.recursiveRadix2FFT(FFTdata);
    for(var i = 0; i < fftData.length; i++){
        console.log(fftData[i].toString());
    }
}

connectPort();


// processData();

