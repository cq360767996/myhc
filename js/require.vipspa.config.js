requirejs.config({
  baseUrl: "js",
  urlArgs: "1.0.0",
  paths: {
    ec: "../lib/echarts.min",
    ecPlugin: "../lib/echarts-liquidfill.min",
    text: "../lib/text",
    css: "../lib/require.css.min",
    highcharts: "../lib/highcharts",
    high3D: "../lib/highcharts-3d",
    _: "../lib/lodash.min",
    L: "../lib/leaflet/leaflet",
    iclient: "../lib/leaflet/iclient9-leaflet-es6.min",
    heat: "../lib/leaflet/leaflet-heat",
    markerCluster: "../lib/leaflet/leaflet.markercluster",
    plot: "../lib/leaflet/iclient9-plot-leaflet-es6.min",
    domtoimage: "../lib/dom-to-image.min",
    jqcloud: "../lib/jqcloud",
    vipspa: "../lib/vipspa.min",
    rx_setting: "zxyp/rx_setting",
    Sortable: "../lib/Sortable.min"
  },
  shim: {
    high3D: {
      deps: ["highcharts"]
    },
    ecPlugin: {
      deps: ["L"]
    },
    iclient: {
      deps: ["L"]
    },
    heat: {
      deps: ["L"]
    },
    markerCluster: {
      deps: ["L"]
    },
    plot: {
      deps: ["L", "iclient"]
    },
    domtoimage: {
      exports: "domtoimage"
    },
    vipspa: {
      exports: "vipspa"
    }
  }
});

