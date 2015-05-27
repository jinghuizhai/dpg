var user = require('./routes/user');
var article = require('./routes/article');
var tag = require('./routes/tag');
var comment = require('./routes/comment');

module.exports = function(app){
	// app,session
	// 权限过滤
	app.get('*',function(req,res,next){
		res.locals.session = req.session;
		next();
	});
	app.get('/err',function(req,res,next){
		res.send('出现错误，请联系网站所有者或提交bug帮助我们改进网站，使得包括您在内的用户获得更好的体验，非常感谢！');
	});
	app.get(['/article/write','/comment/write','/article/edit'],function(req,res,next){
		if(req.session.user){
			next();
		}else{
			res.redirect('/err');
		}
	});
	
	app.get(['/article/dele/:id','/article/edit/:id'],function(req,res,next){
		var id = req.params.id;
		if(/\d+/.test(id) && req.session.user){
			next();
		}else{
			res.redirect("/err");
		}
	});

	// app.post(['/article/edit'],function(req,res,next){
	// 	if(req.session.user){
	// 		next();
	// 	}else{
	// 		res.redirect("/err");
	// 	}
	// });

	app.get("/404",function(req,res,next){
		res.redirect("/err");
	});

	app.get('/',function(req,res,next){
		res.redirect("/article/all/1");
	});
	

	//user
	app.get('/user/login',user.login);
	app.post('/user/login',user.gologin);
	app.get('/user/register',user.register);
	app.post('/user/register',user.goregister);
	app.get('/user/logout',user.logout);
	//article
	app.get('/article/all/:p',article.index);
	app.get('/article/write',article.write);
	app.get('/article/edit/:id',article.edit);
	app.post("/article/edit",article.goedit);
	app.post('/article/write',article.gowrite);
	app.get('/article/:id',article.detail);
	app.get('/article/dele/:id',article.dele);
	// 某用户的所有文章
	app.get('/article/a/:nickname/:p',article.member);
	// app.get('/article/c/:nickname/:p?',article.comment);
	//comment
	app.get('/comment/:nickname/:p?',comment.index);
	app.post('/comment/write',comment.write);
	//memeber
	app.get('/member/:nickname',user.member);

}