requirejs(["common", "ec", "ecPlugin"], function(sugon, ec) {
  // 全局查询尺度，中1-3数据，中2-3数据
  var searchRuler = {},
    mid1_3Data = [],
    mid2_3Data = [];

  // 初始化切换框
  var initSwitchPanel = function($div) {
    $div.removeClass("switch-selected");
    $div.eq(0).addClass("switch-selected");
  };

  // 初始化查询条件
  var initCondition = function() {
    $("#left2-1").val(0);
    initSwitchPanel($(".switch1-3 > div"));
    initSwitchPanel($(".switch2-3 > div"));
    initSwitchPanel($(".switch-panel2 > div"));
    $(".mid1-2-img").css("visibility", "hidden");
    $(".mid2-2-img").css("visibility", "hidden");
    $("#right2-2").val(0);
    $("#right2-3").val(0);
    searchRuler = {
      deptId: $("#dept-id").val(),
      date1: $("#date1").val(),
      date2: $("#date2").val()
    };
  };

  // 初始化左1面板
  var initLeft1 = function() {
    sugon.requestJson(
      {
        type: "post",
        url: sugon.interFaces.zxyp.jtsg.left1,
        async: true,
        data: searchRuler
      },
      function(result) {
        for (var key in result.data) {
          $("#" + key).html(result.data[key]);
        }
      }
    );
  };

  // 初始化左2面板
  var initLeft2 = function() {
    sugon.requestJson(
      {
        type: "post",
        url: sugon.interFaces.zxyp.jtsg.left2,
        async: true,
        data: searchRuler
      },
      function(result) {
        var xData = [],
          yData = [];
        for (var i = 0; i < result.data.length; i++) {
          xData.push(result.data[i].name);
          yData.push(result.data[i].value);
        }
        let minAndMax = sugon.handleMinAndMax(yData);
        var option = {
          color: "#3cb2fc",
          tooltip: {
            trigger: "axis"
          },
          grid: {
            top: 25,
            bottom: 25,
            left: 60,
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
                // interval: 0,
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
              min: minAndMax.min,
              max: minAndMax.max,
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
                formatter: function(param) {
                  return Number(param).toFixed(3) + "%";
                },
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
                  }
                }
              },
              data: yData
            }
          ]
        };
        sugon.renderChart({ id: "left2", data: result.data, option });
      }
    );
  };

  // 初始化中1-1面板
  var initMid1_1 = function() {
    sugon.requestJson(
      {
        type: "post",
        url: sugon.interFaces.zxyp.jtsg.mid1_1,
        async: true,
        data: searchRuler
      },
      function(result) {
        var data = result.data;
        var xData = [],
          yData = [];
        for (var i = 0; i < data.length; i++) {
          var name = "";
          if (data[i].name.length) {
            for (var j = 0; j < data[i].name.length; j++) {
              if (j % 3 != 2 || j == data[i].name.length - 1) {
                name += data[i].name[j];
              } else {
                name += data[i].name[j] + "\n";
              }
            }
          }
          if (searchRuler.mid1_1 == data[i].id) {
            xData.push({
              text: name + "\n" + data[i].value + "%",
              id: data[i].id,
              max: 100,
              color: "red"
            });
          } else {
            xData.push({
              text: name + "\n" + data[i].value + "%",
              id: data[i].id,
              max: 100
            });
          }

          yData.push(data[i].value);
        }
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
        sugon.renderChart({ id: "mid1-1", data: result.data, cb, option });

        // 点击回调
        function cb(param) {
          if (param.targetType) {
            var name = param.name;
            var index = 0;
            for (var i = 0; i < xData.length; i++) {
              if (name == xData[i].text) {
                index = i;
                break;
              }
            }
            searchRuler.mid1_1 = xData[index].id;
          } else if (param.seriesType) {
            searchRuler.mid1_1 = "";
          }
          searchRuler.mid1_2 = "";
          searchRuler.mid1_3 = 0;
          initSwitchPanel($(".switch1-3 > div"));
          initMid1_1();
          initMid1_2();
          initMid1_3();
          $(".mid1-2-img").css("visibility", "hidden");
        }
      }
    );
  };

  // 初始化中1-2面板
  var initMid1_2 = function() {
    sugon.requestJson(
      {
        type: "post",
        url: sugon.interFaces.zxyp.jtsg.mid1_2,
        async: true,
        data: searchRuler
      },
      function(result) {
        var data = result.data;
        var total = 0;
        for (var i = 0; i < data.length; i++) {
          total += Number(data[i].value);
        }
        var option = {
          title: {
            text: total,
            subtext: "具体问题",
            left: "center",
            top: "36%",
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
                      var name = "";
                      for (var i = 0; i < params.name.length; i++) {
                        if (i % 3 != 2 || i == params.name.length - 1) {
                          name += params.name[i];
                        } else {
                          name += params.name[i] + "\n";
                        }
                      }
                      return name + "\n" + percent;
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
        sugon.renderChart({ id: "mid1-2", data: result.data, cb, option });
        // 点击回调
        function cb(param) {
          if (param.data.id) {
            searchRuler.mid1_2 = param.data.id;
            searchRuler.mid1_3 = 0;
            initSwitchPanel($(".switch1-3 > div"));
            initMid1_2();
            initMid1_3();
            $(".mid1-2-img").css("visibility", "visible");
          }
        }
      }
    );
  };

  // 初始化中1-3面板
  var initMid1_3 = function() {
    sugon.requestJson(
      {
        type: "post",
        url: sugon.interFaces.zxyp.jtsg.mid1_3,
        async: true,
        data: searchRuler
      },
      function(result) {
        if (result.type == "0") {
          $(".switch1-3").css("visibility", "hidden");
        } else {
          $(".switch1-3").css("visibility", "visible");
        }
        mid1_3Data = result.data;
        renderMid1_3();
      }
    );
  };

  // 处理中1-3面板数据
  var renderMid1_3 = function() {
    if (!searchRuler.mid1_3) {
      searchRuler.mid1_3 = 0;
    }
    var data = mid1_3Data[searchRuler.mid1_3];
    var xData = [],
      yData = [],
      startValue = 0,
      endValue = 100,
      isShow = false,
      markData = [],
      max = data[0].value;
    if (data.length > 4) {
      isShow = true;
      startValue = Math.floor((1 - 4 / data.length) * 100);
    }
    for (var i = 0; i < data.length; i++) {
      max = Math.max(max, data[i].value);
      var resultName = "",
        name = data[i].name;
      for (var j = 0; j < name.length; j++) {
        if (j % 4 != 3 || j == name.length - 1) {
          resultName += name[j];
        } else {
          resultName += name[j] + "\n";
        }
      }

      yData.push(resultName);
      xData.push(data[i].value);
      if (data[i].selected) {
        markData = [
          { name: data[i].name, value: data[i].value, xAxis: data[i].value },
          { name: data[i].name, value: data[i].value, xAxis: data[i].value }
        ];
      }
    }
    var option = {
      color: ["#269AE5"],
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow"
        }
      },
      grid: {
        top: 0,
        left: 0,
        right: 15,
        bottom: 15,
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
        min: 0,
        max: max,
        interval: parseInt(max / 4),
        boundaryGap: [0, 0.01]
      },
      yAxis: {
        type: "category",
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
    sugon.renderChart({ id: "mid1-3", data: yData, option });
  };

  // 初始化中2-1面板
  var initMid2_1 = function() {
    sugon.requestJson(
      {
        type: "post",
        url: sugon.interFaces.zxyp.jtsg.mid2_1,
        async: true,
        data: searchRuler
      },
      function(result) {
        var data = result.data,
          chart1_data = [],
          chart2_data = [];
        data.map(function(val, index) {
          if (index > 0) {
            val.map(function(v, i) {
              $(".color" + (index + 1))
                .eq(i)
                .html(Math.abs(v) + "%");
            });
          } else {
            $(".color1").html(val[0] + "%");
            chart1_data.push(val[1]);
            chart2_data.push(val[2]);
          }
        });
        var maxData = 100;
        var option = {
          xAxis: {
            max: maxData,
            splitLine: {
              show: false
            },
            offset: 10,
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisLabel: {
              show: false
            }
          },
          yAxis: {
            data: ["系统名称1"],
            inverse: true,
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisLabel: {
              show: false,
              margin: 10,
              textStyle: {
                fontSize: 16
              }
            }
          },
          grid: {
            top: "center",
            height: 0,
            left: 8,
            right: 75
          },
          series: [
            {
              // current data
              type: "pictorialBar",
              symbol: "rect",
              itemStyle: {
                normal: {
                  barBorderRadius: 5,
                  color: "#ED7D31"
                }
              },
              symbolRepeat: "fixed",
              symbolMargin: "70%",
              symbolClip: true,
              symbolSize: [4, 20],
              symbolBoundingData: maxData,
              data: [891],
              z: 9999,
              animationEasing: "elasticOut",
              animationDelay: function(dataIndex, params) {
                return params.index * 30;
              }
            },
            {
              // full data
              type: "pictorialBar",
              itemStyle: {
                normal: {
                  color: "rgba(179, 188, 208, 0.3)"
                }
              },
              label: {
                normal: {
                  show: true,
                  formatter: function(params) {
                    return params.value + "%";
                  },
                  position: "right",
                  offset: [5, 0],
                  textStyle: {
                    color: "#1d84c6",
                    fontSize: 18
                  }
                }
              },
              animationDuration: 0,
              symbolRepeat: "fixed",
              symbolMargin: "70%",
              symbol: "rect",
              symbolSize: [4, 20],
              symbolBoundingData: maxData,
              data: [891],
              z: 99999,
              animationEasing: "elasticOut",
              animationDelay: function(dataIndex, params) {
                return params.index * 30;
              }
            }
          ]
        };
        option.series.map(function(val) {
          val.data = chart1_data;
        });
        sugon.renderChart({ id: "mid2-1-1", data: chart1_data, option });
        option.series.map(function(val) {
          val.data = chart2_data;
        });
        sugon.renderChart({ id: "mid2-1-2", data: chart2_data, option });
      }
    );
  };

  // 初始化中2-2面板
  var initMid2_2 = function() {
    sugon.requestJson(
      {
        type: "post",
        url: sugon.interFaces.zxyp.jtsg.mid2_2,
        async: true,
        data: searchRuler
      },
      function(result) {
        var data = result.data;
        var total = 0;
        for (var i = 0; i < data.length; i++) {
          total += Number(data[i].value);
        }
        var option = {
          title: {
            text: total,
            subtext: searchRuler.mid2_2 ? "具体问题" : "环节问题",
            left: "center",
            top: "36%",
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
                      var name = "";
                      for (var i = 0; i < params.name.length; i++) {
                        if (i % 4 != 3 || i == params.name.length - 1) {
                          name += params.name[i];
                        } else {
                          name += params.name[i] + "\n";
                        }
                      }
                      return name + "\n" + percent;
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
        sugon.renderChart({ id: "mid2-2", data, cb, option });
        // 点击回调
        function cb(param) {
          if (param.data.id) {
            searchRuler.mid2_2 = param.data.id;
            searchRuler.mid2_3 = 0;
            initSwitchPanel($(".switch2-3 > div"));
            initMid2_2();
            initMid2_3();
            $(".mid2-2-img").css("visibility", "visible");
          }
        }
      }
    );
  };

  // 初始化中2-3面板
  var initMid2_3 = function() {
    sugon.requestJson(
      {
        type: "post",
        url: sugon.interFaces.zxyp.jtsg.mid2_3,
        async: true,
        data: searchRuler
      },
      function(result) {
        if (result.type == "0") {
          $(".switch2-3").css("visibility", "hidden");
        } else {
          $(".switch2-3").css("visibility", "visible");
        }
        mid2_3Data = result.data;
        renderMid2_3();
      }
    );
  };

  // 处理中2-3面板数据
  var renderMid2_3 = function() {
    if (!searchRuler.mid2_3) {
      searchRuler.mid2_3 = 0;
    }
    var data = mid2_3Data[searchRuler.mid2_3];
    var len = data.length;
    var yData = [];
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
      var obj = {
        name: data[i].name + "：" + data[i].value,
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
    var option = {
      calculable: true,
      tooltip: {
        trigger: "item",
        formatter: "{b}"
      },
      legend: {
        icon: "circle",
        x: "center",
        y: "0",
        data: yData,
        textStyle: {
          color: "#000"
        }
      },
      series: [
        {
          type: "pie",
          radius: ["40%", "100%"],
          avoidLabelOverlap: false,
          startAngle: 0,
          center: ["50%", "50%"],
          roseType: "area",
          label: {
            show: false,
            formatter: function(param) {
              return param.data.name + "\n" + param.data.value;
            }
          },
          labelLine: {
            show: false,
            length: -5,
            length2: 2
          },
          selectedMode: "single",
          data: yData
        }
      ]
    };
    sugon.renderChart({ id: "mid2-3", data, option });
  };

  // 初始化右1面板
  var initRight1 = function() {
    sugon.requestJson(
      {
        type: "post",
        url: sugon.interFaces.zxyp.jtsg.right1,
        async: true,
        data: searchRuler
      },
      function(result) {
        var data = result.data;
        data.map(function(val, index) {
          $(".right1 > div")
            .eq(index)
            .find("span")
            .html(index + 1 + "." + val[0]);
          var color, imgDiv;
          if (val[1] > 0) {
            color = "#dd3232";
            imgDiv = '<i class="glyphicon glyphicon-arrow-up"></i>';
          } else if (val[1] == 0) {
            color = "rgb(0, 138, 226)";
            imgDiv = '<i class="glyphicon glyphicon-minus"></i>';
          } else {
            color = "#05997e";
            imgDiv = '<i class="glyphicon glyphicon-arrow-down"></i>';
          }
          $(".right1 > div").css(
            "line-height",
            $(".right1 > div").height() + "px"
          );
          $(".right1 > div")
            .eq(index)
            .find("div")
            .css("color", color)
            .find("span")
            .html(imgDiv);
          $(".right1 > div")
            .eq(index)
            .find("div")
            .find("strong")
            .html(Math.abs(val[1]) + "%");
        });
      }
    );
  };

  // 初始化右2面板
  var initRight2 = function() {
    sugon.requestJson(
      {
        type: "post",
        url: sugon.interFaces.zxyp.jtsg.right2,
        async: true,
        data: searchRuler
      },
      function(result) {
        var data = result.data;
        $(".right-bottom").empty();
        data.map(function(val, index) {
          var color;
          if (index < 3) {
            color = "#18a80d";
          } else if (index < 6) {
            color = "#008ae2";
          } else {
            color = "#00aab5";
          }
          var $div = $("<div></div>");
          $div
            .append(
              $("<span></span>")
                .attr("title", val[0])
                .html(index + 1 + "." + val[0])
            )
            .append(
              $("<strong></strong>")
                .css("color", color)
                .html(val[1] + "%")
            );
          $(".right-bottom").append($div);
        });
      }
    );
  };

  // 初始化数据展示页
  var initDataPanel = function() {
    initLeft1();
    initLeft2();
    initMid1_1();
    initMid1_2();
    initMid1_3();
    initMid2_1();
    initMid2_2();
    initMid2_3();
    initRight1();
    initRight2();
  };

  // 初始化页面
  var initPage = async function() {
    // 初始化查询栏
    await sugon.initSearchBar({
      date1: -7,
      date2: -2,
      cb: function() {
        // 初始化所有子查询条件
        initCondition();
        // 初始化数据展示页
        initDataPanel();
      }
    });
    // 初始化所有子查询条件
    initCondition();
    // 初始化数据展示页
    initDataPanel();
  };

  // 页面入口
  $(function() {
    initPage();
  });

  // 左2-1select改变事件
  $("#left2-1").change(function() {
    searchRuler.left2_1 = $(this).val();
    initLeft2();
  });

  // 中1-2返回事件
  $(".mid1-2-img").click(function() {
    searchRuler.mid1_2 = "";
    initMid1_2();
    initMid1_3();
    $(".mid1-2-img").css("visibility", "hidden");
  });

  // 中1-3切换事件
  $(".switch1-3 > div").click(function() {
    var $this = $(this);
    var index = $this.index(".switch1-3 > div");
    if (!$this.hasClass("switch-selected")) {
      $(".switch1-3 > div").removeClass("switch-selected");
      $this.addClass("switch-selected");
      searchRuler.mid1_3 = index;
      renderMid1_3();
    }
  });

  // 中2-1点击事件
  $(".mid2-1 > div").click(function() {
    searchRuler.mid2_1 = $(this).index(".mid2-1 > div");
    searchRuler.mid2_2 = "";
    searchRuler.mid2_3 = 0;
    initSwitchPanel($(".switch2-3 > div"));
    initMid2_2();
    initMid2_3();
    $(".mid2-2-img").css("visibility", "hidden");
  });

  // 中2-2返回事件
  $(".mid2-2-img").click(function() {
    searchRuler.mid2_2 = "";
    initMid2_2();
    initMid2_3();
    $(".mid2-2-img").css("visibility", "hidden");
  });

  // 中2-3切换事件
  $(".switch2-3 > div").click(function() {
    var $this = $(this);
    var index = $this.index(".switch2-3 > div");
    if (!$this.hasClass("switch-selected")) {
      $(".switch2-3 > div").removeClass("switch-selected");
      $this.addClass("switch-selected");
      searchRuler.mid2_3 = index;
      renderMid2_3();
    }
  });

  // 右下切换事件
  $(".switch-panel2 > div").click(function() {
    var $this = $(this);
    var index = $this.index(".switch-panel2 > div");
    if (!$this.hasClass("switch-selected")) {
      $(".switch-panel2 > div").removeClass("switch-selected");
      $this.addClass("switch-selected");
      searchRuler.right2_1 = index;
      initRight2();
    }
  });

  // 右下2-2改变事件
  $("#right2-2").change(function() {
    searchRuler.right2_2 = $(this).val();
    initRight2();
  });

  // 右下2-3改变事件
  $("#right2-3").change(function() {
    searchRuler.right2_3 = $(this).val();
    initRight2();
  });
});
