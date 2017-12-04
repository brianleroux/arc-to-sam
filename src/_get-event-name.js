/**
 * returns a lambda name from
 * - app (the app namespace)
 * - env (either staging or production)
 * - event (an event name)
 */
module.exports = function _getEventName(params) {
  var {app, env, event} = params
  return `${app}-${env}-${event}`
}

