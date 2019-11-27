requirejs(["common", "ec", "jqcloud"], function(sugon, ec) {
  // 全局查询尺度
  let searchRuler = {},
    search = {};
  let param1, param2;
  let hfrcData = [],
    gddwfbData = [],
    mydData = [];

  // 初始化单位下拉框
  let initDeptSelect = async function() {
    let result = await sugon.request(sugon.interFaces.zxyp.ckfw.Menu, {
      search: JSON.stringify(search)
    });
    let html = "";
    result.data.map(val => {
      html += `<option value="${val.value}">${val.name}</option>`;
    });
    $(".second-selector").html(html);
  };

  let initTxt = function() {
    sugon.requestJson(
      {
        type: "POST",
        async: true,
        url: sugon.interFaces.zxyp.ckfw.Txt,
        data: { search: JSON.stringify(search) }
      },
      function(result) {
        for (let i = 0; i < result.data.length; i++) {
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

  // 工单量走势分析
  let getGdzsfx = function() {
    let condition = { search: JSON.stringify(search) };
    sugon.requestJson(
      {
        url: sugon.interFaces.zxyp.ckfw.getGdzsgx,
        type: "post",
        async: true,
        data: condition
      },
      function(result) {
        drawGdzsfx(result.data);
      }
    );
  };

  // 画工单量走势分析echarts图
  let drawGdzsfx = function(data) {
    let xData = [],
      yData = [],
      min = Number(data[0].value),
      max = Number(data[0].value);
    for (let i = 0; i < data.length; i++) {
      xData.push(data[i].name);
      yData.push(data[i].value);
      min = Number(data[i].value) < min ? data[i].value : min;
      max = Number(data[i].value) > max ? data[i].value : max;
    }
    let option = {
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

    sugon.renderChart({ id: "chart11", cb, data, option });
    // 点击事件回调
    function cb(param) {
      searchRuler.id1 = param.name;
      searchRuler.id2 = "";
      getYwfx();
      getGddwfb();
    }
  };

  // 工单业务分析
  let getYwfx = function() {
    let condition = { search: JSON.stringify(search) };
    if (searchRuler.id1 || searchRuler.id1 == "0") {
      condition.id1 = searchRuler.id1;
    }
    sugon.requestJson(
      {
        url: sugon.interFaces.zxyp.ckfw.getGdywfx,
        type: "post",
        async: true,
        data: condition
      },
      function(result) {
        drawYwfx(result.data);
      }
    );
  };

  // 画工单业务分析echarts图
  let drawYwfx = function(data) {
    let total = 0;
    for (let i = 0; i < data.length; i++) {
      total += Number(data[i].value);
    }
    let option = {
      title: {
        text: total,
        subtext: "业务分析",
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
                  let percent = "" + params.value / total;
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
    sugon.renderChart({ id: "chart22", cb, data, option });
    // 点击回调
    function cb(param) {
      searchRuler.id2 = param.data.id;
      $(".tab4 > div")
        .removeClass("selected")
        .eq(0)
        .addClass("selected");
      getGddwfb();
    }
  };

  // 工单单位分布
  let getGddwfb = function() {
    let condition = { search: JSON.stringify(search) };
    if (searchRuler.id1 || searchRuler.id1 == "0") {
      condition.id1 = searchRuler.id1;
    }
    if (searchRuler.id2 || searchRuler.id2 == "0") {
      condition.id2 = searchRuler.id2;
    }

    sugon.requestJson(
      {
        url: sugon.interFaces.zxyp.ckfw.getGddwfb,
        type: "post",
        async: true,
        data: condition
      },
      function(result) {
        gddwfbData = result.data;
        if (result.data.length == 1) {
          $(".tab4").css("display", "none");
        } else {
          $(".tab4").css("display", "block");
        }
        drawGddwfb(gddwfbData[0]);
      }
    );
  };

  // 画诉求单位分布echarts图
  let drawGddwfb = function(data) {
    let xData = [],
      yData = [],
      startValue = 0,
      endValue = 100,
      isShow = false,
      markData = [];
    if (data.length > 4) {
      isShow = true;
      startValue = Math.floor((1 - 4 / data.length) * 100);
    }
    for (let i = 0; i < data.length; i++) {
      yData.push(data[i].name);
      xData.push(data[i].value);
      if (data[i].selected) {
        markData = [
          { name: data[i].name, value: data[i].value, xAxis: data[i].value },
          { name: data[i].name, value: data[i].value, xAxis: data[i].value }
        ];
      }
    }
    let option = {
      color: ["#269AE5"],
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow"
        }
      },
      grid: {
        top: 0,
        left: 0,
        right: 20,
        bottom: 10,
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
    sugon.renderChart({ id: "chart33", option, data });
  };

  let initMyd = function() {
    sugon.requestJson(
      {
        type: "POST",
        async: true,
        url: sugon.interFaces.zxyp.ckfw.Myd,
        data: { dept: $("#dept3").val(), search: JSON.stringify(search) }
      },
      function(result) {
        let xData = [],
          yData = [],
          iData = [],
          min = result.data[0].value1,
          max = result.data[0].value1;
        for (let i = 0; i < result.data.length; i++) {
          xData.push(result.data[i].name);
          yData.push(result.data[i].value1);
          iData.push(result.data[i].value2);
          result.data[i].value1 < min ? (min = result.data[i].value1) : min;
          result.data[i].value1 > max ? (max = result.data[i].value1) : max;
        }

        let option = {
          color: "#3cb2fc",
          tooltip: {
            trigger: "axis"
          },
          grid: {
            top: 25,
            bottom: 25,
            left: 0,
            right: 0,
            containLabel: true
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
                formatter: "{value}%",
                textStyle: {
                  color: "#b3cce2"
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
                    color: "#e6ecfa",
                    formatter: function(params) {
                      return iData[params.dataIndex];
                    }
                  }
                }
              },
              data: yData
            }
          ]
        };
        sugon.renderChart({ id: "chart3", data: result.data, option });
      }
    );
  };

  $(".switch-panel").on("change", "#dept3", function() {
    initMyd();
  });

  let initDwqk = function(index, flag) {
    sugon.requestJson(
      {
        type: "POST",
        async: true,
        url: sugon.interFaces.zxyp.ckfw.Dwqk,
        data: { search: JSON.stringify(search) }
      },
      function(result) {
        let data = result.data[index];
        if (result.data.length == 1) {
          $(".tab2").css("display", "none");
        } else {
          $(".tab2").css("display", "block");
        }
        let xData = [],
          yData = [],
          isShow = false,
          startValue = 0,
          endValue = 100;

        for (let i = 0; i < data.length; i++) {
          xData.push(data[i].name);
          yData.push(data[i].value);
        }

        if (data.length > 5) {
          isShow = true;
          endValue = Math.floor((5 / data.length) * 100);
        }
        let minAndMax = sugon.handleMinAndMax(yData);
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
            top: 40,
            bottom: 0,
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
                  color: "#b3cce2"
                },
                formatter: function(param) {
                  return sugon.handleStrLineFeed(param);
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
              min: minAndMax.min,
              max: minAndMax.max,
              axisTick: { show: false },
              splitLine: {
                lineStyle: {
                  color: "#d5d8e1"
                }
              },
              splitArea: { show: false },
              splitNumber: 5,
              axisLabel: {
                formatter: "{value}%",
                textStyle: {
                  color: "#b3cce2"
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

        sugon.renderChart({ id: "chart4", data: result.data, option });
      }
    );
  };

  // tab2切换事件
  $(".switch-panel").on("click", ".tab2>div", function() {
    $(".tab2 .selected").removeClass("selected");
    $(this).attr("class", "selected");
    let index = $(".tab2>div").index(this);
    initDwqk(index, 1);
  });

  // tab4切换事件
  $(".switch-panel").on("click", ".tab4>div", function() {
    $(".tab4 .selected").removeClass("selected");
    $(this).attr("class", "selected");
    let index = $(".tab4>div").index(this);
    drawGddwfb(gddwfbData[index]);
  });

  let initMydfx = function(param) {
    sugon.requestJson(
      {
        type: "POST",
        async: true,
        url: sugon.interFaces.zxyp.ckfw.Rador,
        data: { id: param, search: JSON.stringify(search) }
      },
      function(result) {
        let indicatorData = [],
          seriesData = [];
        if (result.data.length == 0) {
          return;
        }
        for (let i = 0; i < result.data.length; i++) {
          indicatorData.push({
            text: result.data[i].name,
            max: result.data[i].value
          });
          seriesData.push(result.data[i].value);
        }

        let option = {
          color: "rgba(52, 237, 255, 0.35)",
          radar: [
            {
              indicator: indicatorData,
              triggerEvent: true,
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
                  value: seriesData,
                  name: "图一",
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

        sugon.renderChart({ data: result.data, id: "chart2", option, cb });

        // 饼图点击事件回调
        function cb(params) {
          if (!params.targetType) {
            (param1 = ""), (param2 = "");
            initMydfx("");
            initJtwt("");
            initAjwt("", "", 0);
            return;
          }
          if (param2) {
            return;
          }
          if (params.targetType) {
            let tempId = "";
            for (let i = 0; i < result.data.length; i++) {
              if (params.name == result.data[i].name) {
                tempId = result.data[i].id;
                break;
              }
            }
            param1 = tempId;
            initMydfx(param1);
            initJtwt(param1);
            initAjwt(param1, param2, 0);
          }
        }
      }
    );
  };

  let initJtwt = function(param) {
    sugon.requestJson(
      {
        type: "POST",
        async: true,
        url: sugon.interFaces.zxyp.ckfw.Jtwt,
        data: { id: param, search: JSON.stringify(search) }
      },
      function(result) {
        let scaleData = result.data;

        // 点击回调事件
        function cb(params) {
          param2 = params.data.id;
          initAjwt(param1, param2, 0);
        }

        let data = [];

        for (let i = 0; i < scaleData.length; i++) {
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

        let option = {
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
                      let tempStr = "";
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

        sugon.renderChart({ id: "chart5", data: scaleData, cb, option });
      }
    );
  };

  let initAjwt = function(param11, param22, index) {
    sugon.requestJson(
      {
        type: "POST",
        async: true,
        url: sugon.interFaces.zxyp.ckfw.Ajwt,
        data: { id1: param11, id2: param22, search: JSON.stringify(search) }
      },
      function(result) {
        let data = result.data[index];
        if (result.data.length == 1) {
          $(".tab3").css("display", "none");
        } else {
          $(".tab3").css("display", "block");
        }
        let xData = [],
          yData = [];

        for (let i = 0; i < data.length; i++) {
          xData.push(data[i].name);
          yData.push(data[i].value);
        }

        let option = {
          tooltip: {
            trigger: "axis",
            confine: true,
            axisPointer: {
              type: "shadow"
            }
          },
          color: ["#1e9bdd"],
          grid: {
            left: 0,
            right: 15,
            bottom: 5,
            top: 40,
            containLabel: true
          },
          xAxis: {
            type: "value",
            boundaryGap: ["20%", "20%"],
            min: 0
          },
          yAxis: {
            type: "category",
            data: xData
          },
          series: [
            {
              name: "",
              type: "bar",
              data: yData
            }
          ]
        };

        sugon.renderChart({ id: "chart6", data, option });
      }
    );
  };

  $(".tab3>div").bind("click", function() {
    $(".tab3 .selected").removeClass("selected");
    $(this).attr("class", "selected");
    let index = $(".tab3>div").index(this);
    initAjwt(param1, param2, index);
  });

  let initRankList = function() {
    searchRuler.id3 = $(".first-selector").val();
    searchRuler.id4 = $(".second-selector").val();
    sugon.requestJson(
      {
        type: "POST",
        async: true,
        url: sugon.interFaces.zxyp.ckfw.Rank,
        data: { id: searchRuler.id4, search: JSON.stringify(search) }
      },
      function(result) {
        mydData = result.data;
        renderRankList();
      }
    );
  };

  let renderRankList = function() {
    let $body = $(".rank-list-body");
    $body.empty();
    let data = [];
    mydData.map(function(val) {
      if (searchRuler.id3 == val.type) {
        data = val.values;
      }
    });
    data.map(function(val, index) {
      let $div = $("<div/>");
      let $img,
        color = "p";
      switch (index) {
        case 0:
          $img = '<img src="../../img/zxyp/jcj/one.png">';
          color = "g";
          break;
        case 1:
          $img = '<img src="../../img/zxyp/jcj/two.png">';
          color = "b";
          break;
        case 2:
          $img = '<img src="../../img/zxyp/jcj/three.png">';
          break;
        default:
          $img = index + 1;
          break;
      }
      let rankLab = $("<div/>")
        .addClass("rankLab")
        .append($("<div/>").append($img))
        .append(
          $("<div/>")
            .attr("title", val.name)
            .html(val.name)
        );
      let rankImg = $('<div class="rankImg lh"></div>')
        .addClass(color)
        .html(val.value);
      $div.append(rankLab).append(rankImg);
      $body.append($div);
    });
  };

  $(".newMenu").on("change", "select", function() {
    let $this = $(this);
    if ($this.hasClass("first-selector")) {
      searchRuler.id3 = $this.val();
      renderRankList();
    } else {
      initRankList();
    }
  });

  let initTxt2 = function() {
    sugon.requestJson(
      {
        type: "POST",
        async: true,
        url: sugon.interFaces.zxyp.ckfw.Yw,
        data: { search: JSON.stringify(search) }
      },
      function(result) {
        for (let i = 0; i < result.data.length; i++) {
          $(".mid_title")
            .eq(i)
            .html(result.data[i].name);
          $(".val4")
            .eq(i)
            .html(result.data[i].value1);
          $(".val5")
            .eq(i)
            .html(result.data[i].value2);
          $(".val6")
            .eq(i)
            .html(result.data[i].value3);
          $(".val7")
            .eq(i)
            .html(result.data[i].value4);
        }
      }
    );
  };

  $(".check").bind("click", function() {
    let keyword = $("#keywords").val();
    if (keyword) {
      location.hash = vipspa.stringify("myys/ysxq", { txt: keyword });
    }
  });

  // 加载标签云
  let loadLabelCloud = function(data) {
    let string_ = "";
    for (let i = 0; i < data.length; i++) {
      let string_f = data[i].name;
      let string_n = data[i].value;
      string_ +=
        "{text: '" +
        string_f +
        "', weight: '" +
        string_n +
        "',html: {'class': 'span_list'}},";
    }
    let string_list = string_;
    let word_list = eval("[" + string_list + "]");
    $("#word_cloud").jQCloud(word_list);
  };

  let initWordCloud = function(param) {
    $(".world_cloud").empty();
    if (param == 0) {
      sugon.requestJson(
        {
          type: "POST",
          async: true,
          url: sugon.interFaces.zxyp.ckfw.Tag,
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
    let container = $(".world_cloud");
    container.empty();
    let value = $(this).val();
    if (value == 0) {
      loadLabelCloud(hfrcData);
    } else {
      container.removeClass("jqcloud");
      for (let i = 0; i < hfrcData.length; i++) {
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

  let initWtyc = function(param) {
    sugon.requestJson(
      {
        type: "POST",
        async: true,
        url: sugon.interFaces.zxyp.ckfw.Ckfw,
        data: { id: param, search: JSON.stringify(search) }
      },
      function(result) {
        $(".wtList").empty();
        for (let i = 0; i < result.data.length; i++) {
          let str =
            result.data[i].name.length > 15
              ? result.data[i].name.substr(0, 15) + "..."
              : result.data[i].name;
          let tempStr = i + 1 + ". " + str;
          let tempImg =
            result.data[i].type == "1"
              ? "../../img/zxyp/ckfw/red.png"
              : "../../img/zxyp/ckfw/blue.png";
          $(".wtList").append(
            `<div id="${result.data[i].id}">
              <span title="${tempStr}" class='lh l tt'>${tempStr}</span>
              <span class='lh y advise'>建议</span>
              <span class='lh y img'>
                <img src="${tempImg}" />
              </span>
            </div>`
          );
        }
      }
    );
  };

  $(".wtTab").bind("click", function() {
    initWtyc(this.id);
  });

  // 中间层右上角切换事件
  $(".switch-panel").on("click", ".switch-btn", function() {
    let $thisPanel = $(".switch-panel");
    let $this = $(this);
    let threePanel =
      '<div class="group_child"><div class="subTitle"><span>一般工单量走势分析</span>' +
      '</div><div class="content"><div id="chart11"></div></div></div><div class="group_child">' +
      '<div class="subTitle"><span>一般工单业务分析</span></div><div class="content">' +
      '<div id="chart22"></div></div></div><div class="group_child" style="margin-right: 0px;">' +
      '<div class="subTitle">' +
      '<span>一般工单各单位情况</span><span class="switch-btn switch-three"></span>' +
      '</div><div class="content"><div class="tab4"><div class="selected">一单元</div>' +
      '<div>二单元</div><div>三单元</div><div style="border-right: 0px;">其他</div>' +
      '</div><div id="chart33"></div></div></div>';
    let twoPanel =
      '<div class="myd">' +
      '<div class="subTitle2">' +
      '<span class="l" style="font-size: 16px;">窗口服务满意度趋势分析</span>' +
      '<span class="y">' +
      '<select id="dept3">' +
      '<option value="0">窗口服务</option>' +
      '<option value="1">户籍业务</option>' +
      '<option value="2">身份证业务</option>' +
      '<option value="3">出入境业务</option>' +
      '<option value="4">车辆业务</option>' +
      '<option value="5">驾证业务</option>' +
      '<option value="6">监管业务</option>' +
      "</select>" +
      "</span>" +
      "</div>" +
      '<div class="content"><div id="chart3"></div></div></div>' +
      '<div class="dwqk"><div class="subTitle2">' +
      '<span style="font-size: 16px;">窗口服务满意度各单位情况</span>' +
      '<span class="switch-two switch-btn"></span>' +
      "</div>" +
      '<div class="content">' +
      '<div class="tab2">' +
      '<div class="selected">一单元</div>' +
      "<div>二单元</div>" +
      "<div>三单元</div>" +
      '<div style="border-right: 0;">其他</div>' +
      "</div>" +
      '<div id="chart4"></div>' +
      "</div>" +
      "</div>";

    if ($this.hasClass("switch-two")) {
      $thisPanel.empty();
      $thisPanel.append(threePanel);
      getGdzsfx();
      getYwfx();
      getGddwfb();
    } else {
      $thisPanel.empty();
      $thisPanel.append(twoPanel);
      //满意度走势
      initMyd();
      //满意度各单位
      initDwqk(0);
    }
  });

  let initView = async function() {
    searchRuler.deptId = $("#dept-id").val();
    searchRuler.deptName = $("#dept-name").val();
    searchRuler.date1 = $("#date1").val();
    searchRuler.date2 = $("#date2").val();
    search.deptId = $("#dept-id").val();
    search.deptName = $("#dept-name").val();
    search.date1 = $("#date1").val();
    search.date2 = $("#date2").val();
    await initDeptSelect();
    //左上文本
    initTxt();
    if ($(".switch-btn").hasClass("switch-three")) {
      searchRuler.id1 = "";
      searchRuler.id2 = "";
      getGdzsfx();
      getYwfx();
      getGddwfb();
    } else {
      //满意度走势
      initMyd();
      //满意度各单位
      initDwqk(0);
    }
    //满意度分析
    initMydfx("");
    //具体问题
    initJtwt("");
    //案件问题
    initAjwt("", "", 0);
    // 满意度排行榜
    initRankList();
    //中上文本
    initTxt2();
    //词云
    initWordCloud($("#dept").val());
    //问题预测
    initWtyc("");
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
});
