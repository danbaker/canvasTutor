
// tutorParser constructor
ut.tp = function() {
	// the user supplied JavaScript to run
	this.js = "";
	// line# last processed
	this.lineOn = 0;
	// compiled and re-string-ified JavaScript
	this.jsCompiled = "";
	this.depth = 0;
};

ut.tp.prototype.setjs = function(js) {
	this.js = js;
	this.lineOn = 0;
	this.jsCompiled = "";
	this.depth = 0;
};

ut.tp.prototype.compile = function(js) {
	this.setjs(js);
	var options = {
	predef: ["ctx"],
	white:true
	};
	JSLINT(this.js, options);
	var tre = JSLINT.tree;
	this.processObject(tre);
	console.log("- - - - - - - - - - - - - - - - - - - - - - - -");
	console.log("- - - - - - - - - - - - - - - - - - - - - - - -");
	console.log(this.jsCompiled);
};

ut.tp.prototype.processFirst = function(item) {
	if (item) {
		if (item instanceof Array) {
			for(var i=0; i<item.length; i++) {
				this.processObject(item[i]);
			}
		} else {
			this.processObject(item);
		}
	}
};
ut.tp.prototype.processSecond = function(item) {
	if (item) {
		if (item instanceof Array) {
			for(var i=0; i<item.length; i++) {
				if (i > 0) {
					this.log("second: ,");
					this.jsCompiled += ", ";
				}
				this.processObject(item[i]);
			}
		} else {
			this.processObject(item);
		}
	}
};

ut.tp.prototype.processObject = function(obj) {
	this.depth++;
	if (obj.line < this.lineOn) {
		console.log("LINE NUMBER WEIRDAGE");
	} else if (obj.line > this.lineOn) {
		this.jsCompiled += "\r\n";
		this.lineOn = obj.line;
		this.log("--- line "+ obj.line + "---");
	}
	switch (obj.arity) {
	case undefined:
		this.processUndefined(obj);
		break;
	case "statement":
		this.processStatement(obj);
		break;
	case "prefix":
		this.processPrefix(obj);
		break;
	case "infix":
		this.processInfix(obj);
		break;
	case "suffix":
		this.processSuffix(obj);
		break;
	case 'number':
		this.processNumber(obj);
		break;
	case 'string':
		this.processString(obj);
		break;
	default:
		console.log("NEW ARITY NOT HANDLED: "+obj.arity);
		break;
	}
	this.depth--;
};

ut.tp.prototype.processUndefined = function(obj) {
	if (obj.first) {
		this.processFirst(obj.first);
	}
	this.processObjectValue(obj);
};

ut.tp.prototype.processNumber = function(obj) {
	this.processObjectValue(obj, "number");
	this.processFirst(obj.first);
	this.processSecond(obj.second);
};
ut.tp.prototype.processString = function(obj) {
	this.processObjectValue(obj, "string");
	this.processFirst(obj.first);
	this.processSecond(obj.second);
};

ut.tp.prototype.processStatement = function(obj) {
	this.processObjectValue(obj);
	this.processFirst(obj.first);
	this.processSecond(obj.second);
	this.processFirst(obj.third);
};

ut.tp.prototype.processPrefix = function(obj) {
	this.processObjectValue(obj);
	this.processFirst(obj.first);
	this.processSecond(obj.second);
};
ut.tp.prototype.processInfix = function(obj) {
	this.processFirst(obj.first);
	this.processObjectValue(obj);
	this.processSecond(obj.second);
};
ut.tp.prototype.processSuffix = function(obj) {
	this.processFirst(obj.first);
	this.processSecond(obj.second);
	this.processObjectValue(obj);
};

ut.tp.prototype.processObjectValue = function(obj, type) {
	if (!type) {
		if(typeof(obj.number) === "number") { type = "number";
		} else if (typeof(obj.string) === "string") { type = "string";
		}
	}
	if(type === "number") {
		this.jsCompiled += obj.number;
		this.log("number="+obj.number);
	} else if (type === "string") {
		this.jsCompiled += obj.string;
		this.log("string="+obj.string);
	} else {
		this.log("ERROR: No String or Number");
	}
};

ut.tp.prototype.log = function(txt) {
	var msg = "";
	for(var i=0; i<this.depth; i++) msg += ".";
	console.log(msg + txt);
};
