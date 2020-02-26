const supertest = require('supertest');
const mongoose = require('mongoose')
const app = require('./app');
const database = require('./database');
const Book = require('./models/books/Book.model')

beforeAll(async(done) => {
    const url = 'mongodb://127.0.0.1/Store'
    await mongoose.connect(url, { useNewUrlParser: true })
    done()
})

describe('GET /books', () => {
    let res

    beforeAll(async (done) => {
        res = await supertest(app).get('/books')
        done()
    })

    it('send a response with status code of 200', () => {
        expect(res.status).toBe(200)
    })
    it('send back a body which is formatted following JSend guidelines', () => {
        expect(res.body).toMatchObject({
            status: 'success'
          })      
    })
})

describe('POST /books', ()  => {
    describe('valid information', () => {
        let res, createdId;

        const createdBook = {
            name: 'Effective Java',
            author: 'Joshua Block',
            type: 'Java Book',
            publicationDate: 2003,
            raiting: 4.9,
        }
        beforeAll( async (done) => {
            const booksBefore = await Book.find({})
            const numOfBooks = booksBefore.length;

            res = await supertest(app).post('/books').send(createdBook)
            done()

        })

        test('the response is 201', () => {
            expect(res.status).toBe(201)
        })
        test('the response body sends back the created book', () => {
            expect(res.body).toMatchObject({
                status: 'success',
                data: {
                    createdBook
                }
            })
        })
        test('the created book has an id', () => {
            expect(res.body.data.createdBook).toHaveProperty('_id')
        })
        test('a book with that id now exists in the database', () => {
            const book = await Book.findById(createdId)
            expect(book).not.toBeNull()
        })
        // test('only one extra book exists in the database', () => {

        // })
    })
})

describe('DELETE /books/:id', () => {
    describe('valid id', () => {
        const idToDelete = 'as93'
        let res

        beforeAll(() => {
            database.books = {
                as93: 'Think and grow rich',
                bs23: 'Clean code'
            }
        })

        test('Some useful response sent back', async () => {
            res = await supertest(app).delete(`/books/${idToDelete}`)
            expect(res.status).toBe(200);
            expect(res.body).toMatchObject({
                status: 'success',
                message: `Deleted ${idToDelete}`
            })
        })
        test('Book has been removed', () => {
            expect(database.books).not.toHaveProperty(idToDelete)
        })
        test('Only that specific book has been deleted', () => {
            expect(Object.keys(database.books)).toHaveLength(1)
            expect(database.books).toHaveProperty('bs23')
        })
    })
})
 
