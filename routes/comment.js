var Comment = require('../models/Comment');

var index = function(req,res,next){
	res.render('list');
}
var write = function(req,res,next){


};

exports.index = index;
exports.write = write;