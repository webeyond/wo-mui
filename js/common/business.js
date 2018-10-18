//业务相关类
var business = {
	tips: {
		noTypein: "信息尚未录入",
		notAllowed: "只有注册登录用户才能浏览此功能",
		notJoinParty: "抱歉！您还未加入任何支部,是否现在申请加入？",
		applyFailed: "申请加入支部失败，请联系管理员",
		applysucceed: "申请加入支部成功，请耐心等待审核",
		notAllowedJoinParty: "对不起，您不能选择加入党委"
	},
	partyType: {
		village: 10, //行政村
		community: 11, //社区
		town: 12, //乡镇
		street: 13, //街道
		noPublic: 14, //非公企业
		society: 15, //社会组织
		country: 16, //国有企业
		college: 17, //高等院校(含大专)
		school: 18, //中小学(含中专)
		unit: 19, //机关单位
		hospital: 20, //医疗机构
		career: 21, //事业单位
		other: 22 //其他
	},

	newsCount: 10, //每次获取新闻条数

	//接口路径
	interfacePath: {
		//信息发布
		appListArtsRecentByDept: '/app/content/appListArtsRecentByDept', //获取最新信息列表
		GetArtbyid: '/app/content/GetArtbyid/', //获取信息详情
		ListArtsByRecommend: '/app/content/ListArtsByRecommend', //根据推荐位获取文章列表
		appListArtsRecentByDept: '/app/content/appListArtsRecentByDept', //根据部门获取文章列表
		ListArts: '/app/content/ListArts/', //获取信息列表

		//用户信息
		userLogin: '/app/user/login', //用户登录
		userReg: '/app/user/register', //用户注册
		userApplyJoinParty: '/app/user/applyJoinParty', //用户申请加入支部
		chgPassword: '/app/user/chgpwd', //用户修改
		userAuthority: '/app/user/appUserIfView', //用户支部权限
		userFgtPwd: '/app/user/fgtpwd', //用户忘记密码

		//部门信息
		getDeptDetail: '/app/detp/selectDeptDetailById', //获取部门详情
		getTempletByDeptId: '/app/detp/getTempletByDeptId', //获取部门模板
		selectTempletMapDetail: '/app/detp/selectTempletMapDetail', //获取部门地图
		getPartyLeadersLists: '/app/detp/getPartyLeaders', //获取班子成员信息
		getPartyMembersLists: '/app/detp/getPartymembers', //获取单元成员信息
		getPartyAllMembersLists: '/app/detp/getPartyAllMembers', //获取单元成员信息
		getDeptLists: '/app/detp/getDeptList/', //获取支部导航列表页面
		getDeptListsByKeyword: '/app/detp/selectDeptsByKeyWord', //根据关键词搜索部门列表
		getDeptListsByKeywords: '/app/detp/getDeptsByKeyWord/',
		getDeptAndUserCount: '/app/detp/getDeptAndUserCountByDeptID', //获取部门用户数量统计信息
		getSuperDeptID:'/app/detp/getSuperDeptID/',	//获取部门隶属的市级党委ID

		//通知公告
		getAceNoticeLists: '/app/notice/getNoticeByUserID/', //获取通知公告列表信息
		getAceNoticeNewsLists: '/app/notice/getNoticeDetail', //获取通知公告详情信息
		getAceNoticeSingDetail: '/app/notice/getNoticeSignDetail', //获取通知公告签阅人员列表信息
		updateSingNotice: '/app/notice/signNotice', //更改签阅状态

		//三会一课
		postUserConfState: '/appconf/userconfstate', //获取用户会议状态
		postThrSessionsLists: '/appconf/conflist', //获取三会一课会议列表
		postThrSessionsListDetail: '/appconf/confdetail', //获取三会一课会议列表详单
		postThrSessionsLevelEevent: '/appconf/confjoin', //获取三会一课会议列表详单
		postThrSessionsHaving: '/appconf/confsigndetail', //获取三会一课进行中会议详单
		postThrSessionsEndDetail: '/appconf/endconfdetail', //获取三会一课结束详单
		postThrSessoinsFeedBack: '/appconf/uploadConfSummary', //发布会议纪要接口
		postThrSessionsSummaryAunnx: 'http://221.204.48.159:8087/content/appUploadFile/4/', //会议上传附件地址

		//参与次数统计
		updateJoinTestCount: '/app/eventstatistics/updatevalue', //更新参与体验次数
		getJoinTestCount: '/app/eventstatistics/getvalue',

		//支部数量统计和党员数量统计
		getDeptAndUserCount: '/app/detp/getDeptAndUserCountByDeptID/',

		//系统接口
		getVersionFile: '/version/swzhdj/update.json', //请求升级文件

		//微课堂
		getJcsjUrl: '/appcommon/getJcsjUrl/',
		postScoreVideo:'/app/content/appScoreVideo',

		//考试积分
		recordExamAnswer: '/app/exam/answer/record', //记录考试成绩
		listExamTopic: '/app/exam/topic/list', //枚举试题
		getUserScore: '/app/score/getscore', //获取个人积分
		getUserScoreDetail: '/app/score/getdetail', //获取个人积分详情

		//党员排名
		postUserScoreDetail: '/app/score/getUserScoreOrder', //获取个人积分列表
		postUserOrderDetail: '/app/score/getUserOrderDetail', //获取个人积分列表

		//统计相关接口
		calculationChart: '/appchart/api/',//统计分析图表
		
		//视频会议接口
		postDeptVideo: '/app/video/getListDeptVideo', //获取部门所有视频
		postVideoUrl: '/app/video/getVideoUrl', //获取部门现场视频
		
		//个性化定制栏目
		getSetMenu: '/app/artmenu/list'  //设置栏目
		
		
	},
		
	getTemplateSubpath: function(depttype, type) {
		var path = "blank";
		switch(type) {
			case 1: //从支部导航中打开支部
				{
					path = "../../template/";
					break;
				}
			case 2: //从地图中打开支部
				{
					path = "../"
					break;
				}
			case 3: //从搜索中打开支部
				{
					path = "../wicket/template/";
					break;
				}
			case 4: //从组织结构中打开支部
				{
					path = "../../template/";
					break;
				}
			default:
				;
		}
		return path;
	},
	getRealSuperDeptID: function(deptid){
		return (deptid==13)?1:deptid;
	}
};