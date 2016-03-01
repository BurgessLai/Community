var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );
var Article = mongoose.model('Article');

router.route('/article/quality')
	.get(function(req, res){
		console.log('find quality Article in mongo');
		Article.find({}).sort('-argreeNum').exec(function(err, qualityArticle){
			if(err){
				return res.send(500, err);
			}
			return res.send(200, qualityArticle);
		});
	});
	
router.route('/article/saveArticle')
	.post(function(req, res){
		var article = new Article();
		article.author = req.body.author;
		article.content = req.body.content;
		article.title = req.body.title;
		article.argreeNum = req.body.argreeNum;
		article.created_at = req.body.created_at;
		article.save(function(err,article) {
			if (err){
				return res.send(500, err);
			}
			return res.json(article);
		});
	})	
	
module.exports = router;