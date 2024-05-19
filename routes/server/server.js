const app = require('./app');
const config = require('./config');
const logger = require('./logger');

app.listen(config.port, () => {
  logger.info(`Server running on port ${config.port}`);
});
