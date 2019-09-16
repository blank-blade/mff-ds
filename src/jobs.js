const { Router } = require('express');

const { MongoClient } = require('mongodb');
const { ATLAS_URI: uri } = process.env;

const { makeAPIError, hasQueryParams  } = require('./utils')

const router = Router()

/**
 * Jobs endpoint
 * Query for specific job names
 */
router.get('/', async (req, res, next) => {
  const { query: { name } } = req; // name specific query
  let client;

  try {
    client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    const db = client.db('mff-db')
    const coll = db.collection('jobs')

    if (name) {
      const job = await coll.findOne({ jobQueryString: name })

      if (!job) {
        return next(makeAPIError(`Job ${name} not found`, 404))
      }

      return res.status(200).json(job)
    }

    const jobs = await coll.find().toArray()
    return res.status(200).json(jobs)
  } catch (e) {
    return next(e)
  } finally {
    client.close()
  }
});

/**
 * Jobs endpoint
 * Query for specific job names given a type
 * Valid types: [Warrior, Mage, Ranger, Monk, Sarah, Meia, Graff, Sophie, Skin, Legend, Ex]
 */
router.get('/type', hasQueryParams('type'), async (req, res, next) => {
  const { query: { type } } = req; // type specific query
  let client;

  try {
    client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    const db = client.db('mff-db')
    const coll = db.collection('jobs')

    if (['Skin', 'Legend', 'Ex'].includes(type)) {
      const jobs = await coll.find({ [`jobIs${type}`]: { '$exists': true } }).toArray()
      return res.status(200).json(jobs)
    }

    const jobs = await coll.find({ jobType: type }).toArray()
    return res.status(200).json(jobs)
  } catch (e) {
    return next(e)
  } finally {
    client.close()
  }
});

/**
 * Jobs endpoint
 * Returns list of queryable jobs
 */
router.get('/keys', async (_, res, next) => {
  let client;

  try {
    client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    const db = client.db('mff-db')
    const coll = db.collection('jobs')

    const keys = await coll.distinct('jobQueryString')
    return res.status(200).json(keys)
  } catch (e) {
    return next(e)
  } finally {
    client.close()
  }
});

module.exports = router
