//首次点开app时，显示rparty页，再次打开时不显示
mui.plusReady(function() {
				//读取本地存储，检查是否为首次启动
				var showGuide = plus.storage.getItem("lauchFlag");
				//仅支持竖屏显示
				plus.screen.lockOrientation("portrait-primary");
				if(showGuide) {
//					//有值，说明已经显示过了，无需显示；
//					plus.webview.currentWebview().close();
					plus.navigator.setFullscreen(false);
					//预加载
				} else {
					//显示启动导航
					mui.openWindow({
						id: 'rParty',
						url: 'guide/rParty.html',
						styles: {
							popGesture: "none"
						},
						show: {
							aniShow: 'none'
						},
						waiting: {
							autoShow: false
						}
					});
				}

})
