requirejs(["common"], function(sugon) {
    $(".img img").bind("click", function() {
        location.hash = vipspa.stringify("dwjx/" + this.id, {type: this.id});
    });
    $(".img img").hover(function(){
        $(".img_info").eq($(".img img").index(this)).css("visibility", "visible");
    },function(){
        $(".img_info").css("visibility", "hidden");
    });
});