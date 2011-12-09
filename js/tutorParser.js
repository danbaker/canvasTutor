
// tutorParser constructor
ut.tp = function() {
	// the user supplied JavaScript to run
	this.setjs("");
};

ut.tp.prototype.setjs = function(js) {
	this.js = js;
	// line# last processed
	this.lineOn = 0;
	// compiled and re-string-ified JavaScript
	this.jsCompiled = "";
	// nested depth
	this.depth = 0;
	// nested block depth (used for pretty-printing into jsCompiled)
	this.blockDepth = 0;
	// kludge: known that an openParen has been added to jsCompiled
	this.openParen = false;		// true means: this line has an open paren that need to close
	// processing a ctx.<command>
	this.processingCtx = 0;				// total ctx commands that are being processed (can find a ctx when still finishing the previous ctx command)
	this.processingCtxStart = false;	// true means: the next command is a "ctx." command
	this.processingCtxIndex = -1;		// index into jsCompiled of ctx command (-1 means NO current ctx command)
	this.processingCtxCommand = "";		// the ctx command processing ("moveTo")
	this.processingCtxArgs = [];		// array of arguments for command processing
	this.processingCtxGetOp = false;	// true means: capture the next "operator" (paren,equals)
	this.processingCtxOp = "";			// last ctx operator
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
	this.addjs("", true, true);
	console.log("- - - - - - - - - - - - - - - - - - - - - - - -");
	console.log("- - - - - - - - - - - - - - - - - - - - - - - -");
	console.log(this.jsCompiled);
};

ut.tp.prototype.processMain = function(obj) {
	this.processFirst(obj);
};


ut.tp.prototype.processFirst = function(item) {
	if (item) {
//		this.log("processFirst");
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
//		this.log("processSecond");
		if (item instanceof Array) {
			this.processingCtxArgs = [];
			for(var i=0; i<item.length; i++) {
				if (i > 0) {
					this.addjs(", ");
				}
				var idx = this.jsCompiled.length;
				this.processObject(item[i]);
				this.processingCtxArgs[i] = this.jsCompiled.substring(idx);
			}
		} else {
			this.processObject(item);
		}
	}
};

