const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const models = require("../models/models")

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!.@#$%^&*])(?=.{8,})/


// SIGNUP //
exports.signup = async (req, res, next) => {
    try {
        if (Object.values(req.body).some(value => !value))
            return res.status(400).json({ error: 'Merci de remplir tous les champs.' })
  
        if (!EMAIL_REGEX.test(req.body.email))
            return res.status(400).json({ error: 'Email incorrect.' })
  
        let user = await models.User.findOne({ email: req.body.email })
        if (user)
            return res.status(400).json({ error: 'Adresse email déjà existante.' })
  
        if (!PASSWORD_REGEX.test(req.body.password))
            return res.status(401).json({ error: 'Minimum: 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère (!.@#$%^&*)' })

        const hash = await bcrypt.hash(req.body.password, 10)
        let newUser = await models.User.create({
            email: req.body.email,
            name: req.body.name,
            firstname: req.body.firstname,
            password: hash,
            isAdmin: false
        })

        return res.status(201).json(newUser)
    } catch (error) {
        return res.status(400).json({ error: 'Utilisateur non créé.' })
    }
}

// LOGIN //
exports.login = async (req, res, next) => {
    try {
        if (req.body.email == null || req.body.password == null)
            return res.status(400).json({ error: 'Merci de remplir tous les champs.' })
  
        const user = await models.User.findOne({ email: req.body.email })
        if (!user)
            return res.status(404).json({ error: 'Adresse mail ou mot de passe incorrect.' })
  
        const valid = await bcrypt.compare(req.body.password, user.password)
        if (!valid)
            return res.status(401).json({ error: 'Adresse mail ou mot de passe incorrect.' })
  
        return res.status(200).json({
            userId: user.id,
            name: user.name,
            firstname: user.firstname,
            token: jwt.sign({ userId: user.id, isAdmin: user.isAdmin }, process.env.TOKEN_SECRET, { expiresIn: '24h'})
        })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

// DELETE USER //
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await models.User.findOne({ _id: req.params.id })
        if (!user)
            return res.status(404).json({ error: 'Utilisateur introuvable.' })

        await models.User.deleteOne({ _id: req.params.id })

        return res.status(200).json({ message: 'Utilisateur supprimé.' })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

// UPDATE USER //
exports.updateUser = async (req, res, next) => {
    try {
        let user = await models.User.findOne({ _id: req.params.id })
        if (!user)
            return res.status(404).json({ error: 'Utilisateur introuvable.' })

        let updates = req.body
        
        // Update email if it exists in the request and it is different from the current email
        if (updates.email && updates.email !== user.email) {
            if (!EMAIL_REGEX.test(updates.email))
                return res.status(400).json({ error: 'Email incorrect.' })
            
            let emailExists = await models.User.findOne({ email: updates.email })
            if (emailExists)
                return res.status(400).json({ error: 'Adresse email déjà existante.' })
        }
        
        // Update password if it exists in the request
        if (updates.password) {
            if (!PASSWORD_REGEX.test(updates.password))
                return res.status(401).json({ error: 'Minimum: 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère (!.@#$%^&*)' })
            
            updates.password = await bcrypt.hash(updates.password, 10)
        }

        const updatedProduct = await models.User.findByIdAndUpdate(req.params.id, updates, { new: true })

        return res.status(200).json(updatedProduct)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

// GET USER //
exports.getUser = async (req, res, next) => {
    try {
        const user = await models.User.findOne({ _id: req.params.id })
        if (!user)
            return res.status(404).json({ error: 'Utilisateur introuvable.' })

        let userResponse = { 
            id: user.id, 
            email: user.email,
            name: user.name,
            firstname: user.firstname,
            isAdmin: user.isAdmin
        }
        
        return res.status(200).json(userResponse)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}