/**
 * Winston-based logging library
 */

// Load the winston library - common name for variable is winston
const winston = require('winston');

// Load the filesystem library - common name for variable is fs
const fs = require('fs');

// Load the path library - common name for variable is path
const path = require('path');

// Define the log directory and make sure it exists
var logDirectory = path.resolve('logs');
console.log(`log dir: ${logDirectory}`);
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// Create a logger and setup transports
module.exports.log = winston.createLogger({
  level: 'info',
  levels: winston.config.syslog.levels,
  format: winston.format.json(),
  exitOnError: false,
  transports: [
    // Write to console with level 'debug' and higher
    // Write to combined.log file with level `debug` and higher
    // Write to error.log with level 'error' and higher
    // Write unhandled exceptions to exceptions.log
    new winston.transports.Console({format: winston.format.combine(winston.format.timestamp(), winston.format.simple()), level: 'debug'}),
    new winston.transports.File({ filename: `${logDirectory}/error.log`, level: 'error' }),
    new winston.transports.File({ filename: `${logDirectory}/combined.log`, level: 'debug' })
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: `${logDirectory}/exceptions.log` })
  ]
});
