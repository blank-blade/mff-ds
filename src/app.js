const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const JobModel = require('./models/jobs.model');

const app = express();
app.enable('trust proxy');
app.use(rateLimit({ windowMs: 60 * 1000, max: 100 }));
app.use(cors());

app.get('/', (_, res) => {
  return res
    .status(200)
    .send('<img src="https://cdn.discordapp.com/emojis/404433244113862667.png?v=1" />');
});

/**
 * Jobs endpoint
 * Query for specific job names
 */
app.get('/beta/jobs', (req, res, next) => {
  const { query: { name } } = req; // name specific query

  if (name) {
    let query = JobModel.where({ jobQueryString: name });

    query.findOne((err, job) => {
      if (err) {
        const { message } = err;
        return res.status(err.status || 500).json({ message });
      }
  
      if (!job) {
        return res.status(400).json('Job not found');
      }

      return res.status(200).json(job);
    });
  } else {
    JobModel.find().then(job => {
      res.status(200).json(job);
    }).catch(next);
  }
});

/**
 * Jobs endpoint
 * Query for specific job names given a type
 * Valid types: [Warrior, Mage, Ranger, Monk, Sarah, Meia, Graff, Sophie, Skin, Legend, Ex]
 */
app.get('/beta/jobs/type', (req, res, next) => {
  const { query: { type } } = req; // type specific query

  if (!type) {
    let err = new Error("Query string required");
    const { message } = err;
    return res.status(err.status || 500).json({ message });
  }

  if (type === "Skin" || type === "Legend" || type === "Ex") {
    let property = "jobIs" + `${type}`;
    JobModel.find().exists(property, true).then(jobs => {
      res.status(200).json(jobs);
    }).catch(next);
  } else {
    JobModel.find().where({ jobType: type }).then(jobs => {
      res.status(200).json(jobs);
    }).catch(next);
  }
});

/**
 * Jobs endpoint
 * Returns list of queryable jobs 
 */
app.get('/beta/jobs/keys', (_, res, next) => {
  JobModel.find().distinct('jobQueryString')
    .then(jobs => {
      res.status(200).json(jobs);
    })
    .catch(next);
});

// catch-all error handler
// eslint disable otherwise not able to catch errors
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  console.error(err);
  const { message } = err;
  res.status(err.status || 500).json({ message });
})

module.exports = app;
