
// tutorContext constructor
ut.ctx = function() {
};

ut.ctx.prototype.init = function() {
	console.log("init");
	this.ctxCmdNumber = 0;
};


ut.ctx.prototype.runCmd = function(ctx, cmd, paren, args) {
	this.ctxCmdNumber += 1;
	console.log(""+this.ctxCmdNumber+" runCmd: "+cmd);
	if (paren === "(") {
		ctx[cmd](args[0],args[1],args[2],args[3],args[4],args[5]);
	} else if (paren === "=") {
		ctx[cmd] = args[0];
	}
};
