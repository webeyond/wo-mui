var MI = {};

$(function() {
	MI.initPageDom();
	MI.loadClickEven();
	MI.loadNumClickEven();
//	MI.headFootFun();
	MI.loadMobileNotice();
	//异步加载
	setTimeout(function() {
		MI.loadNumberOptionReq();
	}, 3000);
});
MI.initPageDom = function() {
	$(".hot_package_box[date-type=2]").each(function() {
		if($(this).find('.mmodule').length < 1) {
			$(this).hide();
		}
	})
}
MI.loadNumClickEven = function() {
//	alert("1");
	//号码模块地市切换
	$('.area_pop1 ul li').click(function() {
		$('.area_pop1 ul li').removeClass('hover');
		$(this).addClass('hover');
		$("#cityCustId").text($(this).text());
		$("#cityCustId").attr("c", $(this).attr("c"));
		$('.area_pop1').hide();
		$('.mask').hide();
		$('body').removeClass('no-scroll');
		$(".numPatchChange").attr("i", "0");
		MI.loadNumberOptionReq();
	})
	//号码模块号码标签切换
	$('.num_pop ul span').click(function() {
		$('.num_pop ul li').removeClass('hover');
		$(this).addClass('hover');
		$('#numGroupCustId').text($(this).text());
		$('#numGroupCustId').attr("c", $(this).attr("c"));
		$('.num_pop').hide();
		$('.mask').hide();
		$('body').removeClass('no-scroll');
		$(".numPatchChange").attr("i", "0");
		MI.loadNumberOptionReq();
	});
	//换一批
	$(".numPatchChange").click(function() {
		var idx = parseInt($(".numPatchChange").attr("i"));
		$(".numPatchChange").attr("i", idx + 1);
		MI.numOptionHtmlMake();
	});
}

//号码模块逻辑
MI.numResultDataArray = [];
MI.numResultCheckArray = [];
MI.numberReqFun = function(params, callback) {
	$.ajax({
		url: Esf.contextPath + "/NumApp/NumberCenter/qryNum",
		type: "get",
		dataType: "JSON",
		async: false,
		data: params,
		success: function(result) {
			callback && callback(result);
		},
		error: function() {
			console.log("号码服务异常，请稍候再试");
		}
	});
}

