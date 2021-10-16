const { Schema, model } = require('mongoose')

const gameSchema = new Schema({
  title: String,
  img: String,
  played: String,
  release_year: Number,
  categories: String
})

gameSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Game = model('Game', gameSchema)

module.exports = Game