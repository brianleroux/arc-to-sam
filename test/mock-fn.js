exports.handler = function handler(event. context, callback) {
  JSON.stringify(Object.assign({}, event, context), null, 2)
  callback()
}
