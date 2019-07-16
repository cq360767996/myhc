requirejs(
  ["common", "L", "ec", "iclient", "heat", "markerCluster", "plot"],
  (sugon, L, echarts) => {
    // 全局查询尺度
    var searchRuler = {};
    // 单位情况数据缓存
    var dwqkData = [],
      tData = [],
      sqfxData = []; // 诉求分析数据;

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

    var initList = function() {
      var date = "";
      sugon.requestJson(
        { type: "POST", url: sugon.interFaces.myjz.Date, async: false },
        function(result) {
          date = result.data;
        }
      );
      return date;
    };

    function onLoad(param) {
      var date = !param ? initList() : param;
      //渲染树
      $("#left-tree").treeview({
        data: getTree(date, false),
        levels: 1,
        onNodeSelected: function(event, node) {
          $("#pop-dept-name").val(node.text);
          $("#pop-dept-id").val(node.id);
          $("#left-tree").css("visibility", "hidden");
          initPopSetting3();
        },
        showCheckbox: false //是否显示多选
      });
      $("#place").val(tData[0].text);
      $("#placeCode").val(tData[0].id);
      $("#date1").val(getDate(-4));
      $("#date2").val(getDate(-2));
    }

    //获取树数据
    function getTree(param, isAsync) {
      var treeData = [];
      sugon.requestJson(
        {
          type: "POST",
          url: sugon.interFaces.myzs.Tree,
          data: { date: param },
          async: isAsync
        },
        function(result) {
          treeData = result.data;
          tData = treeData;
        }
      );
      return treeData;
    }

    //日期时间控件
    $("#date1")
      .datetimepicker({
        format: "yyyy-mm",
        autoclose: true,
        todayBtn: true,
        startView: "year",
        minView: "year",
        maxView: "decade",
        language: "zh-CN"
      })
      .change(function() {
        initSideData();
        initLevelLayer();
      });

    $("#date2")
      .datetimepicker({
        format: "yyyy-mm",
        autoclose: true,
        todayBtn: true,
        startView: "year",
        minView: "year",
        maxView: "decade",
        language: "zh-CN"
      })
      .change(function() {
        initSideData();
        initLevelLayer();
      });

    // 获取左侧上部数据
    var getRightUpData = function() {
      var condition = {
        dept: $("#placeCode").val(),
        date1: $("#date1").val(),
        date2: $("#date2").val()
      };
      var ajaxObj = {
        url: sugon.interFaces.myzs.getLeftData,
        type: "post",
        data: condition,
        async: true
      };
      sugon.requestJson(ajaxObj, function(result) {
        var $div = $(".right-amount1");
        for (var i = 0; i < $div.length; i++) {
          $div.eq(i).html(result.data[i]);
        }
      });
    };

    // 获取左侧中间数据
    var getRightMidData = function() {
      var condition = {
        deptId: $("#placeCode").val(),
        date1: $("#date1").val(),
        date2: $("#date2").val()
      };
      var ajaxObj = {
        url: sugon.interFaces.myzs.getRightMidData,
        type: "post",
        data: condition,
        async: true
      };
      sugon.requestJson(ajaxObj, function(result) {
        var data1 = result.data1,
          data2 = result.data2;
        var $div = $(".right-mid-amount");
        data1.map(function(value, index) {
          $div.eq(index).html(value);
        });
        var chart = echarts.init(document.getElementById("right-banner-chart"));
        var option = {
          title: {
            subtext: "诉求集中\n单位",
            left: "center",
            top: "20%",
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
                      return params.name + "\n" + params.value;
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
              data: data2
            }
          ]
        };
        chart.setOption(option);
      });
    };

    // 获取右侧下部数据
    var getRightDownData = function() {
      var condition = {
        deptId: $("#placeCode").val(),
        date: $("#date2").val(),
        timestamp: new Date(),
        pageSize: "10",
        pageNum: "1"
      };
      var ajaxObj = {
        url: sugon.interFaces.myzs.getRightData,
        type: "post",
        data: condition,
        async: true
      };
      sugon.requestJson(ajaxObj, function(result) {
        var data = result.data;
        var $body = $(".right-panel-body");
        $body.empty();
        for (var i = 0; i < data.length; i++) {
          $body.append(
            '<div title="' +
              data[i].content +
              '">' +
              (i + 1) +
              "、" +
              data[i].content +
              "</div>"
          );
        }
      });
    };

    // 初始化两侧数据
    var initSideData = function() {
      // 加载右上侧数据
      getRightUpData();
      // 加载右中间数据
      getRightMidData();
      // 加载右下侧数据
      getRightDownData();
    };

    // 指标组成接口调用
    var getZbzc = function() {
      var condition = {
        deptId: $("#placeCode").val(),
        date1: $("#date1").val(),
        date2: $("#date2").val()
      };
      var ajaxObj = {
        url: sugon.interFaces.myzs.getZbzc,
        type: "post",
        data: condition,
        async: true
      };
      sugon.requestJson(ajaxObj, function(result) {
        var data = result.data;
        var data1 = [],
          data2 = [];
        for (var i = 0; i < data.length; i++) {
          for (var j = 0; j < data[i].length; j++) {
            if (j == 0) {
              data1.push(data[i][j]);
            } else {
              data2.push(data[i][j]);
            }
          }
        }
        for (var i = 0; i < data1.length; i++) {
          $(".cell-color" + (i + 1)).html(data1[i]);
        }
        for (var i = 0; i < data2.length; i++) {
          $(".cell-color")
            .eq(i)
            .html(data2[i]);
        }
      });
    };

    // 执法公信力走势分析接口调用
    var getZfgxl = function() {
      var condition = {
        deptId: $("#placeCode").val(),
        date1: $("#date1").val(),
        date2: $("#date2").val()
      };
      var ajaxObj = {
        url: sugon.interFaces.myzs.getZfgxl,
        type: "post",
        data: condition,
        async: true
      };
      sugon.requestJson(ajaxObj, function(result) {
        renderZfgxl(result.data);
      });
    };

    // 渲染执法公信力走势分析echarts图
    var renderZfgxl = function(data) {
      var xData = [],
        yData = [],
        min = 0,
        max = 0;
      if (data && data.length > 0) {
        min = Number(data[0].value);
        max = Number(data[0].value);
      }
      for (var i = 0; i < data.length; i++) {
        xData.push(data[i].name);
        yData.push(data[i].value);
        min = Math.min(min, Number(data[i].value));
        max = Math.max(max, Number(data[i].value));
      }
      min = Number(min - (max - min) / 2).toFixed(2);
      max = Number(max + (max - min) / 2).toFixed(2);
      var chart = echarts.init(document.getElementById("pop-chart1"));
      var option = {
        color: "#3cb2fc",
        tooltip: {
          trigger: "axis"
        },
        grid: {
          top: "5%",
          left: "15%",
          width: "82%",
          height: "80%"
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
      chart.setOption(option);
    };

    // 单位情况接口调用
    var getDwqk = function() {
      var condition = {
        deptId: $("#placeCode").val(),
        date1: $("#date1").val(),
        date2: $("#date2").val()
      };
      var ajaxObj = {
        url: sugon.interFaces.myzs.getDwqk,
        type: "post",
        data: condition,
        async: true
      };
      sugon.requestJson(ajaxObj, function(result) {
        dwqkData = result.data;
        renderDwqk(result.data[0]);
      });
    };

    // 渲染执法公信力走势分析echarts图
    var renderDwqk = function(data) {
      var xData = [],
        yData = [],
        min = 0,
        max = 0,
        markData = [],
        startValue = 0,
        endValue = 100,
        isShow = false;
      if (data && data.length > 0) {
        min = Number(data[0].value);
        max = Number(data[0].value);
      }
      if (data.length > 6) {
        isShow = true;
        endValue = Math.floor((6 / data.length) * 100);
      }
      for (var i = 0; i < data.length; i++) {
        min = Math.min(min, Number(data[i].value));
        max = Math.max(max, Number(data[i].value));
        xData.push(data[i].name);
        yData.push(data[i].value);
        if (data[i].selected) {
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
      min = Number(min - (max - min) / 2).toFixed(2);
      max = Number(max + (max - min) / 2).toFixed(2);
      var chart = echarts.init(document.getElementById("pop-chart2"));
      var option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        grid: {
          left: 0,
          top: 14,
          height: isShow ? "83%" : "88%",
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
            start: startValue,
            end: endValue,
            height: 7,
            bottom: 0,
            handelSize: 0,
            zoomLock: true,
            textStyle: false
          }
        ],
        xAxis: [
          {
            type: "category",
            axisTick: { show: false },
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
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            min: min,
            max: max
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
                barBorderRadius: 2,
                borderWidth: 1,
                borderColor: "rgba(18, 86, 108, 0.5)",
                color: "#2A9BD5",
                label: {
                  show: true,
                  position: "top",
                  textStyle: {
                    color: "#5f707a"
                  }
                }
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
              }
            }
          }
        ]
      };
      if (!markData || markData.length != 0) {
        option.series[0].markLine.data = markData;
      } else {
        option.series[0].markLine = "";
      }
      chart.setOption(option);
    };

    var renderMyd = function(data) {
      var xData = [],
        symbolData = [];
      data.map(function(val) {
        var obj = { value: val.value, symbolPosition: "end", id: val.id };
        xData.push(val.name);
        symbolData.push(obj);
      });
      var chart = echarts.init(document.getElementById("pop2-chart"));
      var option = {
        tooltip: {
          formatter: "{b}：{c}"
        },
        grid: {
          top: "10%",
          bottom: "24%"
        },
        xAxis: {
          show: true,
          z: 20,
          offset: 40,
          data: xData,
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            show: true,
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
            },
            textStyle: {
              fontSize: 18,
              color: "#000"
            }
          }
        },
        yAxis: {
          splitLine: {
            show: false
          },
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
        series: [
          {
            name: "年报上报率3",
            label: {
              show: true,
              position: "top",
              color: "#000",
              fontSize: 18
            },
            type: "pictorialBar",
            symbolSize: [50, 15],
            symbolOffset: [0, -9],
            z: 12,
            itemStyle: {
              normal: {
                color: "#14b1eb"
              }
            },
            data: symbolData
          },
          {
            name: "年报上报率2",
            type: "pictorialBar",
            symbolSize: [50, 15],
            symbolOffset: [0, 9],
            z: 12,
            itemStyle: {
              normal: {
                color: "#14b1eb"
              }
            },
            data: data
          },
          {
            name: "年报上报率1",
            type: "pictorialBar",
            symbolSize: [75, 30],
            symbolOffset: [0, 18],
            z: 11,
            itemStyle: {
              normal: {
                color: "transparent",
                borderColor: "#14b1eb",
                borderWidth: 5
              }
            },
            data: data
          },
          {
            name: "年报上报率",
            type: "pictorialBar",
            symbolSize: [100, 50],
            symbolOffset: [0, 29],
            z: 10,
            itemStyle: {
              normal: {
                color: "transparent",
                borderColor: "#14b1eb",
                borderType: "dashed",
                borderWidth: 5
              }
            },
            data: data
          },
          {
            type: "bar",
            itemStyle: {
              normal: {
                color: "#14b1eb",
                opacity: 0.7
              }
            },
            silent: false,
            barWidth: 50,
            barGap: "-100%", // Make series be overlap
            data: data
          }
        ]
      };
      chart.setOption(option);
      chart.off();
      chart.on("click", function(params) {
        searchRuler.id = params.data.id ? params.data.id : "";
        if (searchRuler.id) {
          $(".return-img").show();
          initPopPage2();
        }
      });
    };

    // 初始化弹出框
    var initPopPage = function() {
      getZbzc();
      getZfgxl();
      getDwqk();
    };

    // 初始化第二弹出页
    var initPopPage2 = function() {
      sugon.requestJson(
        {
          type: "post",
          url: sugon.interFaces.myzs.getMyd,
          data: {
            deptId: $("#placeCode").val(),
            date1: $("#date1").val(),
            date2: $("#date2").val(),
            type: searchRuler.type ? searchRuler.type : "",
            id: searchRuler.id ? searchRuler.id : ""
          },
          async: true
        },
        function(result) {
          if (searchRuler.type == 1) {
            $(".pop-panel2-header").html(
              '社会治安满意度调查情况<i class="glyphicon glyphicon-remove"></i>'
            );
          } else {
            $(".pop-panel2-header").html(
              '公安队伍满意度调查情况<i class="glyphicon glyphicon-remove"></i>'
            );
          }
          renderMyd(result.data);
        }
      );
    };

    // 执法公信力指数录入时间选择器
    $("#pop-date1")
      .datetimepicker({
        format: "yyyy-mm",
        autoclose: true,
        todayBtn: true,
        startView: "year",
        minView: "year",
        maxView: "decade",
        language: "zh-CN"
      })
      .change(function() {
        initPopSetting1();
      });

    // 执法公信力系统配置时间选择器
    $("#pop-date2")
      .datetimepicker({
        format: "yyyy",
        autoclose: true,
        todayBtn: true,
        startView: "decade",
        minView: "decade",
        maxView: "decade",
        language: "zh-CN"
      })
      .change(function() {
        initPopSetting2();
      });

    // 执法公信力展示配置时间选择器1
    $("#pop-date3")
      .datetimepicker({
        format: "yyyy-mm",
        autoclose: true,
        todayBtn: true,
        startView: "year",
        minView: "year",
        maxView: "decade",
        language: "zh-CN"
      })
      .change(function() {
        initPopSetting3();
      });

    // 执法公信力展示配置时间选择器
    $("#pop-date4")
      .datetimepicker({
        format: "yyyy-mm",
        autoclose: true,
        todayBtn: true,
        startView: "year",
        minView: "year",
        maxView: "decade",
        language: "zh-CN"
      })
      .change(function() {
        initPopSetting3();
      });

    // 初始化执法公信力指数录入数据
    var initPopSetting1 = function() {
      sugon.requestJson(
        {
          type: "post",
          url: sugon.interFaces.myzs.getSjlr,
          data: { date: $("#pop-date1").val() },
          async: true
        },
        function(result) {
          result.data.map(function(val1, i) {
            val1.map(function(val2, j) {
              var index = i * 12 + j;
              $(".tab-cell > input")
                .eq(index)
                .val(val2);
            });
          });
        }
      );
    };

    var initPopSetting2 = function(isRest) {
      sugon.requestJson(
        {
          type: "post",
          url: isRest
            ? sugon.interFaces.myzs.resetXspz
            : sugon.interFaces.myzs.getXspz,
          data: { date: $("#pop-date2").val() },
          async: true
        },
        function(result) {
          result.data.map(function(val, index) {
            $(".right-tab1 > div > input")
              .eq(index)
              .val(val);
          });
        }
      );
    };

    var initPopSetting3 = function(isRest) {
      sugon.requestJson(
        {
          type: "post",
          url: isRest
            ? sugon.interFaces.myzs.resetZspz
            : sugon.interFaces.myzs.getZspz,
          data: {
            deptId: $("#pop-dept-id").val(),
            date1: $("#pop-date3").val(),
            date2: $("#pop-date4").val()
          },
          async: true
        },
        function(result) {
          result.data1.map(function(val, index) {
            $(".num-div")
              .eq(index)
              .html(val + "%");
          });
          result.data2.map(function(val, index) {
            $(".forth-col1 > div")
              .eq(index)
              .html(val + "%");
          });
          result.data3.map(function(val, index) {
            if (
              index == 3 ||
              index == 10 ||
              index == 11 ||
              index == 13 ||
              index == 14
            ) {
              $(".right-tab2 > div > input")
                .eq(index)
                .val(val);
            } else {
              $(".right-tab2 > div > input")
                .eq(index)
                .val(val);
            }
          });
        }
      );
    };

    // 提交执法公信力指数录入数据
    var submitPopSetting1 = function() {
      var arr = [];
      // 写入数据
      for (var i = 0; i < 13; i++) {
        var innerArr = [];
        for (var j = 0; j < 12; j++) {
          var index = i * 12 + j;
          var str = $(".tab-cell > input")
            .eq(index)
            .val();
          innerArr.push(str);
        }
        arr.push(innerArr);
      }
      var condition = {
        time: $("#pop-date1").val(),
        data: JSON.stringify(arr)
      };
      sugon.requestJson(
        {
          type: "post",
          url: sugon.interFaces.myzs.submitSjlr,
          data: condition,
          async: true
        },
        function(result) {
          if (result.code == "200") {
            sugon.showMessage(result.msg, "success");
            $(".pop-mask").hide();
            $(".pop-setting1").hide();
          } else {
            sugon.showMessage(result.msg, "error");
          }
        }
      );
    };

    // 提交系数配置
    var submitPopSetting2 = function() {
      var arr = [];
      // 写入数据
      for (var i = 0; i < $(".right-tab1 > div > input").length; i++) {
        arr.push(
          $(".right-tab1 > div > input")
            .eq(i)
            .val()
        );
      }
      var condition = {
        time: $("#pop-date2").val(),
        data: JSON.stringify(arr)
      };
      sugon.requestJson(
        {
          type: "post",
          url: sugon.interFaces.myzs.submitXspz,
          data: condition,
          async: true
        },
        function(result) {
          if (result.code == "200") {
            sugon.showMessage(result.msg, "success");
            $(".pop-mask").hide();
            $(".pop-setting2").hide();
          } else {
            sugon.showMessage(result.msg, "error");
          }
        }
      );
    };

    // 提交展示配置
    var submitPopSetting3 = function() {
      var data = [];
      var condition = {
        deptId: $("#pop-dept-id").val(),
        date1: $("#pop-date3").val(),
        date2: $("#pop-date4").val()
      };
      var $inputArr = $(".right-tab2 > div > input");
      for (var i = 0; i < $inputArr.length; i++) {
        data.push($inputArr.eq(i).val());
      }
      condition.data = JSON.stringify(data);
      sugon.requestJson(
        {
          type: "post",
          url: sugon.interFaces.myzs.submitZspz,
          data: condition,
          async: true
        },
        function(result) {
          if (result.code == "200") {
            sugon.showMessage(result.msg, "success");
            $(".pop-mask").hide();
            $(".pop-setting3").hide();
          } else {
            sugon.showMessage(result.msg, "error");
          }
        }
      );
    };

    // input失去焦点的时候计算新的指标
    $(".right-tab2 > div > input").blur(function() {
      var condition = {};
      var data = [];
      var $inputArr = $(".right-tab2 > div > input");
      for (var i = 0; i < $inputArr.length; i++) {
        data.push($inputArr.eq(i).val());
      }
      condition.data = JSON.stringify(data);
      sugon.requestJson(
        {
          type: "post",
          url: sugon.interFaces.myzs.calcZspz,
          data: condition,
          async: true
        },
        function(result) {
          result.data1.map(function(val, index) {
            $(".num-div")
              .eq(index)
              .html(val + "%");
          });
          result.data2.map(function(val, index) {
            $(".forth-col1 > div")
              .eq(index)
              .html(val + "%");
          });
        }
      );
    });

    // 返回按钮
    $(".return-img").click(function() {
      searchRuler.id = "";
      $(".return-img").hide();
      initPopPage2();
    });

    // 左侧容器点击事件
    $(".right-panel-up-1-up > div").click(function() {
      var index = $(this).index();
      $(".pop-mask").show();
      if (index == 0) {
        $(".pop-panel").show();
        $(".pop-panel > div > span").html(
          $("#place").val() + "执法公信力指数分析"
        );
        initPopPage();
      } else {
        $(".pop-panel2").show();
        searchRuler.type = index;
        searchRuler.id = "";
        initPopPage2();
      }
    });

    // 关闭按钮事件
    $(".pop-panel > div > i").click(function() {
      $(".pop-mask").hide();
      $(".pop-panel").hide();
    });

    // 关闭按钮事件
    $(".pop-panel2-header").on(
      "click",
      $(".pop-panel2-header > i"),
      function() {
        $(".pop-mask").hide();
        $(".pop-panel2").hide();
      }
    );

    // 导航切换事件
    $(".pop-nav > div").click(function() {
      var $this = $(this);
      var index = $this.index();
      if (!$this.hasClass("nav-selected")) {
        $(".nav-selected").removeClass("nav-selected");
        $this.addClass("nav-selected");
        renderDwqk(dwqkData[index]);
      }
    });

    // 云搜查询事件监听
    $(".input-group-btn").click(function() {
      var value = $(".search-box").val();
      if (value) {
        window.parent.location.href = sugon.server + "#myys/ysxq?txt=" + value;
      }
    });

    // 折叠按钮点击事件
    $(".fold-btn").click(function() {
      $(".select-tab").hide();
      var rightPanel = $(".right-panel");
      var foldBtn = $(".fold-img");
      if (parseInt(rightPanel.css("right")) < 0) {
        $(".right-panel").animate({ right: "15px" });
        foldBtn.css("transform", "rotateY(0deg)");
      } else {
        $(".right-panel").animate({ right: "-330px" });
        foldBtn.css("transform", "rotateY(180deg)");
      }
    });

    // 设置按钮点击事件
    $(".setting-btn").click(function() {
      var $selectTab = $(".select-tab");
      var $this = $(this);
      var position = $this.offset();
      var display = $selectTab.css("display");
      if (display == "block") {
        $selectTab.slideUp(100);
      } else {
        $selectTab.css("left", position.left - 50 - 100 + "px");
        $selectTab.css("top", position.top + 40 - 70 + "px");
        $selectTab.slideDown(100);
      }
    });

    // 下拉框选择事件
    $(".select-option").click(function() {
      var index = $(this).index();
      $(".pop-mask").show();
      $(".pop-setting" + index).show();
      $(".select-tab").hide();
      switch (index) {
        case 1:
          $("#pop-date1").val($("#date2").val());
          initPopSetting1();
          break;
        case 2:
          $("#pop-date2").val(
            $("#date2")
              .val()
              .slice(0, 4)
          );
          initPopSetting2();
          break;
        case 3:
          $("#pop-dept-name").val($("#place").val());
          $("#pop-dept-id").val($("#placeCode").val());
          $("#pop-date3").val($("#date1").val());
          $("#pop-date4").val($("#date2").val());
          initPopSetting3();
          break;
      }
    });

    // 第一个弹出框关闭事件
    $(".setting1-back").click(function() {
      $(".pop-mask").hide();
      $(".pop-setting1").hide();
    });

    // 第二个弹出框关闭事件
    $(".setting2-back").click(function() {
      $(".pop-mask").hide();
      $(".pop-setting2").hide();
    });

    // 第三个弹出框关闭事件
    $(".setting3-back").click(function() {
      $(".pop-mask").hide();
      $(".pop-setting3").hide();
    });

    // 第二个弹出框重置事件
    $(".reset-btn2").click(function() {
      initPopSetting2(true);
    });

    // 第三个弹出框重置事件
    $(".reset-btn3").click(function() {
      initPopSetting3(true);
    });

    // 第一个弹出框提交按钮事件
    $(".submit-btn1").click(function() {
      submitPopSetting1();
    });

    // 第二个弹出框提交按钮事件
    $(".submit-btn2").click(function() {
      submitPopSetting2();
    });

    // 第三个弹出框提交按钮事件
    $(".submit-btn3").click(function() {
      submitPopSetting3();
    });

    // 弹出框单位选择事件
    $("#pop-dept-name").click(function() {
      var position = $(this).offset();
      var $tree = $("#left-tree");
      $tree
        .css("visibility", "visible")
        .css("left", position.left + "px")
        .css("top", position.top + 25 + "px")
        .width("200px");
    });

    // 鼠标经过显示
    $(".body-row-body").mouseover(function(e) {
      var $this = $(this);
      var index = $this.index(".body-row-body");
      $(".inner-pop-panel").show();
      sugon.requestJson(
        {
          type: "post",
          url: sugon.interFaces.myzs.getZbzcDetail,
          data: {
            type: index,
            deptId: $("#placeCode").val(),
            date1: $("#date1").val(),
            date2: $("#date2").val()
          },
          async: true
        },
        function(result) {
          var $ul = $(".inner-pop-panel > ul");
          $ul.empty();
          result.data.map(function(val) {
            $ul.append(
              "<li><div>" + val.name + "</div><div>" + val.value + "</div></li>"
            );
          });
        }
      );
    });

    // 鼠标移出事件
    $(".body-row-body").mouseout(function() {
      $(".inner-pop-panel").css("display", "none");
    });

    // 鼠标移动移动弹框位置
    $(".body-row-body").mousemove(function(e) {
      $(".inner-pop-panel").css("left", e.clientX - 100 - 100);
      $(".inner-pop-panel").css("top", e.clientY + 20 - 70);
    });

    /******************************************************************/

    var map;
    // 分别记录分局、派出所、责任区的zoom、上级code、center
    var zoomArr = [
        { zoom: 11, upDeptCode: "", center: [32.03613281, 118.78211975] }
      ],
      mapLayer = [];
    var allFjLayerGroup = L.layerGroup(),
      allFjMarkerGroup = L.layerGroup(); // 所有分局layer相关数据
    var pcsLayerGroup = L.layerGroup(),
      pcsMarkerGroup = L.layerGroup(); // 派出所layer相关数据
    var zrqLayerGroup = L.layerGroup(),
      zrqMarkerGroup = L.layerGroup(); // 责任区layer相关数据
    var singleZrqLayerGroup = L.layerGroup(),
      singleZrqMarkerGroup = L.layerGroup(); // 单个责任区layer相关数据
    var heatLayerGroup = [],
      currentLevel = ""; // 聚合点数据
    var markerClusterGroup = L.markerClusterGroup({
        spiderfyOnMaxZoom: false,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: false,
        singleMarkerMode: true
      }),
      queryGroup = L.layerGroup(),
      mapMarkData = [];
    var searchInput,
      ckGroup = L.layerGroup(); // 1、输入框文本；2、窗口图层group

    // 圈选相关变量
    var serverUrl, queryPlottingLayer, drawControl, plotting;
    var bounds,
      queryResult = [],
      selectedData = [],
      isQuery; // 圈选的数据
    var ckMarkerGroups = [],
      ckCircleGroups = [],
      latLng = {}; // 窗口mark，窗口圆，圆心经纬度
    var popMarkerGroup = L.layerGroup(); // 随机跳动的计时器，弹出marker组
    var ckBorderGroup = L.layerGroup(),
      isLoadBounds = true,
      syncPulse = false; // 窗口的边界图层，窗口页面是否加载边界
    var isRenderSearchChart = false; // 是否渲染查询的echarts图

    // 创建地图
    function createMapL() {
      // 创建地图
      map = L.map("mainMap", {
        crs: L.CRS.EPSG4326,
        preferCanvas: false,
        center: [32.03613281, 118.78211975],
        maxZoom: 18,
        minZoom: 10,
        zoom: 11,
        zoomControl: false,
        attributionControl: false,
        closePopupOnClick: false //点击地图不关闭popup框
      });
      mapLayer = L.supermap.wmtsLayer(
        "http://10.33.66.183:2333/iserver/services/map-wmts-GADT/wmts-china",
        {
          layer: "GADT",
          style: "default",
          tilematrixSet: "ChinaPublicServices_GADT",
          format: "image/png",
          transparent: true
        }
      );
      mapLayer.addTo(map);
      // 加载所有分局信息
      getAllFjData();
    }

    //初始化地图数据 绘制出所有的分局
    function getAllFjData() {
      currentLevel = 0;
      var sqlParam = new SuperMap.GetFeaturesBySQLParameters({
        queryParameter: {
          name: "gajg_pcszrq_3201_pg@ORCL_gt8",
          attributeFilter: "DWBM like '%000000' ",
          fields: ["DWBM", "DWMC"],
          orderBy: "DWBM"
        },
        datasetNames: ["ORCL_gt8:gajg_pcszrq_3201_pg"],
        toIndex: -1
      });
      var url = "http://10.33.66.183:2334/iserver/services/data-gt8/rest/data";
      L.supermap
        .featureService(url)
        .getFeaturesBySQL(sqlParam, function(serviceResult) {
          var resultData = serviceResult.result.features.features;
          map.setView(zoomArr[0].center, zoomArr[0].zoom);
          allFjLayerGroup = L.layerGroup();
          allFjMarkerGroup = L.layerGroup();
          // 在添加之前置空
          resultData.map(function(val) {
            var resultLayer = L.polygon(
              changeLonAndLat(val.geometry.coordinates),
              {
                color: "#386AFB",
                fillOpacity: 0,
                className: "fj-layer",
                weight: 1,
                code: val.properties.DWBM
              }
            );
            var center = L.latLngBounds(
              changeLonAndLat(val.geometry.coordinates)
            ).getCenter();
            resultLayer.on(
              {
                mouseover: mouseoverEvent,
                mouseout: mouseoutEvent,
                click: function() {
                  level021(val.properties.DWBM, val.properties.DWBM, center);
                }
              },
              true
            );
            allFjLayerGroup.addLayer(resultLayer);
          });
          sugon.requestJson(
            {
              type: "post",
              url: sugon.interFaces.myzs.DeptId,
              async: false
            },
            function(result) {
              $("#place").val(result.NAME);
              $("#placeCode").val(result.ID);
              // 重新加载左右两侧数据
              initSideData();
              if (isRenderSearchChart) {
                renderSearchChart();
              }
              var mapParams =
                '{"code": "' +
                result.ID +
                '", "codeName": "' +
                result.NAME +
                '", "mold": "1", "mapCode": "' +
                result.CODE +
                '"}';
              sessionStorage.setItem("mapParams", mapParams);
            }
          );
          // 加载热力图
          loadHeatMap();
          map.addLayer(allFjLayerGroup);
        });
      var fjData = [
        {
          code: 320116000000,
          name: "六合分局",
          lat: "32.424774169921875",
          lng: "118.8446044921875"
        },
        {
          code: 320112000000,
          name: "江北新区分局",
          lat: "32.202301025390625",
          lng: "118.69903564453125"
        },
        {
          code: 320111000000,
          name: "浦口分局",
          lat: "32.03819274902344",
          lng: "118.50608825683594"
        },
        {
          code: 320113000000,
          name: "栖霞分局",
          lat: "32.130889892578125",
          lng: "118.95034790039062"
        },
        {
          code: 320192000000,
          name: "经济技术开发区分局",
          lat: "32.149085998535156",
          lng: "118.87327194213867"
        },
        {
          code: 320106000000,
          name: "鼓楼分局",
          lat: "32.085914611816406",
          lng: "118.75019073486328"
        },
        {
          code: 320102000000,
          name: "玄武分局",
          lat: "32.069091796875",
          lng: "118.83224487304688"
        },
        {
          code: 320104000000,
          name: "秦淮分局",
          lat: "32.010040283203125",
          lng: "118.81061553955078"
        },
        {
          code: 320105000000,
          name: "建邺分局",
          lat: "32.010040283203125",
          lng: "118.69903564453125"
        },
        {
          code: 320114000000,
          name: "雨花台分局",
          lat: "31.9427490234375",
          lng: "118.69800567626953"
        },
        {
          code: 320115000000,
          name: "江宁分局",
          lat: "31.837005615234375",
          lng: "118.81027221679688"
        },
        {
          code: 320124000000,
          name: "溧水分局",
          lat: "31.604232788085938",
          lng: "119.02381896972656"
        },
        {
          code: 320125000000,
          name: "高淳分局",
          lat: "31.324081420898438",
          lng: "118.96202087402344"
        }
      ];
      fjData.map(function(val) {
        var len = val.name.length * 16 + 30;
        var divIcon = L.divIcon({
          className: "fj-icon",
          html:
            '<div class="bubblefj" code="' +
            val.code +
            '" style="width: ' +
            len +
            'px;">' +
            val.name +
            "</div>",
          iconAnchor: [len / 2, 0]
        });
        var marker = L.marker([val.lat, val.lng], { icon: divIcon });
        allFjMarkerGroup.addLayer(marker);
      });

      map.addLayer(allFjMarkerGroup);
    }

    // 鼠标经过边框加粗事件
    function mouseoverEvent(e) {
      $(".bubblefj").css("color", "white");
      map.eachLayer(function(layer) {
        if (layer.options.weight == 2) {
          layer.setStyle({
            color: "#386AFB",
            fillOpacity: 0,
            weight: 1
          });
        }
        if (layer._leaflet_id == e.target._leaflet_id) {
          var $div = $('div.bubblefj[code="' + e.target.options.code + '"]');
          $div
            .css("color", "#ffe200")
            .stop()
            .animate({ top: "5px" }, 200, function() {
              $div.stop().animate({ top: "0" }, 200);
            });
          layer.setStyle({
            weight: 2,
            fillOpacity: 0.15
          });
        }
      });
    }

    // 鼠标出去移除加粗效果事件
    function mouseoutEvent() {
      $(".bubblefj").css("color", "white");
      map.eachLayer(function(layer) {
        if (layer.options.weight == 2) {
          layer.setStyle({
            color: "#386AFB",
            fillOpacity: 0,
            weight: 1
          });
        }
      });
    }

    // 单位层级由0 ==》 1
    function level021(deptCode, upDeptCode, center) {
      var zoomArrObj = {};
      zoomArrObj.zoom = 12;
      zoomArrObj.upDeptCode = upDeptCode;
      if (center) {
        zoomArrObj.center = center;
        map.setView(center, 12);
      }
      zoomArr[1] = zoomArrObj;
      sugon.requestJson(
        {
          type: "POST",
          url: sugon.interFaces.myzs.DeptId,
          async: false,
          data: { deptCode: deptCode }
        },
        function(result) {
          $("#place").val(result.NAME);
          $("#placeCode").val(result.ID);
          var mapParams =
            '{"code": "' +
            result.ID +
            '", "codeName": "' +
            result.NAME +
            '", "mold": "1", "mapCode": "' +
            result.CODE +
            '"}';
          sessionStorage.setItem("mapParams", mapParams);
        }
      );

      // 根据分局code获取所有派出所数据
      getPcsDataByFjCode(deptCode);
      $(".fj-icon").hide();
      // 初始化左右两侧数据
      initSideData();
    }

    // 单位层级由1 ==》 2
    function level122(deptCode, upDeptCode, center) {
      // 隐藏热力图层
      map.removeLayer(heatLayerGroup);
      // 隐藏左右两侧页面
      $(".right-panel-up")
        .show()
        .css("height", "50%");
      $(".right-panel-down").css("height", "50%");
      $(".right-panel-up-1").hide();
      $(".right-panel-up-2").show();
      var zoomArrObj = {};
      zoomArrObj.zoom = 14;
      zoomArrObj.upDeptCode = upDeptCode;
      if (center) {
        zoomArrObj.center = center;
        map.setView(center, 14);
      }
      zoomArr[2] = zoomArrObj;
      $(".pcs-icon").hide();
      $(".pcs-layer").hide();
      // 根据部门code获取部门id，并写入sessionStorage
      sugon.requestJson(
        {
          type: "POST",
          url: sugon.interFaces.myzs.DeptId,
          async: false,
          data: { deptCode: deptCode }
        },
        function(result) {
          $("#place").val(result.NAME.replace(result.UP_NAME, ""));
          $("#placeCode").val(result.ID);
          var mapParams =
            '{"code": "' +
            result.ID +
            '", "codeName": "' +
            result.NAME +
            '", "mold": "1", "mapCode": "' +
            result.CODE +
            '"}';
          sessionStorage.setItem("mapParams", mapParams);
        }
      );
      sugon.requestJson(
        {
          type: "post",
          async: true,
          url: sugon.interFaces.myzs.getPcsZb,
          data: {
            deptId: $("#placeCode").val(),
            date1: $("#date1").val(),
            date2: $("#date2").val()
          }
        },
        function(result) {
          var $body = $(".right-panel-up-2");
          var nameArr = [
            "110接处警满意度",
            "窗口服务满意度",
            "案件综合评价",
            "事故综合评价",
            "12345满意度",
            "社区民警熟悉率",
            "社会治安满意度",
            "公安队伍满意度"
          ];
          $body.empty();
          result.data.map(function(val, index) {
            if (val) {
              var html =
                '<div><div class="right-amount2">' +
                val +
                '</div><div class="right-name2">' +
                nameArr[index] +
                "</div></div>";
              $body.append(html);
            }
          });
        }
      );
      loadMarkerCluster();
      // 根据派出所code获取责任区数据
      getZrqDataByPcsCode(deptCode);
    }

    // 单位层级由2 ==》 3
    function level223(deptCode) {
      // 隐藏左右两侧页面
      $(".right-panel-up").hide();
      $(".right-panel-down").css("height", "100%");
      $(".pcs-icon").hide();
      $(".pcs-layer").hide();
      // 根据部门code获取部门id，并写入sessionStorage
      sugon.requestJson(
        {
          type: "POST",
          url: sugon.interFaces.myzs.DeptId,
          async: false,
          data: { deptCode: deptCode }
        },
        function(result) {
          $("#place").val(result.NAME);
          $("#placeCode").val(result.ID);
          var mapParams =
            '{"code": "' +
            result.ID +
            '", "codeName": "' +
            result.NAME +
            '", "mold": "1", "mapCode": "' +
            result.CODE +
            '"}';
          sessionStorage.setItem("mapParams", mapParams);
        }
      );
      // 初始化数据panel
      initDataPanel($(".search-yw").val());
      // 根据派出所code获取责任区数据
      getDataByZrqCode(deptCode);
    }

    //处理geometry数据数组中经纬度 与 leaflet.js API中构建polygon(纬，经)矛盾
    function changeLonAndLat(arr) {
      var result = [];
      for (var k = 0; k < arr.length; k++) {
        var arr1 = [];
        for (var i = 0; i < arr[k].length; i++) {
          var arr2 = [];
          for (var j = 0; j < arr[k][i].length; j++) {
            var arr3 = [];
            var temp = arr[k][i][j][0];
            var t1 = arr[k][i][j][0];
            var t2 = arr[k][i][j][1];
            temp = t1;
            t1 = t2;
            t2 = temp;
            arr3.push(t1, t2);
            arr2.push(arr3);
          }
          arr1.push(arr2);
        }
        result.push(arr1);
      }
      return result;
    }

    //获取分局下所有派出所数据
    function getPcsDataByFjCode(fjCode) {
      if (isRenderSearchChart) {
        renderSearchChart();
      }
      currentLevel = 1;
      var subCode = fjCode.substring(0, 6);
      var sqlParam = new SuperMap.GetFeaturesBySQLParameters({
        queryParameter: {
          name: "gajg_pcszrq_3201_pg@ORCL_gt8",
          attributeFilter:
            "DWBM like '" + subCode + "%' and DWMC like '%派出所'",
          fields: ["DWBM", "DWMC"],
          orderBy: "DWBM"
        },
        datasetNames: ["ORCL_gt8:gajg_pcszrq_3201_pg"],
        fromIndex: 1,
        toIndex: -1
      });
      var url = "http://10.33.66.183:2334/iserver/services/data-gt8/rest/data";
      L.supermap
        .featureService(url)
        .getFeaturesBySQL(sqlParam, function(serviceResult) {
          var resultData = serviceResult.result.features.features;
          // 清空map上的分局数据
          map.removeLayer(allFjLayerGroup);
          map.removeLayer(allFjMarkerGroup);
          allFjLayerGroup = L.layerGroup();
          allFjMarkerGroup = L.layerGroup();

          map.removeLayer(pcsLayerGroup);
          map.removeLayer(pcsMarkerGroup);
          pcsLayerGroup = L.layerGroup();
          pcsMarkerGroup = L.layerGroup();
          resultData.map(function(val) {
            var resultLayer = L.polygon(
              changeLonAndLat(val.geometry.coordinates),
              {
                color: "#386AFB",
                fillOpacity: 0,
                className: "fj-layer",
                weight: 1,
                code: val.properties.DWBM
              }
            );
            var center = L.latLngBounds(
              changeLonAndLat(val.geometry.coordinates)
            ).getCenter();
            var len = val.properties.DWMC.length * 16 + 30;
            var divIcon = L.divIcon({
              className: "pcs-icon",
              html:
                '<div class="bubblefj" code="' +
                val.properties.DWBM +
                '" style="width: ' +
                len +
                'px;">' +
                val.properties.DWMC +
                "</div>",
              iconAnchor: [len / 2, 0]
            });
            var marker = L.marker(center, { icon: divIcon });
            resultLayer.on({
              mouseover: mouseoverEvent,
              mouseout: mouseoutEvent,
              click: function() {
                var deptCode = val.properties.DWBM;
                level122(deptCode, deptCode, center);
              },
              mouseup: function(e) {
                var which = e.originalEvent.which;
                var deptCode = val.properties.DWBM;
                if (which == 3) {
                  // 移除派出所图层
                  map.removeLayer(pcsLayerGroup);
                  map.removeLayer(pcsMarkerGroup);
                  pcsLayerGroup = L.layerGroup();
                  pcsLayerGroup = L.layerGroup();
                  $(".right-panel-up-2").hide();
                  $(".right-panel-up-1").show();
                  $(".pcs-icon").hide();
                  $(".pcs-layer").hide();
                  // 右键时，记录上级id
                  sugon.requestJson(
                    {
                      type: "POST",
                      url: sugon.interFaces.myzs.DeptId,
                      async: false,
                      data: { deptCode: deptCode }
                    },
                    function(result) {
                      $("#place").val(result.UP_NAME);
                      $("#placeCode").val(result.UP_ID);
                      var mapParams =
                        '{"code": "' +
                        result.UP_ID +
                        '", "codeName": "' +
                        result.UP_NAME +
                        '", "mold": "1", "mapCode": "' +
                        result.UP_CODE +
                        '"}';
                      sessionStorage.setItem("mapParams", mapParams);
                      getAllFjData();
                    }
                  );
                  // 重设中心点和zoom值
                  map.setView(zoomArr[0].center, zoomArr[0].zoom);
                }
              }
            });
            pcsLayerGroup.addLayer(resultLayer);
            pcsMarkerGroup.addLayer(marker);
          });
          loadHeatMap();
          map.addLayer(pcsLayerGroup);
          map.addLayer(pcsMarkerGroup);
        });
    }

    //传入派出所编码 绘制责任区数据
    function getZrqDataByPcsCode(pcsCode) {
      if (isRenderSearchChart) {
        renderSearchChart();
      }
      currentLevel = 2;
      var subCode = pcsCode.substring(0, 8);
      var sqlParam = new SuperMap.GetFeaturesBySQLParameters({
        queryParameter: {
          name: "gajg_pcszrq_3201_pg@ORCL_gt8",
          attributeFilter:
            "DWBM like '%" + subCode + "%' and DWMC like '%责任区'",
          fields: ["DWBM", "DWMC"],
          orderBy: "DWBM"
        },
        datasetNames: ["ORCL_gt8:gajg_pcszrq_3201_pg"],
        fromIndex: 1,
        toIndex: -1
      });
      var url = "http://10.33.66.183:2334/iserver/services/data-gt8/rest/data";
      L.supermap
        .featureService(url)
        .getFeaturesBySQL(sqlParam, function(serviceResult) {
          var resultData = serviceResult.result.features.features;
          // 清空map上的分局数据
          map.removeLayer(pcsLayerGroup);
          map.removeLayer(pcsMarkerGroup);
          pcsLayerGroup = L.layerGroup();
          pcsMarkerGroup = L.layerGroup();
          // 清空派出所layer和marker
          resultData.map(function(val) {
            var resultLayer = L.polygon(
              changeLonAndLat(val.geometry.coordinates),
              {
                color: "#386AFB",
                fillOpacity: 0,
                className: "fj-layer",
                weight: 1,
                code: val.properties.DWBM
              }
            );
            var center = L.latLngBounds(
              changeLonAndLat(val.geometry.coordinates)
            ).getCenter();
            var dwmc = val.properties.DWMC.replace($("#place").val(), "");
            var len = dwmc.length * 16 + 30;
            var divIcon = L.divIcon({
              className: "zrq-icon",
              html:
                '<div class="bubblefj" code="' +
                val.properties.DWBM +
                '" style="width: ' +
                len +
                'px;">' +
                dwmc +
                "</div>",
              iconAnchor: [len / 2, 0]
            });
            var marker = L.marker(center, { icon: divIcon });
            resultLayer.on({
              mouseover: mouseoverEvent,
              mouseout: mouseoutEvent,
              click: function() {
                var deptCode = val.properties.DWBM;
                level223(deptCode);
              },
              mouseup: function(e) {
                if (searchInput) {
                  isRenderSearchChart = true;
                }
                var deptCode = val.properties.DWBM;
                var which = e.originalEvent.which;
                if (which == 3) {
                  // 显示左右两侧页面
                  $(".data-panel").hide();
                  $(".right-panel-up").show();
                  $(".right-panel-up-1").show();
                  $(".right-panel-up")
                    .show()
                    .css("height", "70%");
                  $(".right-panel-down").css("height", "30%");
                  $(".right-panel-up-2").hide();
                  // 移除聚合图层
                  map.removeLayer(markerClusterGroup);
                  markerClusterGroup = L.markerClusterGroup({
                    spiderfyOnMaxZoom: false,
                    showCoverageOnHover: false,
                    zoomToBoundsOnClick: false,
                    singleMarkerMode: true
                  });
                  // 移除责任区图层
                  map.removeLayer(zrqLayerGroup);
                  map.removeLayer(zrqMarkerGroup);
                  zrqLayerGroup = L.layerGroup();
                  zrqMarkerGroup = L.layerGroup();

                  $(".zrq-icon").hide();
                  $(".zrq-layer").hide();
                  // 右键时，记录上级id
                  sugon.requestJson(
                    {
                      type: "POST",
                      url: sugon.interFaces.myzs.DeptId,
                      async: false,
                      data: { deptCode: pcsCode }
                    },
                    function(result) {
                      $("#place").val(result.UP_NAME);
                      $("#placeCode").val(result.UP_ID);
                      var mapParams =
                        '{"code": "' +
                        result.UP_ID +
                        '", "codeName": "' +
                        result.UP_NAME +
                        '", "mold": "1", "mapCode": "' +
                        result.UP_CODE +
                        '"}';
                      sessionStorage.setItem("mapParams", mapParams);
                    }
                  );
                  getPcsDataByFjCode(zoomArr[1].upDeptCode);
                  // 重设中心店和zoom值
                  map.setView(zoomArr[1].center, zoomArr[1].zoom);
                }
              }
            });
            zrqLayerGroup.addLayer(resultLayer);
            zrqMarkerGroup.addLayer(marker);
          });
          map.addLayer(zrqLayerGroup);
          map.addLayer(zrqMarkerGroup);
        });
    }

    // 根据责任区id获取责任区边界
    function getDataByZrqCode(zrqCode) {
      if (searchInput) {
        isRenderSearchChart = false;
      }
      $(".search-pop-panel").hide();
      currentLevel = 3;
      var sqlParam = new SuperMap.GetFeaturesBySQLParameters({
        queryParameter: {
          name: "gajg_pcszrq_3201_pg@ORCL_gt8",
          attributeFilter: "DWBM = '" + zrqCode + "' and DWMC like '%责任区'",
          fields: ["DWBM", "DWMC"],
          orderBy: "DWBM"
        },
        datasetNames: ["ORCL_gt8:gajg_pcszrq_3201_pg"],
        fromIndex: 1,
        toIndex: -1
      });
      var url = "http://10.33.66.183:2334/iserver/services/data-gt8/rest/data";
      L.supermap
        .featureService(url)
        .getFeaturesBySQL(sqlParam, function(serviceResult) {
          var resultData = serviceResult.result.features.features;
          // 清空map上的分局数据
          map.removeLayer(zrqLayerGroup);
          map.removeLayer(zrqMarkerGroup);
          zrqLayerGroup = L.layerGroup();
          zrqMarkerGroup = L.layerGroup();
          // 清空责任区layer和marker
          var bounds = "";
          resultData.map(function(val) {
            var resultLayer = L.polygon(
              changeLonAndLat(val.geometry.coordinates),
              {
                color: "#386AFB",
                fillOpacity: 0,
                className: "fj-layer",
                weight: 1,
                code: val.properties.DWBM
              }
            );
            var center = L.latLngBounds(
              changeLonAndLat(val.geometry.coordinates)
            ).getCenter();
            var len = val.properties.DWMC.length * 16 + 30;
            var divIcon = L.divIcon({
              className: "single-zrq-icon",
              html:
                '<div class="bubblefj"  code="' +
                val.properties.DWBM +
                '" style="width: ' +
                len +
                'px;">' +
                val.properties.DWMC +
                "</div>",
              iconAnchor: [len / 2, 0]
            });
            bounds = resultLayer.getBounds();
            var marker = L.marker(center, { icon: divIcon });
            resultLayer.on("mouseup", function(e) {
              var deptCode = val.properties.DWBM;
              var which = e.originalEvent.which;
              if (which == 3) {
                // 显示左右两侧页面
                $(".data-panel").hide();
                $(".right-panel-up")
                  .show()
                  .css("height", "50%");
                $(".right-panel-down").css("height", "50%");
                $(".right-panel-up-1").hide();
                $(".right-panel-up-2").show();
                // 移除责任区图层
                map.removeLayer(singleZrqLayerGroup);
                map.removeLayer(singleZrqMarkerGroup);
                map.removeLayer(queryGroup);
                singleZrqLayerGroup = L.layerGroup();
                singleZrqMarkerGroup = L.layerGroup();
                queryGroup = L.layerGroup();
                // 清空派出所layer和marker
                $(".single-zrq-icon").hide();
                $(".single-zrq-layer").hide();
                // 右键时，记录上级id
                sugon.requestJson(
                  {
                    type: "POST",
                    url: sugon.interFaces.myzs.DeptId,
                    async: false,
                    data: { deptCode: zrqCode, isZrq2Pcs: true }
                  },
                  function(result) {
                    $("#place").val(result.UP_NAME);
                    $("#placeCode").val(result.UP_ID);
                    var mapParams =
                      '{"code": "' +
                      result.UP_ID +
                      '", "codeName": "' +
                      result.UP_NAME +
                      '", "mold": "1", "mapCode": "' +
                      result.UP_CODE +
                      '"}';
                    sessionStorage.setItem("mapParams", mapParams);
                  }
                );
                loadMarkerCluster();
                getZrqDataByPcsCode(zoomArr[2].upDeptCode);

                // 重设中心店和zoom值
                map.setView(zoomArr[2].center, zoomArr[2].zoom);
              }
            });
            singleZrqLayerGroup.addLayer(resultLayer);
            singleZrqMarkerGroup.addLayer(marker);
          });
          map.addLayer(singleZrqLayerGroup);
          map.addLayer(singleZrqMarkerGroup);
          map.fitBounds(bounds);
        });
    }

    // 初始化数据面板
    function initDataPanel(type) {
      $(".data-panel").show();
      initSearch(type);
      initTab(type);
    }

    // 初始化查询面板
    function initSearch(type) {
      var $search = $(".data-panel-search");
      $search.empty();
      $search.append($("<span/>").html("业务类型："));
      var data = getSearchData(type);
      data.map(function(value, index) {
        var $div = $("<div/>");
        if (index < 1) {
          $div.addClass("search-selected");
        }
        $search.append($div.html(value));
      });
    }

    // 获取查询栏的数据
    function getSearchData(type) {
      var data = [],
        countData = [0, 0, 0, 0, 0];
      if (isQuery) {
        selectedData.map(function(value) {
          countData[0]++;
          switch (value.sjly) {
            case "110接处警":
              countData[1]++;
              break;
            case "案件":
              countData[2]++;
              break;
            case "12345热线":
              countData[3]++;
              break;
          }
        });
        switch (type) {
          case "0":
            data = [
              "全部(" + countData[0] + ")",
              "110接处警(" + countData[1] + ")",
              "案件(" + countData[2] + ")",
              "12345热线(" + countData[3] + ")"
            ];
            break;
          case "1":
            data = ["110接处警(" + countData[1] + ")"];
            break;
          case "2":
            data = ["案件(" + countData[2] + ")"];
            break;
          case "3":
            data = ["12345热线(" + countData[3] + ")"];
            break;
        }
      } else {
        sugon.requestJson(
          {
            type: "post",
            url: sugon.interFaces.myzs.getMapCount,
            async: false,
            data: {
              deptId: $("#placeCode").val(),
              date1: $("#date1").val(),
              date2: $("#date2").val(),
              type: type,
              keyword: searchInput
            }
          },
          function(result) {
            data = result.data;
          }
        );
      }
      return data;
    }

    // 获取表单数据
    function getTabData(type, pageNum) {
      type = type || 0;
      pageNum = pageNum || 1;
      var data = [];
      if (isQuery) {
        // 请求责任区接口
        var splitData = [[], [], [], [], []];
        selectedData.map(function(value) {
          splitData[0].push(value);
          switch (value.sjly) {
            case "110接处警":
              splitData[1].push(value);
              break;
            case "案件":
              splitData[2].push(value);
              break;
            case "12345热线":
              splitData[3].push(value);
              break;
          }
        });
        for (var i = (pageNum - 1) * 100; i < pageNum * 100; i++) {
          if (splitData[type][i]) {
            data.push(splitData[type][i]);
          }
        }
      } else {
        sugon.requestJson(
          {
            type: "post",
            url: sugon.interFaces.myzs.getDetailMapData,
            async: false,
            data: {
              deptId: $("#placeCode").val(),
              date1: $("#date1").val(),
              date2: $("#date2").val(),
              type: type,
              pageNum: pageNum,
              keyword: searchInput || ""
            }
          },
          function(result) {
            data = result.data;
          }
        );
      }
      return data;
    }

    // 初始化tab面板
    function initTab(type, pageNum, searchType) {
      searchType = searchType || 0;
      var $tab = $(".data-panel-tab");
      var header1 = "",
        header2 = "";
      var realType = type == 0 ? searchType : Number(type);
      switch (realType) {
        case 0:
          header1 = "数据来源";
          header2 = "业务类型";
          break;
        case 1:
          header1 = "警情类别";
          header2 = "诉求内容";
          break;
        case 2:
          header1 = "案件类别";
          header2 = "案件名称";
          break;
        case 3:
          header1 = "业务类型";
          header2 = "诉求目的";
          break;
      }

      $tab.empty();
      $tab.append(
        '<div class="data-tab-header"><div class="col1">序号</div>' +
          '<div class="col2">时间</div><div class="col3">诉求人</div><div class="col4">' +
          header1 +
          '</div><div class="col5">' +
          header2 +
          "</div</div>"
      );
      var data = getTabData(realType, pageNum);
      // 移除派出所层级marker
      map.removeLayer(markerClusterGroup);
      markerClusterGroup = L.markerClusterGroup({
        spiderfyOnMaxZoom: false,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: false,
        singleMarkerMode: true
      });
      // 移除当前层级marker
      map.removeLayer(queryGroup);
      queryGroup = L.layerGroup();
      data.map(function(value, index) {
        var $div = $("<div/>")
          .addClass("data-panel-tab-row")
          .attr("ywid", value.ywid);
        $div.append(
          $("<div/>")
            .addClass("col1")
            .html(index + 1)
        );
        $div.append(
          $("<div/>")
            .addClass("col2")
            .html(value["sj"])
        );
        $div.append(
          $("<div/>")
            .addClass("col3")
            .html(value["sqr"])
        );
        $div.append(
          $("<div/>")
            .addClass("col4")
            .html(value["sjly"])
        );
        $div.append(
          $("<div/>")
            .addClass("col5")
            .html(value["ywlx"])
        );
        $tab.append($div);
        var icon;

        var str = "";
        switch (value.sjly) {
          case "110接处警":
            str += "<p>姓名：" + value.sqr + "</p>";
            str += "<p>电话：" + value.dh + "</p>";
            str += "<p>接警时间：" + value.sj + "</p>";
            str += "<p>报警地址：" + value.bjdz + "</p>";
            str += "<p>报警内容：" + value.bjnr + "</p>";
            str += "<p>警情类型：" + value.ywlx + "</p>";
            str += "<p>短信回复：" + value.inmsg + "</p>";
            str += "<p>群众诉求：" + value.lynr + "</p>";
            icon = L.icon({
              iconUrl: "../../img/myhc/myzs/location_aj.png",
              popupAnchor: [10, 5]
            });
            break;
          case "案件":
            str += "<p>案件名称：" + value.ajmc + "</p>";
            str += "<p>业务类型：" + value.ywlx + "</p>";
            str += "<p>案件地址：" + value.ajdz + "</p>";
            str += "<p>受理时间：" + value.sj + "</p>";
            str += "<p>案件类别：" + value.ajlb + "</p>";
            str += "<p>工单标签：" + value.tag + "</p>";
            str += '<div class="pop-divider"></div>';
            value.person.map(function(val) {
              str += "<p>姓名：" + val.xm + "</p>";
              str += "<p>联系电话：" + val.dh + "</p>";
              str += "<p>群众诉求：" + val.lynr + "</p>";
              str += '<div class="pop-divider"></div>';
            });
            icon = L.icon({
              iconUrl: "../../img/myhc/myzs/location_jcj.png",
              popupAnchor: [10, 5]
            });
            break;
          case "12345热线":
            str += "<p>姓名：" + (value.sqr || "") + "</p>";
            str += "<p>电话：" + (value.dh || "") + "</p>";
            str += "<p>诉求时间：" + (value.sj || "") + "</p>";
            str += "<p>具体地址：" + (value.jtdz || "") + "</p>";
            str += "<p>诉求业务：" + (value.sqyw || "") + "</p>";
            str += "<p>诉求问题：" + (value.sqwt || "") + "</p>";
            str += "<p>诉求内容：" + (value.sqnr || "") + "</p>";
            icon = L.icon({
              iconUrl: "../../img/myhc/myzs/location_12345.png",
              popupAnchor: [10, 5]
            });
            break;
        }
        var resultLayer = L.marker([value.lat, value.lng], { icon: icon });
        resultLayer.bindPopup(
          '<div ywid="' +
            value.ywid +
            '" class="pop-map-mark-header">' +
            value.sjly +
            '</div><div class="pop-map-mark-body">' +
            str +
            "</div>"
        );
        resultLayer.on("popupopen", function(e) {
          var content = e.popup._content;
          var reg = /ywid\="\S*"/;
          var resultArr = content.match(reg);
          var ywid = "";
          if (resultArr) {
            ywid = resultArr[0].substring(6, resultArr[0].length - 1).trim();
          }
          if (ywid) {
            var tabRow = $(".data-panel-tab-row"),
              className = "data-panel-tab-row-hover";
            tabRow.removeClass(className);
            for (var i = 0; i < tabRow.length; i++) {
              var row = tabRow.eq(i);
              if (row.attr("ywid") == ywid) {
                row.addClass(className);
              }
            }
          }
        });
        resultLayer.on("popupclose", function(e) {
          $(".data-panel-tab-row").removeClass("data-panel-tab-row-hover");
        });
        queryGroup.addLayer(resultLayer);
      });
      queryGroup.addTo(map);
      var pageStr = $(".search-selected").html();
      var totalCount = pageStr.substring(
        pageStr.indexOf("(") + 1,
        pageStr.lastIndexOf(")")
      );
      var pages =
        totalCount % 100 == 0
          ? parseInt(totalCount / 100)
          : parseInt(totalCount / 100) + 1;
      sugon.renderNav($(".nav-container"), pageNum, pages, function(page) {
        initTab(type, page);
      });
    }

    // 处理颜色和icon
    function handleColorAndIcon(data) {
      data = Number(data);
      var result = {
        color: "",
        icon: ""
      };
      if (data > 0) {
        result.icon = "glyphicon-arrow-up";
        result.color = "banner-color1";
      } else if (data == 0) {
        result.icon = "glyphicon-minus";
        result.color = "banner-color4";
      } else {
        result.icon = "glyphicon-arrow-down";
        result.color = "banner-color2";
      }
      return result;
    }

    // 初始化窗口mark
    function initCkMark(deptCode, isNotZoomIn) {
      map.removeLayer(allFjLayerGroup);
      var className = !isNotZoomIn ? "pop-ck-down-true" : "";
      deptCode = deptCode || "";
      sugon.requestJson(
        {
          type: "post",
          url: sugon.interFaces.myzs.getCkMapData,
          async: false,
          data: {
            deptCode: deptCode,
            deptId: $("#placeCode").val(),
            date1: $("#date1").val(),
            date2: $("#date2").val()
          }
        },
        function(result) {
          var data = result.data;
          var fjData = [
            {
              code: 320116000000,
              name: "六合分局",
              lat: "32.424774169921875",
              lng: "118.8446044921875"
            },
            {
              code: 320112000000,
              name: "江北新区分局",
              lat: "32.202301025390625",
              lng: "118.69903564453125"
            },
            {
              code: 320111000000,
              name: "浦口分局",
              lat: "32.03819274902344",
              lng: "118.50608825683594"
            },
            {
              code: 320113000000,
              name: "栖霞分局",
              lat: "32.130889892578125",
              lng: "118.95034790039062"
            },
            {
              code: 320192000000,
              name: "经济技术开发区分局",
              lat: "32.149085998535156",
              lng: "118.87327194213867"
            },
            {
              code: 320106000000,
              name: "鼓楼分局",
              lat: "32.085914611816406",
              lng: "118.75019073486328"
            },
            {
              code: 320102000000,
              name: "玄武分局",
              lat: "32.069091796875",
              lng: "118.83224487304688"
            },
            {
              code: 320104000000,
              name: "秦淮分局",
              lat: "32.010040283203125",
              lng: "118.81061553955078"
            },
            {
              code: 320105000000,
              name: "建邺分局",
              lat: "32.010040283203125",
              lng: "118.69903564453125"
            },
            {
              code: 320114000000,
              name: "雨花台分局",
              lat: "31.9427490234375",
              lng: "118.69800567626953"
            },
            {
              code: 320115000000,
              name: "江宁分局",
              lat: "31.837005615234375",
              lng: "118.81027221679688"
            },
            {
              code: 320124000000,
              name: "溧水分局",
              lat: "31.604232788085938",
              lng: "119.02381896972656"
            },
            {
              code: 320125000000,
              name: "高淳分局",
              lat: "31.324081420898438",
              lng: "118.96202087402344"
            }
          ];
          ckGroup = L.layerGroup();
          data.map(function(value) {
            fjData.map(function(value2) {
              if (value2.code == value.code) {
                value.lat = value2.lat;
                value.lng = value2.lng;
              }
            });
            var width = value.name.length * 16 + 40,
              top = "";
            var height = value.ismost ? 130 : 90;
            if (value.ismost == "1") {
              top = '<div class="pop-ck-up pop-ck-up-top"></div>';
            } else if (value.ismost == "2") {
              top = '<div class="pop-ck-up pop-ck-up-alarm"></div>';
            }

            var html =
              '<div code="' +
              value.code +
              '" style="width: ' +
              width +
              'px;">' +
              top +
              '<div class="pop-mid pop-ck-mid"><div class="pop-mid">' +
              value.value +
              '%</div><div class="pop-mid">' +
              value.name +
              '</div></div><div class="pop-ck-down ' +
              className +
              '"></div></div>';
            var divIcon = L.divIcon({
              className: "ck-popup",
              html: html,
              popupAnchor: [width / 2 - 8, 0],
              iconAnchor: [width / 2 + 3, height - 30]
            });
            var marker = L.marker([value.lat, value.lng], { icon: divIcon });
            ckGroup.addLayer(marker);
          });
          ckGroup.addTo(map);
        }
      );
    }

    // 初始化窗口右侧面板
    function initCkRight(deptCode, isPcs) {
      deptCode = deptCode || "";
      sugon.requestJson(
        {
          type: "post",
          url: sugon.interFaces.myzs.getCkfw,
          data: {
            deptCode: deptCode,
            deptId: $("#placeCode").val(),
            date1: $("#date1").val(),
            date2: $("#date2").val()
          },
          async: true
        },
        function(result) {
          var data = result.data;
          if (data && data.length > 0) {
            var $banner = $(".right-up-banner");
            var $body = $(".right-up-body");
            $banner.empty();
            $body.empty();
            var colorIcon1 = handleColorAndIcon(data[0][2]);
            var colorIcon2 = handleColorAndIcon(data[0][3]);
            $banner.append(
              '<div class="right-up-banner-left">' +
                data[0][1] +
                "%</div>" +
                '<div class="right-up-banner-right"><div><span>同比</span><div class="' +
                colorIcon1.color +
                '"><i class="glyphicon ' +
                colorIcon1.icon +
                '"></i><strong>' +
                Math.abs(data[0][2]) +
                '%</strong></div></div><div><span>环比</span><div class="' +
                colorIcon2.color +
                '"><i class="glyphicon ' +
                colorIcon2.icon +
                '"></i><strong>' +
                Math.abs(data[0][3]) +
                '%</strong></div></div><div><span>办理量</span><div class="banner-color3"><strong>' +
                data[0][4] +
                "</strong></div></div></div>"
            );
            data.map(function(value, index) {
              if (index > 0) {
                var img = "";
                var colorIcon1 = handleColorAndIcon(value[2]);
                var colorIcon2 = handleColorAndIcon(value[3]);
                switch (value[0]) {
                  case "户籍业务":
                    img = "hz";
                    break;
                  case "身份证业务":
                    img = "sfz";
                    break;
                  case "出入境业务":
                    img = "crj";
                    break;
                  case "驾证业务":
                    img = "cgjz";
                    break;
                  case "车辆业务":
                    img = "cgcl";
                    break;
                  case "监管业务":
                    img = "jg";
                    break;
                }
                var str;
                if (!isPcs) {
                  str =
                    '<div class="down-left" id="' +
                    img +
                    '-chart"></div><div class="down-right">' +
                    '<span>办理量</span><strong class="banner-color3">' +
                    value[4] +
                    "</strong></div>";
                } else {
                  str =
                    '<div class="down-left" style="width: 100%;"><strong style="color: #3286ff;">' +
                    value[1] +
                    '%</strong><span>全局：<span style="color: #3286ff;">' +
                    value[5] +
                    "%</span>&nbsp;&nbsp;&nbsp;" +
                    (value[6]
                      ? '排名：<span style="color: #3286ff;">' +
                        value[6] +
                        "</span>/12"
                      : "") +
                    "</span></div>";
                }
                var html =
                  '<div><div><div class="up-left"><img src="../../img/myhc/myzs/' +
                  img +
                  '.png"><span>' +
                  value[0] +
                  '</span></div><div class="up-right"><span>同比</span><i class="' +
                  colorIcon1.color +
                  " glyphicon " +
                  colorIcon1.icon +
                  '"></i><strong class="' +
                  colorIcon1.color +
                  '">' +
                  Math.abs(value[2]) +
                  '%</strong><span>环比</span><i class="' +
                  colorIcon2.color +
                  " glyphicon " +
                  colorIcon2.icon +
                  '"></i><strong class="' +
                  colorIcon2.color +
                  '">' +
                  Math.abs(value[3]) +
                  "%</strong></div></div><div>" +
                  str +
                  "</div>";
                $body.append(html);

                if (!isPcs) {
                  $("#" + img + "-chart").html(
                    '<strong style="color: #3286ff;">' + value[1] + "%</strong>"
                  );
                }
              }
            });
          }
        }
      );
    }

    // 初始化窗口面板
    function initCk() {
      $(".toolbar-panel3").hide();
      $(".right-panel-up")
        .show()
        .css("height", "60%");
      $(".right-panel-down")
        .show()
        .css("height", "40%");
      $(".right-panel-up-1").hide();
      $(".right-panel-up-2").hide();
      $(".right-panel-up-3").show();
      $(".right-panel-ck").hide();
      onLoad();
      map.off("mouseup");
      removeAllLayers();
      isLoadBounds = true;
      initCkBounds();
      // 初始化mark
      initCkMark();
      // 初始化右侧面板
      initCkRight();
    }

    // 窗口图层鼠标悬停事件
    function ckMouseoverEvent(e) {
      map.eachLayer(function(layer) {
        if (layer.options.fillOpacity == "0.55") {
          layer.setStyle({
            color: "#fff",
            fillOpacity: 0.45
          });
        }
        if (layer._leaflet_id == e.target._leaflet_id) {
          layer.setStyle({
            color: "#386AFB",
            fillOpacity: 0.55
          });
        }
      });
    }

    // 窗口图层鼠标移出事件
    function ckMouseoutEvent(e) {
      map.eachLayer(function(layer) {
        if (layer.options.fillOpacity == "0.55") {
          layer.setStyle({
            color: "#fff",
            fillOpacity: 0.45
          });
        }
      });
    }

    // 初始化窗口边界
    function initCkBounds(index) {
      if (isLoadBounds) {
        map.removeLayer(allFjLayerGroup);
        allFjLayerGroup = L.layerGroup();
        var sqlParam = new SuperMap.GetFeaturesBySQLParameters({
          queryParameter: {
            name: "gajg_pcszrq_3201_pg@ORCL_gt8",
            attributeFilter: "DWBM like '%000000' ",
            fields: ["DWBM", "DWMC"],
            orderBy: "DWBM"
          },
          datasetNames: ["ORCL_gt8:gajg_pcszrq_3201_pg"],
          toIndex: -1
        });
        var url =
          "http://10.33.66.183:2334/iserver/services/data-gt8/rest/data";
        L.supermap
          .featureService(url)
          .getFeaturesBySQL(sqlParam, function(serviceResult) {
            var resultData = serviceResult.result.features.features;
            map.setView(zoomArr[0].center, zoomArr[0].zoom);
            var colorArr = [
              "#66edda",
              "#eb5c64",
              "#66dc2b",
              "#ffb372",
              "#ffa78f",
              "#7FB5CD",
              "#F78EF7",
              "#005ec5",
              "#5bc5f0",
              "#61eddd",
              "#ffb553",
              "#5bc5f0",
              "#e37e6d"
            ];
            allFjLayerGroup = L.layerGroup();
            // 在添加之前置空
            resultData.map(function(val, index) {
              var resultLayer = L.polygon(
                changeLonAndLat(val.geometry.coordinates),
                {
                  color: "#fff",
                  fillOpacity: 0.45,
                  fillColor: colorArr[index],
                  weight: 3
                }
              );
              resultLayer.on({
                mouseover: ckMouseoverEvent,
                mouseout: ckMouseoutEvent
              });
              allFjLayerGroup.addLayer(resultLayer);
            });
            map.addLayer(allFjLayerGroup);
            isLoadBounds = false;
            if (syncPulse) {
              initPulse(index);
              syncPulse = false;
            }
          });
      }
    }

    // 根据图层等级刷新对于的layer
    function initLevelLayer() {
      switch (currentLevel) {
        case 0:
        case 1:
          loadHeatMap();
          break;
        case 2:
          loadMarkerCluster();
          break;
        case 3:
          initDataPanel($(".search-yw").val());
          break;
        case 4:
          initSearchPanel();
          break;
        case 5:
          initCk();
          break;
      }
    }

    // 移除所有图层
    function removeAllLayers() {
      map.eachLayer(function(layer) {
        if (layer._leaflet_id != mapLayer._leaflet_id) {
          map.removeLayer(layer);
        }
      });
    }

    // 初始化查询面板
    function initSearchPanel() {
      currentLevel = 4;
      removeAllLayers();
      initDataPanel($(".search-yw").val());
    }

    // 加载热力图
    function loadHeatMap() {
      if (!heatLayerGroup || heatLayerGroup.length != 0) {
        map.removeLayer(heatLayerGroup);
      }
      sugon.requestJson(
        {
          type: "post",
          url: sugon.interFaces.myzs.getMapData,
          data: {
            deptId: $("#placeCode").val(),
            date1: $("#date1").val(),
            date2: $("#date2").val(),
            type: $(".search-yw").val(),
            keyword: searchInput
          },
          async: true
        },
        function(result) {
          var maxLen = 25000;
          var len = result.data.length;
          result.data.map(function(val) {
            val[2] = (10 * maxLen) / len;
          });
          var heatLayer = [];
          heatLayer.push(
            L.heatLayer(result.data, {
              radius: 10,
              maxOpacity: 0.7,
              featureWeight: "value",
              gradient: {
                "0.3": "#fff",
                "0.4": "#31ff00",
                "0.8": "#f8ff00",
                "0.95": "#ff0500"
              }
            })
          );
          heatLayerGroup = L.layerGroup(heatLayer);
          map.addLayer(heatLayerGroup);
        }
      );
    }

    // 加载聚合图
    function loadMarkerCluster() {
      map.removeLayer(markerClusterGroup);
      markerClusterGroup = L.markerClusterGroup({
        spiderfyOnMaxZoom: false,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: false,
        singleMarkerMode: true
      });
      sugon.requestJson(
        {
          type: "post",
          url: sugon.interFaces.myzs.getMapData,
          data: {
            deptId: $("#placeCode").val(),
            date1: $("#date1").val(),
            date2: $("#date2").val(),
            type: $(".search-yw").val(),
            keyword: searchInput
          },
          async: true
        },
        function(result) {
          result.data.map(function(value) {
            markerClusterGroup.addLayer(L.marker(value));
          });
        }
      );
      markerClusterGroup.addTo(map);
    }

    // 加载工具
    function loadGj(index) {
      var defaultStyle = plotting.getDefaultStyle();
      defaultStyle.defaultFlag = true;
      defaultStyle.lineColor = "#ff0000";
      queryResult = [];
      drawControl.handler.disable();
      drawControl.handler.libID = 0;
      drawControl.handler.serverUrl = serverUrl;
      switch (index) {
        case "1":
          drawControl.handler.code = 26;
          break;
        case "2":
          drawControl.handler.code = 29;
          break;
        case "3":
          drawControl.handler.code = 32;
          break;
      }
      drawControl.handler.enable();
    }

    // 加载查询的echarts图
    function renderSearchChart() {
      var $panel = $(".search-pop-panel");
      if (isRenderSearchChart) {
        $panel.show();
      } else {
        $panel.hide();
      }
      sugon.requestJson(
        {
          type: "post",
          url: sugon.interFaces.myzs.getRightMidData,
          data: {
            deptId: $("#placeCode").val(),
            date1: $("#date1").val(),
            date2: $("#date2").val(),
            keyword: searchInput
          },
          async: true
        },
        function(result) {
          var data1 = result.data1;
          sqfxData = result.data2;
          data1.map(function(val, index) {
            $(".left-mid-amount")
              .eq(index)
              .html(val);
          });
          reRenderChart();
        }
      );
    }

    // 重新渲染echarts图
    function reRenderChart(index) {
      index = index || 1;
      var data = [];
      sqfxData.map(function(val) {
        if (val.dy == index) {
          data.push(val);
        }
      });
      var chart = echarts.init(document.getElementById("search-pop-chart"));
      var xData = [],
        yData = [],
        min = 0,
        max = 0,
        isSet,
        isShow = false,
        startValue = 0,
        endValue = 100;
      if (data.length == 0) {
        isSet = false;
        xData.push("无数据");
        yData.push(0);
      } else {
        min = Number(data[0].value);
        max = Number(data[0].value);
        isSet = true;
        for (var i = 0; i < data.length; i++) {
          min = Math.min(min, data[i].value);
          max = Math.max(max, data[i].value);
          xData.push(data[i].name);
          yData.push(data[i].value);
        }
      }
      if (data.length > 5) {
        isShow = true;
        endValue = Math.floor((5 / data.length) * 100);
      }

      var diff = (max - min) / 2;
      min = Number(min - diff).toFixed(2);
      max = Number(max + diff).toFixed(2);
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
          top: 0,
          bottom: "5%",
          right: 0,
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
                color: "#000"
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
            min: isSet ? min : "",
            max: isSet ? max : "",
            axisTick: { show: false },
            splitLine: {
              lineStyle: {
                color: "#d5d8e1"
              }
            },
            splitArea: { show: false },
            splitNumber: 5,
            axisLabel: {
              textStyle: {
                color: "#000"
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
      chart.setOption(option);
    }

    // 复位页面
    function resetPage(type, isSearch) {
      var searchYw = $(".search-yw");
      var searchGj = $(".search-gj");
      latLng = {};
      $(".toolbar-panel3").hide();
      map.off("click");
      $(".toolbar-panel3 > div").removeClass("toolbar-panel3-hover");
      if (!isSearch) {
        isRenderSearchChart = false;
        $(".search-pop-panel").hide();
        searchInput = "";
        $(".search-input").val("");
        searchYw.removeAttr("disabled");
        searchGj.removeAttr("disabled");
        onLoad("");
      }
      type = type || 0;
      searchYw.val(type);
      $(".analysis-btn").hide();
      isQuery = false;
      $(".toolbar-panel2").hide();
      $(".pop-rdwtfx").hide();
      $(".toolbar-panel2-pop").hide();
      searchGj.val(0);
      $(".toolbar-panel2 > div").removeClass("toolbar-panel2-hover");
      removeAllLayers();
      bounds = "";
      map.off("moveend");
      if (drawControl) {
        drawControl.handler.disable();
      }
      $(".right-panel-up-2").hide();
      $(".right-panel-up-3").hide();
      $(".right-panel-ck").hide();
      $(".right-panel-up-1").show();
      $(".right-panel-up")
        .show()
        .css("height", "70%");
      $(".right-panel-down").css("height", "30%");
      $(".data-panel").hide();
      queryGroup = L.layerGroup();
      map.setView(zoomArr[0].center, zoomArr[0].zoom);
      getAllFjData();
    }

    // 清除圈选页面
    function clearPage() {
      if (currentLevel == 3) {
        if (drawControl) {
          drawControl.handler.disable();
        }
        $(".search-gj").val(0);
        $(".data-panel").hide();
        map.removeLayer(queryGroup);
        queryGroup = L.layerGroup();
        map.removeLayer(queryPlottingLayer);
        $(".pop-rdwtfx").hide();
      }
      if (currentLevel == 5) {
        $(".right-panel-ck").hide();
        $(".toolbar-panel2 > div").removeClass("toolbar-panel2-hover");
        $(".toolbar-panel2-pop").hide();
        map.removeLayer(popMarkerGroup);
        initCk();
      }
      if ($(".toolbar-panel3").css("display") === "block") {
        $(".toolbar-panel3 > div").removeClass("toolbar-panel3-hover");
        latLng = {};
        ckMarkerGroups.map(val => {
          val && map.removeLayer(val);
        });
        ckCircleGroups.map(val => {
          val && map.removeLayer(val);
        });
      }
    }

    // 加载plot图
    function loadPlot() {
      serverUrl =
        "http://10.33.66.183:2334/iserver/services/plot-jingyong/rest/plot/";
      queryPlottingLayer = L.supermap.plotting.plottingLayer("plot", serverUrl);
      queryPlottingLayer.addTo(map);
      drawControl = L.supermap.plotting.drawControl(queryPlottingLayer);
      drawControl.addTo(map);
      plotting = L.supermap.plotting.getControl(map, serverUrl);
      loadSymbolLib();
    }

    function loadSymbolLib() {
      var symbolLibManager = plotting.getSymbolLibManager();
      symbolLibManager.libIDs = [421];
      symbolLibManager.on(
        SuperMap.Plot.Event.initializecompleted,
        symbolLibInitializeCompleted
      );
      symbolLibManager.initializeAsync();
      drawControl.on(SuperMap.Plot.Event.featureadded, function(event) {
        var layer = event.feature;
        var latLngs = layer.getLatLngs();
        var symbolType = layer.symbolType;
        // queryPlottingLayer.removeFeatures(layer);
        if (symbolType === SuperMap.Plot.SymbolType.ARBITRARYPOLYGONSYMBOL) {
          queryResult = L.supermap.plotting
            .query(map)
            .getGObjectsInPolygon(latLngs);
        }
        if (symbolType === SuperMap.Plot.SymbolType.CIRCLESYMBOL) {
          var radius = Math.sqrt(
            Math.pow(latLngs[1].lng - latLngs[0].lng, 2) +
              Math.pow(latLngs[1].lat - latLngs[0].lat, 2)
          );
          queryResult = L.supermap.plotting
            .query(map)
            .getGObjectsInCircle(latLngs[0], radius);
        }
        if (symbolType === SuperMap.Plot.SymbolType.RECTANGLESYMBOL) {
          queryResult = L.supermap.plotting
            .query(map)
            .getGObjectsInRect(latLngs[0], latLngs[1]);
        }
        if (queryResult && queryResult.length !== 0) {
          selectedData = [];
          queryResult.map(function(value1) {
            mapMarkData.map(function(value2) {
              if (value1.uuid == value2.ywid) {
                selectedData.push(value2);
              }
            });
          });
          isQuery = true;
          initDataPanel($(".search-yw").val());
        }
        drawControl.handler.disable();
        $(".search-gj").val(0);
      });
    }

    function symbolLibInitializeCompleted() {
      var libID = 421;
      var code = 20100;
      SuperMap.Plot.PlottingUtil.getDataFromServer(
        serverUrl,
        libID,
        code,
        null,
        {},
        null,
        function(res) {
          var newBounds = map.getBounds();
          if (!bounds || JSON.stringify(bounds) != JSON.stringify(newBounds)) {
            // 判断边界非空或者相等
            bounds = newBounds;
          }
          // 加载图形数据
          sugon.requestJson(
            {
              type: "post",
              url: sugon.interFaces.myzs.getMapDataByBounds,
              data: {
                northEast: JSON.stringify(bounds._northEast),
                southWest: JSON.stringify(bounds._southWest),
                date1: $("#date1").val(),
                date2: $("#date2").val(),
                type: $(".search-yw").val()
              },
              async: true
            },
            function(result) {
              mapMarkData = result.data;
              result.data.map(function(value) {
                var latLngs = [];
                latLngs.push(L.latLng(value.lat, value.lng));
                queryPlottingLayer.createSymbol(
                  libID,
                  code,
                  latLngs,
                  value.ywid,
                  {
                    color: "transparent"
                  },
                  { symbolData: res.result, serverUrl: serverUrl }
                );
              });
            }
          );
        },
        null
      );
    }

    // 打开窗口弹出框
    function openCkPopup(code, layer, type) {
      sugon.requestJson(
        {
          type: "post",
          url: sugon.interFaces.myzs.getCkDetail,
          data: {
            deptCode: code,
            date1: $("#date1").val(),
            date2: $("#date2").val()
          },
          async: true
        },
        function(result) {
          var data1 = result.data1,
            data2 = result.data2,
            titleData;
          var rightData = "",
            xData = [],
            yData = [],
            min = 0,
            max = 0,
            diff;
          if (data1 && data1.length > 0) {
            min = data1[0].value;
            max = data1[0].value;
          }
          data1.map(function(value) {
            if (value.type) {
              titleData = value;
            } else {
              min = Math.min(value.value, min);
              max = Math.max(value.value, max);
              xData.push(value.name);
              yData.push(value.value);
            }
          });
          diff = (max - min) / 2;
          min = Number(min - diff).toFixed(2);
          max = Number(max + diff).toFixed(2);

          if (min < 0) {
            min = 0;
          }
          if (max > 100) {
            max = 100;
          }

          data2.map(function(value, index) {
            rightData +=
              '<div><div title="' +
              value.content +
              '">' +
              (index + 1) +
              "、" +
              value.content +
              '</div><span code="' +
              value.code +
              '">（' +
              value.count +
              "）</span></div>";
          });
          var random = parseInt(Math.random() * 10000);
          var html =
            '<div class="pop-map-mark-header">满意度分析</div>' +
            '<div class="ck-pop-mark-body pop-map-mark-body"><div class="map-mark-left" ' +
            'id="marker-chart-' +
            random +
            '"></div><div class="map-mark-right"><div deptCode="' +
            code +
            '" class="map-mark-right-title"><span style="float: left;">本期热点问题：</span>' +
            '<span style="float: right;">问题量</span></div><div class="map-mark-right-body">' +
            rightData +
            "</div></div></div>";
          var popupOption = {};
          if (type == 1) {
            popupOption.offset = L.point(-48, -50);
          }
          layer
            .bindPopup(html, popupOption)
            .openPopup()
            .unbindPopup();

          var text =
            !titleData ||
            "{d|" +
              titleData.name +
              "}{a|满意度为}" +
              "{c|" +
              titleData.value +
              "%} {a|全市排名}{b|" +
              titleData.rank +
              "}";
          var option = {
            title: {
              show: !!titleData,
              text: text,
              left: "center",
              textStyle: {
                rich: {
                  a: {
                    fontSize: 13,
                    color: "#000"
                  },
                  b: {
                    fontSize: 13,
                    color: "#059978"
                  },
                  c: {
                    fontSize: 13,
                    color: "#dd3034"
                  },
                  d: {
                    fontSize: 13,
                    color: "#008AE2"
                  }
                }
              }
            },
            tooltip: {
              trigger: "axis",
              axisPointer: {
                type: "shadow"
              }
            },
            color: ["#008fef"],
            grid: {
              left: 0,
              top: "25%",
              right: 0,
              bottom: 20
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
                    color: "#000"
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
                show: false,
                min: min,
                max: max
              }
            ],
            series: [
              {
                type: "bar",
                barWidth: 20,
                data: data1,
                label: {
                  position: "top",
                  show: true,
                  fontSize: 16,
                  color: "#000",
                  align: "center",
                  lineHeight: 16,
                  formatter: function(param) {
                    var inc = "",
                      rank = param.data.rank
                        ? "{a|全局第}{c|" + param.data.rank + "}\n"
                        : "";
                    if (param.data.inc) {
                      if (param.data.inc > 0) {
                        inc = "{b|↑ " + param.data.inc + "名}";
                      } else if (param.data.inc == 0) {
                        inc = "{d|持平}";
                      } else {
                        inc = "{c|↓ " + Math.abs(param.data.inc) + "名}";
                      }
                      inc += "\n";
                    }

                    return rank + inc + "{a|" + param.data.value + "%}";
                  },
                  rich: {
                    a: {
                      color: "#000"
                    },
                    b: {
                      color: "#059978"
                    },
                    c: {
                      color: "#dd3034"
                    },
                    d: {
                      color: "#008AE2"
                    }
                  }
                }
              }
            ]
          };
          var chart = echarts.init(
            document.getElementById("marker-chart-" + random)
          );
          chart.setOption(option);
        }
      );
    }

    // 打开窗口闪烁图的弹出框
    function openCkPulsePopup(code, layer, type) {
      sugon.requestJson(
        {
          type: "post",
          url: sugon.interFaces.myzs.getCkfwqDetail,
          data: {
            deptCode: code,
            date1: $("#date1").val(),
            date2: $("#date2").val(),
            type: type
          },
          async: true
        },
        function(result) {
          var data = result.data;
          var xData = [],
            data1 = [],
            data2 = [],
            rightData = "",
            min = 0,
            max = 0,
            diff;
          if (data && data.length > 0) {
            min = data[0].qj;
            max = data[0].bdw;
          }
          data.map(function(value) {
            min = Math.min(value.qj, value.bdw, min);
            max = Math.max(value.qj, value.bdw, max);
            xData.push(value.name);
            data1.push(value.qj);
            data2.push(value.bdw);
            var colorIcon1 = handleColorAndIcon(value.tb),
              colorIcon2 = handleColorAndIcon(value.hb);
            rightData +=
              '<div class="map-mark-right-body-row"><div class="mark-header">' +
              value.name +
              '</div><div class="mark-body"><div><span style="float: left;">全局排名:' +
              '<span style="color: #008AE2;">' +
              value.qjpm +
              "</span></span>" +
              '<span style="float: right;">办理量:<span style="color: #008AE2;">' +
              value.bll +
              '</span></span></div><div><span style="float: left;">同比:<span class="' +
              colorIcon1.color +
              '"><i class="glyphicon ' +
              colorIcon1.icon +
              '"></i> ' +
              Math.abs(value.tb) +
              '%</span></span><span style="float: right;">环比:' +
              '<span class="' +
              colorIcon2.color +
              '"><i class="glyphicon ' +
              colorIcon2.icon +
              '"></i> ' +
              Math.abs(value.hb) +
              "%</span></span></div></div></div>";
          });
          diff = (max - min) / 2;
          min = Number(min - 5 * diff).toFixed(2);
          max = Number(max + diff).toFixed(2);
          if (max > 100) {
            max = 100;
          }
          if (min < 0) {
            min = 0;
          }
          var random = parseInt(Math.random() * 10000);
          var html =
            '<div class="pop-map-mark-header">满意度分析</div>' +
            '<div class="ck-pop-mark-body pop-map-mark-body"><div class="map-mark-right2" ' +
            'id="marker-chart-' +
            random +
            '"></div><div style="float: left;width: 50%">' +
            '<div class="map-mark-right-body2">' +
            rightData +
            "</div></div></div>";
          layer
            .bindPopup(html)
            .openPopup()
            .unbindPopup();
          var chart = echarts.init(
            document.getElementById("marker-chart-" + random)
          );
          var option = {
            tooltip: {
              show: true
            },
            legend: {
              data: ["全局", "本单位"],
              show: true
            },
            grid: {
              top: 60,
              right: 0,
              bottom: 0,
              left: 0,
              containLabel: true
            },
            xAxis: {
              type: "category",
              data: xData
            },
            yAxis: {
              type: "value",
              min: min,
              max: max
            },
            series: [
              {
                name: "全局",
                type: "bar",
                color: "#008fef",
                barGap: "5%",
                barWidth: 20,
                itemStyle: {
                  barBorderRadius: 2
                },
                data: data1
              },
              {
                name: "本单位",
                type: "bar",
                color: "#4cb676",
                barWidth: 20,
                itemStyle: {
                  barBorderRadius: 2
                },
                barGap: "5%",
                data: data2
              }
            ]
          };
          chart.setOption(option);
        }
      );
    }

    // 渲染标记点(便民服务圈和服务点)
    function renderMarks(data, index) {
      ckMarkerGroups[index] = L.layerGroup();
      var iconUrl = "../../img/myhc/myzs/";
      switch (index) {
        case 0:
          iconUrl += "hz_icon.png";
          break;
        case 1:
          iconUrl += "crj_icon.png";
          break;
        case 2:
          iconUrl += "cjg_icon.png";
          break;
      }
      var divIcon = L.icon({
        iconUrl: iconUrl,
        iconAnchor: [12, 10]
      });
      data.map(function(value) {
        if (index == 3) {
          iconUrl = "../../img/myhc/myzs/fwd_icon" + value.value + ".png";
          var mult = value.value < 3 ? 2 : 3;
          divIcon = L.icon({
            iconUrl: iconUrl,
            iconAnchor: [12 * mult, 10]
          });
        }
        var marker = L.marker([value.lat, value.lng], { icon: divIcon });
        marker.on({
          click: function() {
            openCkPulsePopup(value.code, marker, value.type);
          },
          mouseover: function() {
            map.removeLayer(popMarkerGroup);
            popMarkerGroup = L.layerGroup();
            var width = value.name.length * 16 + 30;
            var html =
              '<div class="pop-marker-bg" style="width: ' +
              width +
              'px;">' +
              value.name +
              "</div>";
            var popIcon = L.divIcon({
              html: html,
              iconAnchor: [width / 2, 60]
            });
            var popMarker = L.marker([value.lat, value.lng], { icon: popIcon });
            popMarkerGroup.addLayer(popMarker);
            popMarkerGroup.addTo(map);
          },
          mouseout: function() {
            map.removeLayer(popMarkerGroup);
            popMarkerGroup = L.layerGroup();
          }
        });
        ckMarkerGroups[index].addLayer(marker);
      });
      ckMarkerGroups[index].addTo(map);
    }

    // 加载闪烁图
    function initPulse(index) {
      sugon.requestJson(
        {
          type: "post",
          url: sugon.interFaces.myzs.getCkfwq,
          data: {
            type: index
          },
          async: true
        },
        function(result) {
          renderMarks(result.data, index);
        }
      );
    }

    // 查询功能
    function searchFunc() {
      var inputVal = $(".search-input").val();
      var reg = /\S/;
      if (reg.test(inputVal)) {
        $(".analysis-btn").hide();
        searchInput = inputVal;
        $(".keyword-search").html(
          '包含“<span style="color: #1d84c6;">' +
            searchInput +
            "</span>”的群众诉求共计："
        );
        var type = 0;
        var searchYw = $(".search-yw");
        var searchGj = $(".search-gj");
        searchYw.attr("disabled", "disabled").val(type);
        searchGj.attr("disabled", "disabled");
        sugon.requestJson(
          {
            type: "post",
            url: sugon.interFaces.myzs.getMapCount,
            async: false,
            data: {
              deptId: $("#placeCode").val(),
              date1: $("#date1").val(),
              date2: $("#date2").val(),
              type: type,
              keyword: searchInput
            }
          },
          function(result) {
            var totalCount = result.data[0].substring(
              result.data[0].indexOf("(") + 1,
              result.data[0].lastIndexOf(")")
            );
            if (totalCount < 50) {
              $(".search-pop-panel").hide();
              removeAllLayers();
              initDataPanel(type);
            } else {
              isRenderSearchChart = true;
              resetPage(type, true);
            }
          }
        );
      }
    }

    // 窗口右侧面板刷新
    function initCkRightMid(index) {
      let arr = [];
      $(".toolbar-panel2 > div").each((index, dom) => {
        if ($(dom).hasClass("toolbar-panel2-hover")) {
          arr.push(index);
        }
      });
      sugon
        .request(sugon.interFaces.myzs.getCkfwqZb, { type: arr.join(",") })
        .then(result => {
          $(".right-panel-down").hide();
          $(".right-panel-up").hide();
          $(".right-panel-ck").show();
          $(".ck-header-name").html(result.data1.name);
          $(".ck-header-value").html(result.data1.value);
          let $body = $(".ck-banner").empty();
          result.data2.map(val => {
            let imgName;
            switch (val.type) {
              case "1":
                imgName = "hz";
                break;
              case "2":
                imgName = "sfz";
                break;
              case "3":
                imgName = "crj";
                break;
              case "4":
                imgName = "cgcl";
                break;
              case "5":
                imgName = "cgjz";
                break;
            }
            $body.append(
              '<div><img src="../../img/myhc/myzs/' +
                imgName +
                '.png"><span>' +
                val.name +
                "：</span><strong>" +
                val.value +
                "</strong></div>"
            );
          });
          initCkRightBottom();
        });
    }

    // 初始化右下窗口
    function initCkRightBottom() {
      initCkfwqRybd();
      initCkfwqDwbd();
    }

    // 窗口服务圈人员榜单
    function initCkfwqRybd() {
      let condition = {
        type1: $("#type1").val(),
        type2: $("#type2").val(),
        type3: $("#type4").val(),
        date1: $("#date1").val(),
        date2: $("#date2").val()
      };
      sugon
        .request(sugon.interFaces.myzs.getCkfwqRybd, condition)
        .then(result => {
          let $body = $(".tab2").empty();
          result.data.map((val, index) => {
            $body.append(
              '<row><cell></cell><cell class="dept-name">' +
                (index + 1) +
                "、" +
                val.name +
                "</cell><cell>" +
                val.value +
                "</cell></row>"
            );
          });
        });
    }

    // 窗口服务圈单位榜单
    function initCkfwqDwbd() {
      let condition = {
        type1: $("#type1").val(),
        type2: $("#type2").val(),
        type3: $("#type3").val(),
        date1: $("#date1").val(),
        date2: $("#date2").val()
      };
      sugon
        .request(sugon.interFaces.myzs.getCkfwqDwbd, condition)
        .then(result => {
          let $body = $(".tab1").empty();
          result.data.map((val, index) => {
            $body.append(
              '<row><cell></cell><cell class="dept-name">' +
                (index + 1) +
                "、" +
                val.name +
                "</cell><cell>" +
                val.value +
                "</cell></row>"
            );
          });
        });
    }

    // 页面入口
    $(function() {
      // 加载数据接口
      onLoad("");
      // 加载地图
      createMapL();
      var mapParams = $.parseJSON(sessionStorage.getItem("mapParams"));
      if (mapParams != undefined && mapParams != null && mapParams != "") {
        $("#place").val(mapParams.codeName);
        $("#placeCode").val(mapParams.code);
      }
    });

    // 禁用全局右击事件
    $("#mainMap").bind("contextmenu", function() {
      return false;
    });

    // pop-ck-down-true点击事件
    document.addEventListener(
      "click",
      function(e) {
        var $target = $(e.target);
        if ($target.hasClass("pop-mid")) {
          e.stopPropagation();
          var $parent = $target.parent();
          var code = $parent.attr("code") || $parent.parent().attr("code");
          var codeExist = false,
            index;
          for (var key in ckGroup._layers) {
            if (
              ckGroup._layers[key].options.icon.options.html.indexOf(code) != -1
            ) {
              codeExist = true;
              index = key;
              break;
            }
          }
          if (codeExist) {
            map.eachLayer(function(layer) {
              if (layer._leaflet_id == index) {
                openCkPopup(code, layer, 1);
              }
            });
          }
        }
        if ($target.hasClass("pop-ck-down-true")) {
          e.stopPropagation();
          var code = $target.parent().attr("code");
          var subCode = code.substring(0, 6);
          map.removeLayer(ckGroup);
          map.closePopup();
          isLoadBounds = true;
          var sqlParam = new SuperMap.GetFeaturesBySQLParameters({
            queryParameter: {
              name: "gajg_pcszrq_3201_pg@ORCL_gt8",
              attributeFilter:
                "DWBM like '" + subCode + "%' and DWMC like '%派出所'",
              fields: ["DWBM", "DWMC"],
              orderBy: "DWBM"
            },
            datasetNames: ["ORCL_gt8:gajg_pcszrq_3201_pg"],
            toIndex: -1
          });
          var url =
            "http://10.33.66.183:2334/iserver/services/data-gt8/rest/data";
          L.supermap
            .featureService(url)
            .getFeaturesBySQL(sqlParam, function(serviceResult) {
              map.on("mouseup", function(e) {
                var which = e.originalEvent.which;
                if (which == 3) {
                  initCk();
                }
              });
              var data = serviceResult.result.features.features;
              if (data && data.length > 0) {
                map.removeLayer(ckBorderGroup);
                ckBorderGroup = L.layerGroup();
                data.map(function(val) {
                  var resultLayer = L.polygon(
                    changeLonAndLat(val.geometry.coordinates),
                    {
                      color: "#386AFB",
                      weight: 2,
                      fillOpacity: 0.15
                    }
                  );
                  ckBorderGroup.addLayer(resultLayer);
                });
                map.addLayer(ckBorderGroup);
                map.setZoom(12);
              }
            });
          // 刷新mark
          initCkMark(code, true);
          // 刷新右侧面板
          initCkRight(code, true);
        }
      },
      true
    );

    // 业务下拉框改变事件
    $(".search-yw").change(function() {
      var index = $(this).val();
      if (currentLevel == 5) {
        resetPage(index);
      } else {
        if (index == 4) {
          currentLevel = 5;
          $(".data-panel").hide();
          $(".toolbar-panel2").show();
          initCk();
        } else {
          initLevelLayer();
        }
      }
    });

    // 左下查询条件改变事件
    $(".data-panel-search").on("click", "div", function(e) {
      var $div = $(".data-panel-search > div");
      var index = $div.index(e.target);
      if (!$(e.target).hasClass("search-selected")) {
        $div.removeClass("search-selected");
        $(e.target).addClass("search-selected");
        initTab($(".search-yw").val(), "", index);
      }
    });

    // 数据panel关闭事件
    $(".data-panel-header > i").click(function() {
      $(".data-panel").hide();
    });

    // 画便民服务圈
    function drawCircle(index, lat, lng) {
      let radius;
      switch (index) {
        case 0:
          radius = 3000;
          break;
        case 1:
          radius = 6000;
          break;
        case 2:
          radius = 9000;
          break;
      }
      if (lat && lng) {
        ckCircleGroups[index] = L.circle([lat, lng], { radius });
        map.addLayer(ckCircleGroups[index]);
      }
    }

    // 获取便民服务圈
    function getBmfwq(typeArr) {
      let { lat, lng } = latLng;
      sugon
        .request(sugon.interFaces.myzs.getBmfwq, {
          lat,
          lng,
          type: typeArr.join(",")
        })
        .then(result => {
          typeArr.map(val => {
            val = val && Number(val);
            renderMarks(result.data[val], val);
            drawCircle(val, lat, lng);
          });
        });
    }

    // 工具切换时
    $(".search-gj").on("change", function() {
      var index = $(this).val(),
        $panel3 = $(".toolbar-panel3");
      if (index == 4) {
        removeAllLayers();
        $panel3
          .show()
          .off()
          .on("click", "div", function(e) {
            let $target = $(e.target),
              className = "toolbar-panel3-hover",
              targetIndex = $target.index(".toolbar-panel3 > div");
            if ($target.hasClass(className)) {
              $target.removeClass(className);
              ckMarkerGroups[targetIndex] &&
                map.removeLayer(ckMarkerGroups[targetIndex]);
              ckCircleGroups[targetIndex] &&
                map.removeLayer(ckCircleGroups[targetIndex]);
            } else {
              $target.addClass(className);
              if (ckCircleGroups.length > 0 && ckCircleGroups.length > 0) {
                getBmfwq([targetIndex]);
              }
            }
            let $hover = $(".toolbar-panel3-hover");
            if ($hover.length > 0) {
              map.off("click").on("click", function(e) {
                map.closePopup();
                ckMarkerGroups.map(val => {
                  val && map.removeLayer(val);
                  ``;
                });
                ckCircleGroups.map(val => {
                  val && map.removeLayer(val);
                });
                latLng = e.latlng;
                let typeArr = [];
                $hover.each((index, dom) => {
                  let indexOfDiv = $(dom).index(".toolbar-panel3 > div");
                  typeArr.push(indexOfDiv);
                });
                getBmfwq(typeArr);
              });
            } else {
              map.off("click");
            }
          });
      } else {
        $panel3.hide();
        map.off("click");
        $(".analysis-btn").show();
        $(".data-panel").hide();
        isLoadBounds = true;
        removeAllLayers();
        map.setZoom(16, { animate: false });
        var $searchYw = $(".search-yw");
        if ($searchYw.val() == 4) {
          $searchYw.val(0);
          $(".toolbar-panel2").hide();
          $(".toolbar-panel2-pop").hide();
        }

        // 绑定移动事件
        map.on("moveend", function() {
          if (currentLevel == 3) {
            if (drawControl) {
              drawControl.handler.disable();
            }
            $(".search-gj").val(0);
          }
        });
        currentLevel = 3;
        loadPlot();
        loadGj(index);
      }
    });

    // 清除按钮事件
    $(".search-clear").click(function() {
      clearPage();
    });

    // 复位按钮事件
    $(".search-reset").click(function() {
      resetPage();
    });

    // 查询按钮事件
    $(".search-btn").click(function() {
      searchFunc();
    });

    // 回车查询事件
    $(".search-input").on("keyup", function(e) {
      if (e.keyCode == 13) {
        searchFunc();
      }
    });

    // 左下tab点击事件
    $(".data-panel-tab").on("click", ".data-panel-tab-row", function(e) {
      var $target = $(e.target);
      $target = $target.hasClass("data-panel-tab-row")
        ? $target
        : $target.parent();
      var ywid = $target.attr("ywid");
      for (var key in queryGroup._layers) {
        if (queryGroup._layers[key]._popup._content.indexOf(ywid) > 0) {
          queryGroup._layers[key].openPopup();
        }
      }
    });

    // 分析按钮点击事件
    $(".analysis-btn").click(function() {
      var keywordArr = [],
        timesArr = [],
        idArr = {},
        result = [];
      selectedData.map(function(value) {
        var sqwtArr = (value.sqwt || "").split(",");
        sqwtArr.map(function(value1) {
          var index = keywordArr.indexOf(value1);
          if (index == -1 && value1) {
            timesArr[keywordArr.length] = 1;
            keywordArr.push(value1);
            idArr[value1] = idArr[value1] || [];
            idArr[value1].push(value.ywid);
          } else {
            if (value1) {
              timesArr[index]++;
            }
          }
        });
      });
      keywordArr.map(function(value, index) {
        var obj = { name: value, value: timesArr[index], id: idArr[value] };
        result.push(obj);
      });
      result.map(function(val1, i) {
        result.map(function(val2, j) {
          if (val1.value > val2.value) {
            var temp = result[i];
            result[i] = result[j];
            result[j] = temp;
          }
        });
      });
      var $container = $(".pop-rdwtfx");
      var $body = $('<div class="pop-map-mark-body"></div>');
      $container
        .show()
        .empty()
        .append(
          $(
            '<div class="pop-map-mark-header">区域热点问题<i class="glyphicon glyphicon-remove"></i></div>'
          )
        );
      var size = result.length < 4 ? result.length : 3;
      for (var i = 0; i < size; i++) {
        $body.append(
          '<p ywid="' +
            result[i].id +
            '">' +
            (i + 1) +
            "、该区域" +
            result[i].name +
            "问题较为突出。    " +
            result[i].value +
            "件</p>"
        );
      }
      $body.appendTo($container);
    });

    // 窗口toolbar点击事件
    $(".toolbar-panel2 > div").on("click", function() {
      var $this = $(this),
        index = $this.index(".toolbar-panel2 > div"),
        className = "toolbar-panel2-hover",
        $panel = $(".toolbar-panel2 > div");
      map.removeLayer(ckGroup);
      map.removeLayer(popMarkerGroup);
      map.removeLayer(ckBorderGroup);
      map.closePopup();
      popMarkerGroup = L.layerGroup();
      if (index === 3) {
        $panel.removeClass(className);
        $this.addClass(className);
        ckMarkerGroups.map(val => {
          map.removeLayer(val);
        });
        let $select = $("#type1").empty();
        $select
          .append('<option value="hj">户籍</option>')
          .append('<option value="sfz">身份证</option>')
          .append('<option value="cl">车辆</option>')
          .append('<option value="jz">驾证</option>')
          .append('<option value="crj">出入境</option>');
        initCkBounds(index);
        if (!syncPulse) {
          initPulse(index);
        }
        initCkRightMid();
      } else {
        let $select = $("#type1").empty();
        $panel.eq(3).removeClass(className);
        if (ckMarkerGroups[3]) {
          map.removeLayer(ckMarkerGroups[3]);
        }
        if ($this.hasClass(className)) {
          $this.removeClass(className);
          map.removeLayer(ckMarkerGroups[index]);
          let hasClass = false;
          $panel.each((index, dom) => {
            if ($(dom).hasClass(className)) {
              hasClass = true;
            }
          });
          hasClass ? initCkRightMid() : initCk();
        } else {
          $this.addClass(className);
          initCkBounds(index);
          if (!syncPulse) {
            initPulse(index);
          }
          initCkRightMid();
        }
        $panel.each((index, dom) => {
          if ($(dom).hasClass(className)) {
            switch (index) {
              case 0:
                $select
                  .append('<option value="hj">户籍</option>')
                  .append('<option value="sfz">身份证</option>');
                break;
              case 1:
                $select.append('<option value="crj">出入境</option>');
                break;
              case 2:
                $select
                  .append('<option value="cl">车辆</option>')
                  .append('<option value="jz">驾证</option>');
                break;
            }
          }
        });
      }
    });

    // type1改变事件
    $("#type1").on("change", function() {
      initCkRightBottom();
    });

    // type2改变事件
    $("#type2").on("change", function(e) {
      let value = $(e.target).val(),
        $type3 = $("#type3").empty(),
        $type4 = $("#type4").empty(),
        dom;
      if (value == "1") {
        dom =
          '<option value="0">满意度</option><option value="1">工单量</option>';
      } else {
        dom =
          '<option value="0">满意度</option><option value="1">业务量</option>';
      }
      $type3.append(dom);
      $type4.append(dom);
      initCkRightBottom();
    });

    function openCkfwqRankPopup(isDept, e) {
      let value = $(e.target)
          .find("option:selected")
          .text(),
        className;
      className = isDept ? "tab1" : "tab2";
      if (value == "工单量") {
        $("." + className).on("click", "row", function() {
          let $this = $(this);
          let condition = {
            type1: $("#type1").val(),
            type2: Number(!isDept),
            name: $this.find(".dept-name").html(),
            date1: $("#date1").val(),
            date2: $("#date2").val()
          };
          sugon
            .request(sugon.interFaces.myzs.getCkfwqRankPopup, condition)
            .then(result => {
              let str = "",
                data = result.data;
              str +=
                '<div class="map-mark-right-pop-header"><div class="pop-col1">工单编号</div>' +
                '<div class="pop-col2">姓名</div><div class="pop-col6">电话</div>' +
                '<div class="pop-col7">回访内容</div></div>';
              data.map(function(value) {
                str +=
                  '<div><div class="pop-col1">' +
                  value.gdbh +
                  '</div><div class="pop-col2">' +
                  value.xm +
                  '</div><div class="pop-col6">' +
                  value.dh +
                  '</div><div title="' +
                  value.hfnr +
                  '" class="pop-col7">' +
                  value.hfnr +
                  "</div></div>";
              });
              let ele = '<div class="map-mark-right-pop">' + str + "</div>";
              sugon.renderDialog({
                width: 560,
                height: 300,
                ele: ele,
                title: "工单详情"
              });
            });
        });
      } else {
        $(".tab1").off("click");
      }
    }

    // type3改变事件
    $("#type3").on("change", function(e) {
      initCkfwqDwbd();
      openCkfwqRankPopup(true, e);
    });

    // type4改变事件
    $("#type4").on("change", function(e) {
      initCkfwqRybd();
      openCkfwqRankPopup(false, e);
    });

    // 热点问题分析弹出页关闭事件
    $(".pop-rdwtfx").on("click", ".pop-map-mark-header > i", function() {
      $(".pop-rdwtfx").hide();
    });

    // 分析弹出页点击事件
    $(".pop-rdwtfx").on("click", ".pop-map-mark-body > p", function() {
      var $this = $(this);
      var idArr = $this.attr("ywid").split(",");
      map.eachLayer(function(layer) {
        if (layer._popup) {
          var content = layer._popup._content;
          idArr.map(function(val) {
            if (content.indexOf(val) > -1) {
              if (layer.setIcon) {
                layer.setIcon(
                  L.icon({
                    iconUrl: "../../img/myhc/myzs/location_selected.png",
                    popupAnchor: [10, 5]
                  })
                );
              }
            }
          });
        }
      });
    });

    // 弹出页的点击事件
    $("#mainMap").on("click", ".map-mark-right-body > div > span", function() {
      var deptCode = $(".map-mark-right-title").attr("deptCode");
      var code = $(this).attr("code");
      sugon.requestJson(
        {
          type: "post",
          url: sugon.interFaces.myzs.getCkRdwtDetail,
          data: {
            deptCode: deptCode,
            date1: $("#date1").val(),
            date2: $("#date2").val(),
            code: code
          },
          async: true
        },
        function(result) {
          var str = "",
            data = result.data;
          str +=
            '<div class="map-mark-right-pop-header"><div class="pop-col1">工单编号</div><div class="pop-col2">姓名</div><div class="pop-col3">电话</div><div class="pop-col4">工单类别</div><div class="pop-col5">回访内容</div></div>';
          data.map(function(value) {
            str +=
              '<div><div class="pop-col1">' +
              value.gdbh +
              '</div><div class="pop-col2">' +
              value.xm +
              '</div><div class="pop-col3">' +
              value.dh +
              '</div><div class="pop-col4">' +
              value.gdlb +
              '</div><div title="' +
              value.hfnr +
              '" class="pop-col5">' +
              value.hfnr +
              "</div></div>";
          });
          var ele = '<div class="map-mark-right-pop">' + str + "</div>";
          sugon.renderDialog({
            width: 560,
            height: 300,
            ele: ele,
            title: "工单详情"
          });
        }
      );
    });

    // 切换事件
    $(".search-pop-nav > div").on("click", function() {
      var className = "search-nav-selected",
        $this = $(this);
      if (!$this.hasClass(className)) {
        $(".search-pop-nav > div").removeClass(className);
        $this.addClass(className);
        reRenderChart($this.index(".search-pop-nav > div") + 1);
      }
    });
  }
);
