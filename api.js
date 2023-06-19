const express = require('express')
const router = express.Router()
const auth = require("./middleware/auth")
const { isAdmin } = require("./middleware/isAdmin")

const homeControllers = require('./controllers/homeControllers')
const userControllers = require('./controllers/userControllers')
const productControllers = require('./controllers/productControllers')
const orderControllers = require('./controllers/orderControllers')
const promoControllers = require('./controllers/promoControllers')


/// ROUTES ///

// start //
router.get('/home', homeControllers.getHome)

// // users //
router.post('/user/signup', userControllers.signup)
router.post('/user/login', userControllers.login)
router.delete('/user/delete/:id', auth, userControllers.deleteUser)
router.patch('/user/update/:id', auth, userControllers.updateUser)
router.get('/user/:id', auth, userControllers.getUser)
router.post('/user/reset-password', userControllers.resetPassword)
router.post('/user/reset-password/:id', userControllers.resetPasswordId)

// products //
router.post('/products/create', auth, isAdmin, productControllers.createProduct)
router.patch('/products/update/:id', auth, isAdmin, productControllers.updateProduct)
router.delete('/products/delete/:id', auth, isAdmin, productControllers.deleteProduct)
router.get('/products', productControllers.getAllProducts)
router.get('/products/:id', productControllers.getOneProduct)
router.post('/check-products', productControllers.checkProducts)

// orders //
router.post('/orders/create', auth, orderControllers.createOrder)
router.post('/orders/checkout/:id', auth, orderControllers.validOrder)
router.patch('/orders/update/:id', auth, isAdmin, orderControllers.updateOrder)
router.delete('/orders/delete/:id', auth, isAdmin, orderControllers.deleteOrder)
router.get('/orders', auth, orderControllers.getAllOrder)
router.get('/orders/:id', auth, orderControllers.getOneOrder)

// PROMO //
router.post('/promo/create', auth, isAdmin, promoControllers.createPromo)
router.patch('/promo/update/:id', auth, isAdmin, promoControllers.updatePromo)
router.delete('/promo/delete/:id', auth, isAdmin, promoControllers.deletePromo)
router.get('/promos', promoControllers.getAllPromos)
router.get('/promo/:id', promoControllers.getOnePromo)
router.post('/check-promo', promoControllers.checkPromo)

// STRIPE //
router.post('/create-payment-intent', orderControllers.createPaymentIntents)
router.post('/webhook', orderControllers.stripeWebHook)

module.exports = router
