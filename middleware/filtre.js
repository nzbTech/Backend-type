const mongoose = require('mongoose')
const models = require('../models/models')


const getfilter = async (req) => {
    const filters = req.query
    return filters
}

module.exports = { getfilter }