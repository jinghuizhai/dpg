var Comment = require('../models/Comment');
var Article = require('../models/Article');
var User = require("../models/User");

var index = function(req,res,next){
	res.render('list');
}
var write = function(req,res,next){
	var c = (req.body.content || "").trim();
	// var cid = req.body.comment_id;
	// var imgs = obj.imgs;
	var user_id = req.session.user.user_id;
	var article_id = req.body.article_id;
	var reply_id = req.body.reply_id;
	// this.code = obj.code;
	var d = new Date();
	if(c.length > 0){
		if(article_id){
			Article.findByArticleid(article_id,function(err,rows){
				if(err){

				}else{
					if(rows.length > 0){
						var obj = {
							content:c,
							user_id:user_id,
							article_id:article_id,
							reply_id:reply_id,
							date:d
						};
						if(reply_id){
							Comment.findByCommentid(reply_id,function(err,rows){
								if(err){

								}else{
									if(rows.length > 0){
										Comment.save(obj,function(err,rows){
											if(err){

											}else{
												res.redirect("/article/"+article_id);
											}
										});
									}
								}
							});
						}else{
							Comment.save(obj,function(err,rows){
								if(err){

								}else{
									res.redirect("/article/"+article_id);
								}
							});
						}
					}
				}
			});
		}
	}else{
		//回复太短
	}

};

exports.index = index;
exports.write = write;