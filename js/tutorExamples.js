
ut.example = {};

ut.example.set = function(txt) {
	console.log("Example: "+txt);
	if (ut.example.set[txt]) {
		return ut.example.set[txt]();
	}
//	return "ctx.moveTo(10,10);\r\nctx.lineTo(20,10);\r\n";
}

ut.example.set.html = function() {
	return "" +
	'//<canvas id="can" width="100" height="100"></canvas>\r\n' +
	'//\r\n' +
	"// var el = document.getElementById('can');\r\n" +
	"// var ctx = el.getContext('2d');\r\n" +
	"// var width = el.width;\r\n" +
	"// var height = el.height;\r\n" +
	"// ctx.clearRect(0,0,width,height);\r\n" +
	"ctx.fillRect(0,0,20,20);\r\n" +
	"";
};
