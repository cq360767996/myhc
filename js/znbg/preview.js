/* Created by handsome qiu */
requirejs(['common', 'ec'], (sugon, ec) => {

    function init1_1() {
        sugon.requestJson({
            type: 'post',
            url: sugon.interFaces.znbg.ywfxbg.preview.init1_1,
            data: {}
        }, result => {
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
        });
    }

    function init1_2() {
        sugon.requestJson({
            type: 'post',
            url: sugon.interFaces.znbg.ywfxbg.preview.init1_2,
            data: {}
        }, result => {
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
        });
    }

    function init2_1() {
        sugon.requestJson({
            type: 'post',
            url: sugon.interFaces.znbg.ywfxbg.preview.init2_1,
            data: {}
        }, result => {
            let $body = $('.tab-container').empty();
            $body.append('<div><div>警情类别</div><div>警情量</div><div>满意度</div><div>同比</div></div>');
            result.data.map(val => {
                $body.append('<div><div>' + val.jqlb + '</div><div>' + val.jql + '</div><div>' + val.myd + '</div><div>' + val.tb + '</div></div>');
            });
        });
    }

    function init2_2() {
        sugon.requestJson({
            type: 'post',
            url: sugon.interFaces.znbg.ywfxbg.preview.init2_2,
            data: {}
        }, result => {
            let data1 = [], data2 = [], xData = [];
            result.data1.map(val => {
                xData.push(val.name);
                data1.push(val.value1);
                data2.push(val.value2);
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
                            interval: 0,
                            textStyle: {
                                color: '#000'
                            }
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#d5d8e1'
                            }
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        show: true,
                        axisTick: {show: false},
                        axisLabel: {
                            formatter: '{value}%'
                        },
                        min: 0,
                        max: 100
                    }
                ],
                series: [
                    {
                        type: 'bar',
                        barWidth: 15,
                        color: '#3A9BBE',
                        data: data1,
                    },
                    {
                        type: 'bar',
                        barWidth: 15,
                        color: '#DC7041',
                        data: data2,
                    }
                ]
            };
            let chart = ec.init(document.getElementById('chart2'));
            chart.setOption(option);

            let $body = $('.fieldset2 footer').empty();
            result.data2.map((val, index) => {
                $body.append('<div><div>' + (index + 1) + '、' + val.content + '</div><div>' + val.float + '</div><div>' + val.percent + '</div></div>');
            });

        });

    }

    function init3_1() {
        sugon.requestJson({
            type: 'post',
            url: sugon.interFaces.znbg.ywfxbg.preview.init3_1,
            data: {}
        }, result => {
            $('.fieldset3 footer').html(result.content);
            let chart = ec.init(document.getElementById('chart3'));
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
            };
            chart.setOption(option);
        });

    }

    function init3_2() {
        sugon.requestJson({
            type: 'post',
            url: sugon.interFaces.znbg.ywfxbg.preview.init3_2,
            data: {}
        }, result => {
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
                    right: 15,
                    bottom: 0,
                    top: 0,
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    axisTick: {
                        show: false
                    }
                },
                yAxis: {
                    type: 'category',
                    axisLine: {
                        show: false
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
            };
            chart.setOption(option);
        });
    }

    function init4_1() {
        sugon.requestJson({
            type: 'post',
            url: sugon.interFaces.znbg.ywfxbg.preview.init4_1,
            data: {}
        }, result => {
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
        });
    }

    function init4_2() {
        sugon.requestJson({
            type: 'post',
            url: sugon.interFaces.znbg.ywfxbg.preview.init4_2,
            data: {}
        }, result => {
            $('.zjfx-content').html(result.data);
        });
    }

    // 初始化页面
    function initPage() {
        init1_1();
        init1_2();
        init2_1();
        init2_2();
        init3_1();
        init3_2();
        init4_1();
        init4_2();
    }

    // 程序入口
    $(function () {
        initPage();
        $('.pop-mask').show();
    });

    $('.pop-container i').on({
        // mouseover: e => {
        //     $(e.target).css('visibility', 'visible');
        // },
        // mouseout: e => {
        //     $(e.target).css('visibility', 'hidden');
        // },
        click: e => {
            $('.pop-mask').hide();
            $(e.target).parent().parent().remove();
        }
    });

});