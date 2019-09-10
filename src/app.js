const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const jobs = require('./jobs');
const Job = require('./models/jobs.model');

const app = express();
app.enable('trust proxy');
app.use(rateLimit({ windowMs: 60 * 1000, max: 100 }));
app.use(cors());

app.get('/', (_, res) => {
  return res
    .status(200)
    .send('<img src="https://cdn.discordapp.com/emojis/404433244113862667.png?v=1" />');
});


app.post('/beta/jobs/add', (req, res) => {
    const jobId = jobs[0]["onion-knight"].jobId;
    const jobQueryString = jobs[0]["onion-knight"].jobQueryString;
    const jobType = jobs[0]["onion-knight"].jobType;
    const jobName = jobs[0]["onion-knight"].jobName;
    const jobStat = {
        Hp: jobs[0]["onion-knight"].jobStatHp,
        Attack: jobs[0]["onion-knight"].jobStatAttack,
        Break: jobs[0]["onion-knight"].jobStatBreak,
        Magic: jobs[0]["onion-knight"].jobStatMagic,
        CritChance: jobs[0]["onion-knight"].jobStatCritChance,
        Speed: jobs[0]["onion-knight"].jobStatSpeed,
        Defense: jobs[0]["onion-knight"].jobStatDefense,
    };
    const jobOrbs = {
        Set1: [jobs[0]["onion-knight"].jobOrbSet1]
    };
    const jobMpRole = jobs[0]["onion-knight"].jobMpRole;
    const jobUrlIcon = jobs[0]["onion-knight"].jobUrlIcon;

    const newJob = new Job({
      jobId,
      jobQueryString,
      jobType,
      jobName,
      jobStat,
      jobOrbs,
      jobMpRole,
      jobUrlIcon
    });

    // save to db
    newJob.save()
      .then(() => res.json('Job added!'))
      .catch(err => res.status(400).json('Error: ' + err));
});

/**
 * Jobs endpoint
 * Query for specific job names
 */
app.get('/beta/jobs', (req, res) => {
  const { query: { name } } = req; // name specific query

  if (name) {
    return res.status(200).json(jobs[0][name] || {});
  }
  
  return res.status(200).json(jobs[0] || {});
});

/**
 * Jobs endpoint
 * Query for specific job names given a type
 * Valid types: [Warrior, Mage, Ranger, Monk, Sarah, Meia, Graff, Sophie, Skin, Legend, Ex]
 */
app.get('/beta/jobs/type', (req, res) => {
  const { query: { type } } = req; // type specific query
  let jobsOfType = {};

  if (!type) {
    let err = new Error("input valid query string");
    const { message } = err;
    return res.status(err.status || 500).json({ message });
  }

  for(job in jobs[0]) { 
    if(jobs[0][job].jobType === type) {
      jobsOfType[job] = jobs[0][job];
    }  

    if (type === "Skin" && jobs[0][job].hasOwnProperty('jobIsSkin') 
        || type === "Legend" && jobs[0][job].hasOwnProperty('jobIsLegend')
        || type === "Ex" && jobs[0][job].hasOwnProperty('jobIsEx')) {
          jobsOfType[job] = jobs[0][job];
    }
  }

  return res.status(200).json(jobsOfType || {});
});

/**
 * Jobs endpoint
 * Returns list of job keys
 */
app.get('/beta/jobs/keys', (_, res) => {
  return res.status(200).json(Object.keys(jobs[0]));
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
