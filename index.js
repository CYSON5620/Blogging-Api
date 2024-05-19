const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/user');
const blogRouter = require('./routes/blog');
const logger = require('./logger');
const config = require('./config');

const app = express();

mongoose.connect(config.mongodbUrl, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());
app.use(userRouter);
app.use(blogRouter);

app.use((req, res, next) => {
  res.status(404).send({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send({ error: 'Internal Server Error' });
});

module.exports = app;
