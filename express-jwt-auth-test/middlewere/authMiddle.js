const jwt = require('jsonwebtoken');
const User = require('../models/User')

const requireAuth = (req, res, next) => {

    const token = req.cookies.jwt;

    //verif token
    if (token) {
        jwt.verify(token, 'asjkdga7d788939ffggshhsh', (err, decodedToken) =>{
            if(err){
                console.log(err.messege);
                res.redirect('/login');
            }else {
                console.log(decodedToken);
                next();
            }
        })
    }else{
        res.redirect('/login');
    }

}


const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token){
        jwt.verify(token, 'asjkdga7d788939ffggshhsh', async (err, decodedToken) =>{
            if(err){
                console.log(err.messege);
                next();
            }else {
                console.log(decodedToken);
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }});
    } else {
        res.locals.user = null;
        next()
    }
}


module.exports = { requireAuth, checkUser };