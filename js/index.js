(function($) {
	//初始化方法
	$.init();
	$.plusReady(function() {

		//搜索和我的方法
		$('#head').on('tap', 'a', function() {
			var id = this.getAttribute("data-wid");
			var titles = this.getAttribute("data-title");
			if(!titles) {
				titles = "";
			}
			if(!id) {
				id = this.getAttribute('href');
			}
			var src = this.getAttribute('data-src');
			console.log(src);
			if(!src) {
				var href = this.getAttribute('href');
				console.log(href);
				var id = this.getAttribute('data-wid');
				console.log(id);
				mui.openWindow({
					url: href,
					id: "party-search.html",
					styles: {
						top: 20,
						bottom: 0,
						bounce: 'vertical',
						bounceBackground: '#FF0000'
					},
					extras: {
						depSel: "depSel"
					},
					show: {
						duration: 300
					},
					waiting: {
						autoShow: true,
					}
				})
			}
		});
	});
}(mui));