const models = require("../models/models")

// CREATE PROMO //
exports.createPromo = async (req, res, next) => {
    if (req.body.title === "" || req.body.content === "")
        return res.status(400).json({ error: 'Merci de remplir tous les champs.' })
    try {
        const Promo = await models.Promo.create({
            name: req.body.name,
            percentage: req.body.percentage,
            creator: req.body.creator
        })
        return res.status(200).json(Promo)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

// UPDATE PROMO //
exports.updatePromo = async (req, res, next) => {
    try {
        const { id } = req.params
        if (Object.keys(req.body).length === 0)
            return res.status(400).json({ error: 'Aucune donnée de mise à jour fournie.' })

        const updatedPromo = await models.Promo.findOneAndUpdate(
            { _id: id },
            { $set: req.body },
            { new: true }
        )
  
        if (updatedPromo.nModified === 0)
            return res.status(404).json({ error: 'Promo introuvable ou aucune modification apportée.' })
  
        return res.status(200).json(updatedPromo)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

// DELETE PROMO //
exports.deletePromo = async (req, res, next) => {
    try {
        const { id } = req.params
        const deletedPromo = await models.Promo.findOneAndDelete({ _id: id })
  
        if (!deletedPromo)
            return res.status(404).json({ error: 'Promo introuvable.' })

        return res.status(200).json({ message: 'Promo supprimé avec succès.' })
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

// GET ALL PROMOS //
exports.getAllPromos = async (req, res, next) => {
    try {
        const Promos = await models.Promo.find()
        return res.status(200).json(Promos)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}
  
// GET ONE PROMO //
exports.getOnePromo = async (req, res, next) => {
    try {
        const Promo = await models.Promo.findOne({ _id: req.params.id })
        return res.status(200).json(Promo)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

// CHECK PROMO //
exports.checkPromo = async (req, res, next) => {
    try {
        const Promo = await models.Promo.findOne({ name: req.body.name })
        return res.status(200).json(Promo)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}