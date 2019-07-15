/* Created by handsome qiu */
requirejs(["common", "ec"], function(sugon, ec) {
  // 弹出框走势分析接口定义
  var getZsfx = function(condition) {
    sugon.requestJson(
      {
        type: "post",
        url: sugon.interFaces.zxyp.ylld.Zsfx,
        data: condition
      },
      function(result) {
        drawZsfx(result);
      }
    );
  };

  // 画echarts图
  var drawZsfx = function(result) {
    var data1 = result.data1;
    var data2 = result.data2;
    var xData = [],
      yData1 = [],
      yData2 = [];
    for (var i = 0; i < data1.length; i++) {
      // data2Min = Math.min(Number(data2[i].value), data2Min);
      // data2Max = Math.max(Number(data2[i].value), data2Max);
      xData.push(data1[i].name);
      yData1.push(data1[i].value);
      yData2.push(data2[i].value);
    }
    // data2Min -= 5;
    var zsfxChart = ec.init(document.getElementById("pop-zsfx"));
    var option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          crossStyle: {
            color: "#999"
          }
        }
      },
      legend: {
        data: ["一般", "不安全"]
      },
      grid: {
        top: 30,
        left: 40,
        width: "87%",
        height: "73%"
      },
      xAxis: [
        {
          type: "category",
          data: xData,
          axisPointer: {
            type: "shadow"
          }
        }
      ],
      yAxis: [
        {
          type: "value"
          // name: '一般',
        },
        {
          type: "value",
          show: false
          // name: '不安全',
        }
      ],
      series: [
        {
          name: "一般",
          type: "bar",
          data: yData1,
          barWidth: "15",
          itemStyle: {
            normal: {
              barBorderRadius: 2,
              borderWidth: 1,
              borderColor: "rgba(18, 86, 108, 0.5)",
              color: "#2597DE",
              label: {
                show: false
              }
            }
          }
        },
        {
          name: "不安全",
          type: "line",
          yAxisIndex: 1,
          data: yData2
        }
      ]
    };

    zsfxChart.setOption(option);
  };

  // 弹出框当月情况分析
  var getDyqkfx = function(condition) {
    sugon.requestJson(
      {
        type: "post",
        url: sugon.interFaces.zxyp.ylld.Dyqkfx,
        data: condition
      },
      function(result) {
        if (result.level == 0) {
          $("#row1").html(
            "全市排第 " +
              '<span id="rank1" class="pop-rank">' +
              result.value1 +
              "</span>"
          );
          $("#row2").html(
            "全市排第 " +
              '<span id="rank2" class="pop-rank">' +
              result.value3 +
              "</span>"
          );
        } else {
          $("#row1").html("");
          $("#row2").html("");
        }
        $("#count1").html(result.value2);
        $("#count2").html(result.value4);
      }
    );
  };

  // 获取当月总结数据
  var getDyzj = function(condition) {
    sugon.requestJson(
      {
        type: "post",
        url: sugon.interFaces.zxyp.ylld.Dyzj,
        data: condition
      },
      function(result) {
        $("#dyzj").html(result.value);
      }
    );
  };

  // 监听关闭按钮事件
  $(".pop-header>i").click(function() {
    $(".simple_shade").hide();
    $(".simple_showDialog").remove();
  });

  // 程序入口
  $(function() {
    var params = window.dialogParams.split("_");
    var seriesName = params[0];
    var time = params[1];
    var search = JSON.parse(params[2]);
    $("#pop-title").html(seriesName);
    var condition = {
      name: seriesName,
      time: time,
      deptId: search.deptId,
      date1: search.date1,
      date2: search.date2
    };
    getZsfx(condition);
    getDyqkfx(condition);
    getDyzj(condition);
  });
});
