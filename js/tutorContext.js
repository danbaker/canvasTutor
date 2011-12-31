
// tutorContext constructor
ut.ctx = function() {
};

// set the line# 
ut.ctx.prototype.setNumber = function(n) {
	this.number = n;
	if (n > this.ctxCmdLines) {
		return false;
	}
	return true;
};

ut.ctx.prototype.init = function() {
	// which command is being run
	this.ctxCmdNumber = 0;
	// which 
	this.ctxCmdLines = 1;
	this.path = {};
	this.doCmd("beginPath", []);
};


ut.ctx.prototype.runCmd = function(ctx, cmd, paren, args,line) {
	this.ctxCmdNumber += 1;
	this.ctxCmdLines += 1;
	if (this.ctxCmdNumber <= this.number) {
		this.ctxLineNumberPrev = this.ctxLineNumber;
		this.ctxLineNumberNext = null;
		this.ctxLineNumber = line;		// save the last line# processed
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
			// record the command
			this.doCmd(cmd, args);
			// actually perform the command on the canvas
			ctx[cmd](args[0],args[1],args[2],args[3],args[4],args[5]);
		} else if (paren === "=") {
			// change canvas attribute
			ctx[cmd] = args[0];
		}
	} else if (this.ctxLineNumberNext === null) {
		this.ctxLineNumberNext = line;
	}
};

ut.ctx.prototype.doCmd = function(cmd, args) {
	var pnt;
	switch(cmd) {
	case "beginPath":
		this.path.points = [];
		this.path.x = this.path.y = null;
		this.path.begin = {};
		this.path.begin.x = this.path.begin.y = null;
		break;
	case "moveTo":
		this.savePathXY(args[0],args[1]);
		pnt = {cmd:"moveTo", x:args[0], y:args[1]};
		this.path.points.push(pnt);
		break;
	case "lineTo":
		if (this.path.points.length > 0 && this.path.begin.x === null) {
			pnt = this.path.points[this.path.points.length-1];
			this.path.begin.x = pnt.x;
			this.path.begin.y = pnt.y;
		}
		this.savePathXY(args[0],args[1]);
		pnt = {cmd:"lineTo", x:args[0], y:args[1]};
		this.path.points.push(pnt);
		break;
	case "closePath":
		if (this.path.points.length > 0) {
			this.savePathXY(this.path.points[0].x, this.path.points[0].y);
			pnt = {cmd:"lineTo", x:this.path.begin.x, y:this.path.begin.y};
			this.path.points.push(pnt);
		}
		break;
	case "arc":
		pnt = {cmd:"arc", x:args[0], y:args[1], radius:args[2], startAngle:args[3], endAngle:args[4], anitclockwise:args[5]};
		this.path.points.push(pnt);
		// @TODO: calc ending point and call savePathXY(newX,newY)
		break;
	}
};

// save the current path cursor point
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
	if (this.path.x != null) {
		ctx.fillStyle = "rgba(0,0,255,0.4)";
		ctx.strokeStyle = "rgba(0,0,255,0.4)";
		this.paintPathPoints(ctx, wide, high, mult);
		ctx.beginPath();
		ctx.moveTo(this.path.x*mult,0);
		ctx.lineTo(this.path.x*mult,high);
		ctx.moveTo(0,this.path.y*mult);
		ctx.lineTo(wide,this.path.y*mult);
		ctx.lineWidth = 2;
		ctx.stroke();
	}
	ctx.restore();
};

ut.ctx.prototype.paintPathPoints = function(ctx, wide, high, mult) {
	ctx.beginPath();
	var pnt;
	for(var i=0; i<this.path.points.length; i++) {
		pnt = this.path.points[i];
		switch (pnt.cmd) {
		case "moveTo":
			ctx.moveTo(pnt.x*mult, pnt.y*mult);
			break;
		case "lineTo":
			ctx.lineTo(pnt.x*mult, pnt.y*mult);
			break;
		case "arc":
		console.log("ARC");
			ctx.arc(pnt.x*mult, pnt.y*mult, pnt.radius*mult, pnt.startAngle, pnt.endAngle, pnt.anticlockwise);
			break;
		}
	}
	ctx.lineWidth = 1;
	ctx.stroke();
};

