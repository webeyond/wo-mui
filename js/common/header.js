function fullscreen() {
	// 设置应用全屏显示！
	plus.navigator.setFullscreen(true);
}

function unfullscreen() {
	// 设置应用非全屏显示！
	plus.navigator.setFullscreen(false);
}

function isfullscreen() {
	// 查询应用当前是否全屏显示！
	console.log("是否全屏：" + (plus.navigator.isFullscreen() ? "是" : "否"));
}

//设置沉浸式方法
function setStatusbarRed() {
	// 设置系统状态栏背景色为红色
	plus.navigator.setStatusBarBackground("#EB413D");
}

//设置游客进入头部样式
function unheader() {
	var ws = plus.webview.currentWebview();
	if(ws.name == "visitors") {
		localStorage.setItem("visitor", ws.name);
		console.log(localStorage.getItem("visitor"));
		$("#setList").css("display", "none");
		$("#searchList").css("margin-right", "-10px");
	}
}

function immersheader() {
	//判断是否支持沉浸式
	var isImmersedStatusbar = plus.navigator.isImmersedStatusbar();
	//获取系统状态栏高度
	var StatusbarHeight = plus.navigator.getStatusbarHeight();
	var headerH = $('.mui-bar-nav').eq(0).height();
	$('.mui-bar-nav').eq(0).css({
		
		height: (headerH + StatusbarHeight) + 'px',
		'paddingTop': StatusbarHeight + 'px'
	});
}

(function($) {
	//初始化方法
	$.init();
	$.plusReady(function() {
		setStatusbarRed();
		unfullscreen();
		unheader();
		immersheader();
	});
}(mui));
