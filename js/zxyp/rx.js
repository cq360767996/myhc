requirejs(["common", "ec", "jqcloud"], function(sugon, ec) {
  // 全局查询尺度
  var searchRuler = {};
  var search = {};
  var param1, param2;
  var hfrcData = [];
  // 诉求单位分布数据
  var sqdwfbData = [];
  // 优秀案例数据
  var yxalData = [];
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
    search.deptId = "2014110416460086100000002942";
    search.date1 = getDate(-7);
    search.date2 = getDate(-2);
    search.deptName = "南京市公安局";
    searchRuler.deptId = "2014110416460086100000002942";
    searchRuler.date1 = getDate(-7);
    searchRuler.date2 = getDate(-2);
    searchRuler.deptName = "南京市公安局";

    $("#place").val("南京市公安局");
    $("#placeCode").val("2014110416460086100000002942");
    $("#date-input1").val(search.date1);
    $("#date-input2").val(search.date2);
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
        url: sugon.interFaces.zxyp.rx.Tree
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
        url: sugon.interFaces.zxyp.rx.Txt,
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

  // 群众诉求量走势分析
  var getQzsql = function() {
    var condition = { search: JSON.stringify(search) };
    if (searchRuler.type1 || searchRuler.type1 == 0) {
      condition.type = searchRuler.type1;
    }
    sugon.requestJson(
      {
        url: sugon.interFaces.zxyp.rx.Qzsql,
        type: "post",
        async: true,
        data: condition
      },
      function(result) {
        drawQzsql(result.data);
      }
    );
  };

  // 画群众诉求量echarts图
  var drawQzsql = function(data) {
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
    var chart3 = ec.init(document.getElementById("qzsql"));

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
      getSqxz();
      getSqdwfb();
    });
  };

  // 诉求性质分析
  var getSqxz = function() {
    var condition = { search: JSON.stringify(search) };
    if (searchRuler.id1 || searchRuler.id1 == 0) {
      condition.id1 = searchRuler.id1;
    }
    if (searchRuler.type1 || searchRuler.type1 == 0) {
      condition.type = searchRuler.type1;
    }
    sugon.requestJson(
      {
        url: sugon.interFaces.zxyp.rx.Sqxz,
        type: "post",
        async: true,
        data: condition
      },
      function(result) {
        drawSqxz(result.data);
      }
    );
  };

  // 画诉求性质echarts图
  var drawSqxz = function(data) {
    var total = 0;
    for (var i = 0; i < data.length; i++) {
      total += Number(data[i].value);
    }
    var chart = ec.init(document.getElementById("sqxzfx"));
    var option = {
      title: {
        text: total,
        subtext: "诉求性质",
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
      getSqdwfb();
    });
  };

  // 诉求单位分布
  var getSqdwfb = function() {
    var condition = { search: JSON.stringify(search) };
    if (searchRuler.id1 || searchRuler.id1 == 0) {
      condition.id1 = searchRuler.id1;
    }
    if (searchRuler.id2 || searchRuler.id2 == 0) {
      condition.id2 = searchRuler.id2;
    }

    if (searchRuler.type1 || searchRuler.type1 == 0) {
      condition.type = searchRuler.type1;
    }
    sugon.requestJson(
      {
        url: sugon.interFaces.zxyp.rx.Sqdwfb,
        type: "post",
        async: true,
        data: condition
      },
      function(result) {
        sqdwfbData = result.data;
        drawSqdwfb(sqdwfbData[0]);
      }
    );
  };

  // 画诉求单位分布echarts图
  var drawSqdwfb = function(data) {
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
    var chart = ec.init(document.getElementById("sqdwfb"));
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

  // 满意度
  var initMyd = function() {
    var condition = { search: JSON.stringify(search) };
    if (searchRuler.type2 || searchRuler.type2 == 0) {
      condition.type = searchRuler.type2;
    }
    sugon.requestJson(
      {
        type: "POST",
        async: true,
        url: sugon.interFaces.zxyp.rx.Rxfx,
        data: condition
      },
      function(result) {
        var xData = [],
          yData = [],
          iData = [],
          min = result.data[0].value1,
          max = result.data[0].value1,
          min2 = result.data[0].value2,
          max2 = result.data[0].value2;
        for (var i = 0; i < result.data.length; i++) {
          xData.push(result.data[i].name);
          yData.push(result.data[i].value1);
          iData.push(result.data[i].value2);
          min = Math.min(result.data[i].value1, min);
          max = Math.max(result.data[i].value1, max);
          min2 = Math.min(result.data[i].value2, min2);
          max2 = Math.max(result.data[i].value2, max2);
        }
        var diff = (max2 - min2) / 2;
        min2 = Number(min2 - diff).toFixed(2);
        max2 = Number(max2 + diff).toFixed(2);
        var Chart3 = ec.init(document.getElementById("chart3"));

        var option = {
          color: "#2a9bd5",
          tooltip: {
            trigger: "axis"
          },
          legend: {
            show: true
          },
          grid: {
            top: 30,
            bottom: 25,
            left: 40,
            right: 40
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
              name: "满意度",
              nameTextStyle: {
                color: "#000"
              },
              splitNumber: 5,
              // min: min,
              // max: max,
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
                  color: "#000"
                }
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: "#c9d3df"
                }
              }
            },
            {
              type: "value",
              splitNumber: 5,
              name: "办理时间",
              nameTextStyle: {
                color: "#000"
              },
              min: min2,
              max: max2,
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
                formatter: "{value}",
                textStyle: {
                  color: "#000"
                }
              },
              splitLine: {
                show: false,
                lineStyle: {
                  color: "#c9d3df"
                }
              }
            }
          ],
          series: [
            {
              name: "满意度",
              showSymbol: true,
              symbolSize: 8,
              type: "line",
              color: "red",
              data: yData
            },
            {
              name: "办理时间",
              yAxisIndex: 1,
              barWidth: 25,
              type: "bar",
              data: iData
            }
          ]
        };

        Chart3.setOption(option);
      }
    );
  };

  // 办事效能接口
  var getBsxn = function() {
    var condition = { search: JSON.stringify(search) };
    var ajaxObj = {
      type: "post",
      url: sugon.interFaces.zxyp.rx.Bsxn,
      async: true,
      data: condition
    };
    sugon.requestJson(ajaxObj, function(result) {
      renderBsxn(result.data);
    });
  };

  // 渲染办事效能echarts
  var renderBsxn = function(data) {
    var chart = ec.init(document.getElementById("bsxn"));
    var yMin = Number(data[0].value2),
      yMax = Number(data[0].value2),
      xMin = Number(data[0].value1),
      xMax = Number(data[0].value1);
    var seriesData = data.map(function(item, index, array) {
      yMin = Math.min(yMin, Number(item["value2"]));
      yMax = Math.max(yMax, Number(item["value2"]));
      xMin = Math.min(xMin, Number(item["value1"]));
      xMax = Math.max(xMax, Number(item["value1"]));
      return {
        name: item["name"],
        value: [item["value1"], item["value2"]]
      };
    });
    var computeValue2AvgLine = function() {
      var sum = 0;
      data.forEach(function(item) {
        sum += Number(item["value2"]);
      });
      return sum / data.length;
    };

    var computeValu1AvgLine = function() {
      var sum = 0;
      data.forEach(function(item) {
        sum += Number(item["value1"]);
      });
      return sum / data.length;
    };
    var avg = {
      value1AvgLine: computeValu1AvgLine(),
      value2AvgLine: computeValue2AvgLine()
    };
    var option = {
      tooltip: {
        trigger: "item",
        axisPointer: {
          show: true,
          type: "cross",
          lineStyle: {
            type: "dashed",
            width: 1
          }
        },
        formatter: function(obj) {
          if (obj.componentType == "series") {
            return (
              '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">' +
              obj.name +
              "</div><span>满意度</span>: " +
              obj.data.value[0] +
              "%" +
              "<br/><span>平均办理时长</span> : " +
              obj.data.value[1]
            );
          }
        }
      },
      grid: {
        width: "75%",
        height: "73%",
        left: "10%",
        top: "14%"
      },
      xAxis: {
        name: "满意度",
        type: "value",
        min: xMin,
        max: xMax,
        axisLabel: {
          formatter: "{value}%"
        },
        splitLine: {
          show: false
        },
        axisLine: {
          show: true
        },
        axisTick: {
          show: false
        }
      },
      yAxis: {
        name: "平均办理时长",
        type: "value",
        min: yMin,
        max: yMax,
        axisLabel: {
          formatter: "{value}"
        },
        splitLine: {
          show: false
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        }
      },
      series: [
        {
          type: "scatter",
          data: seriesData,
          symbolSize: 20,
          label: {
            normal: {
              show: true,
              backgroundColor: "#C5E2F2",
              padding: 4,
              position: "right",
              formatter: function(params) {
                return params.name;
              }
            },
            emphasis: {
              label: {
                show: true
              },
              position: "bottom"
            }
          },
          itemStyle: {
            color: new ec.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#fff" },
              { offset: 1, color: "#41AAE4" }
            ]),
            borderWidth: 2,
            borderColor: "#2A9DE0"
          },
          markLine: {
            label: {
              normal: {
                formatter: function(params) {
                  if (params.dataIndex == 0) {
                    return params.value + "%";
                  } else if (params.dataIndex == 1) {
                    return params.value;
                  }
                  return params.value;
                }
              }
            },
            lineStyle: {
              normal: {
                color: "#626c91",
                type: "dotted",
                width: 1
              },
              emphasis: {
                color: "#d9def7"
              }
            },
            data: [
              {
                xAxis: avg.value1AvgLine,
                name: "满意度平均线",
                itemStyle: {
                  normal: {
                    color: "#b84a58"
                  }
                }
              },
              {
                yAxis: avg.value2AvgLine,
                name: "办理时长平均线",
                itemStyle: {
                  normal: {
                    color: "#b84a58"
                  }
                }
              }
            ]
          },
          markArea: {
            silent: true,
            data: [
              [
                {
                  name: "优秀",
                  itemStyle: {
                    normal: {
                      color: "transparent"
                    }
                  },
                  label: {
                    show: true,
                    position: "insideBottomRight",
                    fontStyle: "normal",
                    color: "#15AF6F",
                    borderWidth: 1,
                    borderColor: "#15AF6F",
                    padding: 4,
                    fontSize: 14
                  },
                  coord: [avg.value1AvgLine, avg.value2AvgLine]
                },
                {
                  coord: [Number.MAX_VALUE, 0]
                }
              ],
              [
                {
                  name: "一般",
                  itemStyle: {
                    normal: {
                      color: "transparent"
                    }
                  },
                  label: {
                    show: true,
                    position: "0 0",
                    color: "#ED7D31",
                    borderWidth: 1,
                    borderColor: "#ED7D31",
                    padding: 4,
                    fontSize: 14
                  },
                  coord: [0, Number.MAX_VALUE]
                },
                {
                  coord: [avg.value1AvgLine, avg.value2AvgLine]
                }
              ]
            ]
          }
        }
      ]
    };
    chart.setOption(option);
  };

  // 12345工单办理优秀案例
  var getYxal = function() {
    var condition = {
      deptId: searchRuler.deptId,
      date1: searchRuler.date1,
      date2: searchRuler.date2
    };
    var ajaxObj = {
      type: "post",
      url: sugon.interFaces.zxyp.rx.getYxal,
      async: true,
      data: condition
    };
    sugon.requestJson(ajaxObj, function(result) {
      yxalData = result.data;
      renderYxal();
    });
  };

  // 渲染12345工单办理优秀案例dom
  var renderYxal = function(type) {
    type = type || "0";
    var $body = $("#yxal");
    $body.empty();
    if (type == "0") {
      var containerWidth = "";
      var childWidth = "";
      var len = yxalData.length;
      if (len % 2 == 0) {
        containerWidth =
          "calc(" + (len / 2) * 100 + "% + " + (10 * len - 20) + "px)";
        childWidth = "calc(100% / " + len + " - 15px)";
      } else {
        containerWidth =
          "calc(" + (len / 2) * 100 + "% + " + (10 * len - 10) + "px)";
        childWidth = "calc((100% + 15px) / " + len + " - 15px)";
      }
      $body.append(
        '<div class="head-icon"><i class="glyphicon glyphicon-chevron-left"></i></div>'
      );
      var $container = $("<div/>").addClass("mid-container");
      var $child = $("<div/>").css("width", containerWidth);
      yxalData.map(function(val, index) {
        $child.append(
          '<div style="' +
            (index == 0 ? "margin-left: 0;" : "") +
            "width: " +
            childWidth +
            ';"><div class="col-row1" rowId="' +
            val.id +
            '" style="background: url(' +
            val.url +
            ') no-repeat;background-size: 100% 100%;">' +
            '</div><div class="col-row23">' +
            val.content1 +
            '</div><div class="col-row23">单位:' +
            val.dept +
            '</div><div class="col-row4">诉求内容：' +
            val.content2 +
            "</div></div>"
        );
      });
      $container.append($child);
      $body.append($container);
      $body.append(
        '<div class="head-icon"><i class="glyphicon glyphicon-chevron-right"></i></div>'
      );
    } else {
      yxalData.map(function(val, index) {
        $body.append(
          '<div class="row2"><div>' +
            (index + 1) +
            "、" +
            val.content1 +
            "</div><div>" +
            val.date +
            " " +
            val.dept +
            "</div></div>"
        );
      });
    }
  };

  // 热点专题
  var getRdzt = function() {
    var condition = { search: JSON.stringify(search) };
    var ajaxObj = {
      url: sugon.interFaces.zxyp.rx.Rdzt,
      type: "post",
      async: true,
      data: condition
    };
    sugon.requestJson(ajaxObj, function(result) {
      renderRdztDom(result.data);
    });
  };

  // 渲染热点专题dom
  var renderRdztDom = function(data) {
    var $body = $(".tsList");
    $body.empty();
    for (var i = 0; i < data.length; i++) {
      $body.append(
        '<div class="list-row" row-id="' +
          data[i].id +
          '">' +
          "<div>" +
          data[i].name +
          "</div>" +
          "<div>" +
          '<span>群众诉求：<strong class="strong-blue">' +
          data[i].value1 +
          "件</strong></span>" +
          '<span>满意度：<strong class="strong-green">' +
          data[i].value2 +
          "%</strong></span>" +
          "</div>" +
          "</div>"
      );
    }
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
          url: sugon.interFaces.zxyp.rx.Tag,
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

  var initRank = function() {
    sugon.requestJson(
      {
        type: "POST",
        async: true,
        url: sugon.interFaces.zxyp.rx.Rank,
        data: { search: JSON.stringify(search) }
      },
      function(result) {
        $(".zfList").empty();
        $(".zfList").append(
          "<div>" +
            "<div class='num2'>排名</div>" +
            "<div>关键词</div>" +
            "<div>诉求量</div>" +
            "<div>分析</div>" +
            "</div>"
        );
        for (var i = 0; i < result.data.length; i++) {
          var tempClass = "num2";
          if (i < 3) {
            tempClass += " focusRed";
          }
          $(".zfList").append(
            "<div id=" +
              result.data[i].id +
              ">" +
              "<div class = '" +
              tempClass +
              "'>" +
              (i + 1) +
              "</div>" +
              "<div>" +
              result.data[i].name +
              "</div>" +
              "<div class='b'>" +
              result.data[i].tel +
              "</div>" +
              "<div><img class='tempImg' src='../img/zxyp/jcj/file.png' /></div>" +
              "</div>"
          );
        }
        $(".tempImg")
          .unbind()
          .bind("click", function() {
            let keyword = $(this)
              .parent()
              .parent()
              .attr("id");
            requirejs(["text!../views/zxyp/sjfx.html"], function(ele) {
              sugon.renderDialog({
                width: 1000,
                height: 600,
                title: "正投事件分析",
                ele: ele,
                params: {
                  deptId: searchRuler.deptId,
                  date1: searchRuler.date1,
                  date2: searchRuler.date2,
                  keyword: keyword
                }
              });
            });
          });
      }
    );
  };

  // 群众诉求量走势分析下拉框更改事件
  $(".view-mid-header > select").change(function() {
    var type = $(this).val();
    searchRuler.type1 = type;
    getQzsql();
    getSqxz();
    getSqdwfb();
  });

  // 满意度下拉框改变事件
  $("#dept3").change(function() {
    var type = $(this).val();
    searchRuler.type2 = type;
    initMyd();
  });

  // 诉求单位分布切换事件
  $(".view-mid-nav > div").click(function() {
    if (!$(this).hasClass("nav-selected")) {
      $(".view-mid-nav > div").removeClass("nav-selected");
      var index = $(this).index(".view-mid-nav > div");
      $(this).addClass("nav-selected");
      drawSqdwfb(sqdwfbData[index]);
    }
  });

  // 弹窗点击事件
  $(".tsList").on("click", ".list-row", function() {
    var $this = $(this);
    var rowId = $this.attr("row-id");
    var name = $this.children(":first").html();
    requirejs(["text!../views/zxyp/rdzt.html"], function(ele) {
      sugon.showDialog({
        width: 760,
        height: 500,
        ele: ele,
        params: name + "--" + rowId + "--" + JSON.stringify(searchRuler)
      });
    });
  });

  // 更多&返回按钮事件
  $(".more-back").click(function() {
    var $this = $(this);
    var type;
    if ($this.html().indexOf("left") > -1) {
      $this.html('更多<i class="glyphicon glyphicon-chevron-right"></i>');
      type = 0;
    } else if ($this.html().indexOf("right") > -1) {
      $this.html('返回<i class="glyphicon glyphicon-chevron-left"></i>');
      type = 1;
    }
    renderYxal(type);
  });

  // 设置按钮点击事件
  $(".subTitle > img").click(e => {
    requirejs(["text!../views/zxyp/rx_setting.html"], ele => {
      let option = {
        title: "热点事件配置页面",
        width: 1010,
        height: 600,
        ele: ele,
        params: searchRuler
      };
      sugon.renderDialog(option);
    });
  });

  // 上页下页功能
  function preNextEvent(e) {
    var $doc = $("#yxal");
    var $target = $(e.target),
      $body = $(".mid-container"),
      $container = $(".mid-container > div"),
      containerWidth = $container.width(),
      width = $body.width() + 20,
      left,
      marginLeft = parseFloat($container.css("margin-left"));
    if (
      $target.hasClass("glyphicon-chevron-right") &&
      Math.abs(marginLeft) + width <= containerWidth
    ) {
      left = marginLeft - width;
      $container
        .stop()
        .animate({ "margin-left": left }, 200, "linear", function() {
          $doc.one("click", ".head-icon > i", preNextEvent);
        });
    } else if (
      $target.hasClass("glyphicon-chevron-left") &&
      marginLeft < -0.001
    ) {
      left = marginLeft + width;
      $container
        .stop()
        .animate({ "margin-left": left }, 200, "linear", function() {
          $doc.one("click", ".head-icon > i", preNextEvent);
        });
    } else {
      $doc.one("click", ".head-icon > i", preNextEvent);
    }
  }

  // 前进后退页面按钮点击事件
  $("#yxal").one("click", ".head-icon > i", preNextEvent);

  // 弹出页事件
  $("#yxal").on("click", ".col-row1", function(e) {
    requirejs(["text!../views/zxyp/yxal.html"], function(ele) {
      sugon.renderDialog({
        width: 800,
        height: 500,
        title: "玄武分局红山派出所 “优秀工作案例”",
        ele: ele,
        params: {
          id: $(e.target).attr("rowId")
        }
      });
    });
  });

  var initView = function() {
    //左上文本
    initTxt();
    // 群众诉求量
    getQzsql();
    // 诉求性质分析
    getSqxz();
    // 诉求单位分布
    getSqdwfb();
    //满意度走势
    searchRuler.type2 = 0;
    initMyd();
    // 办事效能
    getBsxn();
    // 群众热点诉求分析
    getYxal();
    // 热点专题
    getRdzt();
    //词云
    initWordCloud($("#dept").val());
    //热点事件排行榜
    initRank();
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
      search.deptId = $("#placeCode").val();
      search.date1 = $("#date-input1").val();
      search.date2 = $("#date-input2").val();
      search.deptName = $("#place").val();
      searchRuler = {};
      searchRuler.deptId = $("#placeCode").val();
      searchRuler.date1 = $("#date-input1").val();
      searchRuler.date2 = $("#date-input2").val();
      searchRuler.deptName = $("#place").val();
      initView();
    });
    initView();
  };

  // 页面入口
  $(function() {
    initPage();
  });
});
