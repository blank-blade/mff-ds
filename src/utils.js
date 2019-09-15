const makeAPIError = (msg, status = 500) => {
  const err = new Error(msg)
  err.status = status
  return err
}
module.exports.makeAPIError = makeAPIError

const _hasParams = target => (...params) => (req, res, next) => {
  for (const param of params) {
    if (!req[target][param]) {
      return next(makeAPIError(`Missing '${param}' in ${target}`, 400))
    }
  }
  return next()
}
module.exports.hasQueryParams = _hasParams('query')
module.exports.hasBodyParams = _hasParams('body')
