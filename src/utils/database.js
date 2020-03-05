const loki = require('lokijs')
const lfsa = require('lokijs/src/loki-fs-structured-adapter')
const logger = require('./logger')

logger.info('Loading DB.. ')
const appDb = new loki('./db/appDb.json', {
	adapter: new lfsa(),
    autoload: true,
    autoloadCallback : appDbInitialize,
    autosave: true, 
    autosaveInterval: 4000
});
function appDbInitialize() {
	if (appDb.getCollection("app_request") === null)
		appDb.addCollection("app_request");
	if (appDb.getCollection("app_user") === null)
		appDb.addCollection("app_user");
	
	//appDb.saveDatabase();
	logger.info('AppDB loaded.. '+JSON.stringify(appDb.listCollections()));
}

module.exports.appDb = appDb;
