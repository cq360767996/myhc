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
  // myjzType
  const myjzType = sugon.identityInfo.myjzType;
  let mold = null;
  var maxDate = sugon.getDate(-2);
  var minDate = sugon.getDate(-7);

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

  // 控制select隐藏显示
  function handleMoldDis() {
    let $deptName = $("#place");
    let $date1 = $("#date1");
    let $date2 = $("#date2");
    let $mold = $("#mold");
    let $leftTree = $("#left-tree");
    if (myjzType == 0) {
      $mold.show();
      $deptName.css("width", "calc(35% - 30px)");
      $date1.css("width", "calc(25% - 30px)");
      $date2.css("width", "calc(25% - 30px)");
      $leftTree.css({ "margin-left": "156px", width: $deptName.outerWidth() });
    } else {
      $mold.hide();
      $deptName.css("width", "calc(50% - 60px)");
      $date1.css("width", "calc(25% - 30px)");
      $date2.css("width", "calc(25% - 30px)");
      $leftTree.css({ "margin-left": "15px", width: $deptName.outerWidth() });
    }
  }

  // 加载热点问题数据
  function initRdwtList() {
    let params = {
      deptId: mold == 2 ? null : $("#placeCode").val(),
      date1: $("#date1").val(),
      date2: $("#date2").val()
    };
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

  // 加载单位树
  async function onLoad() {
    let $deptName = $("#place");
    let $deptId = $("#placeCode");
    let { deptId, role } = sugon.identityInfo;
    let result = await sugon.request(sugon.interFaces.common.getDeptTree, {
      deptId,
      role,
      type: mold
    });
    //渲染树
    $("#left-tree").treeview({
      data: result.data,
      levels: 1,
      onNodeSelected: function(event, node) {
        $deptName.val(node.text);
        $deptId.val(node.id);
        $("#left-tree").css("visibility", "hidden");
      },
      showCheckbox: false //是否显示多选
    });
    $deptName.val(result.data[0].text);
    $deptId.val(result.data[0].id);
  }

  function getList2(code, time1, time2, type) {
    sugon.requestJson(
      {
        type: "POST",
        url: sugon.interFaces.myhc.myjz.bmList,
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
  }

  function getList(code, time1, time2, type) {
    sugon.requestJson(
      {
        type: "POST",
        url: sugon.interFaces.myhc.myjz.List,
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
  }

  // 初始化列表
  function initList(deptId, date1, date2) {
    let $list1 = $(".list");
    let $list2 = $(".list2");
    if (mold == 1) {
      $list1.show();
      $list2.hide();
      getList(deptId, date1, date2, mold);
    } else {
      $list1.hide();
      $list2.show();
      getList2(deptId, date1, date2, mold);
    }
  }

  async function initPage() {
    handleMoldDis();
    mold = myjzType == 0 ? 1 : myjzType;
    await onLoad();
    let deptId = $("#placeCode").val();
    let date1 = $("#date1").val();
    let date2 = $("#date2").val();
    initList(deptId, minDate, maxDate);
    setCenterHeight();
    sugon.initRightMenu({
      deptId,
      date1,
      date2,
      mold
    });
  }
  //页面入口
  initPage();
  function setCenterHeight() {
    var height = $(window).height();
    var centerHight = height - 240;
    $(".right_centent")
      .height(centerHight)
      .css("overflow", "auto");
  }

  // 如果type为0的话，绑定改变事件
  if (myjzType == 0) {
    $("#mold").on("change", e => {
      mold = $(e.target).val();
      onLoad();
    });
  }

  $("#check").bind("click", function() {
    let deptId = $("#placeCode").val();
    let date1 = $("#date1").val();
    let date2 = $("#date2").val();
    mold = myjzType == 0 ? mold : myjzType;
    initList(deptId, date1, date2);
    initRdwtList();
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
