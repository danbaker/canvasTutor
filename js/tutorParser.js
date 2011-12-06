
// tutorParser constructor
ut.tp = function() {
	// the user supplied JavaScript to run
	this.js = "";
};

ut.tp.prototype.setjs = function(js) {
	this.js = js;
};

ut.tp.prototype.compile = function() {
	var options = {
	predef: ["ctx"],
	white:true
	};
	JSLINT(this.js, options);
	var tre = JSLINT.tree;
	// @TODO: WORK HERE ... process the tree ... console.log tree back into JavaScript
	//
	var danb = 1;
};

