const express = require('express')
const router = express.Router()
const auth = require("./middleware/auth")
const { isAdmin } = require("./middleware/isAdmin")

const homeControllers = require('./controllers/homeControllers')
const userControllers = require('./controllers/userControllers')
const productControllers = require('./controllers/productControllers')
const orderControllers = require('./controllers/orderControllers')


/// ROUTES ///

// start //
router.get('/home', homeControllers.getHome)

// // users //
router.post('/user/signup', userControllers.signup)
router.post('/user/login', userControllers.login)
router.delete('/user/delete/:id', auth, userControllers.deleteUser)
router.patch('/user/update/:id', auth, userControllers.updateUser)
router.get('/user/:id', auth, userControllers.getUser)

// products //
router.post('/products/create', auth, isAdmin, productControllers.createProduct)
router.patch('/products/update/:id', auth, isAdmin, productControllers.updateProduct)
router.delete('/products/delete/:id', auth, isAdmin, productControllers.deleteProduct)
router.get('/products', auth, productControllers.getAllProducts)
router.get('/products/:id', auth, productControllers.getOneProduct)

// orders //
router.post('/orders/create', auth, orderControllers.createOrder)
router.post('/orders/checkout/:id', auth, orderControllers.validOrder)
router.patch('/orders/update/:id', auth, isAdmin, orderControllers.updateOrder)
router.delete('/orders/delete/:id', auth, isAdmin, orderControllers.deleteOrder)
router.get('/orders', auth, orderControllers.getAllOrder)
router.get('/orders/:id', auth, orderControllers.getOneOrder)

// STRIPE //
router.post('/create-payment-intent', orderControllers.createPaymentIntents)
router.post('/webhook', orderControllers.stripeWebHook)

module.exports = router
