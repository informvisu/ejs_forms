const commandRoutes = require('express').Router();
const fs = require('fs');
const fspath = require('path');

const logger = require('../utils/logger');

var reqStr = fs.readFileSync(__dirname +'/../forms/app_request.json')
var respStr = fs.readFileSync(__dirname +'/../forms/form.json')

commandRoutes.get('/*', function (req, res, next) {
	var logPrefix = req.ip+' - '+req.method+' '+req.originalUrl+': ';
	logger.info(logPrefix);
	//res.status(503).send('It should be a POST request')
	var respObj = JSON.parse(respStr)
	res.render('layout', {data: respObj})
});

commandRoutes.post('/', function (req, res, next) {
	var logPrefix = req.ip+' - '+req.method+' '+req.originalUrl+': ';
	logger.info(logPrefix+ 'req.headers.authorization: '+ JSON.stringify(req.headers.authorization))
	logger.info(logPrefix+ 'req.body: '+ JSON.stringify(req.body))
	var target = req.body.target;
	var command = req.body.command;
	var parameters = req.body.education;//TODO
	var credentials = Buffer.from(req.headers.authorization.split(" ")[1], 'base64').toString();
	var username = credentials.split(':')[0];
	
	var reqObj = JSON.parse(reqStr)
	reqObj.req_id = Date.now();
	reqObj.req_type = 'command';
	reqObj.target = target;
	reqObj.command = command;
	reqObj.username = username;
	reqObj.state = 'submitted';
	reqObj.status = '';
	reqObj.comment = command;
	reqObj.submittedAt = new Date();
	reqObj.startedAt = new Date();
	
	var reqColl = appDb.getCollection('app_request');
	reqColl.insert(reqObj);
	var reqLogFile = fspath.join(env.get('download.homedir'), 'requests/'+reqObj.req_id+'/log.txt');
	mkdirp(reqLogFile);
	
	var listParams = convertParams(parameters);
	console.log(listParams);
	
	var resp = 'Received you request and processed';
	//TODO - Now do your request processing logic here to capture the response
	
	writeToFile(reqLogFile, JSON.stringify(reqObj)+'\n\n\n'+resp);
	
	res.render('layout', {data: resp})
});

function convertParams(parameters) {
	var listParams = new Array();
	//console.log(parameters);
	var keys = Object.keys(parameters);
	if(keys.length < 1) {
		listParams.push(JSON.parse('{\'dummy\': \'dummy\'}'))
	} else {
		var size = parameters[keys[0]].length;
		for(i=0; i<size; i++) {
			var params = '{'
			for(k=0; k<keys.length; k++) {
				//console.log(typeof keys[k], keys[k]);
				params += '\"'+keys[k]+'\": '+parameters[keys[k]][i];
				if(k < (keys.length-1)) params += ', ';
			}
			params += '}';
			//console.log(params);
			listParams.push(JSON.parse(params))
		}
		
	}
	
	return listParams;
}

function writeToFile(fileName, data) {
	fs.writeFile(fileName, data, {encoding: 'utf8', flag: 'w'}, function(err) {
		if(err)
			logger.error('Error writing to file '+err.stack)
		else
			logger.info('Wrote to '+fileName)
	})
}

function mkdirp(filePath) {
	var dirname = fspath.dirname(filePath);
	if (fs.existsSync(dirname))
		return;
	mkdirp(dirname);
	fs.mkdirSync(dirname);
}

module.exports = commandRoutes;
