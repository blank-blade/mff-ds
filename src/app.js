const express = require('express')

const jobs = require('./jobs')

const app = express()

app.get('/jobs', (_, res) => {
  return res.status(200).json(Object.values(jobs))
})

// catch-all error handler
// eslint disable otherwise not able to catch errors
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  console.error(err)
  const { message } = err
  res.status(err.status || 500).json({ message })
})

module.exports = app
