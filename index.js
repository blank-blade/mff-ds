const app = require('./src/app')

const { PORT = 8080 } = process.env

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port ${PORT}`)
})
