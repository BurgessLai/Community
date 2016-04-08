var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var articleSchema = new mongoose.Schema({
	author      : String,
	title       : String,		
	agreeNum    : Number,
	content     : String,
	exchanges   : [{
					message     : String,
					commenter   : String,
					commentTime:{type: Date, default: Date.now}
	}],
	agreeWithWho: [],	
	created_at  : {type: Date, default: Date.now}	
});

var userSchema = new mongoose.Schema({
	username    : String,
	password    : String, 
	fans        : [],
	position    : String,
	powerToLogin: Boolean,
	fansNumber  : Number,
	created_at  : {type: Date, default: Date.now}
});


mongoose.model('User', userSchema);
mongoose.model('Article', articleSchema);

