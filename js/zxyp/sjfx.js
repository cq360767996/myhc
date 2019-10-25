/* Created by handsome qiu */
requirejs(["common", "ec"], function(sugon, ec) {
  // 弹窗传参
  let params = window.dialogParams;
  // 方法
  let functions = {
    initPopup() {
      // 初始化弹出页
      this.initTop();
      this.initMidLeft();
      this.initMidRightTop();
      this.initMidRight();
      this.initBottomLeft();
      this.initBottomRight();
    },
    initTop() {
      // 初始化上部
      sugon.requestJson(
        {
          type: "post",
          url: sugon.interFaces.zxyp.rx.popup.getTop,
          data: params
        },
        result => {
          $(".sjfx-top strong")
            .eq(0)
            .html(result.data.dqsqzl);
          $(".sjfx-top strong")
            .eq(1)
            .html(result.data.pjmyd + "%");
          $(".sjfx-top strong")
            .eq(2)
            .html(result.data.rdqy);
        }
      );
    },
    initMidLeft() {
      // 初始化中左
      sugon.requestJson(
        {
          type: "post",
          url: sugon.interFaces.zxyp.rx.popup.getMidLeft,
          data: params
        },
        result => {
          let chart = ec.init(document.getElementById("sjfx-chart1")),
            xData = [],
            yData = [];
          result.data.map(val => {
            xData.push(val.name);
            yData.push(val.value);
          });
          let option = {
            grid: {
              top: 20,
              left: 0,
              bottom: 0,
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
          chart.setOption(option);
        }
      );
    },
    initMidRightTop() {
      // 初始化中右上侧内容
      sugon.requestJson(
        {
          type: "post",
          url: sugon.interFaces.zxyp.rx.popup.getMidRightTop,
          data: params
        },
        result => {
          $(".sjfx-body-right strong").html(result.data.length);
          let html = "";
          result.data.map(val => {
            html += `<option value="${val.id}">${val.value}</option>`;
          });
          $(".select1")
            .empty()
            .append(html);
        }
      );
    },
    initMidRight() {
      // 初始化中右
      let condition = { id: $(".select1").val(), ...params };
      sugon.requestJson(
        {
          type: "post",
          url: sugon.interFaces.zxyp.rx.popup.getMidRight,
          data: condition
        },
        result => {
          let $body = $(".time-box > ul")
            .empty()
            .css("margin-left", 0);
          let data = result.data;
          let len =
            data.length % 3 == 0
              ? parseInt(data.length / 3)
              : parseInt(data.length / 3 + 1);
          let ulWidth = len * 100 + "%";
          let liWidth = "calc((100% - " + 40 * len + "px) / " + len * 3 + ")";
          $body.width(ulWidth);
          data.map(val => {
            $body.append(
              '<li style="width: ' +
                liWidth +
                '"><div><p>' +
                val.date +
                "\n" +
                removeRichText(val.content1) +
                "</p></div><div><p>" +
                removeRichText(val.content2) +
                "</p></div></li>"
            );
          });
        }
      );
    },
    initBottomLeft() {
      // 初始化下左
      let $body = $(".sjfx-left-bottom").empty();
      $body.append(
        "<div><div>诉求时间</div><div>姓名</div><div>诉求内容</div><div>分局</div></div>"
      );
      sugon.requestJson(
        {
          type: "post",
          url: sugon.interFaces.zxyp.rx.popup.getBottomLeft,
          data: params
        },
        result => {
          result.data.map(val => {
            $body.append(
              "<div><div>" +
                val.sqsj +
                "</div><div>" +
                val.xm +
                "</div><div>" +
                val.sqnr +
                "</div><div>" +
                val.fj +
                "</div></div>"
            );
          });
        }
      );
    },
    initBottomRight() {
      // 初始化下右
      let $body = $(".sjfx-right-bottom").empty();
      let condition = { ...params, isMy: $(".select2").val() };
      sugon.requestJson(
        {
          type: "post",
          url: sugon.interFaces.zxyp.rx.popup.getBottomRight,
          data: condition
        },
        result => {
          result.data.map((val, index) => {
            $body.append(
              "<div><div><span>" +
                (index + 1) +
                "、" +
                val.title +
                "</span><div><span>" +
                val.date +
                "</span><span>" +
                val.dept +
                "</span></div></div><div><div><div>诉求内容</div><div>" +
                val.sqnr +
                "</div></div><div><div>答复脚本</div><div>" +
                val.dfjb +
                "</div></div></div></div>"
            );
          });
        }
      );
    }
  };

  // 去除富文本样式
  function removeRichText(str) {
    return str
      .replace(/(\n)/g, "")
      .replace(/(\t)/g, "")
      .replace(/(\r)/g, "")
      .replace(/<\/?[^>]*>/g, "")
      .replace(/\s*/g, "");
  }

  // 时间轴换页事件
  function timeLineEvent(e) {
    let $target = $(e.target);
    let $ul = $(".time-box > ul"),
      $body = $(".time-box"),
      len = $(".time-box > ul > li").length;
    let parentWidth = $body.width();
    let width =
        parentWidth *
        (len % 3 == 0 ? parseInt(len / 3) : parseInt(len / 3) + 1),
      marginLeft = parseFloat($ul.css("margin-left"));
    if ($target.hasClass("left-btn")) {
      if (marginLeft < 0) {
        let newMarginLeft = marginLeft + parentWidth;
        newMarginLeft = Math.round(newMarginLeft / parentWidth) * parentWidth;
        $ul
          .stop()
          .animate(
            { "margin-left": newMarginLeft + "px" },
            200,
            "linear",
            () => {
              $(".time-line > div").one("click", timeLineEvent);
            }
          );
      }
    } else if ($target.hasClass("right-btn")) {
      if (Math.abs(marginLeft) + parentWidth + 2 < width) {
        let newMarginLeft = marginLeft - parentWidth;
        newMarginLeft = Math.round(newMarginLeft / parentWidth) * parentWidth;
        $ul
          .stop()
          .animate(
            { "margin-left": newMarginLeft + "px" },
            200,
            "linear",
            () => {
              $(".time-line > div").one("click", timeLineEvent);
            }
          );
      }
    } else {
      $(".time-line > div").one("click", timeLineEvent);
    }
  }

  // 程序入口
  $(function() {
    functions.initPopup();
  });

  // 绑定时间轴换页事件
  $(".time-line > div").one("click", timeLineEvent);

  // 第一个下拉框改变事件
  $(".select1").on("change", functions.initMidRight);

  // 第二个下拉框改变事件
  $(".select2").on("change", functions.initBottomRight);
});
