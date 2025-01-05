require('dotenv').config();

import http from 'http';
import app from './app';
import sequelize from './config/database';
import logger from './utils/logger';
import { initializeWebSocket } from './websocket';

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

export const startServer = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connected successfully');

    // Synchronize models (set `force: false` for production-safe operation)
    await sequelize.sync({ force: false });

    const server = http.createServer(app);

    initializeWebSocket(server);
    server.listen(PORT, () => {
      logger.info(
        `Server is running on http://localhost:${PORT} in ${NODE_ENV} mode`
      );
    });

    const shutdown = async () => {
      logger.info('Gracefully shutting down...');
      try {
        await sequelize.close();
        logger.info('Database connection closed');
        process.exit(0);
      } catch (err) {
        logger.error(`Error during shutdown: ${err}`);
        process.exit(1);
      }
    };

    process.on('SIGINT', shutdown); // Handle CTRL+C
    process.on('SIGTERM', shutdown); // Handle termination signal (e.g., from Docker)
    process.on('unhandledRejection', (err) => {
      logger.error(`Unhandled promise rejection: ${err}`);
      process.exit(1);
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error}`);
    process.exit(1);
  }
};

startServer();
