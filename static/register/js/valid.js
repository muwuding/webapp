/*
*author:QinXingjun
*for:H5注册登录页面
*/
var validHander = {

  userId: J_h5niu.getUrlParam("userId"),

  clientId: $.cookie("clientId"),

  sessionId: null,

  //页面初始化
  initialization: function() {

    if(validHander.clientId || validHander.sessionId){

      var param = {
        userId: validHander.userId,
        cId: validHander.clientId,
        sId: validHander.sessionId
      };

      J_h5niu.ajax(API.addFriend,param,function(data){
        $.cookie("R_r", data.code, {expires:365,pth:'/'});
        window.location.href="./result.html";
      });
    }else{

      $("#userName").html($.cookie("qnUserName"));
      $("#main").fadeIn();
      validHander.validPhone();
    }
  },

  //手机号验证HTML
  validPhone: function() {
    var phoneNumBox = $("#phoneNum");
    var captchaBox = $("#captcha");
    var captchaBtn = $("#captchaBtn");
    var errorBox = $("#error");
    var time = 60;
    var timer;
    var eventId;

    //输入框
    $(".form-text").on("focus",function(){
      errorBox.html("");
    }).on("blur",function(){
      $(this).removeClass("focus");
    });

    //在cookie里去取昵称
    var cnickName = $.cookie("nickName");
    $("#peopleName").html(cnickName);

    //获取验证码
    $("#captchaBtn").on("click",function(){

      var $this = $(this);
      var phoneNum = $.trim(phoneNumBox.val());

      if(!/^1\d{10}$/.test(phoneNum)){
        phoneNumBox.addClass("focus");
        errorBox.html("请输入11位手机号");
        return false;
      }

      if($this.hasClass("locked")){
        return false;
      }

      $this.addClass("locked");
      countDown();

      var param = {
        "phoneNum" : phoneNum
      };

      J_h5niu.ajax(API.getCaptcha,param,function(data){
        if(data.result.eventId){
          eventId = data.result.eventId;
        }
        if(data.code !== 0){
          errorBox.html(data.message);
        }
        $this.removeClass("locked");
      });
    });

    //点击确定
    $("#submitBtn").on("click",function(){

      var $this = $(this);
      var phoneNum = $.trim(phoneNumBox.val());
      var captcha = $.trim(captchaBox.val());

      if(!phoneNum||!/^1\d{10}$/.test(phoneNum)){
        phoneNumBox.addClass("focus");
        errorBox.html("请输入11位手机号");
        return false;
      }
      if (!captcha){
        captchaBox.addClass("focus");
        errorBox.html("请输入验证码");
        return false;
      }

      //记录发送请求次数
      if($this.hasClass("locked")){
        return false;
      }
      $this.addClass("locked");

      var param = {
        phoneNum : phoneNum,
        captcha : captcha,
        evenId : eventId
      };

      J_h5niu.ajax(API.validPhone,param,function(data){
        if(data.code === 0){
          if(data.result.isReg === "Y"){
            //再去请求加好友接口
            var param = {
              phoneNum : phoneNum,
              captcha : captcha,
              evenId : eventId
            };
            J_h5niu.ajax(API.sendFriend,param,function(data){
              if(data.result.cId){
                $.cookie("clientId", data.result.cId, {expires:365,pth:'/'});
              }
              if(data.result.nickName){
                $.cookie("qnUserName", data.result.nickName, {expires:365,pth:'/'});
              }
              $.cookie("R_c", data.code, {expires:365,pth:'/'});
              window.location.href="./result.html";
            });
          }else{
            console.log("没有祖册");
            $.cookie("R_p", phoneNum, {expires:365,pth:'/'});
            $.cookie("R_e", eventId, {expires:365,pth:'/'});
            $.cookie("R_u", validHander.userId, {expires:365,pth:'/'});
            window.location.href ="./register.html";
          }
        }else{
          errorBox.html(data.message);
          $this.removeClass("locked");
        }
      },function(){
        $this.removeClass("locked");
      });
    });
  }
};

//接口配置
var API = {

  //直接加好友
  addFriend: "data/web/register_addfriend.json",

  //获取验证码
  getCaptcha: "data/common_api/fetch_captcha.json",

  //验证手机号
  validPhone: "data/common_api/valid_register.json",

  //验证加好友
  sendFriend: "data/web/register_send_request.json",

  //注册并加好友
  sendInfo: "data/web/register_send_info.json"
}

$(document).ready(function(){

  J_h5niu.initSessionId(validHander.sessionId,validHander.initialization);
});