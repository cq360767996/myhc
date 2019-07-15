requirejs(["common"], function(sugon) {
  var initWord = function() {
    sugon.requestJson(
      { type: "POST", url: sugon.interFaces.myys.HotWords, async: false },
      function(result) {
        for (var i = 0; i < result.data.length; i++) {
          $(".hotWord").append(
            "<div id=" +
              result.data[i].value +
              ">" +
              result.data[i].name +
              "</div>"
          );
        }
      }
    );
  };

  var initSearchList = function() {
    sugon.requestJson(
      { type: "POST", url: sugon.interFaces.myys.SearchList, async: false },
      function(result) {
        $(".hotSearch .list").empty();
        for (var i = 0; i < result.data.length; i++) {
          $(".hotSearch .list").append(
            "<div class='ellipsis' id=" +
              result.data[i].value +
              ">" +
              result.data[i].name +
              "</div>"
          );
        }
        $(".hotSearch .list>div")
          .unbind()
          .bind("click", function() {
            // $("#keywords").val($(this).html());
            location.hash = vipspa.stringify("myys/ysxq", {
              txt: $(this).html()
            });
          });
      }
    );
  };

  $(".refresh").bind("click", function() {
    initSearchList();
  });

  var initView = function() {
    //搜索
    $(".check").bind("click", function() {
      if ($("#keywords").val()) {
        location.hash = vipspa.stringify("myys/ysxq", {
          txt: $("#keywords").val()
        });
      }
    });
    //加载热词
    initWord();
    //热搜-换一换
    $(".refresh").click();
  };

  initView();
});
