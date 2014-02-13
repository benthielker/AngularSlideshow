//
// Angular Slideshow Example Node app
// Serves example slide data via api route.
//

//
// If you need console output to troubleshoot set verbose to true.
// Use log function to issue additional console logs.
//
var verbose = false,
	log = (function(msg) {
		if (verbose) console.log(msg);
	});


var express = require("express");
var app = express();

//
// # configure server
//
app.set("port", 8000);
app.use(express.bodyParser());
app.engine('.html', require('ejs').renderFile);
// define static files directory
app.use(express.static(__dirname+"/public"));
console.log("static: "+__dirname+"/public");
// define views directory
app.set('views', __dirname+"/public");
console.log("views: "+app.get('views'));


//
// # setup public routes...
//

// serve example page as index.
app.get('/', function(req,res) {
	res.render('example.html');
});

// respond to api request.
app.get('/api/slides/:showId', function(req, res) {
	console.log("Angular Slideshow app.get('/api/slides/:showId') req.params.showId:"+
		req.params.showId);
	
	//
	// For this example we're simply loading data from the json files in public/slides
	// and serving it via the response object.
	//
	res.contentType("application/json");
	
	var showId = req.params.showId;
	if (showId) {
		var fs = require('fs'),
			file = __dirname+"/public/slides/"+showId+".json";
		fs.readFile(file, 'utf8', function(err,data) {
			if (err) {
				log("app.get('/api/slides/:showId') FS ERROR: "+err.message);
				res.send([]);
			} else {
				data = JSON.parse(data);
				res.send(data);
			}
		});
	} else {
		res.send([]);
	}
});


//
// # start listening...
//
app.listen(app.get("port"), function() {
	console.log("Angular Slideshow app listening on port %d.", app.get("port"));
});
