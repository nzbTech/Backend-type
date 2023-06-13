const jwt = require("jsonwebtoken")
const nodemailer = require('nodemailer')
const bcrypt = require("bcrypt")
const models = require("../models/models")
const { userSchema } = require('../schemas/validationSchemas');

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
        
        userData = {
            userId: user.id,
            firstname: user.firstname,
            name: user.firstname,
            email: user.firstname,
            isAdmin: user.isAdmin,
        }
        console.log('userData =>', userData)
        return res.status(200).json({
            token: jwt.sign(userData , process.env.TOKEN_SECRET, { expiresIn: '24h'})
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

// GET USER //
exports.resetPassword = async (req, res, next) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'guillaumeleger430@gmail.com',
          pass: 'jlwxbwjskqwvnwey'
        }
    })
    const { email } = req.body

    try {
      const user = await  models.User.findOne({ email })
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé.' })
      }
      const resetToken = jwt.sign({ userId: user._id }, 'your_secret_key', { expiresIn: '1h' })
  
      user.resetToken = resetToken
      user.resetTokenExpiration = Date.now() + 3600000 // 1 heure
      await user.save()

      const mailOptions = {
        from: 'guillaumeleger430@gmail.com',
        to: email,
        subject: 'Réinitialisation du mot de passe',
        html: `
          <p>Veuillez cliquer sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
          <a href="http://localhost:8080/#/reset-password/${resetToken}">Réinitialiser le mot de passe</a>
        `
      }
  
      await transporter.sendMail(mailOptions)
      res.status(200).json({ message: 'Un e-mail de réinitialisation du mot de passe a été envoyé.' })
    } catch (error) {
      console.error('Une erreur est survenue lors de la réinitialisation du mot de passe:', error);
      res.status(500).json({ message: 'Une erreur est survenue lors de la réinitialisation du mot de passe.' })
    }
}

// GET USER //
exports.resetPasswordId = async (req, res, next) => {
    // const { token } = req.params
    const { newPassword, token } = req.body
    try {
      const user = await  models.User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
      if (!user) {
        return res.status(404).json({ message: 'Token de réinitialisation du mot de passe invalide ou expiré.' })
      }
  
      const hash = await bcrypt.hash(newPassword, 10)
      user.password = hash
      user.resetToken = undefined
      user.resetTokenExpiration = undefined
      await user.save();
  
      res.status(200).json({ message: 'Le mot de passe a été réinitialisé avec succès.' })
    } catch (error) {
      console.error('Une erreur est survenue lors de la réinitialisation du mot de passe:', error)
      res.status(500).json({ message: 'Une erreur est survenue lors de la réinitialisation du mot de passe.' })
    }
}