const getTotalPrice = (panier) => {
    const totalPrice = panier.products.reduce((total, item) => total + item.price * item.quantity, 0)
    let amount = totalPrice
    if (panier.promo && panier.promo.percentage) {
        const promoAmount = (totalPrice * panier.promo.percentage) / 100;
        const finalPrice = totalPrice - promoAmount
        amount =  finalPrice
    } else {
        amount = totalPrice
    }
    amount = Math.round(amount * 100)
    console.log('salut =>')
    return amount
}

module.exports = { getTotalPrice }