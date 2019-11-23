requirejs(["common"], sugon => {
  $(".home-main > main > aside").on("click", () => {
    let deptId = $("#placeCode").val();
    if (deptId) {
      window.passDeptId = deptId;
      requirejs(["text!../views/slhy/zhzs_popup.html"], function(ele) {
        $("#ui-view").append(ele);
      });
    } else {
      sugon.showMessage("请选择一个单位！", "warning");
    }
  });

  $(".home-main > main > input").on({
    blur() {
      $(".home-main > main > span").css("transform", "scaleY(1)");
    },
    focus() {
      $(".home-main > main > span").css("transform", "scaleY(-1)");
    },
    click() {
      let $deptTree = $("#left-tree");
      $deptTree.css(
        "visibility",
        $deptTree.css("visibility") === "hidden" ? "visible" : "hidden"
      );
    }
  });

  // 页面入口
  async function initPage() {
    let result = await sugon.request(sugon.interFaces.slhy.zhzs.getDeptTree, {
      type: 0
    });
    let $deptName = $("#place");
    let $deptId = $("#placeCode");
    $deptTree = $("#left-tree");
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
  }

  // 页面入口
  initPage();
});
