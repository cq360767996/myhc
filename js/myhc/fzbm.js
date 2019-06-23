define(["common", "ec"], function (sugon, ec) {
    var initPie1 = function(data,tb1,hb1) {
        $(".b2>div").eq(0).html(data[0].name + "：" + data[0].value1 + "%");
        $(".b2>div").eq(1).html("同比：" + tb1 + "%");
        $(".b2>div").eq(2).html("环比：" + hb1 + "%");

        $(".g2>div").eq(0).html(data[1].name + "：" + data[1].value1 + "%");

        $(".p2>div").eq(0).html(data[2].name + "：" + data[2].value1 + "%");

        Chart1 = ec.init(document.getElementById('pie11'));

        var dataStyle = {
            normal: {
                label: {
                    show: false
                },
                labelLine: {
                    show: false
                }
            }
        };
        var placeHolderStyle = {
            normal: {
                color: '#2f5884',
                label: {
                    show: true
                },
                labelLine: {
                    show: false
                }
            },
            emphasis: {
                color: '#2f5884'
            }
        };
        var option = {
            tooltip: {
                trigger: 'item',
                show: true,
                formatter: "{b} : {d}%",
                backgroundColor: 'rgba(0,0,0,0.7)', // 背景
                padding: [8, 10], //内边距
                extraCssText: 'box-shadow: 0 0 3px rgba(255, 255, 255, 0.4);' //添加阴影
            },
            series: [{
                name: 'Line 1',
                type: 'pie',
                clockWise: false,
                radius: ['67%', '75%'],
                center: ['35%', '55%'],
                itemStyle: dataStyle,
                hoverAnimation: false,
                startAngle: -90,
                label: {
                    borderRadius: '10',
                },
                data: [{
                    value: data[0].value1,
                    name: data[0].name,
                    itemStyle: {
                        normal: {
                            color: '#2ba5e8'
                        }
                    }
                },
                    {
                        value: data[0].value2,
                        name: '',
                        tooltip: {
                            show: false
                        },
                        itemStyle: placeHolderStyle
                    }
                ]
            },
                {
                    name: 'Line 2',
                    type: 'pie',
                    clockWise: false,
                    radius: ['51%', '59%'],
                    center: ['35%', '55%'],
                    itemStyle: dataStyle,
                    hoverAnimation: false,
                    startAngle: -90,
                    data: [{
                        value: data[1].value1,
                        name: data[1].name,
                        itemStyle: {
                            normal: {
                                color: '#40bcbc'
                            }
                        }
                    },
                        {
                            value: data[1].value2,
                            name: '',
                            tooltip: {
                                show: false
                            },
                            itemStyle: placeHolderStyle
                        }
                    ]
                },
                {
                    name: 'Line 3',
                    type: 'pie',
                    clockWise: false,
                    radius: ['35%', '43%'],
                    center: ['35%', '55%'],
                    itemStyle: dataStyle,
                    hoverAnimation: false,
                    startAngle: -90,
                    data: [{
                        value: data[2].value1,
                        name: data[2].name,
                        itemStyle: {
                            normal: {
                                color: '#8c6ccd',
                                label: {
                                    show: true
                                }
                            }
                        }
                    },
                        {
                            value: data[2].value2,
                            name: '',
                            tooltip: {
                                show: false
                            },
                            itemStyle: placeHolderStyle
                        }
                    ]
                }
            ]
        };

        Chart1.setOption(option);
    };

    var initPie2 = function(data) {
        var indicatorData = [], seriesData = [];
        for(var i=0;i<data.length;i++){
            indicatorData.push({text: data[i].name, max: data[i].value1});
            seriesData.push(data[i].value1);
        }

        Chart2 = ec.init(document.getElementById('pie22'));

        var option = {
            color: "#34e2ed",
            radar: [
                {
                    indicator: indicatorData,
                    center: ['50%', '55%'],
                    radius: '60%',
                    startAngle: 90,
                    splitNumber: 4,
                    shape: 'circle',
                    name: {
                        formatter: function (p1, p2) {
                            var str = "";
                            for(var i=0;i<p1.length;i++) {
                                if(i%4 == 3){
                                    str += p1[i] + "\n";
                                }else{
                                    str += p1[i];
                                }
                            }
                            str = str + ": " + p2.max + "%";
                            return str;
                        },
                        textStyle: {
                            fontSize: 12,
                            color:'#72ACD1'
                        }
                    },
                    splitArea: {
                        areaStyle: {
                            color: ['rgba(114, 172, 209, 0)',
                                'rgba(114, 172, 209, 0)', 'rgba(114, 172, 209, 0)',
                                'rgba(114, 172, 209, 0)', 'rgba(114, 172, 209, 0)'],
                            shadowColor: 'rgba(0, 0, 0, 0)',
                            shadowBlur: 10
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: 'rgba(73, 105, 144, 0.8)'
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: 'rgba(73, 105, 144, 0.8)'
                        }
                    }
                }
            ],
            series: [
                {
                    name: '雷达图',
                    type: 'radar',
                    itemStyle: {
                        normal: {areaStyle: {type: 'default'}},
                        emphasis: {
                            // color: 各异,
                            lineStyle: {
                                width: 4
                            }
                        }
                    },
                    data: [
                        {
                            value: seriesData,
                            name: '图一',
                            symbol: 'rect',
                            symbolSize: 5,
                            lineStyle: {
                                normal: {
                                    type: 'dashed'
                                }
                            }
                        }
                    ]
                }
            ]
        };

        Chart2.setOption(option);
    };

    var initBar1 = function (data) {
        var xData = [], yData = [];
        for(var i=0;i<data.length;i++) {
            xData.push(data[i].name);
            yData.push(data[i].value);
        }

        Chart8 = ec.init(document.getElementById('bar11'));

        var option = {
            tooltip : {
                trigger: 'axis',
                axisPointer : {
                    type : 'shadow'
                }
            },
            grid: {
                left: 45,
                right: 20,
                bottom: 15,
                top: 65,
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    axisTick: {show: false},
                    splitArea: {show: false},
                    data : xData,
                    axisLabel: {
                        interval: 0,
                        rotate: 35,
                        textStyle: {
                            color: '#5f707a'
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#426791'
                        }
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    axisTick: {show: false},
                    splitLine: {show: false},
                    splitArea: {show: false},
                    splitNumber: 3,
                    axisLabel: {
                        show: false
                    },
                    axisLine: {
                        show: false,
                        lineStyle: {
                            color: '#aaa6b4'
                        }
                    }
                }
            ],
            series : [
                {
                    name:'数值',
                    type:'bar',
                    barWidth: 20,
                    data: yData,
                    itemStyle: {
                        normal: {
                            borderWidth: 1,
                            borderColor: 'rgba(18, 86, 108, 0.5)',
                            color: new ec.graphic.LinearGradient(
                                0, 0, 0, 1,
                                [
                                    {offset: 0, color: '#4292cd'},
                                    {offset: 0.5, color: '#3376ad'},
                                    {offset: 1, color: '#25548a'}
                                ]
                            ),
                            label: {
                                show: true,
                                position: 'top',
                                textStyle: {
                                    color: '#5f707a'
                                },
                                formatter: function(param) {
                                    var tempStr = "TOP" + (param.dataIndex + 1) + "\n\n" + param.value;
                                    return tempStr;
                                }
                            }
                        }
                    }
                }
            ]
        };

        Chart8.setOption(option);
    };

    var initBar2 = function (data) {

        var xData = [], yData = [];
        for(var i=0;i<data.length;i++) {
            xData.push(data[i].name);
            yData.push(data[i].value);
        }

        Chart9 = ec.init(document.getElementById('bar22'));

        var option = {
            tooltip : {
                trigger: 'axis',
                axisPointer : {
                    type : 'shadow'
                }
            },
            grid: {
                left: 45,
                right: 20,
                bottom: 15,
                top: 65,
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    axisTick: {show: false},
                    splitArea: {show: false},
                    data : xData,
                    axisLabel: {
                        interval: 0,
                        rotate: 35,
                        textStyle: {
                            color: '#5f707a'
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#426791'
                        }
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    axisTick: {show: false},
                    splitLine: {show: false},
                    splitArea: {show: false},
                    splitNumber: 3,
                    axisLabel: {
                        show: false
                    },
                    axisLine: {
                        show: false,
                        lineStyle: {
                            color: '#aaa6b4'
                        }
                    }
                }
            ],
            series : [
                {
                    name:'数值',
                    type:'bar',
                    barWidth: 20,
                    data: yData,
                    itemStyle: {
                        normal: {
                            borderWidth: 1,
                            borderColor: 'rgba(18, 86, 108, 0.5)',
                            color: new ec.graphic.LinearGradient(
                                0, 0, 0, 1,
                                [
                                    {offset: 0, color: '#4292cd'},
                                    {offset: 0.5, color: '#3376ad'},
                                    {offset: 1, color: '#25548a'}
                                ]
                            ),
                            label: {
                                show: true,
                                position: 'top',
                                textStyle: {
                                    color: '#5f707a'
                                },
                                formatter: function(param) {
                                    var tempStr = "TOP" + (param.dataIndex + 1) + "\n\n" + param.value;
                                    return tempStr;
                                }
                            }
                        }
                    }
                }
            ]
        };

        Chart9.setOption(option);
    };

    var initLine1 = function(data) {
        var xData = [], yData = [];
        var len;
        if($(".year_month .selected").attr("id") == "one-year") {
            len = data.length;
        } else {
            len = data.length - 6;
        }
        for (var i = 0; i < len; i++) {
            xData.push(data[i].name);
            yData.push(data[i].value);
        }

        var sortArray = yData;
        sortArray = sortArray.filter(function (s) {
            return s;
        })
        sortArray.sort(function (a, b) {
            return a-b;
        });
        var min = sortArray[0];
        var max = sortArray[sortArray.length - 1];

        Chart5 = ec.init(document.getElementById('line11'));

        var option = {
            color: '#3cb2fc',
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                top: 60,
                bottom: 35,
                left: 45,
                right: 20
            },
            xAxis: [
                {
                    type: 'category',
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        onZero: false,
                        lineStyle: {
                            color: '#426791'
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#5f707a'
                        }
                    },
                    splitLine: {
                        show: false,
                        lineStyle: {
                            color: '#182744'
                        }
                    },
                    data: xData.reverse()
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    splitNumber: 4,
                    min: min,
                    max: max,
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        onZero: false,
                        lineStyle: {
                            color: '#426791'
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#5f707a'
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#426791'
                        }
                    }
                }
            ],
            series: [
                {
                    name:'数量',
                    showSymbol: true,
                    symbolSize: 8,
                    type:'line',
                    itemStyle : {
                        normal: {
                            label : {
                                show: true,
                                backgroundColor: '#2d78b2',
                                borderColor: '#3cb2fc',
                                borderWidth: '1',
                                borderRadius: [5, 5, 5, 5],
                                padding: [2, 2, 2, 2],
                                color: '#e6ecfa'
                            }
                        }
                    },
                    data: yData.reverse(),
                    color: function(param) {
                        var color = '#3cb2fc';
                        var cdata = Array.from(data);
                        cdata.reverse()
                        if($("#half-year").hasClass("selected")){
                            var position = cdata.length-6+param.dataIndex;
                            if(cdata[position].red) {
                                color = 'red';
                            }
                        }else if($("#one-year").hasClass("selected")){
                            if(cdata[param.dataIndex].red) {
                                color = 'red';
                            }
                        }
                        return color
                    }
                }
            ]
        };

        Chart5.setOption(option);
    };

    var initLine2 = function(data) {
        var xData = [], yData = [];

        var len;
        if($(".year_month2 .selected").attr("id") == "one-year2") {
            len = data.length;
        } else {
            len = data.length - 6;
        }

        for (var i = 0; i < len; i++) {
            xData.push(data[i].name);
            yData.push(data[i].value);
        }
        var sortArray = yData;
        sortArray = sortArray.filter(function (s) {
            return s;
        })
        sortArray.sort(function (a, b) {
            return a-b;
        });
        var min = sortArray[0];
        var max = sortArray[sortArray.length - 1];

        Chart6 = ec.init(document.getElementById('line22'));

        var option = {
            color: '#3cb2fc',
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                top: 60,
                bottom: 35,
                left: 45,
                right: 20
            },
            xAxis: [
                {
                    type: 'category',
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        onZero: false,
                        lineStyle: {
                            color: '#426791'
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#5f707a'
                        }
                    },
                    splitLine: {
                        show: false,
                        lineStyle: {
                            color: '#182744'
                        }
                    },
                    data: xData.reverse()
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    splitNumber: 4,
                    min: min,
                    max: max,
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        onZero: false,
                        lineStyle: {
                            color: '#426791'
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#5f707a'
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#426791'
                        }
                    }
                }
            ],
            series: [
                {
                    name:'数量',
                    showSymbol: true,
                    symbolSize: 8,
                    type:'line',
                    itemStyle : {
                        normal: {
                            label : {
                                show: true,
                                backgroundColor: '#2d78b2',
                                borderColor: '#3cb2fc',
                                borderWidth: '1',
                                borderRadius: [5, 5, 5, 5],
                                padding: [2, 2, 2, 2],
                                color: '#e6ecfa'
                            }
                        }
                    },
                    data: yData.reverse(),
                    color: function(param) {
                        var color = '#3cb2fc';
                        var cdata = Array.from(data);
                        cdata.reverse()
                        if($("#half-year2").hasClass("selected")){
                            var position = cdata.length-6+param.dataIndex;
                            if(cdata[position].red) {
                                color = 'red';
                            }
                        }else if($("#one-year2").hasClass("selected")){
                            if(cdata[param.dataIndex].red) {
                                color = 'red';
                            }
                        }
                        return color
                    }
                }
            ]
        };

        Chart6.setOption(option);
    };

    var getList = function(data, ele) {
        $(".list2").empty();
        $(".list2").html(ele);
        //标题1
        $("#bmTitle1").html("南京市公安局" + "110接处警满意度分析");
        $("#myd11").html(data.myd1 + "%");
        var tb1Img = (parseFloat(data.tb1) > 0 ? "../../img/myhc/increase.png" : (parseFloat(data.tb1) < 0?"../../img/myhc/decrease.png":"../../img/myhc/hold.png")),
            hb1Img = (parseFloat(data.hb1) > 0 ? "../../img/myhc/increase.png" : (parseFloat(data.hb1) < 0?"../../img/myhc/decrease.png":"../../img/myhc/hold.png"));
        $("#tb11").html(data.tb1 + "%");
        $("#hb11").html(data.hb1 + "%");
        $("#tb1Img").attr("src", tb1Img);
        $("#hb1Img").attr("src", hb1Img);

        //标题2
        $("#bmTitle2").html("南京市公安局" + "案件办理评价指数");
        $("#myd22").html(data.myd2 + "%");
        var tb2Img = (parseFloat(data.tb2) > 0 ? "../../img/myhc/increase.png" : (parseFloat(data.tb2) < 0?"../../img/myhc/decrease.png":"../../img/myhc/hold.png")),
            hb2Img = (parseFloat(data.hb2) > 0 ? "../../img/myhc/increase.png" : (parseFloat(data.hb2) < 0?"../../img/myhc/decrease.png":"../../img/myhc/hold.png"));
        $("#tb22").html(data.tb2 + "%");
        $("#hb22").html(data.hb2 + "%");
        $("#tb2Img").attr("src", tb2Img);
        $("#hb2Img").attr("src", hb2Img);

        $(".select_pannel3").empty();
        for(var i=0;i<data.data11.length;i++) {
            $(".select_pannel3").append("<option value='" + i + "'>"+ data.data11[i].name +"</option>");
        }

        initPie1(data.data1,data.tb1,data.hb1);

        initPie2(data.data4);

        $(".yearMomth1").unbind().bind("click", function() {
            $(".yearMomth1.selected").removeClass("selected");
            $(this).attr("class", "yearMomth1 selected");
            initLine1(data.data2);
        });
        $(".yearMomth1").eq(0).click();

        $(".yearMomth2").unbind().bind("click", function() {
            $(".yearMomth2.selected").removeClass("selected");
            $(this).attr("class", "yearMomth2 selected");
            initLine2(data.data5[$(".select_pannel3").val()]);
        });

        $(".select_pannel3").change(function() {
            initLine2(data.data5[$(".select_pannel3").val()]);
        });
        initLine2(data.data5[$(".select_pannel3").val()]);

        $(".newtab").unbind().bind("click", function() {
            $(".newtab.selected").removeClass("selected");
            $(this).attr("class", "newtab selected");
            initBar1(data.data3[$(".newtab").index(this)]);
        });
        $(".newtab").eq(0).click();

        $(".newtab2").unbind().bind("click", function() {
            $(".newtab2.selected").removeClass("selected");
            $(this).attr("class", "newtab2 selected");
            initBar2(data.data6[$(".newtab2").index(this)]);
        });
        $(".newtab2").eq(0).click();
    };

    return getList;
});