const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const beta = require('./beta')

const app = express();
app.enable('trust proxy');
app.use(rateLimit({ windowMs: 60 * 1000, max: 100 }));
app.use(cors());

app.get('/', (_, res) => {
  return res
    .status(200)
    .send('<img src="https://cdn.discordapp.com/emojis/404433244113862667.png?v=1" />');
});

app.use('/beta', beta)

// catch-all error handler
// eslint disable otherwise not able to catch errors
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  console.error(err);
  const { message, status = 500 } = err;
  return res.status(status).json({ message });
})

module.exports = app;
