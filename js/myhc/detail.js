requirejs(["common"], function(sugon) {
  var titleName = "";
  var param = sugon.getUrlParam("id").split("_");

  $(".back").bind("click", function() {
    location.hash = vipspa.stringify("myys/ysxq", { txt: param[1] });
  });

  $(".close-btn").bind("click", function() {
    $(".window2").css("display", "none");
  });

  // 获取table行
  var getCol = function(arr) {
    var $tr = $("<tr></tr>").addClass("tab-tr");
    if (arr.length == 2) {
      var $tr = $("<tr></tr>").addClass("tab-tr");
      $tr
        .append(
          $("<td></td>")
            .addClass("tab-td")
            .addClass("tab-td-head")
            .html(arr[0])
        )
        .append(
          $("<td></td>")
            .addClass("tab-td")
            .attr("id", arr[1])
            .attr("colspan", "5")
        );
    } else if (arr.length == 6) {
      $tr
        .append(
          $("<td></td>")
            .addClass("tab-td")
            .addClass("tab-td-head")
            .html(arr[0])
        )
        .append(
          $("<td></td>")
            .addClass("tab-td")
            .attr("id", arr[1])
        )
        .append(
          $("<td></td>")
            .addClass("tab-td")
            .addClass("tab-td-head")
            .html(arr[2])
        )
        .append(
          $("<td></td>")
            .addClass("tab-td")
            .attr("id", arr[3])
        )
        .append(
          $("<td></td>")
            .addClass("tab-td")
            .addClass("tab-td-head")
            .html(arr[4])
        )
        .append(
          $("<td></td>")
            .addClass("tab-td")
            .attr("id", arr[5])
        );
    } else if (arr.length == 5) {
      if (arr[4] == 1) {
        $tr
          .append(
            $("<td></td>")
              .addClass("tab-td")
              .addClass("tab-td-head")
              .html(arr[0])
          )
          .append(
            $("<td></td>")
              .addClass("tab-td")
              .attr("id", arr[1])
              .attr("colspan", "3")
          )
          .append(
            $("<td></td>")
              .addClass("tab-td")
              .addClass("tab-td-head")
              .html(arr[2])
          )
          .append(
            $("<td></td>")
              .addClass("tab-td")
              .attr("id", arr[3])
          );
      } else if (arr[4] == 2) {
        $tr
          .append(
            $("<td></td>")
              .addClass("tab-td")
              .addClass("tab-td-head")
              .html(arr[0])
          )
          .append(
            $("<td></td>")
              .addClass("tab-td")
              .attr("id", arr[1])
          )
          .append(
            $("<td></td>")
              .addClass("tab-td")
              .addClass("tab-td-head")
              .html(arr[2])
          )
          .append(
            $("<td></td>")
              .addClass("tab-td")
              .attr("colspan", "3")
              .attr("id", arr[3])
          );
      }
    }
    return $tr;
  };

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
            "<div id=" +
              result.data3[i].value +
              ">" +
              result.data3[i].name +
              "</div>"
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
                  "<div class='cols'><span type=" +
                    result.data.data[i].type +
                    ">详情</span></div>"
                );
              }
              $(".cols").css("width", 100 / result.data.colums.length + "%");

              $(".cols>span")
                .unbind()
                .bind("click", function() {
                  //$(this).parent().parent()[0].id  titleName $(this).attr("type")
                  if ($(this).html() == "详情") {
                    $(".window2").css("display", "block");
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
                    var myd = "";
                    if (mydStr == "满意" || mydStr == "一般") {
                      myd = 1;
                    } else if (mydStr == "不满意") {
                      myd = 0;
                    }
                    sugon.requestJson(
                      {
                        type: "POST",
                        url: sugon.interFaces.myhc.myys.PopDetail,
                        data: { id: id, myd: myd, type: type },
                        async: false
                      },
                      function(result) {
                        $(".tab-container").empty();
                        switch (type) {
                          // case "110接处警信息" :
                          case "1":
                            if (myd == "1") {
                              var arr = [];
                              arr[0] = [
                                "接警编号",
                                "jjbh",
                                "处警人",
                                "cjr",
                                "处警单位",
                                "cjdw"
                              ];
                              arr[1] = [
                                "警情类别",
                                "jqlb",
                                "得分",
                                "df",
                                "处警结果",
                                "cjjg"
                              ];
                              arr[2] = [
                                "接警时间",
                                "jjsj",
                                "报警人",
                                "bjr",
                                "联系电话",
                                "lxdh"
                              ];
                              arr[3] = ["报警内容", "bjnr"];
                              arr[4] = ["事发地点", "sfdd"];
                              arr[5] = ["短信发送", "dxfs"];
                              arr[6] = ["短信回复", "dxhf"];
                            } else if (myd == "0") {
                              var arr = [];
                              arr[0] = [
                                "工单编号",
                                "gdbh",
                                "业务编码",
                                "ywbm",
                                "办理单位",
                                "bldw"
                              ];
                              arr[1] = [
                                "联系姓名",
                                "lxxm",
                                "性别",
                                "xb",
                                "身份证号",
                                "sfzh"
                              ];
                              arr[2] = [
                                "联系电话",
                                "lxdh",
                                "工单类别",
                                "gdlb",
                                "工单得分",
                                "gddf"
                              ];
                              arr[3] = [
                                "回访员签收人",
                                "hfyqsr",
                                "分局（警种）签收人",
                                "fjqsr",
                                "所队签收人",
                                "sdqsr"
                              ];
                              arr[4] = [
                                "接警时间",
                                "jjsj",
                                "处警人",
                                "cjr",
                                "警情类别",
                                "jqlb"
                              ];
                              arr[5] = ["所属中队", "sszd"];
                              arr[6] = ["报警内容", "bjnr"];
                              arr[7] = ["事发地点", "sfdd"];
                              arr[8] = ["短信发送", "dxfs"];
                              arr[9] = ["短信回复", "dxhf"];
                              arr[10] = ["回访内容", "hfnr"];
                            }
                            break;
                          // case "窗口服务信息" :
                          case "2":
                            if (myd == "1") {
                              var arr = [];
                              arr[0] = [
                                "业务编号",
                                "ywbh",
                                "身份证号",
                                "sfzh",
                                "业务类型",
                                "ywlx"
                              ];
                              arr[1] = [
                                "办理时间",
                                "blsj",
                                "联系姓名",
                                "lxxm",
                                "手机号码",
                                "sjhm"
                              ];
                              arr[2] = ["办理单位", "bldw", "得分", "df", "2"];
                              arr[3] = ["短信发送", "dxfs"];
                              arr[4] = ["短信回复", "dxhf"];
                            } else if (myd == "0") {
                              var arr = [];
                              arr[0] = [
                                "工单编号",
                                "gdbh",
                                "业务编码",
                                "ywbm",
                                "办理单位",
                                "bldw"
                              ];
                              arr[1] = [
                                "联系姓名",
                                "lxxm",
                                "性别",
                                "xb",
                                "身份证号",
                                "sfzh"
                              ];
                              arr[2] = [
                                "联系电话",
                                "lxdh",
                                "工单类别",
                                "gdlb",
                                "工单得分",
                                "gddf"
                              ];
                              arr[3] = [
                                "回访员签收人",
                                "hfyqsr",
                                "分局（警种）签收人",
                                "fjqsr",
                                "所队签收人",
                                "sdqsr"
                              ];
                              arr[4] = ["短信发送", "dxfs"];
                              arr[5] = ["短信回复", "dxhf"];
                              arr[6] = ["回访内容", "dhhf"];
                            }
                            break;
                          // case "案件信息" :
                          case "3":
                            var arr = [];
                            arr[0] = [
                              "案件编号",
                              "ajbh",
                              "案件名称",
                              "ajmc",
                              "业务类型",
                              "ywlx"
                            ];
                            arr[1] = ["案件地址", "ajdz"];
                            arr[2] = ["简要案情", "jyaq"];
                            arr[3] = [
                              "主办单位",
                              "zbdw",
                              "主办民警",
                              "zbmj",
                              "报案时间",
                              "basj"
                            ];
                            arr[4] = [
                              "受理时间",
                              "slsj",
                              "立案时间",
                              "lasj",
                              "业务时间",
                              "ywsj"
                            ];
                            arr[5] = [
                              "案件类别",
                              "ajlb",
                              "案件副案别",
                              "ajfab",
                              "案件状态",
                              "ajzt"
                            ];
                            arr[6] = [
                              "报案人",
                              "bar",
                              "性别",
                              "xb",
                              "联系方式",
                              "lxfs"
                            ];
                            arr[7] = [
                              "发送状态",
                              "fszt",
                              "分配工单",
                              "fpgd",
                              "2"
                            ];
                            arr[8] = ["作废标记", "zfbj", "得分", "df", "2"];
                            arr[9] = ["回复内容", "hfnr"];
                            arr[10] = ["回访内容", "dhhf"];
                            break;
                          // case "交通事故信息" :
                          case "4":
                            var arr = [];
                            arr[0] = [
                              "事故编号",
                              "sgbh",
                              "事故认定原因",
                              "sgrdyy",
                              "业务类型",
                              "ywlx"
                            ];
                            arr[1] = [
                              "事故地点",
                              "sgdd",
                              "受伤人数",
                              "ssrs",
                              "1"
                            ];
                            arr[2] = ["简要案情", "jyaq"];
                            arr[3] = [
                              "办案单位",
                              "badw",
                              "接案民警",
                              "jamj",
                              "财产损失",
                              "ccss"
                            ];
                            arr[4] = [
                              "事故发送时间",
                              "sgfssj",
                              "事故认定时间",
                              "sgrdsj",
                              "业务时间",
                              "ywsj"
                            ];
                            arr[5] = [
                              "发送状态",
                              "fszt",
                              "分配工单",
                              "fpgd",
                              "2"
                            ];
                            arr[6] = ["作废标记", "zfbj", "得分", "df", "2"];
                            arr[7] = ["回复内容", "hfnr"];
                            arr[8] = ["回访内容", "dhhf"];
                            break;
                          case "5":
                            var arr = [];
                            arr[0] = ["编号", "bh", "业务时间", "ywsj", "1"];
                            arr[1] = ["姓名", "xm", "电话", "dh", "性别", "xb"];
                            arr[2] = ["具体地址", "jtdz", "区域", "qy", "1"];
                            arr[3] = [
                              "诉求目的",
                              "sqmd",
                              "诉求类型",
                              "sqlx",
                              "1"
                            ];
                            arr[4] = [
                              "归口类型",
                              "gklx",
                              "诉求来源",
                              "sqly",
                              "1"
                            ];
                            arr[5] = [
                              "结果满意度",
                              "jgmyd",
                              "作风满意度",
                              "zfmyd",
                              "一次结果满意",
                              "ycjgmy"
                            ];
                            arr[6] = [
                              "诉求时间",
                              "sqsj",
                              "承办单位办结",
                              "cbdwbj",
                              "二级办理部门",
                              "ejblbm"
                            ];
                            arr[7] = ["诉求内容", "sqnr"];
                            arr[8] = ["答复脚本", "dfjb"];
                          default:
                            break;
                        }
                        for (var i = 0; i < arr.length; i++) {
                          $(".tab-container").append(getCol(arr[i]));
                        }
                        for (var key in result) {
                          if (key == "df") {
                            var str = "";
                            switch (result[key]) {
                              case "1":
                                str =
                                  '<span style="color: red;">1</span>/0.7/0.6/0';
                                break;
                              case "0.7":
                                str =
                                  '1/<span style="color: red;">0.7</span>/0.6/0';
                                break;
                              case "0.6":
                                str =
                                  '1/0.7/<span style="color: red;">0.6</span>/0';
                                break;
                              case "0":
                                str =
                                  '1/0.7/0.6/<span style="color: red;">0</span>';
                                break;
                              default:
                                str = "1/0.7/0.6/0";
                                break;
                            }
                            $("#" + key).html(str);
                          } else {
                            if (key === "ywbh") {
                              $("#" + key).attr("title", result[key]);
                            }
                            $("#" + key).html(result[key]);
                          }
                        }
                      }
                    );
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
