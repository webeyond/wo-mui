//设置应用全屏显示！
function fullscreen() {
	plus.navigator.setFullscreen(true);
}

(function($, doc) {
	//初始化方法
	$.init();
	$.plusReady(function() {

		//全屏方法
		//fullscreen();

		//登录校验方法
		//用户名
		var username = localStorage.getItem('username');
		if(username) {
			document.getElementById('account').value = username;
		}

		//记住密码设置
		var bSave = localStorage.getItem('savepassword');
		if(bSave && bSave == "1") {
			document.getElementById('savepassword').checked = true;
			var pwd = localStorage.getItem('password');
			if(pwd) {
				document.getElementById('password').value = pwd;
			}
		} else {
			document.getElementById('savepassword').checked = false;
		}

		document.getElementById('login').addEventListener('tap', function(event) {
			var userName = document.getElementById("account").value;
			var myPassword = document.getElementById("password").value;

			if(!userName.length) {
				mui.toast(config.tips.noPhone);
				return false;
			}
			if(!myPassword.length) {
				mui.toast(config.tips.passwordBlank);
				return false;
			}
			//是否记住密码
			var savepassword = document.getElementById('savepassword').checked;

//			var data = 1;
//			var data.code = 0;
			//			if(data > 0) {
			//				if(data.code == "0") {
			// 更新本地记录

			//打开index页
//			mui.fire(plus.webview.getWebviewById("index"), "refreshUserInfo");

			mui.openWindow({
				url: "index.html",
				id: "index",
				styles: {
					top: 0,
					bottom: 0
				},
				waiting: {
					autoShow: true
				},
			})
			//			}
		});

		//注册和忘记密码方法
		$('.login-txt').on('tap', 'a', function() {
			var id = this.getAttribute("data-wid");
			var titles = this.getAttribute("data-title");
			if(!titles) {
				titles = "";
			}
			if(!id) {
				id = this.getAttribute('href');
			}
			var href = this.getAttribute('href');
			mui.openWindow({
				url: href,
				id: id,
				styles: {
					top: 0,
					bottom: 0
				},
				show: {
					duration: 300
				},
				waiting: {
					autoShow: false,
				},
			})
		});
	});

}(mui, document));