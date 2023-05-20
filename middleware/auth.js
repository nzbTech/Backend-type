const jwt = require("jsonwebtoken")
const models = require('../models/models')

module.exports = async (req, res, next) => {
  const checkToken = req.headers.authorization
  if (checkToken) {
    try {
      const token = req.headers.authorization.split(" ")[1]
      const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)
      const userId = decodedToken.userId
      const user = await models.User.findById(userId)
      req.user = user
      if (req.body.userId && req.body.userId !== userId) {
          res.status(401).json({ error: new Error("Token invalid")})
      } else {
          next()
      }
    } catch {
      return res.status(400).json({ error: 'Authentification echouée' })
    }
  } else {
      return res.status(400).json({ error: 'Authentification requise' })
  }
}
