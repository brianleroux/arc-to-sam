var fs = require('fs')
var pascal = require('just-pascal-case')
var assert = require('@smallwins/validate/assert')
var parse = require('@architect/parser')
var _getRouteName = require('./src/_get-route-name')
var _getEventName = require('./src/_get-event-name')
var _getSwagger = require('./src/_get-swagger')

module.exports = function arcToSAM(params) {
  assert(params, {
    pathToArc: String,
  })
  if (!fs.existsSync(params.pathToArc)) {
    throw ReferenceError('.arc file not found')   
  }
  else {

    var str = fs.readFileSync(params.pathToArc).toString()
    var arc = parse(str) 
    var app = arc.app[0]

    var sam = {
      AWSTemplateFormatVersion: '2010-09-09',
      Transform: 'AWS::Serverless-2016-10-31',
      Globals: {
        Function: {
          Runtime: 'nodejs6.10',
          Handler: 'index.handler',
          CodeUri: 's3://uhm1/mock-fn.js.zip'
        }
      },
      Resources: {}, 
    }

    // loop thru doing everything for each env
    ;['staging', 'production'].forEach(env=> {

      // creates text/html functions
      arc.html.forEach(route=> {
        var name = _getRouteName({app, env, route})
        sam.Resources[name] = {
          Type: 'AWS::Serverless::Function',
          Properties: {
            Events: {}
          }
        }
        var method = route[0].toUpperCase()
        var path = route[1]
        sam.Resources[name].Properties.Events[name] = {
          Type: 'Api',
          Properties: {
            RestApiId: `!Ref ${pascal(`${app}-${env}`)}`,
            Path: path,
            Method: method,
          }
        }
      })

      // creates session tables
      // creates application/json functions
      // creates application/xml functions
      // creates slack endpoints
      // creates sns event functions
      // creates cloudwatch event functions
      // creates dynamo tables
      // creates dynamo indices
      // creates dynamo trigger functions

      // setup text/html routes in api gateway
      if (arc.html) {
        sam.Resources[pascal(`${app}-${env}`)] = {
          Type: 'AWS::Serverless::Api',
          Properties: {
            StageName: env,
            DefinitionBody: {
              swagger: '2.0',
              info: {
                title: {
                  Ref: 'AWS::StackName'
                }
              },
              paths: {}
            }
          }
        }
        // add paths
        arc.html.forEach(route=> {
          var pathsRoot = sam.Resources[pascal(`${app}-${env}`)].Properties.DefinitionBody.paths 
          Object.assign(pathsRoot, _getSwagger({route, env, app}))
        })
      }

    // end env loop
    })
    // say it again sam 
    return sam
  }
}
