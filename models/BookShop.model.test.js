const mongoose = require('mongoose');
const supertest = require('supertest')
const bookShopModel = require('./BookShop.model');
const app = require('../app');

beforeAll(async(done) => {
    const url = 'mongodb://127.0.0.1/Store'
    await mongoose.connect(url, { useNewUrlParser: true })
    done()
})

describe('POST /bookShop', async () => {
    let res, numShopsBefore, numShopsAfter, createdBookShop
    beforeAll( async (done) => {
     const bookShopsBefore = await bookShopModel.find({})
     numShopsBefore = bookShopsBefore.length
     res = await supertest(app).post('/bookShop').send({
            name: 'Carturesti',
            books: [
                { 
                    name: ' HARRY POTTER AND THE DEATHLY HALLOWS',
                    author: 'J.K. ROWLING',
                    type: 'fantasy',
                    publicationDate: 2010,
                    raiting: 4.74 
                },
                {
                    name: 'Think and grow rich',
                    author: 'Marc Paffalo',
                    type: 'personal developed',
                    publicationDate: 1987,
                    raiting: 5
                }
            ]
        })
        numShopsAfter = bookShopModel.find({})
        done()
    })
    
    describe('Create a new BookShop with books inside', () => {
        test('Respond with 201 when successful', () => {
            expect(res.status).toBe(201)
        })
        test('Sends back the created bookShop with the response body',() => {
            expect(res.body).toMatchObject({
                status: 'success',
                data: {
                    bookShop: {
                        name: 'Carturesti'
                    }
                }
            })

            createdBookShop = res.body.data.bookShop
        })
        test('Creates a bookShop that has an array of books ids', () => {
            expect(createdBookShop).toHaveProperty('books')
        })
        test('Has created a book for each of this associated book ids', async(done) => {
            createdBookShop.books.forEach(async (bookId) => {
                const bookFound = await BookShop.findById(bookId)
                expect(bookFound).toBeDefined();
            })
            done()
        })
    })
})