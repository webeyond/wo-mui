/**
 * 手机APP
 */
var App = {
    changeProvince : function() {
        // TODO:省份展示
        var url = document.location.href;
        var arr = url.match(/goodsId=(\d{2})(\d+)/);
        if (arr[1] != "99") {
            $("#province_detail option[value=" + arr[1] + "]").attr("selected", "selected");
        }
    },
    getVersionType : function() {
        if (this.version && this.version.length > 0) {
            return this.version.indexOf("iphone") >= 0 ? 'iphone'
                    : this.version.indexOf("android") >= 0 ? 'android' : this.version;
        }else{
            var cookieVer = $.cookie("MUT_V");
            if(cookieVer != null && cookieVer.length > 0){
                return cookieVer.split("@")[0].toLowerCase();
            }
        }
        return null;
    },
    getVersionNumByCookie : function() {
        var versionCookie = $.cookie('MUT_V');
        if (versionCookie && versionCookie.length > 0) {
            return versionCookie.split("@")[1];
        }
        return null;
    },
    /**
     * URL中加入ticket以及version参数
     * 
     * @param currUrl
     *            原始URL
     * @returns {String} 封装后的URL
     */
    getParamStr : function(currUrl) {
        if (this.ticket && this.ticket.length > 0) {
            var sep1 = currUrl.indexOf('?') > 0 ? '&' : '?';
            currUrl += sep1 + "ticket=" + this.ticket;
        }
        if (this.version && this.version.length > 0) {
            var sep2 = currUrl.indexOf('?') > 0 ? '&' : '?';
            currUrl += sep2 + "version=" + this.version;
        }

        return currUrl;
    },
    /**
     * 拉起登录页
     * 
     * @param storeUrl
     *            登录后的回调地址
     * @param loginUrl
     *            网页版使用的登录页
     */
    showLoginPage : function(storeUrl, loginUrl, callbackUrl) {
        // alert("versionType: " + this.versionType + " storeUrl:" + storeUrl);
        var storeUrl4Client = callbackUrl + storeUrl;
        if ('android' == this.versionType) {// 安卓
            js_invoke.interact("{\"type\":\"shoplogin\",\"shopUrl\":\"" + storeUrl4Client + "\"}");
            return;
        } else if ('iphone' == this.versionType) { // iphone
            window.location.href = "clientAction={\"type\":\"shoplogin\",\"shopUrl\":\"" + storeUrl4Client
                    + "\"}";
            return;
        }
        var redirectUrl = decodeURIComponent(loginUrl) + "&state=" + storeUrl;
        // 网页版
        window.location.href = redirectUrl;
    },

    /**
     * 返回到商城首页 下方5个按钮
     */
    showIndexPage : function(homeUrl) {
        if ('android' == this.versionType) { // 安卓
            js_invoke.interact("{\"type\":\"close\",\"msg\":\"\",\"url\":\"\"}");
            return;
        } else if ('iphone' == this.versionType) { // iphone
            window.location = "clientAction={\"type\":\"close\",\"msg\":\"\",\"url\":\"\"}";
            return;
        }
        // 网页版
        window.location.href = homeUrl;
    },
    checkLogin : function(callBackUrl) {
        var LoginState = false;
        var param = {};
        if (callBackUrl != null) {
            param.storeUrl = encodeURIComponent(callBackUrl);
        }
        $.ajax({
            type : "POST",
            url : Esf.contextPath + "/MCheckLogin/checkLogin",
            data : param,
            async : false,
            success : function(retMessage) {
                LoginState = true;
            }
        });
        return LoginState;
    }
};
function getParamVal(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return '';
}

(function() {
    App.ticket = getParamVal("ticket");
    App.version = getParamVal("version");
    if (App.version == null || App.version == '') {
        App.version = LS.item("_m_version");
    } else {
        LS.item("_m_version", App.version);
    }
    // 将verson写入cookie

    $.cookie("MUT_V", App.version, {
        path : "/"
    });
    // 将ticket写入cookie
    if(App.ticket == null || App.ticket == '' ){
        App.ticket = $.cookie("MUT_T");
    }else{
        //让cookies在5分钟后过期
        var now = new Date();
        now = new Date(now.getTime() + (5 * 60 * 1000));
        
        $.cookie("MUT_T", App.ticket, {path : "/" ,expires: now});
    }
    /**
     * App类型 android， iphone，其他（网页访问）
     */
    App.versionType = App.getVersionType();
    App.versionNum = App.getVersionNumByCookie();
    /**
     * 是否为通过网页访问
     */
    App.isWeb = App.versionType != 'android' && App.versionType != 'iphone'
            && App.versionType != 'ap';

})();
// 为页面中每个Form表单自动添加隐藏域
$(function() {
    if (App.version && App.version.length > 0) {
        $("form").each(function() {
            $(this).append("<input type='hidden' name='version' value='" + App.version + "' />");
        });
    }
    if (App.ticket && App.ticket.length > 0) {
        $("form").each(function() {
            $(this).append("<input type='hidden' name='ticket' value='" + App.ticket + "' />");
        });
    }

    // ajax调用全局处理
    var ajaxErrorHandler = function(XMLHttpRequest, textStatus, errorThrown) {
        var rspMsg = $.trim(XMLHttpRequest.responseText);
        // 兼容tomcat封装403返回responseText
        var index = rspMsg.indexOf("<u>");
        if (index > 0) {
            rspMsg = rspMsg.substr(index + 3);
            rspMsg = rspMsg.substr(0, rspMsg.indexOf("</u>"))
        }

        var rspArr = rspMsg.split("^_^");

        // -- 未登录用户跳转到登陆页面
        if (403 == XMLHttpRequest.status) {
            // 更改自动提交标记
            LS.item("autoSubmit", "1");
            // 删除cookie中的MUT
            $.cookie("MUT", "", {
                path : "/"
            });
            App.showLoginPage(rspArr[0], rspArr[1], rspArr[2]);
            return;
        }
        var msg = "当前访问用户过多，请稍后再试！";
        if (rspArr[1] != null && rspArr[1] != undefined) {
            msg = rspArr[1];
        }
        if (rspArr[1] == null || rspArr[1] == undefined) {
            // window.location.href="${e.res('/front/html/error_ye.htm')}";
            return;
        }
        alert(msg);
    };
    $.ajaxSetup({
        beforeSend : function() {
            $(".thickdiv,.loading").show();
        },
        complete : function() {
            $(".thickdiv,.loading").hide();
        },
        error : ajaxErrorHandler
    });

});
