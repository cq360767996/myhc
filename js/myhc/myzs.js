requirejs(
  ["common", "L", "ec", "iclient", "heat", "markerCluster", "plot"],
  (sugon, L, echarts) => {
    // 全局查询尺度
    let searchRuler = {};
    // 单位情况数据缓存
    let dwqkData = [],
      tData = [],
      sqfxData = []; // 诉求分析数据;
    let initList = function() {
      let date = "";
      let { deptCode, role } = sugon.identityInfo;
      sugon.requestJson(
        {
          type: "POST",
          url: sugon.interFaces.common.getDeptTree,
          data: { deptCode, role },
          async: false
        },
        function(result) {
          date = result.data;
        }
      );
      return date;
    };

    function onLoad(param) {
      let date = !param ? initList() : param;
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
      $("#date1").val(sugon.getDate(-6));
      $("#date2").val(sugon.getDate(-1));
    }

    //获取树数据
    function getTree(param, isAsync) {
      let treeData = [];
      let { deptCode, role } = sugon.identityInfo;
      sugon.requestJson(
        {
          type: "POST",
          url: sugon.interFaces.common.getDeptTree,
          data: { deptCode, role, date: param },
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
        let $control = $(".search-control").val();
        if ($control == "1") {
          initSideData();
          initLevelLayer();
        } else {
          sugon
            .request(sugon.interFaces.myhc.myzs.DeptId, {
              deptId: $("#placeCode").val()
            })
            .then(result => {
              switch (currentLevel) {
                case 0:
                  if ($(".search-yw2").val() == 3) {
                    initCk();
                  } else {
                    initMyzs();
                  }
                  break;
                case 1:
                  getPcsDataByFjCode(result.CODE, true);
                  break;
                case 2:
                  getZrqDataByPcsCode(result.CODE, true);
                  break;
                case 3:
                  getDataByZrqCode(result.CODE, true);
                  break;
              }
            });
        }
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
        let $control = $(".search-control").val();
        if ($control == "1") {
          initSideData();
          initLevelLayer();
        } else {
          sugon
            .request(sugon.interFaces.myhc.myzs.DeptId, {
              deptId: $("#placeCode").val()
            })
            .then(result => {
              switch (currentLevel) {
                case 0:
                  initMyzs();
                  break;
                case 1:
                  getPcsDataByFjCode(result.CODE, true);
                  break;
                case 2:
                  getZrqDataByPcsCode(result.CODE, true);
                  break;
                case 3:
                  getDataByZrqCode(result.CODE, true);
                  break;
              }
            });
        }
      });

    // 获取左侧上部数据
    let getRightUpData = function() {
      let condition = {
        dept: $("#placeCode").val(),
        date1: $("#date1").val(),
        date2: $("#date2").val()
      };
      let ajaxObj = {
        url: sugon.interFaces.myhc.myzs.getLeftData,
        type: "post",
        data: condition,
        async: true
      };
      sugon.requestJson(ajaxObj, function(result) {
        let $div = $(".right-amount1");
        for (let i = 0; i < $div.length; i++) {
          $div.eq(i).html(result.data[i]);
        }
      });
    };

    // 获取左侧中间数据
    let getRightMidData = function() {
      let condition = {
        deptId: $("#placeCode").val(),
        date1: $("#date1").val(),
        date2: $("#date2").val()
      };
      let ajaxObj = {
        url: sugon.interFaces.myhc.myzs.getRightMidData,
        type: "post",
        data: condition,
        async: true
      };
      sugon.requestJson(ajaxObj, function(result) {
        let data1 = result.data1,
          data2 = result.data2;
        let $div = $(".right-mid-amount");
        data1.map(function(value, index) {
          $div.eq(index).html(value);
        });
        let chart = echarts.init(document.getElementById("right-banner-chart"));
        let option = {
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
    let getRightDownData = function() {
      let condition = {
        deptId: $("#placeCode").val(),
        date1: $("#date1").val(),
        date2: $("#date2").val()
      };
      let ajaxObj = {
        url: sugon.interFaces.myhc.myzs.getRightData,
        type: "post",
        data: condition,
        async: true
      };
      sugon.requestJson(ajaxObj, function(result) {
        let data = result.data;
        let $body = $(".right-panel-body");
        $body.empty();
        for (let i = 0; i < data.length; i++) {
          $body.append(
            '<div title="' +
              data[i].name +
              '">' +
              (i + 1) +
              "、" +
              data[i].name +
              "</div>"
          );
        }
      });
    };

    // 初始化两侧数据
    let initSideData = function() {
      // 加载右上侧数据
      getRightUpData();
      // 加载右中间数据
      getRightMidData();
      // 加载右下侧数据
      getRightDownData();
    };

    // 指标组成接口调用
    let getZbzc = function() {
      let condition = {
        deptId: $("#placeCode").val(),
        date1: $("#date1").val(),
        date2: $("#date2").val()
      };
      let ajaxObj = {
        url: sugon.interFaces.myhc.myzs.getZbzc,
        type: "post",
        data: condition,
        async: true
      };
      sugon.requestJson(ajaxObj, function(result) {
        let data = result.data;
        let data1 = [],
          data2 = [];
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < data[i].length; j++) {
            if (j == 0) {
              data1.push(data[i][j]);
            } else {
              data2.push(data[i][j]);
            }
          }
        }
        for (let i = 0; i < data1.length; i++) {
          $(".cell-color" + (i + 1)).html(data1[i]);
        }
        for (let i = 0; i < data2.length; i++) {
          $(".cell-color")
            .eq(i)
            .html(data2[i]);
        }
      });
    };

    // 执法公信力走势分析接口调用
    let getZfgxl = function() {
      let condition = {
        deptId: $("#placeCode").val(),
        date1: $("#date1").val(),
        date2: $("#date2").val()
      };
      let ajaxObj = {
        url: sugon.interFaces.myhc.myzs.getZfgxl,
        type: "post",
        data: condition,
        async: true
      };
      sugon.requestJson(ajaxObj, function(result) {
        renderZfgxl(result.data);
      });
    };

    // 渲染执法公信力走势分析echarts图
    let renderZfgxl = function(data) {
      let xData = [],
        yData = [],
        min = 0,
        max = 0;
      if (data && data.length > 0) {
        min = Number(data[0].value);
        max = Number(data[0].value);
      }
      for (let i = 0; i < data.length; i++) {
        xData.push(data[i].name);
        yData.push(data[i].value);
        min = Math.min(min, Number(data[i].value));
        max = Math.max(max, Number(data[i].value));
      }
      min = Number(min - (max - min) / 2).toFixed(2);
      max = Number(max + (max - min) / 2).toFixed(2);
      let chart = echarts.init(document.getElementById("pop-chart1"));
      let option = {
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
    let getDwqk = function() {
      let condition = {
        deptId: $("#placeCode").val(),
        date1: $("#date1").val(),
        date2: $("#date2").val()
      };
      let ajaxObj = {
        url: sugon.interFaces.myhc.myzs.getDwqk,
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
    let renderDwqk = function(data) {
      let xData = [],
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
      for (let i = 0; i < data.length; i++) {
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
      let chart = echarts.init(document.getElementById("pop-chart2"));
      let option = {
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
                let tempStr = "";
                if (param.length > 4) {
                  for (let i = 0; i < param.length; i++) {
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

    let renderMyd = function(data) {
      let xData = [],
        symbolData = [];
      data.map(function(val) {
        let obj = { value: val.value, symbolPosition: "end", id: val.id };
        xData.push(val.name);
        symbolData.push(obj);
      });
      let chart = echarts.init(document.getElementById("pop2-chart"));
      let option = {
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
              let tempStr = "";
              if (param.length > 4) {
                for (let i = 0; i < param.length; i++) {
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
    let initPopPage = function() {
      getZbzc();
      getZfgxl();
      getDwqk();
    };

    // 初始化第二弹出页
    let initPopPage2 = function() {
      sugon.requestJson(
        {
          type: "post",
          url: sugon.interFaces.myhc.myzs.getMyd,
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
    let initPopSetting1 = function() {
      sugon.requestJson(
        {
          type: "post",
          url: sugon.interFaces.myhc.myzs.getSjlr,
          data: { date: $("#pop-date1").val() },
          async: true
        },
        function(result) {
          result.data.map(function(val1, i) {
            val1.map(function(val2, j) {
              let index = i * 12 + j;
              $(".tab-cell > input")
                .eq(index)
                .val(val2);
            });
          });
        }
      );
    };

    let initPopSetting2 = function(isRest) {
      sugon.requestJson(
        {
          type: "post",
          url: isRest
            ? sugon.interFaces.myhc.myzs.resetXspz
            : sugon.interFaces.myhc.myzs.getXspz,
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

    let initPopSetting3 = function(isRest) {
      sugon.requestJson(
        {
          type: "post",
          url: isRest
            ? sugon.interFaces.myhc.myzs.resetZspz
            : sugon.interFaces.myhc.myzs.getZspz,
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
    let submitPopSetting1 = function() {
      let arr = [];
      // 写入数据
      for (let i = 0; i < 13; i++) {
        let innerArr = [];
        for (let j = 0; j < 12; j++) {
          let index = i * 12 + j;
          let str = $(".tab-cell > input")
            .eq(index)
            .val();
          innerArr.push(str);
        }
        arr.push(innerArr);
      }
      let condition = {
        time: $("#pop-date1").val(),
        data: JSON.stringify(arr)
      };
      sugon.requestJson(
        {
          type: "post",
          url: sugon.interFaces.myhc.myzs.submitSjlr,
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
    let submitPopSetting2 = function() {
      let arr = [];
      // 写入数据
      for (let i = 0; i < $(".right-tab1 > div > input").length; i++) {
        arr.push(
          $(".right-tab1 > div > input")
            .eq(i)
            .val()
        );
      }
      let condition = {
        time: $("#pop-date2").val(),
        data: JSON.stringify(arr)
      };
      sugon.requestJson(
        {
          type: "post",
          url: sugon.interFaces.myhc.myzs.submitXspz,
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
    let submitPopSetting3 = function() {
      let data = [];
      let condition = {
        deptId: $("#pop-dept-id").val(),
        date1: $("#pop-date3").val(),
        date2: $("#pop-date4").val()
      };
      let $inputArr = $(".right-tab2 > div > input");
      for (let i = 0; i < $inputArr.length; i++) {
        data.push($inputArr.eq(i).val());
      }
      condition.data = JSON.stringify(data);
      sugon.requestJson(
        {
          type: "post",
          url: sugon.interFaces.myhc.myzs.submitZspz,
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
      let condition = {};
      let data = [];
      let $inputArr = $(".right-tab2 > div > input");
      for (let i = 0; i < $inputArr.length; i++) {
        data.push($inputArr.eq(i).val());
      }
      condition.data = JSON.stringify(data);
      sugon.requestJson(
        {
          type: "post",
          url: sugon.interFaces.myhc.myzs.calcZspz,
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
      let index = $(this).index();
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
      let $this = $(this);
      let index = $this.index();
      if (!$this.hasClass("nav-selected")) {
        $(".nav-selected").removeClass("nav-selected");
        $this.addClass("nav-selected");
        renderDwqk(dwqkData[index]);
      }
    });

    // 云搜查询事件监听
    $(".input-group-btn").click(function() {
      let value = $(".search-box").val();
      if (value) {
        window.parent.location.href = sugon.server + "#myys/ysxq?txt=" + value;
      }
    });

    // 折叠按钮点击事件
    $(".fold-btn").click(function() {
      $(".select-tab").hide();
      let rightPanel = $(".right-panel");
      let foldBtn = $(".fold-img");
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
      let $selectTab = $(".select-tab");
      let $this = $(this);
      let position = $this.offset();
      let display = $selectTab.css("display");
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
      let index = $(this).index();
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
      let position = $(this).offset();
      let $tree = $("#left-tree");
      $tree
        .css("visibility", "visible")
        .css("left", position.left + "px")
        .css("top", position.top + 25 + "px")
        .width("200px");
    });

    // 鼠标经过显示
    $(".body-row-body").mouseover(function(e) {
      let $this = $(this);
      let index = $this.index(".body-row-body");
      $(".inner-pop-panel").show();
      sugon.requestJson(
        {
          type: "post",
          url: sugon.interFaces.myhc.myzs.getZbzcDetail,
          data: {
            type: index,
            deptId: $("#placeCode").val(),
            date1: $("#date1").val(),
            date2: $("#date2").val()
          },
          async: true
        },
        function(result) {
          let $ul = $(".inner-pop-panel > ul");
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

    let map;
    // 分别记录分局、派出所、责任区的zoom、上级code、center
    let zoomArr = [
        { zoom: 10, upDeptCode: "", center: [32.03613281, 118.78211975] }
      ],
      mapLayer = [];
    let allFjLayerGroup = L.layerGroup(),
      allFjMarkerGroup = L.layerGroup(); // 所有分局layer相关数据
    let pcsLayerGroup = L.layerGroup(),
      pcsMarkerGroup = L.layerGroup(); // 派出所layer相关数据
    let zrqLayerGroup = L.layerGroup(),
      zrqMarkerGroup = L.layerGroup(); // 责任区layer相关数据
    let singleZrqLayerGroup = L.layerGroup(),
      singleZrqMarkerGroup = L.layerGroup(); // 单个责任区layer相关数据
    let heatLayerGroup = [],
      currentLevel = ""; // 聚合点数据
    let markerClusterGroup = L.markerClusterGroup({
        spiderfyOnMaxZoom: false,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: false,
        singleMarkerMode: true
      }),
      queryGroup = L.layerGroup(),
      mapMarkData = [],
      hiddenMapMarkData = [];
    let searchInput,
      ckGroup = L.layerGroup(); // 1、输入框文本；2、窗口图层group

    // 圈选相关变量
    let serverUrl, queryPlottingLayer, drawControl, plotting;
    let bounds,
      queryResult = [],
      selectedData = [],
      hiddenSelectedData = [],
      isQuery; // 圈选的数据
    let ckMarkerGroups1 = L.layerGroup(),
      ckMarkerGroups2 = [],
      ckCircleGroups = L.layerGroup(),
      centerMarker,
      latLng; // 窗口mark，窗口圆，圆心点mark，圆心经纬度
    let popMarkerGroup = L.layerGroup(); // 随机跳动的计时器，弹出marker组
    let ckBorderGroup = L.layerGroup(),
      isLoadBounds = true,
      syncPulse = false; // 窗口的边界图层，窗口页面是否加载边界
    let isRenderSearchChart = false; // 是否渲染查询的echarts图
    let fjData = [
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
    let rdwtData = {},
      selected_ywid; // 1.热点问题数据 2.选中的业务id
    let sjPcsData; // 市局派出所数据
    let timer; // 热力图的计时器
    // 创建地图
    function createMapL() {
      // 创建地图
      map = L.map("mainMap", {
        crs: L.CRS.EPSG4326,
        preferCanvas: false,
        center: [32.03613281, 118.78211975],
        maxZoom: 18,
        minZoom: 10,
        zoom: 10,
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
      // getAllFjData();
      initMyzs();
    }

    //初始化地图数据 绘制出所有的分局
    function getAllFjData() {
      $(".leaflet-marker-icon").remove();
      removeAllLayers();
      $(".right-panel-panel2").hide();
      $(".right-panel-panel").show();
      currentLevel = 0;
      let sqlParam = new SuperMap.GetFeaturesBySQLParameters({
        queryParameter: {
          name: "gajg_pcszrq_3201_pg@ORCL_gt8",
          attributeFilter: "DWBM like '%000000' ",
          fields: ["DWBM", "DWMC"],
          orderBy: "DWBM"
        },
        datasetNames: ["ORCL_gt8:gajg_pcszrq_3201_pg"],
        toIndex: -1
      });
      let url = "http://10.33.66.183:2334/iserver/services/data-gt8/rest/data";
      L.supermap
        .featureService(url)
        .getFeaturesBySQL(sqlParam, function(serviceResult) {
          let resultData = serviceResult.result.features.features;
          map.setView(zoomArr[0].center, zoomArr[0].zoom);
          allFjLayerGroup = L.layerGroup();
          allFjMarkerGroup = L.layerGroup();
          // 在添加之前置空
          resultData.map(function(val) {
            let resultLayer = L.polygon(
              changeLonAndLat(val.geometry.coordinates),
              {
                color: "#386AFB",
                fillOpacity: 0,
                className: "fj-layer",
                weight: 1,
                code: val.properties.DWBM
              }
            );
            let center = L.latLngBounds(
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
              url: sugon.interFaces.myhc.myzs.DeptId,
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
            }
          );
          // 加载热力图
          loadHeatMap();
          map.addLayer(allFjLayerGroup);
          fjData.map(function(val) {
            let len = val.name.length * 16 + 30;
            let divIcon = L.divIcon({
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
            let marker = L.marker([val.lat, val.lng], { icon: divIcon });
            allFjMarkerGroup.addLayer(marker);
          });
          map.addLayer(allFjMarkerGroup);
        });
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
          let $div = $('div.bubblefj[code="' + e.target.options.code + '"]');
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

    // 民意指数鼠标移入事件
    function myzsMouseoverEvent(e) {
      map.eachLayer(function(layer) {
        if (layer.options.weight == 3) {
          layer.setStyle({
            color: "#386AFB",
            fillOpacity: 0.15,
            weight: 2
          });
        }
        if (layer._leaflet_id == e.target._leaflet_id) {
          let $div = $(
            'div.bubble-marker[code="' + e.target.options.code + '"]'
          );
          $div.stop().animate({ top: "5px" }, 200, function() {
            $div.stop().animate({ top: "0" }, 200);
          });
          layer.setStyle({
            weight: 3,
            fillOpacity: 0.3
          });
        }
      });
    }

    // 民意指数鼠标移出事件
    function myzsMouseoutEvent() {
      map.eachLayer(function(layer) {
        if (layer.options.weight == 3) {
          layer.setStyle({
            color: "#386AFB",
            fillOpacity: 0.15,
            weight: 2
          });
        }
      });
    }

    // 单位层级由0 ==》 1
    function level021(deptCode, upDeptCode, center, isMyzs) {
      let zoomArrObj = {};
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
          url: sugon.interFaces.myhc.myzs.DeptId,
          async: false,
          data: { deptCode: deptCode }
        },
        function(result) {
          $("#place").val(result.NAME);
          $("#placeCode").val(result.ID);
        }
      );
      if (isMyzs) {
        getPcsDataByFjCode(deptCode, true);
      } else {
        // 根据分局code获取所有派出所数据
        getPcsDataByFjCode(deptCode);
        $(".fj-icon").hide();
        // 初始化左右两侧数据
        initSideData();
      }
    }

    // 单位层级由1 ==》 2
    function level122(deptCode, upDeptCode, center, isMyzs) {
      let zoomArrObj = {};
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
          url: sugon.interFaces.myhc.myzs.DeptId,
          async: false,
          data: { deptCode: deptCode }
        },
        function(result) {
          $("#place").val(result.NAME.replace(result.UP_NAME, ""));
          $("#placeCode").val(result.ID);
        }
      );
      sugon.requestJson(
        {
          type: "post",
          async: true,
          url: sugon.interFaces.myhc.myzs.getPcsZb,
          data: {
            deptId: $("#placeCode").val(),
            date1: $("#date1").val(),
            date2: $("#date2").val()
          }
        },
        function(result) {
          let $body = $(".right-panel-up-2");
          let nameArr = [
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
              let html =
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
      if (isMyzs) {
        getZrqDataByPcsCode(deptCode, true);
      } else {
        // 隐藏热力图层
        map.removeLayer(heatLayerGroup);
        // 隐藏左右两侧页面
        $(".right-panel-up")
          .show()
          .css("height", "50%");
        $(".right-panel-down").css("height", "50%");
        $(".right-panel-up-1").hide();
        $(".right-panel-up-2").show();
        loadMarkerCluster();
        // 根据派出所code获取责任区数据
        getZrqDataByPcsCode(deptCode);
      }
    }

    // 单位层级由2 ==》 3
    function level223(deptCode, isMyzs) {
      // 隐藏左右两侧页面
      $(".right-panel-up").hide();
      $(".right-panel-down").css("height", "100%");
      $(".pcs-icon").hide();
      $(".pcs-layer").hide();
      // 根据部门code获取部门id，并写入sessionStorage
      sugon.requestJson(
        {
          type: "POST",
          url: sugon.interFaces.myhc.myzs.DeptId,
          async: false,
          data: { deptCode: deptCode }
        },
        function(result) {
          $("#place").val(result.NAME);
          $("#placeCode").val(result.ID);
        }
      );
      // 初始化数据panel
      !isMyzs && initDataPanel($(".search-yw").val());
      // 根据派出所code获取责任区数据
      getDataByZrqCode(deptCode, isMyzs);
    }

    //处理geometry数据数组中经纬度 与 leaflet.js API中构建polygon(纬，经)矛盾
    function changeLonAndLat(arr) {
      let result = [];
      for (let k = 0; k < arr.length; k++) {
        let arr1 = [];
        for (let i = 0; i < arr[k].length; i++) {
          let arr2 = [];
          for (let j = 0; j < arr[k][i].length; j++) {
            let arr3 = [];
            let temp = arr[k][i][j][0];
            let t1 = arr[k][i][j][0];
            let t2 = arr[k][i][j][1];
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

    // 诉求分布的派出所页面
    function renderSqfbPcsPage(resultData) {
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
        let resultLayer = L.polygon(changeLonAndLat(val.geometry.coordinates), {
          color: "#386AFB",
          fillOpacity: 0,
          className: "fj-layer",
          weight: 1,
          code: val.properties.DWBM
        });
        let center = L.latLngBounds(
          changeLonAndLat(val.geometry.coordinates)
        ).getCenter();
        let len = val.properties.DWMC.length * 16 + 30;
        let divIcon = L.divIcon({
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
        let marker = L.marker(center, { icon: divIcon });
        resultLayer.on({
          mouseover: mouseoverEvent,
          mouseout: mouseoutEvent,
          click: function() {
            let deptCode = val.properties.DWBM;
            level122(deptCode, deptCode, center);
          },
          mouseup: function(e) {
            let which = e.originalEvent.which;
            let deptCode = val.properties.DWBM;
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
                  url: sugon.interFaces.myhc.myzs.DeptId,
                  async: false,
                  data: { deptCode: deptCode }
                },
                function(result) {
                  $("#place").val(result.UP_NAME);
                  $("#placeCode").val(result.UP_ID);
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
    }

    // 民意指数派出所页面
    function renderMyzsPcsPage(resultData) {
      let condition = {
        deptId: $("#placeCode").val(),
        date1: $("#date1").val(),
        date2: $("#date2").val(),
        type: $(".search-yw2").val()
      };
      sugon
        .request(sugon.interFaces.myhc.myzs.getYlldMapData, condition)
        .then(result => {
          $(".search-down-panel > button")
            .removeAttr("class")
            .addClass("animate-btn-start");
          clearInterval(timer);
          map.setView(zoomArr[1].center, zoomArr[1].zoom);
          // 清空map上的分局数据
          map.removeLayer(allFjLayerGroup);
          map.removeLayer(allFjMarkerGroup);
          map.removeLayer(heatLayerGroup);
          allFjLayerGroup = L.layerGroup();
          allFjMarkerGroup = L.layerGroup();
          heatLayerGroup = L.layerGroup();

          map.removeLayer(pcsLayerGroup);
          map.removeLayer(pcsMarkerGroup);
          pcsLayerGroup = L.layerGroup();
          pcsMarkerGroup = L.layerGroup();
          let data = [];
          // 热力图数据
          let heatMapData = [];
          resultData.map(val1 => {
            let center = L.latLngBounds(
                changeLonAndLat(val1.geometry.coordinates)
              ).getCenter(),
              obj = {
                code: val1.properties.DWBM,
                name: val1.properties.DWMC,
                lat: center.lat,
                lng: center.lng,
                data: val1.geometry.coordinates,
                type: "2",
                layerType: "0",
                value: ""
              };
            result.data.map(val2 => {
              if (obj.code == val2.code) {
                obj.value = val2.value;
                obj.type = val2.type;
              }
            });
            sjPcsData.map(val2 => {
              if (obj.code == val2.code) {
                obj.layerType = val2.type;
                if (val2.type == 5) {
                  val2.latlng.map((val, index) => {
                    if (!heatMapData[index]) {
                      heatMapData[index] = [];
                    }
                    heatMapData[index].push(...val);
                  });
                }
              }
            });
            data.push(obj);
          });
          // 在添加之前置空
          data.map(function(val) {
            let color,
              layerColor,
              fillOpacity = 0.2;
            switch (val.type) {
              case "1":
                color = "#51BDAE";
                break;
              case "2":
                color = "#FBA102";
                break;
              case "3":
                color = "#ED5554";
                break;
            }
            switch (val.layerType) {
              case "0":
                layerColor = "#fff";
                break;
              case "1":
                layerColor = "#fff176";
                break;
              case "2":
                layerColor = "#ffee58";
                break;
              case "3":
                layerColor = "#ffeb3b";
                break;
              case "4":
                layerColor = "#fdd835";
                break;
              case "5":
                layerColor = "#fbc02d";
                fillOpacity = 0.4;
                break;
            }
            let resultLayer = L.polygon(changeLonAndLat(val.data), {
              color: "#41b5ff",
              fillOpacity,
              fillColor: layerColor,
              weight: 2,
              code: val.code
            });
            let center = L.latLngBounds(changeLonAndLat(val.data)).getCenter();
            resultLayer.on(
              {
                click: function() {
                  level122(val.code, val.code, center, true);
                },
                mouseover: function(e) {
                  map.eachLayer(function(layer) {
                    if (layer._leaflet_id == e.target._leaflet_id) {
                      let $div = $(
                        'div.bubble-marker[code="' +
                          e.target.options.code +
                          '"]'
                      );
                      $div.stop().animate({ top: "5px" }, 200, function() {
                        $div.stop().animate({ top: "0" }, 200);
                      });
                      if (layer.options.fillOpacity == 0.2) {
                        layer.setStyle({
                          fillOpacity: 0.35
                        });
                      }
                      if (layer.options.fillOpacity == 0.4) {
                        layer.setStyle({
                          fillOpacity: 0.6
                        });
                      }
                    }
                  });
                },
                mouseout: function(e) {
                  map.eachLayer(function(layer) {
                    if (layer.options.fillOpacity == 0.35) {
                      layer.setStyle({
                        color: "#41b5ff",
                        fillOpacity: 0.2
                      });
                    }
                    if (layer.options.fillOpacity == 0.6) {
                      layer.setStyle({
                        color: "#41b5ff",
                        fillOpacity: 0.4
                      });
                    }
                  });
                },
                mouseup: function(e) {
                  let which = e.originalEvent.which;
                  if (which == 3) {
                    // 移除派出所图层
                    map.removeLayer(pcsLayerGroup);
                    map.removeLayer(pcsMarkerGroup);
                    pcsLayerGroup = L.layerGroup();
                    pcsMarkerGroup = L.layerGroup();
                    // 右键时，记录上级id
                    sugon.requestJson(
                      {
                        type: "POST",
                        url: sugon.interFaces.myhc.myzs.DeptId,
                        async: false
                      },
                      function(result) {
                        $("#place").val(result.NAME);
                        $("#placeCode").val(result.ID);
                        initMyzs();
                      }
                    );
                    // 重设中心点和zoom值
                    map.setView(zoomArr[0].center, zoomArr[0].zoom);
                  }
                }
              },
              true
            );
            pcsLayerGroup.addLayer(resultLayer);
            let len = val.name.length * 14 + 20;
            let html = val.value ? "" : "display:none;";
            let value = Number(val.value).toFixed(2);
            let percentLen = value.length * 14;
            let divIcon = L.divIcon({
              html: `<div style="width: ${len}px;" code="${val.code}" class="bubble-marker bubble-marker${val.type}">
                                    <div></div>
                                    <div style="width: ${percentLen}px;${html}">${value}%</div>
                                    <div>${val.name}</div>
                               </div>`,
              iconAnchor: [len / 2, 65]
            });
            let marker = L.marker([val.lat, val.lng], { icon: divIcon });
            pcsMarkerGroup.addLayer(marker);
          });
          map.addLayer(pcsLayerGroup);
          map.addLayer(pcsMarkerGroup);
          dynamicHeat(heatMapData);
          initRightPanel2($(".search-yw2").val());
        });
    }

    //获取分局下所有派出所数据
    function getPcsDataByFjCode(fjCode, isMyzs) {
      if (isRenderSearchChart) {
        renderSearchChart();
      }
      currentLevel = 1;
      let subCode = fjCode.substring(0, 6);
      let sqlParam = new SuperMap.GetFeaturesBySQLParameters({
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
      let url = "http://10.33.66.183:2334/iserver/services/data-gt8/rest/data";
      L.supermap
        .featureService(url)
        .getFeaturesBySQL(sqlParam, function(serviceResult) {
          let resultData = serviceResult.result.features.features;
          if (isMyzs) {
            renderMyzsPcsPage(resultData);
          } else {
            renderSqfbPcsPage(resultData);
          }
        });
    }

    // 诉求分布责任区页面
    function renderSqfbZrqPage(resultData, pcsCode) {
      currentLevel = 2;
      // 清空map上的分局数据
      map.removeLayer(pcsLayerGroup);
      map.removeLayer(pcsMarkerGroup);
      pcsLayerGroup = L.layerGroup();
      pcsMarkerGroup = L.layerGroup();
      // 清空派出所layer和marker
      resultData.map(function(val) {
        let resultLayer = L.polygon(changeLonAndLat(val.geometry.coordinates), {
          color: "#386AFB",
          fillOpacity: 0,
          className: "fj-layer",
          weight: 1,
          code: val.properties.DWBM
        });
        let center = L.latLngBounds(
          changeLonAndLat(val.geometry.coordinates)
        ).getCenter();
        let dwmc = val.properties.DWMC.replace($("#place").val(), "");
        let len = dwmc.length * 16 + 30;
        let divIcon = L.divIcon({
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
        let marker = L.marker(center, { icon: divIcon });
        resultLayer.on({
          mouseover: mouseoverEvent,
          mouseout: mouseoutEvent,
          click: function() {
            let deptCode = val.properties.DWBM;
            level223(deptCode);
          },
          mouseup: function(e) {
            if (searchInput) {
              isRenderSearchChart = true;
            }
            let deptCode = val.properties.DWBM;
            let which = e.originalEvent.which;
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
                  url: sugon.interFaces.myhc.myzs.DeptId,
                  async: false,
                  data: { deptCode: pcsCode }
                },
                function(result) {
                  $("#place").val(result.UP_NAME);
                  $("#placeCode").val(result.UP_ID);
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
    }

    // 民意指数责任区页面
    function renderMyzsZrqPage(resultData) {
      currentLevel = 2;
      let condition = {
        deptId: $("#placeCode").val(),
        date1: $("#date1").val(),
        date2: $("#date2").val(),
        type: $(".search-yw2").val()
      };
      sugon
        .request(sugon.interFaces.myhc.myzs.getYlldMapData, condition)
        .then(result => {
          $(".search-down-panel > button")
            .removeAttr("class")
            .addClass("animate-btn-disabled");
          clearInterval(timer);
          map.setView(zoomArr[2].center, zoomArr[2].zoom);
          // 清空map上的分局数据
          map.removeLayer(pcsLayerGroup);
          map.removeLayer(pcsMarkerGroup);
          map.removeLayer(heatLayerGroup);
          pcsLayerGroup = L.layerGroup();
          pcsMarkerGroup = L.layerGroup();
          heatLayerGroup = L.layerGroup();
          map.removeLayer(zrqLayerGroup);
          map.removeLayer(zrqMarkerGroup);
          zrqLayerGroup = L.layerGroup();
          zrqMarkerGroup = L.layerGroup();
          let data = [];
          resultData.map(val1 => {
            let center = L.latLngBounds(
                changeLonAndLat(val1.geometry.coordinates)
              ).getCenter(),
              obj = {
                code: val1.properties.DWBM,
                name: val1.properties.DWMC.replace(/^\S+派出所/g, ""),
                lat: center.lat,
                lng: center.lng,
                data: val1.geometry.coordinates,
                type: "2",
                value: ""
              };
            result.data.map(val2 => {
              if (obj.code == val2.code) {
                obj.value = val2.value;
                obj.type = val2.type;
              }
            });
            data.push(obj);
          });
          // 在添加之前置空
          data.map(function(val) {
            let resultLayer = L.polygon(changeLonAndLat(val.data), {
              color: "#386AFB",
              weight: 3,
              fillOpacity: 0,
              code: val.code
            });
            let center = L.latLngBounds(changeLonAndLat(val.data)).getCenter();
            resultLayer.on(
              {
                mouseover: myzsMouseoverEvent,
                mouseout: myzsMouseoutEvent,
                click: function() {
                  level223(val.code, val.code, center, true);
                },
                mouseup: function(e) {
                  let deptId = $("#placeCode").val();
                  let which = e.originalEvent.which;
                  if (which == 3) {
                    $(".data-panel4").hide();
                    $(".data-panel3").hide();
                    // 移除聚合图层
                    map.removeLayer(markerClusterGroup);
                    markerClusterGroup = L.layerGroup();
                    // 移除责任区图层
                    map.removeLayer(zrqLayerGroup);
                    map.removeLayer(zrqMarkerGroup);
                    zrqLayerGroup = L.layerGroup();
                    zrqMarkerGroup = L.layerGroup();

                    // 右键时，记录上级id
                    sugon.requestJson(
                      {
                        type: "POST",
                        url: sugon.interFaces.myhc.myzs.DeptId,
                        async: false,
                        data: { deptId: deptId }
                      },
                      function(result) {
                        $("#place").val(result.UP_NAME);
                        $("#placeCode").val(result.UP_ID);
                      }
                    );
                    getPcsDataByFjCode(zoomArr[1].upDeptCode, true);
                    // 重设中心店和zoom值
                    map.setView(zoomArr[1].center, zoomArr[1].zoom);
                  }
                }
              },
              true
            );
            zrqLayerGroup.addLayer(resultLayer);
            let len = val.name.length * 14 + 20;
            // let html = val.value ? "" : " style='display:none;'";
            let divIcon = L.divIcon({
              html: `<div style="width: ${len}px;" code="${
                val.code
              }" class="bubble-marker bubble-marker2">
                                    <div></div>
                                    <div style="display:none;">${Number(
                                      val.value
                                    ).toFixed(2)}%</div>
                                    <div>${val.name}</div>
                               </div>`,
              iconAnchor: [len / 2, 30]
            });
            let marker = L.marker([val.lat, val.lng], { icon: divIcon });
            zrqMarkerGroup.addLayer(marker);
          });
          map.addLayer(zrqLayerGroup);
          map.addLayer(zrqMarkerGroup);
          initRightPanel2($(".search-yw2").val());
        });
      loadMyzsMarker();
    }

    //传入派出所编码 绘制责任区数据
    function getZrqDataByPcsCode(pcsCode, isMyzs) {
      if (isRenderSearchChart) {
        renderSearchChart();
      }
      let subCode = pcsCode.substring(0, 8);
      let sqlParam = new SuperMap.GetFeaturesBySQLParameters({
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
      let url = "http://10.33.66.183:2334/iserver/services/data-gt8/rest/data";
      L.supermap
        .featureService(url)
        .getFeaturesBySQL(sqlParam, function(serviceResult) {
          let resultData = serviceResult.result.features.features;
          if (isMyzs) {
            renderMyzsZrqPage(resultData);
          } else {
            renderSqfbZrqPage(resultData, pcsCode);
          }
        });
    }

    // 诉求分布单个责任区页面
    function renderSqfbSingleZrqPage(resultData, zrqCode) {
      $(".search-pop-panel").hide();
      currentLevel = 3;
      // 清空map上的分局数据
      map.removeLayer(zrqLayerGroup);
      map.removeLayer(zrqMarkerGroup);
      zrqLayerGroup = L.layerGroup();
      zrqMarkerGroup = L.layerGroup();
      // 清空责任区layer和marker
      let bounds = "";
      resultData.map(function(val) {
        let resultLayer = L.polygon(changeLonAndLat(val.geometry.coordinates), {
          color: "#386AFB",
          fillOpacity: 0,
          className: "fj-layer",
          weight: 1,
          code: val.properties.DWBM
        });
        let center = L.latLngBounds(
          changeLonAndLat(val.geometry.coordinates)
        ).getCenter();
        let len = val.properties.DWMC.length * 16 + 30;
        let divIcon = L.divIcon({
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
        let marker = L.marker(center, { icon: divIcon });
        resultLayer.on("mouseup", function(e) {
          let deptCode = val.properties.DWBM;
          let which = e.originalEvent.which;
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
                url: sugon.interFaces.myhc.myzs.DeptId,
                async: false,
                data: { deptCode: zrqCode, isZrq2Pcs: true }
              },
              function(result) {
                $("#place").val(result.UP_NAME);
                $("#placeCode").val(result.UP_ID);
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
    }

    // 民意指数单个责任区页面
    function renderMyzsSingleZrqPage(resultData) {
      $(".data-panel4").hide();
      currentLevel = 3;
      // 清空责任区图层
      map.removeLayer(zrqLayerGroup);
      map.removeLayer(zrqMarkerGroup);
      map.removeLayer(markerClusterGroup);
      zrqLayerGroup = L.layerGroup();
      zrqMarkerGroup = L.layerGroup();
      markerClusterGroup = L.layerGroup();

      // 清空当前图层
      map.removeLayer(singleZrqLayerGroup);
      map.removeLayer(singleZrqMarkerGroup);
      singleZrqLayerGroup = L.layerGroup();
      singleZrqMarkerGroup = L.layerGroup();
      // 清空责任区layer和marker
      let bounds = "";
      resultData.map(function(val) {
        let resultLayer = L.polygon(changeLonAndLat(val.geometry.coordinates), {
          color: "#386AFB",
          weight: 3,
          fillOpacity: 0.15
        });
        let center = L.latLngBounds(
          changeLonAndLat(val.geometry.coordinates)
        ).getCenter();
        let len =
          val.properties.DWMC.replace(/^\S+派出所/g, "").length * 16 + 30;
        let divIcon = L.divIcon({
          html: `<div style="width: ${len}px;" class="bubble-marker bubble-marker2">
                                <div></div>
                                <div style="display: none;"></div>
                                <div>${val.properties.DWMC.replace(
                                  /^\S+派出所/g,
                                  ""
                                )}</div>
                           </div>`,
          iconAnchor: [len / 2, 30]
        });
        bounds = resultLayer.getBounds();
        let marker = L.marker(center, { icon: divIcon });
        resultLayer.on("mouseup", function(e) {
          let deptId = $("#placeCode").val();
          let which = e.originalEvent.which;
          if (which == 3) {
            $(".data-panel4").hide();
            // 移除责任区图层
            map.removeLayer(singleZrqLayerGroup);
            map.removeLayer(singleZrqMarkerGroup);
            map.removeLayer(markerClusterGroup);
            singleZrqLayerGroup = L.layerGroup();
            singleZrqMarkerGroup = L.layerGroup();
            markerClusterGroup = L.layerGroup();
            // 右键时，记录上级id
            sugon.requestJson(
              {
                type: "POST",
                url: sugon.interFaces.myhc.myzs.DeptId,
                async: false,
                data: { deptId: deptId }
              },
              function(result) {
                $("#place").val(result.UP_NAME);
                $("#placeCode").val(result.UP_ID);
              }
            );
            getZrqDataByPcsCode(zoomArr[2].upDeptCode, true);

            // 重设中心店和zoom值
            map.setView(zoomArr[2].center, zoomArr[2].zoom);
          }
        });
        singleZrqLayerGroup.addLayer(resultLayer);
        singleZrqMarkerGroup.addLayer(marker);
      });
      loadMyzsMarker();
      map.addLayer(singleZrqLayerGroup);
      map.addLayer(singleZrqMarkerGroup);
      map.fitBounds(bounds);
      initRightPanel2($(".search-yw2").val());
    }

    // 根据责任区id获取责任区边界
    function getDataByZrqCode(zrqCode, isMyzs) {
      if (searchInput) {
        isRenderSearchChart = false;
      }
      let sqlParam = new SuperMap.GetFeaturesBySQLParameters({
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
      let url = "http://10.33.66.183:2334/iserver/services/data-gt8/rest/data";
      L.supermap
        .featureService(url)
        .getFeaturesBySQL(sqlParam, function(serviceResult) {
          let resultData = serviceResult.result.features.features;
          if (isMyzs) {
            renderMyzsSingleZrqPage(resultData);
          } else {
            renderSqfbSingleZrqPage(resultData, zrqCode);
          }
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
      let $search = $(".data-panel-search");
      $search.empty();
      $search.append($("<span/>").html("业务类型："));
      let data = getSearchData(type);
      data.map(function(value, index) {
        let $div = $("<div/>");
        if (index < 1) {
          $div.addClass("search-selected");
        }
        $search.append($div.html(value));
      });
    }

    // 获取查询栏的数据
    function getSearchData(type) {
      let data = [],
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
            url: sugon.interFaces.myhc.myzs.getMapCount,
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
      let data = [];
      if (isQuery) {
        // 请求责任区接口
        let splitData = [[], [], [], [], []];
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
        for (let i = (pageNum - 1) * 100; i < pageNum * 100; i++) {
          if (splitData[type][i]) {
            data.push(splitData[type][i]);
          }
        }
      } else {
        sugon.requestJson(
          {
            type: "post",
            url: sugon.interFaces.myhc.myzs.getDetailMapData,
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
      let $tab = $(".data-panel .data-panel-tab");
      let header1 = "",
        header2 = "";
      let realType = type == 0 ? searchType : Number(type);
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
      let data = getTabData(realType, pageNum);
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
        let $div = $("<div/>")
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
        let icon;

        let str = "";
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
        let resultLayer = L.marker([value.lat, value.lng], { icon: icon });
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
          let content = e.popup._content;
          let reg = /ywid\="\S*"/;
          let resultArr = content.match(reg);
          let ywid = "";
          if (resultArr) {
            ywid = resultArr[0].substring(6, resultArr[0].length - 1).trim();
          }
          if (ywid) {
            let tabRow = $(".data-panel-tab-row"),
              className = "data-panel-tab-row-hover";
            tabRow.removeClass(className);
            for (let i = 0; i < tabRow.length; i++) {
              let row = tabRow.eq(i);
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
      let pageStr = $(".search-selected").html();
      let totalCount = pageStr.substring(
        pageStr.indexOf("(") + 1,
        pageStr.lastIndexOf(")")
      );
      let pages =
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
      let result = {
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
      let className = !isNotZoomIn ? "pop-ck-down-true" : "";
      deptCode = deptCode || "";
      sugon.requestJson(
        {
          type: "post",
          url: sugon.interFaces.myhc.myzs.getCkMapData,
          async: false,
          data: {
            deptCode: deptCode,
            deptId: $("#placeCode").val(),
            date1: $("#date1").val(),
            date2: $("#date2").val()
          }
        },
        function(result) {
          let data = result.data;
          let fjData = [
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
            let width = value.name.length * 16 + 40,
              top = "";
            let height = value.ismost ? 130 : 90;
            if (value.ismost == "1") {
              top = '<div class="pop-ck-up pop-ck-up-top"></div>';
            } else if (value.ismost == "2") {
              top = '<div class="pop-ck-up pop-ck-up-alarm"></div>';
            }

            let html =
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
            let divIcon = L.divIcon({
              className: "ck-popup",
              html: html,
              popupAnchor: [width / 2 - 8, 0],
              iconAnchor: [width / 2 + 3, height - 30]
            });
            let marker = L.marker([value.lat, value.lng], { icon: divIcon });
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
          url: sugon.interFaces.myhc.myzs.getCkfw,
          data: {
            deptCode: deptCode,
            deptId: $("#placeCode").val(),
            date1: $("#date1").val(),
            date2: $("#date2").val()
          },
          async: true
        },
        function(result) {
          let data = result.data;
          if (data && data.length > 0) {
            let $banner = $(".right-up-banner");
            let $body = $(".right-up-body");
            $banner.empty();
            $body.empty();
            let colorIcon1 = handleColorAndIcon(data[0][2]);
            let colorIcon2 = handleColorAndIcon(data[0][3]);
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
                let img = "";
                let colorIcon1 = handleColorAndIcon(value[2]);
                let colorIcon2 = handleColorAndIcon(value[3]);
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
                let str;
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
                let html =
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
                getRightDownData();
              }
            });
          }
        }
      );
    }

    // 初始化窗口面板
    function initCk() {
      $(".search-down-panel > button")
        .removeAttr("class")
        .addClass("animate-btn-disabled");
      clearInterval(timer);
      $(".data-panel2").hide();
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
      $(".right-panel-panel").show();
      $(".right-panel-panel2").hide();
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
            fillOpacity: 0.45
          });
        }
        if (layer._leaflet_id == e.target._leaflet_id) {
          layer.setStyle({
            fillOpacity: 0.65
          });
        }
      });
    }

    // 窗口图层鼠标移出事件
    function ckMouseoutEvent(e) {
      map.eachLayer(function(layer) {
        if (layer.options.fillOpacity == "0.65") {
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
        let sqlParam = new SuperMap.GetFeaturesBySQLParameters({
          queryParameter: {
            name: "gajg_pcszrq_3201_pg@ORCL_gt8",
            attributeFilter: "DWBM like '%000000' ",
            fields: ["DWBM", "DWMC"],
            orderBy: "DWBM"
          },
          datasetNames: ["ORCL_gt8:gajg_pcszrq_3201_pg"],
          toIndex: -1
        });
        let url =
          "http://10.33.66.183:2334/iserver/services/data-gt8/rest/data";
        L.supermap
          .featureService(url)
          .getFeaturesBySQL(sqlParam, function(serviceResult) {
            let resultData = serviceResult.result.features.features;
            map.setView(zoomArr[0].center, zoomArr[0].zoom);
            let colorArr = [
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
            map.removeLayer(allFjLayerGroup);
            allFjLayerGroup = L.layerGroup();
            // 在添加之前置空
            resultData.map(function(val, index) {
              let resultLayer = L.polygon(
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
          url: sugon.interFaces.myhc.myzs.getMapData,
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
          let maxLen = 25000;
          let len = result.data.length;
          result.data.map(function(val) {
            val[2] = (10 * maxLen) / len;
          });
          let heatLayer = [];
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

    // 渲染热力图
    function renderHeatMap(data) {
      map.removeLayer(heatLayerGroup);
      heatLayerGroup = L.layerGroup();
      let maxLen = 25000;
      let len = data.length;
      data.map(function(val) {
        val[2] = (10 * maxLen) / len;
      });
      let heatLayer = [];
      heatLayer.push(
        L.heatLayer(data, {
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
          url: sugon.interFaces.myhc.myzs.getMapData,
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

    // 加载民意指数点位图
    function loadMyzsMarker() {
      map.removeLayer(markerClusterGroup);
      markerClusterGroup = L.layerGroup();
      sugon.requestJson(
        {
          type: "post",
          url: sugon.interFaces.myhc.myzs.getYlldDetailMapData,
          data: {
            deptId: $("#placeCode").val(),
            date1: $("#date1").val(),
            date2: $("#date2").val(),
            type: $(".search-yw2").val()
          },
          async: true
        },
        function(result) {
          rdwtData = result;
          renderMyzsMarker(rdwtData.data);
        }
      );
    }

    // 渲染民意指数点位图
    function renderMyzsMarker(data, isQuery) {
      markerClusterGroup = L.layerGroup();
      $(".data-panel3")
        .show()
        .attr("isQuery", isQuery ? 1 : 0);
      $(".data-panel-banner3").html(rdwtData.content);
      let $body = $(".data-panel-tab3").empty()
        .append(`<div class="data-tab-header">
                            <div class="col11">序号</div>
                            <div class="col11">时间</div>
                            <div class="col11">诉求人</div>
                            <div class="col11">诉求类型</div>
                         </div>`);
      data.map((val, index) => {
        let row = `<div class="data-panel-tab-row" ywid="${val.ywid}">
                                      <div class="col11">${index + 1}</div>
                                      <div class="col11">${val.sj}</div>
                                      <div class="col11">${val.sqr}</div>
                                      <div class="col11">${val.ywlb}</div>
                                   </div>`;
        $body.append(row);
        let icon = L.icon({
          iconUrl: `../../img/myhc/myzs/location_12345.png`,
          popupAnchor: [10, 5]
        });
        let marker = L.marker([val.lat, val.lng], {
          icon: icon,
          ywid: val.ywid
        });
        let bjnr = val.num == 2 ? `<p>报警内容：${val.bjnr}</p>` : "";
        let bindHtml = `<div ywid="${val.ywid}" class="pop-map-mark-header">诉求信息
                                        </div><div class="pop-map-mark-body">
                                            <p>姓名：${val.sqr}</p>
                                            <p>电话：${val.dh}</p>
                                            <p>诉求时间：${val.sj}</p>
                                            <p>业务归口：${val.ywgk}</p>
                                            <p>诉求来源：${val.sqlb}</p>
                                            <p>诉求地址：${val.sqdz}</p>
                                            ${bjnr}
                                            <p>诉求内容：${val.sqnr}</p>
                                        </div>`;
        marker.bindPopup(bindHtml);
        marker.on({
          popupopen: function(e) {
            let ywid = e.target.options.ywid;
            $(".data-panel3 .data-panel-tab-row").each(function(index, dom) {
              let $dom = $(dom);
              if ($dom.attr("ywid") == ywid) {
                $dom.addClass("data-panel-tab-row-hover");
              }
            });
          },
          popupclose: function() {
            $(".data-panel3 .data-panel-tab-row").removeClass(
              "data-panel-tab-row-hover"
            );
          }
        });
        markerClusterGroup.addLayer(marker);
        map.addLayer(markerClusterGroup);
      });
      markerClusterGroup.addTo(map);
    }

    // 加载工具
    function loadGj(index) {
      let defaultStyle = plotting.getDefaultStyle();
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
      let $panel = $(".search-pop-panel");
      if (isRenderSearchChart) {
        $panel.show();
      } else {
        $panel.hide();
      }
      sugon.requestJson(
        {
          type: "post",
          url: sugon.interFaces.myhc.myzs.getRightMidData,
          data: {
            deptId: $("#placeCode").val(),
            date1: $("#date1").val(),
            date2: $("#date2").val(),
            keyword: searchInput
          },
          async: true
        },
        function(result) {
          let data1 = result.data1;
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
      let data = [];
      sqfxData.map(function(val) {
        if (val.dy == index) {
          data.push(val);
        }
      });
      let chart = echarts.init(document.getElementById("search-pop-chart"));
      let xData = [],
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
        for (let i = 0; i < data.length; i++) {
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

      let diff = (max - min) / 2;
      min = Number(min - diff).toFixed(2);
      max = Number(max + diff).toFixed(2);
      let option = {
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
      $(".search-down-panel > button")
        .removeAttr("class")
        .addClass("animate-btn-disabled");
      clearInterval(timer);
      let $control = $(".search-control").val();
      if ($control == "1") {
        let searchYw = $(".search-yw");
        let searchGj = $(".search-gj");
        latLng = "";
        $(".data-panel2").hide();
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
      } else {
        sugon.request(sugon.interFaces.myhc.myzs.DeptId).then(result => {
          $("#placeCode").val(result.ID);
          $("#place").val(result.NAME);
          $(".data-panel2").hide();
          $(".data-panel3").hide();
          $(".data-panel4").hide();
          $(".toolbar-panel3").hide();
          $(".search-pop-panel").hide();
          $(".search-yw2").val(1);
          $(".search-gj").val(0);
          map.off("click");
          removeAllLayers();
          initMyzs();
        });
      }
    }

    // 清除圈选页面
    function clearPage() {
      $(".data-panel2").hide();
      if (currentLevel == 3) {
        if (drawControl) {
          drawControl.handler.disable();
        }
        $(".data-panel3").hide();
        $(".data-panel4").hide();
        $(".search-gj").val(0);
        $(".data-panel").hide();
        map.removeLayer(queryGroup);
        queryGroup = L.layerGroup();
        map.removeLayer(markerClusterGroup);
        markerClusterGroup = L.layerGroup();
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
        latLng = "";
        map.removeLayer(ckMarkerGroups1);
        map.removeLayer(ckCircleGroups);
        ckMarkerGroups2.map(val => {
          val && map.removeLayer(val);
        });
        centerMarker && map.removeLayer(centerMarker);
      }
    }

    // 加载plot图
    function loadPlot(isMyzs) {
      serverUrl =
        "http://10.33.66.183:2334/iserver/services/plot-jingyong/rest/plot/";
      queryPlottingLayer = L.supermap.plotting.plottingLayer("plot", serverUrl);
      queryPlottingLayer.addTo(map);
      drawControl = L.supermap.plotting.drawControl(queryPlottingLayer);
      drawControl.addTo(map);
      plotting = L.supermap.plotting.getControl(map, serverUrl);
      loadSymbolLib(isMyzs);
    }

    function loadSymbolLib(isMyzs) {
      let symbolLibManager = plotting.getSymbolLibManager();
      symbolLibManager.libIDs = [421];
      symbolLibManager.on(
        SuperMap.Plot.Event.initializecompleted,
        isMyzs
          ? myzsSymbolLibInitializeCompleted
          : sqfbSymbolLibInitializeCompleted
      );
      symbolLibManager.initializeAsync();
      drawControl.on(SuperMap.Plot.Event.featureadded, function(event) {
        let layer = event.feature;
        let latLngs = layer.getLatLngs();
        let symbolType = layer.symbolType;
        // queryPlottingLayer.removeFeatures(layer);
        if (symbolType === SuperMap.Plot.SymbolType.ARBITRARYPOLYGONSYMBOL) {
          queryResult = L.supermap.plotting
            .query(map)
            .getGObjectsInPolygon(latLngs);
        }
        if (symbolType === SuperMap.Plot.SymbolType.CIRCLESYMBOL) {
          let radius = Math.sqrt(
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
          hiddenSelectedData = [];
          queryResult.map(function(value1) {
            mapMarkData.map(function(value2) {
              if (value1.uuid == value2.ywid) {
                selectedData.push(value2);
              }
            });
            hiddenMapMarkData.map(value2 => {
              if (value1.uuid == value2.ywid) {
                hiddenSelectedData.push(value2);
              }
            });
          });
          if (isMyzs) {
            rdwtData.content = rdwtData.content.replace(
              /[0-9]+/g,
              selectedData.length
            );
            renderMyzsMarker(selectedData, true);
          } else {
            isQuery = true;
            initDataPanel($(".search-yw").val());
          }
        }
        drawControl.handler.disable();
        $(".search-gj").val(0);
      });
    }

    // 诉求分布symbol初始化完成事件
    function sqfbSymbolLibInitializeCompleted() {
      let libID = 421;
      let code = 20100;
      SuperMap.Plot.PlottingUtil.getDataFromServer(
        serverUrl,
        libID,
        code,
        null,
        {},
        null,
        function(res) {
          let newBounds = map.getBounds();
          if (!bounds || JSON.stringify(bounds) != JSON.stringify(newBounds)) {
            // 判断边界非空或者相等
            bounds = newBounds;
          }
          // 加载图形数据
          sugon.requestJson(
            {
              type: "post",
              url: sugon.interFaces.myhc.myzs.getMapDataByBounds,
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
                let latLngs = [];
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

    // 民意指数symbol初始化完成事件
    function myzsSymbolLibInitializeCompleted() {
      let libID = 421;
      let code = 20100;
      SuperMap.Plot.PlottingUtil.getDataFromServer(
        serverUrl,
        libID,
        code,
        null,
        {},
        null,
        function(res) {
          let newBounds = map.getBounds();
          if (!bounds || JSON.stringify(bounds) != JSON.stringify(newBounds)) {
            // 判断边界非空或者相等
            bounds = newBounds;
          }
          // 加载图形数据
          sugon.requestJson(
            {
              type: "post",
              url: sugon.interFaces.myhc.myzs.getYlldDetailMapDataByBound,
              data: {
                northEast: JSON.stringify(bounds._northEast),
                southWest: JSON.stringify(bounds._southWest),
                date1: $("#date1").val(),
                date2: $("#date2").val(),
                type: $(".search-yw2").val()
              },
              async: true
            },
            function(result) {
              rdwtData = result;
              mapMarkData = result.data;
              hiddenMapMarkData = result.data0;
              let data = result.data.concat(hiddenMapMarkData);
              data.map(function(value) {
                let latLngs = [];
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
          url: sugon.interFaces.myhc.myzs.getCkDetail,
          data: {
            deptCode: code,
            date1: $("#date1").val(),
            date2: $("#date2").val()
          },
          async: true
        },
        function(result) {
          let data1 = result.data1,
            data2 = result.data2,
            data3 = result.data3,
            titleData;
          let rightData = "",
            xData = [],
            yData = [],
            subData = [],
            rightUpData = "",
            rightClassName = "map-mark-right-all";
          data1.map(function(value) {
            if (value.type) {
              titleData = value;
            } else {
              xData.push(value.name);
              yData.push(value.value);
              subData.push(value);
            }
          });

          if (data2.length == 0) {
            rightData = `<img src="../../img/myhc/myzs/nodata.png" class="no-data"/>`;
          }

          data2.map(function(value, index) {
            rightData += `<div>
                                <div title="${value.content}">${index + 1}、${
              value.content
            }</div>
                                <span code="${value.code}">（${
              value.count
            }）</span>
                            </div>`;
          });

          if (data3) {
            rightClassName = "map-mark-right-half";
            if (data3.length > 0) {
              rightUpData += `<div class="map-mark-row">
                                                <div></div>
                                                <div>办理量</div>
                                                <div>一般工单</div>
                                                <div>不满意工单</div>
                                            </div>`;
              data3.map(val => {
                let img;
                switch (val.name) {
                  case "户籍":
                    img = "hz";
                    break;
                  case "身份证":
                    img = "sfz";
                    break;
                  case "出入境":
                    img = "crj";
                    break;
                  case "驾证":
                    img = "cgjz";
                    break;
                  case "车辆":
                    img = "cgcl";
                    break;
                  case "监管":
                    img = "jg";
                    break;
                }
                rightUpData += `<div class="map-mark-row">
                                                    <div>
                                                        <img src="../../img/myhc/myzs/${img}.png"/>
                                                        <span style="margin-left: 3px;">${val.name}</span>
                                                    </div>
                                                    <div>${val.value1}</div>
                                                    <div>${val.value2}</div>
                                                    <div>${val.value3}</div>
                                            </div>`;
              });
            }
          }
          let rightUp = `<div class="${rightClassName}" style="border-bottom: 1px dashed #ccc;">${rightUpData}</div>`;
          rightClassName == "map-mark-right-all" && (rightUp = "");
          let rightDown = `<div class="${rightClassName}">
                                        <div deptCode="${code}" class="map-mark-right-title">
                                            <span style="float: left;">本期热点问题：</span>
                                            <span style="float: right;">问题量</span>
                                        </div>
                                        <div class="map-mark-right-body">
                                            ${rightData}
                                        </div>
                                     </div>`;
          let random = parseInt(Math.random() * 10000);
          let html = `<div class="pop-map-mark-header">满意度分析</div>
                         <div class="ck-pop-mark-body pop-map-mark-body">
                            <div class="map-mark-left" id="marker-chart-${random}" style="width:${
            rightUp ? "50%;" : "60%"
          }"></div>
                            <div class="map-mark-right" style="width:${
                              rightUp ? "50%" : "40%"
                            };">
                            ${rightUp + rightDown}
                            </div>
                         </div>`;
          let popupOption = {},
            minAndMax = sugon.handleMinAndMax(yData);
          if (type == 1) {
            popupOption.offset = L.point(-48, -50);
          }
          layer
            .bindPopup(html, popupOption)
            .openPopup()
            .unbindPopup();

          let text =
            !titleData ||
            "{d|" +
              titleData.name +
              "}{a|满意度为}" +
              "{c|" +
              titleData.value +
              "%} {a|全市排名}{b|" +
              titleData.rank +
              "}";
          let option = {
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
              top: 90,
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
                min: minAndMax.min,
                max: minAndMax.max
              }
            ],
            series: [
              {
                type: "bar",
                barWidth: 20,
                data: subData,
                label: {
                  position: "top",
                  show: true,
                  fontSize: 16,
                  color: "#000",
                  align: "center",
                  lineHeight: 16,
                  formatter: function(param) {
                    let inc = "",
                      rank = param.data.rank
                        ? "{a|全局第}{c|" + param.data.rank + "}\n"
                        : "";
                    if (param.data.inc) {
                      if (param.data.inc > 0) {
                        inc = "{c|↑ " + param.data.inc + "名}";
                      } else if (param.data.inc == 0) {
                        inc = "{d|持平}";
                      } else {
                        inc = "{b|↓ " + Math.abs(param.data.inc) + "名}";
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
          let chart = echarts.init(
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
          url: sugon.interFaces.myhc.myzs.getCkfwqDetail,
          data: {
            deptCode: code,
            date1: $("#date1").val(),
            date2: $("#date2").val(),
            type: type
          },
          async: true
        },
        function(result) {
          let data = result.data;
          let xData = [],
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
            let colorIcon1 = handleColorAndIcon(value.tb),
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
          let random = parseInt(Math.random() * 10000);
          let html =
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
          let chart = echarts.init(
            document.getElementById("marker-chart-" + random)
          );
          let option = {
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
    function renderMarks(data, index, isTimeChange) {
      ckMarkerGroups2[index] = L.layerGroup();
      let iconUrl = "../../img/myhc/myzs/";
      switch (index) {
        case 0:
          iconUrl += "hz_icon.png";
          break;
        case 1:
          iconUrl += isTimeChange ? "cjg_icon.png" : "crj_icon.png";
          break;
        case 2:
          iconUrl += isTimeChange ? "crj_icon.png" : "cjg_icon.png";
          break;
      }
      let divIcon = L.icon({
        iconUrl: iconUrl,
        iconAnchor: [13, 43],
        popupAnchor: [2, -35]
      });
      data.map(function(value) {
        if (index == 3) {
          iconUrl = "../../img/myhc/myzs/fwd_icon" + value.value + ".png";
          let mult = value.value < 3 ? 2 : 3;
          divIcon = L.icon({
            iconUrl: iconUrl,
            iconAnchor: [12 * mult, 10]
          });
        }
        let marker = L.marker([value.lat, value.lng], {
          icon: divIcon,
          ywid: value.code,
          type: value.type
        });
        marker.on({
          click: function() {
            let type =
              !isTimeChange || value.type == 0
                ? value.type
                : value.type == 1
                ? 2
                : 1;
            openCkPulsePopup(value.code, marker, type);
          },
          mouseover: function() {
            map.removeLayer(popMarkerGroup);
            popMarkerGroup = L.layerGroup();
            let width = value.name.length * 16 + 30;
            let html =
              '<div class="pop-marker-bg" style="width: ' +
              width +
              'px;">' +
              value.name +
              "</div>";
            let popIcon = L.divIcon({
              html: html,
              iconAnchor: [width / 2, 90]
            });
            let popMarker = L.marker([value.lat, value.lng], { icon: popIcon });
            popMarkerGroup.addLayer(popMarker);
            popMarkerGroup.addTo(map);
          },
          mouseout: function() {
            map.removeLayer(popMarkerGroup);
            popMarkerGroup = L.layerGroup();
          },
          popupopen: function(e) {
            let ywid = e.target.options.ywid;
            $(".data-panel2 .data-panel-tab-row").each(function(index, dom) {
              let $dom = $(dom);
              if ($dom.attr("ywid") == ywid) {
                $dom.addClass("data-panel-tab-row-hover");
              }
            });
          },
          popupclose: function() {
            $(".data-panel2 .data-panel-tab-row").removeClass(
              "data-panel-tab-row-hover"
            );
          }
        });
        ckMarkerGroups2[index].addLayer(marker);
      });
      ckMarkerGroups2[index].addTo(map);
    }

    // 加载闪烁图
    function initPulse(index) {
      sugon.requestJson(
        {
          type: "post",
          url: sugon.interFaces.myhc.myzs.getCkfwq,
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
      $(".search-control").val(1);
      let inputVal = $(".search-input").val();
      let reg = /\S/;
      if (reg.test(inputVal)) {
        $(".analysis-btn").hide();
        searchInput = inputVal;
        $(".keyword-search").html(
          '包含“<span style="color: #1d84c6;">' +
            searchInput +
            "</span>”的群众诉求共计："
        );
        let type = 0;
        let searchYw = $(".search-yw");
        let searchGj = $(".search-gj");
        searchYw.attr("disabled", "disabled").val(type);
        searchGj.attr("disabled", "disabled");
        sugon.requestJson(
          {
            type: "post",
            url: sugon.interFaces.myhc.myzs.getMapCount,
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
            let totalCount = result.data[0].substring(
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
        .request(sugon.interFaces.myhc.myzs.getCkfwqZb, { type: arr.join(",") })
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
        .request(sugon.interFaces.myhc.myzs.getCkfwqRybd, condition)
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
        .request(sugon.interFaces.myhc.myzs.getCkfwqDwbd, condition)
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

    // 回复marker的颜色
    function recoverMarker() {
      map.eachLayer(function(layer) {
        if (
          layer._popup &&
          layer.options.icon.options.iconUrl.indexOf("selected") > -1
        ) {
          rdwtData.data.map(val => {
            if (layer.options.ywid == val.ywid && layer.setIcon) {
              layer.setIcon(
                L.icon({
                  iconUrl: `../../img/myhc/myzs/location_12345.png`,
                  popupAnchor: [10, 5]
                })
              );
            }
          });
        }
      });
    }

    // 诉求分布工具切换事件
    function sqfbGjChange(index) {
      let $panel3 = $(".toolbar-panel3");
      $panel3.hide();
      map.off("click");
      $(".analysis-btn").show();
      $(".data-panel").hide();
      isLoadBounds = true;
      removeAllLayers();
      map.setZoom(16, { animate: false });
      let $searchYw = $(".search-yw");
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

    // 民意指数工具切换事件
    function myzsGjChange(index) {
      let $panel3 = $(".toolbar-panel3");
      if (index == 4) {
        removeAllLayers();
        $panel3
          .show()
          .off()
          .on("click", "div", function(e) {
            let $target = $(e.target),
              className = "toolbar-panel3-hover";
            $target.hasClass(className)
              ? $target.removeClass(className)
              : $target.addClass(className);
            let $hover = $(".toolbar-panel3-hover"),
              typeArr = [],
              $panel2 = $(".data-panel2");
            $hover.each((index, dom) => {
              let indexOfDiv = $(dom).index(".toolbar-panel3 > div");
              typeArr.push(indexOfDiv);
            });
            map.removeLayer(ckMarkerGroups1);
            map.removeLayer(ckCircleGroups);
            ckMarkerGroups1 = L.layerGroup();
            ckCircleGroups = L.layerGroup();
            ckMarkerGroups2.map(val => {
              val && map.removeLayer(val);
            });

            if (typeArr.length > 0) {
              latLng && getBmfwq(typeArr);
              map.off("click").on("click", function(e) {
                centerMarker && map.removeLayer(centerMarker);
                $panel2.show();
                map.closePopup();
                map.removeLayer(ckMarkerGroups1);
                map.removeLayer(ckCircleGroups);
                ckMarkerGroups1 = L.layerGroup();
                ckCircleGroups = L.layerGroup();
                ckMarkerGroups2.map(val => {
                  val && map.removeLayer(val);
                });
                latLng = e.latlng;
                let icon = L.icon({
                  iconUrl: "../../img/myhc/myzs/center_point.png",
                  iconAnchor: [17, 37]
                });
                centerMarker = L.marker([latLng.lat, latLng.lng], { icon });
                map.addLayer(centerMarker);
                getBmfwq(typeArr);
              });
            } else {
              $panel2.hide();
              map.off("click");
            }
          });
      } else {
        map.off("click");
        removeAllLayers();
        map.setZoom(15, { animate: false });

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
        loadPlot(true);
        loadGj(index);
      }
    }

    // 画便民服务圈
    function drawCircle(index, lat, lng) {
      let radius, color;
      switch (index) {
        case 0:
          radius = 1500;
          color = "#14AEE0";
          break;
        case 1:
          radius = 3000;
          color = "#44E014";
          break;
        case 2:
          radius = 4500;
          color = "#E06B14";
          break;
      }
      if (lat && lng) {
        ckCircleGroups.addLayer(L.circle([lat, lng], { radius, color }));
        map.addLayer(ckCircleGroups);
      }
    }

    // 获取便民服务圈
    function getBmfwq(typeArr) {
      let { lat, lng } = latLng;
      sugon
        .request(sugon.interFaces.myhc.myzs.getBmfwq, {
          lat,
          lng,
          date1: $("#date1").val(),
          date2: $("#date2").val(),
          type: typeArr.join(",")
        })
        .then(result => {
          typeArr.map(val => {
            val = val && Number(val);
            renderMarks(result.data[val], val, true);
            drawCircle(val, lat, lng);
          });
          renderCircleList(result.data);
        });
    }

    // 渲染圆圈列表
    function renderCircleList(data) {
      $(".data-panel2").show();
      let $body = $(".data-panel2 .data-panel-tab").empty(),
        index = 0;
      $body.append(`<div class="data-tab-header">
                <div class="col9">序号</div>
                <div class="col6">单位</div>
                <div class="col7">业务类型</div>
                <div class="col8">满意度</div>
            </div>`);
      data.map(val1 => {
        val1.map(val2 => {
          index++;
          $body.append(`<div class="data-panel-tab-row" ywid="${val2.code}">
                <div class="col9">${index}</div>
                <div class="col6">${val2.name}</div>
                <div class="col7">${val2.ywlx}</div>
                <div class="col8">${val2.myd}</div>
            </div>`);
        });
      });
    }

    // 初始化民意指数地图以及右侧面板
    function initMyzs(type) {
      currentLevel = 0;
      type = type || "1";
      $(".right-panel-panel").hide();
      $(".right-panel-panel2").show();
      let condition = {
        deptId: $("#placeCode").val(),
        date1: $("#date1").val(),
        date2: $("#date2").val(),
        type
      };
      let url = "http://10.33.66.183:2334/iserver/services/data-gt8/rest/data";
      sugon
        .request(sugon.interFaces.myhc.myzs.getYlldPcsData, condition)
        .then(result => {
          sjPcsData = result.data;
          let sqlParam = new SuperMap.GetFeaturesBySQLParameters({
            queryParameter: {
              name: "gajg_pcszrq_3201_pg@ORCL_gt8",
              attributeFilter: "DWBM like '3201%' and DWMC like '%派出所'",
              fields: ["DWBM", "DWMC"],
              orderBy: "DWBM"
            },
            datasetNames: ["ORCL_gt8:gajg_pcszrq_3201_pg"],
            toIndex: -1
          });
          L.supermap
            .featureService(url)
            .getFeaturesBySQL(sqlParam, function(serviceResult) {
              let resultData = serviceResult.result.features.features;
              map.removeLayer(pcsLayerGroup);
              pcsLayerGroup = L.layerGroup();
              // 热力图数据
              let heatMapData = [];
              resultData.map(val1 => {
                sjPcsData.map(val2 => {
                  let color,
                    fillOpacity = 0.2;
                  if (val1.properties.DWBM == val2.code) {
                    if (val2.type == 5) {
                      val2.latlng.map((val, index) => {
                        if (!heatMapData[index]) {
                          heatMapData[index] = [];
                        }
                        heatMapData[index].push(...val);
                      });
                    }
                    switch (val2.type) {
                      case "0":
                        color = "#fff";
                        break;
                      case "1":
                        color = "#fff176";
                        break;
                      case "2":
                        color = "#ffee58";
                        break;
                      case "3":
                        color = "#ffeb3b";
                        break;
                      case "4":
                        color = "#fdd835";
                        break;
                      case "5":
                        color = "#fbc02d";
                        fillOpacity = 0.4;
                        break;
                    }
                    let layer = L.polygon(
                      changeLonAndLat(val1.geometry.coordinates),
                      {
                        color: color,
                        fillOpacity,
                        weight: 0,
                        code: val1.properties.DWBM
                      }
                    );
                    pcsLayerGroup.addLayer(layer);
                  }
                });
              });
              map.addLayer(pcsLayerGroup);
              sugon
                .request(sugon.interFaces.myhc.myzs.getYlldMapData, condition)
                .then(result => {
                  let sqlParam = new SuperMap.GetFeaturesBySQLParameters({
                    queryParameter: {
                      name: "gajg_pcszrq_3201_pg@ORCL_gt8",
                      attributeFilter: "DWBM like '%000000' ",
                      fields: ["DWBM", "DWMC"],
                      orderBy: "DWBM"
                    },
                    datasetNames: ["ORCL_gt8:gajg_pcszrq_3201_pg"],
                    toIndex: -1
                  });
                  L.supermap
                    .featureService(url)
                    .getFeaturesBySQL(sqlParam, function(serviceResult) {
                      let resultData = serviceResult.result.features.features;
                      map.setView(zoomArr[0].center, zoomArr[0].zoom);
                      map.removeLayer(allFjLayerGroup);
                      map.removeLayer(allFjMarkerGroup);
                      allFjLayerGroup = L.layerGroup();
                      allFjMarkerGroup = L.layerGroup();
                      result.data.map(val1 => {
                        let code = val1.code;
                        resultData.map(val2 => {
                          if (code == val2.properties.DWBM) {
                            val1.data = val2.geometry.coordinates;
                          }
                        });
                        fjData.map(val2 => {
                          if (code == val2.code) {
                            val1.name = val2.name;
                            val1.lat = val2.lat;
                            val1.lng = val2.lng;
                          }
                        });
                      });
                      // 在添加之前置空
                      result.data.map(function(val) {
                        let resultLayer = L.polygon(changeLonAndLat(val.data), {
                          color: "#41b5ff",
                          fillOpacity: 0,
                          weight: 2,
                          code: val.code
                        });
                        let center = L.latLngBounds(
                          changeLonAndLat(val.data)
                        ).getCenter();
                        resultLayer.on(
                          {
                            click: function() {
                              level021(val.code, val.code, center, true);
                            },
                            mouseover: function(e) {
                              let code = e.target.options.code,
                                subCode = code.substring(0, 6);
                              map.eachLayer(function(layer) {
                                if (
                                  layer.options.code &&
                                  layer.options.code.indexOf(subCode) > -1 &&
                                  code != layer.options.code &&
                                  layer.setStyle
                                ) {
                                  let fillOpacity =
                                    layer.options.fillOpacity == 0.2
                                      ? 0.35
                                      : 0.6;
                                  layer.setStyle({
                                    fillOpacity
                                  });
                                }
                                if (layer.options.code == code) {
                                  layer.setStyle({
                                    weight: 4
                                  });
                                }
                                if (layer._leaflet_id == e.target._leaflet_id) {
                                  let $div = $(
                                    'div.bubble-marker[code="' +
                                      e.target.options.code +
                                      '"]'
                                  );
                                  $div
                                    .stop()
                                    .animate({ top: "5px" }, 200, function() {
                                      $div.stop().animate({ top: "0" }, 200);
                                    });
                                }
                              });
                            },
                            mouseout: function(e) {
                              map.eachLayer(function(layer) {
                                if (
                                  layer.options.code &&
                                  layer.options.fillOpacity == 0.6 &&
                                  layer.setStyle
                                ) {
                                  layer.setStyle({
                                    fillOpacity: 0.4
                                  });
                                }
                                if (layer.options.weight == "4") {
                                  layer.setStyle({
                                    weight: 2
                                  });
                                }
                                if (
                                  layer.options.code &&
                                  layer.options.fillOpacity == 0.35 &&
                                  layer.setStyle
                                ) {
                                  layer.setStyle({
                                    fillOpacity: 0.2
                                  });
                                }
                              });
                            }
                          },
                          true
                        );
                        allFjLayerGroup.addLayer(resultLayer);
                        let len = val.name.length * 14 + 20;
                        let value = Number(val.value).toFixed(2);
                        let percentLen = value.length * 14;
                        let divIcon = L.divIcon({
                          html: `<div style="width: ${len}px;" code="${val.code}" class="bubble-marker bubble-marker${val.type}">
                                                    <div></div>
                                                    <div style="width: ${percentLen}px;">${value}%</div>
                                                    <div>${val.name}</div>
                                                    </div>`,
                          iconAnchor: [len / 2, 65]
                        });
                        let marker = L.marker([val.lat, val.lng], {
                          icon: divIcon
                        });
                        allFjMarkerGroup.addLayer(marker);
                      });
                      map.addLayer(allFjLayerGroup);
                      map.addLayer(allFjMarkerGroup);
                      dynamicHeat(heatMapData);
                    });
                });
            });
        });
      initRightPanel2(type);
    }

    // 绑定动态热力图
    function dynamicHeat(heatMapData) {
      renderHeatMap(heatMapData.reduce((a, b) => a.concat(b)));
      let flag = 0,
        start = "animate-btn-start",
        stop = "animate-btn-stop",
        disabled = "animate-btn-disabled";
      $(`.${disabled}`)
        .removeClass(disabled)
        .addClass(start);
      $(".search-down-panel > button")
        .off("click")
        .on("click", e => {
          let $target = $(e.target),
            className = $target.attr("class");
          if (className != disabled) {
            if (className == start) {
              $(`.${start}`)
                .removeClass(start)
                .addClass(stop);
              renderHeatMap(heatMapData[flag]);
              flag++;
              timer = setInterval(function() {
                if (flag == heatMapData.length) {
                  flag = 0;
                  clearInterval(timer);
                  $(".search-down-panel > button")
                    .removeAttr("class")
                    .addClass("animate-btn-start");
                  renderHeatMap(heatMapData.reduce((a, b) => a.concat(b)));
                } else {
                  renderHeatMap(heatMapData[flag]);
                  flag++;
                }
              }, 1000);
            } else {
              $(`.${stop}`)
                .removeClass(stop)
                .addClass(start);
              clearInterval(timer);
              renderHeatMap(heatMapData.reduce((a, b) => a.concat(b)));
            }
          }
        });
      $(".bubble-marker > div:nth-child(2)").hide();
    }

    // 初始化右侧面板
    function initRightPanel2(type) {
      let deptId = $("#placeCode").val(),
        date1 = $("#date1").val(),
        date2 = $("#date2").val();
      let option = { deptId, date1, date2, type };
      let optionArr = [
        { deptId, date1, date2, type: 1 },
        { deptId, date1, date2, type: 2 }
      ];
      optionArr.map(val => {
        initYlldRight1(val);
      });
      initYlldRight2(option);
      // initYlldRight3(option);
      initYlldRight4(option);
    }

    // 初始化右1面板
    function initYlldRight1(condition) {
      sugon
        .request(sugon.interFaces.myhc.myzs.getYlldMapRight1, condition)
        .then(result => {
          let data = result,
            $container = $(".right-up-banner2").eq(condition.type - 1);
          $container.find(".right-up-banner-left2").html(data.data[0] + "%");
          let $body = $container.find(".right-up-banner-right2").empty();
          let colorIconArr = [];
          for (let i = 0, len = data.data.length; i < len; i++) {
            if (i === 4 || i === 6) {
              data.data[i] = -data.data[i];
            }
            colorIconArr.push(handleColorAndIcon(data.data[i]));
            data.data[i] = Math.abs(Number(data.data[i]));
          }
          let html = `<div><span>同比</span>
                                    <div class="${colorIconArr[1].color}">
                                    <i class="glyphicon ${
                                      colorIconArr[1].icon
                                    }"></i><strong>${data.data[1]}%</strong>
                                    </div>
                                </div>
                                <div><span>环比</span>
                                    <div class="${colorIconArr[2].color}">
                                    <i class="glyphicon ${
                                      colorIconArr[2].icon
                                    }"></i><strong>${data.data[2]}%</strong>
                                    </div>
                                </div>`;
          $body.append(html);
          let text = `<span style="margin-left: 5px;">市局排名:
                                    <strong class="${colorIconArr[3].color}">${
            data.data[3]
          }</strong>名
                                </span>
                                ${
                                  data.data[4] == 0
                                    ? ""
                                    : `<i class="glyphicon ${
                                        colorIconArr[4].icon
                                      } ${colorIconArr[4].color}"></i>
                                    <strong class="${colorIconArr[4].color}">${
                                        data.data[4]
                                      }</strong>`
                                }`;
          switch (data.type) {
            case "0":
              text = "";
              break;
            case "1":
              text = `<span style="margin-left: 5px;">
                                    市局排名:<strong class="${
                                      colorIconArr[3].color
                                    }">${data.data[3]}</strong>名
                                </span>
                                <span style="margin-left: 15px;">
                                    较上期:<i class="glyphicon ${
                                      colorIconArr[4].icon
                                    } ${colorIconArr[4].color}"></i>
                                        <strong class="${
                                          colorIconArr[4].color
                                        }">${data.data[4]}</strong>
                                </span>`;
              break;
            case "2":
              text += `<span style="margin-left: 10px;">
                                    分局排名:<strong class="${
                                      colorIconArr[5].color
                                    }">${data.data[5]}</strong>名
                                 </span>${
                                   data.data[6] == 0
                                     ? ""
                                     : `<i class="glyphicon ${
                                         colorIconArr[6].color
                                       } ${colorIconArr[6].icon}"></i>
                                 <strong class="${colorIconArr[6].color}">${
                                         data.data[6]
                                       }</strong>`
                                 }`;
              break;
            case "4":
              text += `<span style="margin-left: 10px;">
                                    所队排名:<strong class="${
                                      colorIconArr[5].color
                                    }">${data.data[5]}</strong>名
                                 </span>
                                 ${
                                   data.data[6] == 0
                                     ? ""
                                     : `<i class="glyphicon ${
                                         colorIconArr[6].color
                                       } ${colorIconArr[6].icon}"></i>
                                 <strong class="${colorIconArr[6].color}">${
                                         data.data[6]
                                       }</strong>`
                                 }`;
              break;
          }
          $container.css("height", text ? "125px" : "100px");
          $container.find(".banner-pop").remove();
          let $div = $("<div/>").addClass("banner-pop");
          $div.append(text).appendTo($container);
        });
    }

    // 初始化右2面板
    function initYlldRight2(condition) {
      sugon
        .request(sugon.interFaces.myhc.myzs.getYlldMapRight2, condition)
        .then(result => {
          let data = result.data,
            sum = 0;
          data.map(val => {
            sum += Number(val.value);
          });
          let chart = echarts.init(document.getElementById("right-ybfx"));
          let option = {
            title: {
              text: sum,
              subtext: "有效样本量",
              left: "center",
              top: "25%",
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
                data: data
              }
            ]
          };
          chart.setOption(option);
          chart.resize();
        });
    }

    // 初始化右3面板
    function initYlldRight3(condition) {
      condition.id || (condition.id = "");
      sugon
        .request(sugon.interFaces.myhc.myzs.getYlldMapRight3, condition)
        .then(result => {
          let data = result.data;
          let chart = echarts.init(document.getElementById("right-sqfl"));
          let xData = [],
            yData = [],
            colorArr = ["#4e99dd", "#E28C51", "#6eaba3"];
          data.map((val, index) => {
            let { id, value } = val;
            xData.push(val.name);
            yData.push({
              id,
              value,
              itemStyle: {
                color: colorArr[index]
              }
            });
          });
          let option = {
            tooltip: {
              trigger: "axis",
              axisPointer: {
                type: "shadow"
              }
            },
            grid: {
              left: 10,
              top: 30,
              right: 20,
              bottom: 10,
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
                axisTick: { show: false },
                splitLine: {
                  lineStyle: {
                    color: "#d5d8e1"
                  }
                },
                splitArea: { show: false },
                splitNumber: 5,
                axisLabel: {
                  formatter: "{value}",
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
                barWidth: 30,
                data: yData,
                label: {
                  show: true,
                  position: "top",
                  color: "#000",
                  fontSize: 16
                }
              }
            ]
          };
          chart.setOption(option);
          chart.off();
          chart.on("click", param => {
            if (param.data.id) {
              condition.id = param.data.id;
              initYlldRight3(condition);
              $(".img-sqfl").show();
            }
          });
        });
    }

    // 初始化右4面板
    function initYlldRight4(condition, color = "#027ecb") {
      condition.orderBy || (condition.orderBy = "asc");
      sugon
        .request(sugon.interFaces.myhc.myzs.getYlldMapRight4, condition)
        .then(result => {
          let data = result.data;
          let $body = $(".right-phb").empty();
          data.map(val => {
            $body.append(
              `<div><div>第${val.order}名</div><div>${val.name}</div><div>${val.value}%</div></div>`
            );
          });
          $(".right-phb > div > div:nth-child(3)").css("color", color);
        });
    }

    // 渲染热点问题面板
    function renderRdwtPanel(result) {
      let $body = $(".data-panel4").empty(),
        html = "";
      html += `<div class="data-panel-header4">
                            <img src="../../img/myhc/myzs/cube.png">
                            <span>区域群众诉求</span>
                            <i class="glyphicon glyphicon-remove"></i>
                        </div><h5>区域热点问题：</h5>`;
      result.data1.map((val, index) => {
        html += `<p ywid="${val.ywid}">${index + 1}、${val.name}</p>`;
      });
      html += `<h5>问题预警：</h5>`;
      html += "<div class='clear-div'></div>";
      result.data2.map((val, index) => {
        let colorAndIcon = handleColorAndIcon(val.trend),
          inc = val.trend > 0 ? "上升" : "下降";
        html += `<div class="rdwt-row">
                            <div>${index + 1}、${val.name}</div>
                            <div>词频： ${val.value}</div>
                            <div>较上期呈:<span class="${
                              colorAndIcon.color
                            }">${inc}趋势</span><i class="glyphicon ${
          colorAndIcon.icon
        } ${colorAndIcon.color}"></i></div>
                         </div>`;
      });
      $body.append(html);
    }

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
            .request(sugon.interFaces.myhc.myzs.getCkfwqRankPopup, condition)
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

    // 页面入口
    $(function() {
      // 加载数据接口
      onLoad("");
      // 加载地图
      createMapL();
    });

    // 禁用全局右击事件
    $("#mainMap").bind("contextmenu", function() {
      return false;
    });

    // pop-ck-down-true点击事件
    document.addEventListener(
      "click",
      function(e) {
        let $target = $(e.target);
        if ($target.hasClass("pop-mid")) {
          e.stopPropagation();
          let $parent = $target.parent();
          let code = $parent.attr("code") || $parent.parent().attr("code");
          let codeExist = false,
            index;
          for (let key in ckGroup._layers) {
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
          let code = $target.parent().attr("code");
          let subCode = code.substring(0, 6);
          map.removeLayer(ckGroup);
          map.closePopup();
          isLoadBounds = true;
          let sqlParam = new SuperMap.GetFeaturesBySQLParameters({
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
          let url =
            "http://10.33.66.183:2334/iserver/services/data-gt8/rest/data";
          L.supermap
            .featureService(url)
            .getFeaturesBySQL(sqlParam, function(serviceResult) {
              map.on("mouseup", function(e) {
                let which = e.originalEvent.which;
                if (which == 3) {
                  initCk();
                }
              });
              let data = serviceResult.result.features.features;
              if (data && data.length > 0) {
                map.removeLayer(ckBorderGroup);
                ckBorderGroup = L.layerGroup();
                data.map(function(val) {
                  let resultLayer = L.polygon(
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
    $(".toolbar-panel").on("change", ".search-yw", function() {
      let index = $(this).val();
      if (currentLevel == 5) {
        resetPage(index);
      } else {
        initLevelLayer();
      }
    });

    // 左下查询条件改变事件
    $(".data-panel-search").on("click", "div", function(e) {
      let $div = $(".data-panel-search > div");
      let index = $div.index(e.target);
      if (!$(e.target).hasClass("search-selected")) {
        $div.removeClass("search-selected");
        $(e.target).addClass("search-selected");
        initTab($(".search-yw").val(), "", index);
      }
    });

    // 数据panel关闭事件
    $(".data-panel .data-panel-header > i").click(function() {
      $(".data-panel").hide();
    });

    // 数据panel2关闭事件
    $(".data-panel2 .data-panel-header > i").click(function() {
      $(".data-panel2").hide();
    });

    // 诉求分类返回按钮
    $("body").on("click", ".img-sqfl", e => {
      let conditon = {
        deptId: $("#placeCode").val(),
        date1: $("#date1").val(),
        date2: $("#date2").val(),
        type: $(".search-yw2").val()
      };
      initYlldRight3(conditon);
      $(e.target).hide();
    });

    // 排行榜排序方式按钮
    $(".right-header").on("click", ".img-phb", e => {
      let $target = $(e.target),
        className = "img-phb-rotate",
        condition = {
          deptId: $("#placeCode").val(),
          date1: $("#date1").val(),
          date2: $("#date2").val(),
          type: $(".search-yw2").val(),
          orderBy: ""
        },
        color;
      if ($target.hasClass(className)) {
        condition.orderBy = "asc";
        color = "#027ecb";
        $target.removeClass(className);
      } else {
        condition.orderBy = "desc";
        $target.addClass(className);
        color = "#ED5554";
      }
      initYlldRight4(condition, color);
    });

    // 工具切换时
    $(".search-gj").on("change", function() {
      let index = $(this).val(),
        type = $(".search-control").val();
      $(".search-down-panel > button")
        .removeAttr("class")
        .addClass("animate-btn-disabled");
      clearInterval(timer);
      type == "1" ? sqfbGjChange(index) : myzsGjChange(index);
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
    $(".data-panel .data-panel-tab").on(
      "click",
      ".data-panel-tab-row",
      function(e) {
        let $target = $(e.target);
        $target = $target.hasClass("data-panel-tab-row")
          ? $target
          : $target.parent();
        let ywid = $target.attr("ywid");
        for (let key in queryGroup._layers) {
          if (queryGroup._layers[key]._popup._content.indexOf(ywid) > 0) {
            queryGroup._layers[key].openPopup();
          }
        }
      }
    );

    // 左下tab点击事件
    $(".data-panel2 .data-panel-tab").on(
      "click",
      ".data-panel-tab-row",
      function(e) {
        let $target = $(e.target);
        $target = $target.hasClass("data-panel-tab-row")
          ? $target
          : $target.parent();
        let ywid = $target.attr("ywid");

        ckMarkerGroups2.map(val => {
          for (let key in val._layers) {
            let layer = val._layers[key];
            if (layer.options.ywid == ywid) {
              let type;
              if (layer.options.type == "1") {
                type = "2";
              } else if (layer.options.type == "2") {
                type = "1";
              } else {
                type = layer.options.type;
              }
              openCkPulsePopup(layer.options.ywid, layer, type);
              break;
            }
          }
        });
      }
    );

    // 左下tab点击事件
    $(".data-panel3 .data-panel-tab3").on(
      "click",
      ".data-panel-tab-row",
      function(e) {
        let $target = $(e.target);
        $target = $target.hasClass("data-panel-tab-row")
          ? $target
          : $target.parent();
        let ywid = $target.attr("ywid");
        for (let key in markerClusterGroup._layers) {
          if (
            markerClusterGroup._layers[key]._popup._content.indexOf(ywid) > 0
          ) {
            markerClusterGroup._layers[key].openPopup();
          }
        }
      }
    );

    // 分析按钮点击事件
    $(".analysis-btn").click(function() {
      let keywordArr = [],
        timesArr = [],
        idArr = {},
        result = [];
      selectedData.map(function(value) {
        let sqwtArr = (value.sqwt || "").split(",");
        sqwtArr.map(function(value1) {
          let index = keywordArr.indexOf(value1);
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
        let obj = { name: value, value: timesArr[index], id: idArr[value] };
        result.push(obj);
      });
      result.map(function(val1, i) {
        result.map(function(val2, j) {
          if (val1.value > val2.value) {
            let temp = result[i];
            result[i] = result[j];
            result[j] = temp;
          }
        });
      });
      let $container = $(".pop-rdwtfx");
      let $body = $('<div class="pop-map-mark-body"></div>');
      $container
        .show()
        .empty()
        .append(
          $(
            '<div class="pop-map-mark-header">区域热点问题<i class="glyphicon glyphicon-remove"></i></div>'
          )
        );
      let size = result.length < 4 ? result.length : 3;
      for (let i = 0; i < size; i++) {
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
      let $this = $(this),
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
        ckMarkerGroups2.map(val => {
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
        if (ckMarkerGroups2[3]) {
          map.removeLayer(ckMarkerGroups2[3]);
        }
        if ($this.hasClass(className)) {
          $this.removeClass(className);
          map.removeLayer(ckMarkerGroups2[index]);
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
      let $this = $(this);
      let idArr = $this.attr("ywid").split(",");
      map.eachLayer(function(layer) {
        if (layer._popup) {
          let content = layer._popup._content;
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
      let deptCode = $(".map-mark-right-title").attr("deptCode");
      let code = $(this).attr("code");
      sugon.requestJson(
        {
          type: "post",
          url: sugon.interFaces.myhc.myzs.getCkRdwtDetail,
          data: {
            deptCode: deptCode,
            date1: $("#date1").val(),
            date2: $("#date2").val(),
            code: code
          },
          async: true
        },
        function(result) {
          let str = "",
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
          let ele = '<div class="map-mark-right-pop">' + str + "</div>";
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
      let className = "search-nav-selected",
        $this = $(this);
      if (!$this.hasClass(className)) {
        $(".search-pop-nav > div").removeClass(className);
        $this.addClass(className);
        reRenderChart($this.index(".search-pop-nav > div") + 1);
      }
    });

    // 面板第四列控制下拉框改变时间
    $(".search-control").on("change", function() {
      $(".search-down-panel > button")
        .removeAttr("class")
        .addClass("animate-btn-disabled");
      clearInterval(timer);
      let $this = $(this),
        index = $this.val(),
        yw1 = $(".search-yw"),
        yw2 = $(".search-yw2"),
        $toolbar = $(".toolbar-panel > div:nth-child(5)"),
        bmqOption = $(".bmq-option");
      if (index == 1) {
        yw2.hide();
        yw1.show();
        $toolbar.css(
          "background",
          "url('../../img/myhc/myzs/service.png') no-repeat 0 50%"
        );
        bmqOption.hide();
        getAllFjData();
      } else {
        yw1.hide();
        yw2.show();
        bmqOption.show();
        $toolbar.css("background", "none");
        removeAllLayers();
        initMyzs();
      }
    });

    // 业务2改变时间
    $(".toolbar-panel").on("change", ".search-yw2", function() {
      let index = $(this).val();
      if (index == 3) {
        initCk();
      } else {
        $(".ck-popup").remove();
        initMyzs(index);
      }
    });

    // data-panel3关闭按钮事件
    $(".data-panel-header3 > i").click(() => {
      $(".data-panel3").hide();
    });

    // 热点问题弹出页
    $(".analysis-btn3").click(() => {
      $(".data-panel3").hide();
      $(".data-panel4").show();
      let flag = $(".data-panel3").attr("isQuery");
      if (flag == "1") {
        let bound = map.getBounds();
        let idArr = [],
          id0Arr = [];
        selectedData.map(val => {
          idArr.push(val.ywid);
        });
        hiddenSelectedData.map(val => {
          id0Arr.push(val.ywid);
        });
        let condition = {
          deptId: $("#placeCode").val(),
          date1: $("#date1").val(),
          date2: $("#date2").val(),
          northEast: JSON.stringify(bound._northEast),
          southWest: JSON.stringify(bound._southWest),
          type: $(".search-yw2").val(),
          ids: idArr.join(","),
          ids0: id0Arr.join(",")
        };
        sugon
          .request(sugon.interFaces.myhc.myzs.getYlldRdsjByBound, condition)
          .then(result => {
            renderRdwtPanel(result);
          });
      } else {
        renderRdwtPanel(rdwtData);
      }
    });

    // 热点问题弹出页关闭
    $(".data-panel4").on("click", ".data-panel-header4 > i", () => {
      $(".data-panel4").hide();
      $(".data-panel3").show();
      recoverMarker();
    });

    // 热点问题p标签点击事件
    $(".data-panel4").on("click", "p", e => {
      let $target = $(e.target);
      $(".data-panel4 > p").css("background-color", "transparent");
      $target.css("background-color", "#409cf1");
      recoverMarker();
      selected_ywid = $(e.target).attr("ywid");
      let arr = selected_ywid.split(" ");
      map.eachLayer(function(layer) {
        if (layer._popup) {
          arr.map(val => {
            if (layer.options.ywid == val && layer.setIcon) {
              layer.setIcon(
                L.icon({
                  iconUrl: "../../img/myhc/myzs/location_selected.png",
                  popupAnchor: [10, 5]
                })
              );
            }
          });
        }
      });
    });

    // 下拉按钮事件
    $(".btn-up-down > div").on("click", e => {
      let $target = $(e.target),
        className = $target.attr("class"),
        up = "btn-up",
        down = "btn-down",
        newClassName,
        $panel = $(".data-panel3"),
        height,
        mapHeight = $("#mainMap").height(),
        $tab = $(".data-tab-container"),
        overflow;
      if (className == up) {
        newClassName = down;
        height = "110px";
        overflow = "auto";
      } else {
        newClassName = up;
        height = `${mapHeight - 180}px`;
        overflow = "hidden";
      }
      $target.removeClass(className).addClass(newClassName);
      $panel.animate({ height: height });
      $tab.css("overflow", overflow);
    });

    // 右侧面板弹出页事件
    $(".right-up-banner2").on("click", function() {
      let $this = $(this),
        index = $this.index(".right-up-banner2"),
        title = index === 0 ? "社会治安" : "公安队伍",
        condition = {
          deptId: $("#placeCode").val(),
          date1: $("#date1").val(),
          date2: $("#date2").val(),
          type: index + 1
        };
      sugon.renderDialog({
        width: 600,
        height: 400,
        ele: `<div id="right-sqfl"></div>
                      <img src="../../img/myhc/myzs/return-btn.png" class="img-sqfl">`,
        title: `${title}满意度群众不满意诉求`
      });
      $(".simple_shade").remove();
      initYlldRight3(condition);
    });
  }
);
