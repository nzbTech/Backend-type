const models = require("../models/models")
const { getfilter } = require("../middleware/filtre")


// CREATE PRODUCT //
exports.createProduct = async (req, res, next) => {
    if (req.body.title === "" || req.body.content === "")
        return res.status(400).json({ error: 'Merci de remplir tous les champs.' })
    try {
        const product = await models.Product.create({
            name: req.body.name,
            price: req.body.price,
            category: req.body.category
        })
        return res.status(200).json(product)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

// UPDATE PRODUCT //
exports.updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params
        if (Object.keys(req.body).length === 0)
            return res.status(400).json({ error: 'Aucune donnée de mise à jour fournie.' })

        const updatedProduct = await models.Product.findOneAndUpdate(
            { _id: id },
            { $set: req.body },
            { new: true }
        )
  
        if (updatedProduct.nModified === 0)
            return res.status(404).json({ error: 'Produit introuvable ou aucune modification apportée.' })
  
        return res.status(200).json(updatedProduct)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

// DELETE PRODUCT //
exports.deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params
        const deletedProduct = await models.Product.findOneAndDelete({ _id: id })
  
        if (!deletedProduct)
            return res.status(404).json({ error: 'Produit introuvable.' })

        return res.status(200).json({ message: 'Produit supprimé avec succès.' })
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

// GET ALL PRODUCTS //
exports.getAllProducts = async (req, res, next) => {
    const { page, limit } = req.query
    // Obtenir les éléments filtrés dans la table
    const filtre = await getfilter(req, 'Product')  
    try {
        // Obtenir le nombre total d'éléments filtrés dans la table
        const totalItems = await models.Product.countDocuments(filtre)
        const totalPages = Math.ceil(totalItems / limit)
        
        // Récupérer les données filtrées et paginées
        const products = await models.Product.find(filtre)
          .skip((page - 1) * limit)
          .limit(limit)
    
        return res.status(200).json({ products, totalItems, totalPages })
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}
  
// GET ONE PRODUCT //
exports.getOneProduct = async (req, res, next) => {
    try {
        const product = await models.Product.findOne({ _id: req.params.id })
        return res.status(200).json(product)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}