var Article = require('../models/Article');
var User = require('../models/User');
var EventProxy = require('eventproxy');
var ep = new EventProxy();
var ln = 10;//line-num

var index = function(req,res,next){
	var p = req.params.p ? req.params.p : 1;
	p = parseInt(p);
	Article.find({start:(p-1)*ln,end:p*ln},function(err,rows){
		if(err){
			res.redirect('/err');
		}else{
			res.render('list',{
				articles:rows
			});
		}
	});
};

var gowrite = function(req,res,next){
	var title = req.body.title.trim();
	var content = req.body.content.trim();
	if(title.length == 0 || content.length == 0){
		res.redirect('/article/write');
	}else{
		var article = {
			title:title,
			content:content,
			check:true,
			user_id:req.session.user.user_id
		};
		Article.save(article,function(err,rows){
			if(err){
				res.redirect('/err');
			}else{
				// var article_id = rows[0]._results[0].insertId;
				if(rows){
					res.redirect('/article/'+rows.insertId);
				}
			}
		});
	}
};
var write = function(req,res,next){
	res.render('write');
};
var detail = function(req,res,next){
	var article_id = req.params.id;
	if(article_id.length < 1){
		res.redirect('/err');
	}
	var go = function(user,article){
		res.render('article',{
			user:user,
			article:article
		});
	};
	ep.all('user','article',go);
	Article.findByArticleid(article_id,function(err,rows){
		ep.emit('article',err ? [] : rows[0]);
	});
	User.findByArticleid(article_id,function(err,rows){
		ep.emit('user',err ? [] : rows[0]);
	});
};
var member = function(req,res,next){

};

exports.index = index;
exports.gowrite = gowrite;
exports.write = write;
exports.member = member;
exports.detail = detail;
