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
          CodeUri: 's3://uhm1/mock-fn.js.zip',
        }
      },
      Resources: {
        LambdaExecutionRole: {
          Type: "AWS::IAM::Role",
          Properties: {
            ManagedPolicyArns: ["arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"],
            AssumeRolePolicyDocument: {
              Version: "2012-10-17",
              Statement: [{
                Effect: "Allow",
                Principal: { "Service": ["lambda.amazonaws.com"] },
                Action: ["sts:AssumeRole"]
              }]
            },
          },
        },
      }, 
    }

    // loop thru doing everything for each env
    ;['staging', 'production'].forEach(env=> {

      // setup text/html routes in api gateway
      if (arc.html) {
        
        // setup the RestApi itself
        var apiName = pascal(`${app}-${env}`)
        sam.Resources[apiName] = {
          Type: 'AWS::Serverless::Api',
          DependsOn: arc.html.map(route=> _getRouteName({app, env, route})),
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
        // add permissions
        sam.Resources[apiName].LambdaPermission = {
          "Type": "AWS::Lambda::Permission",
          "Properties": {
            "Action": "lambda:invokeFunction",
            "FunctionName": {"Fn::GetAtt": ["GreetingLambda", "Arn"]},
            "Principal": "apigateway.amazonaws.com",
            "SourceArn": {
              "Fn::Join": ["", ["arn:aws:execute-api:", {"Ref": "AWS::Region"}, ":", {"Ref": "AWS::AccountId"}, ":", {"Ref": apiName}, "/*"]]
            }
          }
        },
        // add paths
        arc.html.forEach(route=> {
          var pathsRoot = sam.Resources[apiName].Properties.DefinitionBody.paths 
          Object.assign(pathsRoot, _getSwagger({route, env, app}))
        })

        // creates text/html functions
        arc.html.forEach(route=> {
          var name = _getRouteName({app, env, route})
          sam.Resources[name] = {
            Type: 'AWS::Serverless::Function',
            Properties: {
              Events: {},
              Role: { "Fn::GetAtt": ["LambdaExecutionRole", "Arn"]},
            }
          }
          var method = route[0].toUpperCase()
          var path = route[1]
          sam.Resources[name].Properties.Events[name] = {
            Type: 'Api',
            Properties: {
              RestApiId: apiName, //`!Ref ${pascal(`${app}-${env}`)}`,
              Path: path,
              Method: method,
            }
          }
        })

      }


      // creates session tables
      // creates application/json functions
      // creates application/xml functions
      // creates slack endpoints
      // creates sns event functions
      // creates cloudwatch event functions
      // creates dynamo tables
      // creates dynamo indices
      // creates dynamo trigger functions

    // end env loop
    })
    // say it again sam 
    return sam
  }
}
