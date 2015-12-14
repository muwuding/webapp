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

require([ 'echarts', 'echarts/chart/line'], DrawEChartLine);
require([ 'echarts', 'echarts/chart/pie'], DrawEChartPie);

/*历史走势图，折线图回调函数*/
function DrawEChartLine(ec) {

	//绘图元素
	var chart = ec.init(document.getElementById('chartLine')),
		text  = $("#textLine");

	// 组合名称、ID
	var ptfName = $("#ptfname").val();
	var ptfId = $("#ptfId").val();

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
			data:[ptfName,'沪深300']
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
			name : ptfName,
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

	//Ajax获取数据
	$.ajax({
		type : "post",
		async : false, /*同步执行*/
		url : J_h5niu.host + "/web/ptf_index_info",
		dataType : "json",
		data : {
			"ptfId" : ptfId
		},
		success : function(result) {
			if (result) {
				if (result.dateList == "" || result.dateList.length == 1) {
					text.text("暂无历史收益").show();
				} else {
					option.xAxis[0].data = result.dateList;
					option.series[0].data = result.profitList;
					option.series[1].data = result.stDailykProfit;
					chart.hideLoading();
					chart.setOption(option);
				}
			} else {
				text.text("暂无数据").show();
			}
		},
		error : function(errorMsg) {
			text.text("暂无数据").show();
		}
	});
}


//股票行业配置，饼图回调函数
function DrawEChartPie(ec) {
	//元素声明
	var chart = ec.init(document.getElementById('chartPie'));
	var text = $("#textPie");

	//配置
	var option = {

			//渲染为图片
			renderAsImage:'true',

			//颜色值
			color : [
			         '#0172be','#e5a90a','#1eb3eb','#009de2','#0082c0','#0b7bc3',
			         '#015fa5','#006cb4','#0167b1','#005596','#014375','#d8e066',
			         '#b2d138','#68b833','#87c033','#67b82f','#1daa3a','#4fb231',
			         '#2fa630','#099f3b','#028b2f','#f4cc37','#de8a18','#e88705',
			         '#dd7007','#d56211','#de7108','#d4610e','#cb5518','#c74807'
			    ],

			//图例
		    legend: {
		        orient : 'vertical',
		        x : '50%',
		        y : '20px',
		        selectedMode : false,
		        textStyle : {
		        	fontFamily : 'Microsoft Yahei,Helvetica, Arial, sans-serif',
		        	align : 'left',
		        	color : '#666'
		        },
		        data : []
		    },

		    //拖拽重计算
		    calculable : false,

		    //绘图数据
		    series : [
		        {
		            name:'访问来源',
		            type:'pie',
		            startAngle:180,
		            radius : '80%',
		            center: ['25%', '50%'],

		            //指示线
		            itemStyle : {
		            	normal: {
		                    label: {
		                        show: false
		                    },
		                    labelLine: {
		                        show: false
		                    }
		                },
		                emphasis: {
		                    label: {
		                        show: false
		                    },
		                    labelLine: {
		                        show: false
		                    }
		                }
		            },
		        	data : []
		        }
		    ]
		};

	//解析json串
	var stkCate = $('#stkCate').val();
	if(stkCate == "" || stkCate == "[]"){
		text.text("暂无股票持仓").show();
		return;
	}
	var json = eval("("+stkCate+")");
	var arr=[];
	var arr2 = [],noData=1,o;
	$.each(json,function(index,data){
		/*如果占比信息有不为0的数据*/
		if(parseFloat(data.wgt)){
			noData = 0;
		}
		arr.push(data.cateName+" "+data.wgt+"%");
		o = {};
		o.name = data.cateName+" "+data.wgt+"%";
		o.value = parseFloat(data.wgt);
		arr2.push(o);
	});
	/*如果占比都为0，则显示文字*/
	if(noData){
		text.text("暂时无法获取持仓占比").show();
		return;
	}

	option.legend.data = arr.slice(0,5);
	option.series[0].data = arr2;

	chart.hideLoading();
	chart.setOption(option);
}