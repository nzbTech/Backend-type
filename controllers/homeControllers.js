

exports.getHome = async (req, res, next) => {
    return res.status(200).json({ message: 'Bienvenue !' })
}