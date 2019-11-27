requirejs(["common", "ec", "high3D"], function(sugon, ec, hc) {
  var maxDate = sugon.getDate(-1);
  // 树形结构数据
  let treeData = [];
  var minDate = sugon.getDate(-7);
  var searchRule = { code: "", date1: "", date2: "" };

  $("#left-tree").css("width", $("#place").css("width"));

  $("#place").bind("click", function() {
    $("#left-tree").css("visibility", "visible");
  });

  $("#date1")
    .datetimepicker({
      format: "yyyy-mm",
      autoclose: true,
      todayBtn: true,
      startView: "year",
      minView: "year",
      maxView: "decade",
      endDate: maxDate,
      language: "zh-CN"
    })
    .on("changeDate", function(e) {
      $("#left-tree").css("visibility", "hidden");
    });

  $("#date2")
    .datetimepicker({
      format: "yyyy-mm",
      autoclose: true,
      todayBtn: true,
      startView: "year",
      minView: "year",
      maxView: "decade",
      endDate: maxDate,
      language: "zh-CN"
    })
    .on("changeDate", function(e) {
      $("#left-tree").css("visibility", "hidden");
    });

  searchRule.date1 = minDate;
  searchRule.date2 = maxDate;
  $("#date1").val(minDate);
  $("#date2").val(maxDate);

  // 加载热点问题数据
  function initRdwtList() {
    let params = {
      deptId: $("#placeCode").val(),
      date1: $("#date1").val(),
      date2: $("#date2").val()
    };
    sugon
      .request(sugon.interFaces.myhc.rdwt.getMidData, params)
      .then(result => {
        let html = "";
        let $body = $(".rcGrid");
        result.data.map((val, index) => {
          html += `<div title="${val.content}">
                    ${index + 1}、${val.content}
                  </div>`;
        });
        $body.empty().append(html);
      });
  }

  async function onLoad() {
    await getTree();
    //渲染树
    $("#left-tree").treeview({
      data: treeData,
      levels: 1,
      onNodeSelected: function(event, node) {
        $("#place").val(node.text);
        $("#placeCode").val(node.id);
        $("#left-tree").css("visibility", "hidden");
      },
      showCheckbox: false //是否显示多选
    });
    $("#place").val(treeData[0].text);
    $("#placeCode").val((searchRule.code = treeData[0].id));
  }
  //获取树数据
  async function getTree() {
    let { deptId, role } = sugon.identityInfo;
    await sugon
      .request(sugon.interFaces.common.getDeptTree, { deptId, role })
      .then(result => {
        treeData = result.data;
      });
  }

  $("#back").bind("click", function() {
    location.hash = vipspa.stringify("dwjx", { type: "dwjx" });
  });

  //----------------------------------------------------------------------------------------------------------------------
  var navigorData = [];
  var chart3D, chart1, option1, chart2, chart3;
  var count = 0;
  var oldData = [];

  var getNavView = function(index) {
    //导航点击事件 1.修改导航栏数据 2.修改count 3.initChart()
    count = index;
    var tempData = [];
    for (var i = 0; i < index + 1; i++) {
      tempData.push(navigorData[i]);
    }
    var tempArray = [];
    for (var i = 0; i < index; i++) {
      tempArray.push(oldData[i]);
    }
    oldData = tempArray;
    navigorData = tempData;
    $("div.title")
      .eq(1)
      .html("队伍管理数量分析");
    initChart(navigorData);
    chart1.resize();
  };

  var getNavigor = function(array) {
    $(".navigor").empty();
    $(".navigor").append("<span>按：</span>");
    for (var i = 0; i < array.length; i++) {
      var tempStr = "&nbsp;/&nbsp;";
      if (i == array.length - 1) {
        tempStr = "";
      }
      $(".navigor").append(
        "<span class='nav' id=" +
          array[i].id +
          " >" +
          array[i].name +
          tempStr +
          "</span>"
      );
    }
    $(".navigor").append("<span>&nbsp;&nbsp;分析</span>");

    $(".nav")
      .unbind()
      .bind("click", function() {
        getNavView($(".nav").index(this));
      });
  };

  var initPie3D = function() {
    chart1.resize();
    $(".emp").empty();

    for (var i = 0; i < oldData.length; i++) {
      var tempData = [],
        colorArray = [];
      if (!navigorData[i + 1]) {
        return;
      }
      var chooseStr = navigorData[i + 1].name;
      var choose = chooseStr + "：" + navigorData[i + 1].value;
      for (var k = 0; k < oldData[i].length; k++) {
        tempData.push({
          name: oldData[i][k].name,
          y: parseFloat(oldData[i][k].value)
        });
        if (oldData[i][k].name == chooseStr) {
          colorArray.push("#1d84c6");
        } else {
          colorArray.push("#b9cada");
        }
      }
      $("#title_" + (i + 1)).html(choose);
      $("div.title")
        .eq(1)
        .html(chooseStr + "数量分析");
      var ele = "pie_3D" + (i + 1);

      chart3D = Highcharts.chart(ele, {
        chart: {
          type: "pie",
          backgroundColor: "rgba(0, 0, 0, 0)",
          options3d: {
            enabled: true,
            alpha: 75,
            beta: 0
          }
        },
        title: {
          text: ""
        },
        credits: {
          enabled: false
        },
        exporting: {
          enabled: false
        },
        colors: colorArray,
        tooltip: {
          enabled: false,
          pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>"
        },
        plotOptions: {
          pie: {
            size: "90%",
            innerSize: "50%",
            allowPointSelect: true,
            cursor: "pointer",
            depth: 20,
            dataLabels: {
              enabled: false,
              style: { fontSize: "12px" },
              html: "111"
            }
          }
        },
        series: [
          {
            type: "pie",
            name: "浏览器占比",
            data: tempData
          }
        ]
      });
    }
  };

  var initTopChart = function(result) {
    getNavigor(navigorData);

    var scaleData = result;

    chart1 = ec.init(document.getElementById("topChart"));

    chart1.off();
    chart1.on("click", function(params) {
      initChart({
        name: params.data.name,
        id: params.data.id,
        value: params.data.value
      });
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

    option1 = {
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
          radius: ["38%", "53%"],
          hoverAnimation: false,
          itemStyle: {
            normal: {
              label: {
                show: true,
                fontSize: 16,
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

    chart1.setOption(option1);

    $("#pie_label").html(navigorData[navigorData.length - 1].name);
  };

  var initContent1 = function(data) {
    for (var i = 0; i < data.length; i++) {
      $(".lab")
        .eq(i)
        .html(data[i].name);
      $(".val")
        .eq(i)
        .html(data[i].value2);
      $(".progress_val")
        .eq(i)
        .css("width", data[i].value1 + "%");
    }
  };

  var initContent2 = function(data) {
    $("#chart2").empty();
    $("#chart2").append("<div id='chart2_2'></div>");

    var indicatorData = [],
      seriesData1 = [],
      seriesData2 = [],
      xData = [],
      yData = [],
      sum1 = 0,
      sum2 = 0;
    for (var i = 0; i < data.length; i++) {
      sum1 += Number(data[i].value1);
      sum2 += Number(data[i].value2);
    }
    for (var i = 0; i < data.length; i++) {
      var value1Percent = parseInt((100 * data[i].value1) / sum1);
      var value2Percent = parseInt((100 * data[i].value2) / sum2);
      indicatorData.push({
        text:
          data[i].name +
          "\n本期" +
          value1Percent +
          "%\n上期" +
          value2Percent +
          "%",
        max: 100
      });
      xData.push(data[i].name);
      yData.push(data[i].value1);
      seriesData1.push(data[i].value1);
      seriesData2.push(data[i].value2);
    }
    chart2 = ec.init(document.getElementById("chart2_2"));

    var option = {};

    if (count != 0) {
      option = {
        color: "#3cb2fc",
        tooltip: {
          trigger: "axis"
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 65
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
            data: xData
          }
        ],
        yAxis: [
          {
            type: "value",
            splitNumber: 4,
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
            data: yData
          }
        ]
      };
    } else {
      option = {
        color: ["rgba(52, 237, 255, 0.35)", "rgba(111, 112, 214, 0.35)"],
        radar: [
          {
            indicator: indicatorData,
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
                value: seriesData1,
                name: "图一",
                symbol: "rect",
                symbolSize: 5,
                lineStyle: {
                  normal: {
                    type: "dashed"
                  }
                }
              },
              {
                value: seriesData2,
                name: "图二",
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

    chart2.setOption(option);
    count++;
  };

  var initContent3 = function(data) {
    $("#chart3").empty();
    for (var i = 0; i < data.length; i++) {
      var path = "../../img/myhc/dwjx/" + data[i].icon + ".png";
      $("#chart3").append(
        "<div>" +
          "<div class='pic'><img src=" +
          path +
          "></div>" +
          "<div class='name'>" +
          data[i].name +
          "</div>" +
          "<div class='value'>" +
          data[i].value +
          "条</div>" +
          "</div>"
      );
    }
  };

  var getBar = function(data) {
    var xData = [],
      yData = [],
      startValue = 0,
      endValue = 100,
      markData = [];
    if (data.length > 4) {
      endValue = Math.floor((4 / data.length) * 100);
    }
    for (var i = 0; i < data.length; i++) {
      xData.push(data[i].name);
      yData.push(data[i].value);
      if (data[i].select) {
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

    chart3 = ec.init(document.getElementById("chart4"));

    var option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow"
        }
      },
      grid: {
        left: 10,
        right: 10,
        bottom: 30,
        top: 65,
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
          type: "slider",
          start: startValue,
          end: endValue,
          height: 15,
          bottom: 15,
          handelSize: 0,
          zoomLock: true,
          textStyle: false /*,
                backgroundColor: "",
                dataBackgroundColor: "",
                fillerColor: "",
                handleColor: ""*/
        }
      ],
      xAxis: [
        {
          type: "category",
          axisTick: { show: false },
          splitArea: { show: false },
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
          },
          axisLine: {
            lineStyle: {
              color: "#6c7177"
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
            show: true,
            textStyle: {
              color: "#6c7177"
            }
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: "#6c7177"
            }
          }
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
              borderWidth: 1,
              borderColor: "rgba(18, 86, 108, 0.5)",
              color: new ec.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#4292cd" },
                { offset: 0.5, color: "#3376ad" },
                { offset: 1, color: "#25548a" }
              ]),
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

    chart3.setOption(option);
  };

  var initContent4 = function(data) {
    if (data.length == 1) {
      $(".bar_tab").css("display", "none");
      getBar(data[0]);
    } else {
      $(".bar_tab>div")
        .unbind()
        .bind("click", function() {
          $(".bar_tab .selected").removeClass("selected");
          $(this).attr("class", "selected");
          var barIndex = $(".bar_tab>div").index(this);
          getBar(data[barIndex]);
        });
      $(".bar_tab>div")
        .eq(0)
        .click();
    }
  };

  var initOtherCharts = function() {
    sugon.requestJson(
      {
        type: "POST",
        url: sugon.interFaces.myhc.dwjx.OtherCharts,
        data: {
          type: "dwjs",
          nav: JSON.stringify(navigorData),
          timestamp: timestamp,
          position: 1,
          code: searchRule.code,
          date1: searchRule.date1,
          date2: searchRule.date2
        },
        async: true
      },
      function(result) {
        if (result.timestamp == timestamp || sugon.isPublished === false) {
          initContent1(result.data1);
        }
      }
    );
    sugon.requestJson(
      {
        type: "POST",
        url: sugon.interFaces.myhc.dwjx.OtherCharts,
        data: {
          type: "dwjs",
          nav: JSON.stringify(navigorData),
          timestamp: timestamp,
          position: 2,
          code: searchRule.code,
          date1: searchRule.date1,
          date2: searchRule.date2
        },
        async: true
      },
      function(result) {
        if (result.timestamp == timestamp || sugon.isPublished === false) {
          initContent2(result.data2);
        }
      }
    );
    sugon.requestJson(
      {
        type: "POST",
        url: sugon.interFaces.myhc.dwjx.OtherCharts,
        data: {
          type: "dwjs",
          nav: JSON.stringify(navigorData),
          timestamp: timestamp,
          position: 3,
          code: searchRule.code,
          date1: searchRule.date1,
          date2: searchRule.date2
        },
        async: true
      },
      function(result) {
        if (result.timestamp == timestamp || sugon.isPublished === false) {
          initContent3(result.data3);
        }
      }
    );
    sugon.requestJson(
      {
        type: "POST",
        url: sugon.interFaces.myhc.dwjx.OtherCharts,
        data: {
          type: "dwjs",
          nav: JSON.stringify(navigorData),
          timestamp: timestamp,
          position: 4,
          code: searchRule.code,
          date1: searchRule.date1,
          date2: searchRule.date2
        },
        async: true
      },
      function(result) {
        if (result.timestamp == timestamp || sugon.isPublished === false) {
          initContent4(result.data4);
        }
      }
    );
  };
  var timestamp;
  var initChart = function(obj) {
    timestamp = new Date().getTime();
    if (obj.length) {
      navigorData = obj;
    } else {
      navigorData.push(obj);
    }
    sugon.requestJson(
      {
        type: "POST",
        url: sugon.interFaces.myhc.dwjx.TopChart,
        data: {
          type: "dwjs",
          nav: JSON.stringify(navigorData),
          timestamp: timestamp,
          code: searchRule.code,
          date1: searchRule.date1,
          date2: searchRule.date2
        },
        async: true
      },
      function(result) {
        if (result.data.length == 0) {
          navigorData.pop();
          return;
        }
        if (count != 0) {
          $("#dyn_group").css("height", "calc(50% - 50px)");
          $("#dyn_group2").css("display", "block");
        } else {
          $("#dyn_group").css("height", "calc(100% - 50px)");
          $("#dyn_group2").css("display", "none");
        }
        if (result.timestamp == timestamp || sugon.isPublished === false) {
          initTopChart(result.data);
          chart1.resize();
        }
        oldData.push(result.data);
        if (count != 0) {
          initPie3D();
        } else {
          $(".emp").empty();
        }
        initOtherCharts();
      }
    );
  };

  $("#check").bind("click", function() {
    count = 0;
    navigorData = [];
    searchRule.code = $("#placeCode").val();
    searchRule.date1 = $("#date1").val();
    searchRule.date2 = $("#date2").val();
    $("div.title")
      .eq(1)
      .html("队伍管理数量分析");
    initChart({ name: "队伍管理", id: "dwjs" });
    initRdwtList();
  });

  async function initPage() {
    await onLoad();
    $("#check").click();
    let { code, date1, date2 } = searchRule;
    sugon.initRightMenu({ deptId: code, date1, date2 });
  }
  // 入口
  initPage();

  $(window).resize(function() {
    chart1.resize();
    chart2.resize();
    chart3.resize();
    chart3D.setSize(
      document.getElementById("pie_3D").style.width,
      document.getElementById("pie_3D").style.height,
      false
    );
  });
});
