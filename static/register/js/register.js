/*
*author:QinXingjun
*for:H5注册登录页面
*/
String.prototype.niuStrFilter = function(){
  return this.replace(/</g,"&lt;").replace(/>/g,"&gt;");
};

registerHander = {

  //查看密码
  toggleEyes: function() {

    $("#eyes").on("mouseover touchstart",function(e){
      e.preventDefault();
      $("#password").attr("type","text");
      $(this).addClass("active");
    }).on("mouseout touchend",function(e){
      e.preventDefault();
      $("#password").attr("type","password");
      $(this).removeClass("active");
    });
  },

  //提交注册信息
  submitRegisterInfo: function() {

    var nickNameBox = $("#nickName");
    var passwordBox = $("#password");
    var eyes = $("#eyes");
    var errorBox = $("#error");
    var phoneNum = $.cookie("R_p");
    var userId = $.cookie("R_u");
    var eventId = $.cookie("R_e");

    $("#submitBtn").on("click",function(){

      var $this = $(this);
      var nickName = $.trim(nickNameBox.val());
      var password = passwordBox.val();

      if(!nickName){
        nickNameBox.addClass("focus");
        errorBox.html("请输入昵称");
        return false;
      }
      if(nickName.indexOf("一起牛") > -1){
        nickNameBox.addClass("focus");
        errorBox.html("昵称不能包含“一起牛”字样");
        return false;
      }
      if(nickName.indexOf("齐牛") > -1){
        nickNameBox.addClass("focus");
        errorBox.html("昵称不能包含“齐牛”字样");
        return false;
      }
      if(nickName.replace(/[\u4e00-\u9fa5]/g,"EE").length > 20){
        nickNameBox.addClass("focus");
        errorBox.html("您输入的内容超过最大上限");
        return false;
      }
      if($.trim(password).length === 0){
        passwordBox.addClass("focus");
        passwordBox.val("");
        errorBox.html("请输入密码");
        return false;
      }
      if(password.length < 6 || password.length > 16){
        passwordBox.addClass("focus");
        errorBox.html("密码格式为6-16位字符");
        return false;
      }

      if($this.hasClass("locked")){
        return false;
      }
      $this.addClass("locked");

      var param = {
        "phoneNum" : phoneNum,
        "eventId" : eventId,
        "userId" : userId,
        "nickname" : nickName.niuStrFilter(),
        "pwd" : password
      };

      J_h5niu.ajax(API.sendInfo,param,function(data){

        if(data.code === 0 || data.code === 1 || data.code === 2 || data.code === 3 || data.code === 4){
          if(data.result.cId){
            $.cookie("clientId", data.result.cId, {expires:365,pth:'/'});
          }
          if(data.result.nickName){
            $.cookie("qnUserName", data.result.nickName, {expires:365,pth:'/'});
          }
          $.cookie("R_c", data.code, {expires:365,pth:'/'});
          window.location.href="./result.html";
        }else{
          errorBox.html(data.message);
          $this.removeClass("locked");
        }
      });
    });
  }
};

//接口配置
var API = {

  //注册并加好友
  sendInfo: "data/web/register_send_info.json"
}

$(document).ready(function(){

  registerHander.toggleEyes();
  registerHander.submitRegisterInfo();

});
