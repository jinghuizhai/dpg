var connection = require('../util/mysql').connection;
var fs = require('fs');
var Log = require('log');
// var log = new Log('debug',fs.createWriteStream('my.log'));
var log = new Log('debug');

module.exports = Comment;

function Comment(obj){
	this.comment_id = obj.comment_id;
	this.content = obj.content;
	this.imgs = obj.imgs;
	this.user_id = obj.user_id;
	this.reply_id = obj.reply_id;
	this.article_id = obj.article_id;
	this.code = obj.code;
	this.date = new Date();
}

Comment.save = function(comment,callback){
	callback = callback ? callback : function(){};
	comment.content = (comment.content || "").filterSym();
	var query = connection.query("insert into comment set ?",comment,function(err,rows){
		log.info(query.sql);
		if(err){
			return callback(err);
		}else{
			callback(null,rows);
		}
	});
};

Comment.update = function(comment_id,comment,callback){
	callback = callback ? callback : function(){};
	var query = connection.query("update comment set ? where comment_id=?",[comment_id,comment],function(err,rows){
		log.info(query.sql);
		if(err){
			return callback(err);
		}else{
			callback(null,rows);
		}
	});
};

Comment.findByReplyid = function(reply_id,callback){
	callback = callback ? callback : function(){};
	var query = connection.query("select * from comment where reply_id=?",reply_id,function(err,rows){
		log.info(query.sql);
		if(err){
			return callback(err);
		}else{
			callback(null,rows);
		}
	});
};

Comment.findByCommentid = function(comment_id,callback){
	callback = callback ? callback : function(){};
	var query = connection.query("select * from comment where comment_id=?",comment_id,function(err,rows){
		log.info(query.sql);
		if(err){
			return callback(err);
		}else{
			callback(null,rows);
		}
	});
};
Comment.findByUserid = function(user_id,callback,limit){
	callback = callback ? callback : function(){};
	var q = "select * from comment where user_id=?";
	if(limit){
		q = q + " limit "+limit.start+","+limit.end;
	}
	var query = connection.query(q,user_id,function(err,rows){
		log.info("Comment.findByUserid:",query.sql);
		if(err){
			return callback(err);
		}else{
			callback(null,rows);
		}
	});
};
Comment.findByArticleid = function(article_id,callback,limit){
	var q = "select * from comment where article_id=?";
	if(limit){
		q = q + " limit "+limit.start+","+limit.end;
	}
	var query = connection.query(q,article_id,function(err,rows){
		log.info("Comment.findByArticleid:",query.sql);
		if(err){
			return callback(err);
		}else{
			callback(null,rows);
		}
	});
};
Comment.removeByArticleid = function(article_id,callback){
	var query = connection.query("delete from comment where article_id=?",article_id,function(err,rows){
		log.info(query.sql);
		if(err){
			return callback(err);
		}else{
			callback(null,rows);
		}
	});
};
Comment.removeByCommentid = function(comment_id,callback){
	callback = callback ? callback : function(){};
	var query = connection.query("delete from comment where comment_id=?",comment_id,function(err,rows){
		log.info(query.sql);
		if(err){
			return callback(err);
		}else{
			callback(null,rows);
		}
	});
};