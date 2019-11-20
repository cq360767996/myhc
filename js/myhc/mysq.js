requirejs(["common", "myhc/detail_popup"], (sugon, popup) => {
  let searchParams = {};
  // 返回事件
  $(".back").bind("click", function() {
    location.hash = vipspa.stringify("myys", { type: "myys" });
  });

  // 获取查询列表
  function getSearchList(pageNum = 1) {
    let { txt, type } = searchParams;
    let { role, deptId } = sugon.identityInfo;
    let params = {
      txt,
      pageSize: 5,
      type,
      role,
      deptId,
      pageNum
    };
    sugon.request(sugon.interFaces.myhc.myys.esSearch, params).then(result => {
      $(".total").html(result.total);
      $(".period").html(result.period);
      $("#pageLimit").bootstrapPaginator({
        currentPage: pageNum,
        totalPages: result.totalPages,
        size: "normal",
        bootstrapMajorVersion: 3,
        alignment: "right",
        numberOfPages: 6,
        itemTexts: function(type, page) {
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
        onPageClicked: function(event, originalEvent, type, pageNum) {
          getSearchList(pageNum);
        }
      });
      let html = "";
      result.data.map(val => {
        html += `<div class="table-row" row-id="${val.id}">
                  <div>
                    <div class="first-row">
                      <span>工单编号：${val.ywbm}</span>
                      <span>诉求时间：${val.time}</span>
                      <span>诉求人：${val.name}</span>
                      <span>诉求电话：${val.phone}</span>
                      <span>业务名称：${val.code}</span>
                    </div>
                    <div class="last-row">${val.content}</div>
                  </div>
                  <div>
                    <img src="../../img/myhc/myys/${val.type}.png" />
                  </div>
                </div>`;
      });
      $(".tab-container")
        .empty()
        .append(html);

      // 点击弹出页事件
      $(".table-row")
        .off()
        .on("click", function() {
          let $this = $(this);
          let id = $this.attr("row-id");
          let type = $this
            .find("img")
            .attr("src")
            .match(/\d+/)[0];
          popup.renderPopup(id, 0, type, $(".pop-tab-container"));
        });
    });
  }

  // 记录一次点击
  function getEvent() {
    sugon.request(sugon.interFaces.myhc.myys.saveKeyWord, {
      keyWord: searchParams.txt,
      type: searchParams.type
    });
  }

  // 点击按钮事件
  $(".check").on("click", function() {
    searchParams.txt = $("#keywords").val();
    getEvent();
    getSearchList();
  });

  // 类型切换事件
  $("#type").on("change", e => {
    searchParams.type = $(e.target).val();
    getSearchList();
  });

  function initPage() {
    searchParams.txt = sugon.getUrlParam("txt");
    searchParams.type = 0;
    $("#keywords").val(searchParams.txt);
    getEvent();
    getSearchList();
  }

  initPage();
});
