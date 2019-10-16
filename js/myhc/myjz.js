var myChart1,
  myChart2,
  myChart3,
  myChart4,
  Chart1,
  Chart2,
  Chart3,
  Chart4,
  Chart5,
  Chart6,
  Chart7,
  Chart8,
  Chart9,
  Chart10;
requirejs(["common"], function(sugon) {
  var tData = [];
  var maxDate = sugon.getDate(-2);
  var minDate = sugon.getDate(-7);
  $("#left-tree").css("width", $("#place").css("width"));

  $("#place").bind("click", function() {
    $("#left-tree").css("visibility", "visible");
  });

  $("#date1")
    .datetimepicker({
      format: "yyyy-mm",
      autoclose: true,
      todayBtn: true,
      startView: "year",
      minView: "year",
      maxView: "decade",
      endDate: maxDate,
      language: "zh-CN"
    })
    .on("changeDate", function(e) {
      $("#left-tree").css("visibility", "hidden");
    });

  $("#date2")
    .datetimepicker({
      format: "yyyy-mm",
      autoclose: true,
      todayBtn: true,
      startView: "year",
      minView: "year",
      maxView: "decade",
      endDate: maxDate,
      language: "zh-CN"
    })
    .on("changeDate", function(e) {
      $("#left-tree").css("visibility", "hidden");
    });

  $("#date1").val(minDate);
  $("#date2").val(maxDate);

  $("#mold").change(function() {
    $("#left-tree").css("visibility", "hidden");
    onLoad($(this).val());
    if ($(this).val() == "1") {
      $("#check")
        .unbind()
        .bind("click", function() {
          getList(
            $("#placeCode").val(),
            $("#date1").val(),
            $("#date2").val(),
            $("#mold").val()
          );
        });
      $(".list").css("display", "block");
      $(".list2").css("display", "none");
      getList(
        $("#placeCode").val(),
        $("#date1").val(),
        $("#date2").val(),
        $("#mold").val()
      );
    } else {
      $("#check")
        .unbind()
        .bind("click", function() {
          getList2(
            $("#placeCode").val(),
            $("#date1").val(),
            $("#date2").val(),
            $("#mold").val()
          );
        });
      $(".list").css("display", "none");
      $(".list2").css("display", "block");
      getList2(
        $("#placeCode").val(),
        $("#date1").val(),
        $("#date2").val(),
        $("#mold").val()
      );
    }
  });

  function onLoad(type) {
    //渲染树
    $("#left-tree").treeview({
      data: getTree(type, false),
      levels: 1,
      onNodeSelected: function(event, node) {
        $("#place").val(node.text);
        $("#placeCode").val(node.id);
        $("#left-tree").css("visibility", "hidden");
        if (type == 2) {
          getList2(
            $("#placeCode").val(),
            $("#date1").val(),
            $("#date2").val(),
            $("#mold").val()
          );
        }
      },
      showCheckbox: false //是否显示多选
    });

    $("#place").val(tData[0].text);
    $("#placeCode").val(tData[0].id);
  }

  //获取树数据
  function getTree(type, isAsync) {
    var treeData = [];

    sugon.requestJson(
      {
        type: "POST",
        url: sugon.interFaces.myjz.Tree,
        data: { type: type },
        async: isAsync
      },
      function(result) {
        treeData = result.data;
        tData = treeData;
      }
    );

    return treeData;
  }

  $("#gotoMap").bind("click", function() {
    location.hash = vipspa.stringify("myzs", { type: "myzs" });
  });

  var getList2 = function(code, time1, time2, type) {
    sugon.requestJson(
      {
        type: "POST",
        url: sugon.interFaces.myjz.bmList,
        data: { code: code, time1: time1, time2: time2, type: type },
        async: false
      },
      function(result) {
        var temp = "";
        if (result.type == "1") {
          temp = "jjdd"; //交通警察支队
        } else if (result.type == "2") {
          temp = "fzbm"; //法制部门
        } else if (result.type == "3") {
          temp = "center"; //出入境管理、刑事警察、治安管理、经侦支队、指挥中心
        } else if (result.type == "4") {
          temp = "rkgl"; //人口管理
        } else if (result.type == "5") {
          temp = "clgl"; //车辆管理
        } else if (result.type == "6") {
          temp = "gsgl"; //高速公路
        } else if (result.type == "7") {
          temp = "jczd";
        }
        requirejs(
          ["text!../views/myhc/" + temp + ".html", "myhc/" + temp],
          function(ele, fc) {
            fc(result, ele);
          }
        );
      }
    );
  };

  var getList = function(code, time1, time2, type) {
    sugon.requestJson(
      {
        type: "POST",
        url: sugon.interFaces.myjz.List,
        data: { code: code, time1: time1, time2: time2, type: type },
        async: false
      },
      function(result) {
        $(".list").empty();
        for (var i = 0; i < result.data.length; i++) {
          var tempClass = "one";
          if (i % 2 == 1) {
            tempClass = "two";
          }
          var tempClass1 = "splitLine" + " color_bg_" + result.data[i].type;
          var tempClass2 = "num" + " color" + result.data[i].type;
          var tempClass3 = "type" + " color_bg_" + result.data[i].type;
          var tempClass4 = "",
            tempClass5 = "",
            hbImg = "",
            tbImg = "";
          var v3 = Math.abs(result.data[i].value3).toFixed(2) + "%";
          var hbSpan = "";
          var tbSpan = "";
          if (result.data[i].value3) {
            if (parseFloat(result.data[i].value3) < 0) {
              tempClass4 = "percent " + "r";
              hbImg = "../../img/myhc/decrease.png";
            } else if (parseFloat(result.data[i].value3) > 0) {
              tempClass4 = "percent " + "g";
              hbImg = "../../img/myhc/increase.png";
            } else {
              tempClass4 = "percent " + "y";
              hbImg = "../../img/myhc/hold.png";
            }
            hbSpan = "<img src=" + hbImg + " />";
          } else {
            v3 = "--";
          }
          var v4 = Math.abs(result.data[i].value2).toFixed(2) + "%";
          if (result.data[i].value2) {
            if (parseFloat(result.data[i].value2) < 0) {
              tempClass5 = "percent " + "r";
              tbImg = "../../img/myhc/decrease.png";
            } else if (parseFloat(result.data[i].value2) > 0) {
              tempClass5 = "percent " + "g";
              tbImg = "../../img/myhc/increase.png";
            } else {
              tempClass5 = "percent " + "y";
              tbImg = "../../img/myhc/hold.png";
            }
            tbSpan = "<img src=" + tbImg + " />";
          } else {
            v4 = "--";
          }
          var typeName = result.data[i].name;
          var imgName = "";
          switch (typeName) {
            case "社会治安满意度":
              imgName = "one";
              break;
            case "公安队伍满意度":
              imgName = "two";
              break;
            case "社区民警熟悉率":
              imgName = "three";
              break;
            case "110接处警满意度":
              imgName = "five";
              break;
            case "12345满意度":
              imgName = "four";
              break;
            case "交通事故处理评价指数":
              imgName = "seven";
              break;
            case "案件办理评价指数":
              imgName = "six";
              break;
            case "窗口服务满意度":
              imgName = "eight";
              break;
            default:
              break;
          }
          var imgDiv =
            "<img class= 'imgClass' src='../../img/myhc/myjz/" +
            imgName +
            ".png'/>";

          $(".list").append(
            "<div id=" +
              result.data[i].id +
              " type=" +
              result.data[i].type +
              " class=" +
              tempClass +
              ">" +
              "<div class='list_content'>" +
              "<div class='title'>" +
              "<div class='name'><span class='" +
              tempClass1 +
              "'></span><span class='cName'>" +
              result.data[i].name +
              "</span></div>" +
              // "<div class='" + tempClass3 + "'>" + result.data[i].date + "</div>" +
              "</div>" +
              "<div class='val'>" +
              imgDiv +
              "<div class='" +
              tempClass2 +
              "'>" +
              result.data[i].value1 +
              "%</div>" +
              "<div class='compare'>" +
              "<div><span class='lab'>环比</span><span class='" +
              tempClass4 +
              "'>" +
              v3 +
              "</span><span>" +
              hbSpan +
              "</span></div>" +
              "<div><span class='lab'>同比</span><span class='" +
              tempClass5 +
              "'>" +
              v4 +
              "</span><span>" +
              tbSpan +
              "</span></div>" +
              "</div>" +
              "</div>" +
              "</div>" +
              "</div>"
          );
        }
      }
    );
  };

  if (sessionStorage.getItem("searchParams")) {
    var temp = JSON.parse(sessionStorage.getItem("searchParams"));
    onLoad(temp.mold);
    $("#mold").val(temp.mold);
    $("#place").val(temp.codeName);
    $("#placeCode").val(temp.code);
    sessionStorage.removeItem("searchParams");
    if (temp.mold == 1) {
      $("#mold").val(1);
      getList(temp.code, minDate, maxDate, 1);
    } else {
      getList2(temp.code, minDate, maxDate, 2);
      $(".list").css("display", "none");
      $(".list2").css("display", "block");
    }
  } else {
    if (sessionStorage.getItem("mapParams")) {
      var temp = JSON.parse(sessionStorage.getItem("mapParams"));
      onLoad(temp.mold);
      $("#mold").val(temp.mold);
      $("#place").val(temp.codeName);
      $("#placeCode").val(temp.code);
      if (temp.mold == 1) {
        $("#mold").val(1);
        getList(temp.code, minDate, maxDate, 1);
      } else {
        getList2(temp.code, minDate, maxDate, 2);
        $(".list").css("display", "none");
        $(".list2").css("display", "block");
      }
    } else {
      onLoad(1);
      $("#mold").val(1);
      getList(tData[0].id, minDate, maxDate, 1);
    }
  }
  //getList(tData[0].id, tempDate1, tempDate2, 1);

  setCenterHeight();

  function setCenterHeight() {
    var height = $(window).height();
    var centerHight = height - 240;
    $(".right_centent")
      .height(centerHight)
      .css("overflow", "auto");
  }

  $("#check").bind("click", function() {
    getList(
      $("#placeCode").val(),
      $("#date1").val(),
      $("#date2").val(),
      $("#mold").val()
    );
  });

  $(document).on("click", ".list>div", function() {
    $(".choose").removeClass("choose");

    var eleClass = $(this).attr("class") + " " + "choose";
    $(this).attr("class", eleClass);

    var tempHtml = "";
    var F = $(this)
      .find(".cName")
      .html();
    $("#tempID").val(this.id + "_" + F);
    $("#tempTYPE").val($(this).attr("type"));

    if (
      F == "社会治安满意度" ||
      F == "公安队伍满意度" ||
      F == "社区民警熟悉率" ||
      F == "12345满意度" ||
      F == "110接处警满意度"
    ) {
      tempHtml = "window1.html";
    } else if (F == "交通事故处理评价指数") {
      tempHtml = "window2.html";
    } else {
      tempHtml = "window3.html";
    }
    requirejs(["text!../views/myhc/" + tempHtml], function(ele) {
      $(".secondPannel").css("display", "block");
      $(".window").css("height", "78%");
      $("#left_chart").css("borderBottom", "2px solid #37618b");
      $("#right_chart").css("borderBottom", "2px solid #37618b");
      $(".window").css("visibility", "visible");
      $(".window").html(ele);
    });
  });

  sugon.initRightMenu({
    deptId: $("#placeCode").val(),
    date1: $("#date1").val(),
    date2: $("#date2").val()
  });

  /!*-----页面pannel内容区高度自适应 start-----*!/;
  $(window).resize(function() {
    setCenterHeight();
    $("#left-tree").css("width", $("#place").css("width"));
    if (myChart1) {
      myChart1.resize();
    }
    if (myChart2) {
      myChart2.resize();
    }
    if (myChart3) {
      myChart3.resize();
    }
    if (myChart4) {
      myChart4.resize();
    }
    if (Chart1) {
      Chart1.resize();
    }
    if (Chart2) {
      Chart2.resize();
    }
    if (Chart3) {
      Chart3.resize();
    }
    if (Chart4) {
      Chart4.resize();
    }
    if (Chart5) {
      Chart5.resize();
    }
    if (Chart6) {
      Chart6.resize();
    }
    if (Chart7) {
      Chart7.resize();
    }
    if (Chart8) {
      Chart8.resize();
    }
    if (Chart9) {
      Chart9.resize();
    }
    if (Chart10) {
      Chart10.resize();
    }
  });
});
