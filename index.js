require('dotenv').config()
require('./mongo')

const express = require('express')
const cors = require('cors')
const app = express()
const logger = require('./loggerMiddleware')
const notFound = require('./notFound')
const handleErrors = require('./handleErrors')
const Sentry = require("@sentry/node")
const Tracing = require("@sentry/tracing")

const getAllGames = require('./queries/getAllGames')
const getGameById = require('./queries/getGameById')
const createGame = require('./queries/createGame')
const editGame = require('./queries/editGame')
const deleteGame = require('./queries/deleteGame')

app.use(cors())
app.use(express.json())
app.use(logger)
app.use('images', express.static('img'))

Sentry.init({
  dsn: "https://266ea4a748034fe5a931c4b701065c86@o1040610.ingest.sentry.io/6009661",
  tracesSampleRate: 1.0,
})

app.get('/', (request, response) => {
  response.send('<h1>Home Page</h1><a href="/api/games">List of games</a>')
})
app.get('/api/games', getAllGames)
app.get('/api/games/:id', getGameById)
app.delete('/api/games/:id', deleteGame)
app.post('/api/games', createGame)
app.patch('/api/games/:id', editGame)

app.use(notFound)
app.use(Sentry.Handlers.errorHandler())
app.use(handleErrors)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log((`Server running on http://localhost:${PORT}`))
})