/*
* 本模块主要响应设置html的font-size，以便rem换算。
* 所有H5页面需要用rem做单位都可以调用此模块。
* 默认:1rem=100px，html的max-width为640.
*/
define(['jquery'],function($){

	var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
	var setPageSize = function() {
		var _doe = document.documentElement;
		var viewWidth = _doe.clientWidth;
		viewWidth = viewWidth >= 640 ? 640 : viewWidth;

		_doe.style.fontSize = (viewWidth / 3.2) + 'px';

	}
	setPageSize();
	$(window).on(resizeEvt,setPageSize);

});
