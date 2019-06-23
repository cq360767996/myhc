/* Created by handsome qiu */
requirejs(["common", "ec"], function (sugon, ec) {
    //获取参数
    var params = window.dialogParams.split("--");
    var titleName = params[0];
    var id = params[1], searchRuler = JSON.parse(params[2]);
    searchRuler.id = id;
    // 诉求性质分析接口定义
    var getPopZhpjzs = function () {
        var ajaxObj = {
            url: sugon.interFaces.zxyp.rx.Zhpjzs,
            type: 'post',
            async: true,
            data: searchRuler
        };
        sugon.requestJson(ajaxObj, function (result) {
            drawPopZhpjzs(result.data);
        });
    };

    // 画诉求性质分析echarts图
    var drawPopZhpjzs = function (data) {
        var len = data.length;
        var xData = [], yData = [];
        var colorArr = ['#489EF1', '#F2D50F', '#FF7170', '#70C0B3', '#56ABE1', '#7FE3FB'];
        var transparentData = {
            value: 0,
            name: "",
            itemStyle: {
                normal: {
                    color: 'transparent'
                },
                label: {
                    show: false
                },
                labelLine: {
                    show: false
                }
            }
        };
        for (var i = 0; i < len; i++) {
            xData.push(data[i].name);
            var obj = {
                name: data[i].name,
                value: data[i].value,
                itemStyle: {
                    normal: {
                        color: colorArr[i],
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        }
                    }
                }
            };
            yData.push(obj);
        }
        for (var i = 0; i < len; i++) {
            yData.push(transparentData);
        }
        var chart = ec.init(document.getElementById('pop-zhpjzs'));

        var option = {
            calculable: true,
            tooltip: {
                trigger: 'item',
                formatter: '{b}:{c}'
            },
            series: [{
                type: 'pie',
                radius: [50, 140],
                avoidLabelOverlap: false,
                startAngle: 0,
                center: ['50%', '10%'],
                roseType: 'area',
                label: {
                    show: true,
                    formatter: function (param) {
                        return param.data.name + '\n' + param.data.value;
                    }
                },
                labelLine: {
                    show: true,
                    length: -5,
                    length2: 2
                },
                selectedMode: 'single',
                data: yData
            }]
        };
        chart.setOption(option);
    };

    // 各单位诉求量及满意度分析指数接口定义
    var getPopMyd = function () {
        var ajaxObj = {
            url: sugon.interFaces.zxyp.rx.Myd,
            type: 'post',
            async: true,
            data: searchRuler
        };
        sugon.requestJson(ajaxObj, function (result) {
            drawPopMyd(result.data);
        });
    };

    // 画各单位诉求量及满意度分析echarts图
    var drawPopMyd = function (data) {
        var xData = [], yData = [], iData = [], min = data[0].value1, max = data[0].value1, isShow = false,
            min2 = data[0].value2, max2 = data[0].value2, markData = [], startValue = 0, endValue = 100;
        if (data.length > 4) {
            endValue = Math.floor(4 / data.length * 100);
            isShow = true;
        }
        for (var i = 0; i < data.length; i++) {
            xData.push(data[i].name);
            yData.push(data[i].value1);
            iData.push(data[i].value2);
            min = Math.min(data[i].value1, min) - 5 >= 0 ? Math.min(data[i].value1, min) - 5 : Math.min(data[i].value1, min);
            max = Math.max(data[i].value1, max);
            min2 = Math.min(data[i].value2, min2) - 5 >= 0 ? Math.min(data[i].value2, min2) - 5 : Math.min(data[i].value2, min2);
            max2 = Math.max(data[i].value2, max2);
            if (data[i].selected) {
                markData = [
                    {name: data[i].name, value: data[i].value2, xAxis: -1, yAxis: data[i].value2},
                    {name: data[i].name, value: data[i].value2, xAxis: data.length, yAxis: data[i].value2}
                ]
            }
        }
        var chart = ec.init(document.getElementById('pop-myd'));

        var option = {
            color: '#2a9bd5',
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                show: true,
                data: ['分布情况', '满意度']
            },
            grid: {
                top: 20,
                bottom: 10,
                left: 0,
                right: 0,
                containLabel: true
            },
            dataZoom: [{
                type: "inside",
                start: startValue,
                end: endValue,
                zoomOnMouseWheel: false
            }, {
                show: isShow,
                type: "slider",
                height: 8,
                bottom: 0,
                handelSize: 0,
                zoomLock: true,
                textStyle: false
            }],
            xAxis: [
                {
                    type: 'category',
//                        interval: 'auto',
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#426791'
                        }
                    },
                    axisLabel: {
                        interval: 0,
                        textStyle: {
                            color: '#000'
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#c9d3df'
                        }
                    },
                    data: xData
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    splitNumber: 5,
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
                        formatter: "{value}",
                        textStyle: {
                            color: '#000'
                        }
                    },
                    splitLine: {
                        show: false,
                        lineStyle: {
                            color: '#c9d3df'
                        }
                    }
                },
                {
                    type: 'value',
                    splitNumber: 5,
//                        min: min2,
//                        max: max2,
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
                        formatter: "{value}%",
                        textStyle: {
                            color: '#000'
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#c9d3df'
                        }
                    }
                }
            ],
            series: [
                {
                    name: '分布情况',
                    yAxisIndex: 1,
                    barWidth: 15,
                    itemStyle: {
                        normal: {
                            barBorderRadius: 2,
                            label: {
                                show: false
                            }
                        }
                    },
                    color: '#03AFF1',
                    type: 'bar',
                    data: yData,
                    markLine: {
                        label: {
                            show: false
                        },
                        symbol: ["circle", "none"],
                        lineStyle: {
                            color: "red",
                            width: "1",
                            type: "dashed"
                        },
                        data: markData
                    }
                },
                {
                    name: '满意度',
                    showSymbol: true,
                    symbolSize: 8,
                    type: 'line',
                    color: "red",
                    data: iData
                }
            ]
        };

        chart.setOption(option);
    };

    // 群众诉求走势分析接口定义
    var getPopQzsqzsfx = function () {
        var ajaxObj = {
            url: sugon.interFaces.zxyp.rx.Qzsqzsgx,
            type: 'post',
            async: true,
            data: searchRuler
        };
        sugon.requestJson(ajaxObj, function (result) {
            drawPopQzsqzsfx(result.data);
        });
    };

    // 画群众诉求走势分析echarts图
    var drawPopQzsqzsfx = function (data) {
        var xData = [], yData = [], iData = [], min = data[0].value1, max = data[0].value1,
            min2 = data[0].value2, max2 = data[0].value2;
        for (var i = 0; i < data.length; i++) {
            xData.push(data[i].name);
            yData.push(data[i].value1);
            iData.push(data[i].value2);
            min = Math.min(data[i].value1, min) - 5 >= 0 ? Math.min(data[i].value1, min) - 5 : Math.min(data[i].value1, min);
            max = Math.max(data[i].value1, max);
            min2 = Math.min(data[i].value2, min2) - 5 >= 0 ? Math.min(data[i].value2, min2) - 5 : Math.min(data[i].value2, min2);
            max2 = Math.max(data[i].value2, max2);
        }
        var chart = ec.init(document.getElementById('pop-qzsqzsfx'));

        var option = {
            color: '#2a9bd5',
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                show: true,
                data: ['去年', '今年']
            },
            grid: {
                top: 25,
                bottom: 25,
                left: 40,
                right: 40
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
                        interval: 0,
                        textStyle: {
                            color: '#000'
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#c9d3df'
                        }
                    },
                    data: xData
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: '去年',
                    showSymbol: true,
                    symbolSize: 8,
                    type: 'line',
                    color: "#04B0F0",
                    data: yData
                },
                {
                    name: '今年',
                    showSymbol: true,
                    symbolSize: 8,
                    type: 'line',
                    color: "#7CCDFA",
                    data: iData
                }
            ]
        };

        chart.setOption(option);
    };

    // 初始化页面
    var initPage = function () {
        $('.pop-header > span').html(titleName + '热点专题');
        getPopZhpjzs();
        getPopMyd();
        getPopQzsqzsfx();
    };

    $(function () {
        initPage();
    });

    // 监听弹出框关闭按钮事件
    $('.pop-header > i').click(function () {
        $('.simple_shade').hide();
        $('.simple_showDialog').remove();
    });
});