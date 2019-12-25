requirejs(["common"], sugon => {
  // 页面查询参数
  let searchParams = {};
  // 页面页码
  let bottomPages = [1, 1, 1, 1];
  // 页面入口
  initPage();

  // 页面入口
  function initPage() {
    initSearchBar();
    initBottom();
  }

  // 初始化所有的fieldset
  function initBottom() {
    for (let i = 0; i < 4; i++) {
      initSingleBottom(i);
    }
  }

  // 获取列表接口
  async function initSingleBottom(position, ckfwType = 0) {
    let typeArr = ["jcj", "ckfw", "aj", "sxl"];
    let type = typeArr[position];
    let upperCaseType = `get${type.charAt(0).toUpperCase() + type.slice(1)}`;
    let isLast = position === 3;
    let params = {
      ...searchParams,
      position,
      pageNum: bottomPages[position],
      pageSize: 6
    };
    if (position === 1) {
      params.ckfwType = ckfwType;
    }
    let result = await sugon.request(
      sugon.interFaces.myhc.rdwt[upperCaseType],
      params
    );
    let data = result.data;
    if (data.length > 0) {
      bottomPages[position]++;
    }
    renderBottom({ id: type, isLast, data });
  }

  // 渲染fieldset的dom
  function renderBottom({ id, data = [], isLast = false }) {
    let html = "";
    let filterData = data.filter(val => val.isFirst);
    let resultData = filterData.length > 0 ? filterData : data;
    resultData.map(val => {
      html += generateRow(val, isLast);
    });
    $(`#${id} > section`).append(html);
  }

  // 追加行
  function generateRow(val, isLast) {
    let img;
    let color = "";
    let goodOrBad = searchParams.type ? "good" : "bad";
    if (Number(val.index) < 4) {
      img = `<img 
              src="../../img/slhy/pjda/mybd/${goodOrBad + val.index}.png" />`;
      color = ` class= "color${val.index}"`;
    } else {
      img = `<span>${val.index}</span>`;
    }
    let notLastDom = `<section row-id="${val.id || ""}">
                        <div><div>${img}</div><div>${val.name}</div></div>
                        <div>
                          <div${color}>
                            <span>满意度<strong>${val.value}</strong></span>
                            <span>业务量<strong>${val.ywl}</strong>次</span>
                          </div>
                          <div title="${val.dw}">${val.dw}</div>
                        </div>
                      </section>`;
    let lastDom = `<section>
                    <div><div>${img}</div><div${color}>${val.value}</div></div>
                    <div>
                      <div>${val.name}</div>
                      <div title="${val.dw}">${val.dw}</div>
                    </div>
                  </section>`;
    return isLast ? lastDom : notLastDom;
  }

  // 初始化查询栏
  function initSearchBar() {
    sugon.initDateInput("date1", (searchParams.date1 = sugon.getDate(-8)));
    sugon.initDateInput("date2", (searchParams.date2 = sugon.getDate(-2)));
    searchParams.type = 0;
    searchParams.keyword = "";
  }

  // 渲染关键字查询结果
  async function renderKeywordSearch() {
    const dialogParams = {
      ele: `<div class="search-popup">
              <main></main>
              <footer><button>关闭</button></footer>
            </div>`,
      width: 620,
      height: 490,
      zIndex: 999
    };
    sugon.showDialog(dialogParams);
    const { keyword, date1, date2 } = searchParams;
    const result = await sugon.request(
      sugon.interFaces.myhc.rdwt.keywordSearch,
      {
        keyword,
        date1,
        date2
      }
    );
    let html = "";
    result.data.map(v1 => {
      html += `<div>
                <div class="row-left">
                  <div style="background-image: url(${v1.img});"></div>
                </div>
                <div class="row-right">
                  <header>
                    <div>姓名：${v1.name}</div>
                    <div>警号：${v1.policeNum}</div>
                    <div>单位：${v1.dept}</div>
                  </header>
                  <main>
                    <div class="detail-list">
                      ${v1.data.reduce(
                        (acc, v2) =>
                          acc +
                          `<div>
                            <div>${v2.type}</div>
                            <div>满意度：${v2.myd}%</div>
                            <div>业务量：${v2.ywl}次</div>
                          </div>`,
                        ""
                      )}
                    </div>
                    <div>
                      <button row-id="${v1.id}" class="detail-btn">档案</button>
                    </div>
                  </main>
                </div>
              </div>`;
    });
    $(".search-popup > main")
      .empty()
      .append(html);
  }

  // 查询
  function searchFunc() {
    searchParams.keyword = $("#keyword").val();
    if (/\S+/.test(searchParams.keyword)) {
      renderKeywordSearch();
    } else {
      searchParams.date1 = $("#date1").val();
      searchParams.date2 = $("#date2").val();
      $(".main-section > fieldset > section").empty();
      bottomPages = [1, 1, 1, 1];
      initBottom();
    }
  }

  // 切换好评榜/曝光台
  $(".switch-btn > div").on("click", e => {
    let $target = $(e.target),
      index = $target.index(".switch-btn > div"),
      className = "selected";
    let good = "good-section",
      bad = "bad-section",
      $mainSection = $(".main-section"),
      $main = $("main");
    if (!$target.hasClass(className)) {
      $(".main-section > fieldset > section").empty();
      bottomPages = [1, 1, 1, 1];
      searchParams.type = index;
      $(".switch-btn > div").removeClass(className);
      $target.addClass(className);
      if (index === 1) {
        $mainSection.removeClass(bad).addClass(good);
        $main.css(
          "background",
          `url(../../img/slhy/pjda/mybd/good_bg.png) no-repeat center center / 100% 100%`
        );
      } else {
        $mainSection.removeClass(good).addClass(bad);
        $main.css(
          "background",
          `url(../../img/slhy/pjda/mybd/bad_bg.png) no-repeat center center / 100% 100%`
        );
      }
      initBottom();
    }
  });

  // 窗口服务下拉框事件
  $("#ckfw select").on("change", e => {
    $("#ckfw > section").empty();
    initSingleBottom(1, $(e.target).val());
  });

  // 查询按钮事件
  $("#search-btn").on("click", searchFunc);

  // keyword回车键事件
  $("#keyword").on("keyup", e => {
    e.keyCode === 13 && searchFunc();
  });

  // 绑定点击弹出页事件
  $(".main-section > fieldset > section").on("click", "section", e => {
    let $this = $(e.currentTarget);
    let id = $this.attr("row-id");
    if (id) {
      requirejs(["text!../views/slhy/pjda_popup.html"], function(ele) {
        window.selectedPersonId = id;
        $("#ui-view").append(ele);
      });
    }
  });

  // 滚动条事件
  $(".main-section > fieldset > section").on("scroll", e => {
    let $target = $(e.target);
    // 容器高
    let containerHeight = $target.height();
    // 第几列
    let index = $target.index(".main-section > fieldset > section");
    // 滚动的top值
    let top = $(e.target).prop("scrollTop");
    // 滚动的总高度
    let height = $(e.target).prop("scrollHeight");
    if (height != containerHeight && height - top <= containerHeight) {
      initSingleBottom(index, $("#ckfw select").val());
    }
  });

  // 重置按钮事件
  $("#reset-btn").on("click", () => {
    $("#keyword").val("");
  });

  // 关闭按钮事件
  $("#ui-view").on("click", ".search-popup > footer > button", () => {
    $(".simple_showDialog > i").click();
  });

  // 档案按钮事件
  $("#ui-view").on("click", ".detail-btn", e => {
    const id = $(e.target).attr("row-id");
    if (id) {
      requirejs(["text!../views/slhy/pjda_popup.html"], function(ele) {
        window.selectedPersonId = id;
        $("#ui-view").append(ele);
      });
    }
  });
});
