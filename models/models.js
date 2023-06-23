const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
    {
        email: { type: String },
        name: { type: String },
        firstname: { type: String },
        password: { type: String },
        address: {
            line: { type: String },
            zip_code: { type: String },
            city: { type: String },
            country: { type: String }
        },
        isAdmin: {type: Boolean },
        resetToken: { type: String },
        resetTokenExpiration: { type: Date }
    },
    { timestamps: true }
)

const productSchema = mongoose.Schema(
    {
        name: { type: String },
        price: { type: Number },
        picture: { type: String },
        category: { type: String }
        // category: { 
        //     type: String,
        //     enum: ['Choix 1', 'Choix 2', 'Choix 3']
        // },
    },
    { timestamps: true }
)

const orderSchema = mongoose.Schema(
    {
        products: [productSchema],
        total: { type: Number },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        },
    },
    { timestamps: true }
)

orderSchema.set('toJSON', {
    transform: function (doc, ret) {
      ret.products.forEach((product) => {
        delete product.createdAt
        delete product.updatedAt
        delete product._id
      })
    },
})

const promoSchema = mongoose.Schema(
    {
        name: { type: String },
        percentage: { type: Number },
        creator: { type: String },
        used: { type: Number },
    },
    { timestamps: true }
)

module.exports = {
    User: mongoose.model('User', userSchema),
    Product: mongoose.model('Product', productSchema),
    Order: mongoose.model('Order', orderSchema),
    Promo: mongoose.model('Promo', promoSchema)
}