let Complex = function(options){
	if(options.real != undefined && options.imaginary != undefined){
		this.real = options.real;
		this.imaginary = options.imaginary;
		this.magnitude = Math.sqrt(this.real * this.real + this.imaginary * this.imaginary);
		this.phase = Math.atan(this.imaginary / this.real);
	}else if(options.magnitude != undefined && options.phase != undefined){
		this.magnitude = options.magnitude;
		this.phase = options.phase;
		this.real = this.magnitude * Math.cos(options.phase);
		this.imaginary = this.magnitude * Math.sin(options.phase);
	}else{
		console.error("Error");
	}
}

Complex.prototype.toString = function(){
	return this.real + " + j" + this.imaginary;
}

Complex.add = function(a, b){
	return new Complex({real: a.real + b.real, imaginary: a.imaginary + b.imaginary});
}

Complex.minus = function(a, b){
	return new Complex({real: a.real - b.real, imaginary: a.imaginary - b.imaginary});
}

Complex.division = function(a, b){
	let nominator = Complex.multiply(a, Complex.conjugate(b)),
		denominator = b.real * b.real + b.imaginary * b.imaginary;

	return new Complex({real: nominator.real/denominator, imaginary: nominator.imaginary/denominator});
} 

Complex.multiply = function(a, b){
	let real = a.real * b.real - a.imaginary * b.imaginary,
		imaginary = a.real * b.imaginary + a.imaginary * b.real;
	return new Complex({real: real, imaginary: imaginary});
}

Complex.conjugate = function(a){
	let imaginary = -a.imaginary,
		phase = a.phase - Math.PI,
		options = {real: a.real, imaginary: imaginary, magnitude: a.magnitude, phase: phase};
	return new Complex(options);
}


module.exports = Complex;