requirejs(["common", "ec"], (sugon, ec) => {
  // 查询栏参数
  let searchParams = {
    model: 1,
    sortCol: 2,
    sortType: "desc"
  };
  // 下拉框缓存数据
  let popMenuData = [];
  // 右侧面板数据
  let rightData;
  const $mainBody = $("body");

  // 初始化日期控件
  const initDateInput = (id, date) => {
    $(`#${id}`)
      .val(date)
      .datetimepicker({
        format: "yyyy-mm",
        autoclose: true,
        todayBtn: true,
        startView: "year",
        minView: "year",
        maxView: "decade",
        endDate: sugon.getDate(-1),
        language: "zh-CN"
      });
  };
  // 初始化查询栏
  const initSearchBar = () => {
    return new Promise((resolve, reject) => {
      const $deptTree = $("#dept-tree");
      const $deptName = $("#dept-name");
      const $deptId = $("#dept-id");
      sugon.request(sugon.interFaces.rdwt.tree).then(result => {
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
      });
      // 为单位名称绑定点击事件
      $("#dept-name").on("click", () => {
        $deptTree.css(
          "visibility",
          $deptTree.css("visibility") === "hidden" ? "visible" : "hidden"
        );
      });
      initDateInput("date1", (searchParams.date1 = sugon.getDate(-7)));
      initDateInput("date2", (searchParams.date2 = sugon.getDate(-1)));
      $deptId.val((searchParams.deptId = "2014110416460086100000002942"));
      resolve();
    });
  };

  // 初始化左侧面板
  const initLeftPanel = (index = 0) => {
    let { date1, date2, deptId, model, sortCol, sortType } = searchParams;
    let tags = ["", "", "", ""];
    popMenuData.map((val = [], index) => {
      val.map(v => {
        v.selected && (tags[index] += v.name + ",");
      });
    });
    return new Promise((resolve, reject) => {
      sugon
        .request(sugon.interFaces.rdwt.getLeft, {
          date1,
          date2,
          deptId,
          model,
          sortCol,
          sortType,
          deptName: tags[0]
            ? tags[0].substring(0, tags[0].lastIndexOf(","))
            : "",
          tag1: tags[1] ? tags[1].substring(0, tags[1].lastIndexOf(",")) : "",
          tag2: tags[2] ? tags[2].substring(0, tags[2].lastIndexOf(",")) : "",
          tag3: tags[3] ? tags[3].substring(0, tags[3].lastIndexOf(",")) : ""
        })
        .then(result => {
          let html = "";
          result.data.map(val => {
            html += `<row>
                    <cell>
                      <img class="head-checkbox" src="../../img/znbg/checkbox.png" />
                      <span>${val.deptName}</span>
                    </cell>
                    <cell>${val.tag1}</cell>
                    <cell>${val.tag2}</cell>
                    <cell>${val.tag3}</cell>
                    ${index == 2 ? "" : `<cell>${val.tag4}</cell>`}
                    <cell>${val.value1}</cell>
                    <cell>${val.value2}</cell>
                    <cell>${val.value3}</cell>
                    <cell>${val.value4}</cell>
                    <cell>${val.value5}</cell>
                  </row>`;
          });
          $(".row-body")
            .empty()
            .append(html);
          resolve();
        });
    });
  };

  // 初始化右侧面板
  const initRightPanel = () => {
    let { date1, date2, deptId } = searchParams;
    return new Promise(async (resolve, reject) => {
      await sugon
        .request(sugon.interFaces.rdwt.getRight, { date1, date2, deptId })
        .then(result => {
          rightData = result.data;
          let html = "";
          result.data.map((val, index) => {
            html += `<row>
                    <cell>${index + 1}、${val.tag}</cell>
                    <cell>${val.deptName}</cell>
                    <cell>
                      <span class="span-model3">业务</span>
                      <i class="glyphicon glyphicon-remove"></i>
                    </cell>
                  </row>`;
          });
          $(".right-panel > section")
            .empty()
            .append(html);
        });
      resolve();
    });
  };

  // 渲染下拉框
  const renderPopMenu = (data = [], $target) => {
    let offset = $target.offset(),
      index = $target.index(".head-img1");
    if (data instanceof Array) {
      let html = "";
      data.map(val => {
        html += `<div><img 
        src="../../img/znbg/checkbox${val.selected ? `_hover` : ""}.png" />
        <span${val.selected ? ` class="span-selected"` : ""}>${val.name}</span>
                 </div>`;
      });
      $mainBody.append(`<div class="pop-menu" index="${index}">
                          ${html}
                          <footer>
                            <button class="menu-reset">重置</button>
                            <button class="menu-confirm">确定</button>
                          </footer>
                        </div>`);
      let $popMenu = $(".pop-menu"),
        width = $popMenu.width();
      $popMenu.css({
        top: `${offset.top + 25}px`,
        left: `${offset.left - width / 2}px`
      });
    }
  };

  // 请求下拉框
  const requestPopMenu = $target => {
    let index = $target.index(".head-img1");
    let { date1, date2, deptId, model } = searchParams;
    let tags = ["", "", "", ""];
    popMenuData.map((val = [], index) => {
      val.map(v => {
        v.selected && (tags[index] += v.name + ",");
      });
    });
    sugon
      .request(sugon.interFaces.rdwt.getPopMenu, {
        date1,
        date2,
        deptId,
        model,
        deptName: tags[0] ? tags[0].substring(0, tags[0].lastIndexOf(",")) : "",
        tag1: tags[1] ? tags[1].substring(0, tags[1].lastIndexOf(",")) : "",
        tag2: tags[2] ? tags[2].substring(0, tags[2].lastIndexOf(",")) : "",
        tag3: tags[3] ? tags[3].substring(0, tags[3].lastIndexOf(",")) : "",
        level: index
      })
      .then(result => {
        let arr = [];
        result.data.map(val => {
          arr.push({ selected: true, name: val });
        });
        // 缓存下拉框数据
        popMenuData[index] = arr;
        renderPopMenu(arr, $target);
      });
  };

  // 初始化下拉框
  const initPopMenu = $target => {
    let index = $target.index(".head-img1");
    // 数据存在本地数据就从缓存读取
    if (popMenuData[index] && popMenuData[index].length > 0) {
      renderPopMenu(popMenuData[index], $target);
    } else {
      requestPopMenu($target);
    }
  };

  // 初始化页面
  function initPage() {
    Promise.resolve()
      .then(() => initSearchBar())
      .then(() => initRightPanel())
      .then(() => initLeftPanel())
      .catch(err => {
        throw err;
      });
  }

  // 页面入口
  initPage();

  // nav切换事件
  $(".left-panel > header > section").on("click", function() {
    let $this = $(this),
      className = "nav-hover",
      index = $this.index(".left-panel > header > section"),
      $header1 = $(".row-header1"),
      $header2 = $(".row-header2"),
      cellWidth;
    searchParams.model = 1 + index;
    if (!$this.hasClass(className)) {
      $(".left-panel > header > section").removeClass(className);
      $this.addClass(className);
      if (index == 2) {
        $header1.hide();
        $header2.show();
        cellWidth = "calc(100% / 9)";
      } else {
        $header1.show();
        $header2.hide();
        cellWidth = "10%";
      }
      Promise.resolve()
        .then(() => initLeftPanel(index))
        .then(() => {
          $(".left-panel > tab > div > row > cell").css("width", cellWidth);
        });
    }
  });

  // 下拉框事件
  $(".head-img1").on("click", e => {
    e.stopPropagation();
    let $target = $(e.target),
      $popMenu = $(".pop-menu"),
      menuIndex = $popMenu.attr("index"),
      targetIndex = $target.index(".head-img1");
    $popMenu.length === 1 && $popMenu.remove();
    menuIndex != targetIndex && initPopMenu($target);
  });

  // 点击其他区域下拉框消失
  $mainBody.on("click", e => {
    let $target = $(e.target),
      $popMenu = $(".pop-menu");
    $target.is(".pop-menu") ||
      $target.is(".pop-menu *") ||
      ($popMenu.length === 1 && $popMenu.remove());
  });

  // 行点击事件
  $(".row-body").on("click", "row", function() {
    let $this = $(this),
      className = "row-selected",
      img = ``;
    if ($this.hasClass(className)) {
      $this.removeClass(className);
    } else {
      img = "_hover";
      $this.addClass(className);
    }
    $this
      .find(".head-checkbox")
      .attr("src", `../../img/znbg/checkbox${img}.png`);
  });

  // 排序按钮事件
  $(".head-img2").on("click", e => {
    let $target = $(e.target),
      parentClassName = $target
        .parent()
        .parent()
        .attr("class"),
      index = $target.index(`.${parentClassName} .head-img2`),
      selected = $target.attr("selected"),
      $allImg = $(`.${parentClassName} .head-img2`),
      sort;
    $allImg.attr("src", "../../img/myhc/rdwt/sort_defalut.png");
    if (selected == "selected" && searchParams.sortType == "desc") {
      sort = searchParams.sortType = "asc";
    } else {
      sort = searchParams.sortType = "desc";
    }
    $allImg.removeAttr("selected");
    searchParams.sortCol = 1 + index;
    $target
      .attr("selected", "selected")
      .attr("src", `../../img/myhc/rdwt/sort_${sort}.png`);
    Promise.resolve().then(() => initLeftPanel());
  });

  // 下拉框行点击事件
  $mainBody.on("click", ".pop-menu > div", function() {
    let $this = $(this),
      img = "",
      className = "span-selected";
    if ($this.find(`.${className}`).length > 0) {
      $this.find("span").removeClass(className);
    } else {
      $this.find("span").addClass(className);
      img = "_hover";
    }
    $this.find("img").attr("src", `../../img/znbg/checkbox${img}.png`);
  });

  // 下拉框重置事件
  $mainBody.on("click", ".menu-reset", e => {
    let $row = $(".pop-menu > div"),
      className = "span-selected",
      $popMenu = $(".pop-menu"),
      index = $popMenu.attr("index");
    $row.find("img").attr("src", "../../img/znbg/checkbox_hover.png");
    !$row.find("span").hasClass(className) &&
      $row.find("span").addClass(className);
    for (let i = index; i < 4; i++) {
      popMenuData[i] = [];
    }
    $popMenu.remove();
    Promise.resolve().then(() => initLeftPanel());
  });

  // 下拉框确定事件
  $mainBody.on("click", ".menu-confirm", e => {
    let $popMenu = $(".pop-menu"),
      index = $popMenu.attr("index");
    popMenuData[index] = [];
    $popMenu.find("div").each((i, dom) => {
      let $span = $(dom).find("span");
      popMenuData[index].push({
        selected: $span.hasClass("span-selected"),
        name: $span.html()
      });
    });
    Promise.resolve().then(() => initLeftPanel());
    $popMenu.remove();
  });
});
