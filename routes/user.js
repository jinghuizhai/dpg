var User = require('../models/User');
var Article = require('../models/Article');
var Comment = require('../models/Comment');
var page = require('../util/pagination').pagination;
var cheerio = require('cheerio');
var EventProxy = require('eventproxy');
var ep = new EventProxy();

var login = function(req,res,next){
	res.render('login',{
		err:req.flash('err')
	});
};

var gologin = function(req,res,next){
	var e = (req.body.email || "").trim();
	var p = (req.body.password || "").trim();
	if(/[\d\w_]+@[\d\w]{2,}\.(com|cn|net|cn)/.test(e)){
		if(/\S{3,}/.test(p)){
			User.get({email:e,password:p},function(err,rows){
				if(rows.length < 1){
					req.flash('err','账号或密码错误');
					res.redirect('/user/login');
				}else{
					req.session.user = rows[0];
					res.redirect('/member/'+rows[0].nickname);
				}
			});
		}else{
			req.flash("err","密码至少3位");
			res.redirect("/user/login");
		}
	}else{
		req.flash("err","邮箱格式不正确");
		res.redirect("/user/login");
	}
};

var register = function(req,res,next){
	res.render('register',{err:req.flash('err')});
};
var goregister = function(req,res,next){
	var b = req.body;
	var e = (b.email || '').trim();
	var n = (b.nickname || '').trim();
	var p = (b.password || '').trim();
	if(!/[\d\w_]+@[\d\w]{2,}\.(com|cn|net|cn)/.test(e)){
		req.flash('err','Email格式不正确');
		res.redirect('/user/register');
	}else if(!/[\w\d]+/.test(n)){
		req.flash('err','昵称必须为英文或数字');
		res.redirect('/user/register');
	}else if(p.length < 3){
		req.flash('err','密码至少3位');
		res.redirect('/user/register');
	}else{
		User.save({
			email:e,
			nickname:n,
			password:p
		},function(err,rows){
			if(err){
				req.flash('err',"系统错误，请提交bug，十分感谢！");
				res.redirect('/user/register');
			}else{
				res.redirect('/member/'+n);
			}
		});
	}
};
/*此方法需要获取的数据包括
user的个人信息
user的最新文章
user的最新回复*/
var member = function(req,res,next){
	var nickname = (req.params.nickname || '').trim();
	if(nickname.length > 0){
		User.findByNickname(nickname,function(err,rows){
			if(err){
				res.redirect('/err');
			}else{
				if(rows.length == 1){
					var user = rows[0];
					var go = function(articles,comments,artCount){
						user.date = user.date.getWholeYear();
						articles.forEach(function(ele){
							ele.date = new Date().until(ele.date);
						});
						comments.forEach(function(ele){
							ele.date = new Date().until(ele.date);
							ele.content = (ele.content || "").removeHtml();
						});
						res.render('member',{
							user:user,
							articles:articles,
							artCount:artCount,
							comments:comments
						});
					};
					ep.all('articles','comments',"artCount",go);
					Article.findByUserid(user.user_id,function(err,rows){
						ep.emit('articles',err ? [] : rows);
					},{start:0,end:5});
					Comment.findByUserid(user.user_id,function(err,rows){
						ep.emit('comments',rows);
					},{start:0,end:5});
					Article.countByUserid(user.user_id,function(err,rows){
						ep.emit("artCount",err ? 0 : rows[0].count);
					});
				}else{
					log.error("查询的用户数量错误");
				}
			}
		})	
	}else{
		res.redirect('/err');
	}
};

var logout = function(req,res,next){
	req.session.user = null;
	res.redirect('/user/login');
};

exports.login = login;
exports.gologin = gologin;
exports.register = register;
exports.goregister = goregister;
exports.member = member;
exports.logout = logout;