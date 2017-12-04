var assert = require('@smallwins/validate/assert')

module.exports = function _getSwaggerRes() {
  return {
    "200": {
      "description": "200 response",
      "headers": {
        "Set-Cookie": {
          "type": "string"
        },
        "Location": {
          "type": "string"
        },
        "Content-Type": {
          "type": "string"
        }
      }
    },
    "302": {
      "description": "302 response",
      "headers": {
        "Set-Cookie": {
          "type": "string"
        },
        "Location": {
          "type": "string"
        },
        "Content-Type": {
          "type": "string"
        }
      }
    },
    "403": {
      "description": "403 response",
      "headers": {
        "Set-Cookie": {
          "type": "string"
        },
        "Location": {
          "type": "string"
        },
        "Content-Type": {
          "type": "string"
        }
      }
    },
    "404": {
      "description": "404 response",
      "headers": {
        "Set-Cookie": {
          "type": "string"
        },
        "Location": {
          "type": "string"
        },
        "Content-Type": {
          "type": "string"
        }
      }
    },
    "500": {
      "description": "500 response",
      "headers": {
        "Set-Cookie": {
          "type": "string"
        },
        "Location": {
          "type": "string"
        },
        "Content-Type": {
          "type": "string"
        }
      }
    }
  }
}
