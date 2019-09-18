/* Created by handsome qiu */
requirejs(["common"], function(sugon) {
  // 查询尺度
  var searchRuler = {};

  // 行高
  var lineHeight = {};

  // 初始化查询状态栏
  var initSearchBar = function() {
    var date1 = sugon.getDate(-13);
    var date2 = sugon.getDate(-1);
    var $popDate1 = $("#pop-date1");
    var $popDate2 = $("#pop-date2");
    $popDate1.val(date1);
    $popDate2.val(date2);
    searchRuler.date1 = date1;
    searchRuler.date2 = date2;
    searchRuler.type = 0;
    $("#pop-date1").datetimepicker({
      format: "yyyy-mm",
      autoclose: true,
      todayBtn: true,
      startView: "year",
      minView: "year",
      maxView: "decade",
      endDate: date2,
      language: "zh-CN"
    });

    $("#pop-date2").datetimepicker({
      format: "yyyy-mm",
      autoclose: true,
      todayBtn: true,
      startView: "year",
      minView: "year",
      maxView: "decade",
      endDate: date2,
      language: "zh-CN"
    });
  };

  // 获取行高
  var getLineHeight = function() {
    lineHeight.all = $(".pop-body-col-body > div").css("height");
    lineHeight.half = parseFloat(lineHeight.all) / 2 + "px";
  };

  // 获取接处警数据
  var getData = function(col) {
    var condition = {
      type: searchRuler.type,
      position: col,
      date1: searchRuler.date1,
      date2: searchRuler.date2
    };
    if (searchRuler.ckfwType || searchRuler.ckfwType == 0) {
      condition.ckfwType = searchRuler.ckfwType;
    }
    var ajaxObj = {
      type: "post",
      async: true,
      data: condition
    };
    switch (col) {
      case 0:
        ajaxObj.url = sugon.interFaces.rdwt.getJcj;
        break;
      case 1:
        ajaxObj.url = sugon.interFaces.rdwt.getCkfw;
        break;
      case 2:
        ajaxObj.url = sugon.interFaces.rdwt.getAj;
        break;
      case 3:
        ajaxObj.url = sugon.interFaces.rdwt.getMjsxl;
        break;
    }
    sugon.requestJson(ajaxObj, function(result) {
      var data = result.data;
      var $body = $(".pop-body-col-body").eq(col);
      $body.empty();
      for (var i = 0; i < data.length; i++) {
        if (col < 3) {
          $body.append(renderFrontDom(data[i], i, searchRuler.type, col));
        } else {
          $body.append(renderLastDom(data[i], i, searchRuler.type));
        }
      }
      if (condition.type == 0) {
        // 设置字体颜色
        $("strong").addClass("red-strong");
      } else {
        // 设置字体颜色
        $("strong").addClass("green-strong");
      }
    });
  };

  // 渲染前三列的dom
  var renderFrontDom = function(obj, index, type, col) {
    var $div = $("<div/>");
    if (type == 0) {
      if (index < 3) {
        $div.append(
          '<div class="row-left" style="line-height: ' +
            lineHeight.all +
            ';"><div class="logo4">' +
            (index + 1) +
            "</div><div>" +
            obj.name +
            "</div></div>"
        );
      } else {
        $div.append(
          '<div class="row-left" style="line-height: ' +
            lineHeight.all +
            ';"><div>' +
            (index + 1) +
            "</div><div>" +
            obj.name +
            "</div></div>"
        );
      }
      var colStr, leftStr, rightStr;
      switch (col) {
        case 0:
          colStr = "满意度";
          leftStr = "业务量";
          rightStr = "次";
          break;
        case 1:
          colStr = "满意度";
          leftStr = "业务量";
          rightStr = "次";
          break;
        case 2:
          colStr = "规范度";
          leftStr = "业务量";
          rightStr = "次";
          break;
      }
      $div.append(
        '<div class="row-right" style="line-height: ' +
          lineHeight.half +
          ';"><div>' +
          colStr +
          "<strong>" +
          obj.value +
          "</strong>&nbsp;&nbsp;&nbsp;" +
          leftStr +
          "<strong>" +
          obj.ywl +
          "</strong>" +
          rightStr +
          "</div><div>" +
          obj.dw +
          "</div></div>"
      );
    } else {
      switch (index) {
        case 0:
          $div.append(
            '<div class="row-left" style="line-height: ' +
              lineHeight.all +
              ';"><div class="logo1">' +
              (index + 1) +
              "</div><div>" +
              obj.name +
              "</div></div>"
          );
          break;
        case 1:
          $div.append(
            '<div class="row-left" style="line-height: ' +
              lineHeight.all +
              ';"><div class="logo2">' +
              (index + 1) +
              "</div><div>" +
              obj.name +
              "</div></div>"
          );
          break;
        case 2:
          $div.append(
            '<div class="row-left" style="line-height: ' +
              lineHeight.all +
              ';"><div class="logo3">' +
              (index + 1) +
              "</div><div>" +
              obj.name +
              "</div></div>"
          );
          break;
        default:
          $div.append(
            '<div class="row-left" style="line-height: ' +
              lineHeight.all +
              ';"><div>' +
              (index + 1) +
              "</div><div>" +
              obj.name +
              "</div></div>"
          );
          break;
      }
      if (col < 2) {
        $div.append(
          '<div class="row-right" style="line-height: ' +
            lineHeight.half +
            ';"><div>满意度<strong>' +
            obj.value +
            "</strong>&nbsp;&nbsp;&nbsp;业务量<strong>" +
            obj.ywl +
            "</strong>次</div><div>" +
            obj.dw +
            "</div></div>"
        );
      } else {
        $div.append(
          '<div class="row-right" style="line-height: ' +
            lineHeight.half +
            ';"><div>规范度<strong>' +
            obj.value +
            "</strong>&nbsp;&nbsp;&nbsp;业务量<strong>" +
            obj.ywl +
            "</strong>次</div><div>" +
            obj.dw +
            "</div></div>"
        );
      }
    }
    return $div;
  };

  // 渲染最后一列的dom
  var renderLastDom = function(obj, index, type) {
    var $div = $("<div/>");
    if (type == 0) {
      if (index < 3) {
        $div.append(
          '<div class="row-col row-col1 logo4" style="line-height: ' +
            lineHeight.all +
            ';">' +
            (index + 1) +
            '</div><div class="row-col row-col2" style="line-height: ' +
            lineHeight.half +
            ';"><div>' +
            obj.name +
            "</div><div>" +
            obj.dw +
            '</div></div><div class="row-col row-col3" style="line-height: ' +
            lineHeight.all +
            ';"><strong>' +
            obj.value +
            "</strong>" +
            "</div>"
        );
      } else {
        $div.append(
          '<div class="row-col row-col1" style="line-height: ' +
            lineHeight.all +
            ';">' +
            (index + 1) +
            '</div><div class="row-col row-col2" style="line-height: ' +
            lineHeight.half +
            ';"><div>' +
            obj.name +
            "</div><div>" +
            obj.dw +
            '</div></div><div class="row-col row-col3" style="line-height: ' +
            lineHeight.all +
            ';"><strong>' +
            obj.value +
            "</strong>" +
            "</div>"
        );
      }
    } else {
      switch (index) {
        case 0:
          $div.append(
            '<div class="row-col row-col1 logo1" style="line-height: ' +
              lineHeight.all +
              ';">' +
              (index + 1) +
              '</div><div class="row-col row-col2" style="line-height: ' +
              lineHeight.half +
              ';"><div>' +
              obj.name +
              "</div><div>" +
              obj.dw +
              '</div></div><div class="row-col row-col3" style="line-height: ' +
              lineHeight.all +
              ';"><strong>' +
              obj.value +
              "</strong>" +
              "</div>"
          );
          break;
        case 1:
          $div.append(
            '<div class="row-col row-col1 logo2" style="line-height: ' +
              lineHeight.all +
              ';">' +
              (index + 1) +
              '</div><div class="row-col row-col2" style="line-height: ' +
              lineHeight.half +
              ';"><div>' +
              obj.name +
              "</div><div>" +
              obj.dw +
              '</div></div><div class="row-col row-col3" style="line-height: ' +
              lineHeight.all +
              ';"><strong>' +
              obj.value +
              "</strong>" +
              "</div>"
          );
          break;
        case 2:
          $div.append(
            '<div class="row-col row-col1 logo3" style="line-height: ' +
              lineHeight.all +
              ';">' +
              (index + 1) +
              '</div><div class="row-col row-col2" style="line-height: ' +
              lineHeight.half +
              ';"><div>' +
              obj.name +
              "</div><div>" +
              obj.dw +
              '</div></div><div class="row-col row-col3" style="line-height: ' +
              lineHeight.all +
              ';"><strong>' +
              obj.value +
              "</strong>" +
              "</div>"
          );
          break;
        default:
          $div.append(
            '<div class="row-col row-col1" style="line-height: ' +
              lineHeight.all +
              ';">' +
              (index + 1) +
              '</div><div class="row-col row-col2" style="line-height: ' +
              lineHeight.half +
              ';"><div>' +
              obj.name +
              "</div><div>" +
              obj.dw +
              '</div></div><div class="row-col row-col3" style="line-height: ' +
              lineHeight.all +
              ';"><strong>' +
              obj.value +
              "</strong>" +
              "</div>"
          );
          break;
      }
    }
    return $div;
  };

  // 初始化数据
  var initData = function() {
    // 获取数据
    for (var i = 0; i < 4; i++) {
      getData(i);
    }
  };

  $(function() {
    // 初始化行高
    getLineHeight();
    // 初始化查询状态栏
    initSearchBar();
    searchRuler.ckfwType = 0;
    // 初始化数据
    initData();
  });

  // 关闭按钮事件监听
  $(".pop-header > i").click(function() {
    $(".pop-panel").hide();
  });

  // 切换事件监听
  $(".pop-switch > div").click(function() {
    var $this = $(this);
    if (!$this.hasClass("pop-switch-hover")) {
      var $div = $(".pop-switch > div");
      $div.removeAttr("class");
      $this.addClass("pop-switch-hover");
      var index = $this.index();
      if (index == 0) {
        $this.addClass("pop-switch-first");
        $(".pop-header").css(
          "background",
          'url("../../img/myhc/rdwt/mybd/title_bad.png") no-repeat center center'
        );
      } else {
        $this.addClass("pop-switch-last");
        $(".pop-header").css(
          "background",
          'url("../../img/myhc/rdwt/mybd/title_good.png") no-repeat center center'
        );
      }
      searchRuler.type = index;
      initData();
    }
  });

  // 下拉框改变事件
  $(".pop-body-col-header > select").change(function() {
    searchRuler.ckfwType = $(this).val();
    getData(1);
  });

  // 监听查询按钮事件
  $(".pop-date-group > img").click(function() {
    searchRuler.date1 = $("#pop-date1").val();
    searchRuler.date2 = $("#pop-date2").val();
    initData();
  });
});
