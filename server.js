var restify = require('restify');
var Interest = require('./model/interest.js').model;

var mongoose = require('mongoose');


mongoose.connect('mongodb://localhost/contriboot');

function respond(req, res, next) {
  res.send('hi ' + req.params.name);
}

var server = restify.createServer();
server.pre(restify.pre.userAgentConnection());
server.use(restify.bodyParser({ mapParams: false }));

server.use(
  function crossOrigin(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    return next();
  }
);


server.get('/interest', function(req, res) {
	Interest.find({}, function(err, docs) {
		res.send(docs);
	});
});

server.get('/interest/:id', function(req, res) {

	Interest.findById(req.params.id, function(err, docs) {
		res.send(docs);
	});

});

server.post('/interest', function(req, res) {
	var params = req.body;
	var newInterest = new Interest({ title: params.title});

	newInterest.save(function() {
		res.send('done');	
	});

});

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});

