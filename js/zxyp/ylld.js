var zsfxChart;
requirejs(["common", "ec"], function(sugon, ec) {
  // 全局查询尺度
  var searchRuler = {};
  var param1, param2, param3;
  var hfrcData = [];
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
        url: sugon.interFaces.zxyp.ylld.Tree
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
        url: sugon.interFaces.zxyp.ylld.Txt,
        data: { search: JSON.stringify(searchRuler) }
      },
      function(result) {
        for (var i = 0; i < result.data.length; i++) {
          if (i % 2 == 1) {
            $("#left_top .val")
              .eq(i)
              .html(result.data[i].value);
          } else {
            $("#left_top .val")
              .eq(i)
              .find(".b")
              .html(result.data[i].value);
            if (result.data[i].value2.indexOf("+") >= 0) {
              // $("#left_top .val").eq(i).find("span").eq(1).attr("class", "r");
            } else {
              $("#left_top .val")
                .eq(i)
                .find("span")
                .eq(1)
                .attr("class", "g");
            }
            // $("#left_top .val").eq(i).find("span").eq(1).html(result.data[i].value2);
          }
          $("#left_top .txt")
            .eq(i)
            .html(result.data[i].name);
        }
      }
    );
  };

  var initWtyc = function() {
    sugon.requestJson(
      {
        type: "POST",
        async: true,
        url: sugon.interFaces.zxyp.ylld.Shza,
        data: { search: JSON.stringify(searchRuler) }
      },
      function(result) {
        $(".wtList").empty();
        for (var i = 0; i < result.data.length; i++) {
          var str =
            result.data[i].name.length > 19
              ? result.data[i].name.substr(0, 19) + "..."
              : result.data[i].name;
          var tempStr = i + 1 + ". " + str;
          var tempClass = "type" + result.data[i].type;
          $(".wtList").append(
            "<div id=" +
              result.data[i].id +
              " class=" +
              tempClass +
              ">" +
              "<span class='lh l tt'>" +
              tempStr +
              "</span>" +
              "</div>"
          );
        }
      }
    );
  };

  var initRank = function() {
    sugon.requestJson(
      {
        type: "POST",
        async: true,
        url: sugon.interFaces.zxyp.ylld.Rank,
        data: { dept: $("#dept").val(), search: JSON.stringify(searchRuler) }
      },
      function(result) {
        $(".rankList").empty();
        for (var i = 0; i < result.data.length; i++) {
          var tempImg = "",
            tempClass = "rankVal";
          if (i == 0) {
            tempImg = "<img src='../img/zxyp/jcj/one.png' />";
            tempClass += " g";
          } else if (i == 1) {
            tempImg = "<img src='../img/zxyp/jcj/two.png' />";
            tempClass += " b";
          } else if (i == 2) {
            tempImg = "<img src='../img/zxyp/jcj/three.png' />";
          }
          var tempEle =
            "<div>" +
            "<div class='rankPic'>" +
            tempImg +
            "</div>" +
            "<div class='rankName' title='" +
            result.data[i].name +
            "'>" +
            result.data[i].name +
            "</div>" +
            "<div class='rankName' title='" +
            result.data[i].name2 +
            "'>" +
            result.data[i].name2 +
            "</div>";
          if (result.data[i].value2) {
            tempEle +=
              "<div class='rankVal hh'>全市" +
              result.data[i].value2 +
              "名</div>";
          }
          tempEle +=
            "<div class='" +
            tempClass +
            "'>" +
            result.data[i].value +
            "</div></div>";
          $(".rankList").append(tempEle);
        }
      }
    );
  };

  $("#dept").change(function() {
    initRank();
  });

  var initRdfx = function(index) {
    sugon.requestJson(
      {
        type: "POST",
        async: true,
        url: sugon.interFaces.zxyp.ylld.Rdfx,
        data: { dept: $("#dept2").val(), search: JSON.stringify(searchRuler) }
      },
      function(result) {
        if (result.data.length == 1) {
          $(".tab2").css("display", "none");
        } else {
          $(".tab2").css("display", "block");
        }
        var data = result.data[index];
        var xData = [],
          yData = [],
          startValue = 0,
          endValue = 100,
          markData = [],
          show = false,
          max = 0,
          min = 0,
          markNum = 0;
        if (data.length == 0) {
          xData.push("暂无数据");
          yData.push(0);
        } else {
          (max = data[0].value), (min = data[0].value);
          if (data.length > 6) {
            endValue = Math.floor((6 / data.length) * 100);
            show = true;
          }
          for (var i = 0; i < data.length; i++) {
            if (data[i].select) {
              markNum = data[i].value;
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
            } else {
              xData.push(data[i].name);
              yData.push(data[i].value);
            }
            if (data[i].value > max) {
              max = data[i].value;
            }
            if (data[i].value < min) {
              min = data[i].value;
            }
          }
        }
        min = min - 5;

        var chart6 = ec.init(document.getElementById("chart6"));

        var option = {
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow"
            },
            formatter: function(params) {
              var tempStr =
                params[0].name + "<br />数值：" + params[0].value + "%";
              return tempStr;
            }
          },
          grid: {
            left: 10,
            right: 10,
            bottom: 20,
            top: 5,
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
              show: show,
              type: "slider",
              start: startValue,
              end: endValue,
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
              min: min,
              max: max,
              axisLabel: {
                show: true,
                formatter: "{value}%",
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
              name: "数值",
              type: "bar",
              barWidth: 20,
              data: yData,
              itemStyle: {
                normal: {
                  /*borderWidth: 1,
                                borderColor: 'rgba(18, 86, 108, 0.5)',*/
                  color: function(params) {
                    var tempColor = "red";
                    if (params.data > markNum) {
                      tempColor = "#25548a";
                    }
                    return tempColor;
                  },
                  /*color: new ec.graphic.LinearGradient(
                                    0, 0, 0, 1,
                                    [
                                        {offset: 0, color: '#4292cd'},
                                        {offset: 0.5, color: '#3376ad'},
                                        {offset: 1, color: '#25548a'}
                                    ]
                                ),*/
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
                  color: "#25548a",
                  width: "1",
                  type: "dashed"
                },
                data: markData
              }
            }
          ]
        };

        chart6.setOption(option);
      }
    );
  };

  $("#dept2").change(function() {
    initRdfx(0);
  });

  $(".tab2>div")
    .unbind()
    .bind("click", function() {
      $(".tab2 .selected").removeClass("selected");
      $(this).attr("class", "selected");
      var index = $(".tab2>div").index(this);
      initRdfx(index);
    });

  var initYlld = function() {
    sugon.requestJson(
      {
        type: "POST",
        async: true,
        url: sugon.interFaces.zxyp.ylld.Ylld,
        data: { search: JSON.stringify(searchRuler) }
      },
      function(result) {
        var xData = [],
          yData1 = [],
          yData2 = [],
          yData3 = [],
          iData = [],
          min = 0,
          max = 0; /*, min2 = 0, max2 = 0*/
        if (result.data.length == 0) {
          xData.push("暂无数据");
          yData1.push(0);
          yData2.push(0);
          yData3.push(0);
        } else {
          (min = result.data[0].value1),
            (max =
              result.data[0]
                .value1) /*, min2 = result.data[0].value3, max2 = result.data[0].value3*/;
          for (var i = 0; i < result.data.length; i++) {
            xData.push(result.data[i].name);
            yData1.push(result.data[i].value1);
            yData2.push(result.data[i].value2);
            yData3.push(result.data[i].value3);
            iData.push(result.data[i].id);
            min = Math.min(
              result.data[i].value1,
              result.data[i].value2,
              result.data[i].value3,
              min
            );
            max = Math.max(
              result.data[i].value1,
              result.data[i].value2,
              result.data[i].value3,
              max
            );
            /*min2 = Math.min(result.data[i].value3, min2);
                    max2 = Math.max(result.data[i].value3, max2);*/
          }
          min = min - 5;
        }
        var Chart3 = ec.init(document.getElementById("chart3"));
        Chart3.off();
        Chart3.on("click", function(params) {
          if (params.data == 0) {
            return;
          }
          var seriesName = params.seriesName;
          var name = params.name;
          requirejs(["text!../views/zxyp/myd.html"], function(ele) {
            sugon.showDialog({
              width: 760,
              height: 410,
              ele: ele,
              params:
                seriesName + "_" + name + "_" + JSON.stringify(searchRuler)
            });
          });
        });

        var option = {
          color: [
            "rgb(21, 175, 137)",
            "rgb(42, 155, 213)",
            "rgb(167, 112, 179)"
          ],
          tooltip: {
            trigger: "axis",
            formatter: function(params) {
              var tempStr =
                params[0].name +
                "<br />" +
                params[0].seriesName +
                "：" +
                params[0].value +
                "%<br />" +
                params[1].seriesName +
                "：" +
                params[1].value +
                "%<br />" +
                params[2].seriesName +
                "：" +
                params[2].value +
                "%";
              return tempStr;
            }
          },
          legend: {
            show: true
          },
          grid: {
            top: 25,
            bottom: 25,
            left: 45,
            right: 15
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
                show: false,
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
                show: false,
                lineStyle: {
                  color: "#c9d3df"
                }
              }
            } /*,
                    {
                        type: 'value',
                        splitNumber: 5,
                        min: min2,
                        max: max2,
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            onZero: false,
                            lineStyle: {
                                color: '#426791'
                            }
                        },
                        axisLabel: {
                            formatter: "{value}%",
                            textStyle: {
                                color: '#b3cce2'
                            }
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: '#c9d3df'
                            }
                        }
                    }*/
          ],
          series: [
            {
              name: "社会治安满意度",
              showSymbol: true,
              symbolSize: 8,
              type: "line",
              data: yData1
            },
            {
              name: "公安队伍满意度",
              showSymbol: true,
              symbolSize: 8,
              type: "line",
              data: yData2
            },
            {
              name: "社区民警熟悉率",
              showSymbol: true,
              symbolSize: 8,
              type: "line",
              //yAxisIndex: 1,
              data: yData3
            }
          ]
        };

        Chart3.setOption(option);
      }
    );
  };

  $("#chart_title").bind("click", function() {
    param3 = "";
    initJqfx("");
    initInfo("");
  });

  var initJqfx = function(param) {
    sugon.requestJson(
      {
        type: "POST",
        async: true,
        url: sugon.interFaces.zxyp.ylld.Dwjxz,
        data: { id: param, search: JSON.stringify(searchRuler) }
      },
      function(result) {
        var scaleData = result.data;
        if (result.data.length == 0) {
          return;
        }

        var Chart0 = ec.init(document.getElementById("chart0"));

        Chart0.off();
        Chart0.on("click", function(params) {
          param3 = params.data.name;
          $("#chart_title").html(params.data.name);
          initJqfx(params.data.id);
          initInfo(params.data.id);
        });

        if (!param3) {
          $("#chart_title").html("总量");
        }

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

        Chart0.setOption(option);
      }
    );
  };

  var initInfo = function(param) {
    sugon.requestJson(
      {
        type: "POST",
        async: true,
        url: sugon.interFaces.zxyp.ylld.Info,
        data: { id: param, search: JSON.stringify(searchRuler) }
      },
      function(result) {
        $(".infoT").empty();
        for (var i = 0; i < result.data.length; i++) {
          $(".infoT").append(
            "<div>" +
              "<span class='dort'></span>" +
              "<span class='l' style='margin-left: 10px;'>" +
              result.data[i].name +
              "</span>" +
              "<span class='y r img val8 tw'>" +
              result.data[i].value2 +
              "%" +
              "</span>" +
              "<span class='y img b val9'>" +
              result.data[i].value1 +
              "</span>" +
              "</div>"
          );
        }
      }
    );
  };

  var initZfzs = function(param) {
    sugon.requestJson(
      {
        type: "POST",
        async: true,
        url: sugon.interFaces.zxyp.ylld.Zfzs,
        data: { id: param, search: JSON.stringify(searchRuler) }
      },
      function(result) {
        $(".zfList").empty();
        $(".zfList").append(
          "<div>" +
            "<div class='num2'>序号</div>" +
            "<div>姓名</div>" +
            "<div>号码</div>" +
            "<div>社区</div>" +
            "<div>派出所</div>" +
            "<div> 操作</div>" +
            "</div>"
        );
        for (var i = 0; i < result.data.length; i++) {
          $(".zfList").append(
            "<div id=" +
              result.data[i].id +
              ">" +
              "<div class='num'>" +
              (i + 1) +
              "</div>" +
              "<div>" +
              result.data[i].name +
              "</div>" +
              "<div>" +
              result.data[i].tel +
              "</div>" +
              "<div>" +
              result.data[i].address +
              "</div>" +
              "<div>" +
              result.data[i].place +
              "</div>" +
              "<div class='det'>详情</div>" +
              "</div>"
          );
        }
        $(".det")
          .unbind()
          .bind("click", function() {
            sessionStorage.setItem("myKeywords", this.parentNode.id);
            location.href = "index.html";
          });
      }
    );
  };

  $("#check2").bind("click", function() {
    initZfzs($("#zfzs").val());
  });

  var initTs = function(param) {
    sugon.requestJson(
      {
        type: "POST",
        async: true,
        url: sugon.interFaces.zxyp.ylld.Ts,
        data: { id: param, search: JSON.stringify(searchRuler) }
      },
      function(result) {
        $(".tsList").empty();
        $(".tsList").append(
          "<div>" +
            "<div class='num2'>序号</div>" +
            "<div>姓名</div>" +
            "<div>身份证号</div>" +
            "<div>号码</div>" +
            "<div>属性</div>" +
            "</div>"
        );
        for (var i = 0; i < result.data.length; i++) {
          $(".tsList").append(
            "<div id=" +
              result.data[i].id +
              ">" +
              "<div class='num2'>" +
              (i + 1) +
              "</div>" +
              "<div>" +
              result.data[i].name +
              "</div>" +
              "<div>" +
              result.data[i].id +
              "</div>" +
              "<div>" +
              result.data[i].tel +
              "</div>" +
              "<div>" +
              result.data[i].type +
              "</div>" +
              "</div>"
          );
        }
      }
    );
  };

  $("#dept3").change(function() {
    initTs(0);
  });

  $("#export").bind("click", function() {
    alert("导出");
  });

  $("#export2").bind("click", function() {
    alert("导出");
  });

  var initView = function() {
    //左上文本
    initTxt();
    //社会治安满意度具体问题
    initWtyc();
    //排行榜
    initRank();
    //进度条
    initRdfx(0);
    //一率两度走势
    initYlld();
    //多维解析-左
    initJqfx("");
    //多维解析-右
    initInfo("");
    //走访助手
    initZfzs("");
    //空错号、人号不一推送
    initTs(0);
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
      initView();
    });
    initView();
  };

  // 页面入口
  $(function() {
    initPage();
  });
});
