define(["common", "ec"], function(sugon, ec) {
  var initBar1 = function(data) {
    var xData = [],
      yData = [];
    for (var i = 0; i < data.length; i++) {
      xData.push(data[i].name);
      yData.push(data[i].value);
    }

    Chart1 = ec.init(document.getElementById("bar11"));

    var option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow"
        }
      },
      grid: {
        left: 45,
        right: 20,
        bottom: 15,
        top: 65,
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
              color: "#5f707a"
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
          name: "数值",
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
                  color: "#5f707a"
                }
              }
            }
          }
        }
      ]
    };

    Chart1.setOption(option);
  };

  var initLine2 = function(data) {
    var xData = [],
      yData = [];
    var len;
    if ($(".yearMomth1.selected").attr("id") == "one-year") {
      len = data.length;
    } else {
      len = data.length - 6;
    }
    for (var i = 0; i < len; i++) {
      xData.push(data[i].name);
      yData.push(data[i].value);
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

    Chart2 = ec.init(document.getElementById("line22"));

    var option = {
      color: "#3cb2fc",
      tooltip: {
        trigger: "axis"
      },
      grid: {
        top: 60,
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
              color: "#5f707a"
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
              color: "#5f707a"
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
          name: "数量",
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
            var cdata = Array.from(data);
            cdata.reverse();
            if ($("#half-year").hasClass("selected")) {
              var position = cdata.length - 6 + param.dataIndex;
              if (cdata[position].red) {
                color = "red";
              }
            } else if ($("#one-year").hasClass("selected")) {
              if (cdata[param.dataIndex].red) {
                color = "red";
              }
            }
            return color;
          }
        }
      ]
    };

    Chart2.setOption(option);
  };

  var initBar2 = function(data) {
    var xData = [],
      yData = [];
    for (var i = 0; i < data.length; i++) {
      xData.push(data[i].name);
      yData.push(data[i].value);
    }

    Chart3 = ec.init(document.getElementById("bar22"));

    var option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow"
        }
      },
      grid: {
        left: 45,
        right: 20,
        bottom: 15,
        top: 65,
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
              color: "#5f707a"
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
          name: "数值",
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
                  color: "#5f707a"
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

    $("#myd11").html(data.myd1 + "%");
    var tb1Img =
        parseFloat(data.tb1) > 0
          ? "../../img/myhc/increase.png"
          : parseFloat(data.tb1) == 0
          ? "../../img/myhc/hold.png"
          : "../../img/myhc/decrease.png",
      hb1Img =
        parseFloat(data.hb1) > 0
          ? "../../img/myhc/increase.png"
          : parseFloat(data.hb1) == 0
          ? "../../img/myhc/hold.png"
          : "../../img/myhc/decrease.png";
    $("#tb11").html(data.tb1 + "%");
    $("#hb11").html(data.hb1 + "%");
    $("#tb1Img").attr("src", tb1Img);
    $("#hb1Img").attr("src", hb1Img);

    $(".select_pannel3").empty();
    for (var i = 0; i < data.data11.length; i++) {
      $(".select_pannel3").append(
        "<option value='" + i + "'>" + data.data11[i].name + "</option>"
      );
    }

    $(".yearMomth1")
      .unbind()
      .bind("click", function() {
        $(".yearMomth1.selected").removeClass("selected");
        $(this).attr("class", "yearMomth1 selected");
        initLine2(data.data5[$(".select_pannel3").val()]);
      });

    $(".select_pannel3").change(function() {
      initLine2(data.data5[$(".select_pannel3").val()]);
    });
    initLine2(data.data5[$(".select_pannel3").val()]);

    initBar1(data.data4);

    initBar2(data.data6);
  };

  return getList;
});
