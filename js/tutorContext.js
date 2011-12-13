
// tutorContext constructor
ut.ctx = function() {
};

ut.ctx.prototype.init = function() {
	console.log("init");
	this.ctxCmdNumber = 0;
};


ut.ctx.prototype.runCmd = function(ctx, cmd, paren, args,line) {
	this.ctxCmdNumber += 1;
	{
		var logMsg = ""+this.ctxCmdNumber+"  Line#"+line+"  runCmd: "+cmd + paren;
		if (args) for(var i=0; i<args.length; i++) {
			if (i > 0) logMsg += ", ";
			logMsg += args[i];
		}
		if (paren === "(") logMsg += ")";
		logMsg += ";";
		console.log(logMsg);
	}
	if (paren === "(") {
		ctx[cmd](args[0],args[1],args[2],args[3],args[4],args[5]);
	} else if (paren === "=") {
		ctx[cmd] = args[0];
	}
};
