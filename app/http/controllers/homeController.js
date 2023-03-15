const Item = require('../../models/item')
function homeController(){
    return {
          async index(req,res) {
            const items = await Item.find()
            return res.render('home',{ items: items}); 
        }
    }
}

module.exports = homeController;