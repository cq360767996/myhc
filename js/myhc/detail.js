requirejs(["common", "myhc/detail_popup"], function(sugon, popup) {
  var titleName = "";
  var param = sugon.getUrlParam("id").split("_");

  $(".back").bind("click", function() {
    location.hash = vipspa.stringify("myys/ysxq", { txt: param[1] });
  });

  var initData = function() {
    sugon.requestJson(
      {
        type: "POST",
        url: sugon.interFaces.myhc.myys.Detail,
        data: { id: param[0] },
        async: false
      },
      function(result) {
        Object.keys(result.data1).forEach(key => {
          $("#" + key).html(result.data1[key]);
        });
        Object.keys(result.data2).forEach(key => {
          $("#" + key).html(result.data2[key]);
        });

        for (var i = 0; i < result.data3.length; i++) {
          $(".tab_pannel").append(
            `<div id="${result.data3[i].value}">
              ${result.data3[i].name}
             </div>`
          );
        }

        $(".tab_pannel>div").bind("click", function() {
          titleName = $(this).html();
          $(".tab_pannel .selected").removeClass("selected");
          $(this).attr("class", "selected");
          var type = $(this).attr("id");
          sugon.requestJson(
            {
              type: "POST",
              url: sugon.interFaces.myhc.myys.Grid,
              data: { sfzh: param[0], dhs: $("#tel").html(), type: this.id },
              async: false
            },
            function(result) {
              $(".grid").empty();
              $(".grid").append("<div class='header'></div>");
              var len = result.data.colums.length;
              for (var i = 0; i < len; i++) {
                $(".header").append(
                  "<div class='cols'>" + result.data.colums[i] + "</div>"
                );
              }
              for (var i = 0; i < result.data.data.length; i++) {
                $(".grid").append(
                  "<div class='tr' id=" + result.data.data[i].value1 + "></div>"
                );
                for (var key in result.data.data[i]) {
                  if (key != "value1" && key != "type") {
                    var eleStr;
                    if (key == "value7") {
                      if (result.data.data[i][key] == "满意") {
                        eleStr =
                          "<span>" + result.data.data[i][key] + "</span>";
                      } else {
                        eleStr =
                          "<span class='red'>" +
                          result.data.data[i][key] +
                          "</span>";
                      }
                      let title =
                        eleStr.indexOf("span") > -1 ? "" : ` title="${eleStr}"`;
                      $("#" + result.data.data[i].value1).append(
                        `<div class='cols ellipsis'${title}>${eleStr}</div>`
                      );
                    } else {
                      let title =
                        result.data.data[i][key].indexOf("span") > -1
                          ? ""
                          : ` title="${result.data.data[i][key]}"`;
                      $("#" + result.data.data[i].value1).append(
                        `<div class='cols ellipsis'${title}>
                            ${result.data.data[i][key]}
                         </div>`
                      );
                    }
                  }
                }
                $("#" + result.data.data[i].value1).append(
                  `<div class='cols'>
                    <span type="${result.data.data[i].type}">详情</span>
                   </div>`
                );
              }
              $(".cols").css("width", 100 / result.data.colums.length + "%");

              $(".cols>span")
                .unbind()
                .bind("click", function() {
                  if ($(this).html() == "详情") {
                    var id = $(this)
                      .parent()
                      .parent()
                      .attr("id");
                    var mydStr = $(this)
                      .parent()
                      .prev()
                      .children(":first")
                      .html();
                    var type = $(".tab_pannel>div.selected").attr("id");
                    var myd = mydStr == "不满意" ? 0 : 1;
                    popup.renderPopup(id, myd, type, $(".tab-container"));
                  }
                });
            }
          );
        });
        $(".tab_pannel>div")
          .eq(0)
          .click();
      }
    );
  };

  initData();
});
