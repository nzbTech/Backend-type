const paginate = async (model, page, limit) => {
    const startIndex = (page - 1) * limit
    try {
        const totalItems = await model.countDocuments()
        const totalPages = Math.ceil(totalItems / limit)
        const data = await model.find().skip(startIndex).limit(limit)
        return { data, totalItems, totalPages }

    } catch (err) {
        throw new Error(err.message)
    }
  }

module.exports = { paginate }