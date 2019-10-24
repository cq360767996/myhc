requirejs(["common", "ec", "jqcloud"], (sugon, ec) => {
  // 全局查询条件
  let searchParams = {};

  let viewRenderer = {
    render(id, option, callback) {
      const chart = ec.init(document.getElementById(id));
      chart.setOption(option);
      callback && (chart.off(), chart.on("click", callback));
    },
    // 按Y轴分类的柱状图
    barY(id, data) {
      let xData = [],
        yData = [];
      data.map(val => {
        yData.push(val.name);
        xData.push(val.value);
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
          right: 10,
          bottom: 10,
          top: 10,
          containLabel: true
        },
        xAxis: {
          type: "value",
          boundaryGap: [0, 0.01],
          splitLine: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false
          }
        },
        yAxis: {
          type: "category",
          data: yData,
          splitLine: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          }
        },
        series: [
          {
            type: "bar",
            label: {
              show: true,
              position: "right"
            },
            itemStyle: {
              color: new ec.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: "#56abe1" },
                { offset: 1, color: "#77bfec" }
              ])
            },
            barWidth: 20,
            data: xData
          }
        ]
      };
      this.render(id, option);
    },
    // 环图
    pie(id, data) {
      let total = data.reduce((acc, val) => acc + Number(val.value), 0);
      let $parent = $(`#${id}`).parent();
      $parent.find("aside").remove();
      $parent.append(`<aside><div>总量</div><div>${total}</div></aside>`);
      $parent
        .find("aside")
        .off()
        .on("click", () => {
          searchParams.id = "";
          initMid3();
        });
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
            type: "pie",
            clockWise: false,
            center: ["50%", "50%"],
            radius: ["55%", "70%"],
            hoverAnimation: false,
            itemStyle: {
              normal: {
                label: {
                  show: true,
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
      this.render(id, option, params => {
        searchParams.id = params.data.id;
        initMid3();
      });
    },
    // 半个环图
    pieHalf(id, data) {
      let xData = [],
        yData = [],
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
          itemStyle: {
            color: "transparent",
            label: {
              show: false
            },
            labelLine: {
              show: false
            }
          }
        };
      data.map((val, index) => {
        let { name, value } = val;
        xData.push(val.name);
        yData.push({
          name,
          value,
          itemStyle: {
            color: colorArr[index],
            label: { show: false },
            labelLine: { show: false }
          }
        });
      });

      for (let i = 0; i < len; i++) {
        yData.push(transparentData);
      }
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
            data: yData
          }
        ]
      };
      this.render(id, option);
    },
    // 热词
    jqcloud(id, data) {
      let html = "";
      data.map(val => {
        html += `{text: '${val.name}', weight: '${val.value}',html: {'class': 'span_list'}},`;
      });
      $(`#${id}`)
        .empty()
        .jQCloud(eval(`[ ${html} ]`));
    },
    // 表1
    tab1(id, data) {
      let html = `<row>
                    <cell>关注排名</cell>
                    <cell>聚焦点</cell>
                    <cell>数量</cell>
                  </row>`;
      data.map((val, index) => {
        html += `<row>
                  <cell>${index + 1}</cell>
                  <cell>${val.name}</cell>
                  <cell>${val.value}</cell>
                </row>`;
      });
      $(`#${id}`)
        .empty()
        .append(html);
    },
    // 表2
    tab2(id, data) {
      let html = `<row>
                    <cell>排名</cell>
                    <cell>姓名</cell>
                    <cell>职务</cell>
                    <cell>意见建议数</cell>
                  </row>`;
      data.map((val, index) => {
        let firstCell = val.rank
          ? `<img src="../../img/myhc/myzd/n${val.rank}.png"/>`
          : index + 1;
        html += `<row>
                  <cell>${firstCell}</cell>
                  <cell>${val.name1}</cell>
                  <cell>${val.name2}</cell>
                  <cell>${val.value}</cell>
                </row>`;
      });
      $(`#${id}`)
        .empty()
        .append(html);
    }
  };

  // 左1
  function initLeft1() {
    sugon
      .request(sugon.interFaces.myhc.myzd.getLeft1, searchParams)
      .then(result => {
        viewRenderer.barY("chart1", result.data);
      });
  }
  // 左2
  function initLeft2(pageNum = 1) {
    let params = { pageNum };
    Object.assign(params, searchParams);
    sugon.request(sugon.interFaces.myhc.myzd.getLeft2, params).then(result => {
      viewRenderer.tab1("tab1", result.data);
      sugon.renderNav(
        $(`#tab1 + footer > div`),
        pageNum,
        result.totalPage,
        initLeft2
      );
    });
  }
  // 中1
  function initMid1() {
    sugon
      .request(sugon.interFaces.myhc.myzd.getMid1, searchParams)
      .then(result => {
        let $div = $(".div-val");
        result.data.map((val, index) => {
          $div.eq(index).html(index === 1 ? val + "%" : val);
        });
      });
  }
  // 中2
  function initMid2() {
    sugon
      .request(sugon.interFaces.myhc.myzd.getMid2, searchParams)
      .then(result => {
        viewRenderer.pie("chart2", result.data);
      });
  }
  // 中3
  function initMid3() {
    sugon
      .request(sugon.interFaces.myhc.myzd.getMid3, searchParams)
      .then(result => {
        viewRenderer.pieHalf("chart3", result.data);
      });
  }
  // 右1
  function initRight1(pageNum = 1) {
    let params = { pageNum };
    Object.assign(params, searchParams);
    sugon.request(sugon.interFaces.myhc.myzd.getRight1, params).then(result => {
      viewRenderer.tab2("tab2", result.data);
      sugon.renderNav(
        $(`#tab2 + footer > div`),
        pageNum,
        result.totalPage,
        initLeft2
      );
    });
  }
  // 右2
  function initRight2() {
    sugon
      .request(sugon.interFaces.myhc.myzd.getRight2, searchParams)
      .then(result => {
        viewRenderer.jqcloud("chart4", result.data);
      });
  }

  // 初始化下面的面板
  function searchFunc() {
    searchParams.id = "";
    searchParams.deptId = $("#dept-id").val();
    searchParams.deptName = $("#dept-name").val();
    searchParams.date1 = $("#date1").val();
    searchParams.date2 = $("#date2").val();
    initLeft1();
    initLeft2();
    initMid1();
    initMid2();
    initMid3();
    initRight1();
    initRight2();
  }

  // 页面入口
  function initPage() {
    let param = sugon.getParam(location.hash);
    Object.assign(searchParams, param);
    Promise.resolve()
      .then(() => sugon.initSearchBar({ cb: searchFunc }))
      .then(() => searchFunc());
  }

  // 页面入口
  initPage();

  // 关闭按钮
  $(".top-panel > i").on("click", () => {
    location.hash = "myzd";
  });
});
