/* Created by handsome qiu */
requirejs(['common'], sugon => {

    function initLeft1() {
        sugon.request(sugon.interFaces.zxyp.rx.setting.left1).then(data => {
            let $body = $('.left1').empty();
            $body.append($('<span/>').html('热搜：'));
            data.hotWord.map(val => {
                $body.append($('<a/>').html(val));
            });
        });

    }

    function initLeft2() {
        sugon.request(sugon.interFaces.zxyp.rx.setting.left2).then(data => {
            let $body = $('.left2').empty().append('<row><cell>诉求时间</cell><cell>诉求人</cell><cell>诉求电话</cell>' +
                '<cell>诉求类型</cell><cell>诉求内容</cell></row>');
            data.data.map(val => {
                $body.append('<row><cell>' + val.sqsj + '</cell><cell>' + val.sqr + '</cell><cell>' + val.sqdh +
                    '</cell><cell>' + val.sqlx + '</cell><cell>' + val.sqnr + '</cell></row>');
            });
            sugon.renderNav($('.nav1 > div'), data.pageNum, data.totalPage, initLeft2);
        });
    }

    function initRight1() {
        sugon.request(sugon.interFaces.zxyp.rx.setting.right1).then(data => {
            let $body = $('.right-up').empty();
            let $left = $('<column/>'), $right = $('<column/>');
            data.data.map((val, index) => {
                if (index < 5) {
                    $left.append('<row><span>' + (index + 1) + '、' + val + '</span><img src="../../img/zxyp/rx/del.png"></row>');
                } else {
                    $right.append('<row><span>' + (index + 1) + '、' + val + '</span><img src="../../img/zxyp/rx/del.png"></row>');
                }
            });
            $body.append($left).append($right);
            sugon.renderNav($('.nav2 > div'), data.pageNum, data.totalPage, initRight1);
        });
    }

    function initRight2() {
        sugon.request(sugon.interFaces.zxyp.rx.setting.right2).then(data => {
            let $body = $('.right-down').empty();
            data.data.map((val, index) => {
                $body.append('<row><cell>' + (index + 1) + '、' + val.col1 + '</cell><cell>' + val.col2 +
                    '</cell><cell>' + val.col3 + '</cell><cell><img src="../../img/zxyp/rx/' +
                    (val.col4 ? 'like' : 'dislike') + '.png"><img src="../../img/zxyp/rx/upload.png"></cell></row>');
            });
            sugon.renderNav($('.nav3 > div'), data.pageNum, data.totalPage, initRight2);
        });
    }

    function initPage() {
        initLeft1();
        initLeft2();
        initRight1();
        initRight2();
    }

    $(function () {
        initPage();
    });
});