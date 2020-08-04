const Complex = require("./Complex.js"),
	  fs = require("fs");



writeStream = fs.createWriteStream("./fft.txt");

function recursiveRadix2FFT(data){
	let N = data.length;
	if(N <= 1) {return data;}

	let hN = N/2, even = new Array(hN), odd = new Array(hN);
	for(let k = 0; k < hN; k++){
		even[k] = data[2*k];
		odd[k] = data[2*k+1];
	}

	even = recursiveRadix2FFT(even);
	odd = recursiveRadix2FFT(odd);

	for(let k = 0; k < hN; k++){
		if(!(even[k] instanceof Complex)) {even[k] = new Complex({real: even[k], imaginary: 0});}
		if(!(odd[k] instanceof Complex))  {odd[k] = new Complex({real: odd[k], imaginary: 0});}

		let fourier_coef = new Complex({magnitude: 1, phase: -2*Math.PI*k/N});
		oddTimesExp = Complex.multiply(odd[k], fourier_coef);
		data[k] = Complex.add(even[k], oddTimesExp);
		data[k + hN] = Complex.minus(even[k], oddTimesExp);
	}
	return data;
}


function iterativeRadix2FFT(data){
	if( ((data.length & (data.length-1) == 0) && (data.length != 0)) ) {console.error("Data length is not power of 2"); return;}
	let num = data.length, power = 0;
	while(num != 1){num = num/2; power++;}
	delete num;

	for(let i = 0; i < data.length; i++) {if(!(data[i] instanceof Complex)) data[i] = new Complex({real: data[i], imaginary: 0});}

	for(let subPower = 0; subPower < power; i++){
		let subArray = Math.pow(2, subPower),
			half_subArray = subArray/2;

		for(let i = 0; i <= data.length - half_subArray; i+= subArray){
			for(let j = 0; j < half_subArray; j++){
				let e = new Complex({magnitude: 1, phase: -2*Math.PI*j/subArray}),
					even = a[i+j],
					odd = Complex.multiply(a[i+j+half_subArray], e);

					data[i+j] = Complex.add(even, odd);
					data[i+j+half_subArray] = Complex.minus(even,odd);

			}
		}
	}
}

exports.iterativeRadix2FFT = iterativeRadix2FFT;
exports.recursiveRadix2FFT = recursiveRadix2FFT;



// iterativeRadix2FFT([1,2,3,4,5,6,7,8]);

//a = recursiveRadix2FFT(generateSignal());

// let a = new Complex({real: 1, imaginary: 0});
// console.log(typeof a);
/*
function generateSignal(){
	let timeSignal = new Array(16384);
	for(let i = 0; i < 16384; i++){
		timeSignal[i] = 2 * Math.sin(2*Math.PI/1638.4*i);
	}
	return timeSignal;
}

function frequencyPlot(){
	let result = radix2FFT(generateSignal()), absoluteResult = new Array(16384);

	for(let i = 0; i < result.length; i++){
		writeStream.write(result[i].real + " +j" + result[i].imaginary+"\n");
	}
}

frequencyPlot();*/