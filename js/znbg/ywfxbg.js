/* Created by handsome qiu */
requirejs(['common', 'ec', 'domtoimage', 'jqcloud'], (sugon, ec, domtoimage) => {

    let charts = [], rightPanelData;
    // 全局查询尺度
    let searchRuler = {};
    let popFunc = {
        initTitle(result) {
            result.data.map((val, index) => {
                $('#pop-container > header > span').eq(index).html(val);
            });
        },
        init1_1(result) {
            result.data.map((val, index) => {
                let html;
                if (index < 4) {
                    html = val + '&nbsp;&nbsp;条';
                } else if (index == 4) {
                    html = val + '&nbsp;&nbsp;件';
                } else {
                    html = val + '%';
                }
                $('.value1-1').eq(index).html(html);
            });
        },
        init1_2(result, isHidden) {
            let xData = [], yData = [], len = result.data.length;
            result.data.map(val => {
                xData.push(val.name);
                yData.push(val.value);
            });
            result.data.sort((v1, v2) => {
                return Number(v1.value) - Number(v2.value);
            });
            let min = len > 0 && result.data[0].value, max = len > 0 && result.data[len - 1].value;
            let diff = (max - min) / 2;
            min = min - diff;
            max = Number(max) + Number(diff);
            min = Number(min).toFixed(2);
            max = max > 100 ? 100 : Number(max).toFixed(2);
            let option = {
                animation: false,
                grid: {
                    top: 15,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    axisTick: {
                        show: false
                    },
                    data: xData
                },
                yAxis: {
                    type: 'value',
                    min: min,
                    max: max,
                    splitLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show: true,
                        formatter: '{value}%'
                    }
                },
                series: [{
                    data: yData,
                    type: 'line',
                    color: '#2887a7',
                    label: {
                        show: true,
                        position: 'top',
                        formatter: '{c}%'
                    },
                    smooth: true
                }]
            };
            let dom = document.getElementById(isHidden ? 'hidden-chart1' : 'chart1');
            charts[0] = ec.init(dom);
            charts[0].setOption(option, true);
            $('.fieldset1 footer').html(result.content);
        },
        init2_1(result) {
            let $body = $('.tab-container').empty();
            $body.append('<div><div>警情类别</div><div>满意度</div><div>同比</div><div>环比</div></div>');
            result.data.map(val => {
                $body.append('<div><div>' + val.name + '</div><div>' + val.value1 + '</div><div>' + val.value2 + '</div><div>' + val.value3 + '</div></div>');
            });
            $('.footer1').html(result.content);
        },
        init2_2(result, isHidden) {
            $('.footer2').html(result.content);
            let dom = document.getElementById(isHidden ? 'hidden-chart2' : 'chart2');
            charts[1] = ec.init(dom);
            let total = 0;
            result.data.map(val => {
                total += Number(val.value);
            });
            let option = {
                animation: false,
                tooltip: {
                    show: true
                },
                series: [{
                    color: ['#A770B3', '#AF8744', '#ED7D31', '#3A9BBE', '#1D84C6', '#6463AF'],
                    name: '',
                    type: 'pie',
                    clockWise: false,
                    center: ['50%', '50%'],
                    radius: ['40%', '56%'],
                    hoverAnimation: false,
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                position: 'outside',
                                rich: {
                                    white: {
                                        color: '#ddd',
                                        align: 'center'
                                    }
                                },
                                formatter: '{b}：\n{c}%'
                            },
                            labelLine: {
                                show: true,
                                length: 8,
                                length2: 5
                            }
                        }
                    },
                    data: result.data
                }]
            };
            charts[1].setOption(option, true);
        },
        init3_1(result, isHidden) {
            let xData = [], yData = [];
            result.data.map(val => {
                xData.push(val.name);
                yData.push(val.value);
            });
            let option = {
                animation: false,
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    left: 0,
                    top: 20,
                    right: 0,
                    bottom: 30,
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        axisTick: {show: false},
                        splitArea: {show: false},
                        data: xData,
                        axisLabel: {
                            color: '#000',
                            interval: 0,
                            formatter: param => {
                                let tempStr = "";
                                if (param.length > 4) {
                                    for (var i = 0; i < param.length; i++) {
                                        if (i % 4 == 3) {
                                            tempStr += param[i] + "\n";
                                        } else {
                                            tempStr += param[i];
                                        }
                                    }
                                } else {
                                    tempStr = param;
                                }
                                return tempStr;
                            }
                        },
                        axisLine: {
                            color: '#000'
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        show: true,
                        splitLine: {
                            show: false
                        },
                        axisTick: {show: false},
                        axisLabel: {
                            formatter: '{value}'
                        }
                    }
                ],
                series: [
                    {
                        type: 'bar',
                        barWidth: 15,
                        color: '#3A9BBE',
                        label: {
                            show: true,
                            position: 'top',
                            color: '#000'
                        },
                        data: yData
                    }
                ]
            };
            let dom = document.getElementById(isHidden ? 'hidden-chart3' : 'chart3');
            charts[2] = ec.init(dom);
            charts[2].setOption(option, true);
            $('.fieldset3 footer').html(result.content);
        },
        init3_2(result, isHidden) {
            let xData = [], yData = [];
            result.data.map(val => {
                xData.push(val.value);
                yData.push(val.name);
            });
            let dom = document.getElementById(isHidden ? 'hidden-chart4' : 'chart4');
            charts[3] = ec.init(dom);
            let option = {
                animation: false,
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                color: ["#2C8FCE"],
                grid: {
                    left: 0,
                    right: 30,
                    bottom: 0,
                    top: 0,
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    }
                },
                yAxis: {
                    type: 'category',
                    axisLine: {
                        show: true
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        interval: 0
                    },
                    data: yData
                },
                series: [{
                    type: 'bar',
                    barWidth: 10,
                    label: {
                        show: true,
                        position: 'right',
                        color: '#000'
                    },
                    data: xData
                }]
            };
            charts[3].setOption(option, true);
        },
        init4_1(result, isHidden) {
            $('.fieldset4 footer').html(result.content);
            let $body = $((isHidden ? '#hidden-chart5' : '#chart5')).empty(), data = result.data;
            var string_ = '';
            for (var i = 0; i < data.length; i++) {
                var string_f = data[i].name;
                var string_n = data[i].value;
                string_ += "{text: '" + string_f + "', weight: '" + string_n + "',html: {'class': 'span_list'}},";
            }
            var string_list = string_;
            var word_list = eval("[" + string_list + "]");
            $body.jQCloud(word_list);
        },
        init4_2() {
            $('.zjfx-content').html($('.textarea-div').val());
        },
        postImg() { // 把img生成的img图片传给后台
            domtoimage.toJpeg(document.getElementById('pop-container')).then(dataUrl => {
                if (sugon.isPublished) {
                    return sugon.request(sugon.interFaces.znbg.ywfxbg.postImg, {uuid: searchRuler.uuid, url: dataUrl});
                } else {
                    return new Promise((resolve, reject) => {
                        let a = document.createElement('a');
                        a.href = dataUrl;
                        a.style.display = 'none';
                        a.download = 'xx.jpg';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        resolve();
                    });
                }
            }).then(result => {
                sugon.removeLoading();
                sugon.showMessage('报告已生成！', 'success');
            });
        },
        initPopPage(condition) { // 初始化页面
            sugon.request(sugon.interFaces.znbg.ywfxbg.getJcjPreview, condition).then(result => {
                this.initTitle(result.title);
                this.init1_1(result.data1);
                this.init1_2(result.data2);
                this.init2_1(result.data3);
                this.init2_2(result.data4);
                this.init3_1(result.data5);
                this.init3_2(result.data6);
                this.init4_1(result.data7);
                this.init4_2();
                if (condition.uuid) {
                    this.postImg();
                    // setTimeout(this.postImg, 2000);
                } else {
                    let $body = $('#pop-container').css('top', '50%').css('left', '50%').css('margin-top', '-345px')
                        .css('margin-left', '-640px').css('z-index', 3);
                    let $i = $('#pop-container > header > i').show(), $mask = $('.pop-mask').show();
                    $i.unbind().bind('click', e => { // 绑定关闭按钮
                        $i.hide();
                        $mask.hide();
                        $body.css('top', 0).css('left', 0).css('margin-top', 0)
                            .css('margin-left', 0).css('z-index', -2);
                    });
                }
            });
        }
    };

    // 获取当前时间并加减固定月份
    function getDate(difference) {
        let now = new Date();
        let year = now.getFullYear();
        let month = now.getMonth() + 1;
        let sum = year * 12 + month + difference;
        let resultYear = parseInt(sum / 12);
        let resultMonth = sum % 12;
        if (resultMonth == 0) {
            return resultYear - 1 + "-12";
        } else {
            resultMonth = resultMonth < 10 ? "0" + resultMonth : resultMonth;
            return resultYear + '-' + resultMonth;
        }
    }

    //获取树数据
    function getTree() {
        var treeData = [];
        sugon.requestJson({
            type: "POST",
            url: sugon.interFaces.zxyp.aj.Tree
        }, function (result) {
            treeData = result.data;
        });
        return treeData;
    }

    // 初始化查询栏
    function initSearchBar() {
        let $date1 = $('#date1'), $date2 = $('#date2'), $deptId = $('#deptId'), $deptName = $('#deptName'),
            $leftTree = $('.left-tree');
        let lastMonth = getDate(-1);
        $date1.val(searchRuler.date1 = getDate(-4));
        $date2.val(searchRuler.date2 = getDate(-2));
        $deptId.val(searchRuler.deptId = '2014110416460086100000002942');
        $deptName.val(searchRuler.deptName = '南京市公安局');

        $date1.datetimepicker({
            format: 'yyyy-mm',
            autoclose: true,
            todayBtn: true,
            startView: 'year',
            minView: 'year',
            maxView: 'decade',
            endDate: lastMonth,
            language: 'zh-CN'
        }).change(() => {
            searchRuler.date1 = $('.date1').val();
        });
        $date2.datetimepicker({
            format: 'yyyy-mm',
            autoclose: true,
            todayBtn: true,
            startView: 'year',
            minView: 'year',
            maxView: 'decade',
            endDate: lastMonth,
            language: 'zh-CN'
        }).change(() => {
            searchRuler.date2 = $('.date2').val();
        });
        let offset = $deptName.offset();
        // 设置下拉框宽度
        $leftTree.css('width', $deptName.outerWidth()).css('left', offset.left - 100).css('top', offset.top - 40).treeview({
            data: getTree(),
            levels: 1,
            onNodeSelected: function (event, node) {
                $deptName.val(searchRuler.deptName = node.text);
                $deptId.val(searchRuler.deptId = node.id);
                $leftTree.css("visibility", "hidden");
            },
            showCheckbox: false//是否显示多选
        });
        $deptName.click(function () {
            $leftTree.css("visibility", "visible");
        });
    }

    // 初始化右侧文件列表
    function initRightPanel() {
        sugon.requestJson({
            type: 'post',
            url: sugon.interFaces.znbg.ywfxbg.getFileList,
            data: {
                deptId: searchRuler.deptId
            }
        }, result => {
            rightPanelData = result.data;
            let $tabBody = $('.tab-body').empty();
            result.data.map(val => {
                $tabBody.append('<div url="' + val.url + '" containImg="' + val.containImg + '' + '">' +
                    '<div><img src="../../img/znbg/checkbox.png"></div><div><img src="../../img/znbg/word.png"><span>' +
                    val.name + '</span></div><div>' + val.date + '</div><div><img class="report-preview" src="../../img/znbg/preview.png">' +
                    '<img class="report-download" src="../../img/znbg/download.png">' +
                    '<img class="report-delete" src="../../img/znbg/delete.png"></div></div>');
            });
        });
    }

    // 上传图片
    function uploadImg(id, imgUrl, uuid) {
        if (sugon.isPublished) {
            sugon.request(sugon.interFaces.znbg.ywfxbg.uploadImg, {
                uuid: uuid,
                id: id,
                img: imgUrl
            });
        } else {
            let img = new Image();
            img.src = imgUrl;
            document.body.appendChild(img);
        }
    }

    // 生成报告
    function generateReport(uuid) {
        popFunc.initPopPage(searchRuler);
        let $span = $('.span-div'), codeArr = [];
        $span.each((index, ele) => {
            let $ele = $(ele);
            $ele.find('img').attr('src').indexOf('hover') > -1 && codeArr.push($ele.attr('code'));
        });
        searchRuler.code = codeArr.join(',');
        searchRuler.content = $('.textarea-div').val();
        searchRuler.uuid = uuid;
        sugon.request(sugon.interFaces.znbg.ywfxbg.generateReport, searchRuler).then(result => {
            result.data.map(val => {
                switch (val.type) {
                    case "1":
                        popFunc.init1_2(val, true);
                        break;
                    case "2":
                        popFunc.init2_2(val, true);
                        break;
                    case "3":
                        popFunc.init3_1(val, true);
                        break;
                    case "4":
                        popFunc.init3_2(val, true);
                        break;
                    case "5":
                        popFunc.init4_1(val, true);
                        break;
                }
            });
            setTimeout(drawImage, 2000, result, uuid);
        });
    }

    // 遍历图片
    function drawImage(result, uuid) {
        result.data.map(val => {
            switch (val.type) {
                case "1":
                    uploadImg(val.id, charts[0].getDataURL(), uuid);
                    break;
                case "2":
                    uploadImg(val.id, charts[1].getDataURL(), uuid);
                    break;
                case "3":
                    uploadImg(val.id, charts[2].getDataURL(), uuid);
                    break;
                case "4":
                    uploadImg(val.id, charts[3].getDataURL(), uuid);
                    break;
                case "5":
                    domtoimage.toPng(document.getElementById('hidden-chart5')).then(dataUrl => {
                        uploadImg(val.id, dataUrl, uuid);
                    });
                    break;
            }
        });
        initRightPanel();
    }

    // 程序入口
    $(function () {
        initSearchBar();
        initRightPanel();
    });

    // 设置按钮点击事件
    $('.setting-btn').click(() => {
        $('.pop-mask').show();
        $('.setting-aside').show();
    });

    // 关闭按钮点击事件
    $('.setting-cancel').click(() => {
        $('.pop-mask').hide();
        $('.setting-aside').hide();
    });

    // 确定按钮事件
    $('.setting-confirm').click(() => {
        let $div = $('.setting-ul > li > div'), typeArr = [];
        for (let i = 0, len = $div.length; i < len; i++) {
            let $dom = $div.eq(i);
            $dom.attr('class') == 'switch-on' && typeArr.push($dom.attr('type'));
        }
        sugon.requestJson({
            type: 'post',
            url: sugon.interFaces.znbg.ywfxbg.submitSetting,
            data: {
                typeArr: typeArr.join(',')
            }
        }, result => {
            let $article = $('.article-div'), $checkbox = $('.checkbox-div'), rawData = [
                '民意110各业务回访情况分析，包括短信、电话回访分析，群众回复分析，工单分析，回访满意度分析等。',
                '民意110各业务民意指数分析，包括民意指数趋势分析，各分类业务指数分析，及下滑指数预警。',
                '民意110各业务具体问题分析，包括各类业务群众诉求集中情况分析，不同业务类别具体问题分析。',
                '民意110各业务群众热词分析，包括各类业务群众回复热词分析，词频统计研判分析。'];
            if (typeArr.length === 0) {
                rawData.map((val, index) => {
                    $article.eq(index).html(val);
                });
                $checkbox.attr('src', '../../img/znbg/checkbox.png');
            } else {
                $article.html('');
                result.data.map((val1, index) => {
                    let $singleArticle = $article.eq(index);
                    val1.map(val2 => {
                        let $div = $('<div/>');
                        val2.map(val3 => {
                            let $span = $('<span/>').addClass('span-div').attr('code', val3.value);
                            $span.append('<img src="../../img/znbg/checkbox_hover.png"><span>' + val3.name + '</span>');
                            $div.append($span);
                        });
                        $singleArticle.append($div);
                    });

                });
                $checkbox.attr('src', '../../img/znbg/checkbox_hover.png');
                // 报告生成事件
                $('.report-generator').on('click', () => {
                    sugon.renderLoading();
                    generateReport(sugon.uuid());
                });
            }
            $('.setting-aside').hide();
            $('.pop-mask').hide();
        });
    });

    // 全选按钮事件
    $('.checkbox-div').click((e) => {
        let $target = $(e.target), checkboxOn = '../../img/znbg/checkbox_hover.png',
            checkboxOff = '../../img/znbg/checkbox.png',
            $selectSingle = $target.parent().next().find('img'),
            checkSelect = $target.attr('src').indexOf('hover') > -1 ? checkboxOff : checkboxOn;
        $selectSingle.attr('src', checkSelect);
        $target.attr('src', checkSelect);
    });

    // 单选按钮事件
    $('fieldset').on('click', '.span-div', e => {
        let $target = $(e.target), checkboxOn = '../../img/znbg/checkbox_hover.png',
            checkboxOff = '../../img/znbg/checkbox.png';
        if (!$target.hasClass('span-div')) {
            $target = $target.parent();
        }
        let $img = $target.find('img'), $parent = $target.parent().parent(), $innerImg = $parent.find('img'),
            $selectAll = $parent.prev().find('.checkbox-div'), hoverTimes = 0, len = $innerImg.length;
        $img.attr('src', $img.attr('src').indexOf('hover') > -1 ? checkboxOff : checkboxOn);
        for (let i = 0; i < len; i++) {
            let imgUrl = $innerImg.eq(i).attr('src');
            imgUrl.indexOf('hover') > -1 && hoverTimes++;
        }
        $selectAll.attr('src', hoverTimes === 0 ? checkboxOff : checkboxOn);
    });

    // 切换按钮事件
    $('.setting-ul > li > div').on('click', e => {
        let $target = $(e.target), className = $target.attr('class'), switchOn = 'switch-on', switchOff = 'switch-off';
        $target.removeClass(className);
        $target.addClass(className == switchOn ? switchOff : switchOn);
    });

    // textarea失焦事件
    $('.textarea-div').on('blur', e => {
        let $target = $(e.target), text = $target.val(), reg = /\S/, checkboxOn = '../../img/znbg/checkbox_hover.png',
            checkboxOff = '../../img/znbg/checkbox.png';
        $target.parent().prev().find('img').eq(0).attr('src', reg.test(text) ? checkboxOn : checkboxOff);
    });

    // 预览事件
    $('.tab-body').on('click', '.report-preview', e => {
        let $target = $(e.target), offset = $target.offset(), containImg = $target.parent().parent().attr('containImg'),
            url = $target.parent().parent().attr('url'), selectedRow, $preview = $('.pop-menu-preview');
        if ($preview.length === 0) {
            for (let i = 0, len = rightPanelData.length; i < len; i++) {
                if (rightPanelData[i].url === url) {
                    selectedRow = rightPanelData[i];
                    break;
                }
            }
            if (containImg === "1") {
                $('#ui-view').append('<div class="pop-menu pop-menu-preview" style="top: ' + (offset.top - 38) + 'px;left: ' + (offset.left - 128) +
                    'px;"><a class="simple-pre">简报预览</a><a href="' + selectedRow.pdfUrl + '" target="_blank">报告预览</a></div>');
                // 绑定点击事件
                $('.pop-menu-preview > a').unbind().bind('click', e => {
                    $('.pop-menu-preview').remove();
                    if ($(e.target).hasClass('simple-pre')) {
                        popFunc.initPopPage({deptId, date1, date2} = selectedRow);
                    }
                });
            } else {
                let link = document.createElement('a');
                link.style.display = 'none';
                link.href = selectedRow.pdfUrl;
                link.target = '_blank';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } else {
            $preview.remove();
        }
    });

    // 下载事件
    $('.tab-body').on('click', '.report-download', e => {
        let $target = $(e.target), offset = $target.offset(), containImg = $target.parent().parent().attr('containImg'),
            url = $target.parent().parent().attr('url'), selectedRow, $download = $('.pop-menu-download');
        if ($download.length === 0) {
            for (let i = 0, len = rightPanelData.length; i < len; i++) {
                if (rightPanelData[i].url === url) {
                    selectedRow = rightPanelData[i];
                    break;
                }
            }
            if (containImg === "1") {
                $('#ui-view').append('<div class="pop-menu pop-menu-download" style="top: ' + (offset.top - 38) +
                    'px;left: ' + (offset.left - 128) + 'px;"><a href="' + selectedRow.imgUrl +
                    '" download="' + selectedRow.fileName2 + '">简报下载</a><a href="' +
                    selectedRow.url + '" download="' + selectedRow.fileName1 + '">报告下载</a></div>');
                // 绑定点击事件
                $('.pop-menu-download > a').unbind().bind('click', e => {
                    $('.pop-menu-download').remove();
                });
            } else {
                let link = document.createElement('a');
                link.style.display = 'none';
                link.href = selectedRow.url;
                link.download = selectedRow.fileName1;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } else {
            $download.remove();
        }
    });

    // 删除事件
    $('.tab-body').on('click', '.report-delete', e => {
        let $target = $(e.target), id = $target.parent().parent().attr('url'), selectedRow;
        for (let i = 0, len = rightPanelData.length; i < len; i++) {
            if (rightPanelData[i].url === id) {
                selectedRow = rightPanelData[i];
                break;
            }
        }
        let {url, imgUrl, pdfUrl} = selectedRow;
        sugon.request(sugon.interFaces.znbg.ywfxbg.deleteReport, {url, imgUrl, pdfUrl}).then(result => {
            initRightPanel();
            result.code ? sugon.showMessage('删除成功！', 'success') :
                sugon.showMessage('删除失败！', 'error');
        });
    });
});