mui.init({
	gestures: {
		swipe: false
	}
});

mui.plusReady(function() {
	var curWebview = plus.webview.currentWebview();
	//创建子页面 首页 选靓号 选套餐 买手机 上网卡
	var subpages = [{
		url: "html/HomePages.html",
		id: "html/HomePages.html"
	}, {
		url: "html/setmeal/setmeal.html",
		id: "html/setmeal/setmeal.html"
	}, {
		url: "html/phone/phone.html",
		id: "html/phone/phone.html"
	}, {
		url: "html/wifi/wificard.html",
		id: "html/wifi/wificard.html"
	}];
	var aniShow = "slide-in-right";

	var topnum = 64;
	var bottomnum = 50;

	localStorage.setItem("topnum", topnum) // 记录子页面距顶部距离
	localStorage.setItem("bottomnum", bottomnum) // 记录子页面距底部距离

	var subpage_style = {
		top: "64",
		bottom: bottomnum,
		scrollIndicator: true,
		bounce: 'vertical',
		bounceBackground: '#EB413D',
		waiting: {
			autoShow: true
		}
	};
	//创建子页面，首个选项卡页面显示，其它均隐藏；
	for(var i = 0; i < subpages.length; i++) {
		var temp = {};

		var sub = plus.webview.create(subpages[i].url, subpages[i].id, subpage_style);
		if(i > 0) {
			sub.hide();
		} else {
			temp[subpages[i]] = "true";
			mui.extend(aniShow, temp);
		}
		curWebview.append(sub);

	}
	//当前激活选项
	var activeTab = subpages[0].id;
	//选项卡点击事件
	mui('#footerNav').on('tap', 'a', function(e) {
		var targetTab = this.getAttribute('href');
		if(targetTab == activeTab) {
			return;
		}
		//显示目标选项卡
		plus.webview.show(targetTab, "slide-in-right", 300);
		var webView = plus.webview.getWebviewById(targetTab);
		//隐藏当前;
		plus.webview.hide(activeTab);
		//更改当前活跃的选项卡
		activeTab = targetTab;
	});
})

// 监听事件

window.addEventListener('gohome', function() {
	var defaultTab = document.getElementById("defaultTab");
	//模拟首页点击
	mui.trigger(defaultTab, 'tap');
	//切换选项卡高亮
	var current = document.querySelector(".mui-bar-tab>.mui-tab-item.mui-active");
	if(defaultTab !== current) {
		current.classList.remove('mui-active');
		defaultTab.classList.add('mui-active');
	}
});