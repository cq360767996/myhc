requirejs(["common", "ec"], function(sugon, ec) {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    if (month < 10) {
        month = "0" + month;
    }
    if (day < 10) {
        day = "0" + day;
    }
    var date1 = year + "-" + month + "-01", date2 = year + "-" + month + "-" + day;;
    var myChart1, myChart2, allData = [], allKey = [];
    var tData = [], navigorData = [], firstLock = true, secondLock = true, thirdLock = true;
    var secondChildLock = true, thirdChildLock = true;
    var secondLastLock = true, thirdLastLock = true;
    var firstLabelLock = true, secondLabelLock = true, thirdLabelLock = true;
    $("#left-tree").css("width", $("#place").css("width"));

    $("#place").bind("click", function() {
        $('#left-tree').css("visibility", "visible");
    });

    $('#date1').datetimepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        todayBtn: true,
        /*startView: 'year',*/
        minView:'year',
        maxView:'decade',
        language:  'zh-CN'
    }).on('changeDate', function(e){
        onLoad($("#date1").val(), $("#date2").val());
        $('#place').val("");
        $('#placeCode').val("");
        $('#left-tree').css("visibility", "hidden");
    });

    $('#date2').datetimepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        todayBtn: true,
        minView:'year',
        maxView:'decade',
        language:  'zh-CN'
    }).on('changeDate', function(e){
        onLoad($("#date1").val(), $("#date2").val());
        $('#place').val("");
        $('#placeCode').val("");
        $('#left-tree').css("visibility", "hidden");
    });

    onLoad(date1, date2);
    function onLoad(date1, date2)
    {
        //渲染树
        $('#left-tree').treeview({
            data: getTree(date1, date2),
            levels: 1,
            onNodeSelected:function(event, node){
                $('#place').val(node.text);
                $('#placeCode').val(node.id);
                $('#left-tree').css("visibility", "hidden");
            },
            showCheckbox:false//是否显示多选
        });
    }

    //获取树数据
    function getTree(date1, date2){
        var treeData = [];

        sugon.requestJson({type:"POST", url: sugon.interFaces.dwjx.Tree, data: {date1: date1, date2: date2}, async: true},function(result){
            treeData = result.data;
            tData = treeData;
        });

        return treeData;
    }

    /*$(".search").bind("click", function() {
        getList($('#placeCode').val(), $("#date").val());
    });*/

    var getNavigor = function(array) {
        $(".navigor").empty();
        $(".navigor").append("<span>按：</span>");
        for(var i=0;i<array.length;i++) {
            var tempStr = "&nbsp;/&nbsp;";
            if(i == (array.length - 1)) {
                tempStr = "";
            }
            $(".navigor").append("<span class='"+ array[i].id + ' navi' +"'>"+ array[i].name + tempStr +"</span>");
        }
        $(".navigor").append("<span>&nbsp;&nbsp;分析</span>");

        //alert($(".navi").length);
    };

    var getLastSecondTab = function(id) {
        sugon.requestJson({type:"POST", url: sugon.interFaces.dwjx.Tab2, data: {navigor: JSON.stringify(navigorData)}, async: true},function(result){
            if(result.data.length > 0){
                for(var i=0;i<result.data.length;i++){
                    $(".secondList .last").append("<div id="+ result.data[i].value +">&nbsp;&nbsp;"+ result.data[i].name +"&nbsp;&nbsp;</div>");
                }
                $(".secondList .triangle_left").css("display", "block");
                $(".keyword").removeClass("keyword");
                for(var i=0;i<allKey.length;i++) {
                    var tempClass = $("#" + allKey[i]).attr("class") + " keyword";
                    $("#" + allKey[i]).attr("class", tempClass);
                }
                $(".secondList .last>div").unbind().bind("click", function() {
                    if(secondLastLock){
                        $(this).attr("class", "selected");
                        secondLastLock = false;
                        var tempTxt = $(this).html().replace(/&nbsp;/g,"");
                        navigorData.push({id: this.id, name: tempTxt});
                        getNavigor(navigorData);
                    }
                });
            }
        });
    };

    var getLastThirdTab = function(id) {
        sugon.requestJson({type:"POST", url: sugon.interFaces.dwjx.Tab2, data: {navigor: JSON.stringify(navigorData)}, async: true},function(result){
            if(result.data.length > 0){
                for(var i=0;i<result.data.length;i++){
                    $(".thirdList .last").append("<div id="+ result.data[i].value +">&nbsp;&nbsp;"+ result.data[i].name +"&nbsp;&nbsp;</div>");
                }
                $(".thirdList .triangle_left").css("display", "block");

                $(".thirdList .last>div").unbind().bind("click", function() {
                    if(thirdLastLock){
                        $(this).attr("class", "selected");
                        thirdLastLock = false;
                        var tempTxt = $(this).html().replace(/&nbsp;/g,"");
                        navigorData.push({id: this.id, name: tempTxt});
                        getNavigor(navigorData);
                    }
                });
            }
        });
    };

    var getSecondTab = function(id) {
        sugon.requestJson({type:"POST", url: sugon.interFaces.dwjx.Tab2, data: {navigor: JSON.stringify(navigorData)}, async: true},function(result){
            for(var i=0;i<result.data.length;i++){
                $(".secondList ul").append("<li id="+ result.data[i].value +">"+ result.data[i].name +"</li>");
            }
            $(".keyword").removeClass("keyword");
            for(var i=0;i<allKey.length;i++) {
                var tempClass = $("#" + allKey[i]).attr("class") + " keyword";
                $("#" + allKey[i]).attr("class", tempClass);
            }
            $(".secondList li").unbind().bind("click", function() {
                if(secondChildLock){
                    $(this).attr("class", "selected");
                    secondChildLock = false;
                    var tempTxt = $(this).html().replace(/&nbsp;/g,"");
                    navigorData.push({id: this.id, name: tempTxt});
                    getNavigor(navigorData);
                    getLastSecondTab(this.id);
                }
            });
        });
    };

    var getThirdTab = function(id) {
        sugon.requestJson({type:"POST", url: sugon.interFaces.dwjx.Tab2, data: {navigor: JSON.stringify(navigorData)}, async: true},function(result){
            for(var i=0;i<result.data.length;i++){
                $(".thirdList ul").append("<li id="+ result.data[i].value +">"+ result.data[i].name +"</li>");
            }
            $(".keyword").removeClass("keyword");
            for(var i=0;i<allKey.length;i++) {
                var tempClass = $("#" + allKey[i]).attr("class") + " keyword";
                $("#" + allKey[i]).attr("class", tempClass);
            }
            $(".thirdList li").unbind().bind("click", function() {
                if(thirdChildLock){
                    $(this).attr("class", "selected");
                    thirdChildLock = false;
                    var tempTxt = $(this).html().replace(/&nbsp;/g,"");
                    navigorData.push({id: this.id, name: tempTxt});
                    getNavigor(navigorData);
                    getLastThirdTab(this.id);
                }
            });
        });
    };

    var getTab = function(array) {
        sugon.requestJson({type:"POST", url: sugon.interFaces.dwjx.Tab, data: {navigor: JSON.stringify(array)}, async: false},function(result){
            firstLock = true, secondLock = true, thirdLock = true;
            secondChildLock = true, thirdChildLock = true;
            secondLastLock = true, thirdLastLock = true;
            firstLabelLock = true, secondLabelLock = true, thirdLabelLock = true;

            $("#ywgk").unbind().bind("click", function() {
                if(firstLabelLock){
                    firstLabelLock = false;
                    navigorData.push({id: this.id, name: "业务归口"});
                    getNavigor(navigorData);
                }
            });

            $("#jtwt").unbind().bind("click", function() {
                if(secondLabelLock){
                    secondLabelLock = false;
                    navigorData.push({id: this.id, name: "具体问题"});
                    getNavigor(navigorData);
                }
            });

            $("#sqfx").unbind().bind("click", function() {
                if(thirdLabelLock){
                    thirdLabelLock = false;
                    navigorData.push({id: this.id, name: "诉求分析"});
                    getNavigor(navigorData);
                }
            });

            $(".firstTab").empty();
            for(var i=0;i<result.data1.length;i++){
                $(".firstTab").append("<div id="+ result.data1[i].value +">&nbsp;&nbsp;"+ result.data1[i].name +"&nbsp;&nbsp;</div>");
            }
            $(".firstTab>div").unbind().bind("click", function() {
                if(firstLock){
                    $(this).attr("class", "selected");
                    firstLock = false;
                    var tempTxt = $(this).html().replace(/&nbsp;/g,"");
                    if(thirdLabelLock){
                        thirdLabelLock = false;
                        navigorData.push({id: "sqxz", name: "诉求性质"});
                    }
                    navigorData.push({id: this.id, name: tempTxt});
                    getNavigor(navigorData);
                }
            });

            $(".secondTab").empty();
            for(var i=0;i<result.data2.length;i++){
                $(".secondTab").append("<div id="+ result.data2[i].value +">&nbsp;&nbsp;"+ result.data2[i].name +"&nbsp;&nbsp;</div>");
            }
            $(".secondTab>div").unbind().bind("click", function() {
                if(secondLock){
                    $(this).attr("class", "selected");
                    secondLock = false;
                    var tempTxt = $(this).html().replace(/&nbsp;/g,"");
                    if(firstLabelLock){
                        firstLabelLock = false;
                        navigorData.push({id: "ywgk", name: "业务归口"});
                    }
                    navigorData.push({id: this.id, name: tempTxt});
                    getNavigor(navigorData);
                    getSecondTab(this.id);
                }
            });

            $(".thirdTab").empty();
            for(var i=0;i<result.data3.length;i++){
                $(".thirdTab").append("<div id="+ result.data3[i].value +">&nbsp;&nbsp;"+ result.data3[i].name +"&nbsp;&nbsp;</div>");
            }
            $(".thirdTab>div").unbind().bind("click", function() {
                if(thirdLock){
                    $(this).attr("class", "selected");
                    thirdLock = false;
                    var tempTxt = $(this).html().replace(/&nbsp;/g,"");
                    if(secondLabelLock){
                        secondLabelLock = false;
                        navigorData.push({id: "jtwt", name: "具体问题"});
                    }
                    navigorData.push({id: this.id, name: tempTxt});
                    getNavigor(navigorData);
                    getThirdTab(this.id);
                }
            });
        });
    };

    var initPie = function(array) {
        var scaleData = array;

        var myChart1 = ec.init(document.getElementById('pie'));

        var data = [];

        for (var i = 0; i < scaleData.length; i++) {
            data.push({
                value: scaleData[i].value,
                name: scaleData[i].name,
                itemStyle: {
                    normal: {
                        /*borderWidth: 2,
                        shadowBlur: 30,
                        borderColor: colorArray[i],
                        shadowColor: 'rgba(50, 219, 239, 0.6)'*/
                    }
                }
            }, {
                value: 1,
                name: '',
                tooltip: {
                    show: false
                },
                itemStyle: {
                    normal: {
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        },
                        color: 'rgba(0, 0, 0, 0)',
                        borderColor: 'rgba(0, 0, 0, 0)',
                        borderWidth: 0
                    }
                }
            });
        }

        var option = {
            tooltip: {
                show: true
            },
            color: ['rgba(44, 193, 213, 0.8)', 'rgba(220, 214, 147, 0.8)', 'rgba(238, 172, 49, 0.8)', 'rgba(223, 102, 66, 0.8)', 'rgba(0, 246, 151, 0.8)', 'rgba(81, 86, 186, 0.8)'],
            series: [{
                name: '',
                type: 'pie',
                clockWise: false,
                center: ['50%', '48%'],
                radius: ['42%', '56%'],
                hoverAnimation: false,
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            position: 'outside',
                            formatter: function(params) {
                                var tempStr = "";
                                tempStr = params.name + "\n" + params.value;
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
                            show: true
                        }
                    }
                },
                data: data
            }]
        };

        myChart1.setOption(option);
    };

    var initLine = function(index) {
        var xData = [], yData = [];
        for(var i=0;i<allData[index].length;i++) {
            xData.push(allData[index][i].name);
            yData.push(allData[index][i].value);
        }

        myChart2 = ec.init(document.getElementById('line'));

        var option = {
            color: '#3cb2fc',
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                top: 45,
                bottom: 75,
                left: 60,
                right: 45
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
                        interval:0,
                        rotate:40,
                        textStyle: {
                            color: '#6e7884'
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#6e7884'
                        }
                    },
                    data: xData
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    splitNumber: 4,
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
                            color: '#6e7884'
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#6e7884'
                        }
                    }
                }
            ],
            series: [
                {
                    name:'近半年走势',
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
                    data: yData
                }
            ]
        };

        myChart2.setOption(option);
    };

    var getChart = function(array) {
        sugon.requestJson({type:"POST", url: sugon.interFaces.dwjx.Chart, data: {navigor: JSON.stringify(array), date1: $("#date1").val(), date2: $("#date2").val(), code: $('#placeCode').val()}, async: false},function(result){
            initPie(result.data1);
            $(".tab_pannel2").show();
            allData = result.data2;
            $(".tab_pannel2>div").unbind().bind("click", function() {
                $(".tab_pannel2 .selected").removeClass("selected");
                $(this).attr("class", "selected");
                initLine($(".tab_pannel2>div").index(this));
            });
            $(".tab_pannel2>div").eq(0).click();
        });
    };

    var initList = function() {
        $('#place').val(tData[0].text);
        $('#placeCode').val(tData[0].id);
        $("#date1").val(date1);
        $("#date2").val(date2);

        var param = sugon.getUrlParam("type");
        var txt = "";
        switch(param)
        {
            case "sqxz":
                txt = "诉求性质";
                break;
            case "ywgk":
                txt = "业务归口";
                break;
            case "jtwt":
                txt = "具体问题";
                break;
            case "znfx":
                txt = "智能分析";
                break;
            default:
                txt = "诉求性质";
        }
        $(".ywgk_jtwt ul").empty();
        $(".last").empty();
        $(".triangle_left").css("display", "none");

        allKey = [];
        navigorData = [];
        navigorData.push({id: param, name: txt});
        //获取标签
        getTab(navigorData);
        //获取导航&定位标签
        getNavigor(navigorData);
        //展示图标
        getChart(navigorData);
        //标红按钮
        $(".check").unbind().bind("click", function() {
            sugon.requestJson({type:"POST", url: sugon.interFaces.dwjx.Keywords, data: {txt: $("#keywords").val()}, async: true},function(result){
                allKey = result.data;
                $(".keyword").removeClass("keyword");
                for(var i=0;i<allKey.length;i++) {
                    var tempClass = $("#" + allKey[i]).attr("class") + " keyword";
                    $("#" + allKey[i]).attr("class", tempClass);
                }
            });
        });
    };

    initList();

    /*
    * 事件绑定
    * */
    $("#check").bind("click", function() {
        getChart(navigorData);
    });

    $("#reset").bind("click", function() {
        initList();
    });

    $("#back").bind("click", function() {
        location.hash = vipspa.stringify("dwjx", {type: "dwjx"});
    });

    function setCenterHeight() {
        var height = $(window).height();
        var centerHight = height - 240;
        $(".right_centent").height(centerHight).css("overflow", "auto");
    }

    /!*-----页面pannel内容区高度自适应 start-----*!/
    $(window).resize(function () {
        setCenterHeight();
        $("#left-tree").css("width", $("#place").css("width"));
        if(myChart1){
            myChart1.resize();
        }
        if(myChart2){
            myChart2.resize();
        }
    });
});