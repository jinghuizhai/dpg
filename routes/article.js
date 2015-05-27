var Article = require('../models/Article');
var User = require('../models/User');
var Comment = require("../models/Comment");
var page = require('../util/pagination').pagination;
var EventProxy = require('eventproxy');
var ep = new EventProxy();


var index = function(req,res,next){
	var p = req.params ? req.params.p : 1;
	p = parseInt(p);
	if(isNaN(p)){
		res.redirect("/article/all/1");
	}
	var ln = 10;//每页读出多少篇文章

	Article.countArticle(function(err,rows){
		if(err){
			res.render("list",{articles:[]});
		}else{
			var count = rows[0].count;
			var obj = {
				base:"/article/all/",
				limit:2,
				now:p,
				total:(count%ln == 0 ? count/ln : Math.floor(count/ln) + 1)
			};
			if(p > obj.total){
				res.redirect('/article/all/'+obj.total);
			}
			Article.find({start:(p-1)*ln,end:ln},function(err,rows){
				if(err){
					res.redirect('/err');
				}else{
					rows.forEach(function(ele){
						ele.date = new Date().until(ele.date);
					});
					res.render('list',{
						articles:rows,
						page:page(obj)
					});
				}
			});
		}
	});
};

var gowrite = function(req,res,next){
	var title = (req.body.title || '').trim();
	var content = (req.body.content || '').trim();
	var article_id = req.body.article_id;

	if(title.length == 0 || content.length == 0){
		res.redirect('/article/write');
	}else{
		var article = {
			title:title,
			content:content.filterSym(),
			article:article_id ? (/\d+/.test(article_id) ? article_id.trim() : null ) : null,
			check:true,
			user_id:req.session.user.user_id
		};
		Article.save(article,function(err,rows){
			if(err){
				res.redirect('/err');
			}else{
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
	var go = function(user,article,fresh,self,comments){
		if(user == undefined || user.length == 0){
			return res.redirect("/err");
		}
		user.date = user.date.getWholeYear();
		article.date = new Date().until(article.date);
		fresh.forEach(function(ele){
			ele.date = new Date().until(ele.date);
		});
		res.render('article',{
			user:user,
			fresh:fresh,
			self:self,
			comments:comments,
			article:article
		});
	};
	ep.all('user','article','fresh',"self",'comments',go);
	Article.findByArticleid(article_id,function(err,rows){
		ep.emit('article',err ? [] : rows[0]);
	});
	User.findByArticleid(article_id,function(err,rows){
		ep.emit('user',err ? [] : rows[0]);
	});
	Article.getFresh({start:0,end:5},function(err,rows){
		ep.emit('fresh',err ? [] : rows);
	});
	Comment.findByArticleid(article_id,function(err,rows){
		ep.emit("comments",err ? [] : rows);
	},{start:0,end:5});

	if(req.session.user){
		Article.findByAidUid(article_id,req.session.user.user_id,function(err,rows){
			if(err){
				ep.emit('self',false);
			}else{
				if(rows.length == 1){
					ep.emit('self',true);
				}
			}
		});
	}else{
		ep.emit('self',false);
	}

};
var member = function(req,res,next){
	var n = (req.params.nickname || '').trim();
	var p = (req.params.p || '').trim();

	if(!/[\d\w]+/.test(n)){
		res.redirect("/err");
	}
	if(!/\d+/.test(p)){
		p = 1
	}else{
		p = parseInt(p);
	}
	User.findByNickname(n,function(err,rows){
		if(err){
			res.redirect("/err");
		}else{
			var user_id = rows[0].user_id
			Article.countByUserid(user_id,function(err,rows){
				if(err){
					res.redirect("/err");
				}else{
					var count = rows[0].count;
					if(count > 0){
						var ln = 5;
						var obj = {
							base:"/article/a/"+n+"/",
							limit:2,
							now:p,
							total:(count%ln == 0 ? count/ln : Math.floor(count/ln) + 1)
						};
						if(p > obj.total){
							res.redirect("/article/a/"+n+"/"+total);
						}
						Article.findByUserid(user_id,function(err,rows){
							if(err){
								res.redirect("/err");
							}else{
								rows.forEach(function(ele){
									ele.date = new Date().until(ele.date);
								});
								res.render("ulist",{
									articles:rows,
									page:page(obj)
								});
							}
						},{start:(p-1)*ln,end:ln});
					}else{
						res.render("ulist",{
							articles:false
						});
					}
				}
			});
		}
	});
};
var edit = function(req,res,next){
	var id = (req.params.id || '').trim();
	Article.findByUidAid(req.session.user.user_id,id,function(err,rows){
		if(err){
			res.redirect("/err");
		}else{
			res.render('edit',{
				art:rows[0]
			});
		}
	});
};
var goedit = function(req,res,next){
	var article_id = req.body.article_id;
	var t = (req.body.title || "").trim();
	var c = (req.body.content || "").trim();
	if(t.length < 1 || c.length < 1){
		req.flash("err","请填写正确的标题和内容");
		res.redirect("/article/edit/"+article_id);
	}
	console.log(req.session.user);
	Article.findByAidUid(article_id,req.session.user.user_id,function(err,rows){
		if(err){
			redirect("/err");
		}else{
			if(rows.length > 0){
				var obj = {
					title:t,
					content:c,
					check:1,
					date:new Date(),
					article_id:article_id,
					user_id:req.session.user.user_id
				};
				Article.save(obj,function(err,rows){
					if(err){
						res.redirect("/err");
					}else{
						res.redirect("/article/"+article_id);
					}
				});
			}
		}
	});
};
var dele = function(req,res,next){
	var article_id = (req.params.id || "").trim();
	Article.remove(article_id,req.session.user.user_id,function(err,rows){
		res.redirect('/member/'+req.session.user.nickname);
	});
	Comment.removeByArticleid(article_id,function(){});
};

exports.index = index;
exports.gowrite = gowrite;
exports.write = write;
exports.member = member;
exports.detail = detail;
exports.edit = edit;
exports.dele = dele;
exports.goedit = goedit;
		