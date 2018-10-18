var commonApi = ""; //域名

var config = {
	back: function() {
		mui.back = function() {
			//点击返回按钮时，返回到上一个webview
			mui.currentWebview.opener().show();
		}
	},
	ajaxTimeout: 60000, // ajax 请求过期时间
	topnum: 0,
	bottomnum: 0,
	loginId: function() {
		return localStorage.getItem("loginId")
	},
	token: function() {
		return localStorage.getItem("token")
	},
	removeLocalAttr: function(attr) {
		// 默认移除本地所有缓存数据
		if(attr == 'all') {
			localStorage.clear(); //清除应用所有的键值对存储数据
		} else if(attr == 'login') {
			localStorage.removeItem("loginId")
			localStorage.removeItem("token")
			localStorage.removeItem("userInfo")
		}
	},
	goLogin: function() {
		mui.toast("登录信息失效，请重新登录。")
		mui.openWindow({
			url: "/login.html",
			id: "login",
			styles: {
				top: 0,
				bottom: 0
			}
		})
	},
	goHome: function() {
		//跳转到主页
		mui.fire(plus.webview.getWebviewById('index'), 'gohome');
		mui.openWindow({
			url: "/index.html",
			id: "index",
			styles: {
				top: 0,
				bottom: 0
			},
			waiting: {
				autoShow: false
			}
		})
	},
	closeWatting: function() {

		var current = plus.webview.currentWebview();
		plus.webview.show(current, "slide-in-right", 400)
		plus.nativeUI.closeWaiting()
		return current
	},
	localStorage: {
		"login": { //登录
			"loginId": "loginId",
			"token": "token",
			"userInfo": "userInfo",
			"imgInfo": "imgInfo",
		}
	},
	tips: {
		email: "邮箱格式不正确",
		emailBlank: "请输入邮箱",
		passwordBlank: "请输入密码",
		passwordLength: "密码长度不能小于6位",
		loginFail: "用户名或密码错误",
		timeout: "检测到您的网络信号比较差，请重试。",
		signinFaile: "操作失败",
		signinSuccess: "操作成功",
		updateSigninSuccess: "修正成功",
		updateSigninFaile: "修正失败",
		noContent: "内容不能为空",
		noPhone:"请输入电话号码"
	}

}
//返回主页
function goHome() {
	config.goHome();
}