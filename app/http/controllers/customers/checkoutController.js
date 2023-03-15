function checkoutController(){
    return {
        checkout(req,res) {
            res.render('customer/checkout')
        }
    }
}

module.exports = checkoutController;