requirejs(["vipspa", "common"], function(vipspa, sugon) {
  // 判断是否登录过
  if (sessionStorage.getItem("token")) {
    // 确认登录过，将token等信息写入缓存
    sugon.identityInfo = {
      token: sessionStorage.getItem("token"),
      deptId: sessionStorage.getItem("deptId"),
      deptName: sessionStorage.getItem("deptName"),
      deptCode: sessionStorage.getItem("deptCode"),
      role: sessionStorage.getItem("role"),
      username: sessionStorage.getItem("username"),
      name: sessionStorage.getItem("name")
    };
    $("#userName").html(`你好，${sugon.identityInfo.name}`);
  } else {
    location.href = sugon.isPublished ? "/login" : "login.html";
  }
  // 路由配置
  let router = {
    404: {
      parent: "myhc",
      templateUrl: "views/404.html",
      controller: ""
    },
    myzs: {
      parent: "myhc",
      templateUrl: "views/myhc/myzs.html",
      controller: "js/myhc/myzs.js"
    },
    myjz: {
      parent: "myhc",
      templateUrl: "views/myhc/myjz.html",
      controller: "js/myhc/myjz.js"
    },
    rdwt: {
      parent: "myhc",
      templateUrl: "views/myhc/rdwt.html",
      controller: "js/myhc/rdwt.js"
    },
    "rdwt/setting": {
      parent: "myhc",
      templateUrl: "views/myhc/rdwt_setting.html",
      controller: "js/myhc/rdwt_setting.js"
    },
    dwjx: {
      parent: "myhc",
      templateUrl: "views/myhc/dwjx.html",
      controller: "js/myhc/dwjx.js"
    },
    myzd: {
      parent: "myhc",
      templateUrl: "views/myhc/myzd.html",
      controller: "js/myhc/myzd.js"
    },
    "myzd/jsfx": {
      parent: "myhc",
      templateUrl: "views/myhc/jsfx.html",
      controller: "js/myhc/jsfx.js"
    },
    myys: {
      parent: "myhc",
      templateUrl: "views/myhc/myys.html",
      controller: "js/myhc/myys.js"
    },
    "myys/ysxq": {
      parent: "myhc",
      templateUrl: "views/myhc/ysxq.html",
      controller: "js/myhc/ysxq.js"
    },
    "myys/mysq": {
      parent: "myhc",
      templateUrl: "views/myhc/mysq.html",
      controller: "js/myhc/mysq.js"
    },
    "myys/ysxq/detail": {
      parent: "myhc",
      templateUrl: "views/myhc/detail.html",
      controller: "js/myhc/detail.js"
    },
    "dwjx/sqxz": {
      parent: "myhc",
      templateUrl: "views/myhc/sqxz.html",
      controller: "js/myhc/sqxz.js"
    },
    "dwjx/ywgk": {
      parent: "myhc",
      templateUrl: "views/myhc/ywgk.html",
      controller: "js/myhc/ywgk.js"
    },
    "dwjx/jtwt": {
      parent: "myhc",
      templateUrl: "views/myhc/jtwt.html",
      controller: "js/myhc/jtwt.js"
    },
    "dwjx/dwjs": {
      parent: "myhc",
      templateUrl: "views/myhc/dwjs.html",
      controller: "js/myhc/dwjs.js"
    },
    "dwjx/znfx": {
      parent: "myhc",
      templateUrl: "views/myhc/znfx.html",
      controller: "js/myhc/znfx.js"
    },
    jcj: {
      parent: "zxyp",
      templateUrl: "views/zxyp/jcj.html",
      controller: "js/zxyp/jcj.js"
    },
    aj: {
      parent: "zxyp",
      templateUrl: "views/zxyp/aj.html",
      controller: "js/zxyp/aj.js"
    },
    ckfw: {
      parent: "zxyp",
      templateUrl: "views/zxyp/ckfw.html",
      controller: "js/zxyp/ckfw.js"
    },
    ylld: {
      parent: "zxyp",
      templateUrl: "views/zxyp/ylld.html",
      controller: "js/zxyp/ylld.js"
    },
    rx: {
      parent: "zxyp",
      templateUrl: "views/zxyp/rx.html",
      controller: "js/zxyp/rx.js"
    },
    jtsg: {
      parent: "zxyp",
      templateUrl: "views/zxyp/jtsg.html",
      controller: "js/zxyp/jtsg.js"
    },
    ywfxbg: {
      parent: "znbg",
      templateUrl: "views/znbg/ywfxbg.html",
      controller: "js/znbg/ywfxbg.js"
    },
    zhfxbg: {
      parent: "znbg",
      templateUrl: "views/znbg/zhfxbg.html",
      controller: "js/znbg/zhfxbg.js"
    },
    zhzs: {
      parent: "slhy",
      templateUrl: "views/slhy/zhzs.html",
      controller: "js/slhy/zhzs.js"
    },
    pjda: {
      parent: "slhy",
      templateUrl: "views/slhy/pjda.html",
      controller: "js/slhy/pjda.js"
    },
    user: {
      parent: "system",
      templateUrl: "views/system/user.html",
      controller: "js/system/user.js"
    },
    notification: {
      parent: "system",
      templateUrl: "views/system/notification.html",
      controller: "js/system/notification.js"
    },
    msgBoard: {
      parent: "system",
      templateUrl: "views/system/msgBoard.html",
      controller: "js/system/msgBoard.js"
    },
    defaults: "404"
  };
  // 判断地图模块文件
  switch (sugon.identityInfo.role) {
    case "fj":
      router.myzs.controller = "js/myhc/myzs_fj.js";
      break;
    case "pcs":
      router.myzs.controller = "js/myhc/myzs_pcs.js";
      break;
  }
  // 菜单过滤器
  let menuDispatch = sugon.menuConfig[sugon.identityInfo.role] || [];
  // 过滤路由
  Object.keys(router).forEach(key => {
    menuDispatch.map(val => {
      if (key.indexOf(val) > -1) {
        delete router[key];
      }
    });
  });
  // 加载路由
  vipspa.start({
    view: "#ui-view",
    errorTemplateId: "#error",
    router: router
  });
  // 控制tab的显示
  handleTabDisplay();
  // 加载左侧菜单
  loadMenu(location.hash);
  // 初始化消息通知
  initNotification();
  // 浏览器历史记录改变时触发
  window.addEventListener(
    "popstate",
    function(e) {
      loadMenu(location.hash, false, true);
    },
    false
  );

  // 菜单点击事件
  $(".menu").on("click", "div", function() {
    let $this = $(this),
      type = $this.attr("type");
    loadMenu(type);
  });

  // 上侧tab切换事件
  $(".tab > div").bind("click", function() {
    let $this = $(this),
      type = $this.attr("type");
    loadMenu(type, true);
  });

  // 注销登录按钮事件
  $(".exit").on("click", () => {
    sessionStorage.clear();
    location.href = sugon.ispublished ? "/login" : "login.html";
  });

  // 点击单位列表其他地方列表消失
  $("body").on("click", e => {
    let target = e.target;
    let tree1 = document.getElementById("dept-tree");
    let tree2 = document.getElementById("left-tree");
    if (
      target.id !== "dept-name" &&
      target.id !== "place" &&
      !$(target).hasClass("expand-icon") &&
      target
    ) {
      if (
        tree1 &&
        tree1.contains &&
        !tree1.contains(target) &&
        tree1.style.visibility === "visible"
      ) {
        tree1.style.visibility = "hidden";
      }
      if (
        tree2 &&
        tree2.contains &&
        !tree2.contains(target) &&
        tree2.style.visibility === "visible"
      ) {
        tree2.style.visibility = "hidden";
      }
    }
  });

  // 留言板点击事件
  $("#msg-board").on("click", () => {
    let html = `<div class="msg-board-popup">
                  <header>
                    <img src="../../img/system/user/location.png" />
                    <span>消息留言板</span>
                    <i class="msg-board-popup-close glyphicon glyphicon-remove"></i>
                  </header>
                  <main>
                    <textarea id="msg-board-textarea"></textarea>
                  </main>
                  <footer>
                    <div>
                      <button class="msg-board-popup-confirm btn btn-primary">确定</button>
                      <button class="msg-board-popup-close btn btn-default">取消</button>
                    </div>
                  </footer>
                </div>`;
    $("#ui-view")
      .append(html)
      .append(`<div class="main-page-mask"></div>`);
  });

  // 关闭按钮事件
  $("#ui-view").on("click", ".msg-board-popup-close", popupClose);

  // 确定按钮事件
  $("#ui-view").on("click", ".msg-board-popup-confirm", popupConfirm);

  // 通知按钮事件
  $(".popup-right").on("click", () => {
    let html = `<div class="msg-board-popup" style="width: 600px;height: 480px;">
                  <header>
                    <img src="../../img/system/user/location.png" />
                    <span>通知列表</span>
                    <i class="msg-board-popup-close glyphicon glyphicon-remove"></i>
                  </header>
                  <main>
                    <div id="msg-board-tab"></div>
                  </main>
                  <footer>
                    <section></section>
                  </footer>
                </div>`;
    $("#ui-view")
      .append(html)
      .append(`<div class="main-page-mask"></div>`);
    loadNotifyTabAndNav();
  });

  // 行点击事件
  $("#ui-view").on("click", "#msg-board-tab > div", async e => {
    let $target = $(e.currentTarget);
    let id = $target.attr("row-id");
    if (id) {
      $("#main-detail-panel").modal("show");
      let result = await sugon.request(
        sugon.interFaces.system.notification.getDetailByUser
      );
      $("#main-detail-title").html(result.title);
      $("#main-detail-content").html(result.content);
      let fileName = `<a 
                        href="${result.fileUrl}"
                        download="${result.fileName}">
                          ${result.fileName}
                      </a>`;
      $("#main-detail-file-name").html(fileName);
      $("#main-detail-creator").html(result.creator);
      $("#main-detail-create-time").html(result.createTime);
    }
  });

  // 加载通知的表单和分页
  async function loadNotifyTabAndNav(pageNum = 1) {
    let { username, role, deptId } = sugon.identityInfo;
    let result = await sugon.request(
      sugon.interFaces.system.notification.getAllByUser,
      { username, role, deptId, pageNum, pageSize: 5 }
    );
    let $body = $("#msg-board-tab");
    if (result.totalPage == 0) {
      $body.html("暂无数据");
    } else {
      let html = `<div>
      <div>时间</div>
      <div>标题</div>
      <div>是否已读</div>
    </div>`;
      result.data.map(val => {
        html += `<div row-id="${val.id}">
    <div title="${val.date}">${val.date}</div>
    <div title="${val.title}">${val.title}</div>
    <div>${val.isRead ? "已读" : "未读"}</div>
   </div>`;
      });
      $body.empty().append(html);
      sugon.renderNav(
        $(".msg-board-popup > footer > section"),
        pageNum,
        result.totalPage,
        loadNotifyTabAndNav
      );
    }
  }

  // 弹出页确定事件
  function popupConfirm() {
    let content = $("#msg-board-textarea").val();
    let { deptId, role, username } = sugon.identityInfo;
    if (/\S+/.test(content)) {
      sugon
        .request(sugon.interFaces.system.msgBoard.add, {
          content,
          deptId,
          role,
          username
        })
        .then(result => {
          if (result.code == 200) {
            sugon.showMessage("留言成功！", "success");
            popupClose();
          } else {
            sugon.showMessage("留言失败！", "error");
          }
        })
        .catch(() => {
          sugon.showMessage("服务器内部错误，请联系管理员！", "error");
        });
    } else {
      sugon.showMessage("您的输入有误！", "error");
    }
  }

  // 弹出页关闭事件
  function popupClose() {
    $(".msg-board-popup").remove();
    $(".main-page-mask").remove();
  }

  // 根据权限过滤菜单
  function filterMenu(arr) {
    return arr.filter(val => menuDispatch.indexOf(val) === -1);
  }

  // 控制菜单显示并改变hash值
  function handleMenuDisplayAndToHash(arr, type, isTabClick, noHashChange) {
    let $menu = $(".menu"),
      html = "";
    if (isTabClick) {
      arr.map((value, index) => {
        let className = index === 0 ? `${value}-menu-hover` : `${value}-menu`;
        html += `<div class="${className}" type="${value}"></div>`;
      });
      if (arr[0] && !noHashChange) {
        location.hash = arr[0];
      }
    } else {
      arr.map(val => {
        let className =
          type.indexOf(val) > -1 ? `${val}-menu-hover` : `${val}-menu`;
        html += `<div class="${className}" type="${val}"></div>`;
      });
      if (!noHashChange) {
        location.hash = type;
      }
    }
    $menu.empty().append(html);
  }

  // 把tab的名称转换为菜单名称以便在路由中找到
  function transformTab2Menu(type) {
    if (["myhc", "zxyp", "slhy", "znbg", "system"].indexOf(type) > -1) {
      Object.keys(router).forEach(key => {
        if (router[key].parent === type) {
          type = key;
        }
      });
    }
    return type;
  }

  // 加载菜单
  function loadMenu(type, isTabClick, noHashChange) {
    let className = "header-tab-selected",
      parent;
    $(".tab > div").removeClass(className);
    // 处理路由名称为tab名的情况
    type = transformTab2Menu(type);
    for (let key in router) {
      if (type.indexOf(key) > -1) {
        parent = router[key].parent;
        arr = [];
        switch (parent) {
          case "myhc":
            arr = ["myzs", "myjz", "rdwt", "dwjx", "myzd", "myys"];
            break;
          case "zxyp":
            arr = ["jcj", "ckfw", "jtsg", "aj", "rx", "ylld"];
            break;
          case "slhy":
            arr = ["zhzs", "pjda"];
            break;
          case "znbg":
            arr = ["ywfxbg", "zhfxbg"];
            break;
          case "system":
            arr = ["user", "notification", "msgBoard"];
            break;
        }
        let filterArr = filterMenu(arr);
        $(`.tab > div[type="${parent}"]`).addClass(className);
        handleMenuDisplayAndToHash(filterArr, type, isTabClick, noHashChange);
        break;
      }
    }
  }

  // 处理tab显示
  function handleTabDisplay() {
    ["za", "rk", "crj", "xtj", "xzj", "zhzx", "fz", "dcjj"].indexOf(
      sugon.identityInfo.role
    ) > -1 && $("div[type=slhy]").remove();
  }

  // 初始化消息弹出框
  async function initNotification() {
    let result = await sugon.request(
      sugon.interFaces.system.notification.getTotal
    );
    let $total = $(".popup-right > span");
    if (result.total && result.total != 0) {
      $total.show().html(result.total);
    } else {
      $total.hide();
    }
  }
});
