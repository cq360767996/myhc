/* Created by handsome qiu */
var myChart1, myChart2, myChart3;
requirejs(["common", "ec"], function(sugon, ec) {
  var params = $("#tempID")
    .val()
    .split("_");
  //$("#tempID").val() $('#placeCode').val() $("#date").val()
  $(".close_close").bind("click", function() {
    $(".window").css("visibility", "hidden");
  });
  $(".select_pannel").empty();
  // var Len;
  // if(params[1] == "案件办理评价指数"){
  //     Len = 4;
  // }else {
  //     Len = 6;
  // }
  //
  // for(var i=0;i<Len;i++){
  //     $(".select_pannel").append("<option value="+ i +">第"+ (i + 1) +"个</option>");
  // }

  var allData = [];
  sugon.requestJson(
    {
      type: "POST",
      url: sugon.interFaces.myjz.Window3,
      data: {
        type: $("#tempTYPE").val(),
        id: $("#tempID").val(),
        code: $("#placeCode").val(),
        date1: $("#date1").val(),
        date2: $("#date2").val()
      },
      async: false
    },
    function(result) {
      allData = result;
      $("#chart_title").html(allData.title);
      // 加载下拉框
      // $(".select_pannel").append("<option value='0'>"+ result.title +"</option>");
      for (var i = 0; i < result.data1.length; i++) {
        $(".select_pannel").append(
          "<option value=" + i + ">" + result.data1[i].name + "</option>"
        );
      }
    }
  );

  var initRador = function() {
    var indicatorData = [],
      seriesData = [];
    for (var i = 1; i < allData.data1.length; i++) {
      indicatorData.push({
        text: allData.data1[i].name,
        max: allData.data1[i].value1
      });
      seriesData.push(allData.data1[i].value1);
    }
    myChart1 = ec.init(document.getElementById("left_chart"));

    var option = {};

    if (params[1] == "窗口服务满意度") {
      var xData = [],
        yData = [];
      for (var i = 1; i < allData.data1.length; i++) {
        xData.push(allData.data1[i].name);
        yData.push(allData.data1[i].value1);
      }
      option = {
        title: {
          text: params[1],
          x: "center",
          textStyle: {
            fontWeight: "normal",
            fontSize: 18,
            color: "#a5b9d1"
          }
        },
        tooltip: {
          trigger: "axis"
        },
        angleAxis: {
          type: "category",
          data: xData,
          axisLabel: {
            color: "#a5b9d1",
            interval: 0,
            formatter: function(param, index) {
              var tempStr = "";
              if (param.length > 5) {
                for (var i = 0; i < param.length; i++) {
                  if (i % 6 == 5) {
                    tempStr += param[i] + "\n";
                  } else {
                    tempStr += param[i];
                  }
                }
              } else {
                tempStr = param;
              }
              var tempValue = " : " + yData[index] + "%";
              var str =
                "{color2|" + tempStr + "}" + "{color1|" + tempValue + "}";
              return str;
            },
            rich: {
              color1: {
                color: "#00d2ff"
              },
              color2: {
                fontSize: 12,
                color: "#72ACD1"
              }
            }
          },
          axisLine: {
            lineStyle: {
              color: "#a5b9d1"
            }
          },
          splitLine: {
            lineStyle: {
              color: "#a5b9d1"
            }
          },
          axisTick: {
            lineStyle: {
              color: "rgba(0, 0, 0, 0)"
            }
          }
        },
        radiusAxis: {
          axisLabel: {
            color: "#a5b9d1",
            interval: 0
          },
          axisLine: {
            lineStyle: {
              color: "rgba(0, 0, 0, 0)"
            }
          },
          splitLine: {
            lineStyle: {
              color: "rgba(0, 0, 0, 0)"
            }
          },
          axisTick: {
            lineStyle: {
              color: "rgba(0, 0, 0, 0)"
            }
          }
        },
        polar: {
          center: ["50%", "50%"],
          radius: "68%"
        },
        color: ["#2ba5e8"],
        series: [
          {
            type: "bar",
            data: yData,
            coordinateSystem: "polar",
            name: "满意度",
            label: {
              show: true
            }
          }
        ],
        legend: {
          show: false,
          data: ["满意度"]
        }
      };
    } else {
      if (allData.data1.length < 4) {
        var xData = [],
          yData = [];
        for (var i = 1; i < allData.data1.length; i++) {
          xData.push(allData.data1[i].name);
          yData.push(allData.data1[i].value1);
        }
        option = {
          title: {
            text: "案件办理评价指数分析",
            x: "center",
            textStyle: {
              fontWeight: "normal",
              fontSize: 18,
              color: "#a5b9d1"
            }
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow"
            }
          },
          grid: {
            top: 35,
            bottom: 15,
            left: 20,
            right: 20,
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
                  color: "#e6ecfa"
                }
              },
              axisLine: {
                lineStyle: {
                  color: "#426791"
                }
              }
            }
          ],
          yAxis: [
            {
              type: "value",
              axisTick: { show: false },
              splitLine: { show: false },
              splitArea: { show: false },
              splitNumber: 3,
              axisLabel: {
                show: false
              },
              axisLine: {
                show: false,
                lineStyle: {
                  color: "#aaa6b4"
                }
              }
            }
          ],
          series: [
            {
              name: "满意度",
              type: "bar",
              barWidth: 20,
              data: yData,
              itemStyle: {
                normal: {
                  borderWidth: 1,
                  borderColor: "rgba(18, 86, 108, 0.5)",
                  color: new ec.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: "#4292cd" },
                    { offset: 0.5, color: "#3376ad" },
                    { offset: 1, color: "#25548a" }
                  ]),
                  label: {
                    show: true,
                    position: "top",
                    textStyle: {
                      color: "white"
                    }
                  }
                }
              }
            }
          ]
        };
      } else {
        option = {
          title: {
            text: params[1],
            x: "center",
            textStyle: {
              fontWeight: "normal",
              fontSize: 18,
              color: "#a5b9d1"
            }
          },
          color: "rgba(52, 237, 255, 0.35)",
          radar: [
            {
              indicator: indicatorData,
              center: ["50%", "55%"],
              radius: "60%",
              startAngle: 90,
              splitNumber: 4,
              shape: "circle",
              name: {
                formatter: function(p1, p2) {
                  var str = "";
                  for (var i = 0; i < p1.length; i++) {
                    if (i % 4 == 3) {
                      str += p1[i] + "\n";
                    } else {
                      str += p1[i];
                    }
                  }
                  str = str + ": ";
                  var tempVal = p2.max + "%";
                  str = "{color2|" + str + "}" + "{color1|" + tempVal + "}";
                  return str;
                },
                rich: {
                  color1: {
                    color: "#00d2ff"
                  },
                  color2: {
                    fontSize: 12,
                    color: "#72ACD1"
                  }
                }
              },
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
      }
    }

    myChart1.setOption(option);
  };

  var initLine = function(index) {
    var xData = [],
      yData = [];
    var len;
    if ($(".select_pannel2").val() == "one-year") {
      len = allData.data2[index].length;
    } else {
      len = allData.data2[index].length - 6;
    }
    for (var i = 0; i < len; i++) {
      xData.push(allData.data2[index][i].name);
      yData.push(allData.data2[index][i].value);
    }

    var sortArray = yData;
    sortArray = sortArray.filter(function(s) {
      return s;
    });
    sortArray.sort(function(a, b) {
      return a - b;
    });
    var min = sortArray[0];
    var max = sortArray[sortArray.length - 1];

    myChart2 = ec.init(document.getElementById("right_chart"));

    var option = {
      title: {
        text: params[1] + "走势",
        x: "center",
        textStyle: {
          fontWeight: "normal",
          fontSize: 18,
          color: "#a5b9d1"
        }
      },
      color: "#3cb2fc",
      tooltip: {
        trigger: "axis"
      },
      grid: {
        top: 95,
        bottom: 35,
        left: 45,
        right: 20
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
              color: "#b3cce2"
            }
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: "#182744"
            }
          },
          data: xData.reverse()
        }
      ],
      yAxis: [
        {
          type: "value",
          splitNumber: 4,
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
              color: "#b3cce2"
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#426791"
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
          data: yData.reverse(),
          color: function(param) {
            var color = "#3cb2fc";
            var data = Array.from(allData.data2[index]);
            data.reverse();
            if ($(".select_pannel2").val() == "half_year") {
              var position = data.length - 6 + param.dataIndex;
              if (data[position].red) {
                color = "red";
              }
            } else if ($(".select_pannel2").val() == "one-year") {
              if (data[param.dataIndex].red) {
                color = "red";
              }
            }

            return color;
          }
        }
      ]
    };

    myChart2.setOption(option);
  };

  var initBar = function(index) {
    var xData = [],
      yData = [];
    for (var i = 0; i < allData.data3[index].length; i++) {
      xData.push(allData.data3[index][i].name.replace($("#place").val(), ""));
      yData.push(allData.data3[index][i].value);
    }

    myChart3 = ec.init(document.getElementById("down_chart"));

    var titleTxt;
    var suffix;
    if (allData.dwType == "1") {
      if ($("#tempTYPE").val() != "8") {
        $(".third-switch").hide();
      }
      if (
        $(".myd-gd")
          .eq(0)
          .hasClass("selected")
      ) {
        suffix = "数值";
        titleTxt = params[1] + "所队情况";
      } else {
        suffix = "不满意工单";
        titleTxt = "窗口服务不满意工单数排名情况";
      }
      $(".second-switch").hide();
    } else if (allData.dwType == "0") {
      suffix = "数值";
      titleTxt = params[1] + "分局情况";
      $(".third-switch").hide();
    } else if (allData.dwType == "2") {
      if (
        $("#tempTYPE").val() == "1" ||
        $("#tempTYPE").val() == "2" ||
        $("#tempTYPE").val() == "3"
      ) {
        suffix = "数值";
        titleTxt = "民意调查情况";
        $(".second-switch").hide();
        $(".third-switch").hide();
      } else if (
        $("#tempTYPE").val() == "4" ||
        $("#tempTYPE").val() == "6" ||
        $("#tempTYPE").val() == "7"
      ) {
        suffix = "不满意工单数量";
        titleTxt =
          params[1].replace("满意度", "").replace("评价指数", "") +
          "不满意工单排序情况";
        $(".second-switch").hide();
        $(".third-switch").hide();
      } else if ($("#tempTYPE").val() == "8") {
        suffix = "不满意工单数量";
        titleTxt =
          params[1].replace("满意度", "").replace("评价指数", "") +
          "不满意工单情况";
        $(".second-switch").hide();
        $(".third-switch").hide();
      }
    }

    var option = {
      title: {
        text: titleTxt,
        y: "10",
        x: "center",
        textStyle: {
          fontWeight: "normal",
          fontSize: 18,
          color: "#a5b9d1"
        }
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow"
        }
      },
      grid: {
        left: 45,
        right: 20,
        bottom: 25,
        top: 80,
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
            rotate: 35,
            textStyle: {
              color: "#e6ecfa"
            }
          },
          axisLine: {
            lineStyle: {
              color: "#426791"
            }
          }
        }
      ],
      yAxis: [
        {
          type: "value",
          axisTick: { show: false },
          splitLine: { show: false },
          splitArea: { show: false },
          splitNumber: 3,
          axisLabel: {
            show: false
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: "#aaa6b4"
            }
          }
        }
      ],
      series: [
        {
          name: suffix,
          type: "bar",
          barWidth: 20,
          data: yData,
          itemStyle: {
            normal: {
              borderWidth: 1,
              borderColor: "rgba(18, 86, 108, 0.5)",
              color: new ec.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#4292cd" },
                { offset: 0.5, color: "#3376ad" },
                { offset: 1, color: "#25548a" }
              ]),
              label: {
                show: true,
                position: "top",
                textStyle: {
                  color: "white"
                },
                formatter: function(param) {
                  var tempStr = "";
                  var tempVal = sugon.getLabelVal(param.value + "");
                  if (param.dataIndex > 2) {
                    tempStr += "{center|" + tempVal + "}";
                  } else {
                    if (suffix.indexOf("不满意") >= 0) {
                    } else {
                      if (param.dataIndex == 0) {
                        tempStr += "{pic1|}";
                      } else if (param.dataIndex == 1) {
                        tempStr += "{pic2|}";
                      } else {
                        tempStr += "{pic3|}";
                      }
                      tempStr += "\n\n";
                    }
                    tempStr += "{center|" + tempVal + "}";
                  }
                  return tempStr;
                },
                rich: {
                  pic1: {
                    width: 25,
                    height: 25,
                    backgroundColor: {
                      image: "../../img/myhc/top1.png"
                    }
                  },
                  pic2: {
                    width: 25,
                    height: 25,
                    backgroundColor: {
                      image: "../../img/myhc/top2.png"
                    }
                  },
                  pic3: {
                    width: 25,
                    height: 25,
                    backgroundColor: {
                      image: "../../img/myhc/top3.png"
                    }
                  },
                  color1: {
                    textAlign: "center",
                    color: "red"
                  },
                  color2: {
                    textAlign: "center",
                    color: "green"
                  },
                  color3: {
                    textAlign: "center",
                    color: "blue"
                  },
                  center: {
                    textAlign: "center",
                    color: "white"
                  }
                }
              }
            }
          }
        }
      ]
    };

    myChart3.setOption(option);
  };

  $(".lkj").bind("click", function() {
    $(".lkj.selected").removeClass("selected");
    $(this).attr("class", "lkj selected");
    initBar($(".lkj").index(this));
  });

  $(".myd-gd").bind("click", function() {
    $(".myd-gd.selected").removeClass("selected");
    $(this).attr("class", "myd-gd selected");
    initBar($(".myd-gd").index(this));
  });

  $(".select_pannel").change(function() {
    initLine($(".select_pannel").val());
  });

  var initChart = function() {
    initRador();

    initLine($(".select_pannel").val());

    if (allData.data3.length > 0) {
      $(".lkj")
        .eq(0)
        .click();
      $(".myd-gd")
        .eq(0)
        .click(); // 查询到数据点击一次满意度
      $(".secondPannel").css("display", "block");
      $(".window").css("height", "78%");
      $(".window").css("width", "60%");
      $("#left_chart").css("borderBottom", "2px solid #37618b");
      $("#right_chart").css("borderBottom", "2px solid #37618b");
      $(".tab_pannel").css("display", "block");
      if (allData.data3.length == 1 || allData.data3.length == 2) {
        $(".tab_pannel").css("display", "none");
      }
    } else {
      $(".secondPannel").css("display", "none");
      $(".window").css("height", "58%");
      $("#left_chart").css("border", "0px");
      $("#right_chart").css("border", "0px");
    }
  };

  initChart();

  $(".select_pannel2").change(function() {
    initLine($(".select_pannel").val());
  });
});
