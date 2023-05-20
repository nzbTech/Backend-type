const models = require("../models/models")

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
    try {
        const orders = await models.Order.find()
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