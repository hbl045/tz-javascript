"use strict";

/*
* 运动框架 （需要babel进行语法兼容处理）
* param:参数
*       ele - object 必须 表示要进行运动的节点
*       attr - string 必须 表示要改变的css属性
*       target - number 必须 表示属性的终点值
*       step - number 选填 表示运动速度的正数，默认5
* return:
*       undefined
*/

window.Move = function () {
    window.requestAnimationFrame = window.requestAnimationFrame || function (f) {return setTimeout(f, 1000 / 60)};
    window.cancelAnimationFrame = window.cancelAnimationFrame || clearTimeout;
    //做IE的兼容，若是就是使用定时器
    return function (ele, attr, target) {
        var step = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 5;

        //console.log(  getComputedStyle(ele)   );
        //console.log( ele.currentStyle );

        /*var cssObj=null;
        if( window.getComputedStyle ){
            cssObj = getComputedStyle(ele);
        }else{
            cssObj = ele.currentStyle;
        }*/

        //获取存储着ele展示样式的对象
        var cssObj = ele.currentStyle || getComputedStyle(ele);//同样是做了IE兼容 IE版本：ele.currentStyle
        //初始的值
        var sVal = parseFloat(cssObj[attr]);//parseFloat 字符串方法，遇到浮点数返回，即取整数值
        if( attr === "opacity" && isNaN(sVal) )sVal = 1;
        //考虑初始值与目标值大小的问题
        var bool = sVal > target;
        if (sVal > target) {
            step = -Math.abs(step);
        } else if (sVal < target) {
            step = Math.abs(step);
        } else {
            return;
        }

        function f() {
            sVal += step; // sVal += -step

            //判断是否到达目标值
            var xBool = bool ? sVal <= target : sVal >= target;
            sVal = xBool ? target : sVal;

            if (attr === "opacity") {
                ele.style.opacity = sVal;
                ele.style.filter = "alpha(opacity="+sVal*100+")";
            } else if( attr === "zIndex" ){
                ele.style.zIndex = sVal;
            } else{
                ele.style[attr] = sVal + 'px';
            }

            xBool || requestAnimationFrame(f);
        }
        requestAnimationFrame(f);
    };
}();