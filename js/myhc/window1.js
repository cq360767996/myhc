/* Created by handsome qiu */
var myChart1, myChart2, myChart3;
requirejs(["common", "ec"], function(sugon, ec) {
  var params = $("#tempID")
    .val()
    .split("_");
  if (params[1] == "12345满意度") {
    $("#fj_sd").remove();
  }
  //$("#tempID").val() $('#placeCode').val() $("#date").val()
  $(".close_close").bind("click", function() {
    $(".window").css("visibility", "hidden");
  });

  var allData = [];
  sugon.requestJson(
    {
      type: "POST",
      url: sugon.interFaces.myhc.myjz.Window1,
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
      if (params[1] == "110接处警满意度") {
        $(".tool_tip1").css("display", "none");
        $(".tool_tip4").css("display", "none");
        $(".tool_tip3").css("display", "none");
      }
      allData = result;
      $("#chart_title").html(allData.title);
      $(".b>div")
        .eq(0)
        .html(allData.data1[0].name + "：" + allData.data1[0].value1 + "%");
      $(".b>div")
        .eq(1)
        .html(
          "同比：" +
            (allData.data1[0].value1 - allData.data1[1].value1).toFixed(2) +
            "%"
        );
      $(".b>div")
        .eq(2)
        .html(
          "环比：" +
            (allData.data1[0].value1 - allData.data1[2].value1).toFixed(2) +
            "%"
        );

      $(".g>div")
        .eq(0)
        .html(allData.data1[1].name + "：" + allData.data1[1].value1 + "%");

      $(".p>div")
        .eq(0)
        .html(allData.data1[2].name + "：" + allData.data1[2].value1 + "%");
    }
  );
  var yData = [];
  for (var i = 0; i < allData.data1.length; i++) {
    yData.push(allData.data1[i].value1);
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
  min = parseFloat(min) - (max - min) / 2;

  var initPolar = function() {
    myChart1 = ec.init(document.getElementById("left_chart"));

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
        color: "#2f5884",
        label: {
          show: true
        },
        labelLine: {
          show: false
        }
      },
      emphasis: {
        color: "#2f5884"
      }
    };

    var option = {};

    if (params[1] == "110接处警满意度") {
      var xData = [],
        yData = [];
      for (var i = 0; i < allData.data1.length; i++) {
        xData.push(allData.data1[i].name);
        yData.push(allData.data1[i].value1);
      }

      option = {
        title: {
          text: "110接处警满意度",
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
            min: min,
            max: max,
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
                  } /*,
                                        formatter: function(param) {
                                            var tempStr = "";
                                            var tempVal = sugon.getLabelVal(param.value + "");
                                            if(param.dataIndex > 2) {
                                                tempStr += "{center|"+ param.value +"}";
                                            }else {
                                                if(param.dataIndex == 0) {
                                                    tempStr += "{pic1|}";
                                                }else if (param.dataIndex == 1) {
                                                    tempStr += "{pic2|}";
                                                }else {
                                                    tempStr += "{pic3|}";
                                                }
                                                tempStr += "\n\n";
                                                tempStr += "{center|"+ tempVal +"}";
                                            }
                                            return tempStr;
                                        }*/
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
        tooltip: {
          trigger: "item",
          show: true,
          formatter: "{b} : {d}%",
          backgroundColor: "rgba(0,0,0,0.7)", // 背景
          padding: [8, 10], //内边距
          extraCssText: "box-shadow: 0 0 3px rgba(255, 255, 255, 0.4);" //添加阴影
        },
        series: [
          {
            name: "Line 1",
            type: "pie",
            clockWise: false,
            radius: ["67%", "75%"],
            center: ["35%", "55%"],
            itemStyle: dataStyle,
            hoverAnimation: false,
            startAngle: -90,
            label: {
              borderRadius: "10"
            },
            data: [
              {
                value: allData.data1[0].value1,
                name: allData.data1[0].name,
                itemStyle: {
                  normal: {
                    color: "#2ba5e8"
                  }
                }
              },
              {
                value: allData.data1[0].value2,
                name: "",
                tooltip: {
                  show: false
                },
                itemStyle: placeHolderStyle
              }
            ]
          },
          {
            name: "Line 2",
            type: "pie",
            clockWise: false,
            radius: ["51%", "59%"],
            center: ["35%", "55%"],
            itemStyle: dataStyle,
            hoverAnimation: false,
            startAngle: -90,
            data: [
              {
                value: allData.data1[1].value1,
                name: allData.data1[1].name,
                itemStyle: {
                  normal: {
                    color: "#40bcbc"
                  }
                }
              },
              {
                value: allData.data1[1].value2,
                name: "",
                tooltip: {
                  show: false
                },
                itemStyle: placeHolderStyle
              }
            ]
          },
          {
            name: "Line 3",
            type: "pie",
            clockWise: false,
            radius: ["35%", "43%"],
            center: ["35%", "55%"],
            itemStyle: dataStyle,
            hoverAnimation: false,
            startAngle: -90,
            data: [
              {
                value: allData.data1[2].value1,
                name: allData.data1[2].name,
                itemStyle: {
                  normal: {
                    color: "#8c6ccd",
                    label: {
                      show: true
                    }
                  }
                }
              },
              {
                value: allData.data1[2].value2,
                name: "",
                tooltip: {
                  show: false
                },
                itemStyle: placeHolderStyle
              }
            ]
          }
        ]
      };
    }

    myChart1.setOption(option);
  };

  var initLine = function(value) {
    var xData = [],
      yData = [];
    var len;
    if (value == "one-year") {
      len = allData.data2.length;
    } else {
      len = allData.data2.length - 6;
    }
    for (var i = 0; i < len; i++) {
      xData.push(allData.data2[i].name);
      yData.push(allData.data2[i].value);
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
        top: 70,
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
            var data = Array.from(allData.data2);
            data.reverse();
            if ($("#half-year").hasClass("selected")) {
              var position = data.length - 6 + param.dataIndex;
              if (data[position].red) {
                color = "red";
              }
            } else if ($("#one-year").hasClass("selected")) {
              console.log(data[param.dataIndex]);
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

  var initBar = function(index, txt) {
    var xData = [],
      yData = [];
    if (index != null) {
      for (var i = 0; i < allData.data3[index].length; i++) {
        xData.push(allData.data3[index][i].name.replace($("#place").val(), ""));
        yData.push(allData.data3[index][i].value);
      }
    }

    myChart3 = ec.init(document.getElementById("down_chart"));

    var titleTxt;
    var suffix;
    if (allData.dwType == "1") {
      suffix = "数值";
      titleTxt = params[1] + "所队情况";
      $(".second-switch").hide();
    } else if (allData.dwType == "0") {
      suffix = "数值";
      titleTxt = params[1] + "分局情况";
    } else if (allData.dwType == "2") {
      if (
        $("#tempTYPE").val() == "1" ||
        $("#tempTYPE").val() == "2" ||
        $("#tempTYPE").val() == "3"
      ) {
        suffix = "数值";
        titleTxt = "民意调查情况";
        $(".second-switch").hide();
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
        bottom: 55,
        top: 95,
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
                    tempStr += "{center|" + param.value + "}";
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

    if (txt) {
      option.title.text = txt;
    }

    myChart3.setOption(option);
  };

  $(".lkj").bind("click", function() {
    $(".lkj.selected").removeClass("selected");
    $(this).attr("class", "lkj selected");
    initBar($(".lkj").index(this));
  });

  var initChart = function() {
    initPolar();

    initLine();
    if (allData.data3.length > 0) {
      $(".lkj")
        .eq(0)
        .click();
      $(".secondPannel").css("display", "block");
      $(".window").css("height", "78%");
      $(".window").css("width", "60%");
      $("#left_chart").css("borderBottom", "2px solid #37618b");
      $("#right_chart").css("borderBottom", "2px solid #37618b");
      $(".tab_pannel").css("display", "block");
      if (allData.data3.length == 1) {
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

  $(".first-switch>div").click(function() {
    $(".first-switch>div.selected").removeClass("selected");
    $(this).addClass("selected");
    initLine($(this).attr("id"));
  });
});
