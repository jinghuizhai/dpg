var connection = require('../util/mysql').connection;
var fs = require('fs');
var Log = require('log');
// var log = new Log('debug',fs.createWriteStream('my.log'));
var log = new Log('debug');

module.exports = User;

function User(obj){
	this.id = obj.user_id;
	this.email = obj.email;
	this.nickname = obj.nickname;
	this.password = obj.password;
	this.address = obj.address;
	this.number = obj.number;
	this.date = new Date();
	this.comments = obj.comments;
	this.articles = obj.articles;
	this.like = obj.like;
	this.banana = obj.banana;
	this.imgs = obj.imgs;
	this.city = obj.city;
	this.git = obj.git;
	this.site = obj.site;
}


User.save = function(user,callback){
	callback = callback ? callback:function(){};
	var othis = user;
	User.findByEmail(othis.email,function(err,rows){
		if(err){
			log.error("User.get:",err);
			return callback(err);
		}else{
			if(rows.length == 0){
				//没有注册用户,检查nickname
				User.findByNickname(othis.nickname,function(err,rows){
					if(err){
						log.error("User.findByNickname:",err);
						return callback(err);
					}else{
						if(rows.length == 0){
							var query = connection.query("insert into user set ? ",{
								password:othis.password,
								email:othis.email,
								nickname:othis.nickname,
								date:new Date()
							},function(err,rows){
								log.info("User.save:",query.sql);
								if(err){
									return callback(err);
								}else{
									callback(null,rows);
								}
							});
						}else{
							return callback('此昵称已经被注册');
						}
					}
				});				
			}else{
				return callback('此Email已经注册过了');
			}
		}
	});
};

User.get = function(user,callback){
	callback = callback ? callback:function(){};
	var query = connection.query('select * from user where email=? and password = ?',[user.email,user.password],function(err,rows){
		log.info(query.sql);
		if(err){
			return callback(err);
		}else{
			callback(null,rows);
		}
	});
};

User.findByEmail = function(email,callback){
	callback = callback ? callback : function(){};
	var query = connection.query('select user_id from user where email=?',email,function(err,rows){
		log.info("User.findByEmail",query.sql);
		if(err){
			return callback(err);
		}else{
			callback(null,rows);
		}
	});
};
User.findByNickname = function(nickname,callback){
	callback = callback ? callback : function(){};
	var query = connection.query('select * from user where nickname=?',nickname,function(err,rows){
		log.info("User.findNickname",query.sql);
		if(err){
			return callback(err);
		}else{
			callback(null,rows);
		}
	});
};
User.update = function(callback){
	callback = callback ? callback:function(){};
	var othis = this;
	connection.query('update user set ? where id = ?',[{name:othis.name,password:othis.password,email:othis.email,date:othis.date},othis.id],function(err,rows){
		if(err){
			return callback(err);
		}else{
			callback(null,rows);
		}
	});
};
/*根据作者的文章id查找此作者*/
User.findByArticleid = function(article_id,callback){
	callback = callback ? callback : function(){};
	var query = connection.query("select u.* from user u,article a where a.user_id = u.user_id and a.article_id=?",article_id,function(err,rows){
		log.info("User.findByArticleid:",query.sql);
		if(err){
			return callback(err);
		}else{
			log.info(rows.length);
			callback(null,rows);
		}
	});
};