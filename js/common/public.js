//后台接口地址
var interfaceUrl = 'http://zhdj.sxdygbjy.gov.cn:8701';
//var interfaceUrl = 'http://192.168.43.61:8086';

//返回数据
var retData = null;

//获取用户token
var userToken = "blank";
var sTemp = localStorage.getItem('token');
if(sTemp) {
	userToken = sTemp;
}

//获取登录用户ID 
var userID = 0;
var userinfo = JSON.parse(localStorage.getItem('userInfo'));
if(userinfo) {
	userID = userinfo.id;
}

var tools = {
	/**
	 * author songj
	 * @param url 后台接口地址
	 * @param param 入参
	 * desc:调用后台接口
	 * return: data.code=0 成功
	 * 		   data.code=-1失败 data.msg 失败原因
	 * 		   "" 返回空，证明网络等其他原因所致(与后台交互失败)
	 */
	//同步post方式请求数据
	postUrlData: function(url, param) {
		var mask = mui.createMask();
		retData = null;
		var paramFormat = JSON.stringify(param);
		mui.ajax(interfaceUrl + url, {
			data: paramFormat,
			dataType: 'json',
			type: 'POST',
			headers: {
				'Content-Type': 'application/json',
				token: userToken,
				userid: userID
			},
			timeout: 20000,
			async: false,
			success: function(data) {
				if(data) {
					retData = data;
				} else {
					retData = null;
				}
			},
			beforeSend: function() {
				plus.nativeUI.showWaiting();
				mask.show(); //显示遮罩层  
			},
			complete: function() {
				plus.nativeUI.closeWaiting();
				mask.close(); //关闭遮罩层  
			},
			error: function(data) {
				retData = null;
			}
		});
		return retData;
	},

	//异步post方式请求数据
	postAsyncUrlData: function(url, param, callback) {
		var paramFormat = JSON.stringify(param);
		mui.ajax(interfaceUrl + url, {
			data: paramFormat,
			dataType: 'json',
			type: 'POST',
			headers: {
				'Content-Type': 'application/json',
				token: userToken,
				userid: userID
			},
			timeout: 20000,
			async: true,
			success: function(data) {
				if(data) {
					callback(data);
				} else {}
			},
			error: function(data) {}
		});
	},

	//异步get方式请求数据
	getAsyncUrlData: function(url, param, callback) {
		mui.ajax(interfaceUrl + url, {
			data: param,
			dataType: 'json',
			type: 'GET',
			headers: {
				token: userToken,
				userid: userID
			},
			timeout: 20000,
			async: true,
			success: function(data) {
				if(data) {
					callback(data);
				} else {}
			},
			error: function(data) {

			}
		});
	},

	//格式化对象输出字符串
	objectToString: function(obj) {
		if(obj) {
			return JSON.stringify(obj);
		} else {
			return "";
		}
	},

	//将字符串转化成对象
	stringToObject: function(str) {
		if(str) {
			return JSON.parse(str);
		} else {
			return null;
		}
	},

	//得到地址栏参数值
	getUrlParamValue: function(key) {
		var reg = new RegExp(key + '=([^&]*)');
		var results = location.href.match(reg);
		return results ? results[1] : null;
	},

	//获取格式化日期
	getFormatDate: function(fmt) {
		var d = new Date();
		var o = {
			"M+": d.getMonth() + 1, //月份 
			"d+": d.getDate(), //日 
			"h+": d.getHours(), //小时 
			"m+": d.getMinutes(), //分 
			"s+": d.getSeconds(), //秒 
			"q+": Math.floor((d.getMonth() + 3) / 3), //季度 
			"S": d.getMilliseconds() //毫秒 
		};
		if(/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
		for(var k in o)
			if(new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	}
};