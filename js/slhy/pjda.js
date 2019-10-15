requirejs(["common", "ec", "ecPlugin"], (sugon, ec) => {
  // 最下层细节缓存数据
  let cacheData = [];
  // 所有echarts图的渲染
  const chart = {
    // 渲染echarts图
    render(id, option, callback) {
      const chart = ec.init(document.getElementById(id));
      chart.setOption(option);
      callback && chart.on("click", callback);
    },
    // 流体球
    fluid(id, value) {
      let data = [value, 0.5, 0.4, 0.3];
      let option = {
        title: {
          text: `${value}%`,
          textStyle: {
            color: "#fff",
            fontSize: "24",
            fontWeight: "450"
          },
          left: "32%",
          top: "37%"
        },
        series: [
          {
            type: "liquidFill",
            data,
            radius: "80%",
            color: [
              new ec.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "rgba(227, 184, 74, 1.0)" },
                { offset: 1, color: "#ffa800" }
              ])
            ],
            center: ["50%", "50%"],
            outline: {
              borderDistance: 0,
              itemStyle: {
                borderWidth: 1,
                borderColor: "#2A9BD5"
              }
            },
            label: {
              normal: {
                show: false,
                color: "#000000",
                insideColor: "white",
                fontSize: 24
              }
            },
            backgroundStyle: {
              color: "rgba(232,241,248,0.8)"
            }
          }
        ]
      };
      this.render(id, option);
    },
    // 单颜色环图
    pie1(id, data, isRed) {
      let [color, title, className] = isRed
          ? ["#f17c8c", "满意度最低业务", "right"]
          : ["#3ec1a1", "满意度最高业务", "left"],
        handledData = [
          data,
          { name: "", value: (100 - data.value).toFixed(2) }
        ];
      $(`.${className}-div`).remove();
      $(`#${id}`)
        .parent()
        .append(`<div class="${className}-div">${title}</div>`);
      let option = {
        title: {
          text: data.name,
          subtext: `${data.value}%`,
          left: "center",
          top: "35%",
          textStyle: {
            fontSize: 16,
            color
          },
          subtextStyle: {
            fontSize: 16,
            color
          }
        },
        color: [color, "#e6e6e6"],
        series: [
          {
            type: "pie",
            radius: ["60%", "70%"],
            label: {
              show: false
            },
            hoverAnimation: false,
            labelLine: {
              show: false
            },
            data: handledData
          }
        ]
      };
      this.render(id, option);
    },
    // 多颜色环图
    pie2(id, data) {
      let sum = data.reduce((sum, val) => sum + Number(val.value), 0),
        xData = [],
        max = data.reduce((max, val) => Math.max(Number(val.value), max), 0),
        color = ["#71b6f9", "#14c6ca", "#a29ff3", "#f08988", "#f3b657"],
        $parent = $(`#${id}`).parent(),
        selectedIndex;
      data.map((val, index) => {
        xData.push(val.name);
        val.percent = ((val.value / sum) * 100).toFixed(0);
        if (max == val.value) {
          val.selected = true;
          selectedIndex = index;
        }
      });
      $(`#${id} > div`).remove();
      $parent.append(`<div class="pop-div" style="color: ${color[selectedIndex]}">
                        <div>${data[selectedIndex].name}：${data[selectedIndex].value}件</div>
                        <div>${data[selectedIndex].percent}%</div>
                      </div>`);
      let option = {
        color,
        tooltip: {
          formatter: "{b}: {c} ({d}%)"
        },
        legend: {
          bottom: 0,
          data: xData
        },
        series: [
          {
            type: "pie",
            radius: ["50%", "70%"],
            center: ["50%", "37%"],
            selectedMode: "single",
            hoverAnimation: false,
            avoidLabelOverlap: false,
            label: {
              show: true,
              position: "inside",
              formatter: function(param) {
                return param.data.percent + "%";
              }
            },
            data
          }
        ]
      };

      this.render(id, option, param => {
        $(".pop-div").css("color", param.color)
          .html(`<div>${param.data.name}：${param.data.value}件</div>
                 <div>${param.data.percent}%</div>`);
      });
    },
    // 线柱状混合图(两列柱子)
    lineAndBar1(id, data) {
      let yData1 = [],
        yData2 = [],
        yData3 = [],
        xData = [];
      data.map(val => {
        xData.push(val.name);
        yData1.push(val.value1);
        yData2.push(val.value2);
        yData3.push(val.value3);
      });
      let option = {
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
          data: ["接警量", "办案量", "满意度"]
        },
        grid: {
          top: "15%",
          left: "7%",
          width: "87%",
          height: "75%"
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
            type: "value",
            name: "接警量/办案量"
          },
          {
            type: "value",
            name: "满意度",
            // min: data2Min,
            // max: data2Max,
            axisLabel: {
              formatter: "{value}%"
            }
          }
        ],
        series: [
          {
            name: "接警量",
            type: "bar",
            data: yData1,
            barWidth: "15",
            itemStyle: {
              normal: {
                barBorderRadius: [2, 2, 0, 0],
                borderWidth: 1,
                borderColor: "rgba(18, 86, 108, 0.5)",
                color: "#14c6ca",
                label: {
                  show: false
                }
              }
            }
          },
          {
            name: "办案量",
            type: "bar",
            data: yData2,
            barWidth: "15",
            itemStyle: {
              normal: {
                barBorderRadius: [2, 2, 0, 0],
                borderWidth: 1,
                borderColor: "rgba(18, 86, 108, 0.5)",
                color: "#6b8ab6",
                label: {
                  show: false
                }
              }
            }
          },
          {
            name: "满意度",
            type: "line",
            yAxisIndex: 1,
            color: "#1890ff",
            data: yData3
          }
        ]
      };
      this.render(id, option);
    },
    // 线柱状混合图(一列柱子)
    lineAndBar2(id, data) {
      let yData1 = [],
        yData2 = [],
        xData = [];
      data.map(val => {
        xData.push(val.name);
        yData1.push(val.value1);
        yData2.push(val.value2);
      });
      let option = {
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
          data: ["投诉次数", "满意度"]
        },
        grid: {
          top: 20,
          left: 0,
          bottom: 0,
          right: 0,
          containLabel: true
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
          },
          {
            type: "value",
            // min: data2Min,
            // max: data2Max,
            axisLabel: {
              formatter: "{value}%"
            }
          }
        ],
        series: [
          {
            name: "投诉次数",
            type: "bar",
            data: yData1,
            barWidth: "15",
            itemStyle: {
              normal: {
                barBorderRadius: [2, 2, 0, 0],
                borderWidth: 1,
                borderColor: "rgba(18, 86, 108, 0.5)",
                color: "#f17c8c",
                label: {
                  show: false
                }
              }
            }
          },
          {
            name: "满意度",
            type: "line",
            yAxisIndex: 1,
            color: "#1890ff",
            data: yData2
          }
        ]
      };
      this.render(id, option);
    }
  };

  // 初始化最上层面板
  function initTop() {
    sugon.request(sugon.interFaces.slhy.pjda.initTop).then(result => {
      chart.fluid("chart1", result.data2[0]);
      $(`.good-rank`).html(result.data2[1]);
      $(`.bad-rank`).html(result.data2[2]);
    });
  }

  // 初始化中间的面板
  function initMid() {
    sugon.request(sugon.interFaces.slhy.pjda.initMid).then(result => {
      chart.pie1("chart2", result.data1);
      chart.pie1("chart3", result.data2, true);
      chart.lineAndBar1("chart4", result.data3);
    });
  }

  // 初始化最下层面板
  function initBottom() {
    Promise.resolve()
      .then(() => initTimeLine())
      .then(date => {
        $(".main-container > section .right-aside").empty();
        getBottomDetail(date, 0);
        getBottomDetail(date, 1);
      });
  }

  // 渲染时间线
  function initTimeLine() {
    return new Promise((resolve, reject) => {
      sugon.request(sugon.interFaces.slhy.pjda.initTimeLine).then(result => {
        let html = "";
        for (let i = 1, len = result.data.length; i < len; i++) {
          html += `<li class="${i === 1 ? "li-selected" : ""}">
                    <span></span>
                    <span></span>
                    <span>${result.data[i - 1]}-${result.data[i]}</span>
                    <span></span>
                  </li>`;
        }
        $(".time-line-container")
          .empty()
          .append(html);
        $(".time-line-container > li:first-child::before").css(
          "background-color",
          "#509ce9"
        );
        resolve({ date1: result.data[0], date2: result.data[1] });
      });
    });
  }

  // 获取最下层的细节数据
  function getBottomDetail(date, type) {
    sugon
      .request(sugon.interFaces.slhy.pjda.getBottomDetail, { type })
      .then(result => {
        let html = "",
          data1 = result.data1;
        let uuid = sugon.uuid();
        html += `<section id="${uuid}">
                <header>
                  <img src="../../img/slhy/pjda/img10.png" />
                  <span>${date.date1}—${date.date2}</span>
                  <span>${data1[0]}</span>
                  <span>岗位：${data1[1]}</span>
                  <span>业务量：
                    <strong class="strong1">${data1[2]}</strong>件</span>
                  <span>被投诉：
                    <strong class="strong2">${data1[3]}</strong>次</span>
                  <span>满意度：
                    <strong class="strong3">${data1[4]}%</strong></span>
                </header>
                <section>
                  <aside>
                    <section>
                      <aside>
                        <header>
                          <img src="../../img/slhy/pjda/img11.png" />
                          <span>业务分析</span>
                        </header>
                        <section id="${uuid}-left"></section>
                      </aside>
                      <aside id="${uuid}-right"></aside>
                    </section>
                    <section>
                      <aside>
                        <header>
                          <img src="../../img/slhy/pjda/img11.png" />
                          <span>民意点赞</span>
                        </header>
                        <section>
                        </section>
                      </aside>
                      <aside>
                        <header>
                          <img src="../../img/slhy/pjda/img11.png" />
                          <span>民意诉求</span>
                        </header>
                        <section></section>
                      </aside>
                    </section>
                  </aside>
                  <aside>
                    <header>
                      <img src="../../img/slhy/pjda/img11.png" />
                      <span>群众诉求及评价</span>
                    </header>
                    <section>
                      <aside>
                        <header>
                          <img src="../../img/slhy/pjda/img12.png" />
                          <span>群众评价热词</span>
                        </header>
                      </aside>
                      <aside>
                        <header>
                          <img src="../../img/slhy/pjda/img12.png" />
                          <span>群众诉求热词</span>
                        </header>
                      </aside>
                    </section>
                  </aside>
                </section>
              </section>`;
        // <div class="fold-btn"></div>
        $(".main-container > section .right-aside").append(html);
        chart.pie2(`${uuid}-left`, result.data2);
        chart.lineAndBar2(`${uuid}-right`, result.data3);
        let $listDom = $(
            `#${uuid} > section > aside:first-child > section:last-child > aside > section`
          ),
          $RankDom = $(
            `#${uuid} > section > aside:last-child > section > aside`
          );
        renderList($listDom.eq(0), result.data4);
        renderList($listDom.eq(1), result.data5);
        renderRank($RankDom.eq(0), result.data6);
        renderRank($RankDom.eq(1), result.data7);
      });
  }

  // 渲染最下层detail的列表
  function renderList($dom, data) {
    let html = "";
    data.map(val => {
      html += `<row>
                <p>${val.id}</p>
                <p>${val.content}</p>
              </row>`;
    });
    $dom.append(html);
  }

  // 渲染最下层detail的排名
  function renderRank($dom, data) {
    let html = "";
    data.map((val, i) => {
      html += `<row>
                <cell class="${i < 3 ? `span-top${i + 1}` : ""}"></cell>
                <cell>${val}</cell>
              </row>`;
    });
    $dom.append(html);
  }

  // 页面入口
  function initPage() {
    initTop();
    initMid();
    initBottom();
  }

  // 页面入口
  initPage();

  $(".close-btn").on("click", () => {
    location.hash = "rdwt?click=1";
  });

  // // 伸缩按钮事件
  // $(".right-aside").on("click", ".fold-btn", e => {
  //   let $target = $(e.target),
  //     $parent = $target.parent(),
  //     height = $parent.css("height"),
  //     targetHeight,
  //     hideSection = $parent.find(
  //       "section > aside:first-child > section:last-child"
  //     ),
  //     className = "";
  //   $target.removeClass("fold-btn-up");
  //   if (height == "340px") {
  //     targetHeight = "530px";
  //     hideSection.show();
  //   } else {
  //     targetHeight = "340px";
  //     hideSection.hide();
  //     className = "fold-btn-up";
  //   }
  //   $parent.animate({ height: targetHeight });
  //   $target.addClass(className);
  // });
});
