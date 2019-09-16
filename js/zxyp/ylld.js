var zsfxChart;
requirejs(["common", "ec"], function(sugon, ec) {
  // 全局查询尺度
  var searchRuler = {};
  var popData = []; // 弹出页数据
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

  // 初始化左1面板
  var initLeft1 = function() {
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
            let { name1, name2, name3, value1, value2, value3 } = result.data[
              i
            ];
            popData.push({ name1, name2, name3, value1, value2, value3 });
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

  // 初始化左2面板
  var initLeft2 = function() {
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
            trigger: "axis"
            // formatter: function(params) {
            //   var tempStr =
            //     params[0].name +
            //     "<br />" +
            //     params[0].seriesName +
            //     "：" +
            //     params[0].value +
            //     "%<br />" +
            //     params[1].seriesName +
            //     "：" +
            //     params[1].value +
            //     "%<br />" +
            //     params[2].seriesName +
            //     "：" +
            //     params[2].value +
            //     "%";
            //   return tempStr;
            // }
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
            }
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

  // 初始化左3面板
  var initLeft3 = function(index) {
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

  // 初始化中左面板
  function initMidLeft(type = 1) {
    let id = type == 1 ? "mid1-left" : "mid2-left";
    let { deptId, date1, date2 } = searchRuler;
    sugon
      .request(sugon.interFaces.zxyp.ylld.initMidLeft, {
        deptId,
        date1,
        date2,
        type
      })
      .then(result => {
        let data = result.data,
          total = 0;
        data.map(val => {
          total += Number(val.value);
        });
        $(`.chart-pop${type} .pop-amount`).html(total);
        let chart = ec.init(document.getElementById(id));
        let option = {
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
        chart.off();
        chart.on("click", param => {
          initMidRight(type, param.data.id);
        });
      });
  }

  // 初始化中右面板
  function initMidRight(type = 1, leftId = "") {
    let id = type == 1 ? "mid1-right" : "mid2-right";
    let { deptId, date1, date2 } = searchRuler;
    sugon
      .request(sugon.interFaces.zxyp.ylld.initMidRight, {
        deptId,
        date1,
        date2,
        type,
        id: leftId
      })
      .then(result => {
        let chart = ec.init(document.getElementById(id)),
          xData = [],
          yData = [],
          data = result.data;
        data.map(val => {
          xData.push(val.name);
          yData.push(val.value);
        });
        let minAndMax = sugon.handleMinAndMax(data);
        let option = {
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow"
            }
          },
          color: ["#1a9cd9"],
          grid: {
            left: 0,
            top: 20,
            right: 0,
            bottom: 0,
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
                  color: "#000"
                }
              }
            }
          ],
          yAxis: [
            {
              type: "value",
              // min: minAndMax.min,
              // max: minAndMax.max,
              axisTick: { show: false },
              splitLine: {
                show: false,
                lineStyle: {
                  color: "#000"
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
                  color: "#000"
                }
              }
            }
          ],
          series: [
            {
              type: "bar",
              barWidth: 20,
              itemStyle: {
                barBorderRadius: [3, 3, 0, 0]
              },
              data: yData
            }
          ]
        };
        chart.setOption(option);
      });
  }

  // 初始化中1面板
  var initMid1 = function() {
    initMidLeft(1);
    initMidRight(1);
  };

  // 初始化中2面板
  var initMid2 = function() {
    initMidLeft(2);
    initMidRight(2);
  };

  // 初始化中3面板
  var initMid3 = function() {
    let { deptId, date1, date2 } = searchRuler;
    sugon
      .request(sugon.interFaces.zxyp.ylld.initMid3, { deptId, date1, date2 })
      .then(result => {
        let $body = $(".mid3").empty(),
          data = result.data,
          dom = "";
        data.map(val => {
          dom += `<div>
                  <div>${val.name}</div>
                  <div>${val.value1}</div>
                  <div>${val.value2}</div>
                  <div>${val.value3}</div>
                </div>`;
        });
        $body.append(dom);
      });
  };

  // 初始化右1面板
  var initRight1 = function() {
    let { deptId, date1, date2 } = searchRuler;
    sugon
      .request(sugon.interFaces.zxyp.ylld.initRight1, { deptId, date1, date2 })
      .then(result => {
        let data1 = result.data1,
          data = result.data2,
          xData = [],
          yData = [],
          len = data.length,
          colorArr = [
            "#489EF1",
            "#F2D50F",
            "#FF7170",
            "#70C0B3",
            "#56ABE1",
            "#7FE3FB",
            "#5cc8e1",
            "#53aec3",
            "#3d91a4"
          ],
          transparentData = {
            value: 0,
            name: "",
            itemStyle: {
              normal: {
                color: "transparent"
              },
              label: {
                show: false
              },
              labelLine: {
                show: false
              }
            }
          };
        for (var i = 0; i < len; i++) {
          xData.push(data[i].name);
          var obj = {
            name: data[i].name,
            value: data[i].value,
            itemStyle: {
              normal: {
                color: colorArr[i],
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                }
              }
            }
          };
          yData.push(obj);
        }
        for (var i = 0; i < len; i++) {
          yData.push(transparentData);
        }
        $("#right1-strong").html(data1 + "%");
        let chart = ec.init(document.getElementById("right1-chart"));
        let option = {
          calculable: true,
          tooltip: {
            trigger: "item",
            formatter: "{b}:{c}"
          },
          series: [
            {
              type: "pie",
              radius: [50, 140],
              avoidLabelOverlap: false,
              startAngle: 0,
              center: ["50%", "10%"],
              roseType: "area",
              label: {
                show: true,
                formatter: function(param) {
                  return param.data.name + "\n" + param.data.value;
                }
              },
              labelLine: {
                show: true,
                length: -5,
                length2: 2
              },
              selectedMode: "single",
              data: yData
            }
          ]
        };
        chart.setOption(option);
      });
  };

  // 初始化右2面板
  var initRight2 = function() {
    let { deptId, date1, date2 } = searchRuler;
    sugon
      .request(sugon.interFaces.zxyp.ylld.initRight2, { deptId, date1, date2 })
      .then(result => {
        let chart = ec.init(document.getElementById("right2-chart"));
        $("#right2-strong").html(result.data2);
        let data = [
          {
            value: result.data1
          }
        ];
        let option = {
          tooltip: {
            formatter: "{b} : {c}%"
          },
          series: [
            {
              type: "gauge",
              radius: "90%",
              center: ["50%", "59%"],
              detail: {
                color: "#0380FF",
                fontSize: "16",
                formatter: "{value}%"
              },
              data: data,
              min: 0,
              max: 100,
              title: {
                show: false
              },
              axisLine: {
                // 坐标轴线
                show: true,
                lineStyle: {
                  // 属性lineStyle控制线条样式
                  color: [
                    [
                      0.98,
                      new ec.graphic.LinearGradient(0, 0, 1, 0, [
                        { offset: 0, color: "#8FE8F0" },
                        { offset: 1, color: "#A6BAFF" }
                      ])
                    ],
                    [1, "red"]
                  ],
                  width: 5,
                  shadowColor: "#fff" //默认透明
                  //shadowBlur: 10
                }
              },
              axisTick: {
                // 坐标轴小标记
                show: false,
                length: 4, // 属性length控制线长
                lineStyle: {
                  // 属性lineStyle控制线条样式
                  color: "#BDBDBD",
                  shadowColor: "#fff"
                  //默认透明
                }
              },
              axisLabel: {
                show: true,
                distance: -45,
                fontSize: 10
              },
              pointer: {
                show: true,
                length: "80%",
                width: 2
              },
              itemStyle: {
                color: "#8692AC"
              },
              splitLine: {
                show: false
              }
            }
          ]
        };
        chart.setOption(option);
      });
  };

  // 初始化右3面板
  var initRight3 = function() {
    let { deptId, date1, date2, type1, type2 } = searchRuler;
    sugon
      .request(sugon.interFaces.zxyp.ylld.initRight3, {
        deptId,
        date1,
        date2,
        type1,
        type2
      })
      .then(result => {
        let dom = "";
        result.data.map((val, index) => {
          let icon;
          switch (index) {
            case 0:
              icon = "one";
              break;
            case 1:
              icon = "two";
              break;
            case 2:
              icon = "three";
              break;
            case 3:
              icon = "four";
              break;
            case 4:
              icon = "five";
              break;
          }
          dom += `<div>
                  <div style="background:url(../../img/zxyp/jcj/${icon}.png) no-repeat center center;"></div>
                  <div>${val.value1}</div>
                  <div>${val.value2}%</div>
                </div>`;
        });
        $(".right3")
          .empty()
          .append(dom);
      });
  };

  // 初始化下拉框
  function initSelector() {
    sugon.request(sugon.interFaces.zxyp.ylld.initSelector, {}).then(result => {
      let dom = "";
      result.data.map(val => {
        dom += `<option value="${val.id}">${val.name}</option>`;
      });
      $("#type2")
        .empty()
        .append(dom);
      searchRuler.type2 = "0";
    });
  }

  var initView = function() {
    initSelector();
    // 左1
    initLeft1();
    // 左2
    initLeft2();
    // 左3
    initLeft3(0);
    // 中1
    initMid1();
    // 中2
    initMid2();
    // 中3
    initMid3();
    // 右1
    initRight1();
    // 右1
    initRight2();
    // 右3
    initRight3();
  };

  var initPage = function() {
    // 初始化查询栏
    initSearchBar();
    // 初始化页面
    $(".search-btn").bind("click", function() {
      searchRuler.deptId = $("#placeCode").val();
      searchRuler.date1 = $("#date-input1").val();
      searchRuler.date2 = $("#date-input2").val();
      searchRuler.deptName = $("#place").val();
      searchRuler.type1 = "0";
      searchRuler.type2 = "0";
      initView();
    });
    initView();
  };

  // 页面入口
  $(function() {
    initPage();
  });

  $("#dept2").change(function() {
    initLeft3(0);
  });

  $(".tab2>div")
    .unbind()
    .bind("click", function() {
      $(".tab2 .selected").removeClass("selected");
      $(this).attr("class", "selected");
      var index = $(".tab2>div").index(this);
      initLeft3(index);
    });

  // 右3第一个select改变事件
  $("#type1").on("change", e => {
    searchRuler.type1 = $(e.target).val();
    initRight3();
  });

  // 右3第二个select改变事件
  $("#type2").on("change", e => {
    searchRuler.type2 = $(e.target).val();
    initRight3();
  });

  // 左上鼠标悬停事件
  $("#left_top > div:nth-child(2n + 1)").on({
    mouseover: function() {
      let index = $(this).index("#left_top > div:nth-child(2n + 1)");
      let top = "",
        $container = $(".pop-container")
          .show()
          .empty();
      switch (index) {
        case 0:
          top = "83px";
          break;
        case 1:
          top = "163px";
          break;
        case 2:
          top = "243px";
          break;
      }
      $container.css("top", top).append(`
      <div>${popData[index].name1}： <strong>${popData[index].value1}</strong></div>
      <div>${popData[index].name2}： <strong>${popData[index].value2}</strong></div>
      <div>${popData[index].name3}： <strong>${popData[index].value3}</strong></div>`);
    },
    mouseout: function() {
      $(".pop-container").hide();
    }
  });
});
