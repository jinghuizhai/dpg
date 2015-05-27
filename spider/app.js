// var jsdom = require('../node_modules/jsdom').jsdom;
var fs = require('fs');
var jquery = fs.readFileSync("./jquery.js", "utf-8");
var ng = require('../node_modules/nodegrass');
// var jquery = require("../node_modules/jquery");

function getSource(url,callback){
  ng.get(url,function(data,status,headers){

    makeDom(data,function(err,$){
      if(err){
        console.error(err);
      }else{
        console.log($("body").html());
      }
    });

  },'gbk').on('error', function(e) {
      console.log("抓取数据失败: " + e.message);
  });
}

/**
 * 使用jsdom将html跟jquery组装成dom
 * @param  {[type]}   html     需要处理的html
 * @param  {Function} callback 组装成功后将html页面的$对象返回
 * @return {[type]}            [description]
 */
function makeDom(html, callback) {
  jsdom.env({
    html: html,
    src: [jquery],
    done: function (errors, window) {
      var $ = window.$;
      callback(errors, $);
      window.close();   // 释放window相关资源，否则将会占用很高的内存
    }
  });
}


var url = "http://www.baidu.com";
// getSource(url);

console.log(jquery("<p>haha</p>").find("p").html());