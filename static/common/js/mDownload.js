/*
* 本模块主要判断不同系统链接到不同的下载地址。
* 所有H5页面有公司app下载页面都可以调用此模块。
* html结构、css样式需要保持一致。
*/
define(['jquery'],function($){

	var mod = {};
	mod.getUrl = function(btn,master,dialog){
		/*btn: 按钮的对象，
		master: 提示层，
		dialog：其他系统下载层*/

		var andriodURL = "http://api.yiqiniu.com:9000/app-official-release-0.1.100.apk";
		var iosURL     = "https://itunes.apple.com/zh/app/yi-qi-niu/id964690038?l=zh&ls=1&mt=8";
		var siteURL     = "http://www.yiqiniu.com";
		var u = navigator.userAgent;
		var ua = u.toLowerCase();
		
		if(ua.indexOf("micromessenger")>-1){  
			$(btn).bind("click",function(){
				$(master).show();
			});	
			$(master).bind("click",function(){
				$(this).hide();
			});
		}else{
			if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
				$(btn).attr("href",andriodURL);
			}else if(u.indexOf('iPhone') > -1){
				$(btn).attr("href",iosURL);
			}else {
				$(btn).attr("href",siteURL);
			}
		}
	}

	/* 抛出模块 */
	return mod;
});
