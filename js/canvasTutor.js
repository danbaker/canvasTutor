ut = {};
ut.action = {};

// THE main canvasTutor object
ut.obj = {};

ut.action.play = function() {
	ut.obj.doPlay();
};
ut.action.example = function(txt) {
	console.log("Example: "+txt);
};



// canvasTutor constructor
ut.ct = function(idCanvasNormal, idCanvasZoomed, idCanvasZoomedBack, idCanvasZoomedPath) {
	// the user supplied JavaScript to run
	this.js = "";
	
	this.canNormal = idCanvasNormal;
	this.canZoomed = idCanvasZoomed;
	this.canZoomedBack = idCanvasZoomedBack;
	this.canZoomedPath = idCanvasZoomedPath;
};

ut.ct.prototype.doPlay = function() {
	if (this.playTimer) {
		clearInterval(this.playTimer);
		this.playTimer = false;
	}
	this.frameLine = 0;
	var self = this;
	this.playTimer = setInterval(function(){
		self.doPlayFrame();
	}, 200);
};
ut.ct.prototype.doPlayFrame = function() {
	this.frameLine++;
	var js = jseditor.value;
	ut.obj.setjs(js);
	ut.obj.compile();
	ut.obj.paintAll();
};


ut.ct.prototype.setjs = function(js) {
	this.js = js;
};

ut.ct.prototype.compile = function() {
	this.jsCompiled = ut.obj.tp.compile(this.js, this.frameLine);
};

ut.ct.prototype.paintAll = function() {
	this.paintNormal(this.canNormal);
	this.paintZoomedBack();
	this.paintZoomed(this.canNormal, this.canZoomed);
	this.paintZoomedPath();
};

// paint onto a known canvas
ut.ct.prototype.paintNormal = function(idCan) {
	if (ut.obj.ctx.setNumber(this.frameLine)) {
		var el = document.getElementById(idCan);
		var ctx = el.getContext("2d");
		var width = el.width;
		var height = el.height;
		ctx.clearRect(0,0,width,height);
		ctx.save();
		try {
			eval(this.jsCompiled);
		} catch (err) {
			console.log("JavaScript Error");
			throw(err);
		}
		ctx.restore();
	} else {
		clearInterval(this.playTimer);
		this.playTimer = false;
	}
};

// paint the background of the zoomed canvas
ut.ct.prototype.paintZoomedBack = function() {
	var elNorm = document.getElementById(this.canNormal);
	var wNorm = elNorm.width;
	var hNorm = elNorm.height;
	var el = document.getElementById(this.canZoomedBack);
	var ctx = el.getContext("2d");
	var width = el.width;
	var height = el.height;
	var mult = parseInt(width / wNorm, 10);					// # of pixels in zoomed per "normal pixel"
	ctx.clearRect(0,0,width,height);
	ctx.save();
	for(var x=0; x<wNorm; x++) {
		for(var y=0; y<hNorm; y++) {
			ctx.fillStyle = ((x+y)&1)? "#ddd" : "#bbb";
			ctx.fillRect(x*mult,y*mult, mult,mult);
		}
	}
	ctx.restore();	
};

ut.ct.prototype.paintZoomedPath = function() {
	var elNorm = document.getElementById(this.canNormal);
	var ctxNorm = elNorm.getContext("2d");
	var wNorm = elNorm.width;
	var hNorm = elNorm.height;
	var elZoom = document.getElementById(this.canZoomedPath);
	var ctxZoom = elZoom.getContext("2d");
	var wZoom = elZoom.width;
	var hZoom = elZoom.height;
	var mult = parseInt(wZoom / wNorm, 10);					// # of pixels in zoomed per "normal pixel"
	ut.obj.ctx.paintPath(ctxZoom, wZoom, hZoom, mult);
};


ut.ct.prototype.paintZoomed = function(idNorm, idZoom) {
	var elNorm = document.getElementById(idNorm);
	var ctxNorm = elNorm.getContext("2d");
	var wNorm = elNorm.width;
	var hNorm = elNorm.height;
	var elZoom = document.getElementById(idZoom);
	var ctxZoom = elZoom.getContext("2d");
	var wZoom = elZoom.width;
	var hZoom = elZoom.height;
	ctxZoom.clearRect(0,0,wZoom,hZoom);
	
	// mult = multipler = cell size (5 means each pixel in norm is a 5x5 pixel in zoom)
	this.mult = wZoom / wNorm;
	
	this.normData = ctxNorm.getImageData(0,0,wNorm,hNorm);
	this.zoomData = ctxZoom.createImageData(wZoom,hZoom);
	for(var x=0; x<wNorm; x++) {
		for(var y=0; y<hNorm; y++) {
			var pix = this.getPixel(x,y);
			this.setPixel(x,y, pix);
		}
	}
	ctxZoom.putImageData(this.zoomData, 0,0);
};

ut.ct.prototype.getPixel = function(x,y) {
	var idx = (x + y * this.normData.width) * 4;
	return {
		r:this.normData.data[idx],
		g:this.normData.data[idx+1],
		b:this.normData.data[idx+2],
		a:this.normData.data[idx+3] };
};
ut.ct.prototype.setPixel = function(x,y, pix) {
	x = x * this.mult;
	y = y * this.mult;
	var xx;
	var yy;
	for(xx=0; xx<this.mult; xx++) {
		for(yy=0; yy<this.mult; yy++) {
			var idx = (x+xx + (y+yy) * this.zoomData.width) * 4;
			this.zoomData.data[idx] = pix.r;
			this.zoomData.data[idx+1] = pix.g;
			this.zoomData.data[idx+2] = pix.b;
			this.zoomData.data[idx+3] = pix.a;
		}
	}
};

// -- -- -- -- -- -- -- -- -- -- --
// create THE object
// start by pressing Play (in a second)
setTimeout(function() {
	ut.obj = new ut.ct("canvasNormal","canvasZoomed", "canvasZoomedBack", "canvasZoomedPath");
	ut.obj.tp = new ut.tp();
	ut.obj.ctx = new ut.ctx();
	ut.action.play();
}, 100);
