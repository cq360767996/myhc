requirejs(["common"], sugon => {
  function initPage() {
    sugon.request(sugon.interFaces.myhc.myzd.getCount).then(result => {
      result.data1.map((val, index) => {
        $(".span-val")
          .eq(index)
          .html(val);
      });
      Object.keys(result.data2).forEach(key => {
        $(`.${key}`).html(`${result.data2[key]}人`);
      });
    });
  }
  // 页面入口
  initPage();

  // 路由事件
  $(".main-container > section > div").on("click", function() {
    let $this = $(this);
    let className = $this
      .find("div")
      .eq(1)
      .attr("class");
    let title = $this
      .find("div")
      .eq(0)
      .html();
    location.hash = vipspa.stringify("myzd/jsfx", { type: className, title });
  });
});
