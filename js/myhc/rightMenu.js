requirejs(["common"], sugon => {
  // 加载热点问题数据
  function initRdwtList() {
    let params = window.rightParams;
    if (params.mold == 2) {
      params.deptId = null;
    }
    sugon
      .request(sugon.interFaces.myhc.rdwt.getMidData, params)
      .then(result => {
        let html = "";
        let $body = $(".rcGrid");
        result.data.map((val, index) => {
          html += `<div title="${val.content}">
                    ${index + 1}、${val.content}
                  </div>`;
        });
        $body.empty().append(html);
      });
  }

  // 查询按钮事件
  $(".search_bar img").on("click", function() {
    let $keyword = $("#keywords");
    if ($keyword.val()) {
      location.hash = vipspa.stringify("myys/ysxq", {
        txt: $keyword.val()
      });
    }
  });

  // 初始化查询列表
  function initSearchList() {
    sugon
      .request(sugon.interFaces.myhc.myys.HotWords, { type: 0 })
      .then(result => {
        let html = "";
        result.data.map(val => {
          html += `<div id="${val.value}">${val.name}</div>`;
        });
        $(".hot_list")
          .empty()
          .append(html);
      });
  }

  // 绑定点击事件
  $(".hot_list").on("click", "div", e => {
    $("#keywords").val($(e.target).html());
  });

  // 入口
  initRdwtList();
  initSearchList();
});
