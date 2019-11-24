const sugon = {
  isPublished: false,
  api: {
    login: {
      localUrl: "/static/json/login/login.json",
      remoteUrl: "/login"
    }
  },
  request: function(url, data, config) {
    let _this = this;
    return new Promise((resolve, reject) => {
      let option = {
        url,
        type: "get",
        data,
        success: resolve,
        error: reject,
        dataType: "json",
        traditional: true
      };
      let finalOpt = {};
      Object.assign(finalOpt, option, config);
      finalOpt.url = _this.isPublished ? url.remoteUrl : url.localUrl;
      finalOpt.type = _this.isPublished ? "post" : "get";
      $.ajax(finalOpt);
    });
  },
  showMessage: function(msg, type = "default") {
    let divClass = `pop-message-${type}`;
    $("body").append(
      `<div class="pop-message ${divClass}">
        <span class="pop-message-context">${msg}</span>
      </div>`
    );
    setTimeout(function() {
      $(".pop-message").remove();
    }, 3000);
  },
  // 解析hash值里面的参数
  getParam(name) {
    let result = {};
    name.replace(/\?(.*)/g, function($1, $2) {
      $2.split("&").map(val => {
        let arr = val.split("=");
        result[arr[0]] = arr[1];
      });
    });
    return result;
  },
  // 加载中页面组件
  renderLoading() {
    $("body").append(`<aside class="loading"><div></div></aside>`);
  }
};

// 校验用户名和密码规则
function verify(username, password) {
  let isPass;
  if (!username || !password) {
    sugon.showMessage("请输入用户名和密码！", "warning");
    isPass = false;
  } else if (password.length < 5) {
    sugon.showMessage("输入密码小于6个字符， 请重新输入！", "warning");
    isPass = false;
  } else {
    isPass = true;
  }
  return isPass;
}

// 密码登录
function passwordLogin(e) {
  let $parent = $(e.target)
      .parent()
      .parent(),
    className = $parent.attr("class");
  // 密码登录
  if (className === "password-panel") {
    let username = $("#username").val(),
      password = $("#password").val();
    if (verify(username, password)) {
      sugon.request(sugon.api.login, { username, password }).then(result => {
        if (result.code === 1000) {
          sessionStorage.setItem("token", result.token);
          sessionStorage.setItem("deptId", result.deptId);
          sessionStorage.setItem("deptName", result.deptName);
          sessionStorage.setItem("deptCode", result.deptCode);
          sessionStorage.setItem("role", result.role);
          sessionStorage.setItem("username", username);
          sessionStorage.setItem("name", result.name);
          location.href = sugon.isPublished
            ? "/index?#myzs"
            : "index.html?#myzs";
        }
        if (result.code === 1001) {
          sugon.showMessage("用户名或密码错误！", "error");
        }
      });
    }
  } else {
    location.href = sugon.isPublished ? "/index?#myzs" : "index.html?#myzs";
  }
}

// 页面入口
function initPage() {
  let search = location.search;
  if (search) {
    sugon.renderLoading();
    let params = sugon.getParam(search);
    $("#username").val(params.username);
    $("#password").val(params.password);
    setTimeout(function() {
      $(".login-btn").click();
      $(".loading").remove();
    }, 1000);
  }
}

// 切换数字登录和账号密码登录
$(".switch-btn").on("click", e => {
  let $target = $(e.target),
    text = $target.html();
  if (text === "数字证书登录") {
    $(".certification-panel").show();
    $(".password-panel").hide();
  } else {
    $(".password-panel").show();
    $(".certification-panel").hide();
  }
});

// 登录按钮事件
$(".login-btn").on("click", passwordLogin);

// 登录回车键
$("#password").on("keyup", e => {
  if (e.keyCode === 13) {
    passwordLogin(e);
  }
});

// 页面入口
initPage();
