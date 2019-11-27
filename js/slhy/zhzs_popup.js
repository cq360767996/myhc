requirejs(["common", "ec"], (sugon, ec) => {
  // 全局查询条件
  let searchParams = { code: null, bottomId: null };
  // 初始化查询栏
  async function initSearchBar() {
    let { deptId, deptName } = searchParams;
    $(".main-title").html(`${deptName}效能档案`);
    let result = await sugon.request(sugon.interFaces.slhy.zhzs.getDeptTree, {
      deptId,
      type: 1
    });
    const $deptTree = $("#dept-tree");
    const $deptName = $("#dept-name");
    const $deptId = $("#dept-id");
    //渲染树
    $deptTree.css("width", $deptName.outerWidth()).treeview({
      data: result.data,
      levels: 1,
      onNodeSelected: function(event, node) {
        $deptName.val(node.text);
        $deptId.val(node.id);
        $deptTree.css("visibility", "hidden");
      },
      showCheckbox: false //是否显示多选
    });
    sugon.initDateInput("date1", (searchParams.date1 = sugon.getDate(-7)));
    sugon.initDateInput("date2", (searchParams.date2 = sugon.getDate(-1)));
    $deptId.val((searchParams.deptId = result.data[0].id));
    $deptName.val((searchParams.deptName = result.data[0].text));
    // 为单位名称绑定点击事件
    $deptName.off().on("click", () => {
      $deptTree.css(
        "visibility",
        $deptTree.css("visibility") === "hidden" ? "visible" : "hidden"
      );
    });
  }

  // 初始化最上面板
  function initTop() {
    initTopLeft();
    initTopRight();
  }

  // 初始化最上左侧面板
  async function initTopLeft() {
    let { deptId } = searchParams;
    let result = await sugon.request(sugon.interFaces.slhy.zhzs.getTopLeft, {
      deptId
    });
    $(".top-left-val").each((index, dom) => {
      $(dom).html(result.data1[index]);
    });
    $(".top-left-popup > div").html(result.data2);
  }

  // 初始化最上右侧面板
  async function initTopRight() {
    let { deptId, date1, date2 } = searchParams;
    let result = await sugon.request(sugon.interFaces.slhy.zhzs.getTopRight, {
      deptId,
      date1,
      date2
    });
    let html1 = "";
    let html2 = "";
    result.data1.map(val => {
      html1 += `<div>
                  <div>
                    <span 
                      class="icon24x24-${reflectId2Index(val.id, true)}">
                    </span>
                    <span>${val.name}</span>
                  </div>
                  <div>${val.value}</div>
                </div>`;
    });
    result.data2.map(val => {
      html2 += `<div>
                  <div>
                    <span 
                      class="icon24x24-${reflectId2Index(val.id)}">
                    </span>
                    <span>${val.name}</span>
                  </div>
                  <div>${val.value}</div>
                </div>`;
    });
    $(".top-right-top")
      .empty()
      .append(html1);
    $(".top-right-bottom")
      .empty()
      .append(html2);
  }

  // 初始化中间面板
  async function initMid() {
    await initMidTop();
    initMidBottomLeft();
    initMidBottomRight();
  }

  // 初始化中上面板
  async function initMidTop() {
    let { deptId, date1, date2 } = searchParams;
    let result = await sugon.request(sugon.interFaces.slhy.zhzs.getMidTop, {
      deptId,
      date1,
      date2
    });
    $(".mid-top-left").html(result.content);
    let html = "";
    if (result.data.length > 0) {
      searchParams.id = result.data[0].id;
      searchParams.sort = result.data[0].value > 0 ? "asc" : "desc";
      searchParams.title = result.data[0].name;
    }
    result.data.map((val, index) => {
      let upOrDown = Number(val.value) < 0 ? "down" : "up";
      html += `<div row-id="${val.id}"
                  class="mid-top-right-row 
                  icon269x48-${val.id}${index === 0 ? " selected" : ""}">
                    <div>${val.name}</div>
                    <div class="${upOrDown}-color">
                      ${Math.abs(val.value)}%
                      <i class="glyphicon glyphicon-arrow-${upOrDown}"></i>
                    </div>
                  </div>`;
    });
    $(".mid-top-right")
      .empty()
      .append(html);
  }

  // 初始化中下左侧面板
  async function initMidBottomLeft() {
    let { deptId, date1, date2, id, title } = searchParams;
    $(".mid-bottom-left-title").html(title + "——");
    let result = await sugon.request(
      sugon.interFaces.slhy.zhzs.getMidBottomLeft,
      { deptId, date1, date2, id }
    );
    let minAndMax = sugon.handleMinAndMax(result.data);
    let { min, max } = minAndMax;
    let indicator = [];
    let yData = [];
    result.data.map(val => {
      yData.push(val.value);
      let { name, code } = val;
      indicator.push({ name, code, min, max });
    });
    let option = {
      tooltip: {},
      radar: {
        triggerEvent: true,
        name: {
          textStyle: {
            color: "#666"
          }
        },
        indicator
      },
      series: [
        {
          type: "radar",
          areaStyle: {
            color: "rgba(70, 168, 255, 0.5)"
          },
          lineStyle: {
            color: "rgba(70, 168, 255, 0.5)"
          },
          data: [
            {
              name: "问题分布",
              value: yData
            }
          ]
        }
      ]
    };
    sugon.renderChart({ id: "chart", option, data: result.data, cb });

    // 点击事件回调
    function cb(param) {
      // 点击标题
      if (param.componentType === "radar") {
        result.data.map(val => {
          if (val.name === param.name) {
            searchParams.code = val.code;
          }
        });
      } else if (param.componentType === "series") {
        searchParams.code = null;
      }
      option.radar.indicator.map(val => {
        val.color = "#666";
        if (val.code === searchParams.code) {
          val.color = "red";
        }
      });
      ec.getInstanceByDom(document.getElementById("chart")).setOption(option);
      initMidBottomRight();
    }
  }

  // 初始化中下右侧面板
  async function initMidBottomRight() {
    let { deptId, date1, date2, id, code, sort } = searchParams;
    let result = await sugon.request(
      sugon.interFaces.slhy.zhzs.getMidBottomRight,
      { deptId, date1, date2, id, code, sort }
    );
    $(".mid-bottom-right-title").html(result.content);
    let html = "";
    result.data.map((val, index) => {
      let upOrDown, upOrDownStr;
      let lastTwoRow = "";
      if (val.value2 < 0) {
        upOrDown = "down";
        upOrDownStr = "下降";
      } else {
        upOrDown = "up";
        upOrDownStr = "上升";
      }
      val.value3.map(val => {
        lastTwoRow += `<div><span>${val.name}</span><span>${val.value}</span></div>`;
      });
      html += `<div class="icon147x241-${index + 1}">
                <div>TOP${index + 1}</div>
                <div title="${val.name}">${val.name}</div>
                <div class="list-color">${val.value1}</div>
                <div>
                  <span>环比<br />${upOrDownStr}</span>
                  <i class="color-${upOrDown} glyphicon glyphicon-arrow-${upOrDown}"></i>
                  <span class="color-${upOrDown}">${Math.abs(val.value2)}</span>
                </div>
                <div>问题集中单位</div>
                ${lastTwoRow}
              </div>`;
    });
    $(".mid-bottom-right")
      .empty()
      .append(html);
  }

  // 初始化最下面板
  function initBottom() {
    initBottomLeft();
    initBottomMid();
    initBottomRight();
  }

  // 初始化最下左侧面板
  async function initBottomLeft() {
    let { deptId, date1, date2, deptName } = searchParams;
    $(".bottom-left-span").html(`${deptName}<br />效能评估总结`);
    let result = await sugon.request(sugon.interFaces.slhy.zhzs.getBottomLeft, {
      deptId,
      date1,
      date2
    });
    $(".bottom-left > main > div:last-child")
      .attr("title", result.content)
      .html(result.content);
  }

  // 初始化最下中间面板
  async function initBottomMid() {
    let { deptId, date1, date2 } = searchParams;
    let result = await sugon.request(sugon.interFaces.slhy.zhzs.getBottomMid, {
      deptId,
      date1,
      date2
    });
    let html = "";
    result.data.map(val => {
      html += `<div>
                <img src="../../img/slhy/zhzs/photo.png" />
                <div>
                  <div>${val.name}</div>
                  <div>${val.value}</div>
                </div>
              </div>`;
    });
    $(".bottom-mid > main")
      .empty()
      .append(html);
  }

  // 初始化最下右侧select
  async function initBottomRightSelect() {
    let { deptId, date1, date2 } = searchParams;
    let result = await sugon.request(
      sugon.interFaces.slhy.zhzs.getBottomRightSelect,
      {
        deptId,
        date1,
        date2
      }
    );
    let html = "";
    searchParams.bottomId = result.data[0].id || null;
    result.data.map(val => {
      html += `<option value="${val.id}">${val.name}</option>`;
    });
    $(".bottom-right-select")
      .empty()
      .append(html);
  }

  // 初始化最下右侧面板
  async function initBottomRight() {
    let { deptId, date1, date2, bottomId } = searchParams;
    let result = await sugon.request(
      sugon.interFaces.slhy.zhzs.getBottomRight,
      { deptId, date1, date2, id: bottomId }
    );
    let html = "";
    result.data.map((val, index) => {
      let firstCell =
        index < 3 ? `<span class="icon32x32-${index + 5}"></span>` : index + 1;
      html += `<row>
                <cell>${firstCell}</cell>
                <cell>${val.name}</cell>
                <cell>${val.dw}</cell>
                <cell><span>满意度</span><strong> ${val.value}</strong></cell>
                <cell><span>业务量</span><strong> ${val.ywl}件</strong></cell>
              </row>`;
    });
    $(".bottom-right > main")
      .empty()
      .append(html);
  }

  // 把id转为图片的索引
  function reflectId2Index(id, isSix = false) {
    let result = "";
    if (isSix) {
      switch (id) {
        case "1":
          result = 4;
          break;
        case "2":
          result = 6;
          break;
        case "3":
          result = 7;
          break;
        case "4":
          result = 5;
          break;
        case "5":
          result = 8;
          break;
        case "6":
          result = 9;
          break;
      }
    } else {
      switch (id) {
        case "1":
          result = 4;
          break;
        case "2":
          result = 6;
          break;
        case "3":
          result = 11;
          break;
        case "4":
          result = 14;
          break;
        case "5":
          result = 15;
          break;
        case "6":
          result = 12;
          break;
        case "7":
          result = 10;
          break;
        case "8":
          result = 13;
          break;
      }
    }
    return result;
  }

  // 查询按钮事件
  async function searchFunc() {
    await initBottomRightSelect();
    initTop();
    initMid();
    initBottom();
  }

  // 页面入口
  async function initPage() {
    // 获取主页传过来的deptId
    searchParams.deptId = window.passDeptId;
    searchParams.deptName = window.passDeptName;
    await initSearchBar();
    searchFunc();
  }

  // 页面入口
  initPage();

  // 关闭按钮
  $(".close-btn").on("click", () => {
    $(".main-container").remove();
  });

  // 查询按钮事件
  $(".btn-search").on("click", () => {
    let deptId = $("#dept-id").val();
    let date1 = $("#date1").val();
    let date2 = $("#date2").val();
    let deptName = $("#dept-name").val();
    searchParams = { date1, date2, deptId, deptName, code: null };
    searchFunc();
  });

  // 最下右侧select切换事件
  $(".bottom-right-select").on("change", e => {
    searchParams.bottomId = $(e.target).val();
    initBottomRight();
  });

  // 中上右侧点击事件
  $(".mid-top-right").on("click", ".mid-top-right-row", e => {
    let $target = $(e.currentTarget);
    let selected = "selected";
    let id = $target.attr("row-id");
    if (!$target.hasClass(selected) && id != 8) {
      $(".mid-top-right-row").removeClass(selected);
      $target.addClass(selected);
      searchParams.code = null;
      searchParams.id = id;
      searchParams.sort =
        $target
          .find("div")
          .eq(1)
          .attr("class")
          .indexOf("up") > -1
          ? "asc"
          : "desc";
      searchParams.title = $target
        .find("div")
        .eq(0)
        .html();
      initMidBottomLeft();
      initMidBottomRight();
    }
  });
});
