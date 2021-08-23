const logger = (request, response, next) => {
  console.log('=======================')
  console.log('Method: ' + request.method)
  console.log('Path: ' + request.path)
  console.log(request.body)
  console.log('=======================')
  next()
}

module.exports = logger
