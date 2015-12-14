
var loadIframe = null;
function createIframe(){
  var iframe = document.createElement("iframe");
    iframe.style.cssText = "display:none;width:0px;height:0px;";
    document.body.appendChild(iframe);
    loadIframe = iframe;
}

function redirect(){
  location.href="yiqiniu://yiqiniu.com";
  var t = Date.now();
  setTimeout(function(){
    // 之所以加个100 是因为settimeout不是那么准时
    if(Date.now()-t < 900){
      location.href="http://api.yiqiniu.com:9003/webstatic/download/index.html"
    }
  },900)

}
createIframe();