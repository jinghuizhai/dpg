var connection = require('../util/mysql').connection;
var fs = require('fs');
var Log = require('log');
// var log = new Log('debug',fs.createWriteStream('my.log'));
var log = new Log('debug');

module.exports = Tag;

function Tag = function(obj){
	this.tag_id = obj.tag_id;
	this.tagname = obj.tagname;
	this.count = obj.count;
}

Tag.save = function(tag,callback){
	callback = callback ? callback : function(){};
	var query = connection.query("insert into tag set ?",tag,function(err,rows){
		log.info(query.sql);
		if(err){
			return callback(err);
		}else{
			callback(null,callback);
		}
	});
};
Tag.update = function(tag_id,tag,callback){
	callback = callback ? callback : function(){};
	var query = connection.query("update tag set ? where tag_id=?",[tag,tag_id],function(err,rows){
		log.info(query.sql);
		if(err){
			return callback(err);
		}else{
			callback(null,callback);
		}
	});
};
Tag.remove = function(tag_id,callback){
	callback = callback ? callback : function(){};
	var query = connection.query("delete tag where tag_id=?",tag_id,function(err,rows){
		log.info(query.sql);
		if(err){
			return callback(err);
		}else{
			callback(null,callback);
		}
	});
};