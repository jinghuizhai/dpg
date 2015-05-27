/*传入分隔符参数
如"-",",","/" etc*/

Date.prototype.getWholeYear = function(sign){
	sign = sign ? sign : "/";
	var y = this.getFullYear(),
		m = this.getMonth()+1,
		d = this.getDate();
	return y+sign+m+sign+d;
};
Date.prototype.getWholeTime = function(sign){
	sign = sign ? sign : "/";
	var h = this.getHours(),
		mi = this.getMinutes(),
		s = this.getSeconds();
	return h+sign+mi+sign+s;
};

Date.prototype.getWeek = function(){
	return this.getDay();
};

/*字符串转化为日期对象*/
String.prototype.toDate = function(){
	var d = new Date(this);
	if(d == "Invalid Date"){
		d = null;
		console.error("String.proto.toDate:",this);
	}
	return d;
};
/*删除字符串的html标签
删除前先删除空格*/
String.prototype.removeHtml = function(){
	return this.replace(/\s/g,"").replace(/\<\/*\w*[\d\w\s]*\>/ig,"");
};
/*过滤特殊符号*/
String.prototype.filterSym = function(){
	return this.replace(/\<\/*(script|style)\s*\>/ig,"&lt;$1&gt;");
};
/*返回日期之间的时间间隔
必须是日期对象调用
参数可以是字符串或者日期对象
参数不合法时返回0*/
if(!Date.prototype.until){
	Date.prototype.until = function(obj){
		var d,t,sign,result;
		if(obj){
			d = new Date(obj);
			if(d == "Invalid Date"){
				return 0;
			}
		}else{
			d = new Date();
		}
		t = this.getTime() - d.getTime();
		sign = t > 0 ? '前':'后';
		t = Math.abs(t);
		var m = t/1000;//秒
		if(m > 1){
			m = t/(60*1000);//分钟
			if(m > 1){
				m = t/(60*1000*60);//小时
				if(m > 1){
					m = t/(60*1000*60*24);//天
					if(m > 1){
						m = t/(60*1000*60*24*7);//周
						if(m > 1){
							m = t/(60*1000*60*24*30);//月 not accurate
							if(m > 1){
								m = t/(60*1000*60*24*365);//年
								if(m > 1){
									if(m < 3){
										result = Math.round(m)+"年"+sign;
									}else{
										result = d.getWholeYear();
									}
								}else{
									result = Math.round(t/(60*1000*60*24*30))+"个月"+sign;
								}
							}else{
								result = Math.round(t/(60*1000*60*24*7))+"周"+sign;
							}
						}else{
							result = Math.round(t/(60*1000*60*24))+"天"+sign;
						}
					}else{
						result = Math.round(t/(60*1000*60))+"小时"+sign;
					}
				}else{
					result = Math.round(t/(60*1000))+"分钟"+sign;
				}
			}else{
				result = Math.round(t/1000)+"秒"+sign;
			}
		}else{
			result = t+"毫秒"+sign;
		}
		return result;
	};
}