
// tutorContext constructor
ut.ctx = function() {
};

ut.ctx.prototype.setNumber = function(n) {
	this.number = n;
	if (n > this.ctxCmdLines) {
		return false;
	}
	return true;
};

ut.ctx.prototype.init = function() {
	console.log("init");
	this.ctxCmdNumber = 0;
	this.ctxCmdLines = 1;
	this.path = {};
};


ut.ctx.prototype.runCmd = function(ctx, cmd, paren, args,line) {
	this.ctxCmdNumber += 1;
	this.ctxCmdLines += 1;
	if (this.ctxCmdNumber <= this.number) {
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
			this.doCmd(cmd, args);
			ctx[cmd](args[0],args[1],args[2],args[3],args[4],args[5]);
		} else if (paren === "=") {
			ctx[cmd] = args[0];
		}
	}
};

ut.ctx.prototype.doCmd = function(cmd, args) {
	switch(cmd) {
	case "moveTo":
		this.savePathXY(args[0],args[1]);
		break;
	case "lineTo":
		this.savePathXY(args[0],args[1]);
		break;
	}
};

ut.ctx.prototype.savePathXY = function(x,y) {
	this.path.x = x;
	this.path.y = y;
};


// paint the "path" canvas over the top of the zoomed image
// @param ctx	= canvas context to paint the path on
// @param wide	= canvas width (divide by mult to get "normal" width)
// @param high	= canvas height
// @param mult	= multiplier of normal canvas to get this zoomed canvas size
ut.ctx.prototype.paintPath = function(ctx, wide, high, mult) {
	ctx.save();
	ctx.clearRect(0,0,wide,high);
	
//	ctx.translate(0.5,0.5);
	ctx.fillStyle = "rgba(0,0,255,0.9)";
	ctx.beginPath();
	ctx.moveTo(this.path.x*mult,0);
	ctx.lineTo(this.path.x*mult,high);
	ctx.moveTo(0,this.path.y*mult);
	ctx.lineTo(wide,this.path.y*mult);
	ctx.strokeStyle = "rgba(0,0,255,0.4)";
	ctx.lineWidth = 2;
	ctx.stroke();
	ctx.restore();
};
