/*引入echarts加载器*/
require.config({
  paths : {
    echarts : '../../static/common/js/libs/echarts'
  }
});

/*
 * 按需加载图表关于线性图、折线图的部分
 *加载完后异步执行DrawChart回调函数
 */

function DrawEChart(qnobj) {

  require([ 'echarts', 'echarts/chart/line'], DrawEChartLine);

  /*历史走势图，折线图回调函数*/
  function DrawEChartLine(ec) {

    //绘图元素
    var chart = ec.init(document.getElementById(qnobj.boxId)),
        text  = document.getElementById(qnobj.textId);

    // 图标参数
    var option = {

      //渲染为图片
      renderAsImage:'true',

      //绘图区
      grid : {
        borderWidth:0,
        x : 43,
        y : 40,
        x2 : 15,
        y2 : 35
      },

      //小数点
      pointDot : false,
      pointDotRadius : 0,

      //提示框
      tooltip : {
        trigger: 'axis',
        axisPointer :{
          type: 'cross',
          crossStyle: {
            color: '#ccc',
            width: 1,
            type: 'solid'
          }
        }
      },

      //图例
      legend: {
        x:43,
        y:20,
        itemWidth:12,
        itemHeight:4,
        textStyle:{
          color:'#666',
          fontSize:12
        },
        data:[qnobj.userName,'沪深300']
      },

      //X轴
      xAxis : [{
        type : 'category',
        boundaryGap : false,
        axisLine:{
          lineStyle:{
            color:'#f2f2f2',
            width:1,
            type:'solid'
          },
          //是否定位到0位置
          onZero:false
        },
        axisLabel:{
          textStyle:{
            color:'#999'
          }
        },
        splitNumber : 3,
        splitLine:{
          lineStyle:{
            type:'solid',
            color:'#fff'
          }
        },
        axisTick:{
          //不显示小标记
          show:false
        },
        scale:false,
        data : []
      }],

      //y轴
      yAxis : [ {
        type : 'value',
        boundaryGap : [0.1,-0.1],
        axisLine:{
          lineStyle:{
            color:'#fff',
            width:1
          }
        },
        axisLabel : {
          textStyle:{
            color:'#999'
          },
          formatter : function(value) {
            if (value != 0) {
              return value + "%";
            } else {
              return value;
            }
          }
        },
        splitNumber : 4,
        splitLine:{
          lineStyle:{
            type:'solid',
            color:'#f2f2f2'
          },
          onGap:false
        }

      }],

      //绘图数据
      series : [ {
        name : qnobj.userName,
        type : 'line',
        //平滑显示
        smooth:false,
        symbol : 'none',
        symbolSize : 1,
        itemStyle : {
          normal : {
            areaStyle : {
              type : 'default',
              color:'rgba(255,190,0,0.0)'
            },
            lineStyle : {
              color:'#ff5a00',
               width:2,
            }
          }
        },
        data : []
      }, {
        name : '沪深300',
        type : 'line',
        smooth:false,
        symbol : 'none',
        itemStyle : {
          normal : {
            lineStyle : {
              color:'#24a9fe',
              width:2
            }
          }
        },
        data : []
      }]
    };

    var param = {
      userId : qnobj.userId,
      type : qnobj.type
    }

    //Ajax获取数据
    $.ajax({
      type : "post",
      async : false, /*同步执行*/
      url : qnobj.ajaxUrl,
      dataType : "json",
      data: JSON.stringify(param),
      contentType:"application/json",
      success : function(result) {
        if (result) {
          if (result.dateList == "" || result.dateList.length == 1) {
            $(text).text("暂无历史收益").show();
          } else {
            option.xAxis[0].data = result.dateList;
            option.series[0].data = result.profitList;
            option.series[1].data = result.stDailykProfit;
            chart.hideLoading();
            chart.setOption(option);
          }
        } else {
          $(text).text("暂无数据").show();
        }
      },
      error : function(errorMsg) {
        $(text).text("暂无数据").show();
      }
    });
  }
}
