var pascal = require('just-pascal-case')

/**
 * returns a lambda name from
 * - app (the app namespace)
 * - env (either staging or production)
 * - route (an array of [METHOD, PATH]
 */
module.exports = function _getRouteName(params) {
  var {app, env, route} = params
  var _removeTrailingSlash = str=> str.replace(/\/$/, '')
  var method = route[0]
  var path
  var isIndex = route[1] === '/'
  if (isIndex) {
    path = '-index'
  }
  else {
    path = _removeTrailingSlash(route[1]).replace(/\//g, '-').replace(/:/g, '000')
  }
  return pascal(`${app}-${env}-${method}${path}`)
}


