requirejs(["common", "ec"], function(sugon, ec) {
  // 全局查询尺度
  let searchRuler = {};
  let popData = []; // 弹出页数据

  // 初始化左1面板
  let initLeft1 = function() {
    sugon.requestJson(
      {
        type: "POST",
        async: true,
        url: sugon.interFaces.zxyp.ylld.Txt,
        data: { search: JSON.stringify(searchRuler) }
      },
      function(result) {
        for (let i = 0; i < result.data.length; i++) {
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
  let initLeft2 = function() {
    sugon.requestJson(
      {
        type: "POST",
        async: true,
        url: sugon.interFaces.zxyp.ylld.Ylld,
        data: { search: JSON.stringify(searchRuler) }
      },
      function(result) {
        let xData = [],
          yData1 = [],
          yData2 = [],
          yData3 = [],
          iData = [];
        if (result.data.length == 0) {
          xData.push("暂无数据");
          yData1.push(0);
          yData2.push(0);
          yData3.push(0);
        } else {
          for (let i = 0; i < result.data.length; i++) {
            xData.push(result.data[i].name);
            yData1.push(result.data[i].value1);
            yData2.push(result.data[i].value2);
            yData3.push(result.data[i].value3);
            iData.push(result.data[i].id);
          }
        }
        let minAndMax = sugon.handleMinAndMax(
          yData1.concat(yData2).concat(yData3)
        );
        let chart3 = ec.init(document.getElementById("chart3"));
        chart3.off();
        chart3.on("click", function(params) {
          if (params.data != 0) {
            let seriesName = params.seriesName;
            let name = params.name;
            requirejs(["text!../views/zxyp/myd.html"], function(ele) {
              sugon.showDialog({
                width: 760,
                height: 410,
                ele: ele,
                params:
                  seriesName + "_" + name + "_" + JSON.stringify(searchRuler)
              });
            });
          }
        });

        let option = {
          color: [
            "rgb(21, 175, 137)",
            "rgb(42, 155, 213)",
            "rgb(167, 112, 179)"
          ],
          tooltip: {
            trigger: "axis"
            // formatter: function(params) {
            //   let tempStr =
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
            show: true,
            inactiveColor: "#999"
            // selected: {
            //   社会治安满意度: true,
            //   公安队伍满意度: false,
            //   社区民警熟悉率: false
            // }
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
                  color: "#5d707e"
                }
              },
              axisLabel: {
                interval: 0,
                textStyle: {
                  color: "#5d707e"
                }
              },
              splitLine: {
                show: false,
                lineStyle: {
                  color: "#5d707e"
                }
              },
              data: xData
            }
          ],
          yAxis: [
            {
              type: "value",
              splitNumber: 5,
              min: minAndMax.min,
              max: minAndMax.max,
              axisTick: {
                show: false
              },
              axisLine: {
                onZero: false,
                lineStyle: {
                  color: "#5d707e"
                }
              },
              axisLabel: {
                formatter: function(param) {
                  return Number(param).toFixed(0) + "%";
                },
                textStyle: {
                  color: "#5d707e"
                }
              },
              splitLine: {
                show: false,
                lineStyle: {
                  color: "#5d707e"
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
              data: yData3
            }
          ]
        };
        chart3.setOption(option);
        chart3.on("legendselectchanged", function(e) {
          let arr = [
              { name: "社会治安满意度", arr: yData1 },
              { name: "公安队伍满意度", arr: yData2 },
              { name: "社区民警熟悉率", arr: yData3 }
            ],
            resultArr = [];
          arr.map(val => {
            if (e.selected[val.name]) {
              val.arr.map(v => {
                resultArr.push(v);
              });
            }
          });
          let minAndMax = sugon.handleMinAndMax(resultArr);
          let newOption = chart3.getOption();
          newOption.yAxis[0].min = minAndMax.min;
          newOption.yAxis[0].max = minAndMax.max;
          chart3.setOption(newOption);
        });
      }
    );
  };

  // 初始化左3面板
  let initLeft3 = function(index) {
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
        let data = result.data[index];
        let xData = [],
          yData = [],
          startValue = 0,
          endValue = 100,
          markData = [],
          show = false,
          markNum = 0;

        if (data.length > 5) {
          endValue = Math.floor((5 / data.length) * 100);
          show = true;
        }
        for (let i = 0; i < data.length; i++) {
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
        }

        let minAndMax = sugon.handleMinAndMax(yData);

        let option = {
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow"
            },
            formatter: function(params) {
              let tempStr =
                params[0].name + "<br />数值：" + params[0].value + "%";
              return tempStr;
            }
          },
          grid: {
            left: 10,
            right: 10,
            bottom: 20,
            top: 10,
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
                  return sugon.handleStrLineFeed(param, 5);
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
              min: minAndMax.min,
              max: minAndMax.max,
              axisLabel: {
                show: true,
                formatter: function(param) {
                  return Number(param).toFixed(0) + "%";
                },
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
              name: "数值",
              type: "bar",
              barWidth: 20,
              data: yData,
              itemStyle: {
                normal: {
                  color: function(params) {
                    let tempColor = "red";
                    if (params.data > markNum) {
                      tempColor = "#209cb7";
                    }
                    return tempColor;
                  },
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
                  color: "#209cb7",
                  width: "1",
                  type: "dashed"
                },
                data: markData
              }
            }
          ]
        };

        sugon.renderChart({ id: "chart6", data, option });
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
                "#1D84C6",
                "#ED7D31",
                "#A770B3",
                "#3A9BBE",
                "#AF8744",
                "#6463AF"
              ],
              name: "",
              type: "pie",
              clockWise: false,
              center: ["50%", "50%"],
              radius: ["52%", "68%"],
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
        sugon.renderChart({ id, data, cb, option });
        // 点击回调
        function cb(param) {
          initMidRight(type, param.data.id);
        }
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
        let xData = [],
          yData = [],
          data = result.data;
        data.map(val => {
          xData.push(val.name);
          yData.push(val.value);
        });
        // let minAndMax = sugon.handleMinAndMax(yData, true);
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
            bottom: 5,
            containLabel: true
          },
          xAxis: [
            {
              type: "category",
              axisTick: { show: false },
              splitArea: { show: false },
              data: xData,
              axisLabel: {
                lineHeight: 14,
                interval: 0,
                textStyle: {
                  color: "#5d707e"
                },
                formatter: function(param) {
                  return sugon.handleStrLineFeed(param);
                },
                rich: {}
              },
              axisLine: {
                lineStyle: {
                  color: "#5d707e"
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
              minInterval: 1,
              splitLine: {
                show: false,
                lineStyle: {
                  color: "#5d707e"
                }
              },
              splitArea: { show: false },
              splitNumber: 5,
              axisLabel: {
                textStyle: {
                  color: "#5d707e"
                }
              },
              axisLine: {
                lineStyle: {
                  color: "#5d707e"
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
        sugon.renderChart({ id, data, option });
      });
  }

  // 初始化中1面板
  let initMid1 = function() {
    initMidLeft(1);
    initMidRight(1);
  };

  // 初始化中2面板
  let initMid2 = function() {
    initMidLeft(2);
    initMidRight(2);
  };

  // 初始化中3面板
  let initMid3 = function() {
    let { deptId, date1, date2 } = searchRuler;
    sugon
      .request(sugon.interFaces.zxyp.ylld.initMid3, { deptId, date1, date2 })
      .then(result => {
        let $body = $(".mid3").empty(),
          height = $body.height() / 5,
          data = result.data,
          dom = "";
        data.map(val => {
          dom += `<div style="height: ${height}px; line-height: ${height}px;">
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
  let initRight1 = function() {
    let { deptId, date1, date2 } = searchRuler;
    sugon
      .request(sugon.interFaces.zxyp.ylld.initRight1, { deptId, date1, date2 })
      .then(result => {
        let data = result.data,
          xData = [],
          yData = [],
          percentData = [],
          sum = 0,
          index,
          len = data.length,
          colorArr = [
            "#3A64EA",
            "#4384D9",
            "#4B9FE1",
            "#5DADEA",
            "#6ABEEE",
            "#78DFF7",
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
        for (let i = 0; i < len; i++) {
          data[i].name === "空错号" && (index = i);
          sum += Number(data[i].value);
          xData.push(data[i].name);
          let obj = {
            name: data[i].name,
            value: data[i].value,
            selected: data[i].name === "空错号",
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
        data.map(v => {
          percentData.push(Number((v.value / sum) * 100).toFixed(2));
        });
        for (let i = 0; i < len; i++) {
          yData.push(transparentData);
        }
        let text = `“<span>${xData[index]}”类样本占调查样本总量</span>
              <strong id="right1-strong">${percentData[index]}%</strong>`;
        $(".right1-text").html(text);
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
              selectedMode: "multiple",
              data: yData
            }
          ]
        };
        chart.setOption(option);
        chart.on("pieselectchanged", e => {
          let selectedNameArr = [],
            percentSum = 0;
          Object.keys(e.selected).forEach(key => {
            e.selected[key] && selectedNameArr.push(key);
          });
          data.map((v1, index) => {
            selectedNameArr.map(v2 => {
              v1.name === v2 && (percentSum += Number(percentData[index]));
            });
          });
          percentSum = percentSum > 100 ? 100 : percentSum;
          let text = `“<span>${selectedNameArr.join(",")}”
                        类样本占调查样本总量</span>
                <strong id="right1-strong">${percentSum.toFixed(2)}%</strong>`;
          $(".right1-text").html(text);
        });
      });
  };

  // 初始化右2面板
  let initRight2 = function() {
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
                        { offset: 0.8, color: "#A6BAFF" },
                        { offset: 1, color: "#ff0000" }
                      ])
                    ],
                    [1, "#ff0000"]
                  ],
                  width: 5
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
            },
            {
              type: "gauge",
              radius: "80%",
              center: ["50%", "59%"],
              detail: { show: false },
              data: data,
              min: 0,
              max: 100,
              title: { show: false },
              axisLine: {
                // 坐标轴线
                show: false,
                lineStyle: {
                  // 属性lineStyle控制线条样式
                  color: [[0.98, "transparent"], [1, "transparent"]],
                  width: 5
                  //shadowBlur: 10
                }
              },
              axisTick: {
                // 坐标轴小标记
                show: true,
                length: 4, // 属性length控制线长
                lineStyle: {
                  // 属性lineStyle控制线条样式
                  color: "#BDBDBD",
                  shadowColor: "#fff"
                  //默认透明
                }
              },
              axisLabel: {
                show: false,
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
  let initRight3 = function() {
    let { deptId, date1, date2, type1 = 0, type2 = 0 } = searchRuler;
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
                  <div>${val.name1}</div>
                  <div>${val.name2}</div>
                  <div>${val.value}%</div>
                </div>`;
        });
        $(".right3")
          .empty()
          .append(dom);
      });
  };

  // 初始化下拉框
  function initSelector() {
    let deptId = searchRuler.deptId;
    sugon
      .request(sugon.interFaces.zxyp.ylld.initSelector, { deptId })
      .then(result => {
        let dom = "";
        result.data.map(val => {
          dom += `<option value="${val.id}">${val.name}</option>`;
        });
        $("#type2")
          .empty()
          .append(dom);
        searchRuler.type2 = $("#type2").val();
        // 右3
        initRight3();
      });
  }

  let initView = function() {
    searchRuler.deptId = $("#dept-id").val();
    searchRuler.deptName = $("#dept-name").val();
    searchRuler.date1 = $("#date1").val();
    searchRuler.date2 = $("#date2").val();

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
  };

  let initPage = async function() {
    // 初始化查询栏
    await sugon.initSearchBar({ date1: -7, date2: -2, cb: initView });
    initView();
  };

  // 页面入口
  $(function() {
    initPage();
  });

  $("#dept2").change(function() {
    let className = "selected";
    $(".tab2 > div")
      .removeClass(className)
      .eq(0)
      .addClass(className);
    initLeft3(0);
  });

  $(".tab2>div")
    .unbind()
    .bind("click", function() {
      $(".tab2 .selected").removeClass("selected");
      $(this).attr("class", "selected");
      let index = $(".tab2>div").index(this);
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
          top = "98px";
          break;
        case 1:
          top = "178px";
          break;
        case 2:
          top = "258px";
          break;
      }
      $container.css("top", top).append(`
      <p>${popData[index].name1}： <strong>${popData[index].value1}</strong></p>
      <p>${popData[index].name2}： <strong>${popData[index].value2}</strong></p>
      <p>${popData[index].name3}： <strong>${popData[index].value3}</strong></p>`);
    },
    mouseout: function() {
      $(".pop-container").hide();
    }
  });

  $(".pop-container").on({
    mouseover: function() {
      $(".pop-container").show();
    },
    mouseout: function() {
      $(".pop-container").hide();
    }
  });

  // 返回按钮
  $(".chart-pop").on("click", function() {
    let $this = $(this);
    if ($this.hasClass("chart-pop1")) {
      initMidRight(1);
    } else {
      initMidRight(2);
    }
  });
});
