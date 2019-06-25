/* Created by handsome qiu */
requirejs(['common', 'ec', 'domtoimage'], (sugon, ec, domtoimage) => {

    let searchRuler = {}, uuid = window.dialogParams.uuid;

    // 初始化标题
    function initTitle(result) {
        result.data.map((val, index) => {
            $('#pop-container > header > span').eq(index).html(val);
        });
    }

    function init1_1(result) {
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
    }

    function init1_2(result) {
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
        };
        let chart = ec.init(document.getElementById('chart1'));
        chart.setOption(option);
        $('.fieldset1 footer').html(result.content);
    }

    function init2_1(result) {
        let $body = $('.tab-container').empty();
        $body.append('<div><div>警情类别</div><div>警情量</div><div>满意度</div><div>同比</div></div>');
        result.data.map(val => {
            $body.append('<div><div>' + val.name + '</div><div>' + val.value1 + '</div><div>' + val.value2 + '</div><div>' + val.value3 + '</div></div>');
        });
        $('.footer1').html(result.content);
    }

    function init2_2(result) {
        $('.footer2').html(result.content);
        let chart = ec.init(document.getElementById('chart2'));
        let total = 0;
        result.data.map(val => {
            total += Number(val.value);
        });
        let option = {
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
        chart.setOption(option);
    }

    function init3_1(result) {
        let xData = [], yData = [];
        result.data.map(val => {
            xData.push(val.name);
            yData.push(val.value);
        });
        let option = {
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
                        color: '#000',
                        interval: 0
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
        let chart = ec.init(document.getElementById('chart3'));
        chart.setOption(option);
        $('.fieldset3 footer').html(result.content);
    }

    function init3_2(result) {
        let xData = [], yData = [];
        result.data.map(val => {
            xData.push(val.value);
            yData.push(val.name);
        });
        let chart = ec.init(document.getElementById('chart4'));
        let option = {
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
        chart.setOption(option);
    }

    function init4_1(result) {
        $('.fieldset4 footer').html(result.content);
        let $body = $('#chart5').empty(), data = result.data;
        var string_ = '';
        for (var i = 0; i < data.length; i++) {
            var string_f = data[i].name;
            var string_n = data[i].value;
            string_ += "{text: '" + string_f + "', weight: '" + string_n + "',html: {'class': 'span_list'}},";
        }
        var string_list = string_;
        var word_list = eval("[" + string_list + "]");
        $body.jQCloud(word_list);
    }

    function init4_2() {
        $('.zjfx-content').html($('.textarea-div').val());
    }

    // 把img生成的img图片传给后台
    function postImg() {
        domtoimage.toJpeg(document.getElementById('pop-container')).then(dataUrl => {
            return sugon.request(sugon.interFaces.znbg.ywfxbg.postImg, {uuid: uuid, url: dataUrl});
        }).then(result => {
            $('#pop-container').remove();
            sugon.removeLoading();
        });
    }

    // 初始化页面
    function initPage() {
        searchRuler.deptId = $('#deptId').val();
        searchRuler.date1 = $('#date1').val();
        searchRuler.date2 = $('#date2').val();
        sugon.request(sugon.interFaces.znbg.ywfxbg.getJcjPreview, searchRuler).then(result => {
            initTitle(result.title);
            init1_1(result.data1);
            init1_2(result.data2);
            init2_1(result.data3);
            init2_2(result.data4);
            init3_1(result.data5);
            init3_2(result.data6);
            init4_1(result.data7);
            init4_2();
            postImg();
        });
    }

    // 程序入口
    $(function () {
        initPage();
    });
});