const Joi = require('joi')

const userSchema = Joi.object({
    firstname: Joi.string().required(),
    name: Joi.string().required(),
    email: Joi.string().email().required(),
})




module.exports = { userSchema }