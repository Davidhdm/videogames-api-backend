const Game = require('../models/Game')

module.exports = (request, response, next) => {
  const { id } = request.params

  Game.findByIdAndDelete(id)
    .then(response.status(204).end())
    .catch(error => next(error))
}