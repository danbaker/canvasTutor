ut = {};
ut.action = {};

// THE main canvasTutor object
ut.obj = {};

ut.action.play = function() {
	var js = jseditor.value;
	ut.obj.setjs(js);
	ut.obj.paintAll();
};

// canvasTutor constructor
ut.ct = function(idCanvasNormal, idCanvasZoomed) {
	// the user supplied JavaScript to run
	this.js = "";
	
	this.canNormal = idCanvasNormal;
	this.canZoomed = idCanvasZoomed;
};

ut.ct.prototype.setjs = function(js) {
	this.js = js;
};

ut.ct.prototype.paintAll = function() {
	this.paintNormal(this.canNormal);
	this.paintZoomed(this.canNormal, this.canZoomed);
};

// paint onto a known canvas
ut.ct.prototype.paintNormal = function(idCan) {
	var el = document.getElementById(idCan);
	var ctx = el.getContext("2d");
	var width = el.width;
	var height = el.height;
	ctx.clearRect(0,0,width,height);
	try {
		eval(this.js);
	} catch (err) {
		console.log("JavaScript Error");
		throw(err);
	}
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
	var mult = wZoom / wNorm;
	
};

// -- -- -- -- -- -- -- -- -- -- --
// create THE object
ut.obj = new ut.ct("canvasNormal","canvasZoomed");
// start by pressing Play (in a second)
setTimeout(function() {ut.action.play();}, 100);
