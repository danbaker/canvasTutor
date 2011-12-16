
ut.example = {};

ut.example.set = function(txt) {
	console.log("Example: "+txt);
	if (ut.example.set[txt]) {
		return ut.example.set[txt]();
	}
	// return { w:<width/height>, m:<multiplier>, js:<JavaScript> }
}

ut.example.set.html = function() {
	return {w:50, m:8, js:'' +
	'//<canvas id="can" width="100" height="100"></canvas>\r\n' +
	'//\r\n' +
	'// var el = document.getElementById("can");\r\n' +
	'// var ctx = el.getContext("2d");\r\n'+
	'// var width = el.width;\r\n' +
	'// var height = el.height;\r\n' +
	'// ctx.clearRect(0,0,width,height);\r\n' +
	'ctx.fillRect(0,0,20,20);\r\n' +
	''};
};

ut.example.set.lines = function() {
	return {w:20, m:40, js:'' +
	'ctx.moveTo(5,5);\r\n' +
	'ctx.lineTo(10,5);\r\n' +
	'ctx.strokeStyle="red";\r\n' +
	'ctx.lineWidth=2;\r\n' +
	'ctx.stroke();\r\n' +
	''};
};

ut.example.set.lines2 = function() {
	return {w:20, m:40, js:'' +
	'ctx.moveTo(5,5);\r\n' +
	'ctx.lineTo(10,5);\r\n' +
	'ctx.strokeStyle="red";\r\n' +
	'ctx.lineWidth=1;\r\n' +
	'ctx.stroke();\r\n' +
	'// notice the line is 2 pixels tall and semi-transparent' +
	'ctx.beginPath();\r\n' +
	'ctx.moveTo(5,10.5);\r\n' +
	'ctx.lineTo(10,10.5);\r\n' +
	'ctx.strokeStyle="red";\r\n' +
	'ctx.lineWidth=1;\r\n' +
	'ctx.stroke();\r\n' +
	'// notice the line is 1 pixel tall and solid' +
	''};
};

