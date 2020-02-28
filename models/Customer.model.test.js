const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Customer = require('./Customer.model');

beforeAll(async () => {
    const url = 'mongodb://127.0.0.1/Store'
    await mongoose.connect(url, { useNewUrlParser: true })
})

describe('Password storage', () => {
    let customer 

    beforeAll( async (done) => {
        customer = await Customer.create({ username: 'Syeda', email:'hhgds@domain.com', password: 'babyYoda' })
        done()
    })
    test('does not store the plain text password', () => {
        expect(customer.password).not.toBeUndefined()
        expect(customer.password).not.toBe('babyYoda')
    })
    test('specifically stores an encrypted version of the plaintext password', async(done) => {
        const isMatched = await bcrypt.compare('babyYoda', customer.password)
        expect(isMatched).toBeTruthy()
        done()
    })
})

describe('Validation', () => {
    describe('Emails validation', () => {
        describe('Email to reject', () => {
            test('hello', async (done) => {
                await Customer.create({email: 'hello', password: '123456'}, (err) => {
                    expect(err).not.toBeNull()
                    done()
                })
            })
            test('hello@', async (done) => {
                await Customer.create({email: 'hello@', password: '123456'}, (err) => {
                    expect(err).not.toBeNull()
                    done()
                })
            })
        })
        describe('Emails to accept', () => {
            test('hello@domain.com', async (done) => {
                await Customer.create({email: 'hello@domain.com', password: '123456'}, (err) => {
                    expect(err).toBeNull()
                    done()
                })
            })
            test('hello@domain.co.uk', async (done) => {
                await Customer.create({email: 'hello@domain.co.uk', password: '123456'}, (err) => {
                    expect(err).toBeNull()
                    done()
                })
            })
        })
    })
})