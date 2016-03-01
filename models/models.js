var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var articleSchema = new mongoose.Schema({
	author      : String,
	title       : String,		
	argreeNum   : Number,
	content     : String,
	created_at  : {type: Date, default: Date.now},	
});

var exchangeMsgSchema = new mongoose.Schema({
	articleID   : [{type: Schema.Types.ObjectId, ref: 'article'}],
	message     : String,
	number      : Number,
	responder   : String,
	responsetime:{type: Date, default: Date.now}
})

var userSchema = new mongoose.Schema({
	username    : String,
	password    : String, 
	fans        : Number,
	position    : String,
	created_at  : {type: Date, default: Date.now}
});


mongoose.model('User', userSchema);
mongoose.model('Article', articleSchema);
mongoose.model('Exchange', exchangeMsgSchema);

