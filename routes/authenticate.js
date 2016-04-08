var express = require('express');
var router = express.Router();

module.exports = function(passport){

	//sends successful state back to angular
	router.get('/success', function(req, res){
		res.send({ state: 'success', user: req.user ? req.user : null });
	});

	//sends failure state back to angular
	router.get('/failure', function(req, res){
		res.send({ state: 'failure', message: req.flash().error[0] });
	});

	//use strategy of authentication in passport-init.js
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/auth/success',
		failureRedirect: '/auth/failure',
		failureFlash: true
	}));

	//use  strategy of authentication in passport-init.js
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/auth/success',
		failureRedirect: '/auth/failure',
		failureFlash: true
	}));

	//log out
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	return router;

}