/*H5加好友结果页*/

resultHander = {

   //页面初始化
  initialization: function() {

    var code = $.cookie("R_c");

    $("#resultTop").empty().append(resultHander.resultTopHtml(code));
    $("#main").fadeIn();
  },

  //结果文案
  resultTopHtml: function(code) {

    switch(code) {
      case "0":
        return '<div class="img"><img src="../../static/register/images/pic_send.png"/></div>' +
               '<div class="text">好友申请已发送</div>' +
               '<div class="more">对方通过审核后，你们就能成为好友</div>';
        break;
      case "1":
        return '<div class="img"><img src="../../static/register/images/pic_full.png"/></div>' +
               '<div class="text">添加好友失败</div>' +
               '<div class="more">你的好友数量已达上限，无法继续添加</div>';
        break;
      case "2":
        return '<div class="img"><img src="../../static/register/images/pic_success.png"/></div>' +
               '<div class="text">你们已经是好友</div>' +
               '<div class="more">去一起牛和好友打个招呼吧</div>';
        break;
      case "3":
        return '<div class="img"><img src="../../static/register/images/pic_fail.png"/></div>' +
               '<div class="text">添加好友失败</div>' +
               '<div class="more">不需要添加自己为好友哦</div>';
        break;
      case "4":
        return '<div class="img"><img src="../../static/register/images/pic_full.png"/></div>' +
               '<div class="text">添加好友失败</div>' +
               '<div class="more">您的投顾好友数已达上限，无法继续添加</div>';
        break;
      case "2105":
        return '<div class="img"><img src="../../static/register/images/pic_full.png"/></div>' +
               '<div class="text">添加好友失败</div>' +
               '<div class="more">您的投顾好友数已达上限，无法继续添加</div>';
        break;
      default:
        return '<div class="img"><img src="../../static/register/images/pic_fail.png"/></div>' +
               '<div class="text">添加好友失败</div>' +
               '<div class="more"></div>';
    }
  }
};

$(document).ready(function(){

  resultHander.initialization();

});
