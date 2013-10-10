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


server.get('/interest', function(req, res) {
	var result = Interest.find({});
	res.send(result);
});

server.get('/interest/:id', function(req, res) {

	Interest.findById(req.params.id, function(err, data) {
		res.send(data);
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

