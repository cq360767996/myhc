define(["common"], sugon => {
  return {
    renderPopup(id, myd, type, $dom) {
      $(".window2").css("display", "block");
      $(".close-btn")
        .off()
        .on("click", function() {
          $(".window2").css("display", "none");
        });
      sugon
        .request(sugon.interFaces.myhc.myys.PopDetail, { id, myd, type })
        .then(result => {
          $dom.empty();
          switch (type) {
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
                arr[1] = ["警情类别", "jqlb", "得分", "df", "处警结果", "cjjg"];
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
                arr[1] = ["联系姓名", "lxxm", "性别", "xb", "身份证号", "sfzh"];
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
                arr[1] = ["联系姓名", "lxxm", "性别", "xb", "身份证号", "sfzh"];
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
              arr[6] = ["报案人", "bar", "性别", "xb", "联系方式", "lxfs"];
              arr[7] = ["发送状态", "fszt", "分配工单", "fpgd", "2"];
              arr[8] = ["作废标记", "zfbj", "得分", "df", "2"];
              arr[9] = ["回复内容", "hfnr"];
              arr[10] = ["回访内容", "dhhf"];
              break;
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
              arr[1] = ["事故地点", "sgdd", "受伤人数", "ssrs", "1"];
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
              arr[5] = ["发送状态", "fszt", "分配工单", "fpgd", "2"];
              arr[6] = ["作废标记", "zfbj", "得分", "df", "2"];
              arr[7] = ["回复内容", "hfnr"];
              arr[8] = ["回访内容", "dhhf"];
              break;
            case "5":
              var arr = [];
              arr[0] = ["编号", "bh", "业务时间", "ywsj", "1"];
              arr[1] = ["姓名", "xm", "电话", "dh", "性别", "xb"];
              arr[2] = ["具体地址", "jtdz", "区域", "qy", "1"];
              arr[3] = ["诉求目的", "sqmd", "诉求类型", "sqlx", "1"];
              arr[4] = ["归口类型", "gklx", "诉求来源", "sqly", "1"];
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
            $dom.append(this.getCol(arr[i]));
          }
          for (var key in result) {
            if (key == "df") {
              var str = "";
              switch (result[key]) {
                case "1":
                  str = '<span style="color: red;">1</span>/0.7/0.6/0';
                  break;
                case "0.7":
                  str = '1/<span style="color: red;">0.7</span>/0.6/0';
                  break;
                case "0.6":
                  str = '1/0.7/<span style="color: red;">0.6</span>/0';
                  break;
                case "0":
                  str = '1/0.7/0.6/<span style="color: red;">0</span>';
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
        });
    },
    getCol(arr) {
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
    }
  };
});
