requirejs(["common"], sugon => {
  // 加载热点问题数据
  function initRdwtList() {
    sugon
      .request(sugon.interFaces.myhc.rdwt.getMidData, window.rightParams)
      .then(result => {
        let html = "",
          $body = $(".rcGrid");
        result.data.map((val, index) => {
          html += `<div 
                  title="${val.content}">
                  ${index + 1}、${val.content}
                 </div>`;
        });
        $body
          .empty()
          .append(html)
          .css("lineHeight", $body.find("div").css("height"));
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
    sugon.request(sugon.interFaces.myhc.myys.HotWords).then(result => {
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
