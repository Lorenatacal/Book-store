const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()

const CustomerSchema = new mongoose.Schema({
    username: String,
    email: {
        type: String,
        required: true,
        validate: {
            validator: function() {
                return validator.default.isEmail(this.email)
            }
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 6,
        maxlength: 30
    }
})

CustomerSchema.methods.generateAuthToken = function () {
    return jwt.sign(this.id, process.env.JWT_SECRET)
}

CustomerSchema.pre('save', async function() {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(this.password, salt)
    this.password = hashedPassword
})

const CustomerModel = mongoose.model('Customer', CustomerSchema)

module.exports = CustomerModel