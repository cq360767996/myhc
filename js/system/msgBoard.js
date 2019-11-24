requirejs(["common"], sugon => {
  // 选中删除行id
  let deleteRowId = null;
  // 页面入口
  async function initPage(pageNum = 1) {
    let pageSize = 9;
    let result = await sugon.request(sugon.interFaces.system.msgBoard.getAll, {
      pageNum,
      pageSize
    });

    let html = `<row>
                  <cell>时间</cell>
                  <cell>姓名</cell>
                  <cell>留言内容</cell>
                  <cell>操作</cell>
                </row>`;
    result.data.map(val => {
      html += `<row row-id="${val.id}">
                <cell>${val.time}</cell>
                <cell>${val.name}</cell>
                <cell>${val.content}</cell>
                <cell><button class="delete-btn btn btn-danger">删除</button></cell>
              </row>`;
    });
    $("#tab-container")
      .empty()
      .append(html);
    sugon.renderNav($(".nav-container"), pageNum, result.totalPage, initPage);

    // 绑定行点击时间
    $("#tab-container .delete-btn")
      .off()
      .on("click", function() {
        deleteRowId = $(this).attr("row-id");
        $("#confirm-panel").modal("show");
      });
  }

  // 确认删除按钮事件
  $("#confirm-delete").on("click", () => {
    sugon
      .request(sugon.interFaces.system.msgBoard.delete, { id: deleteRowId })
      .then(result => {
        if (result.code == 200) {
          sugon.showMessage("删除成功！", "success");
          $("#confirm-panel").modal("hide");
          initPage();
        } else {
          sugon.showMessage("删除未成功，请稍后重试！", "error");
        }
      })
      .catch(() => {
        sugon.showMessage("服务器内部错误，请联系管理员！", "error");
      });
  });

  // 页面入口
  initPage();
});
