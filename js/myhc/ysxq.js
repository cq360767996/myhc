requirejs(["common"], function(sugon) {
  var param = sugon.getUrlParam("txt");
  var searchCode, searchTxt;
  $("#keywords").val(param);

  $(".back").bind("click", function() {
    location.hash = vipspa.stringify("myys", { type: "myys" });
  });

  function getSearchList(data) {
    var result = {};
    result.data = data;
    $(".grid").empty();
    for (var i = 0; i < result.data.length; i++) {
      var thumbnail = "",
        thumbnailShow = "myThumbnail hid";
      var moudleInfo = "how",
        secondEle = "";
      if (result.data[i].type == 1) {
        if (result.data[i].url.indexOf("dwjx") == -1) {
          thumbnail =
            "../../img/myhc/myys/" + result.data[i].url + "_thumbnail.png";
          thumbnailShow = "myThumbnail show";
          moudleInfo = "sow";
          var tempStr1 = "",
            tempStr2 = "";
          if (result.data[i].url == "myzs") {
            tempStr1 = "民意指数：";
            tempStr2 = "执法公信力指数等民意指数分析";
          } else if (result.data[i].url == "myjz") {
            tempStr1 = "民意矩阵：";
            tempStr2 = "社会治安满意度、公安队伍满意度、社会民警熟悉率等分析";
          } else if (result.data[i].url == "rdwt") {
            tempStr1 = "热点问题：";
            tempStr2 = "民意诉求及热点问题分析";
          }
          secondEle =
            "<div class='secondRow'>" +
            "<div class='" +
            moudleInfo +
            "'><span class='lab'>" +
            tempStr1 +
            "</span><span class='val'>" +
            tempStr2 +
            "</span></div>" +
            "</div>";
        } else {
          thumbnail = "../../img/myhc/myys/dwjx_thumbnail.png";
          thumbnailShow = "myThumbnail show";
          moudleInfo = "low";
          secondEle =
            "<div class='secondRow'>" +
            "<div class='" +
            moudleInfo +
            "' id='sqxz'><span class='lab'>模块：</span><span class='val'>诉求性质分析模式</span></div>" +
            "<div class='" +
            moudleInfo +
            "' id='ywgk'><span class='lab'>模块：</span><span class='val'>业务归口分析模式</span></div>" +
            "<div class='" +
            moudleInfo +
            "' id='jtwt'><span class='lab'>模块：</span><span class='val'>具体问题分析模式</span></div>" +
            "<div class='" +
            moudleInfo +
            "' id='dwjs'><span class='lab'>模块：</span><span class='val'>队伍管理分析模式</span></div>" +
            "</div>";
        }
      } else {
        secondEle =
          "<div class='secondRow'>" +
          "<div class='" +
          moudleInfo +
          "'><span class='lab'>" +
          result.data[i].name2 +
          "</span><span class='val'>" +
          result.data[i].value2 +
          "</span></div>" +
          "<div class='" +
          moudleInfo +
          "'><span class='lab'>" +
          result.data[i].name3 +
          "</span><span class='val'>" +
          result.data[i].value3 +
          "</span></div>" +
          "<div class='" +
          moudleInfo +
          "'><span class='lab'>" +
          result.data[i].name4 +
          "</span><span class='val'>" +
          result.data[i].value4 +
          "</span></div>" +
          "</div>";
      }
      var eleStr =
        "<div class='row' id=" +
        result.data[i].id +
        " type=" +
        result.data[i].type +
        " url=" +
        result.data[i].url +
        " name=" +
        result.data[i].codeName +
        " mold=" +
        result.data[i].mold +
        " >" +
        "<div class='firstRow'>" +
        "<div><span class='lab'>" +
        result.data[i].name1 +
        "</span><span class='val'>" +
        result.data[i].value1 +
        "</span></div>" +
        "<div class='" +
        thumbnailShow +
        "'><img src=" +
        thumbnail +
        " /></div>" +
        "</div>";
      eleStr += secondEle + "</div>";
      $(".grid").append(eleStr);
    }
  }

  var getEvent = function() {
    $(".grid>div")
      .unbind()
      .bind("click", function(event) {
        event.stopPropagation();
        if (
          $(this)
            .attr("url")
            .indexOf("dwjx") >= 0
        ) {
          return;
        }
        sugon.requestJson(
          {
            type: "POST",
            url: sugon.interFaces.myhc.myys.saveKeyWord,
            data: {
              keyWord: $(this)
                .find("span.val")
                .eq(0)
                .html()
            },
            async: false
          },
          function(result) {}
        );

        if ($(this).attr("type") == "1") {
          sessionStorage.setItem(
            "searchParams",
            '{"code": "' +
              $(this).attr("id") +
              '", "codeName": "' +
              $(this).attr("name") +
              '", "mold": "' +
              $(this).attr("mold") +
              '"}'
          );
          location.hash = vipspa.stringify($(this).attr("url"), {
            type: $(this).attr("url")
          });
        } else {
          location.hash = vipspa.stringify("myys/ysxq/detail", {
            id: this.id + "_" + searchTxt
          });
        }
      });

    $(".low")
      .unbind()
      .bind("click", function() {
        event.stopPropagation();
        sessionStorage.setItem(
          "searchParams",
          '{"code": "' +
            $(this)
              .parent()
              .parent()
              .attr("id") +
            '", "codeName": "' +
            $(this)
              .parent()
              .parent()
              .attr("name") +
            '", "mold": "' +
            $(this)
              .parent()
              .parent()
              .attr("mold") +
            '"}'
        );
        var tempUrl = "dwjx/" + this.id;
        location.hash = vipspa.stringify(tempUrl, { type: tempUrl });
      });
  };

  $(".check").bind("click", function() {
    sugon.requestJson(
      {
        type: "POST",
        url: sugon.interFaces.myhc.myys.DataList,
        data: { txt: $("#keywords").val(), pageSize: 6, pageNum: 1 },
        async: false
      },
      function(result) {
        searchTxt = $("#keywords").val();
        searchCode = result.code;
        getSearchList(result.data);
        getEvent();

        $("#pageLimit").bootstrapPaginator({
          currentPage: 1,
          totalPages: result.totalPages,
          size: "normal",
          bootstrapMajorVersion: 3,
          alignment: "right",
          numberOfPages: 6,
          itemTexts: function(type, page, current) {
            switch (type) {
              case "first":
                return "首页";
              case "prev":
                return "<";
              case "next":
                return ">";
              case "last":
                return "末页";
              case "page":
                return page;
            }
          },
          onPageClicked: function(event, originalEvent, type, page) {
            sugon.requestJson(
              {
                type: "POST",
                url: sugon.interFaces.myhc.myys.DataList,
                data: { txt: searchTxt, pageSize: 6, pageNum: page },
                async: false
              },
              function(result) {
                getSearchList(result.data);
                getEvent();
              }
            );
          }
        });
      }
    );
  });
  $(".check").click();
});
