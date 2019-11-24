requirejs(["common"], sugon => {
  // 页面查询参数
  let searchParams = {};
  // 页面入口
  initPage();

  // 页面入口
  function initPage() {
    initSearchBar();
    initBottom();
  }

  // 初始化所有的fieldset
  function initBottom(isGood) {
    initBottom1(isGood);
    initBottom2(isGood);
    initBottom3(isGood);
    initBottom4(isGood);
  }

  // 初始化第1个fieldset
  function initBottom1(isGood) {
    let params = Object.assign({ position: 0, ckfwType: 0 }, searchParams);
    sugon.request(sugon.interFaces.myhc.rdwt.getJcj, params).then(result => {
      renderBottom({ id: "jcj", data: result.data, isGood });
    });
  }

  // 初始化第2个fieldset
  function initBottom2(isGood, ckfwType = 0) {
    let params = Object.assign({ position: 1, ckfwType }, searchParams);
    sugon.request(sugon.interFaces.myhc.rdwt.getCkfw, params).then(result => {
      renderBottom({ id: "ckfw", data: result.data, isGood });
    });
  }

  // 初始化第3个fieldset
  function initBottom3(isGood) {
    let params = Object.assign({ position: 2, ckfwType: 0 }, searchParams);
    sugon.request(sugon.interFaces.myhc.rdwt.getAj, params).then(result => {
      renderBottom({ id: "aj", data: result.data, isGood });
    });
  }

  // 初始化第4个fieldset
  function initBottom4(isGood) {
    let params = Object.assign({ position: 3, ckfwType: 0 }, searchParams);
    sugon.request(sugon.interFaces.myhc.rdwt.getMjsxl, params).then(result => {
      renderBottom({ id: "sxl", data: result.data, isGood, isLast: true });
    });
  }

  // 渲染fieldset的dom
  function renderBottom({ id, data = [], isGood = false, isLast = false }) {
    let selectedIndex,
      html = "";
    let filterData = data.filter((val, index) => {
      if (val.isFirst) {
        selectedIndex = index;
      }
      return val.isFirst;
    });
    if (filterData.length > 0) {
      html += generateRow(filterData[0], selectedIndex, isGood, isLast);
    }
    data.map((val, index) => {
      html += generateRow(val, index, isGood, isLast);
    });
    $(`#${id} > section`)
      .empty()
      .append(html);
    // 绑定点击弹出页事件
    $(".main-section > fieldset > section > section")
      .off()
      .on("click", function() {
        let $this = $(this);
        let id = $this.attr("row-id");
        if (id) {
          requirejs(["text!../views/slhy/pjda_popup.html"], function(ele) {
            window.selectedPersonId = id;
            $("#ui-view").append(ele);
          });
        }
      });
  }

  // 追加行
  function generateRow(val, index, isGood, isLast) {
    let img,
      color = "",
      goodOrBad = isGood ? "good" : "bad";
    if (index < 3) {
      img = `<img 
              src="../../img/slhy/pjda/mybd/${goodOrBad + (index + 1)}.png" />`;
      color = ` class= "color${index + 1}"`;
    } else {
      img = `<span>${index + 1}</span>`;
    }
    let notLastDom = `<section row-id="${val.id}">
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
    sugon.initDateInput("date1", (searchParams.date1 = sugon.getDate(-7)));
    sugon.initDateInput("date2", (searchParams.date2 = sugon.getDate(-1)));
    searchParams.type = 0;
    searchParams.keyword = "";
  }

  // 查询
  function searchFunc() {
    let index = $(".selected").index(".switch-btn > div");
    let isGood = index === 1;
    searchParams.keyword = $("#keyword").val();
    initBottom(isGood);
  }

  $(".switch-btn > div").on("click", e => {
    let $target = $(e.target),
      index = $target.index(".switch-btn > div"),
      className = "selected";
    let good = "good-section",
      bad = "bad-section",
      $mainSection = $(".main-section"),
      $main = $("main"),
      isGood;
    if (!$target.hasClass(className)) {
      searchParams.type = index;
      $(".switch-btn > div").removeClass(className);
      $target.addClass(className);
      if (index === 1) {
        isGood = true;
        $mainSection.removeClass(bad).addClass(good);
        $main.css(
          "background",
          `url(../../img/slhy/pjda/mybd/good_bg.png) no-repeat center center / 100% 100%`
        );
      } else {
        isGood = false;
        $mainSection.removeClass(good).addClass(bad);
        $main.css(
          "background",
          `url(../../img/slhy/pjda/mybd/bad_bg.png) no-repeat center center / 100% 100%`
        );
      }
      initBottom(isGood);
    }
  });

  // 窗口服务下拉框事件
  $("#ckfw select").on("change", e => {
    let index = $(".selected").index(".switch-btn > div");
    let isGood = index === 1;
    initBottom2(isGood, $(e.target).val());
  });

  // 查询按钮事件
  $("#search-btn").on("click", searchFunc);

  // keyword回车键事件
  $("#keyword").on("keyup", e => {
    e.keyCode === 13 && searchFunc();
  });
});
