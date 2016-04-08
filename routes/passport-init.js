var mongoose = require('mongoose');   
var User = mongoose.model('User');
var LocalStrategy   = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){
	//serialize user and deserialize user for session to keep login
	passport.serializeUser(function(user, done) {
		console.log('serializing user:',user.username);
		done(null, user._id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			console.log('deserializing user:',user.username);
			done(err, user);
		});
	});

	//return result to authenticate.js
	passport.use('login', new LocalStrategy({
			passReqToCallback : true // allows us to pass back the entire request to the callback
		},
		function(req, username, password, done) { 
			console.log('Begin authenticate login');
			User.findOne({ 'username' :  username }, 
				function(err, user) {
					if (err){
						console.log('Server Error');
						return done(err, false, { message: 'Server Error' });
					}
					if (!user){
						console.log('User not found with username:'+username);
						return done(null, false, { message: 'User not found with username: '+username });                 
					}
					if (!isValidPassword(user, password)){
						console.log('Invalid Password');
						return done(null, false, { message: 'Invalid Password' });
					}
					if (user.powerToLogin == false){
						console.log('Sorry, you can\' login');
						return done(null, false, { message: 'Sorry, you can\'t have power to login' });
					}
					return done(null, user);
				}
			);
		}
	));

	//return result to authenticate.js
	passport.use('signup', new LocalStrategy({
			passReqToCallback : true 
		},
		function(req, username, password, done) {
			console.log('Begin authenticate signup');
			User.findOne({ 'username' :  username }, function(err, user) {
				if (err){
					console.log('Server Error');
					return done(err, false, { message: 'Server Error' });
				}
				if (user) {
					console.log('User already exists with username: '+username);
					return done(err, false, { message: 'User already exists with username: '+username });
				} else {
					var newUser = new User();
					newUser.username = username;
					newUser.password = createHash(password);
					newUser.fansNumber = 0;
					newUser.position = 'Member';
					newUser.powerToLogin = true;
					
					newUser.save(function(err) {
						if (err){
							console.log('Error in saving user: '+err);  
							throw err;  
						}
						console.log(newUser.username + ' Registration succesful');    
						return done(null, newUser);
					});
				}
			});
		})
	);
	
	var isValidPassword = function(user, password){
		return bCrypt.compareSync(password, user.password);
	};
	// generates hash using bCrypt
	var createHash = function(password){
		return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	};

};
