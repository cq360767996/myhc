requirejs(["common"], function(sugon) {
  $(".flag").bind("click", function() {
    $(".window1").css(
      "background",
      'url("../../img/alert2.png") no-repeat center'
    );
    $(".window1").show();
  });

  $(".ddb").bind("click", function() {
    $(".window1").css(
      "background",
      'url("../../img/alert1.png") no-repeat center'
    );
    $(".window1").show();
  });

  $(".window1").bind("click", function() {
    $(".window1").hide();
  });

  $("#gotoMap").bind("click", function() {
    location.hash = vipspa.stringify("myzs", { type: "myzs" });
  });

  sugon.initRightMenu();
});
