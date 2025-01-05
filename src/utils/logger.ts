import winston from 'winston';

const logLevel = process.env.NODE_ENV === 'production' ? 'info' : 'debug'; // Use 'debug' in development

const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(), // Logs to the console
    new winston.transports.File({ filename: 'logs/app.log' }), // Logs to a file
  ],
});

export default logger;
