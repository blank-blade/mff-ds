const express = require('express')
const cors = require('cors')

const jobs = require('./jobs')

const app = express()

app.use(cors())

app.get('/', (_, res) => {
  return res
    .status(200)
    .send('<img src="https://cdn.discordapp.com/emojis/404433244113862667.png?v=1" />')
})

app.get('/jobs', (req, res) => {
  const { query: { job } } = req
  if (job) {
    return res.status(200).json(jobs[0][job] || {})
  }
  return res.status(200).json(jobs[0])
})

app.get('/jobs/keys', (_, res) => {
  return res.status(200).json(Object.keys(jobs[0]))
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
