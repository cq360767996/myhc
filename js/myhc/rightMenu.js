requirejs(["common"], function(sugon) {
    //history.back(-1):



    sugon.requestJson({type: "POST", url: sugon.interFaces.rdwt.RdList,data:{"date":"2018-06",pageSize:10,pageNum:1,deptId:'2014110416460086100000002942'}, async: false}, function (result) {
        $(".rcGrid").empty();
        for(var i=0;i<result.data.length;i++) {
            var str = (i + 1) + "、" + result.data[i].content;
            $(".rcGrid").append('<div id='+ result.data[i].id +' title="' + str + '">'+ str +'</div>');
        }
        $(".rcGrid>div").css("lineHeight", $(".rcGrid>div").css("height"));
    });

    $(".search_bar img").bind("click", function() {
        if($("#keywords").val()){
            location.hash = vipspa.stringify("myys/ysxq", {txt: $("#keywords").val()});
        }
    });

    var initSearchList = function() {
        sugon.requestJson({type:"POST", url: sugon.interFaces.myys.SearchList, async: false},function(result){
            $(".hot_list").empty();
            for(var i=0;i<result.data.length;i++) {
                $(".hot_list").append("<div id="+ result.data[i].value +">"+ result.data[i].name +"</div>");
            }
            $(".hot_list>div").unbind().bind("click", function() {
                $("#keywords").val($(this).html());
            });
        });
    };

    $(".refresh").bind("click", function() {
        initSearchList();
    });

    $(".refresh").click();
});