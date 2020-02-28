const mongoose = require('mongoose');

const bookShopSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
    },
    books: [mongoose.Schema.Types.ObjectId]
})

const bookShopModel = mongoose.model('BookShop', bookShopSchema)

module.exports = bookShopModel;