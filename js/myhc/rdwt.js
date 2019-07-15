var rdwtChart, sqxzChart, jtwtChart, dwfxChart, dwfxHiddenChart;
requirejs(["common", "ec"], function(sugon, ec) {
  // 全局查询条件
  var searchRuler = {};

  // 初始化查询栏
  var initSearchBar = function() {
    var lastMonth = getDate(-1);
    var date = sugon.getParam("date");
    var deptName = sugon.getParam("deptName");
    var deptId = sugon.getParam("deptId");
    if (date || deptName || deptId) {
      $("#place").val(deptName);
      $("#placeCode").val(deptId);
      $("#date-input").val(date);
      searchRuler.deptId = deptId;
      searchRuler.date = date;
      searchRuler.deptName = deptName;
    } else {
      searchRuler.deptId = "2014110416460086100000002942";
      searchRuler.date = getDate(-7);
      searchRuler.deptName = "南京市公安局";
      $("#place").val("南京市公安局");
      $("#placeCode").val("2014110416460086100000002942");
      $("#date-input").val(lastMonth);
    }

    $("#date-input").datetimepicker({
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

  //获取树数据
  function getTree() {
    var treeData = [];
    sugon.requestJson(
      {
        type: "POST",
        url: sugon.interFaces.rdwt.Tree
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

  // 创建左侧列表的元素
  var getLiDom = function(index, data) {
    var result;
    if (index == 1) {
      result = $("<div/>")
        .addClass("left-panel-li")
        .addClass("left-panel-li-hover")
        .attr("id", data.id)
        .attr("mold", data.mold)
        .append(
          $("<div/>")
            .addClass("left-panel-li-header")
            .html(index)
        )
        .append(
          $("<div/>")
            .addClass("left-panel-li-body")
            .html(data.content)
        );
    } else {
      result = $("<div/>")
        .addClass("left-panel-li")
        .attr("id", data.id)
        .attr("mold", data.mold)
        .append(
          $("<div/>")
            .addClass("left-panel-li-header")
            .html(index)
        )
        .append(
          $("<div/>")
            .addClass("left-panel-li-body")
            .html(data.content)
        );
    }
    return result;
  };

  // 监听左侧点击事件
  $(".left-panel-ul").on("click", ".left-panel-li", function() {
    // 判断是否为选中状态
    // if(!$(this).hasClass('left-panel-li-hover')) {
    var questionId = $(this).attr("id");
    var mold = $(this).attr("mold");
    // 移除hover样式
    $(".left-panel-li").removeClass("left-panel-li-hover");
    // 添加hover样式
    $(this).addClass("left-panel-li-hover");
    searchRuler.questionId = questionId;
    searchRuler.mold = mold;
    loadRightData(questionId, mold, searchRuler.deptId, searchRuler.date);
    // }
  });

  // 获取分页组件
  var getPagination = function(currentPage, totalPage) {
    currentPage = Number(currentPage);
    var $ul = $(".pagination");
    $ul.empty();
    var first = $("<li/>")
      .addClass("first-page")
      .append(
        $("<a/>")
          .attr("href", "javascript:void(0);")
          .html("&laquo;")
      );
    var last = $("<li/>")
      .addClass("last-page")
      .append(
        $("<a/>")
          .attr("href", "javascript:void(0);")
          .html("&raquo;")
      );
    $ul.append(first);
    if (totalPage < 6) {
      for (var i = 0; i < totalPage; i++) {
        if (currentPage == i) {
          $ul.append(
            $("<li/>")
              .addClass("active")
              .append(
                $("<a/>")
                  .attr("href", "javascript:void(0);")
                  .html(i + 1)
              )
          );
        } else {
          $ul.append(
            $("<li/>").append(
              $("<a/>")
                .attr("href", "javascript:void(0);")
                .html(i + 1)
            )
          );
        }
      }
    } else {
      switch (currentPage) {
        case 1:
          $ul
            .append(
              $("<li/>")
                .addClass("active")
                .append(
                  $("<a/>")
                    .attr("href", "javascript:void(0);")
                    .html(currentPage)
                )
            )
            .append(
              $("<li/>").append(
                $("<a/>")
                  .attr("href", "javascript:void(0);")
                  .html(currentPage + 1)
              )
            )
            .append(
              $("<li/>").append(
                $("<a/>")
                  .attr("href", "javascript:void(0);")
                  .html(currentPage + 2)
              )
            );
          break;
        case 2:
          $ul
            .append(
              $("<li/>").append(
                $("<a/>")
                  .attr("href", "javascript:void(0);")
                  .html(currentPage - 1)
              )
            )
            .append(
              $("<li/>")
                .addClass("active")
                .append(
                  $("<a/>")
                    .attr("href", "javascript:void(0);")
                    .html(currentPage)
                )
            )
            .append(
              $("<li/>").append(
                $("<a/>")
                  .attr("href", "javascript:void(0);")
                  .html(currentPage + 1)
              )
            )
            .append(
              $("<li/>").append(
                $("<a/>")
                  .attr("href", "javascript:void(0);")
                  .html(currentPage + 2)
              )
            );
          break;
        case totalPage - 1:
          $ul
            .append(
              $("<li/>").append(
                $("<a/>")
                  .attr("href", "javascript:void(0);")
                  .html(currentPage - 2)
              )
            )
            .append(
              $("<li/>").append(
                $("<a/>")
                  .attr("href", "javascript:void(0);")
                  .html(currentPage - 1)
              )
            )
            .append(
              $("<li/>")
                .addClass("active")
                .append(
                  $("<a/>")
                    .attr("href", "javascript:void(0);")
                    .html(currentPage)
                )
            )
            .append(
              $("<li/>").append(
                $("<a/>")
                  .attr("href", "javascript:void(0);")
                  .html(currentPage + 1)
              )
            );
          break;
        case totalPage:
          $ul
            .append(
              $("<li/>").append(
                $("<a/>")
                  .attr("href", "javascript:void(0);")
                  .html(currentPage - 2)
              )
            )
            .append(
              $("<li/>").append(
                $("<a/>")
                  .attr("href", "javascript:void(0);")
                  .html(currentPage - 1)
              )
            )
            .append(
              $("<li/>")
                .addClass("active")
                .append(
                  $("<a/>")
                    .attr("href", "javascript:void(0);")
                    .html(currentPage)
                )
            );
          break;
        default:
          $ul
            .append(
              $("<li/>").append(
                $("<a/>")
                  .attr("href", "javascript:void(0);")
                  .html(currentPage - 2)
              )
            )
            .append(
              $("<li/>").append(
                $("<a/>")
                  .attr("href", "javascript:void(0);")
                  .html(currentPage - 1)
              )
            )
            .append(
              $("<li/>")
                .addClass("active")
                .append(
                  $("<a/>")
                    .attr("href", "javascript:void(0);")
                    .html(currentPage)
                )
            )
            .append(
              $("<li/>").append(
                $("<a/>")
                  .attr("href", "javascript:void(0);")
                  .html(currentPage + 1)
              )
            )
            .append(
              $("<li/>").append(
                $("<a/>")
                  .attr("href", "javascript:void(0);")
                  .html(currentPage + 2)
              )
            );
          break;
      }
    }
    $ul.append(last);
    // 绑定点击分页栏的点击事件
    $(".pagination>li")
      .unbind()
      .bind("click", function() {
        var targetStr = $(this)
          .find("a")
          .html();
        var liClass = $(this).attr("class");
        var pageNum;
        switch (liClass) {
          case "first-page":
            pageNum = 1;
            break;
          case "last-page":
            pageNum = totalPage;
            break;
          case "active":
            break;
          default:
            pageNum = targetStr;
            break;
        }
        // 加载当前页数据
        loadLeftData(pageNum);
      });
  };

  // 初始化热点问题
  var initRdwt = function(data) {
    var xData = [],
      yData = [];
    for (var i = 0; i < data.length; i++) {
      if (i < 2) {
        xData.push("2018" + (11 + i));
      } else {
        xData.push("20190" + (i - 1));
      }
      // xData.push(data[i].name);
      yData.push(data[i].value);
    }
    rdwtChart = ec.init(document.getElementById("rdwt-chart"));
    var option = {
      color: "#3cb2fc",
      tooltip: {
        trigger: "axis"
      },
      grid: {
        left: 40,
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
              color: "#000"
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
              color: "#000"
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
    rdwtChart.setOption(option);
  };

  // 初始化诉求性质
  var initSqxz = function(data) {
    // xData:x轴数据；yData:y轴数据；yPercentData:y轴百分比数据；calcData:计算弧度结果的数据
    var xData = [],
      yData = [],
      yPercentData = [],
      calcData = [];
    // 起始位置
    var sum = 0;
    for (var i = 0; i < data.length; i++) {
      xData.push(data[i].name);
      yData.push(data[i].value);
      sum += Number(data[i].value);
    }
    for (var i = 0; i < yData.length; i++) {
      yPercentData.push(yData[i] / sum);
    }
    var start = 0;
    for (var i = 0; i < yPercentData.length; i++) {
      var arr = [],
        obj = {};
      arr[2] = start;
      if (i == yPercentData.length - 1) {
        arr[0] = 0;
        arr[1] = 360 - arr[2];
      } else {
        arr[1] = parseInt(yPercentData[i] * 360);
        arr[0] = 360 - arr[1] - start;
      }
      start += arr[1];
      obj.name = xData[i];
      obj.value = arr;
      calcData.push(obj);
    }
    sqxzChart = ec.init(document.getElementById("sqxz-chart"));
    var dataStyle = {
      normal: {
        label: {
          show: true,
          fontSize: 12
        },
        labelLine: {
          length: 23,
          length2: 23
        }
      }
    };

    var labelShow = {
      show: true,
      color: "#2079D3",
      fontSize: 12,
      formatter: ["{b| {b} }", "{d| {d}% }"].join("\n"),
      rich: {
        d: {
          fontSize: 12
        },
        b: {
          fontSize: 14
        }
      }
    };

    var placeHolderStyle = {
      normal: {
        color: "rgba(0,0,0,0)",
        label: {
          show: false
        },
        labelLine: {
          show: false
        }
      },
      emphasis: {
        color: "rgba(0,0,0,0)"
      }
    };
    var seriesArr = [];
    var radiusArr = [
      [70, 75],
      [60, 70],
      [45, 60],
      [50, 45],
      [60, 50],
      [75, 60]
    ];
    for (var i = 0; i < calcData.length; i++) {
      var series = {
        name: calcData[i].name,
        type: "pie",
        clockWise: false,
        itemStyle: dataStyle,
        hoverAnimation: false
      };
      var radiusIndex = i;
      if (i < 6) {
        series.radius = radiusArr[radiusIndex];
      } else {
        series.radius = radiusArr[radiusIndex - 6];
      }
      var valueArr = calcData[i].value;
      var dataArr = [];
      for (var j = 0; j < valueArr.length; j++) {
        var dataObj = {};
        dataObj.value = valueArr[j];
        dataObj.name = calcData[i].name;
        if (j == 1) {
          dataObj.label = labelShow;
        } else {
          dataObj.itemStyle = placeHolderStyle;
        }
        dataArr.push(dataObj);
      }
      series.data = dataArr;
      seriesArr.push(series);
    }
    seriesArr.push({
      type: "bar",
      data: [0],
      coordinateSystem: "polar",
      name: "06a",
      stack: "a"
    });
    var option = {
      color: [
        "#1D84C6",
        "#3A9BBE",
        "#ED7D31",
        "#FFC000",
        "#B08745",
        "#A770B3",
        "#6463AF"
      ],
      tooltip: {
        show: true,
        formatter: "{b} <br/> {c} ({d}%)"
      },
      angleAxis: {
        type: "category",
        z: 10,
        axisLine: {
          color: "#2079D3",
          lineStyle: {
            width: 3,
            color: "#2079D3"
          }
        }
      },
      radiusAxis: {
        axisTick: {
          show: false
        },
        axisLabel: {
          show: false,
          color: "#fff"
        },
        axisLine: {
          show: false,
          color: "#fff",
          lineStyle: {
            color: "#fff"
          }
        },
        splitLine: {
          color: "#000",
          lineStyle: {
            type: "dotted",
            color: "rgba(170,170,170,.5)"
          }
        }
      },
      polar: {
        center: ["50%", "50%"],
        radius: 90
      },
      series: seriesArr
    };
    sqxzChart.setOption(option, true);
  };

  // 初始化数据来源
  var initSjly = function(data) {
    $("#sjly-chart").empty();
    for (var i = 0; i < data.length; i++) {
      $("#sjly-chart").append(
        $("<div/>")
          .addClass("data-row")
          .append(
            $("<div/>")
              .addClass("data-row-header")
              .html(data[i].name)
          )
          .append(
            $("<div/>")
              .addClass("data-row-body")
              .html((i == 0 ? data[i].value + 69 : data[i].value) + " 条")
          )
      );
    }
  };

  // 初始化具体问题
  var initJtwt = function(data, condition) {
    jtwtChart = ec.init(document.getElementById("jtwt-chart"));
    var option = {
      tooltip: {
        show: true
      },
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
                  return params.name + "\n" + params.value;
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
    jtwtChart.setOption(option);
    jtwtChart.off();
    jtwtChart.on("click", function(param) {
      if (param.data.code) {
        condition.tagCode = param.data.code;
        condition.timestamp = new Date();
        searchRuler.timestamp = condition.timestamp;
        // 单位分析接口调用
        var dwfxAjaxOption = {
          url: sugon.interFaces.rdwt.Dwfx,
          type: "post",
          async: true,
          data: condition
        };
        sugon.requestJson(dwfxAjaxOption, function(result) {
          if (!sugon.isPublished || searchRuler.timestamp == result.timestamp) {
            initDwfx(result.data);
          }
        });
      }
    });
  };

  // 初始化单位分析
  var initDwfx = function(data) {
    var xData = [],
      yData = [],
      startValue = 0,
      endValue = 100;
    var isShow = false;
    if (data.length > 4) {
      endValue = Math.floor((4 / data.length) * 100);
      isShow = true;
    }
    for (var i = 0; i < data.length; i++) {
      xData.push(data[i].name);
      yData.push(data[i].value);
    }
    dwfxChart = ec.init(document.getElementById("dwfx-chart"));
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
          show: isShow,
          type: "slider",
          height: 15,
          bottom: 15,
          handelSize: 0,
          zoomLock: true,
          textStyle: false
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
            show: true,
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
          }
        }
      ]
    };
    dwfxChart.setOption(option);
  };

  var initHiddenDwfx = function(data) {
    var xData = [],
      yData = [];
    for (var i = 0; i < data.length; i++) {
      xData.push(data[i].name);
      yData.push(data[i].value);
    }
    dwfxHiddenChart = ec.init(document.getElementById("dwfx-chart-hidden"));
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
          }
        }
      ]
    };
    dwfxHiddenChart.setOption(option);
  };

  // 初始化热词分析
  var initRcfx = function(data) {
    $("#rcfx-chart").empty();
    for (var i = 0; i < data.length; i++) {
      if (i % 2 == 0) {
        $("#rcfx-chart").append(
          $("<div/>")
            .addClass("chart-row")
            .css("background-color", "#CCDCEB")
            .append(
              $("<span/>")
                .addClass("chart-row-header")
                .html(data[i].name)
            )
            .append(
              $("<span/>")
                .addClass("chart-row-body")
                .html(data[i].value + " 次")
            )
            .append($("<div/>").addClass("clear-div"))
        );
      } else {
        $("#rcfx-chart").append(
          $("<div/>")
            .addClass("chart-row")
            .append(
              $("<span/>")
                .addClass("chart-row-header")
                .html(data[i].name)
            )
            .append(
              $("<span/>")
                .addClass("chart-row-body")
                .html(data[i].value + " 次")
            )
            .append($("<div/>").addClass("clear-div"))
        );
      }
    }
  };

  // 加载左侧数据
  var loadLeftData = function(pageNum) {
    var condition = {
      deptId: searchRuler.deptId,
      date: searchRuler.date,
      timestamp: new Date(),
      pageSize: 10,
      pageNum: pageNum
    };
    searchRuler.deptId = condition.deptId;
    searchRuler.date = condition.date;
    searchRuler.deptName = $("#place").val();
    searchRuler.timestamp = condition.timestamp;
    var ajaxOption = {
      url: sugon.interFaces.rdwt.RdList,
      type: "post",
      data: condition,
      async: true
    };
    sugon.requestJson(ajaxOption, function(result) {
      if (!sugon.isPublished || searchRuler.timestamp == result.timestamp) {
        var resultData = result.data;
        // 清空菜单
        $(".left-panel-ul").empty();
        for (var i = 0; i < resultData.length; i++) {
          $(".left-panel-ul").append(getLiDom(i + 1, resultData[i]));
        }
        // 加载分页栏
        getPagination(result.pageNum, result.totalPage);
        searchRuler.mold = resultData[0].mold;
        searchRuler.questionId = resultData[0].id;
        // 默认加载第一组数据
        loadRightData(
          resultData[0].id,
          resultData[0].mold,
          condition.deptId,
          condition.date
        );
      }
    });
  };

  // 加载右侧数据
  var loadRightData = function(questionId, mold, deptId, date) {
    if (mold == 3 || mold == 4 || mold == 5) {
      $("#jtwt>div>span").html("业务归口分析");
      $("#dwfx>div>span").html("业务归口单位分析");
    } else {
      $("#jtwt>div>span").html("具体问题分析");
      $("#dwfx>div>span").html("具体问题单位分析");
    }
    var data = {
      questionId: questionId,
      mold: mold,
      timestamp: new Date(),
      date: date,
      code: deptId
    };
    searchRuler.timestamp = data.timestamp;
    if (mold == 3 || mold == 4 || mold == 5) {
      $("#rdwt-container").css("width", "65%");
      $("#sqxz").css("display", "none");
      if (rdwtChart) {
        rdwtChart.resize();
      }
    } else {
      $("#rdwt-container").css("width", "32%");
      $("#sqxz").css("display", "block");
      if (rdwtChart) {
        rdwtChart.resize();
      }

      // 诉求性质接口调用
      var sqxzAjaxOption = {
        url: sugon.interFaces.rdwt.Sqxz,
        type: "post",
        async: true,
        data: data
      };
      sugon.requestJson(sqxzAjaxOption, function(result) {
        if (!sugon.isPublished || searchRuler.timestamp == data.timestamp) {
          if (result.data) {
            initSqxz(result.data);
          }
        }
      });
    }
    // 热点问题接口调用
    var rdwtAjaxOption = {
      url: sugon.interFaces.rdwt.Rdwt,
      type: "post",
      async: true,
      data: data
    };
    sugon.requestJson(rdwtAjaxOption, function(result) {
      if (!sugon.isPublished || searchRuler.timestamp == result.timestamp) {
        if (result.data) {
          initRdwt(result.data);
        }
      }
    });

    // 数据来源接口调用
    var sjlyAjaxOption = {
      url: sugon.interFaces.rdwt.Sjly,
      type: "post",
      async: true,
      data: data
    };
    sugon.requestJson(sjlyAjaxOption, function(result) {
      if (!sugon.isPublished || searchRuler.timestamp == result.timestamp) {
        if (result.data) {
          initSjly(result.data);
        }
      }
    });
    // 具体问题接口调用
    var jtwtAjaxOption = {
      url: sugon.interFaces.rdwt.Jtwt,
      type: "post",
      async: true,
      data: data
    };
    sugon.requestJson(jtwtAjaxOption, function(result) {
      if (!sugon.isPublished || searchRuler.timestamp == result.timestamp) {
        if (result.data) {
          initJtwt(result.data, data);
        }
      }
    });
    // 单位分析接口调用
    var dwfxAjaxOption = {
      url: sugon.interFaces.rdwt.Dwfx,
      type: "post",
      async: true,
      data: data
    };
    sugon.requestJson(dwfxAjaxOption, function(result) {
      if (!sugon.isPublished || searchRuler.timestamp == result.timestamp) {
        if (result.data) {
          initDwfx(result.data);
        }
        if (!dwfxHiddenChart) {
          initHiddenDwfx(result.data);
        }
      }
    });
    // 单位分析接口调用
    var rcfxAjaxOption = {
      url: sugon.interFaces.rdwt.Rcfx,
      type: "post",
      async: true,
      data: data
    };
    sugon.requestJson(rcfxAjaxOption, function(result) {
      if (!sugon.isPublished || searchRuler.timestamp == result.timestamp) {
        if (result.data) {
          initRcfx(result.data);
        }
      }
    });
  };

  // 全局查询方法
  var searchFunc = function() {
    searchRuler.deptId = $("#placeCode").val();
    searchRuler.deptName = $("#place").val();
    //searchRuler.date = $('#date-input').val();
    searchRuler.date = "2018-06";
    loadLeftData(1);
  };

  // 弹窗按钮点击事件
  $(".left-panel-body-header-person").click(function() {
    requirejs(["text!../views/myhc/ryqk.html"], function(ele) {
      var panel = $(".pop-panel");
      var width = "100%",
        height = "100%";
      panel
        .html(ele)
        .show()
        .css("width", width)
        .css("height", height);
    });
  });

  // 查询按钮事件监听
  $(".search-btn").click(function() {
    searchRuler.date = $("#date-input").val();
    searchFunc();
  });

  // 报告下载事件监听
  $(".download-report").click(function() {
    var image1 = rdwtChart.getDataURL();
    var image2 = sqxzChart.getDataURL();
    var image3 = jtwtChart.getDataURL();
    var image4 = dwfxHiddenChart.getDataURL();
    var condition = {
      deptId: searchRuler.deptId,
      date: searchRuler.date,
      mold: searchRuler.mold,
      questionId: searchRuler.questionId,
      timestamp: new Date(),
      image1: image1,
      image2: image2,
      image3: image3,
      image4: image4
    };
    searchRuler.timestamp = condition.timestamp;
    var $form = $("<form />")
      .attr("id", "download-form")
      .css("display", "none")
      .attr("action", "/myrd/exportReport")
      .attr("method", "post");
    for (var key in condition) {
      $form.append(
        $('<input type="hidden"/>')
          .attr("name", key)
          .attr("value", condition[key])
      );
    }
    $("body").append($form);
    $form.submit();
    $("#download-form").remove();
  });

  // 页面入口
  $(function() {
    // 初始化查询栏
    initSearchBar();
    // 进来默认查询
    searchFunc();
  });

  // 设置页面入口
  $(".left-panel-body-header-setting").click(function() {
    location.hash = vipspa.stringify("rdwt/setting", {
      deptName: searchRuler.deptName,
      deptId: searchRuler.deptId,
      date: searchRuler.date
    });
  });
});
