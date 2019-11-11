requirejs(["common", "ec"], (sugon, ec) => {
  // 查询栏参数
  let searchParams = {};

  // 初始化中间的面板
  const initMidPanel = async () => {
    await sugon
      .request(sugon.interFaces.myhc.rdwt.getMidData, searchParams)
      .then(result => {
        if (result.data.length > 0) {
          let { deptId, model, code } = result.data[0];
          Object.assign(searchParams, {
            detailDeptId: deptId,
            model,
            code
          });
        }
        let html = "";
        result.data.map((val, index) => {
          if (index < 3) {
            let $body = $(".mid-header > div")
              .eq(index)
              .attr("deptId", val.deptId)
              .attr("model", val.model)
              .attr("code", val.code)
              .css(
                "background",
                `url(../../img/myhc/rdwt/${val.model}.png) no-repeat center center / 100% 100%`
              );
            $body.find("strong").html(val.freq);
            $body.find(".area-div").html(`高发单位：${val.area}`);
            $body.find(".content-div").html(val.content);
          } else {
            let type =
              val.model == 1 ? "业务" : val.model == 2 ? "问题" : "队伍";
            html += `<div deptId="${val.deptId}"
                            model="${val.model}"
                            code="${val.code}">
                        <div>
                          <img src="../../img/myhc/rdwt/star.png" />
                          <span>TOP${index + 1}</span>
                        </div>
                        <div>
                          <img src="../../img/myhc/rdwt/redian.png" />
                          <span>${val.freq}</span>
                        </div>
                        <div>${type}</div>
                        <div>${val.content}</div>
                        <div>${val.area}</div>
                       </div>`;
          }
        });
        $(".mid-body")
          .empty()
          .append(html);
      });
  };

  // 初始化下面的面板
  const initBottomPanel = () => {
    searchParams.id = "";
    let title;
    const $chart1 = $("#chart1").parent(),
      $chart2 = $("#chart2").parent();
    if (searchParams.model === "1") {
      title = "具体问题分析";
      $chart1.css("width", "calc((100% - 48px) / 4)");
      $chart2.show();
      initChart2();
    } else {
      title = searchParams.model === "2" ? "业务归口分析" : "具体问题分析";
      $chart1.css("width", "calc(50% - 8px)");
      $chart2.hide();
    }
    $("#chart3-title").html(title);
    initChart1();
    initChart3();
    initChart4();
    if (location.hash && location.hash.indexOf("click") != -1) {
      $(".mybd-btn").click();
    }
  };

  // 渲染echarts图表
  const renderChart = (option, id, callback, needRezise) => {
    const chart = ec.init(document.getElementById(id));
    needRezise && chart && chart.resize();
    chart.setOption(option, true);
    callback && (chart.off(), chart.on("click", callback));
  };

  // 第一个ecahrts图
  const initChart1 = () => {
    let { date1, date2, model, code, detailDeptId } = searchParams;
    sugon
      .request(sugon.interFaces.myhc.rdwt.getChart1, {
        deptId: detailDeptId,
        model,
        code,
        date1,
        date2
      })
      .then(result => {
        let xData = [],
          yData = [];
        result.data.map(val => {
          xData.push(val.name);
          yData.push(val.value);
        });
        let option = {
          tooltip: {
            show: true
          },
          grid: {
            top: 20,
            left: 10,
            bottom: 10,
            right: 20,
            containLabel: true
          },
          xAxis: {
            type: "category",
            boundaryGap: false,
            axisLine: {
              color: "#EBEBEB"
            },
            axisTick: {
              show: false
            },
            data: xData
          },
          yAxis: {
            type: "value",
            axisLine: {
              color: "#EBEBEB"
            },
            axisTick: {
              show: false
            }
          },
          series: [
            {
              data: yData,
              type: "line",
              smooth: true,
              itemStyle: {
                color: "#70C4FD"
              },
              lineStyle: {
                color: "#70C4FD"
              },
              areaStyle: {
                color: {
                  type: "linear",
                  x: 0,
                  y: 1,
                  x2: 0,
                  y2: 0,
                  colorStops: [
                    {
                      offset: 0,
                      color: "#fff" // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "#70C4FD" // 100% 处的颜色
                    }
                  ]
                }
              }
            }
          ]
        };
        renderChart(option, "chart1", "", true);
      });
  };

  // 第二个echarts图
  const initChart2 = () => {
    let { date1, date2, detailDeptId, code } = searchParams;
    sugon
      .request(sugon.interFaces.myhc.rdwt.getChart2, {
        date1,
        date2,
        deptId: detailDeptId,
        code
      })
      .then(result => {
        // xData:x轴数据；yData:y轴数据；yPercentData:y轴百分比数据；calcData:计算弧度结果的数据
        let data = result.data,
          xData = [],
          yData = [],
          yPercentData = [],
          calcData = [];
        // 起始位置
        let sum = 0;
        data.map(val => {
          xData.push(val.name);
          yData.push(val.value);
          sum += Number(val.value);
        });
        data.map(val => {
          yPercentData.push(val.value / sum);
        });
        let start = 0;
        yPercentData.map((val, i) => {
          let arr = [],
            obj = {};
          arr[2] = start;
          if (i == yPercentData.length - 1) {
            arr[0] = 0;
            arr[1] = 360 - arr[2];
          } else {
            arr[1] = parseInt(val * 360);
            arr[0] = 360 - arr[1] - start;
          }
          start += arr[1];
          obj.name = xData[i];
          obj.value = arr;
          calcData.push(obj);
        });

        let dataStyle = {
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

        let labelShow = {
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

        let placeHolderStyle = {
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
        let seriesArr = [];
        let radiusArr = [
          [70, 75],
          [60, 70],
          [45, 60],
          [50, 45],
          [60, 50],
          [75, 60]
        ];
        for (let i = 0; i < calcData.length; i++) {
          let series = {
            name: calcData[i].name,
            type: "pie",
            clockWise: false,
            itemStyle: dataStyle,
            hoverAnimation: false
          };
          let radiusIndex = i;
          if (i < 6) {
            series.radius = radiusArr[radiusIndex];
          } else {
            series.radius = radiusArr[radiusIndex - 6];
          }
          let valueArr = calcData[i].value;
          let dataArr = [];
          for (let j = 0; j < valueArr.length; j++) {
            let dataObj = {};
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
        let option = {
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
        renderChart(option, "chart2");
      });
  };

  // 第三个ehchrts图
  const initChart3 = () => {
    let { detailDeptId, model, code, date1, date2 } = searchParams;
    sugon
      .request(sugon.interFaces.myhc.rdwt.getChart3, {
        deptId: detailDeptId,
        model,
        code,
        date1,
        date2
      })
      .then(result => {
        let xData = [],
          yData = [],
          data = result.data,
          total = 0;
        data.map(val => {
          xData.push(val.name);
          yData.push(val.value);
          total += Number(val.value);
        });
        $(".pop-title > div:first-child").html(total);
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
              radius: ["45%", "54%"],
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
        renderChart(option, "chart3", params => {
          searchParams.id = params.data.id;
          initChart4();
        });
      });
  };
  //第四个echarts图
  const initChart4 = () => {
    let { detailDeptId, model, code, date1, date2, id } = searchParams;
    sugon
      .request(sugon.interFaces.myhc.rdwt.getChart4, {
        deptId: detailDeptId,
        model,
        code,
        date1,
        date2,
        id
      })
      .then(result => {
        let data = result.data,
          xData = [],
          yData = [],
          startValue = 0,
          endValue = 100,
          show = false;
        if (data.length == 0) {
          xData.push("暂无数据");
          yData.push(0);
        } else {
          if (data.length > 4) {
            endValue = Math.floor((4 / data.length) * 100);
            show = true;
          }
          for (let i = 0; i < data.length; i++) {
            xData.push(data[i].name);
            yData.push(data[i].value);
          }
        }
        // let minAndMax = sugon.handleMinAndMax(yData, true);
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
            top: 20,
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
              // min: minAndMax.min,
              // max: minAndMax.max,
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
              name: "数值",
              type: "bar",
              barWidth: 20,
              data: yData,
              label: {
                show: true,
                position: "top"
              },
              itemStyle: {
                normal: {
                  barBorderRadius: [3, 3, 0, 0],
                  color: "rgba(46, 146, 213, 1.000)"
                }
              }
            }
          ]
        };
        renderChart(option, "chart4");
      });
  };

  // 查询按钮事件方法
  async function searchFunc() {
    searchParams.deptId = $("#dept-id").val();
    searchParams.deptName = $("#dept-name").val();
    searchParams.date1 = $("#date1").val();
    searchParams.date2 = $("#date2").val();
    searchParams.type = $("#type").val();
    await initMidPanel();
    initBottomPanel();
  }

  // 页面入口
  function initPage() {
    Promise.resolve()
      .then(() => sugon.initSearchBar({ date1: -7, date2: -2, cb: searchFunc }))
      .then(() => searchFunc());
  }

  // 页面入口
  initPage();

  // 前三个盒子点击事件
  $(".mid-header > div").on("click", function() {
    let $this = $(this),
      deptId = $this.attr("deptId"),
      model = $this.attr("model"),
      code = $this.attr("code");
    Object.assign(searchParams, { detailDeptId: deptId, model, code });
    initBottomPanel();
  });

  // 列表点击事件
  $(".mid-body").on("click", $(".mid-body > div"), e => {
    let $target = $(e.target);
    let $row = $target.parent().hasClass("mid-body")
      ? $target
      : $target.parent();
    let deptId = $row.attr("deptId"),
      model = $row.attr("model"),
      code = $row.attr("code");
    Object.assign(searchParams, { detailDeptId: deptId, model, code });
    initBottomPanel();
  });

  // 返回按钮事件
  $(".pop-title > div:first-child").on("click", () => {
    searchParams.id = "";
    initChart4();
  });

  // 民意榜单按钮事件
  $(".mybd-btn").on("click", () => {
    requirejs(["text!../views/myhc/ryqk.html"], function(ele) {
      $(".pop-panel")
        .html(ele)
        .show()
        .css("width", "100%")
        .css("height", "100%");
    });
  });

  // 设置按钮入口
  $(".setting-btn").on("click", () => {
    location.hash = vipspa.stringify("rdwt/setting", {
      type: searchParams.type
    });
  });

  // 下拉框修改事件
  $("#type").on("change", e => {
    searchParams.type = $(e.target).val();
  });
});
