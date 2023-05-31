const models = require("../models/models")
const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripe = require('stripe')(stripeSecretKey)

// CREATE ORDER //
exports.createOrder = async (req, res, next) => {
    if (req.body.user === "" || req.body.products.length === 0)
        return res.status(400).json({ error: 'Merci de remplir tous les champs.' })

    try {
        const order = await models.Order.create({
            user: req.body.user,
            products: req.body.products,
            total: req.body.total
        })

        return res.status(200).json(order)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

// UPDATE ORDER //
exports.updateOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (Object.keys(req.body).length === 0)
            return res.status(400).json({ error: 'Aucune donnée de mise à jour fournie.' })

        const updatedOrder = await models.Order.findOneAndUpdate(
            { _id: id },
            { $set: req.body },
            { new: true }
        )

        if (updatedOrder.nModified === 0)
            return res.status(404).json({ error: 'Commande introuvable ou aucune modification apportée.' })

        return res.status(200).json(updatedOrder)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

// DELETE ORDER //
exports.deleteOrder = async (req, res, next) => {
    try {
        const { id } = req.params
        const deletedOrder = await models.Order.findOneAndDelete({ _id: id })

        if (!deletedOrder)
            return res.status(404).json({ error: 'Commande introuvable.' })

        return res.status(200).json({ message: 'Commande supprimée avec succès.' })
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

// GET ALL ORDERS //
exports.getAllOrder = async (req, res, next) => {
    const User = req.user
    let query = {}
    if (!User.isAdmin) {
        query.user = User.id
    }
    try {
        const orders = await models.Order.find(query)
        return res.status(200).json(orders)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

// GET ONE ORDER //
exports.getOneOrder = async (req, res, next) => {
    try {
        const order = await models.Order.findOne({ _id: req.params.id })
        return res.status(200).json(order)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}



// const createUser = async (email, name) => {
//     try {
//       // Vérifier si l'utilisateur existe déjà dans Stripe
//       let customer = await stripe.customers.list({ email: email, limit: 1 })
//       if (customer.data.length > 0) {
//         return customer.data[0]
//       } else {
//         customer = await stripe.customers.create({
//             email: email,
//             name: name
//           })
//         return customer
//       }
//     } catch (error) {
//       throw error
//     }
// }

// VALID ORDER //
exports.validOrder = async (req, res, next) => {
    const User = req.user
    // let customer = await createUser(User.email, User.name)

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: 50,
            currency: "eur",
            automatic_payment_methods: {
              enabled: true,
            },
        })
        console.log('paiement ==>', paymentIntent.id)
        return res.status(200).json({ clientSecret: paymentIntent.client_secret })
    } catch (error) {
        console.error(error)
        return res.status(500).send('Erreur lors du traitement du paiement.');
    }
}

exports.createPaymentIntents = async (req, res, next) => {
    try {
        const { items, currency } = req.body;
        const paymentIntent = await stripe.paymentIntents.create({
            amount: 50,
            currency: 'EUR',
        })
        console.log(' paymentIntent.client_secret ==>',  paymentIntent.client_secret)
        return res.status(200).json(paymentIntent)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

exports.stripeWebHook = async (req, res, next) => {
    let event;

    try {
        event = stripe.webhooks.constructEvent(request.body, request.headers['stripe-signature'], YOUR_STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object
            console.log('PaymentIntent was successful!')
            break
        case 'payment_intent.payment_failed':
            const paymentMethod = event.data.object
            console.log('PaymentIntent was failed!')
            break
        default:
            return response.status(400).end()
    }

    // Return a response to acknowledge receipt of the event
    response.json({received: true})
}














    // // A FAIRE EN FRONT //
    // const cardElement = {
    //     type: 'card',
    //     card: {
    //       number: '4242424242424242',
    //       exp_month: 12,
    //       exp_year: 24,
    //       cvc: '123'
    //     }
    // }
    // let paymentMethod = null
    // try {
    //     paymentMethod = await stripe.paymentMethods.create({
    //         type: 'card',
    //         card: cardElement.card
    //     })
    //     return res.status(200).json(paymentMethod)
    // } catch (error) {
    //     return res.status(400).json({ error: error.message })
    // }
    // console.log('paymentMethod.id ==>', paymentMethod.id)
    // // A FAIRE EN FRONT //
