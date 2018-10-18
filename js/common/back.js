(function($, doc) {
	$.plusReady(function() {
		var backButtonPress = 0;
		$.back = function(event) {
			backButtonPress++;
			if(backButtonPress > 1) {
				plus.runtime.quit();
			} else {
				plus.nativeUI.toast('再按一次退出联通沃超越');
			}
			setTimeout(function() {
				backButtonPress = 0;
			}, 3000);
			return false;
		};
	});
}(mui, document));