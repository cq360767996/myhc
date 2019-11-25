requirejs(["common", "ec", "ecPlugin"], (sugon, ec) => {
  // 全局查询参数
  let searchParams = {};
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
          left: "center",
          top: "middle"
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
    pie2(rawId, data, params) {
      let id = rawId + "-left";
      let sum = data.reduce((sum, val) => sum + Number(val.value), 0);
      let xData = [];
      let max = data.reduce((max, val) => Math.max(Number(val.value), max), 0);
      let color = ["#71b6f9", "#14c6ca", "#a29ff3", "#f08988", "#f3b657"];
      let $parent = $(`#${id}`).parent();
      let selectedIndex;
      data.map((val, index) => {
        xData.push(val.name);
        val.percent = ((val.value / sum) * 100).toFixed(0);
        if (max == val.value) {
          val.selected = true;
          selectedIndex = index;
        }
      });
      $(`#${id} > div`).remove();
      let popId = id + "-pop";
      $parent.append(`<div id="${popId}" class="pop-div" style="color: ${color[selectedIndex]}">
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

      this.render(id, option, async param => {
        let code = param.data.code;
        $(`#${popId}`).css("color", param.color)
          .html(`<div>${param.data.name}：${param.data.value}件</div>
                 <div>${param.data.percent}%</div>`);
        let { date1, date2, deptId, type } = params;
        let personId = searchParams.id;
        let result = await sugon.request(
          sugon.interFaces.slhy.pjda.getBarByAnnual,
          { date1, date2, deptId, type, code, id: personId }
        );
        this.lineAndBar2(rawId, result.data);
      });
    },
    // 线柱状混合图(两列柱子)
    lineAndBar1(id, data) {
      let yData1 = [];
      let yData2 = [];
      let yData3 = [];
      let xData = [];
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
      let yData1 = [];
      let yData2 = [];
      let xData = [];
      id += "-right";
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
  async function initTop() {
    let { id } = searchParams;
    let result = await sugon.request(sugon.interFaces.slhy.pjda.initTop, {
      id
    });
    chart.fluid("chart1", result.data2[0]);
    $(`.good-rank`).html(result.data2[1]);
    $(`.bad-rank`).html(result.data2[2]);
    result.data1.map((val, index) => {
      $(".top-val")
        .eq(index)
        .html(val);
    });
  }

  // 初始化中间的面板
  async function initMid() {
    let { id } = searchParams;
    let result = await sugon.request(sugon.interFaces.slhy.pjda.initMid, {
      id
    });
    chart.pie1("chart2", result.data1);
    chart.pie1("chart3", result.data2, true);
    chart.lineAndBar1("chart4", result.data3);
  }

  // 初始化最下层面板
  async function initBottom() {
    let params = await initTimeLine();
    $(".main-container > section .right-aside").empty();
    await getBottomDetail({ ...params, type: 0 });
    await getBottomDetail({ ...params, type: 1 });
  }

  // 渲染时间线
  async function initTimeLine() {
    let { id } = searchParams;
    let result = await sugon.request(sugon.interFaces.slhy.pjda.initTimeLine, {
      id
    });
    let html = "";
    let $body = $(".time-line-container");
    let $firstLi = $(".time-line-container > li:first-child::before");
    result.data.map((val, i) => {
      let selected = i === 0 ? " li-selected" : "";
      html += `<li dept-id="${val.deptId}" class="time-line-row${selected}">
                  <span></span>
                  <span>${val.date1}-${val.date2}</span>
                  <br/>
                  <span>${val.deptName}</span>
                  <span></span>
              </li>`;
    });
    $body.empty().append(html);
    $firstLi.css("background-color", "#509ce9");
    let { date1, date2, deptId } = result.data[0];
    return { date1, date2, deptId };
  }

  // 获取最下层的细节数据
  async function getBottomDetail({ date1, date2, deptId, type }) {
    let id = searchParams.id;
    let result = await sugon.request(
      sugon.interFaces.slhy.pjda.getBottomDetail,
      {
        id,
        date1,
        date2,
        deptId,
        type
      }
    );

    let html = "",
      data1 = result.data1;
    let uuid = sugon.uuid();
    html += `<section id="${uuid}">
              <header>
                <img src="../../img/slhy/pjda/img10.png" />
                <span>${date1}—${date2}</span>
                <span>${data1[0]}</span>
                <span>岗位：${data1[1]}</span>
                <span>业务量：
                  <strong class="strong1">${data1[2]}</strong>件</span>
                <span>被投诉：
                  <strong class="strong2">${data1[3]}</strong>次</span>
                <span>满意度：
                  <strong class="strong3">${data1[4]}</strong></span>
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
    $(".main-container > section .right-aside").append(html);
    chart.pie2(uuid, result.data2, { date1, date2, deptId, type });
    chart.lineAndBar2(uuid, result.data3);
    let $listDom = $(
        `#${uuid} > section > aside:first-child > section:last-child > aside > section`
      ),
      $RankDom = $(`#${uuid} > section > aside:last-child > section > aside`);
    renderList($listDom.eq(0), result.data4);
    renderList($listDom.eq(1), result.data5);
    renderRank($RankDom.eq(0), result.data6);
    renderRank($RankDom.eq(1), result.data7);
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
                <cell title="${val}">${val}</cell>
              </row>`;
    });
    $dom.append(html);
  }

  // 页面入口
  function initPage() {
    searchParams.id = window.selectedPersonId;
    initTop();
    initMid();
    initBottom();
  }

  // 页面入口
  initPage();

  // 关闭按钮事件
  $(".close-btn").on("click", () => {
    $(".main-container").remove();
  });

  // 时间轴点击事件
  $(".time-line-container").on("click", ".time-line-row", async e => {
    let $target = $(e.currentTarget);
    let selected = "li-selected";
    if (!$target.hasClass(selected)) {
      $(".time-line-row").removeClass(selected);
      $target.addClass(selected);
      let dateArr = $target
        .find("span")
        .eq(1)
        .html()
        .split("-");
      let [date1, date2] = dateArr;
      let deptId = $target.attr("dept-id");
      $(".main-container > section .right-aside").empty();
      await getBottomDetail({ date1, date2, deptId, type: 0 });
      await getBottomDetail({ date1, date2, deptId, type: 1 });
    }
  });
});
