const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;
const DailyRotateFile = require('winston-daily-rotate-file');

const myFormat = printf(info => {
  //return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
	return `${info.timestamp} ${info.level} ${info.message}`;
});

const logger = createLogger({
  level: env.get('logger.level'),
  format: combine(
    //label({ label: env.get('logger.label') }),
    timestamp(),
    myFormat
  ),
  transports: [
	new transports.Console(),
	new DailyRotateFile({filename: env.get('logger.errorfile'), level: 'error', zippedArchive: true}),
	new DailyRotateFile({filename: env.get('logger.infofile'), zippedArchive: true})
  ]
});


module.exports = logger;
