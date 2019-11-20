requirejs(["common"], sugon => {
  // 全局查询条件
  let searchParams = {
    title: "",
    date1: "",
    date2: "",
    editId: ""
  };
  // 初始化查询栏
  function initSearchBar() {
    $("#date1").datetimepicker({
      format: "yyyy-mm",
      autoclose: true,
      todayBtn: false,
      startView: "year",
      minView: "year",
      maxView: "decade",
      endDate: sugon.getDate(),
      language: "zh-CN"
    });
    $("#date2").datetimepicker({
      format: "yyyy-mm",
      autoclose: true,
      todayBtn: false,
      startView: "year",
      minView: "year",
      maxView: "decade",
      endDate: sugon.getDate(),
      language: "zh-CN"
    });
    sugon.request(sugon.interFaces.system.notification.getTree).then(result => {
      let data = result.data;
      let $deptTree = $("#dept-tree");
      let $sendObj = $("#dept-name");
      //渲染树
      $deptTree.treeview({
        data,
        levels: 1,
        onNodeSelected: function(event, node) {
          $sendObj.val(node.text);
          $sendObj.attr("node-id", node.id);
          $deptTree.css("visibility", "hidden");
        },
        showCheckbox: false
      });
      // 为单位名称绑定点击事件
      $sendObj.off().on("click", () => {
        $deptTree.css({
          width: $sendObj.outerWidth(),
          visibility: "visible"
        });
      });
    });
  }

  // 加载表格数据和分页组件
  function loadTabAndNav(pageNum = 1) {
    let { title, date1, date2 } = searchParams;
    let params = { pageNum, title, date1, date2 };
    sugon
      .request(sugon.interFaces.system.notification.getAll, params)
      .then(result => {
        sugon.renderNav(
          $(".nav-container"),
          pageNum,
          result.totalPage,
          loadTabAndNav
        );
        let html = `<row>
                      <cell>
                        <input class="check-all" type="checkbox" />
                      </cell>
                      <cell>标题</cell>
                      <cell>发送人</cell>
                      <cell>发送日期</cell>
                      <cell>操作</cell>
                    </row>`;
        result.data.map(val => {
          html += ` <row>
                      <cell>
                        <input class="single-check" row-id="${val.id}" type="checkbox" />
                      </cell>
                      <cell title="${val.title}">${val.title}</cell>
                      <cell>${val.name}</cell>
                      <cell>${val.date}</cell>
                      <cell>
                        <button class="edit-btn btn btn-primary">
                          <i class="glyphicon glyphicon-pencil"></i>修改
                        </button>
                        <button class="detail-btn btn btn-info">
                          <i class="glyphicon glyphicon-list-alt"></i>详情
                        </button>
                      </cell>
                    </row>`;
        });
        $("#tab-container")
          .empty()
          .append(html);

        // 绑定点击事件
        $("#tab-container > row")
          .off()
          .on("click", function(e) {
            let $this = $(this);
            let $target = $(e.target);
            let className = "single-check";
            let $checkbox = $this.children(":first").children(":first");
            // 勾选时排除编辑、详情以及checkbox
            if (
              !$target.hasClass("glyphicon-pencil") &&
              !$target.hasClass("glyphicon-list-alt") &&
              !$target.hasClass("edit-btn") &&
              !$target.hasClass("detail-btn") &&
              !$target.hasClass(className) &&
              $checkbox.hasClass(className)
            ) {
              let checked = $checkbox.is(":checked");
              $checkbox.prop("checked", !checked);
              let checkAll = 0;
              $(".single-check").each((index, dom) => {
                if ($(dom).is(":checked")) {
                  checkAll++;
                }
              });
              $(".check-all").prop("checked", checkAll === 9);
            }
          });
        // 全选事件
        $("#tab-container .check-all")
          .off()
          .on("click", e => {
            let $target = $(e.target);
            let isChecked = $target.is(":checked");
            $(".single-check").prop("checked", isChecked);
          });
      });
  }

  // 验证表单是否通过验证
  function isPass(val = "") {
    return /\S+/.test(val);
  }

  // 获取选中的数量
  function getSelected() {
    let result = { total: 0, idArr: [] };
    $(".single-check").each((index, dom) => {
      let $dom = $(dom);
      if ($dom.is(":checked")) {
        result.total++;
        result.idArr.push($dom.attr("row-id"));
      }
    });
    return result;
  }

  // 提交添加
  function submit(formData, tip) {
    sugon
      .request(sugon.interFaces.system.notification.submit, formData, {
        processData: false,
        contentType: false,
        dataType: "json"
      })
      .then(result => {
        if (result.code == 200) {
          loadTabAndNav();
          sugon.showMessage(tip, "success");
          $("#pop-panel").modal("hide");
        } else {
          sugon.showMessage("提交未成功！", "error");
        }
      })
      .catch(err => {
        sugon.showMessage("服务器内部错误，请稍后重试！", "error");
      });
  }

  // 发送或者删除
  function sendOrDelete(isDelete) {
    let selected = getSelected();
    if (selected.total === 0) {
      sugon.showMessage("请确认是否勾选！", "warning");
    } else {
      let tip = isDelete ? "您确定要删除所选数据吗？" : "是否发送？";
      let title = isDelete ? "删除提示" : "发送提示";
      $("#confirm-panel").modal("show");
      $("#confirm-name").html(title);
      $("#tip-span").html(tip);
    }
  }

  // 提交发送或者删除
  function submitSendOrDelete(id, isDelete) {
    let apiName = isDelete
      ? sugon.interFaces.system.notification.delete
      : sugon.interFaces.system.notification.send;
    let tip = isDelete ? "删除" : "发送";
    sugon
      .request(apiName, { id })
      .then(result => {
        if (result.code == 200) {
          sugon.showMessage(`${tip}成功！`, "success");
          $("#confirm-panel").modal("hide");
          loadTabAndNav();
        } else {
          sugon.showMessage(`${tip}未成功！`, "error");
        }
      })
      .catch(err => {
        sugon.showMessage("服务器内部错误，请稍后重试！", "error");
      });
  }

  // 详情和修改的id
  function renderDetailAndEdit(e, isDetail) {
    let $target = $(e.target);
    let $parent = $target.hasClass("glyphicon")
      ? $target.parent().parent()
      : $target.parent();
    let id = $parent
      .siblings()
      .eq(0)
      .find("input")
      .attr("row-id");

    searchParams.editId = id;
    sugon
      .request(sugon.interFaces.system.notification.getDetail, { id })
      .then(result => {
        if (isDetail) {
          $("#detail-name").html("通知公告详情");
          $("#detail-panel").modal("show");
          $("#detail-title").html(result.title);
          $("#detail-content").html(result.content);
          $("#detail-sendObj").html(result.objName);
          let fileName = `<a 
                            href="${result.fileUrl}"
                            download="${result.fileName}">
                            ${result.fileName}
                          </a>`;
          $("#detail-file-name").html(fileName);
          $("#detail-creator").html(result.creator);
          $("#detail-create-time").html(result.createTime);
        } else {
          $("#pop-name").html("通知公告修改");
          $("#pop-panel").modal("show");
          $("#pop-title").val(result.title);
          $("#pop-content").val(result.content);
          $("#dept-name")
            .val(result.objName)
            .attr("node-id", result.objId);
          $("#pop-file-name").val(result.fileName);
          $("#pop-creator").html(result.creator);
          $("#pop-create-time").html(result.createTime);
        }
      });
  }

  // 页面入口
  function initPage() {
    initSearchBar();
    loadTabAndNav();
  }

  // 页面入口
  initPage();

  // 添加按钮事件
  $("#add-btn").on("click", () => {
    $("#pop-name").html("通知公告新增");
    $("#pop-panel").modal("show");
    $("#pop-title").val("");
    $("#pop-content").val("");
    $("#pop-file-name").val("");
    $("#pop-file-input").val("");
    $("#dept-name")
      .val("")
      .removeAttr("node-id");
    $("#pop-creator").html(sugon.identityInfo.name);
    $("#pop-create-time").html(sugon.getToday());
  });

  // 修改按钮事件
  $("#tab-container").on("click", ".edit-btn", e => {
    renderDetailAndEdit(e, false);
  });

  // 详情按钮事件
  $("#tab-container").on("click", ".detail-btn", e => {
    renderDetailAndEdit(e, true);
  });

  // 删除按钮事件
  $("#delete-btn").on("click", () => {
    sendOrDelete(true);
  });

  // 发送按钮
  $("#send-btn").on("click", () => {
    sendOrDelete(false);
  });
  // 查询按钮事件
  $("#search-btn").on("click", () => {
    searchParams.title = $("#title").val();
    searchParams.date1 = $("#date1").val();
    searchParams.date2 = $("#date2").val();
    loadTabAndNav();
  });

  // 重置按钮事件
  $("#search-reset").on("click", () => {
    searchParams = { title: "", date1: "", date2: "" };
    $("#title").val("");
    $("#date1").val("");
    $("#date2").val("");
  });

  // 浏览按钮事件
  $(".btn-preview").on("click", () => {
    $("#pop-file-input").click();
  });

  // 上传文件改变选择事件
  $("#pop-file-input").on("change", e => {
    $("#pop-file-name").val(e.target.files[0].name);
  });

  // 确认按钮事件
  $("#pop-confirm").on("click", () => {
    let title = $("#pop-title").val();
    let content = $("#pop-content").val();
    let sendObj = $("#dept-name").attr("node-id");
    let creator = $("#pop-creator").html();
    let createTime = $("#pop-create-time").html();
    let formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("sendObj", sendObj);
    formData.append("creator", creator);
    formData.append("createTime", createTime);
    let file = document.getElementById("pop-file-input").files[0] || "";
    formData.append("file", file);
    // 判断是否新增
    if (
      $("#pop-name")
        .html()
        .indexOf("新增") > -1
    ) {
      if (isPass(title) && isPass(content) && isPass(sendObj)) {
        formData.append("id", "");
        submit(formData, "新增成功！");
      } else {
        sugon.showMessage("请填写必填项！");
      }
    } else {
      if (isPass(title) && isPass(content)) {
        formData.append("id", searchParams.editId);
        submit(formData, "修改成功！");
      } else {
        sugon.showMessage("请填写必填项！");
      }
    }
  });

  // 确认删除和发送按钮
  $("#confirm-delete-send").on("click", () => {
    let selected = getSelected();
    let id = selected.idArr.join(",");
    let isDelete =
      $("#tip-span")
        .html()
        .indexOf("删除") > -1;
    submitSendOrDelete(id, isDelete);
  });
});
