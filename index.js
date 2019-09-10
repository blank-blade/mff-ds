const app = require('./src/app');
const mongoose = require('mongoose');
const JobModel = require('./src/models/jobs.model.js');
const jobs = require('./src/jobs.json')

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
    connection.db.listCollections({name: 'jobs'})
    .next((err, collinfo) => {
      if (collinfo) {
        // if exists
        JobModel.collection.drop();
        console.log('mongodb: Collection dropped');
      } else {
        console.log('mongodb: Collection does not exist');
      } 

      console.log('mongodb: Updating collection...');
      JobModel.collection.insertMany(jobs[0], (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log("mongodb: Successfully added collection");
        }
      });
    });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port ${PORT}`)
});