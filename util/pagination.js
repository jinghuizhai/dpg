/*测试参数
var objs = {
	base:"/article/",
	limit:4,
	now:5,
	total:16
};*/

function pagination(obj){
	var base = obj.base;
	var limit = obj.limit || 2;
	var now = obj.now || 1;
	var total = obj.total || 1;
	var left = "";
	var right = "";
	var s = "<i>...</i>";
	// 没有记录时默认显示至第一页
	if(total == 0){
		return "<p class='pagination'><a href='javascript'>1</a></p>";
	}
	// 递归减法
	function its(l){
		if(l > 0){
			var n = now - l;
			if(n > 0){
				left = left + "<a href='"+base+n+"'>"+n+"</a>";
			}
			l --;
			its(l);
		}
	}
	// 递归加法
	function itp(n){
		var n = n + 1;
		if(n <= total && n <= now + limit){
			right = right + "<a href='"+base+n+"'>"+n+"</a>";
			itp(n);
		}
	}
	its(limit);
	itp(now);

	if(total - now > limit+1){
		right = right + s;
	}
	if(total - now > limit){
		 right = right + "<a href='"+base+total+"'>"+total+"</a><a href='"+base+(now+1)+"'>next</a>";
	}
	if(now - limit > 2){
		left = s+left;
	}
	if(now - limit > 1){
		left = "<a href='"+base+(now-1)+"'>pre</a><a href='"+base+"1'>1</a>"+left;
	}
	return "<p class='pagination'>"+left+"<b>"+now+"</b>"+right+"</p>";
}

exports.pagination = pagination;