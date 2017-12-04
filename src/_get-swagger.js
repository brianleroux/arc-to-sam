var assert = require('@smallwins/validate/assert')
var _getRes = require('./_get-swagger-res')
var _getAWS = require('./_get-swagger-aws')

module.exports = function _getSwagger(params) {
  assert(params, {
    route: Array,
    env: String,
    app: String,
  })
  var method = params.route[0].toLowerCase()
  var path = params.route[1]
  var fragment = {}
  fragment[path] = {}
  fragment[path][method] = {
    consumes: [
      "application/x-www-form-urlencoded",
      "text/html",
      "multipart/form-data"
    ],
    produces: ["text/html"],
    responses: _getRes(),
    "x-amazon-apigateway-integration": _getAWS(params),
  }
  return fragment
}
