import winston from "winston";
import path from "path";

const logDir = "logs";

// Define log format
const logFormat = winston.format.combine(
    winston.format.timestamp({format: "YYYY-MM-DD HH:mm:ss"}),
    winston.format.errors({stack: true}),
    winston.format.printf(({timestamp, level, message, stack}) => {
        return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
    })
);

// Create the logger
const logger = winston.createLogger({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    format: logFormat,
    transports: [
        // Console transport
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.printf(({timestamp, level, message, stack}) => {
                    return `${timestamp} [${level}]: ${stack || message}`;
                })
            )
        }),
        // Error log file
        new winston.transports.File({
            filename: path.join(logDir, "error.log"),
            level: "error",
            maxsize: 5242880, // 5MB
            maxFiles: 5
        }),
        // Combined log file
        new winston.transports.File({
            filename: path.join(logDir, "combined.log"),
            maxsize: 5242880, // 5MB
            maxFiles: 5
        })
    ]
});

// Stream for Morgan HTTP logger
export const stream = {
    write: (message: string) => {
        logger.info(message.trim());
    }
};

export default logger;
