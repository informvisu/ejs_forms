const app = require('express')();
const auth = require('http-auth');
const logger = require('./logger');

var htauth = null;
var auth_type = env.get('auth.type')
logger.info('Authentication Type: '+auth_type)
if(auth_type=='basic') {
    htauth = auth.basic({
        file: env.get('auth.filepath'),
    });
    init_events()
} else if(auth_type=='digest') {
    htauth = auth.digest({
        realm: "Sample",
        file: env.get('auth.filepath'),
        algorithm:'md5'
    });
    init_events()
}

function init_events() {
    htauth.on('success', (result, req) => {
        var logPrefix = req.ip+' - '+req.method+' '+req.originalUrl+': ';
        logger.info(logPrefix+`User authenticated: ${result.user}`);
    });
    htauth.on('fail', (result, req) => {
        var logPrefix = req.ip+' - '+req.method+' '+req.originalUrl+': ';
        logger.error(logPrefix+`User authentication failed: ${result.user}`);
    });
    htauth.on('error', (error, req) => {
        var logPrefix = req.ip+' - '+req.method+' '+req.originalUrl+': ';
        logger.error(logPrefix+`Authentication error: ${error.code + " - " + error.message}`);
    });
}

module.exports = htauth;
