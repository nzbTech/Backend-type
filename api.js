const express = require('express')
const router = express.Router()
const auth = require("./middleware/auth")

const homeControllers = require('./controllers/homeControllers')
const userControllers = require('./controllers/userControllers')
const productControllers = require('./controllers/productControllers')
// const orderControllers = require('./controllers/orderControllers')



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
router.post('/products/create', auth, productControllers.createProduct)
router.patch('/products/update/:id', auth, productControllers.updateProduct)
router.delete('/products/delete/:id', auth, productControllers.deleteProduct)
router.get('/products', auth, productControllers.getAllProducts)
router.get('/products/:id', auth, productControllers.getOneProduct)

// orders //
// router.use('/orders', orderRoutes)



module.exports = router
