define(["common", "ec"], function (sugon, ec) {
    var initLine1 = function(data) {
        var xData = [], yData = [];
        var len;
        if($(".yearMomth1.selected").attr("id") == "one-year") {
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
        });
        sortArray.sort(function (a, b) {
            return a-b;
        });
        var min = sortArray[0];
        var max = sortArray[sortArray.length - 1];

        Chart1 = ec.init(document.getElementById('line11'));

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

        Chart1.setOption(option);
    };

    var initLine2 = function(data) {
        var xData = [], yData = [];
        var len;
        if($(".yearMomth2.selected").attr("id") == "one-year2") {
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
        });
        sortArray.sort(function (a, b) {
            return a-b;
        });
        var min = sortArray[0];
        var max = sortArray[sortArray.length - 1];

        Chart2 = ec.init(document.getElementById('line22'));

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

        Chart2.setOption(option);
    };

    var initBar1 = function (data) {
        var xData = [], yData = [];
        for(var i=0;i<data.length;i++) {
            xData.push(data[i].name);
            yData.push(data[i].value);
        }

        Chart3 = ec.init(document.getElementById('bar11'));

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

        Chart3.setOption(option);
    };

    var getList = function(data, ele) {
        $(".list2").empty();
        $(".list2").html(ele);
        //修改dom

        //标题1
        var topTitle = "", chartTitle1 = "", chartTitle2 = "", chartTitle3 = "";
        if($("#place").val() == "指挥中心") {
            topTitle = "110接处警满意度分析";
            chartTitle1 = "110接处警回访业务量分析";
            chartTitle2 = "110接处警满意度走势";
            chartTitle3 = "110接处警满意度各单位情况";
        }else if($("#place").val() == "经济犯罪侦查支队") {
            topTitle = "经济案件办理评价指数分析";
            chartTitle1 = "经济案件回访业务量分析";
            chartTitle2 = "经济案件办理评价指数走势";
            chartTitle3 = "经济案件办理评价指数各单位走势";
        }else if($("#place").val() == "治安警察支队") {
            topTitle = "行政案件办理评价指数分析";
            chartTitle1 = "行政案件回访业务量分析";
            chartTitle2 = "行政案件办理评价指数走势";
            chartTitle3 = "行政案件办理评价指数各单位情况";
        }else if($("#place").val() == "刑事警察支队") {
            topTitle = "刑事案件办理评价指数分析";
            chartTitle1 = "刑事案件回访业务量分析";
            chartTitle2 = "刑事案件办理评价指数走势";
            chartTitle3 = "刑事案件办理评价指数各单位情况";
        }else if($("#place").val() == "出入境管理支队") {
            topTitle = "出入境业务办理满意度分析";
            chartTitle1 = "出入境回访业务量分析";
            chartTitle2 = "出入境业务办理满意度走势";
            chartTitle3 = "出入境业务办理满意度各单位情况";
        }
        $(".bmList .chartTitle").eq(0).html(chartTitle1);
        $(".bmList .chartTitle").eq(1).html(chartTitle2);
        $(".bmList .chartTitle").eq(2).html(chartTitle3);

        $("#bmTitle1").html($("#place").val() + topTitle);
        $("#myd11").html(data.myd1 + "%");
        var tb1Img = (parseFloat(data.tb1) > 0 ? "../../img/myhc/increase.png" : (parseFloat(data.tb1) == 0?"../../img/myhc/hold.png":"../../img/myhc/decrease.png")),
            hb1Img = (parseFloat(data.hb1) > 0 ? "../../img/myhc/increase.png" : (parseFloat(data.hb1) == 0?"../../img/myhc/hold.png":"../../img/myhc/decrease.png"));
        $("#tb11").html(data.tb1 + "%");
        $("#hb11").html(data.hb1 + "%");
        $("#tb1Img").attr("src", tb1Img);
        $("#hb1Img").attr("src", hb1Img);

        $(".yearMomth1").unbind().bind("click", function() {
            $(".yearMomth1.selected").removeClass("selected");
            $(this).attr("class", "yearMomth1 selected");
            initLine1(data.data1);
        });
        $(".yearMomth1").eq(0).click();

        $(".yearMomth2").unbind().bind("click", function() {
            $(".yearMomth2.selected").removeClass("selected");
            $(this).attr("class", "yearMomth2 selected");
            initLine2(data.data2);
        });
        $(".yearMomth2").eq(0).click();

        $(".newtab").unbind().bind("click", function() {
            $(".newtab.selected").removeClass("selected");
            $(this).attr("class", "newtab selected");
            initBar1(data.data3[$(".newtab").index(this)]);
        });
        $(".newtab").eq(0).click();
    };

    return getList;
});