const app = require('./src/app');
const mongoose = require('mongoose');

require('dotenv').config();

const { PORT = 8080 } = process.env;

const uri = process.env.ATLAS_URI;

mongoose.connect(uri, { 
    useNewUrlParser: true, 
    useCreateIndex: true
});

const connection = mongoose.connection;

connection.once('open', () => {
    console.log("MongoDB connection established");
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port ${PORT}`)
});