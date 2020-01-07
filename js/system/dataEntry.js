requirejs(["common"], sugon => {
  const $uiView = $("#ui-view");
  // 全局查询条件
  const searchParams = {
    type: 1,
    keyword: "",
    decision: {}
  };
  // 缓存的树结构
  let cachedData = [];
  // 真实选中的id
  let trueSelectedId = [];
  // 要删除的id
  let deleteId = "";
  // 类型策略模式
  const strategy = {
    default: {
      btnName: "上传视频",
      labelName: "视频名称",
      title: "110接处警视频库",
      icon: "upload",
      btnFunc: uploadVideo,
      cb: loadTable1
    },
    2: {
      btnName: "修改",
      labelName: "标签名称",
      title: "窗口服务问题预测",
      icon: "edit",
      btnFunc: multiEdit2,
      cb: loadTable2
    },
    3: {
      btnName: "修改",
      labelName: "标签名称",
      title: "群众热点诉求TOP10/伤害类、侵财类案件专项分析",
      icon: "edit",
      btnFunc: multiEdit3,
      cb: loadTable3
    }
  };

  // 上传视频
  function uploadVideo() {
    $("#file-input").click();
  }

  // 批量修改type为2
  function multiEdit2() {
    translateSelectedId2True(2);
  }

  // 批量修改type为3
  function multiEdit3() {
    translateSelectedId2True(3);
  }

  // 将选中的id转换为真实选中的id
  function translateSelectedId2True(type) {
    const selectedIdArr = getSelectedIdArr();
    if (selectedIdArr.length === 0) {
      sugon.showMessage("请选中后进行操作！", "error");
    } else {
      trueSelectedId = [];
      selectedIdArr.map(val => {
        const recurseData = getIdBySelectedId(val);
        if (recurseData.length === 0) {
          trueSelectedId = [...trueSelectedId, val];
        } else {
          trueSelectedId = [...trueSelectedId, ...recurseData];
        }
      });
      $(`.edit${type}`).show();
      $(`.edit${type == 2 ? 3 : 2}`).hide();
      $("#edit-panel").modal("show");
    }
  }

  // 单选修改
  function singleEdit(id, type) {
    trueSelectedId = [id];
    $(`.edit${type}`).show();
    $(`.edit${type == 2 ? 3 : 2}`).hide();
    $("#edit-panel").modal("show");
  }

  // 获取选中的id数组
  function getSelectedIdArr() {
    const result = [];
    $(`.table${searchParams.type} .table-wrap__row`).each((index, dom) => {
      const $dom = $(dom);
      $dom.find(".checkbox-input").prop("checked") &&
        result.push($dom.attr("row-id"));
    });
    return result;
  }

  // 根据选中的id获取递归寻找需要传给后台的id
  function getIdBySelectedId(id) {
    // 递归数据
    function recurseData(data) {
      let result = [];
      data.map(val => {
        if (val.children.length === 0) {
          result.push(val.id);
        } else {
          result = [...result, ...recurseData(val.children)];
        }
      });
      return result;
    }

    let result = [];
    const foundData = recurseDataById(id, cachedData);
    if (foundData.isFound) {
      result = [...result, ...recurseData(foundData.data)];
    }
    return result;
  }

  // 根据id递归查找节点数据
  function recurseDataById(id, data) {
    let result = { isFound: false, data: [] };
    for (let i = 0, len = data.length; i < len; i++) {
      const val = data[i];
      if (val.id === id) {
        result.data = val.children;
        result.isFound = true;
        break;
      } else {
        const deptResult = recurseDataById(id, val.children);
        if (deptResult.isFound) {
          result = deptResult;
          break;
        }
      }
    }
    return result;
  }

  // 生成dom
  function generateDom(data, selected = false) {
    let html = "";
    let column4 = "";

    data.map(val => {
      const canModify = val.children.length === 0;
      let edit, btn, excuteStandard;
      let padding = (val.level - 1) * 24;

      if (canModify) {
        edit = `<span class="edit-btn">修改</span>`;
        btn = "";
        excuteStandard = val.excuteStandard || `<span>暂无建议</span>`;
        padding += 29;
        if (searchParams.type === 3 && val.excuteStandard) {
          column4 = `<div><div class="detail-btn"></div></div>`;
        }
      } else {
        edit = "";
        excuteStandard = "";
        btn = `<img class="toggle-btn" draggable="false"
                    src="../../img/system/dataEntry/fold.png" />`;
        if (searchParams.type === 3) {
          column4 = `<div></div>`;
        }
      }
      html += `<div class="table-wrap__row"
                    level="${val.level}"
                    row-id="${val.id}">
                <div>
                  <input class="checkbox-input"
                        type="checkbox"
                        ${selected ? "checked" : ""} />
                </div>
                <div style="padding-left: ${padding}px;" 
                  title="${val.label}">
                  ${btn}<span>${val.label}</span>
                </div>
                <div title="${excuteStandard}">${excuteStandard}</div>
                ${column4}
                <div>${edit}</div>
              </div>`;
    });
    return html;
  }

  // 拼接子节点
  function appendChildren(id) {
    const result = recurseDataById(id, cachedData);
    if (result.isFound) {
      const $dom = $(`div.table-wrap__row[row-id=${id}]`);
      const selected = $dom.find(".checkbox-input").prop("checked");
      let html = generateDom(result.data, selected);
      $dom.after(html);
    }
  }

  // 清空子节点
  function clearChildren(id, level) {
    const subId = id.substring(0, level * 2);
    // 选出所有子节点
    $(`div.table-wrap__row[row-id^=${subId}]:not([row-id=${id}])`).remove();
  }

  // 获取表23的数据
  async function getTable23(type = 2) {
    const result = await sugon.request(
      sugon.interFaces.system.dataEntry.getTable23,
      { keyword: searchParams.keyword, type }
    );
    cachedData = result.data;
    const html = generateDom(cachedData);
    return html;
  }

  // 装载table1
  async function loadTable1() {
    let html = "";
    const result = await sugon.request(
      sugon.interFaces.system.dataEntry.getTable1,
      { keyword: searchParams.keyword }
    );
    result.data.map(val => {
      html += `<div class="table-wrap__row" row-id="${val.id}">
                <div><input class="checkbox-input" type="checkbox" /></div>
                <div title="${val.videoName}">${val.videoName}</div>
                <div>${val.time}</div>
                <div>${val.submitter}</div>
                <div class="del-btn">删除</div>
              </div>`;
    });
    return html;
  }

  // 装载table2
  function loadTable2() {
    return getTable23();
  }
  // 装载table3
  function loadTable3() {
    return getTable23(3);
  }

  // checkbox改变时，修改子父级节点状态
  function handleCheckboxDis($target, id, level) {
    level = Number(level);
    // 绑定上下级勾选关系
    const subId = id.substring(0, level * 2);
    // 选出所有子节点绑定状态
    $(`div.table-wrap__row[row-id^=${subId}]:not([row-id=${id}])`)
      .find(".checkbox-input")
      .prop("checked", $target.prop("checked"));
    if (!$target.prop("checked")) {
      for (let i = 1; i < level; i++) {
        let parentId = Number(id.substring(0, 2 * i)) * Math.pow(100, 4 - i);
        $(`div.table-wrap__row[row-id=${parentId}]`)
          .find(".checkbox-input")
          .prop("checked", false);
      }
    }
  }

  // 装载表数据
  async function loadTableData() {
    $(".table-wrap__body").empty();
    const $body = $(`.table${searchParams.type} .table-wrap__body`);
    const html = await searchParams.decision.cb();
    $body.append(html);
  }

  // 获取详情数据
  async function getDetail(id) {
    const result = await sugon.request(
      sugon.interFaces.system.dataEntry.getDetail,
      { id }
    );
    let content = result.content
      .replace(/\n/g, "<br/>")
      .replace(/ /g, "&nbsp;");
    $("#detail-title").html(result.title);
    $("#detail-content").html(content);
    $("#detail-panel").modal("show");
  }

  // 确认删除按钮
  function deleteConfirm(id) {
    deleteId = id;
    $("#confirm-panel").modal("show");
  }

  // 页面入口
  function initPage() {
    // 决策结果
    searchParams.decision = strategy[searchParams.type] || strategy["default"];
    $(".table-wrap").hide();
    $(`.table${searchParams.type}`).show();
    $(".main-title").html(searchParams.decision.title);
    $(".label-text").html(searchParams.decision.labelName + "：");
    $(".btn-text").html(
      `<img src="../../img/system/dataEntry/${searchParams.decision.icon}.png"/>${searchParams.decision.btnName}`
    );
    loadTableData();
  }

  // 页面入口
  initPage();

  // 右侧树点击事件
  $(".time-line > li").on("click", e => {
    const $target = $(e.target);
    const type = $target.attr("type");
    const className = $target.attr("class");
    if (typeof type !== "undefined" && className.indexOf("active") === -1) {
      $(".time-line > li[type!='0']").removeClass("active");
      $(`.time-line > li[type='${type}']`).addClass("active");
      searchParams.type = Number(type);
      $(".keyword").val((searchParams.keyword = ""));
      initPage();
    }
  });

  // 行点击事件
  $uiView.on("click", ".table-wrap__row", e => {
    const $currentTarget = $(e.currentTarget);
    const $target = $(e.target);
    const id = $currentTarget.attr("row-id");
    // 阻止选中是否checkbox默认事件
    if (!$target.hasClass("checkbox-input")) {
      if ($target.hasClass("del-btn")) {
        // 删除按钮
        deleteConfirm(id);
      } else if ($target.hasClass("edit-btn")) {
        // 修改按钮
        singleEdit(id, searchParams.type);
      } else if ($target.hasClass("detail-btn")) {
        // 详情按钮
        getDetail(id);
      } else if ($target.hasClass("toggle-btn")) {
        // 展开/收缩按钮
        // 是否折叠
        const isFold = $target.attr("src").indexOf("unfold") === -1;
        if (isFold) {
          $target.attr("src", "../../img/system/dataEntry/unfold.png");
          appendChildren(id);
        } else {
          $target.attr("src", "../../img/system/dataEntry/fold.png");
          clearChildren(id, $currentTarget.attr("level"));
        }
      } else {
        const $checkbox = $currentTarget.find(".checkbox-input");
        // 模拟点击，而非修改值，会触发事件
        $checkbox.click();
      }
    }
  });

  // checkbox改变事件
  $uiView.on("change", ".checkbox-input", e => {
    const $allCheckbox = $(".checkbox-input");
    const length = $allCheckbox.length;
    const $target = $(e.target);
    // 拿到行id和level用来绑定上下级关系勾选关系
    const $row = $target.parent().parent();
    const id = $row.attr("row-id");
    const level = $row.attr("level");
    let selected = 0;
    // 更改上下级勾选状态
    if (searchParams.type != 1) {
      handleCheckboxDis($target, id, level);
    }

    // 确定每行的勾选
    $allCheckbox.each((index, dom) => {
      $(dom).prop("checked") && selected++;
    });
    $(`.table${searchParams.type} .head-checkbox`).prop(
      "checked",
      length === selected
    );
  });

  // 全选checkbox改变事件
  $(".head-checkbox").on("change", e => {
    $(`.table${searchParams.type} .checkbox-input`).prop(
      "checked",
      $(e.target).prop("checked")
    );
  });

  // 上传视频/批量修改按钮事件
  $(".btn-text").on("click", () => {
    searchParams.decision.btnFunc();
  });

  // 确认修改按钮事件
  $("#confirm-edit").on("click", async () => {
    const params = {};
    const { type } = searchParams;
    if (type == 3) {
      params.title = $("#edit3-title").val();
      params.content = $("#edit3-content").val();
    } else {
      params.content = $("#edit2-input").val();
    }
    params.ids = trueSelectedId.join(",");
    const result = await sugon.request(
      sugon.interFaces.system.dataEntry[`editTable${type}`],
      params
    );
    if (result.code == 200) {
      $("#edit-panel").modal("hide");
      sugon.showMessage("修改成功！", "success");
      $(".head-checkbox").prop("checked", false);
      $("#edit3-title").val("");
      $("#edit3-content").val("");
      $("#edit2-input").val("");
      initPage();
    } else {
      sugon.showMessage("修改失败，请稍后重试！", "error");
    }
  });

  // 查询按钮事件
  $(".search-btn").on("click", () => {
    searchParams.keyword = $(".keyword").val();
    initPage();
  });

  // 重置按钮事件
  $(".reset-btn").on("click", () => {
    $(".keyword").val("");
  });

  // 确认删除按钮事件
  $("#confirm-delete").on("click", async () => {
    const result = await sugon.request(
      sugon.interFaces.system.dataEntry.deleteTable1,
      { id: deleteId }
    );
    if (result.code == 200) {
      $("#confirm-panel").modal("hide");
      initPage();
      sugon.showMessage("删除成功！", "success");
    } else {
      sugon.showMessage("删除失败，请稍后重试！", "error");
    }
  });

  // 文件改变事件
  $("#file-input").on("change", async e => {
    const $target = $(e.target);
    const file = $target[0].files[0];
    if (file) {
      const form = new FormData();
      form.append("submitter", sugon.identityInfo.name);
      form.append("file", file);
      const result = await sugon.request(
        sugon.interFaces.system.dataEntry.uploadVideo,
        form,
        {
          processData: false,
          contentType: false
        }
      );
      if (result.code == 200) {
        sugon.showMessage("上传成功！", "success");
        $target.val("");
        initPage();
      } else {
        sugon.showMessage("上传失败，请稍后重试！", "error");
      }
    }
  });
});
