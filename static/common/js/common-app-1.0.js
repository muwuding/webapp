/*统计*/
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "//hm.baidu.com/hm.js?dad0aa192f8a6d4b251a552ff2f75e8a";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();

/*下载app*/
$(function(){
	
	var andriodURL = "http://api.yiqiniu.com:9000/app-official-release-0.1.100.apk";
	var iosURL     = "https://itunes.apple.com/zh/app/yi-qi-niu/id964690038?l=zh&ls=1&mt=8";
	
	var downBtn = $("#download");
	var master  = $("#master");
	var u = navigator.userAgent;
	var ua = u.toLowerCase();
		
	if(ua.indexOf("micromessenger")>-1){  
		downBtn.bind("click",function(){
			master.show();
		});	
		master.bind("click",function(){
			$(this).hide();
		});
	}else{
		if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
			downBtn.attr("href",andriodURL);
		}else if(u.indexOf('iPhone') > -1){
			downBtn.attr("href",iosURL);
		}
	}
});