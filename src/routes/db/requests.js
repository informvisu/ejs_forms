const requestRoutes = require('express').Router();
const fs = require('fs');

const logger = require('../../utils/logger');

requestRoutes.get('/', function (req, res, next) {
	var resp = ''
	var docs = appDb.getCollection('app_request').find({})
	for(i=0; i < docs.length; i++) {
		delete docs[i].meta
		delete docs[i].$loki
		resp += JSON.stringify(docs[i])
	}
	//res.send('<pre>'+JSON.stringify(docs, undefined, 2)+'</pre>');
	res.render('layout', {data: docs})
});

requestRoutes.get('/:requestId(*)', function (req, res, next) {
	var requestId = req.params.requestId;
	var resp = ''
	var doc = appDb.getCollection('app_request').find({req_id:{$aeq: requestId}})
	console.log(doc)
	resp += JSON.stringify(doc)
	
	//res.send('<pre>'+JSON.stringify(doc, undefined, 2)+'</pre>');
	res.render('layout', {data: doc})
});

requestRoutes.get('/:requestId(*)/log', function (req, res, next) {
	var requestId = req.params.requestId;
	var fileName  = '/opt/root/requests/'+requestId+'/log.txt';
	fs.readFile(fileName, function(err, data) {
		console.log(data)
		if(err) {
			//res.send(err.message)
			res.render('layout', {data: err.message})
		} else {
			//res.send(data)
			res.render('layout', {data: data})
		}
	})
});


module.exports = requestRoutes;
