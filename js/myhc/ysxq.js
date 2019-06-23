requirejs(["common"], function(sugon) {
    var param = sugon.getUrlParam("txt");
    var searchCode , searchTxt;
    $("#keywords").val(param);

    $(".back").bind("click", function() {
        location.hash = vipspa.stringify("myys", {type: "myys"});
    });

    var getEvent = function() {
        $(".grid>div").unbind().bind("click", function(event) {
            event.stopPropagation();
            if($(this).attr("url").indexOf("dwjx") >= 0) {
                return;
            }
            sugon.requestJson({type:"POST", url: sugon.interFaces.myys.saveKeyWord, data: {keyWord: $(this).find("span.val").eq(0).html()}, async: false},function(result){

            });

            if($(this).attr("type") == "1") {
                sessionStorage.setItem('searchParams', '{"code": "'+ $(this).attr("id") +'", "codeName": "'+ $(this).attr("name") +'", "mold": "'+ $(this).attr("mold") +'"}');
                location.hash = vipspa.stringify($(this).attr("url"), {type: $(this).attr("url")});
            }else{
                location.hash = vipspa.stringify("myys/ysxq/detail", {id: this.id + "_" + searchTxt});
            }
        });

        $(".low").unbind().bind("click", function() {
            event.stopPropagation();
            sessionStorage.setItem('searchParams', '{"code": "'+ $(this).parent().parent().attr("id") +'", "codeName": "'+ $(this).parent().parent().attr("name") +'", "mold": "'+ $(this).parent().parent().attr("mold") +'"}');
            var tempUrl = "dwjx/" + this.id;
            location.hash = vipspa.stringify(tempUrl, {type:tempUrl});
        });
    };

    $(".check").bind("click", function() {
        sugon.requestJson({type:"POST", url: sugon.interFaces.myys.DataList, data: {txt: $("#keywords").val(), pageSize: 6, pageNum: 1}, async: false},function(result){
            sugon.requestJson({
                type: 'post',
                url: sugon.interFaces.myys.cacheDataList,
                data: {txt: $("#keywords").val(), pageSize: 6, pageNum: 1},
                async: true
            }, function () {
            });
            searchTxt = $("#keywords").val();
            searchCode = result.code;
            sugon.getSearchList(result.data);
            getEvent();

            $('#pageLimit').bootstrapPaginator({
                currentPage: 1,
                totalPages: result.totalPages,
                size: "normal",
                bootstrapMajorVersion: 3,
                alignment: "right",
                numberOfPages: 6,
                itemTexts: function (type, page, current) {
                    switch (type) {
                        case "first": return "首页";
                        case "prev": return "<";
                        case "next": return ">";
                        case "last": return "末页";
                        case "page": return page;
                    }
                },
                onPageClicked: function (event, originalEvent, type, page){
                    sugon.requestJson({type:"POST", url: sugon.interFaces.myys.DataList, data: {txt: searchTxt, pageSize: 6, pageNum: page}, async: false},function(result){
                        sugon.requestJson({
                            type: 'post',
                            url: sugon.interFaces.myys.cacheDataList,
                            data: {txt: searchTxt, pageSize: 6, pageNum: page},
                            async: true
                        }, function () {
                        });
                        sugon.getSearchList(result.data);
                        getEvent();
                    });
                }
            });
        });
    });
    $(".check").click();
});
