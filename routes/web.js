const homeController = require('../app/http/controllers/homeController');
const authController = require('../app/http/controllers/authController');
const checkoutController = require('../app/http/controllers/customers/checkoutController');
const guest = require('../app/http/middleware/guest')
function initRoutes(app){
   
    app.get('/',  homeController().index );
    app.get('/login',guest, authController().login);
    app.post('/login', authController().postLogin);
    app.get('/register',guest, authController().register);
    app.post('/register',authController().postRegister);
    app.post('/logout',authController().logout);
    app.get('/checkout',checkoutController().checkout);
}

module.exports = initRoutes;