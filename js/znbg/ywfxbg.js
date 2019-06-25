/* Created by handsome qiu */
requirejs(['common', 'ec', 'domtoimage'], (sugon, ec, domtoimage) => {

    // 全局查询尺度
    let searchRuler = {};

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
        debugger
        sugon.requestJson({
            type: 'post',
            url: sugon.interFaces.znbg.ywfxbg.getFileList,
            data: {
                deptId: searchRuler.deptId
            }
        }, result => {
            let $tabBody = $('.tab-body').empty();
            result.data.map(val => {
                $tabBody.append('<div url="' + val.url + '"><div><img src="../../img/znbg/checkbox.png"></div>' +
                    '<div><img src="../../img/znbg/word.png"><span>' + val.name + '</span></div><div>' + val.date +
                    '</div><div><img class="preview-report" imgUrl="' + val.imgUrl + '" pdfUrl="' + val.pdfUrl +
                    '" containImg="' + val.containImg + '' + '" src="../../img/znbg/preview.png">' +
                    '<img class="download-img" src="../../img/znbg/download.png">' +
                    '<img src="../../img/znbg/delete.png"></div></div>');
            });
        });
    }

    // 上传图片
    function uploadImg(result, imgUrl, uuid) {
        sugon.request(sugon.interFaces.znbg.ywfxbg.uploadImg, {
            uuid: uuid,
            id: result.id,
            img: imgUrl
        });
    }

    // 初始化隐藏的图表
    function initHiddenCharts(result, uuid) {
        let dom = 'hidden-chart';
        if (result.type != 5) {
            let chart = ec.init(document.getElementById(dom));
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
            let option = [
                {
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
                        smooth: true
                    }]
                },
                {
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
                                    formatter: '{b}：{c}'
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
                },
                {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    grid: {
                        left: 0,
                        top: 15,
                        right: 0,
                        bottom: 0,
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            axisTick: {show: false},
                            splitArea: {show: false},
                            data: xData,
                            axisLabel: {
                                color: '#000'
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
                            data: yData
                        }
                    ]
                },
                {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    color: ["#2C8FCE"],
                    grid: {
                        left: 0,
                        right: 15,
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
                        },
                    },
                    yAxis: {
                        type: 'category',
                        axisLine: {
                            show: true
                        },
                        axisTick: {
                            show: false
                        },
                        data: yData
                    },
                    series: [{
                        type: 'bar',
                        barWidth: 10,
                        data: xData
                    }]
                }
            ];
            chart.setOption(option[result.type - 1]);
            setTimeout(uploadImg, 2000, result, chart.getDataURL(), uuid);
        } else {
            let $body = $('#' + dom).empty(), data = result.data;
            let string_ = '';
            for (let i = 0; i < data.length; i++) {
                let string_f = data[i].name;
                let string_n = data[i].value;
                string_ += "{text: '" + string_f + "', weight: '" + string_n + "',html: {'class': 'span_list'}},";
            }
            let string_list = string_;
            let word_list = eval("[" + string_list + "]");
            $body.jQCloud(word_list);
            domtoimage.toJpeg(document.getElementById(dom)).then(dataUrl => {
                setTimeout(uploadImg, 2000, result, dataUrl, uuid);
            });
        }
    }

    // 生成报告
    function generateReport(uuid) {
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
                initHiddenCharts(val, uuid);
            });
            requirejs(['text!../../views/znbg/preview.html'], ele => {
                window.dialogParams = {
                    uuid: uuid,
                    initRightPanel: initRightPanel,
                    deptId: searchRuler.deptId,
                    date1: searchRuler.date1,
                    date2: searchRuler.date2
                };
                $("#ui-view").append(ele);
            });
        });
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

    // 下载按钮事件
    $('.tab-body').on('click', '.download-img', e => {
        let link = document.createElement('a'), $target = $(e.target);
        link.download = '';
        link.style.display = 'none';
        link.href = $target.parent().parent().attr('url');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // 预览按钮事件
    $('.tab-body').on('click', '.preview-report', e => {
        let $target = $(e.target), offset = $target.offset(), containImg = $target.attr('containImg'),
            imgUrl = $target.attr('imgUrl'), pdfUrl = $target.attr('pdfUrl');
        if (containImg === "1") {
            $('#ui-view').append('<div class="pop-menu" style="top: ' + (offset.top - 38) + 'px;left: ' + (offset.left - 128) +
                'px;"><a href="' + imgUrl + '" target="_blank">简报预览</a><a href="' + pdfUrl + '" target="_blank">报告预览</a></div>');
            // 绑定点击事件
            $('.pop-menu > a').unbind().bind('click', e => {
                $('.pop-menu').remove();
            });
        } else {
            let link = document.createElement('a');
            link.style.display = 'none';
            link.href = pdfUrl;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    });

});