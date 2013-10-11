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

//boilerplate stuff for cors etc. (found on thez web)

server.use(
  function crossOrigin(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    return next();
  }
);

function unknownMethodHandler(req, res) {
  if (req.method.toLowerCase() === 'options') {
      console.log('received an options method request');
    var allowHeaders = ['Accept', 'Accept-Version', 'Content-Type', 'Api-Version', 'Origin', 'X-Requested-With']; // added Origin & X-Requested-With

    if (res.methods.indexOf('OPTIONS') === -1) res.methods.push('OPTIONS');

    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', allowHeaders.join(', '));
    res.header('Access-Control-Allow-Methods', res.methods.join(', '));
    res.header('Access-Control-Allow-Origin', req.headers.origin);

    return res.send(204);
  }
  else
    return res.send(new restify.MethodNotAllowedError());
}

server.on('MethodNotAllowed', unknownMethodHandler);


//actual implementation

server.get('/interest', function(req, res) {
	Interest.find({}, function(err, docs) {
		res.send(docs);
	});
});

server.get('/interest/:id', function(req, res) {

	Interest.findById(req.params.id, function(err, doc) {
		res.send(doc);
	});

});

server.post('/interest', function(req, res) {
	var params = req.body;
	var newInterest = new Interest({ title: params.title});

	newInterest.save(function() {
		res.send('done');	
	});

});

server.post('/interest/:id', function(req, res) {
	Interest.findById(req.params.id, function(err, doc) {
		doc.votes = req.body.votes;
		doc.save(function() {
			res.send(doc)
		});
	});

});

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});