MI.loadNumberOptionReq = function() {
	var allNumGroupData = $.parseJSON($("#hotNumListArea").html()) || [];
	if(allNumGroupData.length == 0 || Esf.provinceCode == "98") {
		return false;
	}
	//重置结果
	MI.numResultDataArray = [];
	MI.numResultCheckArray = [];
	var moreModelCount = 1;
	var moreModelUpdateCount = 1;
	var params = {};
	params.provinceCode = Esf.provinceCode || "";
	params.cityCode = $("#cityCustId").attr("c") || "";
	if(params.provinceCode == "" || params.cityCode == "") {
		return false;
	}
	params.jsonpTag = false;
	//查询类型：01：列表查询（未分组可销售池号码和分组可在列表页展示号码）02：组内号码查询(传默认02)
	params.qryType = "02";
	//查询类型 1、普通选号 2、靓号选号 3、全部（普通、靓号都包括）
	params.searchCategory = 3;

	var numParam;
	var custGroup = $("#numGroupCustId").attr("c") || "";
	
	console.log(custGroup);
	var moreModelTag = false;
	if(custGroup == "") {
		moreModelTag = true;
		moreModelNumReqOption();
	} else {
		oneModelNumReqOption();

	}

	function moreModelNumReqOption() {
		var groupCodeList = [];
		$.each(allNumGroupData, function(i, v) {
			groupCodeList.push(v.groupi);
		})
		var numDataList = numShuffle(allNumGroupData);
		for(var y = 0; y < numDataList.length; y++) {
			numParam = numDataList[y];
			moreModelUpdateCount = y + 1;
			params.groupKey = numParam['groupi'];
			MI.numberReqFun(params, function(res) {
				dataDecompress(res);
				if(moreModelCount == moreModelUpdateCount) {
					MI.numOptionHtmlMake();
				}
			});
		}
	}

	function oneModelNumReqOption() {
		$.each(allNumGroupData, function(i, v) {
			if(custGroup == v.groupi) {
				numParam = v;
			}
		})
		if(numParam.length < 1) {
			return false;
		}
		params.groupKey = numParam['groupi'];
		MI.numberReqFun(params, function(res) {
			dataDecompress(res);
			MI.numOptionHtmlMake();
		})
	}

	function dataDecompress(data) {
		var numMemoList = data['numRetailList'];
		var dataCompress = data['numArray'];
		var provinceShowHuiTag = data['provinceShowHuiTag'];
		var splitLen = parseInt(data['splitLen']);
		var goodsId = numParam['gi'];
		var tag = numParam['tag'];
		var low = numParam['low'];
		var high = numParam['high'];
		var cityCode = params.cityCode;
		var groupKey = params.groupKey;
		for(var i = 0; i < dataCompress.length; i += splitLen) {
			var numberDecompress = {};
			numberDecompress.serialNumber = dataCompress[i] + "";

			numberDecompress.firstNum = numberDecompress.serialNumber.substring(0, 3);
			if(low > 3) {
				numberDecompress.blackNumH = numberDecompress.serialNumber.substring(3, low - 1);
			}
			numberDecompress.redNum = numberDecompress.serialNumber.substring(low - 1, high);
			if(high < 4) {
				numberDecompress.blackNumT = numberDecompress.serialNumber.substring(3);
			} else if(high < 11) {
				numberDecompress.blackNumT = numberDecompress.serialNumber.substring(high);
			}

			numberDecompress.advanceLimit = (dataCompress[i + 1]) + "";
			numberDecompress.featureName = numMemoList[dataCompress[i + 2]];
			numberDecompress.cityCode = cityCode;
			numberDecompress.monthFeeLimit = dataCompress[i + 3] + "";
			numberDecompress.niceRule = dataCompress[i + 5] + "";
			numberDecompress.monthLimit = dataCompress[i + 6] + "";
			numberDecompress.groupKey = groupKey;
			if(provinceShowHuiTag == '1') {
				numberDecompress.tailNumTag = dataCompress[i + 7] + "";
			} else {
				numberDecompress.tailNumTag = '0';
			}
			numberDecompress.tag = tag;
			numberDecompress.goodsId = goodsId;
			if(moreModelTag && $.inArray(numberDecompress.serialNumber, MI.numResultCheckArray) == -1) {
				MI.numResultCheckArray.push(numberDecompress.serialNumber);
				MI.numResultDataArray.push(numberDecompress);
			} else {
				MI.numResultDataArray.push(numberDecompress);
			}
		}
	}
	//洗牌
	function numShuffle(allNumGroupData) {
		var result = [];
		if(allNumGroupData.length > 3) {
			moreModelCount = 3;
			result.push(allNumGroupData[0]);
			result.push(allNumGroupData[1]);
			result.push(allNumGroupData[2]);
			return result;
		} else {
			moreModelCount = allNumGroupData.length;
			return allNumGroupData;
		}
		/**
		 //要取得的个数，表示我们要从原数组中随机取3个元素
		 var COUNT = 2;
		 //保存结果的数组
		 var result = [];
		 var m = allNumGroupData.length;
		 if(m <= COUNT ){
		    return allNumGroupData;
		}
		 while (m && result.length < COUNT) {
		    // 随机选取一个元素…
		    var i = Math.floor(Math.random() * m--);
		    var  t = allNumGroupData[m];
		    allNumGroupData[m] = allNumGroupData[i];
		    allNumGroupData[i] = t;
		    result.push(allNumGroupData[m]);
		}
		 return result;**/
	}

}

MI.numOptionHtmlMake = function() {
	var data = {};
	if(MI.numResultDataArray.length < 1) {
		data.emptyDataList = new Array(8);
	} else {
		data.optionDataList = MI.obtainNumShowData();
		if(data.optionDataList.length < 8) {
			data.emptyDataList = new Array(8 - data.optionDataList.length);
		}
	}
	$("#numDataBroad").empty();
	$("#numDataListTmpl").tmpl(data).appendTo($("#numDataBroad"));
}
MI.obtainNumShowData = function() {
	var idx = parseInt($(".numPatchChange").attr("i"));
	var start = idx * 8;
	var end = (idx + 1) * 8 - 1;
	var result = [];
	for(var i = 0; i <= end - start; i++) {
		var data = MI.numResultDataArray[start + i];
		if(typeof(data) !== 'undefined' && data != "") {
			var goodsId = data.goodsId;
			var serialNumber = data.serialNumber + "^";
			//2.号码预存款单位（元）
			var advanceLimit = (data.advanceLimit || "0").toString() + "^";

			//3.号码描述
			var featureName = (data.featureName || "").toString() + "^";
			//4.号码等级金额
			var numGradeMoney = "0^";
			//5.
			var provinceCode = Esf.provinceCode + "^";
			//6.
			var cityCode = data.cityCode + "^";
			//7
			var cityName = $(".area_pop1 li[c=" + data.cityCode + "]").text() + "^";
			//8.靓号标志位
			var niceRule = (data.niceRule || "").toString() + "^";
			//号码月消费单位 (元）
			var monthFeeLimit = (data.monthFeeLimit || "0").toString() + "^";
			//协议期
			var monthLimit = (data.monthLimit || "0").toString() + "^";
			//号码组
			var groupKey = data.groupKey;
			var rediectHref = Esf.MobileMallIndex + "/mobilegoodsdetail/" + goodsId + ".html?numParam=" + serialNumber + advanceLimit +
				featureName + numGradeMoney + provinceCode + cityCode + cityName + niceRule + monthFeeLimit + monthLimit + groupKey;
			data.optionHref = rediectHref;
			result.push(data);
		}
	}
	if(idx > 0 && result < 8) {
		$(".numPatchChange").attr("i", "0");
	}
	return result;
}

