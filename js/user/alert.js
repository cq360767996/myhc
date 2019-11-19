requirejs(["common"], sugon => {
  // 全局查询条件
  let searchParams = {
    title: "",
    date1: "",
    date2: ""
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
    sugon.request(sugon.interFaces.user.alert.getTree).then(result => {
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
    let params = Object.assign({ pageNum }, searchParams);
    sugon.request(sugon.interFaces.user.alert.getAll, params).then(result => {
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
                  </row>`;
      result.data.map(val => {
        html += `<row>
                   <cell>
                     <input class="single-check" row-id="${val.id}" type="checkbox" />
                   </cell>
                   <cell>${val.title}</cell>
                   <cell>${val.name}</cell>
                   <cell>${val.date}</cell>
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
          if (!$target.hasClass(className) && $checkbox.hasClass(className)) {
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

  // 页面入口
  function initPage() {
    initSearchBar();
    loadTabAndNav();
  }

  // 页面入口
  initPage();

  // 添加按钮事件
  $("#add-btn").on("click", e => {
    $("#pop-panel").modal("show");
    $("#pop-title").val("");
    $("#pop-content").val("");
    $("#pop-file-name").val("");
    $("#pop-file-input").val("");
    $("#send-obj").show();
    $("#dept-name")
      .val("")
      .removeAttr("node-id");
    $("#pop-creater").html(sugon.identityInfo.name);
    $("#pop-create-time").html(sugon.getToday());
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
    let fileName = Array.from(e.target.files).reduce(
      (acc, val) => `${acc},${val.name}`,
      ""
    );
    $("#pop-file-name").val(fileName.slice(1));
  });

  // 确认按钮事件
  $("#pop-confirm").on("click", () => {
    let title = $("#pop-title").val();
    let content = $("#pop-content").val();
    let sendObj = $("#dept-name").attr("node-id");
    let creater = $("#pop-creater").html();
    let createTime = $("#pop-create-time").html();
    let formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("sendObj", sendObj);
    formData.append("creater", creater);
    formData.append("createTime", createTime);
    if (isPass(title) && isPass(content) && isPass(sendObj)) {
      let fileList = Array.from(
        document.getElementById("pop-file-input").files
      );
      fileList.forEach((val, index) => {
        formData.append("file" + index, val);
      });
      sugon
        .request(sugon.interFaces.user.alert.submitAdd, formData, {
          processData: false,
          contentType: false,
          dataType: "json"
        })
        .then(result => {
          if (result.code == 200) {
            sugon.showMessage("上传成功！", "success");
            $("#pop-panel").modal("hide");
          }
        });
    } else {
      sugon.showMessage("请填写必填项！", "warning");
    }
  });
});
