requirejs(["common", "ec", "jqcloud"], function(sugon, ec) {
  // 全局查询尺度
  var searchRuler = {},
    search = {};
  var param1, param2;
  var hfrcData = [],
    gddwfbData = [],
    mydData = [];
  // 获取当前时间并加减固定月份
  var getDate = function(difference) {
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
      return resultYear + "-" + resultMonth;
    }
  };

  // 初始化查询栏
  var initSearchBar = function() {
    var lastMonth = getDate(-1);
    searchRuler.deptId = "2014110416460086100000002942";
    searchRuler.date1 = getDate(-7);
    searchRuler.date2 = getDate(-2);
    searchRuler.deptName = "南京市公安局";
    search.deptId = "2014110416460086100000002942";
    search.date1 = getDate(-7);
    search.date2 = getDate(-2);
    search.deptName = "南京市公安局";

    $("#place").val("南京市公安局");
    $("#placeCode").val("2014110416460086100000002942");
    $("#date-input1").val(searchRuler.date1);
    $("#date-input2").val(searchRuler.date2);
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

  //获取树数据
  function getTree() {
    var treeData = [];
    sugon.requestJson(
      {
        type: "POST",
        url: sugon.interFaces.zxyp.jcj.Tree
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

  var initTxt = function() {
    sugon.requestJson(
      {
        type: "POST",
        async: true,
        url: sugon.interFaces.zxyp.ckfw.Txt,
        data: { search: JSON.stringify(search) }
      },
      function(result) {
        for (var i = 0; i < result.data.length; i++) {
          $("#left_top .val")
            .eq(i)
            .html(result.data[i].value);
          $("#left_top .txt")
            .eq(i)
            .html(result.data[i].name);
        }
      }
    );
  };

  // 工单量走势分析
  var getGdzsfx = function() {
    var condition = { search: JSON.stringify(search) };
    sugon.requestJson(
      {
        url: sugon.interFaces.zxyp.ckfw.getGdzsgx,
        type: "post",
        async: true,
        data: condition
      },
      function(result) {
        drawGdzsfx(result.data);
      }
    );
  };

  // 画工单量走势分析echarts图
  var drawGdzsfx = function(data) {
    var xData = [],
      yData = [],
      min = Number(data[0].value),
      max = Number(data[0].value);
    for (var i = 0; i < data.length; i++) {
      xData.push(data[i].name);
      yData.push(data[i].value);
      min = Number(data[i].value) < min ? data[i].value : min;
      max = Number(data[i].value) > max ? data[i].value : max;
    }
    var chart3 = ec.init(document.getElementById("chart11"));

    var option = {
      color: "#3cb2fc",
      tooltip: {
        trigger: "axis"
      },
      grid: {
        top: 25,
        bottom: 25,
        left: 40,
        right: 0
      },
      xAxis: [
        {
          type: "category",
          axisTick: {
            show: false
          },
          axisLine: {
            onZero: false,
            lineStyle: {
              color: "#426791"
            }
          },
          axisLabel: {
            textStyle: {
              color: "#000"
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#c9d3df"
            }
          },
          data: xData
        }
      ],
      yAxis: [
        {
          type: "value",
          splitNumber: 5,
          min: min,
          max: max,
          axisTick: {
            show: false
          },
          axisLine: {
            onZero: false,
            lineStyle: {
              color: "#426791"
            }
          },
          axisLabel: {
            textStyle: {
              color: "#000"
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#c9d3df"
            }
          }
        }
      ],
      series: [
        {
          name: "数值",
          showSymbol: true,
          symbolSize: 8,
          type: "line",
          itemStyle: {
            normal: {
              label: {
                show: true,
                backgroundColor: "#2d78b2",
                borderColor: "#3cb2fc",
                borderWidth: "1",
                borderRadius: [5, 5, 5, 5],
                padding: [2, 2, 2, 2],
                color: "#e6ecfa"
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
    chart3.on("click", function(param) {
      searchRuler.id1 = param.name;
      searchRuler.id2 = "";
      getYwfx();
      getGddwfb();
    });
  };

  // 工单业务分析
  var getYwfx = function() {
    var condition = { search: JSON.stringify(search) };
    if (searchRuler.id1 || searchRuler.id1 == "0") {
      condition.id1 = searchRuler.id1;
    }
    sugon.requestJson(
      {
        url: sugon.interFaces.zxyp.ckfw.getGdywfx,
        type: "post",
        async: true,
        data: condition
      },
      function(result) {
        drawYwfx(result.data);
      }
    );
  };

  // 画工单业务分析echarts图
  var drawYwfx = function(data) {
    var total = 0;
    for (var i = 0; i < data.length; i++) {
      total += Number(data[i].value);
    }
    var chart = ec.init(document.getElementById("chart22"));
    var option = {
      title: {
        text: total,
        subtext: "业务分析",
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
    chart.setOption(option);
    chart.off();
    chart.on("click", function(param) {
      searchRuler.id2 = param.data.id;
      getGddwfb();
    });
  };

  // 工单单位分布
  var getGddwfb = function() {
    var condition = { search: JSON.stringify(search) };
    if (searchRuler.id1 || searchRuler.id1 == "0") {
      condition.id1 = searchRuler.id1;
    }
    if (searchRuler.id2 || searchRuler.id2 == "0") {
      condition.id2 = searchRuler.id2;
    }

    sugon.requestJson(
      {
        url: sugon.interFaces.zxyp.ckfw.getGddwfb,
        type: "post",
        async: true,
        data: condition
      },
      function(result) {
        gddwfbData = result.data;
        if (result.data.length == 1) {
          $(".tab4").css("display", "none");
        } else {
          $(".tab4").css("display", "block");
        }
        drawGddwfb(gddwfbData[0]);
      }
    );
  };

  // 画诉求单位分布echarts图
  var drawGddwfb = function(data) {
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
    var chart = ec.init(document.getElementById("chart33"));
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
        type: "category",
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

  var initMyd = function() {
    sugon.requestJson(
      {
        type: "POST",
        async: true,
        url: sugon.interFaces.zxyp.ckfw.Myd,
        data: { dept: $("#dept3").val(), search: JSON.stringify(search) }
      },
      function(result) {
        var xData = [],
          yData = [],
          iData = [],
          min = result.data[0].value1,
          max = result.data[0].value1;
        for (var i = 0; i < result.data.length; i++) {
          xData.push(result.data[i].name);
          yData.push(result.data[i].value1);
          iData.push(result.data[i].value2);
          result.data[i].value1 < min ? (min = result.data[i].value1) : min;
          result.data[i].value1 > max ? (max = result.data[i].value1) : max;
        }

        var Chart3 = ec.init(document.getElementById("chart3"));

        var option = {
          color: "#3cb2fc",
          tooltip: {
            trigger: "axis"
          },
          grid: {
            top: 25,
            bottom: 25,
            left: 40,
            right: 0
          },
          xAxis: [
            {
              type: "category",
              axisTick: {
                show: false
              },
              axisLine: {
                onZero: false,
                lineStyle: {
                  color: "#426791"
                }
              },
              axisLabel: {
                interval: 0,
                textStyle: {
                  color: "#b3cce2"
                }
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: "#c9d3df"
                }
              },
              data: xData
            }
          ],
          yAxis: [
            {
              type: "value",
              splitNumber: 5,
              min: min,
              max: max,
              axisTick: {
                show: false
              },
              axisLine: {
                onZero: false,
                lineStyle: {
                  color: "#426791"
                }
              },
              axisLabel: {
                formatter: "{value}%",
                textStyle: {
                  color: "#b3cce2"
                }
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: "#c9d3df"
                }
              }
            }
          ],
          series: [
            {
              name: "数值",
              showSymbol: true,
              symbolSize: 8,
              type: "line",
              itemStyle: {
                normal: {
                  label: {
                    show: true,
                    backgroundColor: "#2d78b2",
                    borderColor: "#3cb2fc",
                    borderWidth: "1",
                    borderRadius: [5, 5, 5, 5],
                    padding: [2, 2, 2, 2],
                    color: "#e6ecfa",
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
      }
    );
  };

  $(".switch-panel").on("change", "#dept3", function() {
    initMyd();
  });

  var initDwqk = function(index, flag) {
    sugon.requestJson(
      {
        type: "POST",
        async: true,
        url: sugon.interFaces.zxyp.ckfw.Dwqk,
        data: { search: JSON.stringify(search) }
      },
      function(result) {
        var data = result.data[index];
        if (result.data.length == 1) {
          $(".tab2").css("display", "none");
        } else {
          $(".tab2").css("display", "block");
        }
        var xData = [],
          yData = [],
          min = Number(data[0].value),
          max = Number(data[0].value),
          isShow = false,
          startValue = 0,
          endValue = 100;
        if (data.length == 0) {
          if (flag) {
            xData.push("无数据");
            yData.push(0);
          } else {
            return;
          }
        } else {
          for (var i = 0; i < data.length; i++) {
            xData.push(data[i].name);
            yData.push(data[i].value);
            min = Math.min(min, data[i].value);
            max = Math.max(max, data[i].value);
          }
        }
        if (data.length > 5) {
          isShow = true;
          endValue = Math.floor((5 / data.length) * 100);
        }
        var diff = max - min;
        min = Number(min - diff).toFixed(2);
        max = Number(max + diff).toFixed(2);
        var Chart4 = ec.init(document.getElementById("chart4"));
        var option = {
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow"
            }
          },
          color: ["#1e9eb7"],
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
          grid: {
            left: 0,
            top: "20%",
            width: "100%",
            height: isShow ? "75%" : "80%",
            containLabel: true
          },
          xAxis: [
            {
              type: "category",
              axisTick: { show: false },
              splitArea: { show: false },
              data: xData,
              axisLabel: {
                interval: 0,
                textStyle: {
                  color: "#b3cce2"
                }
              },
              axisLine: {
                lineStyle: {
                  color: "#d5d8e1"
                }
              }
            }
          ],
          yAxis: [
            {
              type: "value",
              min: min,
              max: max,
              axisTick: { show: false },
              splitLine: {
                lineStyle: {
                  color: "#d5d8e1"
                }
              },
              splitArea: { show: false },
              splitNumber: 5,
              axisLabel: {
                formatter: "{value}%",
                textStyle: {
                  color: "#b3cce2"
                }
              },
              axisLine: {
                lineStyle: {
                  color: "#d5d8e1"
                }
              }
            }
          ],
          series: [
            {
              type: "bar",
              barWidth: 20,
              data: yData
            }
          ]
        };

        Chart4.setOption(option);
      }
    );
  };

  // tab2切换事件
  $(".switch-panel").on("click", ".tab2>div", function() {
    $(".tab2 .selected").removeClass("selected");
    $(this).attr("class", "selected");
    var index = $(".tab2>div").index(this);
    initDwqk(index, 1);
  });

  // tab4切换事件
  $(".switch-panel").on("click", ".tab4>div", function() {
    $(".tab4 .selected").removeClass("selected");
    $(this).attr("class", "selected");
    var index = $(".tab4>div").index(this);
    drawGddwfb(gddwfbData[index]);
  });

  var initMydfx = function(param) {
    sugon.requestJson(
      {
        type: "POST",
        async: true,
        url: sugon.interFaces.zxyp.ckfw.Rador,
        data: { id: param, search: JSON.stringify(search) }
      },
      function(result) {
        var indicatorData = [],
          seriesData = [];
        if (result.data.length == 0) {
          return;
        }
        for (var i = 0; i < result.data.length; i++) {
          indicatorData.push({
            text: result.data[i].name,
            max: result.data[i].value
          });
          seriesData.push(result.data[i].value);
        }

        var Chart2 = ec.init(document.getElementById("chart2"));

        Chart2.off();
        Chart2.on("click", function(params) {
          if (!params.targetType) {
            (param1 = ""), (param2 = "");
            initMydfx("");
            initJtwt("");
            initAjwt("", "", 0);
            return;
          }
          if (param2) {
            return;
          }
          if (params.targetType) {
            var tempId = "";
            for (var i = 0; i < result.data.length; i++) {
              if (params.name == result.data[i].name) {
                tempId = result.data[i].id;
                break;
              }
            }
            param1 = tempId;
            initMydfx(param1);
            initJtwt(param1);
            initAjwt(param1, param2, 0);
          }
        });

        var option = {
          color: "rgba(52, 237, 255, 0.35)",
          radar: [
            {
              indicator: indicatorData,
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
                  value: seriesData,
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

        Chart2.setOption(option);
      }
    );
  };

  var initJtwt = function(param) {
    sugon.requestJson(
      {
        type: "POST",
        async: true,
        url: sugon.interFaces.zxyp.ckfw.Jtwt,
        data: { id: param, search: JSON.stringify(search) }
      },
      function(result) {
        var scaleData = result.data;
        if (result.data.length == 0) {
          return;
        }

        var Chart5 = ec.init(document.getElementById("chart5"));

        Chart5.off();
        Chart5.on("click", function(params) {
          param2 = params.data.id;
          initAjwt(param1, param2, 0);
        });

        var data = [];

        for (var i = 0; i < scaleData.length; i++) {
          data.push({
            value: scaleData[i].value,
            name: scaleData[i].name,
            id: scaleData[i].id,
            itemStyle: {
              normal: {
                borderColor: "rgba(255, 255, 255, 0.7)",
                borderWidth: 1
              }
            }
          });
        }

        var option = {
          tooltip: {
            show: true
          },
          //color: ['rgba(44, 193, 213, 1)', 'rgba(220, 214, 147, 1)', 'rgba(238, 172, 49, 1)', 'rgba(223, 102, 66, 1)', 'rgba(0, 246, 151, 1)', 'rgba(81, 86, 186, 1)'],
          series: [
            {
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
                      var tempStr = "";
                      tempStr = params.name + "\n" + params.value;
                      return tempStr;
                    },
                    rich: {
                      white: {
                        color: "#ddd",
                        align: "center",
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
            }
          ]
        };

        Chart5.setOption(option);
      }
    );
  };

  var initAjwt = function(param11, param22, index, flag) {
    sugon.requestJson(
      {
        type: "POST",
        async: true,
        url: sugon.interFaces.zxyp.ckfw.Ajwt,
        data: { id1: param11, id2: param22, search: JSON.stringify(search) }
      },
      function(result) {
        var data = result.data[index];
        if (result.data.length == 1) {
          $(".tab3").css("display", "none");
        } else {
          $(".tab3").css("display", "block");
        }
        var xData = [],
          yData = [];
        if (data.length == 0) {
          if (flag) {
            xData.push("无数据");
            yData.push(0);
          } else {
            return;
          }
        } else {
          for (var i = 0; i < data.length; i++) {
            xData.push(data[i].name);
            yData.push(data[i].value);
          }
        }

        var Chart6 = ec.init(document.getElementById("chart6"));

        var option = {
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow"
            }
          },
          color: ["#1e9bdd"],
          grid: {
            left: "0px",
            right: "15px",
            bottom: "5px",
            top: "40px",
            containLabel: true
          },
          xAxis: {
            type: "value"
          },
          yAxis: {
            type: "category",
            data: xData
          },
          series: [
            {
              name: "",
              type: "bar",
              data: yData
            }
          ]
        };

        Chart6.setOption(option);
      }
    );
  };

  $(".tab3>div").bind("click", function() {
    $(".tab3 .selected").removeClass("selected");
    $(this).attr("class", "selected");
    var index = $(".tab3>div").index(this);
    initAjwt(param1, param2, index, 1);
  });

  var initRankList = function() {
    searchRuler.id3 = $(".first-selector").val();
    searchRuler.id4 = $(".second-selector").val();
    sugon.requestJson(
      {
        type: "POST",
        async: true,
        url: sugon.interFaces.zxyp.ckfw.Rank,
        data: { id: searchRuler.id4, search: JSON.stringify(search) }
      },
      function(result) {
        mydData = result.data;
        renderRankList();
      }
    );
  };

  var renderRankList = function() {
    var $body = $(".rank-list-body");
    $body.empty();
    var data = [];
    mydData.map(function(val) {
      if (searchRuler.id3 == val.type) {
        data = val.values;
      }
    });
    data.map(function(val, index) {
      var $div = $("<div/>");
      var $img,
        color = "p";
      switch (index) {
        case 0:
          $img = '<img src="../../img/zxyp/jcj/one.png">';
          color = "g";
          break;
        case 1:
          $img = '<img src="../../img/zxyp/jcj/two.png">';
          color = "b";
          break;
        case 2:
          $img = '<img src="../../img/zxyp/jcj/three.png">';
          break;
        default:
          $img = index + 1;
          break;
      }
      var rankLab = $("<div/>")
        .addClass("rankLab")
        .append($("<div/>").append($img))
        .append($("<div/>").html(val.name));
      var rankImg = $('<div class="rankImg lh"></div>')
        .addClass(color)
        .html(val.value);
      $div.append(rankLab).append(rankImg);
      $body.append($div);
    });
  };

  $(".newMenu").on("change", "select", function() {
    var $this = $(this);
    if ($this.hasClass("first-selector")) {
      searchRuler.id3 = $this.val();
      renderRankList();
    } else {
      initRankList();
    }
  });

  var initTxt2 = function() {
    sugon.requestJson(
      {
        type: "POST",
        async: true,
        url: sugon.interFaces.zxyp.ckfw.Yw,
        data: { search: JSON.stringify(search) }
      },
      function(result) {
        for (var i = 0; i < result.data.length; i++) {
          $(".mid_title")
            .eq(i)
            .html(result.data[i].name);
          $(".val4")
            .eq(i)
            .html(result.data[i].value1);
          $(".val5")
            .eq(i)
            .html(result.data[i].value2);
          $(".val6")
            .eq(i)
            .html(result.data[i].value3);
          $(".val7")
            .eq(i)
            .html(result.data[i].value4);
        }
      }
    );
  };

  $(".check").bind("click", function() {
    if ($("#keywords").val()) {
      sessionStorage.setItem("myKeywords", $("#keywords").val());
      location.href = "index.html";
    }
  });

  // 加载标签云
  var loadLabelCloud = function(data) {
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
    $("#word_cloud").jQCloud(word_list);
  };

  var initWordCloud = function(param) {
    $(".world_cloud").empty();
    if (param == 0) {
      sugon.requestJson(
        {
          type: "POST",
          async: true,
          url: sugon.interFaces.zxyp.ckfw.Tag,
          data: { search: JSON.stringify(search) }
        },
        function(result) {
          hfrcData = result.data;
          loadLabelCloud(result.data);
        }
      );
    } else {
    }
  };
  $("#dept").change(function() {
    var container = $(".world_cloud");
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

  var initWtyc = function(param) {
    sugon.requestJson(
      {
        type: "POST",
        async: true,
        url: sugon.interFaces.zxyp.ckfw.Ckfw,
        data: { id: param, search: JSON.stringify(search) }
      },
      function(result) {
        $(".wtList").empty();
        for (var i = 0; i < result.data.length; i++) {
          var str =
            result.data[i].name.length > 15
              ? result.data[i].name.substr(0, 15) + "..."
              : result.data[i].name;
          var tempStr = i + 1 + ". " + str;
          var tempImg =
            result.data[i].type == "1"
              ? "../../img/zxyp/ckfw/red.png"
              : "../../img/zxyp/ckfw/blue.png";
          $(".wtList").append(
            "<div id=" +
              result.data[i].id +
              ">" +
              "<span class='lh l tt'>" +
              tempStr +
              "</span>" +
              "<span class='lh y advise'>建议</span>" +
              "<span class='lh y img'><img src=" +
              tempImg +
              " /></span>" +
              "</div>"
          );
        }
      }
    );
  };

  $(".wtTab").bind("click", function() {
    initWtyc(this.id);
  });

  // 中间层右上角切换事件
  $(".switch-panel").on("click", ".switch-btn", function() {
    var $thisPanel = $(".switch-panel");
    var $this = $(this);
    var threePanel =
      '<div class="group_child"><div class="subTitle"><span>一般工单量走势分析</span>' +
      '</div><div class="content"><div id="chart11"></div></div></div><div class="group_child">' +
      '<div class="subTitle"><span>一般工单业务分析</span></div><div class="content">' +
      '<div id="chart22"></div></div></div><div class="group_child" style="margin-right: 0px;">' +
      '<div class="subTitle">' +
      '<span>一般工单各单位情况</span><span class="switch-btn switch-three"></span>' +
      '</div><div class="content"><div class="tab4"><div class="selected">一单元</div>' +
      '<div>二单元</div><div>三单元</div><div style="border-right: 0px;">其他</div>' +
      '</div><div id="chart33"></div></div></div>';
    var twoPanel =
      '<div class="myd">' +
      '<div class="subTitle2">' +
      '<span class="l" style="font-size: 16px;">窗口服务满意度趋势分析</span>' +
      '<span class="y">' +
      '<select id="dept3">' +
      '<option value="0">窗口服务</option>' +
      '<option value="1">户籍业务</option>' +
      '<option value="2">身份证业务</option>' +
      '<option value="3">出入境业务</option>' +
      '<option value="4">车辆业务</option>' +
      '<option value="5">驾证业务</option>' +
      '<option value="6">监管业务</option>' +
      "</select>" +
      "</span>" +
      "</div>" +
      '<div class="content"><div id="chart3"></div></div></div>' +
      '<div class="dwqk"><div class="subTitle2">' +
      '<span style="font-size: 16px;">窗口服务满意度各单位情况</span>' +
      '<span class="switch-two switch-btn"></span>' +
      "</div>" +
      '<div class="content">' +
      '<div class="tab2">' +
      '<div class="selected">一单元</div>' +
      "<div>二单元</div>" +
      "<div>三单元</div>" +
      '<div style="border-right: 0;">其他</div>' +
      "</div>" +
      '<div id="chart4"></div>' +
      "</div>" +
      "</div>";

    if ($this.hasClass("switch-two")) {
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
  });

  var initView = function() {
    //左上文本
    initTxt();
    if ($(".switch-btn").hasClass("switch-three")) {
      searchRuler.id1 = "";
      searchRuler.id2 = "";
      getGdzsfx();
      getYwfx();
      getGddwfb();
    } else {
      //满意度走势
      initMyd();
      //满意度各单位
      initDwqk(0);
    }
    //满意度分析
    initMydfx("");
    //具体问题
    initJtwt("");
    //案件问题
    initAjwt("", "", 0);
    // 满意度排行榜
    initRankList();
    //中上文本
    initTxt2();
    //词云
    initWordCloud($("#dept").val());
    //问题预测
    initWtyc("");
  };

  var initPage = function() {
    // 初始化查询栏
    initSearchBar();
    // 分析报告下载
    $(".view-header-right").bind("click", function() {
      alert("分析报告下载...");
    });
    // 初始化页面
    $(".search-btn").bind("click", function() {
      searchRuler.deptId = $("#placeCode").val();
      searchRuler.date1 = $("#date-input1").val();
      searchRuler.date2 = $("#date-input2").val();
      searchRuler.deptName = $("#place").val();
      search.deptId = $("#placeCode").val();
      search.date1 = $("#date-input1").val();
      search.date2 = $("#date-input2").val();
      search.deptName = $("#place").val();
      initView();
    });
    initView();
  };

  // 页面入口
  $(function() {
    initPage();
  });
});