//商城首页公告处理
MI.loadMobileNotice = function() {
	if(Esf.DecoraterOp == "EDIT") {
		return;
	}
	//赵新宇
	var provinceCode = Esf.provinceCode;
	var noticeJsUrl = Esf.MallMobileResPath + "/res/static/notice/NOTICE" + provinceCode + ".js?t=" + new Date().getTime();
	var noNotice = "<li><a href='javascript:void(0)' class='cGray'>暂无公告</a></li>";
	$.getScript(noticeJsUrl, function() {
		var indexMobileNoticeList = "";
		var indexNum = 0;
		if(typeof(indexMobileNotice) != "undefined" && indexMobileNotice != null) {
			$.each(indexMobileNotice, function(i, obj) {
				//取前5个公告资询
				if(indexNum < 5) {
					indexNum = indexNum + 1;
					var url = Esf.MobileMallIndex + "/mall-mobile/Notice/content?noticeId=" + obj.id;
					if(typeof(obj.url) != "undefined" && obj.url != null && "" != $.trim(obj.url)) {
						url = obj.url;
					}
					var str = obj.title;
					if(str.length > 18) {
						str = obj.title.substring(0, 18);
					}
					indexMobileNoticeList += "<a href=" + url + "><p>" + str + "</p><p class='red'>" + obj.noticeLable + "</p></a>";
				}
			});
		}

		if("" != indexMobileNoticeList) {
			$("#noticeUL").html(indexMobileNoticeList);
		}
		if("" == indexMobileNoticeList) {
			$("#noticeUL").html(noNotice);
		}

	});

}
//版本控制
//MI.headFootFun = function() {
//	// 如果为手机厅版本，则隐藏导航及页尾
//	if(App.versionType == "iphone" || App.versionType == "android" || App.versionType == "client" ||
//		App.versionType == "o2m") {
//		$(".header1").hide();
//	}
//}

