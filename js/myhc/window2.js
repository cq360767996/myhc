/* Created by handsome qiu */
var myChart1, myChart2, myChart3, myChart4;
requirejs(["common", "ec"], function(sugon, ec) {
  var params = $("#tempID")
    .val()
    .split("_");
  //$("#tempID").val() $('#placeCode').val() $("#date").val()
  $(".close_close").bind("click", function() {
    $(".window").css("visibility", "hidden");
  });

  var allData = [];
  sugon.requestJson(
    {
      type: "POST",
      url: sugon.interFaces.myjz.Window2,
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
      var title = allData.title;
      $("#chart_title").html(title);
      $(".tempTitle").html(params[1]);
      // 加载下拉框
      $(".select_pannel").empty();
      $(".select_pannel").append(
        "<option value='0'>" +
          allData.title.substring(6, title.length) +
          "</option>"
      );
      $(".select_pannel").append(
        "<option value='1'>" + allData.data1[0].name + "</option>"
      );
      $(".select_pannel").append(
        "<option value='2'>" + allData.data2[0].name + "</option>"
      );
      // for(var i = 0; i < allData.data1.length; i++) {
      //     $(".select_pannel").append("<option value='" + (i + 1) + "'>"+ allData.data1[i].name +"</option>");
      // }
      if (allData.data1[0].value2.indexOf("+") >= 0) {
        $("#tb1").attr("class", "g");
      } else {
        $("#tb1").attr("class", "r");
      }
      if (allData.data1[0].value3.indexOf("+") >= 0) {
        $("#hb1").attr("class", "g");
      } else {
        $("#hb1").attr("class", "r");
      }
      if (allData.data2[0].value2.indexOf("+") >= 0) {
        $("#tb2").attr("class", "g");
      } else {
        $("#tb2").attr("class", "r");
      }
      if (allData.data2[0].value3.indexOf("+") >= 0) {
        $("#hb2").attr("class", "g");
      } else {
        $("#hb2").attr("class", "r");
      }
      $("#tb1").html(allData.data1[0].value2);
      $("#hb1").html(allData.data1[0].value3);
      $("#tb2").html(allData.data2[0].value2);
      $("#hb2").html(allData.data2[0].value3);
    }
  );

  var initPie = function() {
    var pieData1 = [],
      pieData2 = [];
    for (var i = 0; i < allData.data1.length; i++) {
      pieData1.push({
        name: allData.data1[i].name,
        value: allData.data1[i].value1
      });
    }
    for (var i = 0; i < allData.data2.length; i++) {
      pieData2.push({
        name: allData.data2[i].name,
        value: allData.data2[i].value1
      });
    }
    myChart1 = ec.init(document.getElementById("pie1"));

    var option1 = {
      color: ["#32a3e9", "#466991"],
      series: [
        {
          name: "访问来源",
          type: "pie",
          radius: ["60%", "80%"],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: true,
              position: "center",
              formatter: function(e) {
                var str = "";
                if (e.name == "简易事故处理评价指数") {
                  str = e.name.replace("评价指数", "") + "\n\n" + e.value + "%";
                }
                return str;
              }
            },
            emphasis: {
              show: false,
              textStyle: {
                fontSize: "30",
                fontWeight: "bold"
              }
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: pieData1
        }
      ]
    };

    myChart1.setOption(option1);

    myChart2 = ec.init(document.getElementById("pie2"));

    var option2 = {
      color: ["#32a3e9", "#466991"],
      series: [
        {
          name: "访问来源",
          type: "pie",
          radius: ["60%", "80%"],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: true,
              position: "center",
              formatter: function(e) {
                var str = "";
                if (e.name == "一般事故处理评价指数") {
                  str = e.name.replace("评价指数", "") + "\n\n" + e.value + "%";
                }
                return str;
              }
            },
            emphasis: {
              show: false,
              textStyle: {
                fontSize: "30",
                fontWeight: "bold"
              }
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: pieData2
        }
      ]
    };

    myChart2.setOption(option2);
  };

  var initLine = function(index) {
    var xData = [],
      yData = [];
    var len;
    if ($(".select_pannel2").val() == "one-year") {
      len = allData.data3[index].length;
    } else {
      len = allData.data3[index].length - 6;
    }
    for (var i = 0; i < len; i++) {
      xData.push(allData.data3[index][i].name);
      yData.push(allData.data3[index][i].value);
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

    myChart3 = ec.init(document.getElementById("right_chart"));
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
            var data = Array.from(allData.data3[index]);
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

    myChart3.setOption(option);
  };

  var initBar = function(index) {
    var xData = [],
      yData = [];
    for (var i = 0; i < allData.data4[index].length; i++) {
      xData.push(allData.data4[index][i].name.replace($("#place").val(), ""));
      yData.push(allData.data4[index][i].value);
    }

    myChart4 = ec.init(document.getElementById("down_chart"));

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
        x: "270",
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

    myChart4.setOption(option);
  };

  $(".lkj").bind("click", function() {
    $(".lkj.selected").removeClass("selected");
    $(this).attr("class", "lkj selected");
    initBar($(".lkj").index(this));
  });

  $(".select_pannel").change(function() {
    initLine($(".select_pannel").val());
  });

  var initChart = function() {
    initPie();

    initLine($(".select_pannel").val());

    if (allData.data4.length > 0) {
      $(".lkj")
        .eq(0)
        .click();
      $(".secondPannel").css("display", "block");
      $(".window").css("height", "78%");
      $(".window").css("width", "60%");
      $("#left_chart").css("borderBottom", "2px solid #37618b");
      $("#right_chart").css("borderBottom", "2px solid #37618b");
      $(".tab_pannel").css("display", "block");
      if (allData.data4.length == 1) {
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
