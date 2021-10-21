const Game = require('../models/Game')

module.exports = (request, response, next) => {
  Game.find().then(games => {
    response.json(games)
  }).catch(next)
}