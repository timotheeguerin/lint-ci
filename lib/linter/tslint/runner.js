var Linter = require("tslint");
var fs = require("fs");
var glob = require("glob");
var path = require("path");

var configFile = path.join(__dirname, 'tslint.json');
var config = JSON.parse(fs.readFileSync(configFile, "utf8"));

var options = {
    formatter: "json",
	configuration: config
};

var result = {};
glob("**/*.ts", function (er, files) {
	files.forEach(function (file) {
		var contents = fs.readFileSync(file, "utf8");
		var ll = new Linter(file, contents, options);
		var fileResult = ll.lint();
		result[file] = JSON.parse(fileResult['output']);
	});
	console.log(JSON.stringify(result));
});
