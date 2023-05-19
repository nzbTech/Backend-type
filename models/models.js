const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    email: { type: String},
    name: { type: String},
    firstname: { type: String},
    password: { type: String},
    isAdmin: {type: Boolean}
})

const productSchema = mongoose.Schema({
    name: { type: String},
    price: { type: Number},
    category: { 
        type: String,
        enum: ['Choix 1', 'Choix 2', 'Choix 3']
    }
})

module.exports = {
    User: mongoose.model('User', userSchema),
    Product: mongoose.model('Product', productSchema),
}