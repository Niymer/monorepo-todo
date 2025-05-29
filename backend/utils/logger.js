const { createLogger, format, transports } = require('winston')
const { combine, timestamp, printf } = format
const path = require('path')
const fs = require('fs')

const logsDir = path.join(__dirname, '..', 'logs')
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir)

const logFmt = printf(({ timestamp, level, message }) =>
  `${timestamp} ${level.toUpperCase()}: ${message}`)

const onlyInfo = format(info => (info.level === 'info' ? info : false))

module.exports = createLogger({
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })),
  transports: [
    // access.log：只收 INFO
    new transports.File({
      filename: path.join(logsDir, 'access.log'),
      level: 'info',
      format: combine(onlyInfo(), logFmt),
    }),
    // error.log：只收 ERROR
    new transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      format: combine(logFmt),
    }),
  ],
})
