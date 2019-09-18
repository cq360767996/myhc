var zhpjzsfxChart,
  hjwrfxChart,
  ajdwfbChart,
  zhpjzsfxTrendChart,
  ajbljtwtfxChartArr = [],
  airBubbleChart1,
  airBubbleChart2,
  popShlAjzhpjzsChart,
  popAjzhpjzsChart,
  popShlAjzhpjzsfxChart,
  popHjwtfxChart,
  popAjwtdwfbChart;
requirejs(["common", "ec", "ecPlugin", "jqcloud"], function(sugon, ec) {
  // 全局查询尺度
  var searchRuler = {};

  // 热词回访数据
  var hfrcData = [];

  // 案件问题单位分布数据
  var ajwddwfbData = [];

  // 弹出页案件问题单位分布数据
  var popAjwddwfbData = [];

  // 案件综合评价指数分析id
  var zhpjzsfxId;

  // 案件综合评价指数分析data
  var zhpjzsfxData = [];

  // 专项分析评价指数
  var zxfxpjzsData = [];

  // 初始化查询栏
  var initSearchBar = function() {
    var lastMonth = sugon.getDate(-1);
    if (isNullObject(searchRuler)) {
      searchRuler.deptId = "2014110416460086100000002942";
      searchRuler.date1 = sugon.getDate(-7);
      searchRuler.date2 = sugon.getDate(-2);
      searchRuler.deptName = "南京市公安局";

      $("#place").val(searchRuler.deptName);
      $("#placeCode").val(searchRuler.deptId);
      $("#date-input1").val(searchRuler.date1);
      $("#date-input2").val(searchRuler.date2);
    } else {
      searchRuler.deptId = $("#placeCode").val();
      searchRuler.date1 = $("#date-input1").val();
      searchRuler.date2 = $("#date-input2").val();
      searchRuler.deptName = $("#place").val();
    }
    $("#date-input1").datetimepicker({
      format: "yyyy-mm",
      autoclose: true,
      todayBtn: true,
      startView: "year",
      minView: "year",
      maxView: "decade",
      endDate: lastMonth,
      language: "zh-CN"
    });
    $("#date-input2").datetimepicker({
      format: "yyyy-mm",
      autoclose: true,
      todayBtn: true,
      startView: "year",
      minView: "year",
      maxView: "decade",
      endDate: lastMonth,
      language: "zh-CN"
    });
    // 设置下拉框宽度
    $("#left-tree").css("width", $("#place").outerWidth());
    //渲染树
    $("#left-tree").treeview({
      data: getTree(),
      levels: 1,
      onNodeSelected: function(event, node) {
        $("#place").val(node.text);
        $("#placeCode").val(node.id);
        $("#left-tree").css("visibility", "hidden");
      },
      showCheckbox: false //是否显示多选
    });
  };

  // 判断对象是否为空
  var isNullObject = function(obj) {
    for (var key in obj) {
      return false;
    }
    return true;
  };

  //获取树数据
  function getTree() {
    var treeData = [];
    sugon.requestJson(
      {
        type: "POST",
        url: sugon.interFaces.zxyp.aj.Tree
      },
      function(result) {
        treeData = result.data;
      }
    );
    return treeData;
  }

  // 绑定单位输入框点击事件
  $("#place").bind("click", function() {
    $("#left-tree").css("visibility", "visible");
  });

  // 指标展示接口定义
  var getZbzs = function() {
    var condition = {
      deptId: searchRuler.deptId,
      date1: searchRuler.date1,
      date2: searchRuler.date2,
      timestamp: new Date()
    };
    searchRuler.timestamp = condition.timestamp;
    sugon.requestJson(
      {
        url: sugon.interFaces.zxyp.aj.getZbzs,
        type: "post",
        async: true,
        data: condition
      },
      function(result) {
        if (!sugon.isPublished || result.timestamp == searchRuler.timestamp) {
          var data = result.data;
          zxfxpjzsData[2] = data.zhpjzs;
          for (var key in data) {
            $("#" + key).html(data[key]);
          }
        }
      }
    );
  };

  // 案件回访热词接口定义
  var getHfrc = function() {
    var condition = {
      deptId: searchRuler.deptId,
      date1: searchRuler.date1,
      date2: searchRuler.date2,
      timestamp: new Date()
    };
    searchRuler.timestamp = condition.timestamp;
    sugon.requestJson(
      {
        url: sugon.interFaces.zxyp.aj.getHfrc,
        type: "post",
        async: true,
        data: condition
      },
      function(result) {
        if (!sugon.isPublished || result.timestamp == searchRuler.timestamp) {
          hfrcData = result.data;
          loadLabelCloud(result.data);
        }
      }
    );
  };

  // 加载标签云
  var loadLabelCloud = function(data) {
    $("#label-cloud").empty();
    var string_ = "";
    for (var i = 0; i < data.length; i++) {
      var string_f = data[i].name;
      var string_n = data[i].value;
      string_ +=
        "{text: '" +
        string_f +
        "', weight: '" +
        string_n +
        "',html: {'class': 'span_list'}},";
    }
    var string_list = string_;
    var word_list = eval("[" + string_list + "]");
    $("#label-cloud").jQCloud(word_list);
  };

  // 案件综合评价指数分析接口定义
  var getZhpjzsfx = function(id) {
    var condition = {
      deptId: searchRuler.deptId,
      date1: searchRuler.date1,
      date2: searchRuler.date2,
      id: id,
      timestamp: new Date()
    };
    searchRuler.timestamp = condition.timestamp;
    sugon.requestJson(
      {
        url: sugon.interFaces.zxyp.aj.getZhpjzsfx,
        type: "post",
        async: true,
        data: condition
      },
      function(result) {
        if (!sugon.isPublished || result.timestamp == searchRuler.timestamp) {
          if (result.data.length == 0) {
            drawZhpjzsfx(zhpjzsfxData, condition.id);
          } else {
            zhpjzsfxData = result.data;
            drawZhpjzsfx(result.data);
          }
        }
      }
    );
  };

  // 画案件综合评价指数分析echarts图
  var drawZhpjzsfx = function(data, id) {
    var xData = [],
      yData = [];
    for (var i = 0; i < data.length; i++) {
      if (zhpjzsfxId == data[i].id && id) {
        xData.push({
          text: data[i].name + "\n" + data[i].value + "%",
          id: data[i].id,
          max: 100,
          color: "red"
        });
      } else {
        xData.push({
          text: data[i].name + "\n" + data[i].value + "%",
          id: data[i].id,
          max: 100
        });
      }
      yData.push(data[i].value);
    }
    zhpjzsfxChart = ec.init(document.getElementById("zhpjzsfx"));
    var option = {
      color: ["rgba(60, 136, 194, 0.8)", "rgba(29, 132, 198, 0.2)"],
      radar: [
        {
          indicator: xData,
          triggerEvent: true,
          center: ["50%", "50%"],
          radius: "60%",
          startAngle: 90,
          splitNumber: 4,
          shape: "circle",
          splitArea: {
            areaStyle: {
              color: [
                "rgba(114, 172, 209, 0)",
                "rgba(114, 172, 209, 0)",
                "rgba(114, 172, 209, 0)",
                "rgba(114, 172, 209, 0)",
                "rgba(114, 172, 209, 0)"
              ],
              shadowColor: "rgba(0, 0, 0, 0)",
              shadowBlur: 10
            }
          },
          axisLine: {
            lineStyle: {
              color: "rgba(73, 105, 144, 0.8)"
            }
          },
          splitLine: {
            lineStyle: {
              color: "rgba(73, 105, 144, 0.8)"
            }
          }
        }
      ],
      series: [
        {
          name: "雷达图",
          type: "radar",
          itemStyle: {
            normal: { areaStyle: { type: "default" } },
            emphasis: {
              // color: 各异,
              lineStyle: {
                width: 4
              }
            }
          },
          data: [
            {
              value: yData,
              name: "图一",
              symbol: "rect",
              symbolSize: 5,
              lineStyle: {
                normal: {
                  type: "dashed"
                }
              }
            }
          ]
        }
      ]
    };
    zhpjzsfxChart.setOption(option);
    if (zhpjzsfxChart) {
      zhpjzsfxChart.resize();
    }
    zhpjzsfxChart.off();
    zhpjzsfxChart.on("click", function(param) {
      $("#hjwtfx-title").html("环节问题分析");
      if (param.targetType) {
        var name = param.name;
        var index = 0;
        for (var i = 0; i < xData.length; i++) {
          if (name == xData[i].text) {
            index = i;
            break;
          }
        }
        zhpjzsfxId = xData[index].id;
        getZhpjzsfx(zhpjzsfxId);
        getHjwtfx(zhpjzsfxId);
        getAjdwfb(zhpjzsfxId);
      } else if (param.seriesType) {
        getZhpjzsfx();
        getHjwtfx();
        getAjdwfb();
      }
    });
  };

  // 环节问题分析接口定义
  var getHjwtfx = function(id, hjwtId) {
    var condition = {
      deptId: searchRuler.deptId,
      date1: searchRuler.date1,
      date2: searchRuler.date2,
      id: id,
      timestamp: new Date()
    };
    if (hjwtId) {
      condition.id1 = hjwtId;
    }
    searchRuler.timestamp = condition.timestamp;
    sugon.requestJson(
      {
        url: sugon.interFaces.zxyp.aj.getHjwtfx,
        type: "post",
        async: true,
        data: condition
      },
      function(result) {
        if (
          !sugon.isPublished ||
          (result.timestamp == searchRuler.timestamp && result.data.length > 0)
        ) {
          drawHjwtfx(result.data);
        }
      }
    );
  };

  // 画案件环节问题分析echarts图
  var drawHjwtfx = function(data) {
    var total = 0;
    for (var i = 0; i < data.length; i++) {
      total += Number(data[i].value);
    }
    hjwrfxChart = ec.init(document.getElementById("hjwtfx"));
    var option = {
      title: {
        text: total,
        subtext: "环节问题",
        left: "center",
        top: "28%",
        padding: [24, 0],
        subtextStyle: {
          color: "#000",
          fontSize: "14"
        },
        textStyle: {
          color: "#1D84C6"
        }
      },
      tooltip: {
        show: true
      },
      series: [
        {
          color: [
            "#A770B3",
            "#AF8744",
            "#ED7D31",
            "#3A9BBE",
            "#1D84C6",
            "#6463AF"
          ],
          name: "",
          type: "pie",
          clockWise: false,
          center: ["50%", "50%"],
          radius: ["40%", "56%"],
          hoverAnimation: false,
          itemStyle: {
            normal: {
              label: {
                show: true,
                position: "outside",
                formatter: function(params) {
                  var percent = "" + params.value / total;
                  percent = Math.round((percent * 100000) / 100) / 10 + "%";
                  return params.name + "\n" + percent;
                },
                rich: {
                  white: {
                    color: "#ddd",
                    align: "center"
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
        }
      ]
    };
    hjwrfxChart.setOption(option);
    hjwrfxChart.off();
    hjwrfxChart.on("click", function(param) {
      $("#hjwtfx-title").html("具体问题分析");
      if (param.data.id) {
        getHjwtfx(zhpjzsfxId, param.data.id);
        getAjdwfb(zhpjzsfxId, param.data.id);
      }
    });
  };

  // 案件问题单位分布接口定义
  var getAjdwfb = function(id, id1) {
    var condition = {
      deptId: searchRuler.deptId,
      date1: searchRuler.date1,
      date2: searchRuler.date2,
      id: id,
      id1: id1,
      timestamp: new Date()
    };
    searchRuler.timestamp = condition.timestamp;
    sugon.requestJson(
      {
        url: sugon.interFaces.zxyp.aj.getAjdwfb,
        type: "post",
        async: true,
        data: condition
      },
      function(result) {
        if (!sugon.isPublished || result.timestamp == searchRuler.timestamp) {
          ajwddwfbData = result.data;
          if (ajwddwfbData.length == 1) {
            $(".view-mid-nav").css("display", "none");
          } else {
            $(".view-mid-nav").css("display", "block");
          }
          drawAjdwfb(result.data[0]);
        }
      }
    );
  };

  // 画案件问题单位分布echarts图
  var drawAjdwfb = function(data) {
    var xData = [],
      yData = [],
      startValue = 0,
      endValue = 100,
      isShow = false,
      markData = [];
    if (data.length > 4) {
      isShow = true;
      startValue = Math.floor((1 - 4 / data.length) * 100);
    }
    for (var i = 0; i < data.length; i++) {
      yData.push(data[i].name);
      xData.push(data[i].value);
      if (data[i].selected) {
        markData = [
          { name: data[i].name, value: data[i].value, xAxis: data[i].value },
          { name: data[i].name, value: data[i].value, xAxis: data[i].value }
        ];
      }
    }
    ajdwfbChart = ec.init(document.getElementById("ajdwfb"));
    var option = {
      color: ["#269AE5"],
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow"
        }
      },
      grid: {
        top: "0",
        left: "0",
        width: isShow ? "88%" : "100%",
        height: "100%",
        containLabel: true
      },
      dataZoom: [
        {
          type: "inside",
          zoomOnMouseWheel: false
        },
        {
          show: isShow,
          type: "slider",
          start: startValue,
          end: endValue,
          width: 7,
          orient: "vertical",
          right: 0,
          handelSize: 0,
          zoomLock: true,
          textStyle: false
        }
      ],
      xAxis: {
        type: "value",
        boundaryGap: [0, 0.01]
      },
      yAxis: {
        type: "category",
        data: yData
        // axisLabel: {
        //     show: true,
        //     interval: 0,
        //     textStyle: {
        //         color: '#6c7177'
        //     },
        //     formatter: function(param) {
        //         var tempStr = "";
        //         if(param.length > 4) {
        //             for(var i=0;i<param.length;i++) {
        //                 if(i % 4 == 3) {
        //                     tempStr += param[i] + "\n";
        //                 }else {
        //                     tempStr += param[i];
        //                 }
        //             }
        //         }else {
        //             tempStr = param;
        //         }
        //         return tempStr;
        //     }
        // },
      },
      series: [
        {
          type: "bar",
          data: xData,
          barWidth: "15",
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
            //symbolSize: [20, 0],
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
    ajdwfbChart.setOption(option);
  };

  // 案件综合评价指数趋势分析接口定义
  var getZhpjzsfxTrend = function(id) {
    var condition = {
      deptId: searchRuler.deptId,
      date2: searchRuler.date2,
      id: id,
      timestamp: new Date()
    };
    searchRuler.timestamp = condition.timestamp;
    sugon.requestJson(
      {
        url: sugon.interFaces.zxyp.aj.getZhpjzsfxTrend,
        type: "post",
        async: true,
        data: condition
      },
      function(result) {
        if (!sugon.isPublished || result.timestamp == searchRuler.timestamp) {
          drawZhpjzsfxTrend(result);
        }
      }
    );
  };

  // 画案件综合评价指数趋势分析echarts图
  var drawZhpjzsfxTrend = function(result) {
    var data1 = result.data1;
    var data2 = result.data2;
    var xData = [],
      yData1 = [],
      yData2 = [],
      data2Max = 100,
      data2Min = data2[0].value;
    for (var i = 0; i < data1.length; i++) {
      data2Min = Math.min(Number(data2[i].value), data2Min);
      // data2Max = Math.max(Number(data2[i].value), data2Max);
      xData.push(data1[i].name);
      yData1.push(data1[i].value);
      yData2.push(data2[i].value);
    }
    data2Min -= 5;
    zhpjzsfxTrendChart = ec.init(document.getElementById("zhpjzsfxTrend"));
    var option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          crossStyle: {
            color: "#999"
          }
        }
      },
      legend: {
        data: ["案件办理量", "综合评价指数"]
      },
      grid: {
        top: "15%",
        left: "7%",
        width: "87%",
        height: "75%"
      },
      xAxis: [
        {
          type: "category",
          data: xData,
          axisPointer: {
            type: "shadow"
          }
        }
      ],
      yAxis: [
        {
          type: "value",
          name: "案件办理量"
        },
        {
          type: "value",
          name: "综合评价指数",
          min: data2Min,
          max: data2Max,
          axisLabel: {
            formatter: "{value}%"
          }
        }
      ],
      series: [
        {
          name: "案件办理量",
          type: "bar",
          data: yData1,
          barWidth: "15",
          itemStyle: {
            normal: {
              barBorderRadius: 2,
              borderWidth: 1,
              borderColor: "rgba(18, 86, 108, 0.5)",
              color: "#2597DE",
              label: {
                show: false
              }
            }
          }
        },
        {
          name: "综合评价指数",
          type: "line",
          yAxisIndex: 1,
          data: yData2
        }
      ]
    };

    zhpjzsfxTrendChart.setOption(option);
  };

  // 办案小助手-案件办理具体问题分析接口定义
  var getAjbljtwtfx = function(index) {
    var condition = {
      deptId: searchRuler.deptId,
      date1: searchRuler.date1,
      date2: searchRuler.date2,
      timestamp: new Date()
    };
    if (!(index === undefined || index === null || index === "")) {
      condition.type = 1 + index;
    }
    searchRuler.timestamp = condition.timestamp;
    sugon.requestJson(
      {
        url: sugon.interFaces.zxyp.aj.getAjbljtwtfx,
        type: "post",
        async: true,
        data: condition
      },
      function(result) {
        if (!sugon.isPublished || result.timestamp == searchRuler.timestamp) {
          var data = result.data;
          var $body, chartId;
          if (index === undefined || index === null || index === "") {
            $body = $("#ajbljtwtfx");
            chartId = "tab-chart";
          } else {
            $body = $("#pop-ajbljtwtfx");
            chartId = "tab-chart-pop";
          }
          createAjbljtwtfxDom(data, $body, chartId);
          for (var i = 0; i < data.length; i++) {
            drawAjbljtwtfx(i, data[i].wtzs, chartId);
          }
        }
      }
    );
  };

  // 画办案小助手-案件办理具体问题分析echarts图
  var drawAjbljtwtfx = function(i, data, chartId) {
    var xData = [],
      yData = [];
    for (var j = 0; j < data.length; j++) {
      xData.push(data[j].name);
      yData.push(data[j].value);
    }
    var chart = ec.init(document.getElementById(chartId + i));
    var option = {
      color: ["#A9D1EB"],
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      },
      tooltip: {
        show: true,
        position: ["30%", "10%"]
      },
      xAxis: {
        show: false,
        type: "category",
        boundaryGap: false,
        data: xData
      },
      yAxis: {
        show: false,
        type: "value"
      },
      series: [
        {
          data: yData,
          type: "line",
          areaStyle: {}
        }
      ]
    };
    chart.setOption(option);
    ajbljtwtfxChartArr.push(chart);
  };

  // 拼接办案小助手-案件办理具体问题分析dom
  var createAjbljtwtfxDom = function(data, $body, chartId) {
    $body.empty();
    $('<div class="tab-row"/>')
      .append($('<div class="tab-td" style="width: 60px;">排行</div>'))
      .append($('<div class="tab-td" style="width: 140px;">问题标签</div>'))
      .append($('<div class="tab-td" style="width: 60px;">数量</div>'))
      .append(
        $(
          '<div class="tab-td" style="width: calc(50% - 130px);">问题走势</div>'
        )
      )
      .append(
        $(
          '<div class="tab-td" style="width: calc(50% - 130px);">执行规范</div>'
        )
      )
      .appendTo($body);
    for (var i = 0; i < data.length; i++) {
      $('<div class="tab-row"/>')
        .append(
          $('<div class="tab-td" style="width: 60px;">' + data[i].ph + "</div>")
        )
        .append(
          $(
            '<div class="tab-td" style="width: 140px;">' +
              data[i].wtbq +
              "</div>"
          )
        )
        .append(
          $('<div class="tab-td" style="width: 60px;">' + data[i].sl + "</div>")
        )
        .append(
          $(
            '<div class="tab-td" id="' +
              chartId +
              i +
              '" style="height:30px; margin:5px 0;width: calc(50% - 130px);"></div>'
          )
        )
        .append(
          $(
            '<div class="tab-td tab-td-click" top-id="' +
              data[i].id +
              '" style="text-align: left; width: calc(50% - 130px);"><img src="../../img/zxyp/aj/file.png"><span>' +
              data[i].zxgf +
              "</span></div>"
          )
        )
        .appendTo($body);
    }
  };

  // 专项分析评价指数接口定义
  var getZxfxpjzs = function() {
    var condition = {
      deptId: searchRuler.deptId,
      date1: searchRuler.date1,
      date2: searchRuler.date2,
      timestamp: new Date()
    };
    searchRuler.timestamp = condition.timestamp;
    sugon.requestJson(
      {
        url: sugon.interFaces.zxyp.aj.getZxfxpjzs,
        type: "post",
        async: true,
        data: condition
      },
      function(result) {
        if (!sugon.isPublished || result.timestamp == searchRuler.timestamp) {
          zxfxpjzsData[0] = result.shlaj;
          zxfxpjzsData[1] = result.qclaj;
          drawZxfxpjzs(result);
        }
      }
    );
  };

  // 专项分析评价指数数据加载
  var drawZxfxpjzs = function(data) {
    airBubbleChart1 = ec.init(document.getElementById("air-bubble1"));
    airBubbleChart2 = ec.init(document.getElementById("air-bubble2"));
    var option = {
      title: {
        text: "水滴",
        textStyle: {
          color: "#fff",
          fontSize: "24",
          fontWeight: "450"
        },
        left: "23%",
        top: "33%"
      },
      series: [
        {
          type: "liquidFill",
          data: [],
          radius: "80%",
          // animationEasingUpdate: 'cubicOut',
          // 水球颜色
          color: [
            new ec.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#E0F1F9" },
              { offset: 1, color: "#22C8FC" }
            ])
          ],
          center: ["50%", "50%"],
          outline: {
            borderDistance: 0,
            itemStyle: {
              borderWidth: 2,
              borderColor: "#2A9BD5"
            }
          },
          label: {
            normal: {
              show: false,
              color: "#22C8FC",
              insideColor: "white",
              fontSize: 24
            }
          },
          backgroundStyle: {
            color: "rgba(232,241,248,0.8)"
          }
        }
      ]
    };
    var data1 = [data.shlaj / 100, 0.5, 0.4, 0.3];
    var data2 = [data.qclaj / 100, 0.5, 0.4, 0.3];
    option.series[0].data = data1;
    option.title.text = data.shlaj + "%";
    airBubbleChart1.setOption(option);
    option.series[0].data = data2;
    option.title.text = data.qclaj + "%";
    airBubbleChart2.setOption(option);
    if (airBubbleChart1) {
      airBubbleChart1.resize();
    }
    if (airBubbleChart2) {
      airBubbleChart2.resize();
    }
  };

  // 案件办理综合评价指数满意榜接口定义
  var getZsmyb = function(index, id) {
    var condition = {
      deptId: searchRuler.deptId,
      date1: searchRuler.date1,
      date2: searchRuler.date2,
      id: id,
      timestamp: new Date()
    };
    searchRuler.timestamp = condition.timestamp;
    sugon.requestJson(
      {
        url: sugon.interFaces.zxyp.aj.getZsmyb,
        type: "post",
        async: true,
        data: condition
      },
      function(result) {
        if (!sugon.isPublished || result.timestamp == searchRuler.timestamp) {
          renderZsmybDom(index, result);
        }
      }
    );
  };

  // 渲染案件办理综合评价指数满意榜dom
  var renderZsmybDom = function(index, data) {
    var level = data.level;
    var $this = $(".view-right-bottom-body>div").eq(index);
    var $img1 = $('<img src="../../img/zxyp/aj/top_fj.png">');
    var $img2 = $('<img src="../../img/zxyp/aj/top_sd.png">');
    var $img3 = $('<img src="../../img/zxyp/aj/top_mj.png">');
    $this.find("div.view-right-bottom-row").remove();
    switch (level) {
      case "2":
        $this
          .append(
            $('<div class="view-right-bottom-row"/>')
              .append($img3)
              .append($("<span/>").html(data.value1))
          )
          .append(
            $('<div class="view-right-bottom-row"/>')
              .append($('<img src="../../img/zxyp/aj/top_transparent.png">'))
              .append($("<span/>").html(data.value2))
          )
          .append(
            $('<div class="view-right-bottom-row"/>')
              .append($('<img src="../../img/zxyp/aj/top_transparent.png">'))
              .append($("<span/>").html(data.value3))
          );
        break;
      case "1":
        $this
          .append(
            $('<div class="view-right-bottom-row"/>')
              .append($img2)
              .append($("<span/>").html(data.value1))
          )
          .append(
            $('<div class="view-right-bottom-row"/>')
              .append($img3)
              .append($("<span/>").html(data.value2))
          );
        break;
      default:
        $this
          .append(
            $('<div class="view-right-bottom-row"/>')
              .append($img1)
              .append($("<span/>").html(data.value1))
          )
          .append(
            $('<div class="view-right-bottom-row"/>')
              .append($img2)
              .append($("<span/>").html(data.value2))
          );
        break;
    }
  };

  // 伤害类/侵财类案件综合评价指数
  var getPopShlZhpjzsfx = function(index) {
    popShlAjzhpjzsChart = ec.init(document.getElementById("pop-shl-ajzhpjzs"));
    var data = [
      {
        value: zxfxpjzsData[index],
        name: index == 0 ? "伤害类案件综合评价指数" : "侵财类案件综合评价指数"
      }
    ];
    var option = {
      tooltip: {
        formatter: "{b} : {c}%"
      },
      series: [
        {
          type: "gauge",
          radius: "90%",
          center: ["40%", "59%"],
          detail: {
            color: "#0380FF",
            fontSize: "16",
            formatter: "{value}%"
          },
          data: data,
          min: 0,
          max: 100,
          title: {
            show: false
          },
          axisLine: {
            // 坐标轴线
            show: true,
            lineStyle: {
              // 属性lineStyle控制线条样式
              color: [
                [
                  0.98,
                  new ec.graphic.LinearGradient(0, 0, 1, 0, [
                    { offset: 0, color: "#8FE8F0" },
                    { offset: 1, color: "#A6BAFF" }
                  ])
                ],
                [1, "red"]
              ],
              width: 5,
              shadowColor: "#fff" //默认透明
              //shadowBlur: 10
            }
          },
          axisTick: {
            // 坐标轴小标记
            show: false,
            length: 4, // 属性length控制线长
            lineStyle: {
              // 属性lineStyle控制线条样式
              color: "#BDBDBD",
              shadowColor: "#fff"
              //默认透明
            }
          },
          axisLabel: {
            show: true,
            distance: -45,
            fontSize: 10
          },
          pointer: {
            show: true,
            length: "80%",
            width: 2
          },
          itemStyle: {
            color: "#8692AC"
          },
          splitLine: {
            show: false
          }
        }
      ]
    };
    popShlAjzhpjzsChart.setOption(option);
  };

  // 案件综合评价指数
  var getPopAjzhpjzs = function() {
    popAjzhpjzsChart = ec.init(document.getElementById("pop-ajzhpjzs"));
    var data = [
      {
        value: zxfxpjzsData[2].substring(0, zxfxpjzsData[2].length - 1),
        name: "案件综合评价指数"
      }
    ];
    var option = {
      tooltip: {
        formatter: "{b} : {c}%"
      },
      series: [
        {
          type: "gauge",
          radius: "90%",
          center: ["40%", "59%"],
          detail: {
            color: "#0380FF",
            fontSize: "16",
            formatter: "{value}%"
          },
          data: data,
          min: 0,
          max: 100,
          title: {
            show: false
          },
          axisLine: {
            // 坐标轴线
            show: false,
            lineStyle: {
              // 属性lineStyle控制线条样式
              color: [
                [
                  0.98,
                  new ec.graphic.LinearGradient(0, 0, 1, 0, [
                    { offset: 0, color: "#8FE8F0" },
                    { offset: 1, color: "#A6BAFF" }
                  ])
                ],
                [1, "red"]
              ],
              width: 5,
              shadowColor: "#fff" //默认透明
              //shadowBlur: 10
            }
          },
          axisTick: {
            // 坐标轴小标记
            show: false,
            length: 4, // 属性length控制线长
            lineStyle: {
              // 属性lineStyle控制线条样式
              color: "#BDBDBD",
              shadowColor: "#fff"
              //默认透明
            }
          },
          axisLabel: {
            show: true,
            distance: -50,
            fontSize: 10
          },
          pointer: {
            show: true,
            length: "80%",
            width: 2
          },
          itemStyle: {
            color: "#8692AC"
          },
          splitLine: {
            show: false
          }
        }
      ]
    };
    popAjzhpjzsChart.setOption(option);
  };

  // 伤害类/侵财类案件综合评价指数分析接口定义
  var getPopShlAjzhpjzsfx = function(index) {
    var condition = {
      deptId: searchRuler.deptId,
      date1: searchRuler.date1,
      date2: searchRuler.date2,
      type: 1 + index,
      timestamp: new Date()
    };
    searchRuler.timestamp = condition.timestamp;
    sugon.requestJson(
      {
        url: sugon.interFaces.zxyp.aj.getZxfxzhpjzs,
        type: "post",
        async: true,
        data: condition
      },
      function(result) {
        if (!sugon.isPublished || result.timestamp == searchRuler.timestamp) {
          drawPopShlAjzhpjzsfx(result, condition.type);
        }
      }
    );
  };

  // 画伤害类/侵财类案件综合评价指数分析echarts图
  var drawPopShlAjzhpjzsfx = function(result, type) {
    if (popShlAjzhpjzsfxChart) {
      popShlAjzhpjzsfxChart.dispose();
    }
    var data1 = result.data1;
    var data2 = result.data2;
    var xData = [],
      yData1 = [],
      yData2 = [],
      data2Max = 100,
      data2Min = Number(data2[0].value),
      data1Min = Number(data1[0].value),
      data1Max = Number(data1[0].value);
    for (var i = 0; i < data1.length; i++) {
      data1Min = Math.min(Number(data1[i].value), data1Min);
      data2Min = Math.min(Number(data2[i].value), data2Min);
      data1Max = Math.max(Number(data1[i].value), data1Max);
      // data2Max = Math.max(Number(data2[i].value), data2Max);
      xData.push(data1[i].name);
      yData1.push(data1[i].value);
      yData2.push(data2[i].value);
    }
    data2Min -= 5;
    var diff = (data1Max - data1Min) / 2;
    data1Min = Number(data1Min - diff).toFixed(2);
    popShlAjzhpjzsfxChart = ec.init(
      document.getElementById("pop-shl-ajzhpjzsfx")
    );
    var option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          crossStyle: {
            color: "#999"
          }
        }
      },
      grid: {
        top: "25%",
        width: "75%",
        height: "63%"
      },
      legend: {
        show: true,
        data: ["受理时间", "综合评价指数"]
      },
      xAxis: [
        {
          type: "category",
          data: xData,
          axisPointer: {
            type: "shadow"
          }
        }
      ],
      yAxis: [],
      series: []
    };
    option.series = [];
    option.yAxis = [];
    if (type === 1) {
      option.legend.show = true;
      option.series.push({
        name: "受理时间",
        type: "bar",
        data: yData1,
        barWidth: "15",
        itemStyle: {
          normal: {
            barBorderRadius: 2,
            borderWidth: 1,
            borderColor: "rgba(18, 86, 108, 0.5)",
            color: "#2A9BD5",
            label: {
              show: false
            }
          }
        }
      });
      option.yAxis.push({
        type: "value",
        name: "受理时间"
        // min: data1Min,
        // max: data1Max
      });
      option.series.push({
        name: "综合评价指数",
        type: "line",
        yAxisIndex: 1,
        data: yData2
      });
      option.yAxis.push({
        type: "value",
        name: "综合评价指数",
        min: data2Min,
        max: data2Max,
        axisLabel: {
          formatter: "{value}%"
        }
      });
    } else {
      option.legend.show = false;
      option.series.push({
        name: "综合评价指数",
        type: "bar",
        data: yData1,
        barWidth: "15",
        itemStyle: {
          normal: {
            barBorderRadius: 2,
            borderWidth: 1,
            borderColor: "rgba(18, 86, 108, 0.5)",
            color: "#2A9BD5",
            label: {
              show: false
            }
          }
        }
      });
      option.yAxis.push({
        type: "value",
        name: "综合评价指数",
        min: data1Min
      });
    }
    popShlAjzhpjzsfxChart.setOption(option);
  };

  // 弹出页环节问题分析
  var getPopHjwtfx = function(index) {
    var condition = {
      deptId: searchRuler.deptId,
      date1: searchRuler.date1,
      date2: searchRuler.date2,
      type: 1 + index,
      timestamp: new Date()
    };
    searchRuler.timestamp = condition.timestamp;
    sugon.requestJson(
      {
        url: sugon.interFaces.zxyp.aj.getHjwtfx,
        type: "post",
        async: true,
        data: condition
      },
      function(result) {
        if (!sugon.isPublished || result.timestamp == searchRuler.timestamp) {
          drawPopHjwtfx(result.data);
        }
      }
    );
  };

  // 画弹出页环节问题分析echarts图
  var drawPopHjwtfx = function(data) {
    var len = data.length;
    var xData = [],
      yData = [];
    var colorArr = [
      "#4068EC",
      "#4B89DE",
      "#53A4E5",
      "#63B2ED",
      "#73C3F4",
      "#7FE3FB"
    ];
    var transparentData = {
      value: 0,
      name: "",
      itemStyle: {
        normal: {
          color: "transparent"
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
    popHjwtfxChart = ec.init(document.getElementById("pop-hjwtfx"));

    var option = {
      calculable: true,
      tooltip: {
        trigger: "item",
        formatter: "{b}:{c}"
      },
      legend: {
        icon: "circle",
        x: "center",
        y: "0",
        data: xData,
        textStyle: {
          color: "#000"
        }
      },
      series: [
        {
          type: "pie",
          radius: [37, 100],
          avoidLabelOverlap: false,
          startAngle: 0,
          center: ["50%", "40%"],
          roseType: "area",
          label: {
            show: true,
            formatter: function(param) {
              return param.data.name + "\n" + param.data.value;
            }
          },
          labelLine: {
            show: true,
            length: -5,
            length2: 2
          },
          selectedMode: "single",
          data: yData
        }
      ]
    };
    popHjwtfxChart.setOption(option);
  };

  // 弹出页案件问题单位分布接口定义
  var getPopAjwtdwfb = function(index) {
    var condition = {
      deptId: searchRuler.deptId,
      date1: searchRuler.date1,
      date2: searchRuler.date2,
      type: 1 + index,
      timestamp: new Date()
    };
    searchRuler.timestamp = condition.timestamp;
    sugon.requestJson(
      {
        url: sugon.interFaces.zxyp.aj.getAjdwfb,
        type: "post",
        async: true,
        data: condition
      },
      function(result) {
        if (!sugon.isPublished || result.timestamp == searchRuler.timestamp) {
          popAjwddwfbData = result.data;
          drawPopAjwtdwfb(result.data[0]);
        }
      }
    );
  };

  // 画弹出页案件问题单位分布echarts图
  var drawPopAjwtdwfb = function(data) {
    var xData = [],
      yData = [],
      markData = [],
      startValue = 0,
      endValue = 100,
      isShow = false;
    if (data.length > 6) {
      isShow = true;
      endValue = Math.floor((6 / data.length) * 100);
    }
    for (var i = 0; i < data.length; i++) {
      xData.push(data[i].name);
      yData.push(data[i].value);
      if (data[i].selected) {
        markData = [
          {
            name: data[i].name,
            value: data[i].value,
            xAxis: -1,
            yAxis: data[i].value
          },
          {
            name: data[i].name,
            value: data[i].value,
            xAxis: data.length,
            yAxis: data[i].value
          }
        ];
      }
    }
    popAjwtdwfbChart = ec.init(document.getElementById("pop-ajwtdwfb"));
    var option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow"
        }
      },
      grid: {
        left: 0,
        top: 10,
        height: isShow ? "85%" : "90%",
        containLabel: true
      },
      dataZoom: [
        {
          type: "inside",
          start: startValue,
          end: endValue,
          zoomOnMouseWheel: false
        },
        {
          show: isShow,
          type: "slider",
          start: startValue,
          end: endValue,
          height: 7,
          bottom: 0,
          handelSize: 0,
          zoomLock: true,
          textStyle: false
        }
      ],
      xAxis: [
        {
          type: "category",
          axisTick: { show: false },
          data: xData,
          axisLabel: {
            show: true,
            interval: 0,
            textStyle: {
              color: "#6c7177"
            },
            formatter: function(param) {
              var tempStr = "";
              if (param.length > 4) {
                for (var i = 0; i < param.length; i++) {
                  if (i % 4 == 3) {
                    tempStr += param[i] + "\n";
                  } else {
                    tempStr += param[i];
                  }
                }
              } else {
                tempStr = param;
              }
              return tempStr;
            }
          }
        }
      ],
      yAxis: [
        {
          type: "value"
        }
      ],
      series: [
        {
          name: "数量",
          type: "bar",
          barWidth: 20,
          data: yData,
          itemStyle: {
            normal: {
              barBorderRadius: 2,
              borderWidth: 1,
              borderColor: "rgba(18, 86, 108, 0.5)",
              color: "#2A9BD5",
              label: {
                show: false
              }
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
            }
          }
        }
      ]
    };
    if (!markData || markData.length != 0) {
      option.series[0].markLine.data = markData;
    } else {
      option.series[0].markLine = "";
    }
    popAjwtdwfbChart.setOption(option);
  };

  // 加载办案小助手-案件办理具体问题分析弹窗dom
  var renderAjbljtwtfxDom = function(data) {
    var $body = $(".pop-view2-body");
    $body.empty();
    for (var i = 0; i < data.length; i++) {
      $body.append(
        '<div><div class="pop-view2-up">' +
          data[i].title +
          '</div><div class="pop-view2-down">' +
          data[i].content +
          "</div></div>"
      );
    }
  };

  // 初始化页面
  var initPage = function() {
    // 初始化查询栏
    initSearchBar();
    // 初始化指标展示
    getZbzs();
    // 初始化热词
    getHfrc();
    // 初始化案件综合评价指数分析
    getZhpjzsfx();
    //  初始化环节问题分析
    getHjwtfx();
    // 初始化案件问题单位分布
    getAjdwfb();
    // 初始化案件综合评价指数趋势分析
    getZhpjzsfxTrend(0);
    // 初始化办案小助手-案件办理具体问题分析
    getAjbljtwtfx();
    // 初始化专项分析评价指数
    getZxfxpjzs();
    // 初始化案件办理综合评价指数满意榜
    var $div = $(".view-right-bottom-body>div");
    for (var i = 0; i < $div.length; i++) {
      getZsmyb(
        i,
        $div
          .eq(i)
          .find("select")
          .val()
      );
    }
  };

  // 初始化弹出页
  var initPopPage = function(index) {
    var str1 = index == 0 ? "伤害" : "侵财";
    var difference =
      (parseInt(zxfxpjzsData[index] * 100) -
        parseInt(
          zxfxpjzsData[2].substring(0, zxfxpjzsData[2].length - 1) * 100
        )) /
      100;
    var str2 = difference > 0 ? "高于" : "低于";
    difference = "" + Math.abs(difference);
    var str =
      str1 +
      '类案件评价指数<strong style="color: red;">' +
      str2 +
      '</strong>案件综合评价指数<strong style="color: red;">' +
      difference +
      "%</strong>";
    $("#pop-header").html(str1 + "类案件专项分析");
    $(".pop-view-bottom").html(str);
    // 初始化伤害类/侵财类案件综合评价指数
    getPopShlZhpjzsfx(index);
    // 初始化案件综合评价指数
    getPopAjzhpjzs();
    // 初始化伤害类/侵财类案件综合评价指数分析
    getPopShlAjzhpjzsfx(index);
    // 初始化环节问题分析
    getPopHjwtfx(index);
    // 初始化弹出页案件问题单位分布
    getPopAjwtdwfb(index);
    // 初始化弹出页办案小助手-案件办理具体问题分析
    getAjbljtwtfx(index);
  };

  // 案件群众回访热词下拉框改变事件
  $("#hfrc").change(function() {
    var container = $(".view-left-col-bottom-body");
    container.empty();
    var value = $(this).val();
    if (value == 0) {
      loadLabelCloud(hfrcData);
    } else {
      container.removeClass("jqcloud");
      for (var i = 0; i < hfrcData.length; i++) {
        container.append(
          $("<div/>")
            .append($("<span/>").html(i + 1 + "、" + hfrcData[i].name))
            .append($("<span/>").html(hfrcData[i].value))
        );
        if (i == 9) {
          break;
        }
      }
    }
  });

  // 单元切换事件
  $(".view-mid-nav>div").click(function() {
    var $parent = $(this).parent();
    var divClass;
    if ($parent.hasClass("inner-nav")) {
      divClass = ".inner-nav";
      var index = $(this).index(divClass + ">div");
      drawAjdwfb(ajwddwfbData[index]);
    } else if ($parent.hasClass("pop-nav")) {
      divClass = ".pop-nav";
      var index = $(this).index(divClass + ">div");
      drawPopAjwtdwfb(popAjwddwfbData[index]);
    }
    if (!$(this).hasClass("nav-selected")) {
      $(divClass + ">div").removeClass("nav-selected");
      $(this).addClass("nav-selected");
    }
  });

  // 云搜跳转按钮事件监听
  $(".input-group>span").click(function() {
    var value = $(this)
      .prev()
      .val();
    if (value) {
      sessionStorage.setItem("myKeywords", value);
      location.href = "index.html";
    }
  });
  // 监听列表办案小助手列表点击事件
  $("#pop-ajbljtwtfx, .view-mid-col-row-body").on(
    "click",
    ".tab-td-click",
    function() {
      var isView1Show = $(".pop-view").css("display");
      if (isView1Show == "block") {
        $(".pop-view-mask").css("z-index", "1002");
      } else {
        $(".pop-view-mask").css("display", "block");
      }
      $(".pop-view2").css("display", "block");
      // 写入标题
      $(".pop-view2-header>span").html(
        $(this)
          .prev()
          .prev()
          .prev()
          .html() + "  执行规范说明"
      );
      var condition = { id: $(this).attr("top-id"), timestamp: new Date() };
      searchRuler.timestamp = condition.timestamp;
      sugon.requestJson(
        {
          url: sugon.interFaces.zxyp.aj.getZxgf,
          type: "post",
          data: condition
        },
        function(result) {
          if (!sugon.isPublished || result.timestamp == searchRuler.timestamp) {
            renderAjbljtwtfxDom(result.data);
          }
        }
      );
    }
  );

  // 弹窗2的关闭按钮点击事件
  $(".pop-view2-header>i").click(function() {
    var isView1Show = $(".pop-view").css("display");
    if (isView1Show == "none") {
      $(".pop-view-mask").css("display", "none");
    } else {
      $(".pop-view-mask").css("z-index", "1001");
    }
    $(".pop-view2").css("display", "none");
  });

  // 案件综合评价指数趋势分析下拉框切换事件
  $("#qsfx-select").change(function() {
    getZhpjzsfxTrend($(this).val());
  });

  // 案件办理综合评价指数满意榜下拉框切换事件
  $(".view-right-bottom-row-header").on("change", "select", function() {
    getZsmyb(
      $(this)
        .parent()
        .index(".view-right-bottom-row-header"),
      $(this).val()
    );
  });

  // 弹出框点击事件
  $(".click-div").click(function() {
    $(".pop-view-mask").css("display", "block");
    $(".pop-view").css("display", "block");
    var index = $(this).index(".click-div");
    var str1 = index == 0 ? "伤害类案件评价指数" : "侵财类案件评价指数";
    var str2 = index == 0 ? "伤害类案件评价指数分析" : "侵财类案件评价指数分析";
    $("#pop-shl-ajzhpjzs-span").html(str1);
    $("#pop-shl-ajzhpjzsfx-span").html(str2);
    // 初始化弹出页
    initPopPage(index);
  });

  // 弹出框关闭按钮事件
  $(".pop-view-header>i").click(function() {
    $(".pop-view").css("display", "none");
    $(".pop-view-mask").css("display", "none");
  });

  // 点击查询按钮初始化页面
  $(".search-btn").click(initPage);

  // 页面入口
  $(function() {
    initPage();
  });
});
