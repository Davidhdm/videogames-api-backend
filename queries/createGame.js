const Game = require('../models/Game')

module.exports = (request, response, next) => {
  const game = request.body

  if(!game ||
    !game.title ||
    game.title === "" ||
    !game.img ||
    game.img === "") {

    return response.status(400).json({
      error: 'Game picture or title are missing.'
    })
  }

  const newGame = new Game({
    title: game.title,
    img: game.img,
    played: typeof game.played !== 'undefined' ? game.played : false,
    release_year: typeof game.release_year !== 'undefined' ? game.release_year : "Release year not specified",
    categories: typeof game.categories !== 'undefined' ? game.categories : "Categories not specified"
  })

  newGame.save().then(savedGame => {
    response.status(201).json(savedGame)
  }).catch(next)
}