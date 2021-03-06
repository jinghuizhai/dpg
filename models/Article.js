var connection = require('../util/mysql').connection;
var fs = require('fs');
var Log = require('log');
// var log = new Log('debug',fs.createWriteStream('my.log'));
var log = new Log('debug');

module.exports = Article;

function Article(obj){
	this.article_id = obj.article_id;
	this.title = obj.title;
	this.content = obj.content;
	this.imgs = obj.imgs;
	this.code = obj.code;
	this.tag_id = obj.tag_id;
	this.check = obj.check;
	this.source = obj.source;
	this.comments = obj.comments;
	this.like = obj.like;
	this.date = new Date();
	this.user_id = obj.user_id;
}

Article.save = function(article,callback){
	callback = callback ? callback : function(){};
	var othis = article;
	var obj = {
		title:othis.title.filterSym(),
		content:othis.content.filterSym(),
		check:othis.check,
		date:new Date(),
		article_id:othis.article_id,
		user_id:othis.user_id
	};
	var q;

	if(article.article_id){
		q = 'update article set ? where article_id='+obj.article_id;
	}else{
		q = 'insert into article set ?';
	}
	delete obj.article_id;
	
	var query = connection.query(q,obj,function(err,rows){
		log.info("article.save/update:",query.sql);
		if(err){
			return callback(err);
		}else{
			callback(null,rows);
		}
	});
};

Article.find = function(limit,callback){
	callback = callback ? callback : function(){};
	var query = connection.query('select a.article_id,a.title,a.date,u.email,u.imgs,u.nickname from article a,user u where a.user_id = u.user_id order by a.date desc limit ? , ?',[limit.start,limit.end],function(err,rows){
		log.info("article.find:",query.sql);
		if(err){
			return callback(err);
		}else{
			callback(null,rows);
		}
	});
};

Article.findByArticleid = function(article_id,callback){
	callback = callback ? callback : function(){};
	var query = connection.query('select * from article where article_id=?',article_id,function(err,rows){
		log.info("article.findByArticleid:",query.sql);
		if(err){
			return callback(err);
		}else{
			log.info(rows.length);
			callback(null,rows);
		}
	});
};

Article.findByUserid = function(user_id,callback,limit){
	callback = callback ? callback : function(){};
	var q = 'select * from article where user_id=?';
	if(limit){
		q = q + " limit "+limit.start+","+limit.end;
	}
	var query = connection.query(q,user_id,function(err,rows){
		log.info("article.findarticleId:",query.sql);
		if(err){
			return callback(err);
		}else{
			callback(null,rows);
		}
	});
};

Article.findByTag = function(tag,limit,callback){
	callback = callback ? callback : function(){};
	var query = connection.query('select * from article where tag=? limit ?,?',[tag,limit.start,limit.end],function(err,rows){
		log.info("article.findByTag:",query.sql);
		if(err){
			return callback(err);
		}else{
			callback(null,rows);
		}
	});
};
Article.countByTag = function(tag,callback){
	callback = callback ? callback : function(){};
	var query = connection.query("select count(*) as count from article where tag =?",tag,function(err,rows){
		log.info("article.countByTag",query.sql);
		if(err){
			return callback(err);
		}else{
			callback(null,rows[0].count);
		}
	});
};

Article.update = function(article_id,article,callback){
	callback = callback ? callback : function(){};
	var query = connection.query('update article set ? where article_id=?',[article,article_id],function(err,rows){
		log.info("article.update:",query.sql);
		if(err){
			return callback(err);
		}else{
			callback(null,rows);
		}
	});
};
Article.countByUserid = function(user_id,callback){
	callback = callback ? callback : function(){};
	var query = connection.query('select count(*) as count from article where user_id=?',user_id,function(err,rows){
		log.info("Article.countByUserid:",query.sql);
		if(err){
			return callback(err);
		}else{
			log.info(rows);
			callback(null,rows);
		}
	});
};
Article.getFresh = function(limit,callback){
	callback = callback ? callback : function(){};
	var query = connection.query('select * from article order by date desc limit ?,?',[limit.start,limit.end],function(err,rows){
		log.info("Article.getFresh:",query.sql);
		if(err){
			return callback(err);
		}else{
			log.info(rows.length);
			callback(null,rows);
		}
	});
};
Article.countArticle = function(callback){
	callback = callback ? callback : function(){};
	var query = connection.query('select count(*) as count from article',function(err,rows){
		log.info("Article.countArticle:",query.sql);
		if(err){
			return callback(err);
		}else{
			log.info(rows.length);
			callback(null,rows);
		}
	});
};
// 查询某篇文章是不是某个user_id发表的
Article.findByAidUid = function(article_id,user_id,callback){
	var query = connection.query('select count(*) as count from article where article_id=? and user_id=?',[article_id,user_id],function(err,rows){
		log.info("Article.findByAidUid:",query.sql);
		if(err){
			return callback(err);
		}else{
			log.info(rows.length);
			callback(null,rows);
		}
	});
};
//根据user_id 和 article_id 查询文章
Article.findByUidAid = function(user_id,article_id,callback){
	var query = connection.query('select * from article where article_id=? and user_id=?',[article_id,user_id],function(err,rows){
		log.info("Article.findByUidAid:",query.sql);
		if(err){
			return callback(err);
		}else{
			log.info(rows.length);
			callback(null,rows);
		}
	});
};
Article.remove = function(article_id,user_id,callback){
	var query = connection.query("delete from article where article_id=? and user_id=?",[article_id,user_id],function(err,rows){
		log.info("article.remove:",query.sql);
		if(err){
			return callback(err);
		}else{
			callback(null,rows);
		}
	});
}