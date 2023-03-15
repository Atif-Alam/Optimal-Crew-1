const User = require('../../models/user')
const passport = require('passport')
const bcrypt = require('bcrypt')
function authController(){
    return {
        login(req,res) {
            res.render('auth/login');
        },

        postLogin( req, res, next) {
            passport.authenticate('local', (err, user, info)=>{
                
                if(err){
                    req.flash('error', info.message)
                    return next(err)
                }
                if(!user){
                    req.flash('error', info.message)
                    return res.redirect('/login')
                }
                req.logIn(user, (err)=>{
                    if(err){
                        req.flash('error', info.message)
                        return next(err)
                    }
                    return res.redirect('/')
                })
            })(req, res, next)
        },

        register(req,res) {
            res.render('auth/register');
        },
        async postRegister(req, res ) {
            const { email, password, cpassword} = req.body;
            // validate request
            if(!email || !password || !cpassword){
                req.flash('error','All fields are Required')
                req.flash('email',email)
              return  res.redirect('/register')
            }

            // if email already exists

            User.exists({ email: email}, (err,result)=>{
                if(result){
                    req.flash('error','User already Exist')
                    req.flash('email', email)
                    return res.redirect('/register')
                }
            })
            //hash password
            const hashPassword = await bcrypt.hash(password,10)
            // Create user
            const user = new User ({
                email: email,
                password: hashPassword
            })
            user.save().then((user)=>{
                return res.redirect('/')
            }).catch(err=>{
                req.flash('error','Something went Wrong')
                return res.redirect('/register')
            })

        },
        logout(req, res) {
            req.logout((err)=>{
                if(err) {next(err)}
                return res.redirect('/login')
            })
        }

    }
}

module.exports = authController;