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

/* Game.find()
  .then(result => {
    console.log(result)
    mongoose.connection.close()
  }).catch(err => {
    console.error(err)
  }) */

/* const game = new Game({
  title: 'test game',
  img: 'http://www.asdf.com/image.png',
  played: 'Not played',
  release_year: 2020,
  categories: 'None'
})

game.save()
  .then(result => {
    console.log(result)
    mongoose.connection.close()
  }).catch(err => {
    console.error(err)
  }) */

module.exports = Game