requirejs(["common"], sugon => {
  $(".main-container > div").on("click", e => {
    let $parent = $(e.target).parent();
    if ($parent.hasClass("container1")) {
      $parent.removeClass("container1").addClass("container2");
    } else {
      $parent.removeClass("container2").addClass("container1");
    }
  });
});
