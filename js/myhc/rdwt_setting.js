requirejs(["common", "ec"], function(sugon) {
  // 查询规则
  var searchRuler = {};

  // 标签数组
  var tagArr = [[], [], []];

  // 用来存储查询条件的数组
  var tagArrCondition = [[], [], []];

  // 用来存储右侧数据
  var rightData = [];

  // 用来存储弹出页数据
  var popData = [];

  // 初始化查询栏
  var initSearchBar = function() {
    var date = sugon.getParam("date");
    var deptName = sugon.getParam("deptName");
    var deptId = sugon.getParam("deptId");
    $("#date-input").val(date);
    $("#place").val(deptName);
    $("#placeCode").val(deptId);
    searchRuler.deptId = deptId;
    searchRuler.date = date;
    searchRuler.timestamp = new Date();
    searchRuler.mold = 1;
    searchRuler.pageSize = 20;
    // 设置下拉框宽度
    $("#left-tree").css("width", $("#place").outerWidth());
  };

  // 绑定单位输入框点击事件
  $("#place").bind("click", function() {
    $("#left-tree").css("visibility", "visible");
  });

  // 返回按钮事件监听
  $("#back-btn").click(function() {
    location.hash = vipspa.stringify("rdwt", {
      deptName: $("#place").val(),
      deptId: $("#placeCode").val(),
      date: $("#date-input").val()
    });
  });

  // 写入tag
  var getTags = function(level, superTags) {
    var condition = {
      timestamp: new Date(),
      date: searchRuler.date,
      deptId: searchRuler.deptId,
      level: level,
      superTags: JSON.stringify(superTags),
      mold: searchRuler.mold
    };
    searchRuler.timestamp = condition.timestamp;
    sugon.requestJson(
      {
        url: sugon.interFaces.rdwt.getTags,
        type: "post",
        data: condition
      },
      function(result) {
        if (!sugon.isPublished || searchRuler.timestamp == result.timestamp) {
          var data = result.data;
          var arr = [];
          for (var i = 0; i < data.length; i++) {
            var obj = {};
            obj.name = data[i];
            obj.checked = true;
            arr.push(obj);
          }
          tagArrCondition[level] = data;
          tagArr[level] = arr;
        }
      }
    );
  };

  // 加载tab
  var loadTab = function() {
    // 将选中的模式记录到全局变量
    searchRuler.deptId = $("#placeCode").val();
    searchRuler.date = $("#date-input").val();
    searchRuler.timestamp = new Date();
    searchRuler.tags = tagArrCondition;
    var ajaxObj = {
      url: sugon.interFaces.rdwt.getTab,
      type: "post",
      data: searchRuler
    };
    sugon.requestJson(ajaxObj, function(result) {
      var tabData = result.tabData;
      loadTabDom(
        searchRuler.mold,
        tabData,
        searchRuler.sortCol,
        searchRuler.order
      );
    });
  };

  // 创建表单元素
  var loadTabDom = function(mold, data, sortCol, order) {
    $("#tab-container").empty();
    var $tabHead;
    switch (mold) {
      case 5:
        $tabHead = $("<div/>")
          .addClass("tab-tr-head")
          .append(
            $("<div/>")
              .addClass("tab-td-first")
              .append('<input type="checkbox" id="check-all" />')
          )
          .append(
            $("<div/>")
              .addClass("tab-td")
              .attr("id", "head-dw")
              .css("width", "calc((100% - 40px) / 6)")
              .append($("<span/>").html("单位 "))
              .append($('<i class="glyphicon glyphicon-collapse-down"/>'))
          )
          .append(
            $("<div/>")
              .addClass("tab-td")
              .attr("id", "head-ywlx")
              .css("width", "calc((100% - 40px) / 6)")
              .append($("<span/>").html("业务类型 "))
              .append($('<i class="glyphicon glyphicon-collapse-down"/>'))
          )
          .append(
            $("<div/>")
              .addClass("tab-td")
              .attr("id", "head-rhbq")
              .css("width", "calc((100% - 40px) / 6)")
              .append($("<span/>").html("队伍融合标签 "))
          )
          .append(
            $("<div/>")
              .addClass("tab-td")
              .attr("id", "head-jdl")
              .css("width", "calc((100% - 40px) / 6)")
              .append($("<span/>").html("绝对量 "))
              .append($('<i class="glyphicon glyphicon-sort-by-order-alt"/>'))
          )
          .append(
            $("<div/>")
              .addClass("tab-td")
              .attr("id", "head-yzl")
              .css("width", "calc((100% - 40px) / 6)")
              .append($("<span/>").html("月增量 "))
              .append($('<i class="glyphicon glyphicon-sort-by-order-alt"/>'))
          )
          .append(
            $("<div/>")
              .addClass("tab-td")
              .attr("id", "head-njzl")
              .css("width", "calc((100% - 40px) / 6)")
              .append($("<span/>").html("年均增量 "))
              .append($('<i class="glyphicon glyphicon-sort-by-order-alt"/>'))
          );
        $("#tab-container").append($tabHead);
        for (var i = 0; i < data.length; i++) {
          var $tabData = $("<div/>")
            .addClass("tab-tr")
            .attr("id", data[i].id);
          var isSelected = false;
          for (var j = 0; j < rightData.length; j++) {
            if (rightData[j].id == data[i].id) {
              isSelected = true;
              break;
            }
          }
          if (isSelected) {
            $tabData.addClass("tab-tr-hover").append(
              $("<div/>")
                .addClass("tab-td-first")
                .append(
                  '<input type="checkbox" checked="checked" class="checkbox-group" />'
                )
            );
          } else {
            $tabData.append(
              $("<div/>")
                .addClass("tab-td-first")
                .append('<input type="checkbox" class="checkbox-group" />')
            );
          }
          $tabData
            .append(
              $("<div/>")
                .addClass("tab-td")
                .css("width", "calc((100% - 40px) / 6)")
                .html(data[i].dw)
            )
            .append(
              $("<div/>")
                .addClass("tab-td")
                .css("width", "calc((100% - 40px) / 6)")
                .html(data[i].ywlx)
            )
            .append(
              $("<div/>")
                .addClass("tab-td")
                .css("width", "calc((100% - 40px) / 6)")
                .html(data[i].rhbq)
            )
            .append(
              $("<div/>")
                .addClass("tab-td")
                .css("width", "calc((100% - 40px) / 6)")
                .html(data[i].jdl)
            )
            .append(
              $("<div/>")
                .addClass("tab-td")
                .css("width", "calc((100% - 40px) / 6)")
                .html(data[i].yzl)
            )
            .append(
              $("<div/>")
                .addClass("tab-td")
                .css("width", "calc((100% - 40px) / 6)")
                .html(data[i].njzl)
            );
          $("#tab-container").append($tabData);
        }
        break;
      case 4:
        // $('.tab-td').css('width', 'calc((100% - 40px) / 9)');
        $tabHead = $("<div/>")
          .addClass("tab-tr-head")
          .append(
            $("<div/>")
              .addClass("tab-td-first")
              .append('<input type="checkbox" id="check-all" />')
          )
          .append(
            $("<div/>")
              .addClass("tab-td")
              .attr("id", "head-dw")
              .css("width", "calc((100% - 40px) / 6)")
              .append($("<span/>").html("单位 "))
              .append($('<i class="glyphicon glyphicon-collapse-down"/>'))
          )
          .append(
            $("<div/>")
              .addClass("tab-td")
              .attr("id", "head-ywlx")
              .css("width", "calc((100% - 40px) / 6)")
              .append($("<span/>").html("业务类型 "))
              .append($('<i class="glyphicon glyphicon-collapse-down"/>'))
          )
          .append(
            $("<div/>")
              .addClass("tab-td")
              .attr("id", "head-rhbq")
              .css("width", "calc((100% - 40px) / 6)")
              .append($("<span/>").html("三级融合标签 "))
          )
          .append(
            $("<div/>")
              .addClass("tab-td")
              .attr("id", "head-jdl")
              .css("width", "calc((100% - 40px) / 6)")
              .append($("<span/>").html("绝对量 "))
              .append($('<i class="glyphicon glyphicon-sort-by-order-alt"/>'))
          )
          .append(
            $("<div/>")
              .addClass("tab-td")
              .attr("id", "head-yzl")
              .css("width", "calc((100% - 40px) / 6)")
              .append($("<span/>").html("月增量 "))
              .append($('<i class="glyphicon glyphicon-sort-by-order-alt"/>'))
          )
          .append(
            $("<div/>")
              .addClass("tab-td")
              .attr("id", "head-njzl")
              .css("width", "calc((100% - 40px) / 6)")
              .append($("<span/>").html("年均增量 "))
              .append($('<i class="glyphicon glyphicon-sort-by-order-alt"/>'))
          );
        $("#tab-container").append($tabHead);
        for (var i = 0; i < data.length; i++) {
          var $tabData = $("<div/>")
            .addClass("tab-tr")
            .attr("id", data[i].id);
          var isSelected = false;
          for (var j = 0; j < rightData.length; j++) {
            if (rightData[j].id == data[i].id) {
              isSelected = true;
              break;
            }
          }
          if (isSelected) {
            $tabData.addClass("tab-tr-hover").append(
              $("<div/>")
                .addClass("tab-td-first")
                .append(
                  '<input type="checkbox" checked="checked" class="checkbox-group" />'
                )
            );
          } else {
            $tabData.append(
              $("<div/>")
                .addClass("tab-td-first")
                .append('<input type="checkbox" class="checkbox-group" />')
            );
          }
          $tabData
            .append(
              $("<div/>")
                .addClass("tab-td")
                .css("width", "calc((100% - 40px) / 6)")
                .html(data[i].dw)
            )
            .append(
              $("<div/>")
                .addClass("tab-td")
                .css("width", "calc((100% - 40px) / 6)")
                .html(data[i].ywlx)
            )
            .append(
              $("<div/>")
                .addClass("tab-td")
                .css("width", "calc((100% - 40px) / 6)")
                .html(data[i].rhbq)
            )
            .append(
              $("<div/>")
                .addClass("tab-td")
                .css("width", "calc((100% - 40px) / 6)")
                .html(data[i].jdl)
            )
            .append(
              $("<div/>")
                .addClass("tab-td")
                .css("width", "calc((100% - 40px) / 6)")
                .html(data[i].yzl)
            )
            .append(
              $("<div/>")
                .addClass("tab-td")
                .css("width", "calc((100% - 40px) / 6)")
                .html(data[i].njzl)
            );
          $("#tab-container").append($tabData);
        }
        break;
      case 3:
        $tabHead = $("<div/>")
          .addClass("tab-tr-head")
          .append(
            $("<div/>")
              .addClass("tab-td-first")
              .append('<input type="checkbox" id="check-all" />')
          )
          .append(
            $("<div/>")
              .addClass("tab-td")
              .attr("id", "head-dw")
              .css("width", "calc((100% - 40px) / 6)")
              .append($("<span/>").html("单位 "))
              .append($('<i class="glyphicon glyphicon-collapse-down"/>'))
          )
          .append(
            $("<div/>")
              .addClass("tab-td")
              .attr("id", "head-ywlx")
              .css("width", "calc((100% - 40px) / 6)")
              .append($("<span/>").html("业务类型 "))
              .append($('<i class="glyphicon glyphicon-collapse-down"/>'))
          )
          .append(
            $("<div/>")
              .addClass("tab-td")
              .attr("id", "head-rhbq")
              .css("width", "calc((100% - 40px) / 6)")
              .append($("<span/>").html("融合标签 "))
          )
          .append(
            $("<div/>")
              .addClass("tab-td")
              .attr("id", "head-jdl")
              .css("width", "calc((100% - 40px) / 6)")
              .append($("<span/>").html("绝对量 "))
              .append($('<i class="glyphicon glyphicon-sort-by-order-alt"/>'))
          )
          .append(
            $("<div/>")
              .addClass("tab-td")
              .attr("id", "head-yzl")
              .css("width", "calc((100% - 40px) / 6)")
              .append($("<span/>").html("月增量 "))
              .append($('<i class="glyphicon glyphicon-sort-by-order-alt"/>'))
          )
          .append(
            $("<div/>")
              .addClass("tab-td")
              .attr("id", "head-njzl")
              .css("width", "calc((100% - 40px) / 6)")
              .append($("<span/>").html("年均增量 "))
              .append($('<i class="glyphicon glyphicon-sort-by-order-alt"/>'))
          );
        $("#tab-container").append($tabHead);
        for (var i = 0; i < data.length; i++) {
          var $tabData = $("<div/>")
            .addClass("tab-tr")
            .attr("id", data[i].id);
          var isSelected = false;
          for (var j = 0; j < rightData.length; j++) {
            if (rightData[j].id == data[i].id) {
              isSelected = true;
              break;
            }
          }
          if (isSelected) {
            $tabData.addClass("tab-tr-hover").append(
              $("<div/>")
                .addClass("tab-td-first")
                .append(
                  '<input type="checkbox" checked="checked" class="checkbox-group" />'
                )
            );
          } else {
            $tabData.append(
              $("<div/>")
                .addClass("tab-td-first")
                .append('<input type="checkbox" class="checkbox-group" />')
            );
          }
          $tabData
            .append(
              $("<div/>")
                .addClass("tab-td")
                .css("width", "calc((100% - 40px) / 6)")
                .html(data[i].dw)
            )
            .append(
              $("<div/>")
                .addClass("tab-td")
                .css("width", "calc((100% - 40px) / 6)")
                .html(data[i].ywlx)
            )
            .append(
              $("<div/>")
                .addClass("tab-td")
                .css("width", "calc((100% - 40px) / 6)")
                .html(data[i].rhbq)
            )
            .append(
              $("<div/>")
                .addClass("tab-td")
                .css("width", "calc((100% - 40px) / 6)")
                .html(data[i].jdl)
            )
            .append(
              $("<div/>")
                .addClass("tab-td")
                .css("width", "calc((100% - 40px) / 6)")
                .html(data[i].yzl)
            )
            .append(
              $("<div/>")
                .addClass("tab-td")
                .css("width", "calc((100% - 40px) / 6)")
                .html(data[i].njzl)
            );
          $("#tab-container").append($tabData);
        }
        break;
      case 2:
        // $('.tab-td').css('width', 'calc((100% - 40px) / 10)');
        $tabHead = $("<div/>")
          .addClass("tab-tr-head")
          .append(
            $("<div/>")
              .addClass("tab-td-first")
              .append('<input type="checkbox" id="check-all" />')
          )
          .append(
            $("<div/>")
              .addClass("tab-td")
              .attr("id", "head-ywlx")
              .css("width", "calc((100% - 40px) / 5)")
              .append($("<span/>").html("业务类型 "))
              .append($('<i class="glyphicon glyphicon-collapse-down"/>'))
          )
          .append(
            $("<div/>")
              .addClass("tab-td")
              .attr("id", "head-sijbq")
              .css("width", "calc((100% - 40px) / 5)")
              .append($("<span/>").html("四级标签 "))
          )
          .append(
            $("<div/>")
              .addClass("tab-td")
              .attr("id", "head-jdl")
              .css("width", "calc((100% - 40px) / 5)")
              .append($("<span/>").html("绝对量 "))
              .append($('<i class="glyphicon glyphicon-sort-by-order-alt"/>'))
          )
          .append(
            $("<div/>")
              .addClass("tab-td")
              .attr("id", "head-yzl")
              .css("width", "calc((100% - 40px) / 5)")
              .append($("<span/>").html("月增量 "))
              .append($('<i class="glyphicon glyphicon-sort-by-order-alt"/>'))
          )
          .append(
            $("<div/>")
              .addClass("tab-td")
              .attr("id", "head-njzl")
              .css("width", "calc((100% - 40px) / 5)")
              .append($("<span/>").html("年均增量 "))
              .append($('<i class="glyphicon glyphicon-sort-by-order-alt"/>'))
          );
        $("#tab-container").append($tabHead);
        for (var i = 0; i < data.length; i++) {
          var $tabData = $("<div/>")
            .addClass("tab-tr")
            .attr("id", data[i].id);
          var isSelected = false;
          for (var j = 0; j < rightData.length; j++) {
            if (rightData[j].id == data[i].id) {
              isSelected = true;
              break;
            }
          }
          if (isSelected) {
            $tabData.addClass("tab-tr-hover").append(
              $("<div/>")
                .addClass("tab-td-first")
                .append(
                  '<input type="checkbox" checked="checked" class="checkbox-group" />'
                )
            );
          } else {
            $tabData.append(
              $("<div/>")
                .addClass("tab-td-first")
                .append('<input type="checkbox" class="checkbox-group" />')
            );
          }
          $tabData
            .append(
              $("<div/>")
                .addClass("tab-td")
                .css("width", "calc((100% - 40px) / 5)")
                .html(data[i].ywlx)
            )
            .append(
              $("<div/>")
                .addClass("tab-td")
                .css("width", "calc((100% - 40px) / 5)")
                .html(data[i].sijbq)
            )
            .append(
              $("<div/>")
                .addClass("tab-td")
                .css("width", "calc((100% - 40px) / 5)")
                .html(data[i].jdl)
            )
            .append(
              $("<div/>")
                .addClass("tab-td")
                .css("width", "calc((100% - 40px) / 5)")
                .html(data[i].yzl)
            )
            .append(
              $("<div/>")
                .addClass("tab-td")
                .css("width", "calc((100% - 40px) / 5)")
                .html(data[i].njzl)
            );
          $("#tab-container").append($tabData);
        }
        break;
      default:
        $tabHead = $("<div/>")
          .addClass("tab-tr-head")
          .append(
            $("<div/>")
              .addClass("tab-td-first")
              .append('<input type="checkbox" id="check-all" />')
          )
          .append(
            $("<div/>")
              .addClass("tab-td")
              .attr("id", "head-ywlx")
              .css("width", "calc((100% - 40px) / 6)")
              .append($("<span/>").html("业务类型 "))
              .append($('<i class="glyphicon glyphicon-collapse-down"/>'))
          )
          .append(
            $("<div/>")
              .addClass("tab-td")
              .attr("id", "head-ejbq")
              .css("width", "calc((100% - 40px) / 6)")
              .append($("<span/>").html("二级标签 "))
              .append($('<i class="glyphicon glyphicon-collapse-down"/>'))
          )
          .append(
            $("<div/>")
              .addClass("tab-td")
              .attr("id", "head-sanjbq")
              .css("width", "calc((100% - 40px) / 6)")
              .append($("<span/>").html("三级标签 "))
              .append($('<i class="glyphicon glyphicon-collapse-down"/>'))
          )
          .append(
            $("<div/>")
              .addClass("tab-td")
              .attr("id", "head-sijbq")
              .css("width", "calc((100% - 40px) / 6)")
              .append($("<span/>").html("四级标签 "))
          )
          .append(
            $("<div/>")
              .addClass("tab-td")
              .attr("id", "head-jdl")
              .css("width", "calc((100% - 40px) / 6)")
              .append($("<span/>").html("绝对量 "))
              .append($('<i class="glyphicon glyphicon-sort-by-order-alt"/>'))
          )
          .append(
            $("<div/>")
              .addClass("tab-td")
              .attr("id", "head-yzl")
              .css("width", "calc((100% - 40px) / 6)")
              .append($("<span/>").html("月增量 "))
              .append($('<i class="glyphicon glyphicon-sort-by-order-alt"/>'))
          );
        $("#tab-container").append($tabHead);
        for (var i = 0; i < data.length; i++) {
          var $tabData = $("<div/>")
            .addClass("tab-tr")
            .attr("id", data[i].id);
          var isSelected = false;
          for (var j = 0; j < rightData.length; j++) {
            if (rightData[j].id == data[i].id) {
              isSelected = true;
              break;
            }
          }
          if (isSelected) {
            $tabData.addClass("tab-tr-hover").append(
              $("<div/>")
                .addClass("tab-td-first")
                .append(
                  '<input type="checkbox" checked="checked" class="checkbox-group" />'
                )
            );
          } else {
            $tabData.append(
              $("<div/>")
                .addClass("tab-td-first")
                .append('<input type="checkbox" class="checkbox-group" />')
            );
          }
          $tabData
            .append(
              $("<div/>")
                .addClass("tab-td")
                .css("width", "calc((100% - 40px) / 6)")
                .html(data[i].ywlx)
            )
            .append(
              $("<div/>")
                .addClass("tab-td")
                .css("width", "calc((100% - 40px) / 6)")
                .html(data[i].ejbq)
            )
            .append(
              $("<div/>")
                .addClass("tab-td")
                .css("width", "calc((100% - 40px) / 6)")
                .html(data[i].sanjbq)
            )
            .append(
              $("<div/>")
                .addClass("tab-td")
                .css("width", "calc((100% - 40px) / 6)")
                .html(data[i].sijbq)
            )
            .append(
              $("<div/>")
                .addClass("tab-td")
                .css("width", "calc((100% - 40px) / 6)")
                .html(data[i].jdl)
            )
            .append(
              $("<div/>")
                .addClass("tab-td")
                .css("width", "calc((100% - 40px) / 6)")
                .html(data[i].yzl)
            );
          $("#tab-container").append($tabData);
        }
        break;
    }
    $("#head-" + sortCol + ">i")
      .removeClass("glyphicon-sort-by-order-alt")
      .removeClass("glyphicon-sort-by-order");
    var newClass =
      order == "asc"
        ? "glyphicon-sort-by-order"
        : "glyphicon-sort-by-order-alt";
    $("#head-" + sortCol + ">i").addClass(newClass);
  };

  // 创建下拉框列表
  var createSelectDom = function($selector, data) {
    if (data.checked) {
      $selector.append(
        $('<div class="tag-col"/>')
          .append("<span>" + data.name + "</span>")
          .append('<i class="glyphicon glyphicon-ok"></i>')
      );
    } else {
      $selector.append(
        $('<div class="tag-col"/>')
          .append("<span>" + data.name + "</span>")
          .append('<i class="glyphicon"></i>')
      );
    }
  };

  // 监听表头logo点击事件
  $("#tab-container").on("click", ".tab-td>i", function() {
    var $tabTd = $(this).parent();
    var $tagSelector = $(".tag-selector");
    var tabId = $tabTd.attr("id");
    var top = $tabTd[0].offsetTop;
    var left = $tabTd[0].offsetLeft;
    var width = $tabTd.outerWidth();
    var height = $tabTd.outerHeight();
    var tagArr1 = ["head-ywlx", "head-ejbq", "head-sanjbq", "head-dw"];
    if (tagArr1.indexOf(tabId) == -1) {
      var isDesc = $(this).hasClass("glyphicon-sort-by-order-alt");
      searchRuler.sortCol = tabId.substring(5);
      searchRuler.order = isDesc ? "asc" : "desc";
      // 发请求
      loadTab();
    } else {
      var index = 0;
      switch (tabId) {
        case "head-ywlx":
          index = searchRuler.mold == 3 ? 1 : 0;
          break;
        case "head-ejbq":
          index = 1;
          break;
        case "head-sanjbq":
          index = 2;
          break;
        case "head-dw":
          index = 0;
          break;
      }
      if ($tagSelector.eq(index).css("display") == "block") {
        $tagSelector.eq(index).css("display", "none");
      } else {
        $tagSelector.css("display", "none");
        if (index != 0) {
          getTags(index, searchRuler.tags);
        }
        for (var i = index + 1; i < 3; i++) {
          searchRuler.tags[i] = [];
          tagArr[i] = [];
        }
        $tagSelector.eq(index).css("display", "block");
        $tagSelector.eq(index).css("top", top + height);
        $tagSelector.eq(index).css("left", left);
        $tagSelector.eq(index).css("width", width);
        $tagSelector.eq(index).empty();
        for (var i = 0; i < tagArr[index].length; i++) {
          createSelectDom($tagSelector.eq(index), tagArr[index][i]);
        }
      }
    }
  });

  // 全局查询方法
  var searchFunc = function() {
    $(".left-panel-header-tab").removeClass("left-panel-header-tab-hover");
    $(".left-panel-header-tab")
      .eq(0)
      .addClass("left-panel-header-tab-hover");
    searchRuler.deptId = $("#placeCode").val();
    searchRuler.date = $("#date-input").val();
    // 获取一级标签
    getTags(0);
    // 加载右侧数据
    loadRightList();
    // 加载左侧数据
    loadTab();
  };

  // 监听数据行下拉事件
  $("#display-num").change(function() {
    searchRuler.pageSize = $("#display-num option:selected").text();
    loadTab();
  });

  // 监听tr左键点击事件
  $("#tab-container").on("click", ".tab-tr", function() {
    var $input = $(this).find(".checkbox-group");
    var id = $(this).attr("id");
    if ($input.prop("checked")) {
      $(this).removeClass("tab-tr-hover");
      $(this)
        .find(".checkbox-group")
        .prop("checked", false);
      var index;
      for (var i = 0; i < rightData.length; i++) {
        if (rightData[i].id == id) {
          index = "" + i;
          break;
        }
      }
      if (index) {
        rightData.splice(index, 1);
      }
    } else {
      $(this).addClass("tab-tr-hover");
      $(this)
        .find(".checkbox-group")
        .prop("checked", true);
      var obj = {};
      obj.mold = searchRuler.mold;
      obj.id = id;
      switch (obj.mold) {
        case 5:
          break;
        case 4:
          break;
        case 3:
          obj.content = $(this)
            .find(".tab-td")
            .eq(2)
            .html();
          break;
        case 2:
          obj.content = $(this)
            .find(".tab-td")
            .eq(1)
            .html();
          break;
        default:
          obj.content = $(this)
            .find(".tab-td")
            .eq(3)
            .html();
          break;
      }
      rightData.push(obj);
    }
    loadRightListDom();
    var flag = true;
    for (var i = 0; i < $(".checkbox-group").length; i++) {
      var checked = $(".checkbox-group")
        .eq(i)
        .prop("checked");
      if (!checked) {
        flag = false;
        break;
      }
    }
    $("#check-all").prop("checked", flag);
  });

  // 解绑checkbox点击事件
  $("#tab-container").on("click", ".checkbox-group", function(e) {
    e.stopPropagation();
    var $input = $(this);
    var $tr = $(this)
      .parent()
      .parent();
    var id = $tr.attr("id");
    if (!$input.prop("checked")) {
      $tr.removeClass("tab-tr-hover");
      $input.prop("checked", false);
      var index;
      for (var i = 0; i < rightData.length; i++) {
        if (rightData[i].id == id) {
          index = "" + i;
          break;
        }
      }
      if (index) {
        rightData.splice(index, 1);
      }
    } else {
      $tr.addClass("tab-tr-hover");
      $input.prop("checked", true);
      var obj = {};
      obj.mold = searchRuler.mold;
      obj.id = id;
      switch (obj.mold) {
        case 5:
        case 4:
        case 3:
          obj.content = $tr
            .find(".tab-td")
            .eq(2)
            .html();
          break;
        case 2:
          obj.content = $tr
            .find(".tab-td")
            .eq(1)
            .html();
          break;
        default:
          obj.content = $tr
            .find(".tab-td")
            .eq(3)
            .html();
          break;
      }
      rightData.push(obj);
    }
    loadRightListDom();
    var flag = true;
    for (var i = 0; i < $(".checkbox-group").length; i++) {
      var checked = $(".checkbox-group")
        .eq(i)
        .prop("checked");
      if (!checked) {
        flag = false;
        break;
      }
    }
    $("#check-all").prop("checked", flag);
  });

  // 监听全选事件
  $("#tab-container").on("click", "#check-all", function() {
    var checked = $(this).prop("checked");
    if (checked) {
      for (var i = 0; i < $(".tab-tr").length; i++) {
        var id = $(".tab-tr")
          .eq(i)
          .attr("id");
        var isExist = false;
        for (var j = 0; j < rightData.length; j++) {
          if (id == rightData[j].id) {
            isExist = true;
            break;
          }
        }
        if (!isExist) {
          var obj = {};
          obj.id = id;
          obj.mold = searchRuler.mold;
          switch (obj.mold) {
            case 5:
              break;
            case 4:
              break;
            case 3:
              obj.content = $(".tab-tr")
                .eq(i)
                .find(".tab-td")
                .eq(2)
                .html();
              break;
            case 2:
              obj.content = $(".tab-tr")
                .eq(i)
                .find(".tab-td")
                .eq(1)
                .html();
              break;
            default:
              obj.content = $(".tab-tr")
                .eq(i)
                .find(".tab-td")
                .eq(3)
                .html();
              break;
          }
          rightData.push(obj);
        }
      }
      $(".tab-tr").removeClass("tab-tr-hover");
      $(".tab-tr").addClass("tab-tr-hover");
    } else {
      for (var i = 0; i < $(".tab-tr-hover").length; i++) {
        var id = $(".tab-tr-hover")
          .eq(i)
          .attr("id");
        for (var j = 0; j < rightData.length; j++) {
          if (id == rightData[j].id) {
            rightData.splice(j, 1);
          }
        }
      }
      $(".tab-tr").removeClass("tab-tr-hover");
    }
    $(".checkbox-group").prop("checked", checked);
    loadRightListDom();
  });

  // 监听下拉框选取事件
  $(".tag-selector").on("click", ".tag-col", function() {
    var isChecked = $(this)
      .find("i")
      .hasClass("glyphicon-ok");
    if (!($(".glyphicon-ok").length == 1 && isChecked)) {
      // selector的索引
      var index = $(this)
        .parent()
        .index(".tag-selector");
      var tags = tagArrCondition[index];
      var tagName = $(this)
        .find("span")
        .html();
      if (isChecked) {
        $(this)
          .find("i")
          .removeClass("glyphicon-ok");
        tags.splice(tags.indexOf(tagName), 1);
        for (var i = 0; i < tagArr[index].length; i++) {
          if (tagArr[index][i].name == tagName) {
            tagArr[index][i].checked = false;
          }
        }
      } else {
        $(this)
          .find("i")
          .addClass("glyphicon-ok");
        tags.push(tagName);
        for (var i = 0; i < tagArr[index].length; i++) {
          if (tagArr[index][i].name == tagName) {
            tagArr[index][i].checked = true;
          }
        }
      }
      loadTab();
    }
  });

  // 监听右侧数据删除按钮
  $(".right-panel-body").on("click", ".right-panel-li>img", function() {
    var id = $(this)
      .parent()
      .attr("id")
      .substring(6);
    for (var i = 0; i < rightData.length; i++) {
      if (id == rightData[i].id) {
        rightData.splice(i, 1);
      }
    }
    loadRightListDom();
    loadTab();
  });

  // 加载右侧list
  var loadRightList = function() {
    var condition = {
      deptId: searchRuler.deptId,
      date: searchRuler.date,
      timestamp: new Date()
    };
    searchRuler.timestamp = condition.timestamp;
    sugon.requestJson(
      {
        url: sugon.interFaces.rdwt.getRightList,
        type: "post",
        data: condition
      },
      function(result) {
        // 加载右侧数据到本地数组
        if (!sugon.isPublished || searchRuler.timestamp == result.timestamp) {
          rightData = result.data;
          loadRightListDom();
        }
      }
    );
  };

  // 重载右侧Dom
  var loadRightListDom = function() {
    $(".right-panel-body").empty();
    for (var i = 0; i < rightData.length; i++) {
      var moldName;
      switch (rightData[i].mold) {
        case "5":
          moldName = "模型五";
          break;
        case "4":
          moldName = "模型四";
          break;
        case "3":
          moldName = "模型三";
          break;
        case "2":
          moldName = "模型二";
          break;
        default:
          moldName = "模型一";
          break;
      }
      $(".right-panel-body").append(
        $("<div/>")
          .addClass("right-panel-li")
          .attr("id", "right-" + rightData[i].id)
          .attr("mold", rightData[i].mold)
          .append(
            $("<span/>")
              .css("width", "60%")
              .html(i + 1 + "、" + rightData[i].content)
          )
          .append($("<img/>").attr("src", "../../img/myhc/rdwt/delete.png"))
          .append(
            $("<span/>")
              .css("float", "right")
              .css("margin-right", "20px")
              .html(moldName)
          )
      );
    }
  };

  // 重载弹出框list
  var loadPopListDom = function() {
    $(".pop-body").empty();
    for (var i = 0; i < popData.length; i++) {
      $(".pop-body").append(
        $("<div/>")
          .addClass("pop-body-li")
          .attr("id", "pop-" + popData[i].id)
          .attr("mold", popData[i].mold)
          .append($("<span/>").html(i + 1 + "、" + popData[i].content))
          .append(
            $("<img/>")
              .addClass("li-top")
              .attr("src", "../../img/myhc/rdwt/top.png")
          )
          .append(
            $("<img/>")
              .addClass("li-edit")
              .attr("src", "../../img/myhc/rdwt/edit.png")
          )
      );
    }
  };

  // 导航切换事件
  var switchNav = function() {
    var mold = $(this).index(".left-panel-header-tab") + 1;
    searchRuler.mold = mold;
    searchRuler.timestamp = new Date();
    searchRuler.pageSize = 20;
    $(".left-panel-header-tab").removeClass("left-panel-header-tab-hover");
    $(this).addClass("left-panel-header-tab-hover");
    $("#display-num").val("");
    $(".tag-selector").css("display", "none");
    getTags(0);
    loadTab(mold);
  };

  // 监听导航切换事件
  $(".left-panel-header-tab").click(switchNav);

  //监听查询按钮点击事件
  $(".search-btn").click(searchFunc);

  // 监听预览按钮点击事件
  $("#preview-btn").click(function() {
    $(".pop-cover").css("display", "block");
    $(".pop-container").css("display", "block");
    var condition = {
      deptId: searchRuler.deptId,
      date: searchRuler.date,
      timestamp: new Date(),
      data: JSON.stringify(rightData)
    };
    searchRuler.timestamp = condition.timestamp;
    sugon.requestJson(
      {
        url: sugon.interFaces.rdwt.getDetail,
        type: "post",
        data: condition
      },
      function(result) {
        if (!sugon.isPublished || searchRuler.timestamp == result.timestamp) {
          popData = result.data;
          loadPopListDom();
        }
      }
    );
  });

  // 监听预览页面关闭按钮
  $(".close-btn").click(function() {
    $(".pop-cover").hide();
    $(".pop-container").hide();
  });

  // 监听预览页面置顶按钮事件
  $(".pop-body").on("click", ".li-top", function() {
    var id = $(this)
      .parent()
      .attr("id")
      .substring(4);
    for (var i = 0; i < popData.length; i++) {
      var obj = popData[i];
      if (id == obj.id) {
        popData.splice(i, 1);
        popData.unshift(obj);
      }
    }
    loadPopListDom();
  });

  // 监听预览页面修改按钮事件
  $(".pop-body").on("click", ".li-edit", function() {
    var parent = $(this).parent();
    var text = parent.find("span").html();
    parent.empty();
    var index = text.indexOf("、");
    var num = text.substring(0, index + 1);
    var content = text.substring(index + 1);
    parent
      .append($("<span/>").html(num))
      .append($('<input type="text"/>').val(content));
    // 自动聚焦
    parent.find("input").focus();
  });

  // 监听预览页面input的enter键事件
  $(".pop-body").on("keyup", ".pop-body-li>input", function(e) {
    if (e.keyCode == 13) {
      var id = $(this)
        .parent()
        .attr("id")
        .substring(4);
      for (var i = 0; i < popData.length; i++) {
        if (id == popData[i].id) {
          popData[i].content = $(this).val();
          break;
        }
      }
      loadPopListDom();
    }
  });

  // 监听预览页面input失去焦点事件
  $(".pop-body").on("blur", ".pop-body-li>input", function() {
    var id = $(this)
      .parent()
      .attr("id")
      .substring(4);
    for (var i = 0; i < popData.length; i++) {
      if (id == popData[i].id) {
        popData[i].content = $(this).val();
        break;
      }
    }
    loadPopListDom();
  });

  // 监听发布按钮事件
  $("#pop-btn-ok").click(function() {
    var condition = {
      timestamp: new Date(),
      data: JSON.stringify(popData),
      deptId: searchRuler.deptId,
      date: searchRuler.date
    };
    searchRuler.timestamp = condition.timestamp;
    sugon.requestJson(
      {
        url: sugon.interFaces.rdwt.publish,
        type: "post",
        data: condition
      },
      function(result) {
        if (!sugon.isPublished || result.code == 200) {
          location.hash = vipspa.stringify("rdwt", {
            deptName: $("#place").val(),
            deptId: $("#placeCode").val(),
            date: $("#date-input").val()
          });
        }
      }
    );
  });

  // 页面入口
  $(function() {
    // 初始化查询栏
    initSearchBar();
    // 进来默认查询
    searchFunc();
  });
});
