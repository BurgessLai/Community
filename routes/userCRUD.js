var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');

router.route('/user/start')
    .get(function(req, res) {
        console.log('find start User in mongo');
        User.find({}).sort('-fans').exec(function(err, starts) {
            if (err) {
                return res.send(500, err);
            }
            return res.send(200, starts);
        });
    });

module.exports = router;