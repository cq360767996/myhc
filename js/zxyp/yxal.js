/* Created by handsome qiu */
requirejs(["common"], function(sugon) {
  var param = window.dialogParams;
  $(function() {
    initPage();
  });

  // 初始化页面
  function initPage() {
    var $container = $(".yxal-img-container > div");
    $container.empty();
    sugon.requestJson(
      {
        type: "post",
        url: sugon.interFaces.zxyp.rx.getPopupYxal,
        data: {
          id: param.id
        }
      },
      function(result) {
        var data1 = result.data1,
          data2 = result.data2;
        for (var key in data1) {
          $("#" + key)
            .attr("title", data1[key])
            .html(data1[key]);
        }
        var $containerWidth =
          "calc((100% - 20px) / 3 * " +
          data2.length +
          " + " +
          (data2.length - 1) * 10 +
          "px)";
        var $divWidth =
          "calc((100% - " +
          (data2.length - 1) * 10 +
          "px) / " +
          data2.length +
          ")";
        $container.css("width", $containerWidth);
        let $icon = $(".yxal-head-icon > i");
        if (data2.length > 0) {
          $icon.show();
        } else {
          $icon.hide();
        }
        data2.map(function(val, index) {
          var $div = $("<div/>")
            .css("width", $divWidth)
            .css("background", "url(" + val + ") no-repeat")
            .css("background-size", "100% 100%");
          if (index === 0) {
            $div.css("margin-left", "0");
          }
          $container.append($div);
        });
      }
    );
  }

  // 上下页事件
  function preNextEvent(e) {
    var $doc = $("#alzp");
    var $target = $(e.target),
      $body = $(".yxal-img-container"),
      $container = $(".yxal-img-container > div"),
      containerWidth = $container.width(),
      width = $body.width() + 10,
      left,
      marginLeft = parseFloat($container.css("margin-left"));
    if (
      $target.hasClass("glyphicon-chevron-right") &&
      Math.abs(marginLeft) + width <= containerWidth
    ) {
      left = marginLeft - width;
      $container
        .stop()
        .animate({ "margin-left": left }, 200, "linear", function() {
          $doc.one("click", ".yxal-head-icon > i", preNextEvent);
        });
    } else if ($target.hasClass("glyphicon-chevron-left") && marginLeft < 0) {
      left = marginLeft + width;
      $container
        .stop()
        .animate({ "margin-left": left }, 200, "linear", function() {
          $doc.one("click", ".yxal-head-icon > i", preNextEvent);
        });
    } else {
      $doc.one("click", ".yxal-head-icon > i", preNextEvent);
    }
  }

  // 绑定上下页事件
  $("#alzp").one("click", ".yxal-head-icon > i", preNextEvent);
});