ut.tp.prototype.processObject = function(obj) {
	if (obj.edge) this.processEdge(obj);
	this.depth++;
//		this.log("processObject");
	if (obj.line < this.lineOn) {
		console.log("LINE NUMBER WEIRDAGE");
	} else if (obj.line > this.lineOn) {
//		this.addjs("", true);
		this.lineOn = obj.line;
		this.log("------ line "+ obj.line + "------");
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
//		this.log("processUndefined");
	if (obj.first) {
		this.processFirst(obj.first);
	}
	this.processObjectValue(obj);
};

ut.tp.prototype.processNumber = function(obj) {
//		this.log("processNumber");
	this.processObjectValue(obj, "number");
	this.processFirst(obj.first);
	this.processSecond(obj.second);
};
ut.tp.prototype.processString = function(obj) {
//		this.log("processString");
	this.processObjectValue(obj, "string");
	this.processFirst(obj.first);
	this.processSecond(obj.second);
};

ut.tp.prototype.processStatement = function(obj) {
//	this.log("processStatement.start");
	if (obj.first && obj.second && obj.third) {
		this.processStatement_3(obj);
	} else if (obj.first && obj.second) {
		this.processStatement_2(obj);
	} else if (obj.first) {
		this.processStatement_1(obj);
	} else {
		this.processStatement_0(obj);
	}
};
ut.tp.prototype.processStatement_3 = function(obj) {
	this.processObjectValue(obj);
	this.addjs("(");
	this.processFirst(obj.first);
	this.addjs("; ");
	this.processSecond(obj.second);
	this.addjs("; ");
	this.processFirst(obj.third);
	this.addjs(")");
	this.processBlock(obj.block);
};
ut.tp.prototype.processStatement_1 = function(obj) {
	this.processObjectValue(obj);
	this.addjs(" ");
	this.processFirst(obj.first);
	this.addjs(";");
};

ut.tp.prototype.processBlock = function(block) {
	if (block) {
		this.depth++;
		this.blockDepth++;
//		this.log("BLOCK");
		this.addjs(" {");
		this.processMain(block);
		this.blockDepth--;
		this.addjs("", true);
		this.addjs("}");
		this.depth--;
	}
};

ut.tp.prototype.processPrefix = function(obj) {
//		this.log("processPrefix");
	this.processObjectValue(obj);
	this.processFirst(obj.first);
	this.processSecond(obj.second);
};
ut.tp.prototype.processInfix = function(obj) {
//		this.log("processInfix");
	var doCtx;
	if (obj.first && obj.first.string === "ctx") {
		this.startProcessingCtx();
		doCtx = true;
	}
	this.processFirst(obj.first);		// ctx
	if (!doCtx && this.processingCtxOpGet && obj.string) {
		this.processingCtxOpGet = false;
		this.processingCtxOp = obj.string;
	}
	this.processObjectValue(obj);		// .
	if (doCtx) {
		this.processingCtxCommand = obj.second.string;
	}
	this.processSecond(obj.second);		// moveTo
};
ut.tp.prototype.processSuffix = function(obj) {
//		this.log("processSuffix");
	this.processFirst(obj.first);
	this.processSecond(obj.second);
	this.processObjectValue(obj);
};

ut.tp.prototype.processObjectValue = function(obj, type) {
	if (obj.number === undefined && (obj.string === undefined || obj.string === '(begin)')) {
		return;
	}
	if (!type) {
		if(typeof(obj.number) === "number") { type = "number";
		} else if (typeof(obj.string) === "string") { type = "string";
		}
	}
	if(type === "number") {
		this.addjs(obj.number);
		this.log("number="+obj.number);
	} else if (type === "string") {
		this.addjs(obj.string);
		this.log("string="+obj.string);
		if (obj.string === "(") this.openParen = true;
	} else {
		this.log("ERROR: No String or Number");
	}
};

ut.tp.prototype.processEdge = function(txt) {
	this.addjs("", true, true);
};

ut.tp.prototype.startProcessingCtx = function() {
	this.processingCtx += 1;
	this.processingCtxStart = true;
	this.processingCtxOpGet = true;			// capture the next "operator" (like paren or equals)
};
ut.tp.prototype.endProcessingCtx = function() {
	this.processingCtx -= 1;
};

ut.tp.prototype.log = function(txt) {
	var msg = "";
	for(var i=0; i<this.depth; i++) msg += ".";
	console.log(msg + txt);
};

// txt = text to add to the compiled js
// eol = true means adding an "end of line"
// isEdge = true means "at an edge. clean up"
ut.tp.prototype.addjs = function(txt, eol, isEdge) {
	if (this.jsCompiledEOL) {
		this.jsCompiledEOL = false;
		for(var i=0; i<this.blockDepth; i++) {
			this.jsCompiled += "  ";
		}
		if (this.processingCtxStart) {
			this.processingCtxStart = false;
//			this.jsCompiled += "// Start CTX\r\n";
			// save the exact index where this command starts
			this.processingCtxIndex = this.jsCompiled.length;
		}
	}
	this.jsCompiled += txt;
	if (eol) {
		var endCmd;
		if (this.openParen) {
			this.openParen = false;
			this.jsCompiled += ");";
			endCmd = true;
		}
		if (isEdge) {
			// KLUDGE
			var c = this.jsCompiled.substring(this.jsCompiled.length-1);
			if (c != ';' && c != '{') {
				this.jsCompiled += ';';
				endCmd = true;
			}
		}
		if (endCmd && this.processingCtx > 0 && this.processingCtxIndex >= 0) {
			this.endProcessingCtx();
			var ctxCmd = this.jsCompiled.substring(this.processingCtxIndex);
			this.jsCompiled += "                       // ["+ctxCmd+"]   cmd="+this.processingCtxCommand+this.processingCtxOp;
			for(var i=0; i<this.processingCtxArgs.length; i++) {
				this.jsCompiled += this.processingCtxArgs[i]+",";
			}
			// @TODO: append the exact ctx command to jsCompiled (then remove the old one)
			this.processingCtxIndex = -1;
		}
		this.jsCompiled += "\r\n";
		this.jsCompiledEOL = true;
	}
};