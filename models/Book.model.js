const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    name: String,
    author: String,
    type: String,
    publicationDate: Number,
    raiting: Number,
})

// we are declaring an instance of trhe model
const BookModel = mongoose.model('Book', bookSchema)

module.exports = BookModel;