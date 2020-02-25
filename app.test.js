const supertest = require('supertest');
const app = require('./app');
const database = require('./database');

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
            console.log(database, 'database')
            res = await supertest(app).delete(`/books/${idToDelete}`)
            expect(res.status).toBe(200);
            expect(res.body).toMatchObject({
                status: 'success',
                message: `Deleted ${idToDelete}`
            })
        })
        test('Lesson has been removed', () => {
            expect(database.books).not.toHaveProperty(idToDelete)
        })
        test('Only that specific lesson has been deleted', () => {
            expect(Object.keys(database.books)).toHaveLength(1)
            expect(database.books).toHaveProperty('bs23')
        })
    })
})
 
