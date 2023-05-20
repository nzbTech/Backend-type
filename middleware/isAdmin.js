const jwt = require('jsonwebtoken');
const models = require('../models/models')

const isAdmin = async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1]
    if (!token) {
      return res.status(401).json({ error: 'Token non fourni.' })
    }
    try {
      const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)
      const userId = decodedToken.userId
      const user = await models.User.findById(userId)
      if (user.isAdmin) {
        next()
      } else {
        return res.status(403).json({ error: 'Action non autorisée.' })
      }
    } catch (error) {
      return res.status(500).json({ error: 'Erreur du serveur.' })
    }
}

module.exports = { isAdmin }