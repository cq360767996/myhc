requirejs(["common"], sugon => {
  // 全局查询尺度
  var searchRuler = {},
    search = {},
    gddwfbData = [];
  var baseTable = [];
  var initDwqk = function(index, flag, page) {
    let username = $("#username").val() ? $("#username").val() : null;
    let name = $("#loadname").val() ? $("#loadname").val() : null;
    let deptId = $("#deptname").val() ? $("#deptname").val() : null;
    let sfzh = $("#idname").val() ? $("#idname").val() : null;
    let pageNum = page ? page : 1;
    sugon.requestJson(
      {
        type: "POST",
        async: true,
        url: sugon.interFaces.system.user.query,
        data: {
          username: username,
          name: name,
          gzdw: deptId,
          sfzh: sfzh,
          currentPage: pageNum
        }
      },
      function(result) {
        $(".tab-contain").empty();
        if (result && result.data.length > 0) {
          for (var i = 0; i < result.data.length; i++) {
            $(".tab-contain").append(getCol(result.data[i]));
          }
          let pages =
            result.totalPage % 10 == 0
              ? parseInt(result.totalPage / 10)
              : parseInt(result.totalPage / 10) + 1;
          sugon.renderNav($(".nav-container"), pageNum, pages, function(page) {
            getColse(page);
          });
        }
        gddwfbData = result.data;
      }
    );
  };
  var getColse = function(page) {
    let username = $("#username").val() ? $("#username").val() : null;
    let name = $("#loadname").val() ? $("#loadname").val() : null;
    let deptId = $("#deptname").val() ? $("#deptname").val() : null;
    let sfzh = $("#idname").val() ? $("#idname").val() : null;
    let pageNum = page ? page : 1;
    sugon.requestJson(
      {
        type: "POST",
        async: true,
        url: sugon.interFaces.system.user.query,
        data: {
          username: username,
          name: name,
          gzdw: deptId,
          sfzh: sfzh,
          currentPage: pageNum
        }
      },
      function(result) {
        $(".tab-contain").empty();
        if (result && result.data.length > 0) {
          for (var i = 0; i < result.data.length; i++) {
            $(".tab-contain").append(getCol(result.data[i]));
          }
        }
        gddwfbData = result.data;
      }
    );
  };
  var getCol = function(arr) {
    var $tr = $("<tr></tr>").addClass("tab-tr");
    let displays = "block";
    if (arr.reset == 1) {
      displays = "visible";
    } else {
      displays = "hidden";
    }
    $tr
      .append(
        $(
          "<td style='text-align: -webkit-center;'><input type='checkbox' name='vehicle' value=" +
            arr.username +
            "></td>"
        ).addClass("tab-td")
      )
      .append(
        $("<td style='text-align: -webkit-center;'></td>")
          .addClass("tab-td usernamejs")
          .html(arr.username)
      )
      .append(
        $("<td style='text-align: -webkit-center;'></td>")
          .addClass("tab-td")
          .html(arr.name)
      )
      .append(
        $("<td style='text-align: -webkit-center;'></td>")
          .addClass("tab-td")
          .html(arr.deptName)
      )
      .append(
        $("<td style='text-align: -webkit-center;'></td>")
          .addClass("tab-td")
          .html(arr.jh)
      )
      .append(
        $("<td style='text-align: -webkit-center;'></td>")
          .addClass("tab-td")
          .html(arr.sfzh)
      )
      .append(
        $("<td style='text-align: -webkit-center;'></td>")
          .addClass("tab-td")
          .html(arr.phone)
      )
      .append(
        $("<td style='text-align: -webkit-center;'></td>")
          .addClass("tab-td")
          .html(arr.role)
      )
      .append(
        $(
          "<td style='text-align: -webkit-center;'><span class='deletejs' style='color: #599cf1;cursor: pointer;' data-toggle='modal' data-target='#myModals'>删除</span><span style='color: #cccccc;visibility:" +
            displays +
            ";'>|</span><span style='color: #599cf1;cursor: pointer;visibility:" +
            displays +
            ";' data-toggle='modal' data-target='#myModalcm' class='restsecrct'>重置密码</span></td>"
        ).addClass("tab-td")
      );
    //onclick='deletes(" + arr.username + ")'
    return $tr;
  };
  var initView = function() {
    searchRuler.deptNames = $("#dept-name").val();
    searchRuler.deptId = $("#dept-id").val();
    searchRuler.deptName = $("#deptname").val();
    searchRuler.username = $("#username").val();
    searchRuler.loadname = $("#loadname").val();
    searchRuler.idname = $("#idname").val();
    search.deptNames = $("#dept-name").val();
    search.deptId = $("#dept-id").val();
    search.deptName = $("#deptname").val();
    search.username = $("#username").val();
    search.loadname = $("#loadname").val();
    search.idname = $("#idname").val();
  };
  // 查询按钮事件
  $(".query").click(function() {
    initDwqk();
  });
  //重置查询条件
  $(".check").click(function() {
    $("#username").val(null);
    $("#deptname").val(null);
    $("#loadname").val(null);
    $("#idname").val(null);
  });
  //确认删除
  $(".primarydelete").click(function() {
    sugon.requestJson(
      {
        type: "POST",
        async: true,
        url: sugon.interFaces.system.user.detele,
        data: {
          username: $("#usern").val(),
          sfzh: $("#sfzhn").val()
        }
      },
      function(result) {
        if (result.code == 200) {
          sugon.showMessage("删除成功！", "success");
          $("#myModals").modal("hide");
          initDwqk();
        } else {
          sugon.showMessage("删除失败！", "error");
        }
      }
    );
  });
  //确认修改密码
  $(".primaryscrect").click(function() {
    if (
      /[^\s]/.test($("#newsecrct").val()) &&
      $("#newsecrct").val() != "undefined" &&
      $("#newsecrct").val() &&
      /[^\s]/.test($("#oldsecrct").val()) &&
      $("#oldsecrct").val() != "undefined" &&
      $("#oldsecrct").val() &&
      /[^\s]/.test($("#checksecrct").val()) &&
      $("#checksecrct").val() != "undefined" &&
      $("#checksecrct").val()
    ) {
      if ($("#newsecrct").val() == $("#checksecrct").val()) {
        sugon.requestJson(
          {
            type: "POST",
            async: true,
            url: sugon.interFaces.system.user.resetPassword,
            data: {
              username: $("#userns").val(),
              sfzh: $("#sfzhns").val(),
              oldPassword: $("#oldsecrct").val(),
              newPassword: $("#newsecrct").val()
            }
          },
          function(result) {
            if (result.code == 200) {
              sugon.showMessage("修改密码成功！", "success");
              $("#myModalcm").modal("hide");
            } else if (result.code == 400) {
              sugon.showMessage("旧密码验证失败！", "error");
            } else {
              sugon.showMessage("修改密码失败！", "error");
            }
          }
        );
      } else {
        sugon.showMessage("新密码和确认密码不一致！", "warning");
      }
    } else {
      sugon.showMessage("必输项未输入完整！", "warning");
    }
  });
  //分配用户勾选
  $(".checksef").click(function() {
    var obj = document.getElementsByName("vehicle");
    baseTable = [];
    for (var i in obj) {
      if (obj[i].checked) {
        baseTable.push(obj[i].value);
      }
    }
    console.log(baseTable);
    if (baseTable.length > 0) {
      sugon.requestJson(
        {
          type: "POST",
          async: true,
          url: sugon.interFaces.system.user.getRole,
          data: {}
        },
        function(result) {
          $(".bodysj").empty();
          $(".bodytx").empty();
          if (result.data.length > 0) {
            for (var p = 0; p < result.data[0].length; p++) {
              var $redios = $(
                "<div><input id='radiodse' type='radio' name='radioss' value=" +
                  result.data[0][p].code +
                  ">" +
                  result.data[0][p].name +
                  "</div>"
              ).addClass("rediose");
              $(".bodysj").append($redios);
            }
            for (var l = 0; l < result.data[1].length; l++) {
              var $rediosse = $(
                "<div><input id='radiodse' type='radio' name='radioss' value=" +
                  result.data[1][l].code +
                  ">" +
                  result.data[1][l].name +
                  "</div>"
              ).addClass("rediose");
              $(".bodytx").append($rediosse);
            }
          }
          $("#dept-name").val("");
          $("#dept-id").val("");
        }
      );
    } else {
      sugon.showMessage("未勾选用户！", "error");
      setTimeout(() => {
        $("#myModalc").modal("hide");
      }, 100);
    }
  });
  //分配用户确认
  $(".primaryfp").click(function() {
    var objsd = document.getElementsByName("radioss");
    let codes = "";
    let deptIds = "";
    deptIds = $("#dept-id").val();
    for (var s = 0; s < objsd.length; s++) {
      if (objsd[s].checked) {
        codes = objsd[s].value;
      }
    }
    let usernamess = "";
    baseTable.forEach(itemse => {
      if (!usernamess) {
        usernamess = itemse;
      } else {
        usernamess = usernamess + "," + itemse;
      }
    });
    console.log(codes, deptIds);
    if (codes && deptIds) {
      sugon.showMessage("市局，条线以及分局及下级单位只能任选一个！", "error");
      for (var s = 0; s < objsd.length; s++) {
        objsd[s].checked = false;
      }
      $("#dept-id").val("");
      $("#dept-name").val("");
    } else if (!deptIds && !codes) {
      sugon.showMessage("市局，条线以及分局及下级单位必须选一个！", "error");
    } else {
      sugon.requestJson(
        {
          type: "POST",
          async: true,
          url: sugon.interFaces.system.user.submitRole,
          data: {
            usernames: usernamess,
            code: codes,
            deptId: deptIds
          }
        },
        function(result) {
          if (result.code == 200) {
            sugon.showMessage("分配用户成功！", "success");
            $("#myModalc").modal("hide");
            initDwqk();
          } else {
            sugon.showMessage("分配用户失败！", "error");
          }
        }
      );
    }
  });
  // 分配校验
  $(".form-control").click(function() {
    var objsds = document.getElementsByName("radioss");
    for (var s = 0; s < objsds.length; s++) {
      objsds[s].checked = false;
    }
  });
  //全选
  $(".checkboxss").click(function() {
    var objs = document.getElementsByName("vehicles");
    var objss = document.getElementsByName("vehicle");
    if (objs[0].checked) {
      for (let m = 0; m < objss.length; m++) {
        objss[m].checked = true;
      }
    } else {
      for (let n = 0; n < objss.length; n++) {
        objss[n].checked = false;
      }
    }
  });
  //新增用户
  $(".queryse").click(function() {
    $("#usernamex").val("");
    $("#namex").val("");
    $("#jhx").val("");
    $("#sfzhx").val("");
    $("#deptNamex").val("");
    $("#phonex").val("");
  });
  //确认新增用户
  $(".primaryadd").click(function() {
    if (
      /[^\s]/.test($("#usernamex").val() && $("#usernamex").val()) !=
        "undefined" &&
      $("#usernamex").val() &&
      /[^\s]/.test($("#namex").val()) &&
      $("#namex").val() != "undefined" &&
      $("#namex").val()
    ) {
      sugon.requestJson(
        {
          type: "POST",
          async: true,
          url: sugon.interFaces.system.user.addUser,
          data: {
            username: $("#usernamex").val(),
            name: $("#namex").val(),
            jh: $("#jhx").val(),
            sfzh: $("#sfzhx").val(),
            gzdw: $("#deptNamex").val(),
            phone: $("#phonex").val()
          }
        },
        function(result) {
          if (result.code == 200) {
            sugon.showMessage("新增用户成功！", "success");
            $("#myModal").modal("hide");
            initDwqk();
          } else if (result.code == 400) {
            sugon.showMessage("用户名已存在！", "error");
          } else {
            sugon.showMessage("修改密码失败！", "error");
          }
        }
      );
    } else {
      sugon.showMessage("必输项未输入完整！", "warning");
    }
  });
  var initPage = async function() {
    // 初始化查询栏
    await sugon.initSearchBar({ date1: -7, date2: -2, cb: initView });
    initView();
    initDwqk();
    $("#oldsecrcts").val("111111");
  };

  $("#ui-view").on("click", ".deletejs", function(e) {
    var usernamejsz = $(e.target)
      .parent()
      .parent()
      .find(".usernamejs")
      .html();
    $("#usern").val(usernamejsz);
    gddwfbData.forEach(items => {
      if (usernamejsz == items.username) {
        $("#sfzhn").val(items.sfzh);
      }
    });
  });
  $("#ui-view").on("click", ".restsecrct", function(e) {
    var usernamer = $(e.target)
      .parent()
      .parent()
      .find(".usernamejs")
      .html();
    $("#userns").val(usernamer);
    gddwfbData.forEach(items => {
      if (usernamer == items.username) {
        $("#sfzhns").val(items.sfzh);
      }
    });
    $("#oldsecrcts").val("111111");
    $("#oldsecrct").val("");
    $("#newsecrct").val("");
    $("#checksecrct").val("");
  });
  // 页面入口
  $(function() {
    initPage();
  });
});
