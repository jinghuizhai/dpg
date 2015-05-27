var s_url = "http://cc.bingj.com/cache.aspx?q=site%3awww.waimaoezu.com+%E8%A7%86%E7%95%8C&d=4776653622021637&mkt=zh-CN&setlang=zh-CN&w=PpEsfmv2qtt8K98HWzVy1VpQVI08iH6n";
// s_url = "http://www.cnicn.cn";
var ng = require('nodegrass');
// var cheerio = require("cheerio");
var fs = require('fs');
// var connection = require('./util/mysql').connection;

var $ = {
	getTit:function(str){
		// console.log(str);
		var x = str.match(/<h1 class="ph">[^<]*<\/h1>/);
		if(x){
			var y = x[0];
			var z = y.replace(/<h1 class="ph">([^<]*)<\/h1>/i,"$1");
			console.log(z);
		}
	},
	getTime:function(str){
		var x = str.match(/<p class="xg1">[^<]*/);
		if(x){
			var y = x[0].replace(/<p[^>]*>/,"");
			console.log(y);
		}
	},
	getLink:function(str){
		var x = str.match(/<base[\s]*href=[^>]*>/);
		if(x){
			var y = x[0];
			if(y.indexOf("mod=view") > 0){
				var z = y.substring(y.indexOf('"')+1,y.lastIndexOf('"'));
				console.log(z);
				var u = z.match(/aid=\d*/);
				if(u){
					u = u[0];
					var numid = u.match(/=[0-9]*/);
					if(numid){
						console.log(numid[0].replace("=",""));
					}
				}
			}
		}
	},
	getId:function(str){

	},
	getContent:function(str){
		var x = str.match(/<td[^>]*id="article_content">[\s\S]*<\/td>/);
		if(x){
			var y = x[0];
			var z = y.indexOf("</td>");
			console.log(y.substring(0,z).replace(/<td[^>]*id="article_content">/,""));
		}
	}
};

function encode(obj){
   return unescape(obj.replace(/&#x/g,'%u').replace(/;/g,''));
}

function findCache(url,callback){
	ng.get(url,function(data){
		if(data){
			var href = data.match(/<a[\s\S]*>缓存页/g);
			console.log(href);
		}else{
			console.log("findCache succ , but no data");
		}
	},'utf8').on("error",function(e){
		console.log("findCache:fail");
	});
}

// ng.get(s_url,function(data,status,headers){
//     var title = $.getTit(data);
//     var date = $.getTime(data);
//     var link = $.getLink(data);
//     var content = $.getContent(data);
//     // var aid = 
//     if(title&&date&&link&&content){
//     	console.log(title,"\n");
//     	console.log(date,"\n");
//     	console.log(link,"\n");
//     	console.log(content,"\n");
//     }
// },'utf8').on('error', function(e) {
//     console.log("Got error: " + e.message);
//     var obj = "";
//    	var query = connection.query("insert into fail set ?",obj,function(err,rows){
//    		console.info(query.sql);
// 		if(err){
// 			console.log("fail:失败");
// 		}
// 	});
// });
var ca = "http://cn.bing.com/search?q=site%3Awww.waimaoezu.com+%E8%A7%86%E7%95%8C&go=%E6%8F%90%E4%BA%A4&qs=n&form=QBRE&pq=site%3Awww.waimaoezu.com+%E8%A7%86%E7%95%8C&sc=1-25&sp=-1&sk=&cvid=e8f21663c08a426f89b448fcdc670998";
// findCache(ca);

http://c.360webcache.com/c?m=c5ef7f021ef4903e70d717b08e78d45e&q=cache%3Awww.waimaoezu.com&u=http%3A%2F%2Fwww.waimaoezu.com%2Fportal.php%3Faid%3D281%26mod%3Dview

window.getElementById();