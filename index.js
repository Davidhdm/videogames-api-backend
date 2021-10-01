let games = require('./data/games.json').games
const express = require('express')
const cors = require('cors')
const app = express()
const logger = require('./loggerMiddleware')

app.use(cors())
app.use(express.json())
app.use(logger)

/* const taskList = [
  {
    "id": 1
  }
] */

/* const http = require('http');
const app = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/json' })
  response.end(JSON.stringify(tasks))
}); */

app.get('/', (request, response) => {
  response.send('<h1>Home Page</h1><a href="/api/games">List of games</a>')
})

app.get('/api/games', (request, response) => {
  response.json(games)
})

app.get('/api/games/:id', (request, response) => {
  const id = Number(request.params.id)
  const game = games.find(game => game.id === id)

  if (game) {
    response.json(game)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/games/:id', (request, response) => {
  const id = Number(request.params.id)
  games = games.filter(game => game.id !== id)
  response.status(204).end()
})

app.post('/api/games', (request, response) => {
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

  const ids = games.map(game => game.id)
  const maxId = Math.max(...ids)

  console.log('max id: ' + maxId)

  const newGame = {
    id: maxId + 1,
    title: game.title,
    img: game.img,
    played: typeof game.played !== 'undefined' ? game.played : false,
    release_year: typeof game.release_year !== 'undefined' ? game.release_year : "Release year not specified",
    categories: typeof game.categories !== 'undefined' ? game.categories : "Categories not specified"
  }

  games = games.concat(newGame)

  response.status(201).json(newGame)
})

app.patch('/api/games/:id', (request, response) => {
  const editedData = request.body
  const id = Number(request.params.id)

  if(editedData.title === '' ||
    editedData.title === null ||
    editedData.img === '' ||
    editedData.img === null) {

    return response.status(400).json({
      error: 'Game picture or title are missing.'
    })
  }

  games.forEach((game) => {
    if (game.id === id) {
      game.title = editedData.title || game.title
      game.img = editedData.img || game.img
      game.played = editedData.played || game.played
      game.release_year = editedData.release_year || game.release_year
      game.categories = editedData.categories || game.categories
    }
  })

  response.status(200).json(editedData)
})

app.use((request, response) => {
  console.log(request.path)
  response.status(404).json({
    error: 'Not Found'
  })
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log((`Server running on http://localhost:${PORT}`))
})
