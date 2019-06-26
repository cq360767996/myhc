requirejs(["common", "ec", 'jqcloud'], function (sugon, ec) {
    // 全局查询尺度
    var searchRuler = {}, search = {}, gddwfbData = [];
    var param1, param2;

    // 获取当前时间并加减固定月份
    var getDate = function (difference) {
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var sum = year * 12 + month + difference;
        var resultYear = parseInt(sum / 12);
        var resultMonth = sum % 12;
        if (resultMonth == 0) {
            return resultYear - 1 + "-12";
        } else {
            resultMonth = resultMonth < 10 ? "0" + resultMonth : resultMonth;
            return resultYear + '-' + resultMonth;
        }
    };

    // 初始化查询栏
    var initSearchBar = function () {
        var lastMonth = getDate(-1);
        searchRuler.deptId = '2014110416460086100000002942';
        searchRuler.date1 = getDate(-10);
        searchRuler.date2 = getDate(-4);
        searchRuler.deptName = '南京市公安局';
        search.deptId = '2014110416460086100000002942';
        search.date1 = getDate(-10);
        search.date2 = getDate(-4);
        search.deptName = '南京市公安局';

        $('#place').val('南京市公安局');
        $('#placeCode').val('2014110416460086100000002942');
        $("#date-input1").val(search.date1);
        $("#date-input2").val(search.date2);
        $('#date-input1').datetimepicker({
            format: 'yyyy-mm',
            autoclose: true,
            todayBtn: true,
            startView: 'year',
            minView: 'year',
            maxView: 'decade',
            endDate: lastMonth,
            language: 'zh-CN'
        });
        $('#date-input2').datetimepicker({
            format: 'yyyy-mm',
            autoclose: true,
            todayBtn: true,
            startView: 'year',
            minView: 'year',
            maxView: 'decade',
            endDate: lastMonth,
            language: 'zh-CN'
        });
        // 设置下拉框宽度
        $('#left-tree').css('width', $('#place').outerWidth());
        //渲染树
        $('#left-tree').treeview({
            data: getTree(),
            levels: 1,
            onNodeSelected: function (event, node) {
                $('#place').val(node.text);
                $('#placeCode').val(node.id);
                $('#left-tree').css("visibility", "hidden");
            },
            showCheckbox: false//是否显示多选
        });
    };

    //获取树数据
    function getTree() {
        var treeData = [];
        sugon.requestJson({
            type: "POST",
            url: sugon.interFaces.zxyp.jcj.Tree
        }, function (result) {
            treeData = result.data;
        });
        return treeData;
    }

    // 绑定单位输入框点击事件
    $("#place").bind("click", function () {
        $('#left-tree').css("visibility", "visible");
    });

    var initVideo = function() {
        sugon.requestJson({
            type: "POST",
            async: true,
            url: sugon.interFaces.zxyp.jcj.Video,
            data: {search: JSON.stringify(search)}
        }, function (result) {
            $("#video")[0].src = result.data[0].value;

            $("#videoList").empty();
            for(var i=0;i<result.data.length;i++) {
                var tempName = result.data[i].name.length > 19 ? result.data[i].name.substr(0, 19) + "..." : result.data[i].name;
                $("#videoList").append(
                    "<div id="+ result.data[i].id +">" +
                        "<span class=\"pic\">" +
                            "<img src=\"../img/zxyp/jcj/video.png\">" +
                        "</span>" +
                        "<span class=\"name\" title="+ result.data[i].name +">"+ tempName +"</span>" +
                        "<span class=\"pic2\">" +
                            "<img src=\"../img/zxyp/jcj/start.png\">" +
                        "</span>" +
                    "</div>");
            }
            $("#videoList>div").unbind().bind("click", function() {
                $("#video")[0].src = result.data[$("#videoList>div").index(this)].value;
                $(".video").css("display", "block");
                $(".videoList").css("display", "none");
                $("#video")[0].play();
            });
        });
    };

    $("#more").unbind().bind("click", function() {
        $(".video").css("display", "none");
        $(".videoList").css("display", "block");
    });
    $("#fh").unbind().bind("click", function() {
        $(".video").css("display", "block");
        $(".videoList").css("display", "none");
    });

    var initTxt = function() {
        sugon.requestJson({
            type: "POST",
            async: true,
            url: sugon.interFaces.zxyp.jcj.Txt,
            data: {search: JSON.stringify(search)}
        }, function (result) {
            for(var i=0;i<result.data.length;i++) {
                $("#left_top .val").eq(i).html(result.data[i].value);
                $("#left_top .txt").eq(i).html(result.data[i].name);
            }
        });
    };

    var initZsk = function() {
        sugon.requestJson({
            type: "POST",
            async: true,
            url: sugon.interFaces.zxyp.jcj.Zsk,
            data: {search: JSON.stringify(search)}
        }, function (result) {
            $("#jcjzsk .content").empty();
            for(var i=0;i<result.data.length;i++) {
                $("#jcjzsk .content").append(
                    "<div id="+ result.data[i].id +">" +
                        "<span class='pic'><img src='../img/zxyp/jcj/file.png' /></span>" +
                        "<span class='name'>"+ result.data[i].name +"</span>" +
                        "<span class='pic2'><img src='../img/zxyp/jcj/chayue.png' /></span>" +
                    "</div>");
            }
        });
    };

    var initXhyj = function() {
        sugon.requestJson({
            type: "POST",
            async: true,
            url: sugon.interFaces.zxyp.jcj.Xhyj,
            data: {search: JSON.stringify(search)}
        }, function (result) {
            $("#xhyj .content").empty();
            for(var i=0;i<result.data.length;i++) {
                $("#xhyj .content").append(
                    "<div id="+ result.data[i].id +">" +
                        "<span class='pic'>"+ (i + 1) +"</span>" +
                        "<span class='name'>"+ result.data[i].name +"</span>" +
                        "<span class='pic2'><img src='../img/zxyp/jcj/fall.png' /></span>" +
                        "<span class='val2'>"+ result.data[i].value +"</span>" +
                        "<span class='name2'>本周起环比下滑</span>" +
                    "</div>");
            }
        });
    };

    var initRank = function() {
        sugon.requestJson({
            type: "POST",
            async: true,
            url: sugon.interFaces.zxyp.jcj.Rank,
            data: {dept: $("#dept").val(), search: JSON.stringify(search)}
        }, function (result) {
            $(".rankTitle").html($("#dept option:selected").text() + "排行榜");
            $(".rankList").empty();
            var tempClass2 = "";
            if($("#dept").val() == "2") {
                tempClass2 = "ryRow";
            }
            for(var i=0;i<result.data.length;i++) {
                var tempImg = "", tempClass = "rankVal";
                if(i == 0) {
                    tempImg = "<img src='../img/zxyp/jcj/one.png' />";
                    tempClass += " g";
                }else if(i == 1) {
                    tempImg = "<img src='../img/zxyp/jcj/two.png' />";
                    tempClass += " b";
                }else if(i == 2) {
                    tempImg = "<img src='../img/zxyp/jcj/three.png' />";
                }
                $(".rankList").append(
                    "<div id='"+ result.data[i].id +"' class='"+ tempClass2 +"' >" +
                        "<div class='rankPic'>"+ tempImg +"</div>" +
                        "<div class='rankName'>"+ result.data[i].name +"</div>" +
                        "<div class='"+ tempClass +"'>"+ result.data[i].value +"</div>" +
                    "</div>");
                $(".ryRow").unbind().bind("click", function() {
                    var _self = this;
                    var index = $(this).index();
                    requirejs(['text!../views/zxyp/ry.html'], function (ele){
                        sugon.showDialog({
                            width: 1100,
                            height: 700,
                            ele: ele,
                            params: index + "_" + _self.id + "_" + JSON.stringify(search)
                        });
                    });
                });
            }
        });
    };

    $("#dept").change(function() {
        initRank();
    });

    // 加载标签云
    var loadLabelCloud = function (data) {
        $('#tagscloud').empty();
        var string_ = '';
        for (var i = 0; i < data.length; i++) {
            var string_f = data[i].name;
            var string_n = data[i].value;
            string_ += "{text: '" + string_f + "', weight: '" + string_n + "',html: {'class': 'span_list'}},";
        }
        var string_list = string_;
        var word_list = eval("[" + string_list + "]");
        $("#tagscloud").jQCloud(word_list);
    };

    var initTag = function() {
        sugon.requestJson({
            type: "POST",
            async: true,
            url: sugon.interFaces.zxyp.jcj.Tag,
            data: {dept: $("#dept2").val(), search: JSON.stringify(search)}
        }, function (result) {
            $("#tagscloud").empty();
            loadLabelCloud(result.data);
        });
    };

    $("#dept2").change(function() {
        initTag();
    });

    // 工单量走势分析
    var getGdzsfx = function () {
        var condition = {search: JSON.stringify(search)};
        sugon.requestJson({
            url: sugon.interFaces.zxyp.jcj.getGdzsgx,
            type: 'post',
            async: true,
            data: condition
        }, function (result) {
            drawGdzsfx(result.data);
        });
    };

    // 画工单量走势分析echarts图
    var drawGdzsfx = function (data) {
        var xData = [], yData = [], min = Number(data[0].value), max = Number(data[0].value);
        for (var i = 0; i < data.length; i++) {
            xData.push(data[i].name);
            yData.push(data[i].value);
            min = Number(data[i].value) < min ? data[i].value : min;
            max = Number(data[i].value) > max ? data[i].value : max;
        }
        var chart3 = ec.init(document.getElementById('chart11'));

        var option = {
            color: '#3cb2fc',
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                top: 25,
                bottom: 25,
                left: 40,
                right: 0
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
                    name: '数值',
                    showSymbol: true,
                    symbolSize: 8,
                    type: 'line',
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                backgroundColor: '#2d78b2',
                                borderColor: '#3cb2fc',
                                borderWidth: '1',
                                borderRadius: [5, 5, 5, 5],
                                padding: [2, 2, 2, 2],
                                color: '#e6ecfa'
                                // formatter: function(params) {
                                //     return iData[params.dataIndex];
                                // }
                            }
                        }
                    },
                    data: yData
                }
            ]
        };

        chart3.setOption(option);
        chart3.off();
        chart3.on('click', function (param) {
            searchRuler.id1 = param.name;
            searchRuler.id2 = '';
            getYwfx();
            getGddwfb();
        });
    };

    // 工单业务分析
    var getYwfx = function () {
        var condition = {search: JSON.stringify(search)};
        if (searchRuler.id1 || searchRuler.id1 == '0') {
            condition.id1 = searchRuler.id1;
        }
        sugon.requestJson({
            url: sugon.interFaces.zxyp.jcj.getGdywfx,
            type: 'post',
            async: true,
            data: condition
        }, function (result) {
            drawYwfx(result.data);
        });
    };

    // 画工单业务分析echarts图
    var drawYwfx = function (data) {
        var total = 0;
        for (var i = 0; i < data.length; i++) {
            total += Number(data[i].value);
        }
        var chart = ec.init(document.getElementById('chart22'));
        var option = {
            title: {
                text: total,
                subtext: '警情分析',
                left: 'center',
                top: '28%',
                padding: [24, 0],
                subtextStyle: {
                    color: '#000',
                    fontSize: '14'
                },
                textStyle: {
                    color: '#1D84C6'
                }
            },
            tooltip: {
                show: true
            },
            series: [{
                color: ['#A770B3', '#AF8744', '#ED7D31', '#3A9BBE', '#1D84C6', '#6463AF'],
                name: '',
                type: 'pie',
                clockWise: false,
                center: ['50%', '50%'],
                radius: ['40%', '56%'],
                hoverAnimation: false,
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            position: 'outside',
                            formatter: function (params) {
                                var percent = '' + params.value / total;
                                percent = Math.round(percent * 100000 / 100) / 10 + '%';
                                return params.name + '\n' + percent;
                            },
                            rich: {
                                white: {
                                    color: '#ddd',
                                    align: 'center'
                                }
                            }
                        },
                        labelLine: {
                            show: true,
                            length: 8,
                            length2: 5
                        }
                    }
                },
                data: data
            }]
        };
        chart.setOption(option);
        chart.off();
        chart.on('click', function (param) {
            searchRuler.id2 = param.data.id;
            getGddwfb();
        });
    };

    // 工单单位分布
    var getGddwfb = function () {
        var condition = {search: JSON.stringify(search)};
        if (searchRuler.id1 || searchRuler.id1 == '0') {
            condition.id1 = searchRuler.id1;
        }
        if (searchRuler.id2 || searchRuler.id2 == '0') {
            condition.id2 = searchRuler.id2;
        }

        sugon.requestJson({
            url: sugon.interFaces.zxyp.jcj.getGddwfb,
            type: 'post',
            async: true,
            data: condition
        }, function (result) {
            gddwfbData = result.data;
            if (result.data.length == 1) {
                $('.tab4').css('display', 'none');
            } else {
                $('.tab4').css('display', 'block');
            }
            drawGddwfb(gddwfbData[0]);
        });
    };

    // 画诉求单位分布echarts图
    var drawGddwfb = function (data) {
        var xData = [], yData = [], startValue = 0, endValue = 100, isShow = false, markData = [];
        if (data.length > 4) {
            isShow = true;
            startValue = Math.floor((1 - 4 / data.length) * 100);
        }
        for (var i = 0; i < data.length; i++) {
            yData.push(data[i].name);
            xData.push(data[i].value);
            if (data[i].selected) {
                markData = [
                    {name: data[i].name, value: data[i].value, xAxis: data[i].value},
                    {name: data[i].name, value: data[i].value, xAxis: data[i].value}
                ]
            }
        }
        var chart = ec.init(document.getElementById('chart33'));
        var option = {
            color: ['#269AE5'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                top: '0',
                left: '0',
                width: isShow ? '88%' : '100%',
                height: '100%',
                containLabel: true
            },
            dataZoom: [{
                type: "inside",
                zoomOnMouseWheel: false
            }, {
                show: isShow,
                type: "slider",
                start: startValue,
                end: endValue,
                width: 7,
                orient: 'vertical',
                right: 0,
                handelSize: 0,
                zoomLock: true,
                textStyle: false
            }],
            xAxis: {
                type: 'value',
                splitNumber: 3,
                axisLine: {
                    show: true
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: true
                }
            },
            yAxis: {
                type: 'category',
                axisLine: {
                    show: true
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: true
                },
                data: yData
            },
            series: [
                {
                    type: 'bar',
                    data: xData,
                    barWidth: '15',
                    itemStyle: {
                        normal: {
                            barBorderRadius: 2
                        }
                    },
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
                }
            ]
        };
        chart.setOption(option);
    };

    var initMyd = function () {
        sugon.requestJson({
            type: "POST",
            async: true,
            url: sugon.interFaces.zxyp.ckfw.Myd,
            data: {dept: $("#dept3").val(), search: JSON.stringify(search)}
        }, function (result) {
            var xData = [], yData = [], iData = [], min = result.data[0].value1, max = result.data[0].value1;
            for (var i = 0; i < result.data.length; i++) {
                xData.push(result.data[i].name);
                yData.push(result.data[i].value1);
                iData.push(result.data[i].value2);
                result.data[i].value1 < min ? min = result.data[i].value1 : min;
                result.data[i].value1 > max ? max = result.data[i].value1 : max;
            }

            var Chart3 = ec.init(document.getElementById('chart3'));

            var option = {
                color: '#3cb2fc',
                tooltip: {
                    trigger: 'axis'
                },
                grid: {
                    top: 25,
                    bottom: 25,
                    left: 40,
                    right: 0
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
                                color: '#b3cce2'
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
                            formatter: "{value}%",
                            textStyle: {
                                color: '#b3cce2'
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
                        name: '数值',
                        showSymbol: true,
                        symbolSize: 8,
                        type: 'line',
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true,
                                    backgroundColor: '#2d78b2',
                                    borderColor: '#3cb2fc',
                                    borderWidth: '1',
                                    borderRadius: [5, 5, 5, 5],
                                    padding: [2, 2, 2, 2],
                                    color: '#e6ecfa',
                                    formatter: function (params) {
                                        return iData[params.dataIndex];
                                    }
                                }
                            }
                        },
                        data: yData
                    }
                ]
            };

            Chart3.setOption(option);
        });
    };

    var initMyd = function() {
        sugon.requestJson({
            type: "POST",
            async: true,
            url: sugon.interFaces.zxyp.jcj.Myd,
            data: {search: JSON.stringify(search)}
        }, function (result) {
            var xData = [], yData = [], iData = [], min = result.data[0].value1, max = result.data[0].value1;
            for(var i=0;i<result.data.length;i++) {
                xData.push(result.data[i].name);
                yData.push(result.data[i].value1);
                iData.push(result.data[i].value2);
                result.data[i].value1 < min ? min = result.data[i].value1 : min;
                result.data[i].value1 > max ? max = result.data[i].value1 : max;
            }
            var diff = (max - min) / 2;
            min = Number(min - diff).toFixed(2);
            var Chart3 = ec.init(document.getElementById('chart3'));

            var option = {
                color: '#3cb2fc',
                tooltip: {
                    trigger: 'axis'
                },
                grid: {
                    top: 25,
                    bottom: 25,
                    left: 40,
                    right: 0
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
                                color: '#b3cce2'
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
                            formatter: "{value}%",
                            textStyle: {
                                color: '#b3cce2'
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
                        name: '数值',
                        showSymbol: true,
                        symbolSize: 8,
                        type: 'line',
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true,
                                    backgroundColor: '#2d78b2',
                                    borderColor: '#3cb2fc',
                                    borderWidth: '1',
                                    borderRadius: [5, 5, 5, 5],
                                    padding: [2, 2, 2, 2],
                                    color: '#e6ecfa',
                                    formatter: function(params) {
                                        return iData[params.dataIndex];
                                    }
                                }
                            }
                        },
                        data: yData
                    }
                ]
            };

            Chart3.setOption(option);
        });
    };

    /*$("#dept3").change(function() {
        initMyd();
    });*/

    var initDwqk = function(index, flag) {
        sugon.requestJson({
            type: "POST",
            async: true,
            url: sugon.interFaces.zxyp.jcj.Dwqk,
            data: {dept: $("#dept4").val(), dept2: $(".tab2 .selected").attr("id"), search: JSON.stringify(search)}
        }, function (result) {
            var data = result.data[index];
            if (result.data.length == 1) {
                $('.tab2').css('display', 'none');
            } else {
                $('.tab2').css('display', 'block');
            }
            var xData = [], yData = [], min = Number(data[0].value), max = Number(data[0].value), isSet,
                isShow = false, startValue = 0, endValue = 100;
            if(data.length == 0) {
                isSet = false;
                if(flag) {
                    xData.push("无数据");
                    yData.push(0);
                }else {
                    return;
                }
            }else {
                isSet = true;
                for(var i=0;i<data.length;i++) {
                    min = Math.min(min, data[i].value);
                    max = Math.max(max, data[i].value);
                    xData.push(data[i].name);
                    yData.push(data[i].value);
                }
            }
            if (data.length > 5) {
                isShow = true;
                endValue = Math.floor(5 / data.length * 100);
            }

            var diff = (max - min) / 2;
            min = Number(min - diff).toFixed(2);
            max = Number(max + diff).toFixed(2);
            var Chart4 = ec.init(document.getElementById('chart4'));
            var option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                color: ["#1e9eb7"],
                dataZoom: [{
                    type: "inside",
                    start: startValue,
                    end: endValue,
                    zoomOnMouseWheel: false
                }, {
                    show: isShow,
                    type: "slider",
                    start: startValue,
                    end: endValue,
                    height: 7,
                    bottom: 0,
                    handelSize: 0,
                    zoomLock: true,
                    textStyle: false
                }],
                grid: {
                    left: 0,
                    top: '20%',
                    width: '100%',
                    height: isShow ? '75%' : '80%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        axisTick: {show: false},
                        splitArea: {show: false},
                        data: xData,
                        axisLabel: {
                            interval: 0,
                            textStyle: {
                                color: '#b3cce2'
                            }
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#d5d8e1'
                            }
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        min: isSet ? min : '',
                        max: isSet ? max : '',
                        axisTick: {show: false},
                        splitLine: {
                            lineStyle: {
                                color: '#d5d8e1'
                            }
                        },
                        splitArea: {show: false},
                        splitNumber: 5,
                        axisLabel: {
                            formatter: "{value}%",
                            textStyle: {
                                color: '#b3cce2'
                            }
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#d5d8e1'
                            }
                        }
                    }
                ],
                series: [
                    {
                        type: 'bar',
                        barWidth: 20,
                        data: yData
                    }
                ]
            };

            Chart4.setOption(option);
        });
    };

    $('.switch-panel').on('click', ".tab2>div", function () {
        $(".tab2 .selected").removeClass("selected");
        $(this).attr("class", "selected");
        var index = $(".tab2>div").index(this);
        initDwqk(index, 1);
    });

    $('.switch-panel').on('click', ".tab4>div", function () {
        $(".tab4 .selected").removeClass("selected");
        $(this).attr("class", "selected");
        var index = $(".tab4>div").index(this);
        drawGddwfb(gddwfbData[index]);
    });

    $('.switch-panel').on('click', "#dept4", function () {
        $(".tab2>div").eq(0).click();
    });

    // 中间层切换事件
    $('.switch-panel').on('click', '.switch-btn', (function () {
        var $thisPanel = $('.switch-panel');
        var $this = $(this);
        var threePanel =
            '<div class="group_child"><div class="subTitle"><span>一般工单量走势分析</span>' +
            '</div><div class="content"><div id="chart11"></div></div></div><div class="group_child">' +
            '<div class="subTitle"><span>一般工单警情分析</span></div><div class="content">' +
            '<div id="chart22"></div></div></div><div class="group_child" style="margin-right: 0px;">' +
            '<div class="subTitle">' +
            '<span>一般工单各单位情况</span><span class="switch-btn switch-three"></span>' +
            '</div><div class="content"><div class="tab4"><div class="selected">一单元</div>' +
            '<div>二单元</div><div>三单元</div><div style="border-right: 0px;">其他</div>' +
            '</div><div id="chart33"></div></div></div>';
        var twoPanel =
            '<div class="myd">' + '<div class="subTitle2">' +
            '<span class="l" style="font-size: 16px;">110接处警满意度走势分析</span>' +
            '</div>' +
            '<div class="content"><div id="chart3"></div></div></div>' +
            '<div class="dwqk"><div class="subTitle2">' +
            '<span style="font-size: 16px;">110接处警各单位情况</span>' +
            '<span class="m">' +
            '<select id="dept4">' +
            '<option value="0">接处警满意度</option>' +
            '<option value="1">整改满意率</option>' +
            '</select>' +
            '</span>' +
            '<span class="switch-two switch-btn"></span>' + '</div>' + '<div class="content">' +
            '<div class="tab2">' + '<div class="selected">一单元</div>' +
            '<div>二单元</div>' + '<div>三单元</div>' +
            '<div style="border-right: 0;">其他</div>' + '</div>' +
            '<div id="chart4"></div>' + '</div>' + '</div>';

        if ($this.hasClass('switch-two')) {
            $thisPanel.empty();
            $thisPanel.append(threePanel);
            getGdzsfx();
            getYwfx();
            getGddwfb();
        } else {
            $thisPanel.empty();
            $thisPanel.append(twoPanel);
            //满意度走势
            initMyd();
            //满意度各单位
            initDwqk(0);
        }
    }));

    var initRador = function(param) {
        sugon.requestJson({
            type: "POST",
            async: true,
            url: sugon.interFaces.zxyp.jcj.Rador1,
            data: {id: param, search: JSON.stringify(search)}
        }, function (result) {
            var indicatorData = [], seriesData = [], min = result.data[0].value, max = result.data[0].value;
            if(result.data.length == 0) {
                return;
            }

            for (var i = 0; i < result.data.length; i++) {
                min = Math.min(min, result.data[i].value);
                max = Math.max(max, result.data[i].value);
            }
            for(var i=0;i<result.data.length;i++) {
                indicatorData.push({text: result.data[i].name + '\n' + result.data[i].value + '%', max: max, min: min});
                seriesData.push(result.data[i].value);
            }
            var Chart5 = ec.init(document.getElementById('chart5'));

            Chart5.off();
            Chart5.on('click', function(params) {
                if(!params.targetType) {
                    initRador("");
                    return;
                }
                if(params.targetType) {
                    var tempId = "";
                    for(var i=0;i<result.data.length;i++) {
                        var name = params.name.slice(0, params.name.indexOf('\n'));
                        if(name == result.data[i].name) {
                            tempId = result.data[i].id;
                            break;
                        }
                    }
                    initRador(tempId);
                }
            });

            var option = {
                color: "rgba(52, 237, 255, 0.35)",
                radar: [
                    {
                        indicator: indicatorData,
                        triggerEvent: true,
                        center: ['50%', '50%'],
                        radius: '60%',
                        startAngle: 90,
                        splitNumber: 4,
                        shape: 'circle',
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

            Chart5.setOption(option);
        });

        sugon.requestJson({
            type: "POST",
            async: true,
            url: sugon.interFaces.zxyp.jcj.Rador2,
            data: {id: param, search: JSON.stringify(search)}
        }, function (result) {
            var indicatorData = [], seriesData = [], min = result.data[0].value, max = result.data[0].value;
            if(result.data.length == 0) {
                return;
            }
            for (var i = 0; i < result.data.length; i++) {
                min = Math.min(min, result.data[i].value);
                max = Math.max(max, result.data[i].value);
            }
            for(var i=0;i<result.data.length;i++) {
                indicatorData.push({text: result.data[i].name + '\n' + result.data[i].value + '%', max: max, min: min});
                seriesData.push(result.data[i].value);
            }

            var Chart6 = ec.init(document.getElementById('chart6'));

            var option = {
                color: "rgba(52, 237, 255, 0.35)",
                radar: [
                    {
                        indicator: indicatorData,
                        center: ['50%', '50%'],
                        radius: '60%',
                        startAngle: 90,
                        splitNumber: 4,
                        shape: 'circle',
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

            Chart6.setOption(option);
        });
    };

    $("#chart_title").bind("click", function() {
        param1 = "", param2 = "";
        initJqfx("");
        initHjwt("");
        initWtdw("", "", 0);
    });

    var initJqfx = function(param) {
        sugon.requestJson({
            type: "POST",
            async: true,
            url: sugon.interFaces.zxyp.jcj.Jqfx,
            data: {id: param, search: JSON.stringify(search)}
        }, function (result) {
            var scaleData = result.data;
            var sum = 0;
            if(result.data.length == 0) {
                return;
            }
            for (var i = 0; i < scaleData.length; i++) {
                sum += Number(scaleData[i].value);
            }

            var Chart0 = ec.init(document.getElementById('chart0'));

            Chart0.off();
            Chart0.on('click', function(params) {
                if(param2) {
                    return;
                }
                param1 = params.data.id;
                $("#chart_title").html(params.data.name);
                initJqfx(param1);
                initHjwt(param1);
                initWtdw(param1, param2, 0);
            });

            if(!param1) {
                $("#chart_title").html("总量");
            }
            var data = [];

            for (var i = 0; i < scaleData.length; i++) {
                var percent = Number(scaleData[i].value) / sum * 100;
                data.push({
                    value: percent.toFixed(1),
                    name: scaleData[i].name,
                    id: scaleData[i].id,
                    itemStyle: {
                        normal: {
                            borderColor: 'rgba(255, 255, 255, 0.7)',
                            borderWidth: 1
                        }
                    }
                });
            }

            var option = {
                tooltip: {
                    show: true
                },
                series: [{
                    name: '',
                    type: 'pie',
                    clockWise: false,
                    center: ['50%', '50%'],
                    radius: ['35%', '45%'],
                    hoverAnimation: false,
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                position: 'outside',
                                formatter: function(params) {
                                    var tempStr = "";
                                    tempStr = params.name + "\n" + params.value + '%';
                                    return tempStr;
                                },
                                rich: {
                                    white: {
                                        color: '#ddd',
                                        align: 'center',
                                        padding: [10, 0]
                                    }
                                }
                            },
                            labelLine: {
                                show: true,
                                length: 5,
                                length2: 3
                            }
                        }
                    },
                    data: data
                }]
            };

            Chart0.setOption(option);

        });
    };

    var initHjwt = function(param) {
        sugon.requestJson({
            type: "POST",
            async: true,
            url: sugon.interFaces.zxyp.jcj.Hjwt,
            data: {id: param, search: JSON.stringify(search)}
        }, function (result) {
            var scaleData = result.data, sum = 0;
            if(result.data.length == 0) {
                return;
            }
            for (var i = 0; i < scaleData.length; i++) {
                sum += Number(scaleData[i].value);
            }

            var Chart1 = ec.init(document.getElementById('chart1'));

            Chart1.off();
            Chart1.on('click', function(params) {
                param2 = params.data.id;
                initWtdw(param1, param2, 0);
            });

            var data = [];

            for (var i = 0; i < scaleData.length; i++) {
                var percent = Number(scaleData[i].value) / sum * 100;
                data.push({
                    value: percent.toFixed(1),
                    name: scaleData[i].name,
                    id: scaleData[i].id,
                    itemStyle: {
                        normal: {
                            borderColor: 'rgba(255, 255, 255, 0.7)',
                            borderWidth: 1
                        }
                    }
                });
            }

            var option = {
                tooltip: {
                    show: true
                },
                series: [{
                    name: '',
                    type: 'pie',
                    clockWise: false,
                    center: ['60%', '50%'],
                    radius: ['35%', '45%'],
                    hoverAnimation: false,
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                position: 'outside',
                                formatter: function(params) {
                                    var tempStr = "";
                                    tempStr = params.name + "\n" + params.value + '%';
                                    return tempStr;
                                },
                                rich: {
                                    white: {
                                        color: '#ddd',
                                        align: 'center',
                                        padding: [10, 0]
                                    }
                                }
                            },
                            labelLine: {
                                show: true,
                                length: 5,
                                length2: 3
                            }
                        }
                    },
                    data: data
                }]
            };

            Chart1.setOption(option);
        });
    };

    var initWtdw = function(param11, param22, index, flag) {
        sugon.requestJson({
            type: "POST",
            async: true,
            url: sugon.interFaces.zxyp.jcj.Wtdw,
            data: {id1: param11, id2: param22, search: JSON.stringify(search)}
        }, function (result) {
            var data = result.data[index];
            if (result.data.length == 1) {
                $('.tab3').css('display', 'none');
            } else {
                $('.tab3').css('display', 'block');
            }
            var xData = [], yData = [];
            if(data.length == 0) {
                if(flag) {
                    xData.push("无数据");
                    yData.push(0);
                }else {
                    return;
                }
            }else {
                for(var i=0;i<data.length;i++) {
                    xData.push(data[i].name);
                    yData.push(data[i].value);
                }
            }

            var Chart2= ec.init(document.getElementById('chart2'));

            var option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                color: ["#1e9bdd"],
                grid: {
                    left: '0px',
                    right: '15px',
                    bottom: '5px',
                    top: '40px',
                    containLabel: true
                },
                xAxis: {
                    type: 'value'
                },
                yAxis: {
                    type: 'category',
                    data: xData
                },
                series: [{
                    name: '',
                    type: 'bar',
                    data: yData
                }]
            };

            Chart2.setOption(option);
        });
    };

    var initJqlx = function() {
        sugon.requestJson({
            type: "POST",
            async: true,
            url: sugon.interFaces.zxyp.jcj.Jqlx,
            data: {search: JSON.stringify(search)}
        }, function (result) {
            $(".val3").eq(0).html(result.data[0].name);
            $(".val3").eq(1).html(result.data[0].value);
            $(".val3").eq(2).html(result.data[1].name);
            $(".val3").eq(3).html(result.data[1].value);
        });
    };

    $(".tab3>div").bind("click", function() {
        $(".tab3 .selected").removeClass("selected");
        $(this).attr("class", "selected");
        var index = $(".tab3>div").index(this);
        initWtdw(param1, param2, index, 1);
    });

    var initView = function() {
        // 视频加载
        initVideo();
        // 左上文本
        initTxt();
        // 知识库
        initZsk();
        // 下滑预警
        initXhyj();
        // 排行榜
        initRank();
        // 标签云
        initTag();
        if ($('.switch-btn').hasClass('switch-three')) {
            searchRuler.id1 = '';
            searchRuler.id2 = '';
            getGdzsfx();
            getYwfx();
            getGddwfb();
        } else {
            // 满意度走势
            initMyd();
            // 单位情况
            initDwqk(0);
        }
        // 警情类型
        initJqlx();
        // 雷达图
        initRador("");
        // 警情分析
        initJqfx("");
        // 环节问题
        initHjwt("");
        // 问题单位
        initWtdw("", "", 0);
    };

    var initPage = function () {
        // 初始化查询栏
        initSearchBar();
        // 分析报告下载
        $(".view-header-right").bind("click", function() {
            alert("分析报告下载...");
        });
        // 初始化页面
        $(".search-btn").bind("click", function() {
            searchRuler.deptId = $('#placeCode').val();
            searchRuler.date1 = $("#date-input1").val();
            searchRuler.date2 = $("#date-input2").val();
            searchRuler.deptName = $('#place').val();
            search.deptId = $('#placeCode').val();
            search.date1 = $("#date-input1").val();
            search.date2 = $("#date-input2").val();
            search.deptName = $('#place').val();
            initView();
        });
        initView();
    };

    // 页面入口
    $(function () {
        initPage();
    });
});
