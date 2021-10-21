const Game = require('../models/Game')

module.exports = (request, response, next) => {
  const { id } = request.params

  Game.findById(id).then(game => {
    if (game) {
      return response.json(game)
    } else {
      response.status(404).end()
    }
  }).catch(next)
}