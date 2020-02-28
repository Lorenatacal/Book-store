const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('./app');
const database = require('./database');
const Book = require('./models/Book.model')
const Customer = require('./models/Customer.model')

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

    test('send a response with status code of 200', () => {
        expect(res.status).toBe(200)
    })
    test('send back a body which is formatted following JSend guidelines', () => {
        expect(res.body).toMatchObject({
            status: 'success'
          })      
    })
})

describe('POST /books', ()  => {
    describe('valid information', () => {
        let res, createdId, numOfBooksBefore, numOfBooksAfter;

        const createdBook = {
            name: 'Effective Java',
            author: 'Joshua Block',
            type: 'Java Book',
            publicationDate: 2003,
            raiting: 4.9,
        }
        beforeAll( async (done) => {
            const booksBefore = await Book.find({})
            numOfBooksBefore = booksBefore.length;

            res = await supertest(app).post('/books').send(createdBook)

            const booksAfter = await Book.find({})
            numOfBooksAfter = booksAfter.length
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
            createdId = res.body.data.createdBook._id
        })
        test('a book with that id now exists in the database', async (done) => {
            const book = await Book.findById(createdId)
            expect(book).not.toBeNull()
            expect(book.id).toContain(createdId)
            done()
        })
        test('only one extra book exists in the database', () => {
            expect(numOfBooksAfter).toEqual(numOfBooksBefore + 1)
        })
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

describe('Post /signup', () => {
    let res

    beforeAll(async (done) => {
        res = await supertest(app).post('/signup').send({
            email: 'hello@domain.com',
            password: 'hjgdsdgah7836736vhgdcfdy36ere'
        })
        done()
    })
    test('sends a response with 201', () => {
        expect(res.status).toBe(201)
    })
    test('sends back an autorhisation token', () => {
        expect(typeof res.body.token).toBe('string')
    })
})

describe('protected route', () => {
    test('no token provided', async (done) => {
        const res = await supertest(app).get('/protected')
        expect(res.status).toBe(401)
        done()
    })
    test('valid token provided', async (done) => {
        const customer = await Customer.create({ email: 'data@hotmail.com', password: 'hgs6877' })
        const token = customer.generateAuthToken()

        const res = await supertest(app).get('/protected')
        .set('Authorization', `Bearer ${token}`)
        expect(res.status).toBe(200)
        done()
    })
})
 
