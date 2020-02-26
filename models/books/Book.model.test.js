const mongoose = require('mongoose');
const BookModel = require('./Book.model');

describe('BookModel', () => {
    beforeAll(async (done) => {
        const url = 'mongodb://127.0.0.1/Store'
        await mongoose.connect(url, { useNewUrlParser: true })
        done()
    })

    describe('basic operations', () => {
        beforeAll(async (done) => {
            await BookModel.deleteMany({})
            done()
        })
        test('creates a database entry', async (done) => {
            await BookModel.create({
                name: ' HARRY POTTER AND THE DEATHLY HALLOWS',
                author: 'J.K. ROWLING',
                type: 'fantasy',
                publicationDate: 1987,
                raiting: 4.74,
            })

            const allBooks = await BookModel.find({})
            expect(allBooks).toHaveLength(1)

            done()
        })
    })
})