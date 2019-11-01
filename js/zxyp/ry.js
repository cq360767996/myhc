/* Created by handsome qiu */
requirejs(["common", "ec", "jqcloud"], function(sugon, ec) {
  //获取参数
  var params = window.dialogParams.split("_");
  var index = Number(params[0]),
    id = params[1],
    searchRuler = params[2];

  var initUser = function() {
    sugon.requestJson(
      {
        type: "POST",
        async: true,
        url: sugon.interFaces.zxyp.jcj.User,
        data: { id: id, search: searchRuler }
      },
      function(result) {
        Object.keys(result.data1).forEach(key => {
          $("#" + key).html(result.data1[key]);
        });
        Object.keys(result.data2).forEach(key => {
          $("#" + key).html(result.data2[key]);
        });
        $("#typeList").empty();
        for (var i = 0; i < result.data3.length; i++) {
          $("#typeList").append(
            "<div><span>" +
              result.data3[i].name +
              "：</span><span class='b'>" +
              result.data3[i].value +
              "</span></div>"
          );
        }
      }
    );
  };

  // 加载标签云
  var loadLabelCloud = function(data, ele) {
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
    $("#" + ele).jQCloud(word_list);
  };

  var initTag = function() {
    sugon.requestJson(
      {
        type: "POST",
        async: true,
        url: sugon.interFaces.zxyp.jcj.Tag2,
        data: { id: id, search: searchRuler }
      },
      function(result) {
        $("#tag1").empty();
        loadLabelCloud(result.data1, "tag1");
        $("#tag2").empty();
        loadLabelCloud(result.data2, "tag2");
      }
    );
    /*sugon.requestJson({type: "POST", async: true, url: sugon.interFaces.zxyp.jcj.Tag2, data: {id: id, search: searchRuler}}, function (result) {
            $("#tag1").empty();
            loadLabelCloud(result.data, "tag1");
        });

        sugon.requestJson({type: "POST", async: true, url: sugon.interFaces.zxyp.jcj.Tag3, data: {id: id, search: searchRuler}}, function (result) {
            $("#tag2").empty();
            loadLabelCloud(result.data, "tag2");
        });*/
  };

  var initLine = function() {
    sugon.requestJson(
      {
        type: "POST",
        async: true,
        url: sugon.interFaces.zxyp.jcj.Line,
        data: { id: id, search: searchRuler }
      },
      function(result) {
        var xData = [],
          yData1 = [],
          yData2 = [],
          yData3 = [],
          iData = [],
          min = result.data[0].value,
          max = result.data[0].value;
        for (var i = 0; i < result.data.length; i++) {
          xData.push(result.data[i].name);
          yData1.push(result.data[i].value1);
          yData2.push(result.data[i].value2);
          yData3.push(result.data[i].value3);
          iData.push(result.data[i].id);
          result.data[i].value < min ? (min = result.data[i].value) : min;
          result.data[i].value > max ? (max = result.data[i].value) : max;
        }

        var Chart3 = ec.init(document.getElementById("line"));
        Chart3.off();
        Chart3.on("click", function(params) {
          //alert(iData[params.seriesIndex]);
          /*require(['text!../views/zxyp/ry.html'], function (ele){
                    sugon.showDialog({width: 500, height: 300, ele: ele});
                });*/
        });

        var option = {
          color: ["#2a9bd3", "#e05d62"],
          tooltip: {
            trigger: "axis"
          },
          legend: {
            show: true
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
              /*min: min,
                        max: max,*/
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
              name: "出警次数",
              showSymbol: true,
              symbolSize: 8,
              type: "line",
              data: yData1
            },
            {
              name: "群众投诉",
              showSymbol: true,
              symbolSize: 8,
              type: "line",
              data: yData2
            }
          ]
        };

        Chart3.setOption(option);
      }
    );
  };

  var initRador = function(param) {
    sugon.requestJson(
      {
        type: "POST",
        async: true,
        url: sugon.interFaces.zxyp.jcj.Rador3,
        data: { id: param, ryID: id, search: searchRuler }
      },
      function(result) {
        var indicatorData = [],
          seriesData = [];
        if (result.data.length == 0) {
          return;
        }
        for (var i = 0; i < result.data.length; i++) {
          indicatorData.push({
            text: result.data[i].name,
            max: result.data[i].value
          });
          seriesData.push(result.data[i].value);
        }

        var Chart5 = ec.init(document.getElementById("rador1"));

        Chart5.off();
        Chart5.on("click", function(params) {
          if (!params.targetType) {
            initRador("");
            return;
          }
          if (params.targetType) {
            var tempId = "";
            for (var i = 0; i < result.data.length; i++) {
              if (params.name == result.data[i].name) {
                tempId = result.data[i].id;
                break;
              }
            }
            initRador(tempId);
          }
        });

        var option = {
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

        Chart5.setOption(option);
      }
    );

    sugon.requestJson(
      {
        type: "POST",
        async: true,
        url: sugon.interFaces.zxyp.jcj.Rador4,
        data: { id: param, ryID: id, search: searchRuler }
      },
      function(result) {
        var indicatorData = [],
          seriesData = [];
        if (result.data.length == 0) {
          return;
        }
        for (var i = 0; i < result.data.length; i++) {
          indicatorData.push({
            text: result.data[i].name,
            max: result.data[i].value
          });
          seriesData.push(result.data[i].value);
        }

        var Chart6 = ec.init(document.getElementById("rador2"));

        var option = {
          color: "rgba(52, 237, 255, 0.35)",
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

        Chart6.setOption(option);
      }
    );
  };

  var initPage = function() {
    $("#people-img").attr("src", "../../img/zxyp/jcj/" + (index + 1) + ".png");
    //民警信息
    initUser();
    //标签云
    initTag();
    //折线图
    initLine();
    //雷达图
    initRador("");
  };

  // 页面入口
  $(function() {
    initPage();
  });
});