MI.loadClickEven = function() {
	$('.go_top').click(function() {
		$('html,body').animate({
			scrollTop: '0px'
		}, 100);
	});

//	$(".banner_img").banner();
	$('.area_change').click(function() {
		$('.area_pop1').show();
		$('.mask').show();
		$('body').addClass('no-scroll');
	})
	$('.mask').click(function() {
		$('.area_pop1').hide();
		$('.num_pop').hide();
		$('.area_pop2').hide();
		$('.mask').hide();
		$('body').removeClass('no-scroll');
	})
	$('.num_change').click(function() {
		$('.num_pop').show();
		$('body').addClass('no-scroll');
		$('.mask').show();
	})
	$('.area_close').click(function() {
		$('.area_pop1').hide();
		$('.mask').hide();
		$('body').removeClass('no-scroll');
	})
	$('.num_close').click(function() {
		$('.num_pop').hide();
		$('.mask').hide();
		$('body').removeClass('no-scroll');
	})
	$('.list_head div').click(function() {
		$('.list_head div').removeClass('hover');
		$(this).addClass('hover');
	})

	$('.provinceSel').click(function() {
		$('.area_pop2').show();
		$('.mask').show();
		$('body').addClass('no-scroll');
	})
	$('.area_pop2 ul li a').click(function() {
		$('.area_pop2 ul li a').removeClass('hover');
		$(this).addClass('hover');
		$('.provinceSel').text($(this).text());
	})
	$('.area2_close').click(function() {
		$('.area_pop2').hide();
		$('.mask').hide();
		$('body').removeClass('no-scroll');
	})
	MI.pageAdaptive();

	function scrollTxt() {
		var controls = {},
			values = {},
			t1 = 500,
			/*播放动画的时间*/
			t2 = 2000,
			/*播放时间间隔*/
			si;
		controls.rollWrap = $("#roll-wrap");
		controls.rollWrapUl = controls.rollWrap.children();
		controls.rollWrapLIs = controls.rollWrapUl.children();
		values.liNums = controls.rollWrapLIs.length;
		values.liHeight = controls.rollWrapLIs.eq(0).height();
		values.ulHeight = controls.rollWrap.height();
		this.init = function() {
			autoPlay();
		}
		/*滚动*/
		function play() {
			controls.rollWrapUl.animate({
				"margin-top": "-" + values.liHeight
			}, t1, function() {
				$(this).css("margin-top", "0").children().eq(0).appendTo($(this));
			});
		}
		/*自动滚动*/
		function autoPlay() {
			/*如果所有li标签的高度和大于.roll-wrap的高度则滚动*/
			if(values.liHeight * values.liNums > values.ulHeight) {
				si = setInterval(function() {
					play();
				}, t2);
			}
		}

	}
	new scrollTxt().init();
}
MI.pageAdaptive = function() {
	/*套餐手机展示窗口*/
	var length1 = $('.hot_phone_box .box ul li').length - 4;
	var length11 = length1 + 4;
	var nummom1 = length1 * 30 / 100 + 1.39;
	var num1 = Math.round(nummom1 * 10000) / 100.00 + "%";
	$('.hot_phone_box .box ul').width(num1);
	var nummom11 = 1 / length11 - 0.03 + 0.01 * (length1 - 1);
	var num11 = Math.round(nummom11 * 10000) / 100.00 + "%";
	$('.hot_phone_box .box ul li').width(num11);
	var length2 = $('.hot_box_box .box ul li').length - 4;
	var length21 = length2 + 4;
	var nummom2 = length2 * 30 / 100 + 1.39;
	var num2 = Math.round(nummom2 * 10000) / 100.00 + "%";
	$('.hot_box_box .box ul').width(num2);
	var nummom21 = 1 / length21 - 0.03 + 0.01 * (length2 - 1);
	var num21 = Math.round(nummom21 * 10000) / 100.00 + "%";
	$('.hot_box_box .box ul li').width(num21);
	// 查看更多
	if(length2 === 0) {
		$('.hot_box_box .box ul').width('139.5%');
		$('.hot_box_box .box ul li').width('21.7%');
		$('.hot_box_box .box ul .more').width('8.55%');
	} else if(length2 === 1) {
		$('.hot_box_box .box ul').width('169.4%');
		$('.hot_box_box .box ul li').width('17.7%');
		$('.hot_box_box .box ul .more').width('7.05%');
	} else if(length2 === 2) {
		$('.hot_box_box .box ul').width('202%');
		$('.hot_box_box .box ul li').width('15%');
		$('.hot_box_box .box ul .more').width('5.95%');
	} else if(length2 === 3) {
		$('.hot_box_box .box ul').width('231%');
		$('.hot_box_box .box ul li').width('12.9%');
		$('.hot_box_box .box ul .more').width('5.15%');
	} else if(length2 === 4) {
		$('.hot_box_box .box ul').width('261%');
		$('.hot_box_box .box ul li').width('11.45%');
		$('.hot_box_box .box ul .more').width('4.5%');
	} else if(length2 === 5) {
		$('.hot_box_box .box ul').width('291%');
		$('.hot_box_box .box ul li').width('10.24%');
		$('.hot_box_box .box ul .more').width('4.05%');
	} else if(length2 === -1) {
		$('.hot_box_box .box ul').width('107%');
		$('.hot_box_box .box ul li').width('28%');
		$('.hot_box_box .box ul .more').width('11.15%');
	}
	if(length1 === 0) {
		$('.hot_phone_box .box ul').width('139.5%');
		$('.hot_phone_box .box ul li').width('21.7%');
		$('.hot_phone_box .box ul .more').width('8.55%');
	} else if(length1 === 1) {
		$('.hot_phone_box .box ul').width('169.4%');
		$('.hot_phone_box .box ul li').width('17.7%');
		$('.hot_phone_box .box ul .more').width('7.05%');
	} else if(length1 === 2) {
		$('.hot_phone_box').width('202%');
		$('.hot_phone_box .box ul li').width('15%');
		$('.hot_phone_box .box ul .more').width('5.95%');
	} else if(length1 === 3) {
		$('.hot_phone_box .box ul').width('231%');
		$('.hot_phone_box .box ul li').width('12.9%');
		$('.hot_phone_box .box ul .more').width('5.15%');
	} else if(length1 === 4) {
		$('.hot_phone_box .box ul').width('261%');
		$('.hot_phone_box .box ul li').width('11.45%');
		$('.hot_phone_box .box ul .more').width('4.5%');
	} else if(length1 === 5) {
		$('.hot_phone_box .box ul').width('291%');
		$('.hot_phone_box .box ul li').width('10.24%');
		$('.hot_phone_box .box ul .more').width('4.05%');
	} else if(length1 === -1) {
		$('.hot_phone_box .box ul').width('107%');
		$('.hot_phone_box .box ul li').width('28%');
		$('.hot_phone_box .box ul .more').width('11.15%');
	}
}