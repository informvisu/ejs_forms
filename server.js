const auth = require('http-auth');
const authConnect = require('http-auth-connect');
const express = require('express');
const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');
const propsReader = require('properties-reader');
const request = require('request');
var session = require('express-session')

global.env = propsReader(__dirname +'/env.properties');
const logger = require('./src/utils/logger');
const authenticate = require('./src/utils/authenticate');

const database = require('./src/utils/database');
global.appDb;
var reqColl;
setTimeout(function() {
	appDb = database.appDb;
	reqColl = appDb.getCollection('app_request');
}, 3000);

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

app.use(express.static(path.join(__dirname, 'src/views')));

var hostname = require('os').hostname();
//var hostname = env.get('node.host');

var server;
//Create Server
if(env.get('node.allowHttps')=='yes') {
	var options = {
			key: fs.readFileSync(__dirname +'/'+env.get('security.decryptedkey')),
			cert: fs.readFileSync(__dirname +'/'+env.get('security.certificate'))
		};
	server = https.createServer(options, app).listen(env.get('node.httpsport'), hostname, () => {
		logger.info('application is listening at https://'+hostname+':'+env.get('node.httpsport'));
	});
}
if(env.get('node.allowHttp')=='yes') {
	server = http.createServer(app).listen(env.get('node.httpport'), hostname, () => {
		logger.info('application is listening at http://'+hostname+':'+env.get('node.httpport'));
	});
}

// Authentication module.
//Run 'htdigest user1 Sample' on command line to generate the users.digest file
app.use(authConnect(authenticate));

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

app.use(function (err, req, res, next) {
	logger.error(req.originalUrl+': '+err.stack)
	res.status(500).send('Something broke!')
})

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/',(req, res) => {
  //res.send('Hello, Wecome to MyApp!');
	res.render('layout', {data: 'Hello, Wecome to MyApp!'});
});
app.get('/favicon.ico',(req, res) => {
  res.download('favicon.ico');
});

const requestRoutes = require('./src/routes/db/requests');
app.use('/request', requestRoutes);

const dataRoutes = require('./src/routes/db/data');
app.use('/data', dataRoutes);

app.use('/*', (req, res)=>res.render('layout', {data: 'invalid request'}));

function haltForMillis(millis) {
	var waitTill = new Date(new Date().getTime() + millis);
	while(waitTill > new Date()){}
}
