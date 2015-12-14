/*
*author:QinXingjun
*for:H5注册登录页面
*/
var cardHander = {

  userId : J_h5niu.getUrlParam("userId"),

  //为空处理
  isNull: function(t) {
    if(typeof t != "number"){
      return t ? t : "";
    }else{
      return t;
    }
  },

  //页面初始化
  initialization : function() {

    if(!cardHander.userId){

      cardHander.loadFailHtml("main");
    }else{
      var param = {
        userId : cardHander.userId
      };

      J_h5niu.ajax(API.cardInit,param,function(data){

        if(data.code === 0){
          if(data.result.uType === 1){

            /*普通用户*/
            $("title").text(data.result.nickname + "的投资名片【一起牛】");
            $("#main").empty().append(cardHander.ordinaryHtml(data.result)).fadeIn();

          }else if(data.result.uType === 2){

            /*投顾*/
            $("title").text(data.result.nickname + "的投资名片【一起牛】");
            $("#main").empty().append(cardHander.adviserHtml(data.result)).fadeIn();

            cardHander.echartTabsToggle();
            cardHander.DrawEchart();

          }else {
            cardHander.loadFailHtml("main");
          }
        }else{
          cardHander.loadFailHtml("main",data.message);
        }
      },function(){
        cardHander.loadFailHtml("main");
      });
    }
  },

  //普通用户页面
  ordinaryHtml: function(obj) {

    return '<div class="card-wrap">' +
            '<div class="card-box">' +
              '<div class="card-header">' +
                '<img src="../../static/common/images/logo120.png"/>' +
                '<h3>一起牛投资名片</h3>' +
              '</div>' +
              '<div class="card-container">' +
                '<div class="user-img">' +
                  '<img src="' + obj.userIcon + '"/>' +
                '</div>' +
                '<div class="user-name">' + obj.nickname + cardHander.checkGender(obj.gender) +
                '</div>' +
                '<div class="user-intro">' + cardHander.isNull(obj.sig) + '</div>' +
              '</div>' +
              '<div class="card-footer clearfix">' +
                '<div class="content">' +
                  '<i class="icon-1"></i>共<span class="text-orange">' + obj.ptfCnt + '</span>个组合&nbsp;&nbsp;' +
                  '<i class="icon-2"></i>最高收益<span class="' + cardHander.checkStkColor(obj.maxPer) + '">' + obj.maxPer + '</span>' +
                '</div>' +
              '</div>' +
              '<div class="card-footer-text">加个好友吧，来一起牛看我持仓的股票</div>' +
            '</div>' +
            '<div class="card-btn-box">' +
              '<a href="./valid.html?userId=' + obj.userId + '" class="btn">注册并加TA为好友</a>' +
            '</div>' +
          '</div>';
  },

  //投顾页面
  adviserHtml: function(obj) {

    return '<header class="adviser-header">' + cardHander.adviserHeaderHtml(obj) + '</header>' +
            cardHander.adviserGradeHtml(obj.investAbility) +
           '<div class="adviser-echart">' +
            cardHander.adviserYieldHtml(obj.investAbility) +
            '<ul class="echart-tabs clearfix" id="echartTabs">' +
              '<li class="active" data-m="month"><span>30天</span></li>' +
              '<li data-m="year"><span>今年以来</span></li>' +
            '</ul>' +
            '<div class="echart-box" id="echartBox">' +
              '<div id="month" class="echart-content current">' +
                '<div class="echart-line" id="monthChart"></div>' +
                '<div class="echart-text" id="monthText"></div>' +
              '</div>' +
              '<div id="year" class="echart-content">' +
                '<div class="echart-line" id="yearChart"></div>' +
                '<div class="echart-text" id="yearText"></div>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="adviser-intro">' +
            '<h2>个人简介</h2>' +
            '<div class="intro-content">' + obj.orgDesc + '</div>' +
          '</div>' +
          '<div class="adviser-footer">' +
            '<div class="footer-text">加我为投顾，即可查看我的投资观点，组合，群直播等精彩内容哦！</div>' +
            '<div class="btn-box">' +
              '<a href="./valid.html?userId=' + obj.userId + '" class="btn">加TA为我的投顾</a>' +
            '</div>' + cardHander.currentUserHtml(obj.userId) + '</div>';
  },

  //投顾头部HTML
  adviserHeaderHtml: function(obj) {

    return '<div class="clearfix">' +
              '<div class="user-img">' +
                '<span class="img">' +
                  '<img src="' + obj.userIcon + '"/>' +
                '</span>' +
                '<span class="vip">' +
                  '<img src="../../static/common/images/icon_vip.png" title="认证投顾" />' +
                '</span>' +
              '</div>' +
              '<div class="adviser-info">' +
                '<p class="adviser-name">' + obj.nickname + cardHander.checkGender(obj.gender) + '</p>' +
                '<p class="adviser-company">' + obj.adviserName + '<span>(' + obj.orgName + ')</span></p>' +
                '<p class="adviser-like">' + cardHander.isNull(obj.specialFields) + '</p>' +
              '</div>' +
            '</div>';
  },

  //投顾选股HTML
  adviserGradeHtml: function(obj) {

    return '<ul class="advier-grade clearfix">' +
            '<li>' +
              '<span class="grade-content">选股胜率' + obj.selWinRate + '</span>' +
              '<span class="grade-tag">' + obj.selPolicy + '</span>' +
            '</li>' +
            '<li>' +
              '<span class="grade-content">平均持仓' + obj.hldDay + '</span>' +
              '<span class="grade-tag">' + obj.hldPolicy + '</span>' +
            '</li>' +
            '<li>' +
              '<span class="grade-content">最大回撤' + obj.retracement + '</span>' +
              '<span class="grade-tag">' + obj.retracePolicy + '</span>' +
            '</li>' +
          '</ul>';
  },

  //投顾收益HTML
  adviserYieldHtml: function(obj) {

    return '<ul class="echart-grade clearfix">' +
              '<li>' +
                '<span class="echart-content">近一月收益</span>' +
                '<span class="echart-tag ' + cardHander.checkStkColor(obj.wYield) + '">' + obj.wYield + '</span>' +
              '</li>' +
              '<li>' +
                '<span class="echart-content">近一周收益</span>' +
                '<span class="echart-tag ' + cardHander.checkStkColor(obj.mYield) + '">' + obj.mYield + '</span>' +
              '</li>' +
              '<li>' +
                '<span class="echart-content">今年以来</span>' +
                '<span class="echart-tag ' + cardHander.checkStkColor(obj.yYield) + '">' + obj.yYield + '</span>' +
              '</li>' +
            '</ul>';
  },

  //当前缓存用户信息
  currentUserHtml: function(userId) {

    if(J_h5niu.isQN() === "N" && $.cookie("clientId") && $.cookie("qnUserName")){

      return '<div class="footer-user">' +
              '<span>当前登录：' + $.cookie("qnUserName") + '</span>' +
              '<a href="./valid.html?userId=' + userId + '">切换账号</a>' +
            '</div>';
    }else{
      return '';
    }
  },

  //判断性别
  checkGender: function(n) {

    if(n === 1){
      return '<img src="../../static/common/images/icon_man.png" title="男"/>';
    }else if(n === 0){
      return '<img src="../../static/common/images/icon_woman.png" title="女"/>';
    }else{
      return '';
    }
  },

  //股票收益颜色
  checkStkColor: function(str) {
    var s = str.substr(0,1);
     if(s === "+"){
      return "text-red";
     }else if(s === "-"){
      return "text-green";
     }else{
      return "";
     }
  },

  //生成走势图
  DrawEchart: function() {
    var optionM = {
          boxId : "monthChart",
          textId : "monthText",
          type : "M",
          userId : cardHander.userId,
          userName: "30天",
          ajaxUrl: API.investIndex
        }
        var optionY = {
          boxId : "yearChart",
          textId : "yearText",
          type : "Y",
          userId : cardHander.userId,
          userName: "今年以来",
          ajaxUrl: API.investIndex
        }
    DrawEChart(optionM);
    DrawEChart(optionY);
  },

  //走势图切换
  echartTabsToggle: function() {

    $("#echartTabs li").on("click",function(){
      $(this).siblings("li").removeClass("active");
      $(this).addClass("active");
      var m = $(this).data("m");
      $("#echartBox").children("div").removeClass("current");
      $("#" + m).addClass("current");
    });
  },

  //加载失败
  loadFailHtml: function(id,t) {
    var html = '<div class="load-fail-img">' +
                  '<img src="../../static/common/images/icon_fail.png" alt="cry"/>' +
               '</div>';
    if(t){
      html += '<div class="load-fail-text">' + t + '</div>';
    }else{
      html += '<div class="load-fail-text">页面加载失败！</div>';
    }

    $("#"+id).empty().append(html).fadeIn();
  }
};

//接口配置
var API = {

  /*//请求名片数据
  cardInit: "data/web/register_card_init2.json",

  //请求指数
  investIndex: "data/web/fetch_invest_index.json"*/

  //请求名片数据
  cardInit: J_h5niu.host + "/yiqiniu-web-app/web/register_card_init",

  //请求指数
  investIndex: J_h5niu.host +  "/yiqiniu-web-app/web/fetch_invest_index"
}

$(document).ready(function(){

  cardHander.initialization();
});