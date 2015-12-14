/*组合分享*/
var app = angular.module('myApp', []);
var ptfShareHandler = {

  ptfId: J_h5niu.getUrlParam("ptfId"),

  //为空处理
  isNull: function(t) {
    if(typeof t != "number"){
      return t ? t : "";
    }else{
      return t;
    }
  },

  //指数显示toggle
  yieldsBoxToggle: function() {
    var box = $("#yieldsBox"),
        tr = $("#yieldsTrTwo"),
        icon = $("#toggleBox");

    box.on("click",function(){
      if(tr.is(":hidden")){
        tr.slideDown(200);
        icon.removeClass("down").addClass("up");
      }else{
        tr.slideUp(200);
        icon.removeClass("up").addClass("down");
      }
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
  },

  yieldColor : function(n) {
    if(typeof n === "number"){
      if(n > 0){
        return 'text-red';
      }else if(n < 0){
        return 'text-green'
      }else{
        return '';
      }
    }
  },

  //百分比,不带正负号
  formatScale : function(dec) {

    if(typeof dec === "number") {
        return (dec*100).toFixed(2)+"%";
      }else{
        return "--";
      }
  },

  //百分比收益，带正负号
  formatYield : function(dec) {

    if(typeof dec === "number") {
          if(dec > 0){
            return '+' + (dec*100).toFixed(2) + "%";
          }else if(dec < 0){
            return '-' + (dec*100).toFixed(2)+"%";
          }else{
            return (dec*100).toFixed(2)+"%";
          }
      }else{
        return "--";
      }
  }
}

//接口配置
var API = {

 /*//页面初始化
  ptfShareInit: "data/web/ptf_share_init.json",

  //请求历史指数
  ptfIndex: "data/web/ptf_index_info.json"*/

 //页面初始化
  ptfShareInit: J_h5niu.host + "/yiqiniu-web-app/web/ptf_share_init",

  //请求历史指数
  ptfIndex: J_h5niu.host +  "/yiqiniu-web-app/web/ptf_index_info"
}

//控制器
app.controller("ptfShareCtrl",["$scope","$http","$sce",function HelloAjax($scope,$http,$sce){

  $http({
          method: "POST",
          url: API.ptfShareInit,
          data:{
            'ptfId':ptfShareHandler.ptfId
          }
      }).
      success(function(data, status) {
        if(data.code === 0){

          var res = data.result;

          $scope.dCustom = (res.uType === 1) ? '好友' : '投顾';

          $scope.busCon = res.busCon;//调仓详情

          $scope.uImg = res.uImg;
          $scope.pageTitle = res.name;
          $scope.ptfname = res.name;
          $scope.uName = res.uName;
          $scope.orgName = res.orgName;
          $scope.hasIconVip =(res.uType === 1) ? '' : $sce.trustAsHtml('<span class="vip" ng-bind-html="hasIconVip"><img src="../../static/common/images/icon_vip.png" title="认证投顾"/></span>');

          //累计收益
          $scope.tYieldColor = ptfShareHandler.yieldColor(res.tYield);
          $scope.tYield = ptfShareHandler.formatYield(res.tYield);
          $scope.isRealClass = parseInt(res.isReal) ? 'icon1' : 'icon2';
          $scope.isReal = parseInt(res.isReal) ? '实盘' : '模拟盘';

          $scope.tdYieldColor = ptfShareHandler.yieldColor(res.tdYield);
          $scope.tdYield = ptfShareHandler.formatYield(res.tdYield);//日涨跌
          $scope.stkWgt = ptfShareHandler.formatScale(res.stkWgt);//仓位
          $scope.ptfWinRate = ptfShareHandler.formatScale(res.ptfWinRate);//胜率
          $scope.favCnt = res.favCnt;//关注人
          $scope.mYield = ptfShareHandler.formatYield(res.mYield);//月收益
          $scope.yYield = ptfShareHandler.formatYield(res.yYield);//年收益
          $scope.ptfMaxRetrace = ptfShareHandler.formatYield(res.ptfMaxRetrace);//最大回撤
          $scope.volatility = '../../static/ptfshare/images/' + res.volatility + '.png';//波动率

          //调仓
          $scope.adjustTs = res.ts;//调仓时间



          $("#main").fadeIn();

        }else{
          ptfShareHandler.loadFailHtml("main",data.message);
        }
      }).
      error(function(data, status) {

        ptfShareHandler.loadFailHtml("main");
    });
}]);

$(document).ready(function(){

  ptfShareHandler.yieldsBoxToggle();
});