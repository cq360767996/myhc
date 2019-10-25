requirejs(["common", "Sortable"], (sugon, Sortable) => {
  // 查询栏参数
  let searchParams = {
    model: 1,
    sortCol: 1,
    sortType: "desc"
  };
  // 下拉框缓存数据
  let popMenuData = [];
  // 右侧面板数据
  let rightData;
  // 预览数据缓存
  let previewData = [];
  // body容器
  const $mainBody = $("body");

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
          rightData &&
            rightData.map(v1 => {
              result.data.map(v2 => {
                v1.id === v2.id && (v2.selected = true);
              });
            });
          result.data.map(val => {
            let className = "",
              hover = "";
            val.selected &&
              ({ className, hover } = {
                className: `class="row-selected"`,
                hover: "_hover"
              });
            html += `<row rowid="${val.id}"
                      tag="${val.tag4}"
                      ${className}>
                      <cell>
                        <img
                        class="head-checkbox" 
                        src="../../img/znbg/checkbox${hover}.png" />
                        <span>${val.deptName}</span>
                      </cell>
                      <cell>${val.tag1}</cell>
                      <cell>${val.tag2}</cell>
                      <cell>${val.tag3}</cell>
                      ${index == 1 ? `<cell>${val.tag4}</cell>` : ""}
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
          let cellWidth = index == 1 ? "10%" : "calc(100% / 9)";
          $(".left-panel > tab > div.row-body > row > cell").css(
            "width",
            cellWidth
          );
          resolve();
        });
    });
  };

  // 渲染右侧面板
  const renderRightPanel = () => {
    let html = "";
    rightData.map((val, index) => {
      let yw = val.model == 1 ? "业务" : val.model == 2 ? "问题" : "队伍";
      html += `<row 
                rowid="${val.id}"
                tag1="${val.tag1}">
                  <cell>${index + 1}、${val.tag}</cell>
                  <cell>${val.deptName}</cell>
                  <cell>
                    <span class="span-model${val.model}">${yw}</span>
                    <i class="glyphicon glyphicon-remove"></i>
                      </cell>
               </row>`;
    });
    $(".right-panel > section")
      .empty()
      .append(html);
  };

  // 初始化右侧面板
  const initRightPanel = () => {
    let { date1, date2, deptId } = searchParams;
    return new Promise(async (resolve, reject) => {
      await sugon
        .request(sugon.interFaces.rdwt.getRight, { date1, date2, deptId })
        .then(result => {
          rightData = result.data;
          renderRightPanel();
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
                          <section>
                          ${html}
                          </section>
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
    let type = searchParams.model == 2 ? 2 : 1;
    let index = $target.index(`.row-header${type} .head-img1`);
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

  // 渲染预览页面
  const renderPreview = () => {
    let html = "";
    previewData.map((val, index) => {
      html += `<article rowid="${val.id}">
                  <div>${index + 1}、${val.content}</div>
                  <div>
                    <img class="edit-btn" src="../../img/myhc/rdwt/edit.png" />
                    <img class="top-btn" src="../../img/myhc/rdwt/top.png" />
                  </div>
               </article>`;
    });
    $(".simple_content > section")
      .empty()
      .append(html);
  };

  // 初始化预览页面
  const initPreview = () => {
    let { date1, date2, deptId } = searchParams,
      data = rightData.slice(0, 9);
    sugon
      .request(sugon.interFaces.rdwt.getPreview, {
        date1,
        date2,
        deptId,
        data: JSON.stringify(data)
      })
      .then(result => {
        previewData = result.data;
        rightData.map(val1 => {
          let id = val1.id;
          result.data.map(val2 => {
            id === val2.id && Object.assign(val2, val1);
          });
        });
        sugon.renderDialog({
          width: 685,
          height: 500,
          title: "热点问题发布",
          ele: `<section></section>
                <footer>
                  <button>发布</button>
                  <button>返回</button>
                </footer>`
        });
        let dom = document.querySelector(".simple_content > section");
        Sortable.create(dom, {
          animation: 150,
          onEnd: function(e) {
            console.log(previewData);
            let resultData = [];
            $(".simple_content > section > article").each((index, dom) => {
              let $dom = $(dom),
                rowId = $dom.attr("rowid");
              previewData.map(val => {
                val.id === rowId && resultData.push(val);
              });
            });
            previewData = resultData;
            renderPreview();
          }
        });
        renderPreview();
      });
  };

  // 预览页面输入框完成事件
  const inputComplete = e => {
    let $target = $(e.target),
      id = $target
        .parent()
        .parent()
        .attr("rowid"),
      input = $target.val(),
      index;
    previewData.map((val, i) => {
      if (id === val.id) {
        val.content = input;
        index = i;
      }
    });
    $target.parent().html(`${index + 1}、${input}`);
  };

  // 查询按钮功能
  const searchFunc = function() {
    searchParams.deptId = $("#dept-id").val();
    searchParams.date1 = $("#date1").val();
    searchParams.date2 = $("#date2").val();
    Promise.resolve()
      .then(() => initRightPanel())
      .then(() => initLeftPanel())
      .catch(err => {
        throw err;
      });
  };

  // 初始化页面
  function initPage() {
    Promise.resolve()
      .then(() => sugon.initSearchBar({ cb: searchFunc }))
      .then(() => searchFunc());
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
    if (!$this.hasClass(className)) {
      searchParams.model = 1 + index;
      searchParams.sortCol = 1;
      searchParams.sortType = "desc";
      $(".left-panel > header > section").removeClass(className);
      $this.addClass(className);
      if (index == 1) {
        $header1.hide();
        $header2.show();
        cellWidth = "10%";
      } else {
        $header1.show();
        $header2.hide();
        cellWidth = "calc(100% / 9)";
      }
      // 置空下拉框缓存数据
      popMenuData = [];
      Promise.resolve().then(() => initLeftPanel(index));
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
      img = ``,
      id = $this.attr("rowid");
    if ($this.hasClass(className)) {
      $this.removeClass(className);
      for (let i = 0, len = rightData.length; i < len; i++) {
        if (rightData[i].id === id) {
          rightData.splice(i, 1);
          break;
        }
      }
    } else {
      img = "_hover";
      $this.addClass(className);
      let deptName = $this
          .children(":first")
          .find("span")
          .html(),
        tag1 = $this
          .children()
          .eq(1)
          .html(),
        model = 1 + $(".nav-hover").index(".left-panel > header > section"),
        tag = $this.attr("tag");
      rightData.push({
        deptName,
        tag1,
        model,
        id,
        tag
      });
    }
    $this
      .find(".head-checkbox")
      .attr("src", `../../img/znbg/checkbox${img}.png`);
    renderRightPanel();
  });

  // 排序按钮事件
  $(".head-img2").on("click", e => {
    let $target = $(e.target),
      parentType = $target
        .parent()
        .parent()
        .attr("type"),
      index = $target.index(`.row-header${parentType} .head-img2`),
      selected = $target.attr("selected"),
      $allImg = $(`.row-header${parentType} .head-img2`),
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
    Promise.resolve().then(() => initLeftPanel(searchParams.model - 1));
  });

  // 下拉框行点击事件
  $mainBody.on("click", ".pop-menu > section > div", function() {
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
    Promise.resolve().then(() => initLeftPanel(searchParams.model - 1));
  });

  // 下拉框确定事件
  $mainBody.on("click", ".menu-confirm", e => {
    let $popMenu = $(".pop-menu"),
      index = Number($popMenu.attr("index"));
    popMenuData[index] = [];
    $popMenu.find("div").each((i, dom) => {
      let $span = $(dom).find("span");
      popMenuData[index].push({
        selected: $span.hasClass("span-selected"),
        name: $span.html()
      });
    });
    for (let i = 1 + index; i < 4; i++) {
      popMenuData[i] = [];
    }
    Promise.resolve().then(() => initLeftPanel(searchParams.model - 1));
    $popMenu.remove();
  });

  // 右侧面板删除按钮事件
  $(".right-panel > section").on("click", "i", e => {
    let $target = $(e.target),
      id = $target
        .parent()
        .parent()
        .attr("rowid"),
      index;
    rightData.map((val, i) => {
      id === val.id && ((delData = val), (index = i));
    });
    rightData.splice(index, 1);
    $(".row-selected").each((index, dom) => {
      let $dom = $(dom);
      if ($dom.attr("rowid") == id) {
        $dom.removeAttr("class");
        $dom.find("img").attr("src", "../../img/znbg/checkbox.png");
      }
    });
    renderRightPanel();
  });

  // 打开预览以及返回按钮事件
  $(".left-panel > footer > div > button").on("click", e => {
    let btnName = $(e.target).html();
    if (btnName === "预览") {
      initPreview();
    } else {
      location.hash = vipspa.stringify("rdwt");
    }
  });

  // 置顶以及编辑页面事件
  $mainBody
    .off("click", ".simple_content > section > article > div > img")
    .on("click", ".simple_content > section > article > div > img", e => {
      let $target = $(e.target),
        className = $target.attr("class"),
        id = $target
          .parent()
          .parent()
          .attr("rowid"),
        selectData,
        index;
      previewData.map((val, i) => {
        id === val.id && ((selectData = val), (index = i));
      });
      if (className === "edit-btn") {
        let $text = $target.parent().prev();
        $text.html(`<input value="${selectData.content}" />`);
        $(".simple_content > section > article > div > input").focus();
      } else {
        previewData.splice(index, 1);
        previewData.unshift(selectData);
        renderPreview();
      }
    });

  // input失焦事件
  $mainBody
    .off("blur", ".simple_content > section > article > div > input")
    .on(
      "blur",
      ".simple_content > section > article > div > input",
      inputComplete
    );

  // input回车事件
  $mainBody
    .off("keyup", ".simple_content > section > article > div > input")
    .on("keyup", ".simple_content > section > article > div > input", e => {
      e.keyCode === 13 && inputComplete(e);
    });

  // 预览页面的发布以及返回按钮事件
  $mainBody
    .off("click", ".simple_content > footer > button")
    .on("click", ".simple_content > footer > button", e => {
      let $target = $(e.target),
        btnName = $target.html(),
        { date1, date2, deptId } = searchParams,
        data = [];
      previewData.map(val => {
        let { id, deptName, tag, tag1, model, content } = val;
        data.push({ id, deptName, tag, tag1, model, content });
      });
      if (btnName === "发布") {
        sugon
          .request(sugon.interFaces.rdwt.publish, {
            date1,
            date2,
            deptId,
            data: JSON.stringify(data)
          })
          .then(result => {
            result.code == 200 && (location.hash = vipspa.stringify("rdwt"));
          });
      } else {
        $(".simple_shade").remove();
        $(".simple_showDialog").remove();
      }
    });
});
