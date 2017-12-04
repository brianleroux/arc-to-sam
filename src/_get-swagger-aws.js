var assert = require('@smallwins/validate/assert')
var _getRouteName = require('./_get-route-name')
var fs = require('fs')
var path = require('path')

module.exports = function _getSwaggerAWS(params) {
  assert(params, {
    route: Array,
    env: String,
    app: String,
  })
  var name = _getRouteName(params)
  return {
    type: "aws",
    uri: 'Fn::Sub: arn:aws:apigateway:${AWS::Region}:lambda:path/2015-03-31/functions/${' + name + '.Arn}/invocations',
    passthroughBehavior: "when_no_match",
    httpMethod: "POST",
    requestTemplates: {
      "text/html": fs.readFileSync(path.join(__dirname, 'vtl', 'req-html.vtl')).toString(),
      "multipart/form-data": fs.readFileSync(path.join(__dirname, 'vtl', 'req-form.vtl')).toString(),
      "application/x-www-form-urlencoded": fs.readFileSync(path.join(__dirname, 'vtl', 'req-form.vtl')).toString()
    },
    responses: {
      "default": {
        "statusCode": "200",
        "responseParameters": {
          "method.response.header.Set-Cookie": "integration.response.body.cookie",
          "method.response.header.Content-Type": "'text/html; charset=utf-8'",
          "method.response.header.Location": "integration.response.body.errorMessage"
        },
        "responseTemplates": {
          "text/html": "$input.path('$.html')"
        }
      },
      ".*statusCode\\\":403.*": {
        "statusCode": "403",
        "responseParameters": {
          "method.response.header.Set-Cookie": "integration.response.body.cookie",
          "method.response.header.Content-Type": "'text/html; charset=utf-8'",
          "method.response.header.Location": "integration.response.body.errorMessage"
        },
        "responseTemplates": {
          "text/html": "#set ($errorMessageObj = $util.parseJson($input.path('$.errorMessage')))\n$errorMessageObj.html\n"
        }
      },
      "(.*statusCode\\\":302.*)|^(http|/.*)": {
        "statusCode": "302",
        "responseParameters": {
          "method.response.header.Set-Cookie": "integration.response.body.cookie",
          "method.response.header.Content-Type": "'text/html; charset=utf-8'",
          "method.response.header.Location": "integration.response.body.errorMessage"
        },
        "responseTemplates": {
          "text/html": "$input.path('$.errorMessage')"
        }
      },
      ".*statusCode\\\":404.*": {
        "statusCode": "404",
        "responseParameters": {
          "method.response.header.Set-Cookie": "integration.response.body.cookie",
          "method.response.header.Content-Type": "'text/html; charset=utf-8'",
          "method.response.header.Location": "integration.response.body.errorMessage"
        },
        "responseTemplates": {
          "text/html": "#set ($errorMessageObj = $util.parseJson($input.path('$.errorMessage')))\n$errorMessageObj.html\n"
        }
      },
      ".*statusCode\\\":500.*": {
        "statusCode": "500",
        "responseParameters": {
          "method.response.header.Set-Cookie": "integration.response.body.cookie",
          "method.response.header.Content-Type": "'text/html; charset=utf-8'",
          "method.response.header.Location": "integration.response.body.errorMessage"
        },
        "responseTemplates": {
          "text/html": "#set ($errorMessageObj = $util.parseJson($input.path('$.errorMessage')))\n$errorMessageObj.html\n"
        }
      }
    }
  }
}
