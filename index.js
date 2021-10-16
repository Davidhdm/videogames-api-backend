require('dotenv').config()
require('./mongo')

const express = require('express')
const cors = require('cors')
const app = express()
const logger = require('./loggerMiddleware')
const Game = require('./models/Game')
const notFound = require('./notFound')
const handleErrors = require('./handleErrors')
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");
const { Mongoose } = require('mongoose')

app.use(cors())
app.use(express.json())
app.use(logger)
app.use('images', express.static('img'))

Sentry.init({
  dsn: "https://266ea4a748034fe5a931c4b701065c86@o1040610.ingest.sentry.io/6009661",
  tracesSampleRate: 1.0,
});

app.get('/', (request, response) => {
  response.send('<h1>Home Page</h1><a href="/api/games">List of games</a>')
})

app.get('/api/games', (request, response, next) => {
  Game.find().then(games => {
    response.json(games)
  }).catch(next)
})

app.get('/api/games/:id', (request, response, next) => {
  const { id } = request.params

  Game.findById(id).then(game => {
    if (game) {
      return response.json(game)
    } else {
      response.status(404).end()
    }
  }).catch(next)
})

app.delete('/api/games/:id', (request, response, next) => {
  const { id } = request.params

  Game.findByIdAndDelete(id)
    .then(response.status(204).end())
    .catch(error => next(error))
})

app.post('/api/games', (request, response, next) => {
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
})

app.patch('/api/games/:id', (request, response, next) => {
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
})

app.use(notFound)
app.use(Sentry.Handlers.errorHandler())
app.use(handleErrors)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log((`Server running on http://localhost:${PORT}`))
})