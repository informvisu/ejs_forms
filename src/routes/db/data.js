const dataRoutes = require('express').Router();
const fs = require('fs');
const request = require('request');
const net = require('net');

const logger = require('../../utils/logger');

dataRoutes.get('/*', function (req, res, next) {
	console.log('*** req.params: ', req.params)
	console.log('*** req.body: ', req.body)
	var logPrefix = req.ip+' - '+req.method+' '+req.originalUrl+': ';
	logger.info(logPrefix);
	//res.send('Assume some data here')
	res.render('layout', {data: 'Assume some data here'})
});

module.exports = dataRoutes;
