'use strict';

const getLogin = (req, res, next) => {
    const loggedIn = req.session.isLoggedIn;
    // console.log(loggedIn)
    //const loggedIn = req.get('Cookie').split(';')[1].trim().split('=')[1];
    res.render('auth/login', {
        path: '/orders',
        pageTitle: 'Your Orders',
        isAuthenticated : loggedIn
    });
}

const postLogin = (req, res, next) => {
    req.session.isLoggedIn = true;
    res.redirect('/');
} 

module.exports = {
    getLogin,
    postLogin
}