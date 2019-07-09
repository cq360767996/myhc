/* Created by handsome qiu */
requirejs(['common'], sugon => {

    function initLeft1() {
        let {deptId} = window.dialogParams;
        sugon.request(sugon.interFaces.zxyp.rx.setting.left1, {deptId}).then(data => {
            let $body = $('.left1').empty();
            $body.append($('<span/>').html('热搜：'));
            data.hotWord.map(val => {
                $body.append($('<a/>').html(val));
            });
        });

    }

    function initLeft2(pageNum) {
        let {deptId, date1, date2} = window.dialogParams;
        pageNum = pageNum || 1;
        sugon.request(sugon.interFaces.zxyp.rx.setting.left2, {
            pageNum,
            deptId,
            date1,
            date2,
            keyword: $('.search-input').val()
        }).then(data => {
            let $body = $('.left2').empty().append('<row><cell>诉求时间</cell><cell>诉求人</cell><cell>诉求电话</cell>' +
                '<cell>诉求类型</cell><cell>诉求内容</cell></row>');
            data.data.map(val => {
                $body.append('<row><cell>' + val.sqsj + '</cell><cell>' + val.sqr + '</cell><cell>' + val.sqdh +
                    '</cell><cell>' + val.sqlx + '</cell><cell>' + val.sqnr + '</cell></row>');
            });
            sugon.renderNav($('.nav1 > div'), pageNum, data.totalPage, initLeft2);
        });
    }

    function initRight1(pageNum) {
        let {deptId, date1, date2} = window.dialogParams;
        pageNum = pageNum || 1;
        sugon.request(sugon.interFaces.zxyp.rx.setting.right1, {deptId, date1, date2, pageNum}).then(data => {
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
            sugon.renderNav($('.nav2 > div'), pageNum, data.totalPage, initRight1);
        });
    }

    function initRight2(pageNum) {
        let {deptId, date1, date2} = window.dialogParams;
        pageNum = pageNum || 1;
        sugon.request(sugon.interFaces.zxyp.rx.setting.right2, {deptId, date1, date2, pageNum}).then(data => {
            let $body = $('.right-down').empty();
            data.data.map((val, index) => {
                $body.append('<row><cell>' + (index + 1) + '、' + val.col1 + '</cell><cell>' + val.col2 +
                    '</cell><cell>' + val.col3 + '</cell><cell><img src="../../img/zxyp/rx/' +
                    (val.col4 ? 'like' : 'dislike') + '.png"></cell></row>');
            });
            sugon.renderNav($('.nav3 > div'), pageNum, data.totalPage, initRight2);
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

    // 查询按钮事件
    $('.pop-search').click(e => {
        let input = $('.search-input').val(), reg = /\S/;
        if (reg.test(input)) {
            initLeft2();
        }
    });

    // 热搜点击查询事件
    $('.left1').on('click', 'a', e => {
        $('.search-input').val(e.target.innerHTML);
        $('.pop-search').click();
    });

    // 添加按钮事件
    $('.add-btn').click(e => {
        let input = $('.add-event-input').val(), reg = /\S/;
        let {deptId, date1, date2} = window.dialogParams;
        if (reg.test(input)) {
            sugon.request(sugon.interFaces.zxyp.rx.setting.addRight1, {name: input, deptId, date1, date2})
                .then(result => {
                    initRight1();
                    result.code == '200' && sugon.showMessage(result.msg, 'success');
                });
        } else {
            sugon.showMessage('请输入关键字！', 'warning');
        }
    });

    // 删除按钮事件
    $('.right-up').on('click', 'img', e => {
        let {deptId, date1, date2} = window.dialogParams;
        sugon.request(sugon.interFaces.zxyp.rx.setting.deleteRight1, {name: $(e.target).prev().html(), deptId, date1, date2})
            .then(result => {
                initRight1();
                result.code == '200' && sugon.showMessage(result.msg, 'success');
            });
    });

    // 收藏按钮事件
    $('.right-down').on('click', 'img', e => {
        let $target = $(e.target), src = $target.attr('src');
        if (src.indexOf('dislike') > -1) {
            let name = $target.parent().prev().prev().prev().html();
            name = name.replace(/\d、/, '');
            sugon.request(sugon.interFaces.zxyp.rx.setting.addRight2, {name}).then(result => {
                if (result.code == '200') {
                    initRight1();
                    $target.attr('src', '../../img/zxyp/rx/like.png');
                    sugon.showMessage(result.msg, 'success');
                } else {
                    sugon.showMessage('收藏失败！', 'error');
                }
            });
        }
    });

});