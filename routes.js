var user = require('./routes/user');
var article = require('./routes/article');
var tag = require('./routes/tag');
var comment = require('./routes/comment');

module.exports = function(app){
	// app,session
	// 权限过滤
	app.get('*',function(req,res,next){
		if(req.session.user){
			res.locals.user = req.session.user;
		}
		next();
	});
	app.get('/err',function(req,res,next){
		res.send('出现错误，请联系网站所有者或提交bug帮助我们改进网站，使得包括您在内的用户获得更好的体验，非常感谢！');
	});
	app.get('/article/write',function(req,res,next){
		if(req.session.user){
			next();
		}else{
			res.redirect('/err');
		}
	});

	app.get('/',function(req,res,next){
		res.render('index');
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
	app.post('/article/write',article.gowrite);
	app.get('/article/:id',article.detail);
	app.get('/article/user/:nickname/:p?',article.member);
	//comment
	app.get('/comment/:nickname/:p?',comment.index);
	app.post('/comment/write',comment.write);
	//memeber
	app.get('/member/:nickname',user.member);




}