const Game = require('../models/Game')

module.exports = (request, response, next) => {
  const game = request.body
  const { id } = request.params

  if(game.title === '' ||
    game.title === null ||
    game.img === '' ||
    game.img === null) {

    return response.status(400).json({
      error: 'Game picture or title are missing.'
    })
  }

  const editedGame = {
    title: game.title,
    img: game.img,
    played: game.played,
    release_year: game.release_year,
    categories: game.categories
  }
  Game.findByIdAndUpdate(id, editedGame, { new: true })
    .then(result => {
      response.status(200).json(result)
    }).catch(next)
}