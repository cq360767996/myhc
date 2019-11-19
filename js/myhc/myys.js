requirejs(["common"], function(sugon) {
  function initWord(type = 0) {
    sugon
      .request(sugon.interFaces.myhc.myys.HotWords, { type })
      .then(result => {
        let html = "";
        result.data.map(val => {
          html += `<div id="${val.value}">${val.name}</div>`;
        });
        $(".hotWord")
          .empty()
          .append(html);
      });
  }

  function initSearchList() {
    sugon.request(sugon.interFaces.myhc.myys.HotWords).then(result => {
      let html = "";
      result.data.map(val => {
        html += `<div class='ellipsis' id="${val.value}">${val.name}</div>`;
      });
      $(".hotSearch .list")
        .empty()
        .append(html);

      $(".hotSearch .list>div")
        .unbind()
        .bind("click", function() {
          $("#keywords").val($(this).html());
          searchFunc();
        });
    });
  }

  // 查询按钮事件
  function searchFunc() {
    let index = $(".selected").index(".switch-btn > div"),
      $keywords = $("#keywords");
    if (index === 0) {
      location.hash = vipspa.stringify("myys/ysxq", {
        txt: $keywords.val()
      });
    } else {
      location.hash = vipspa.stringify("myys/mysq", {
        txt: $keywords.val()
      });
    }
  }

  var initView = function() {
    //搜索
    $(".check").bind("click", function() {
      if ($("#keywords").val()) {
        searchFunc();
      }
    });
    //加载热词
    initWord();
    initSearchList();
  };

  initView();

  // 切换按钮事件
  $(".switch-btn > div").on("click", e => {
    let $target = $(e.target),
      className = "selected",
      $section = $(".search-input > section");
    if (!$target.hasClass(className)) {
      $(".switch-btn > div").removeClass(className);
      $target.addClass(className);
      let left = $section.css("left") === "54px" ? "144px" : "54px";
      $section.css({ left });
      initWord($target.index(".switch-btn > div"));
    }
  });
});
