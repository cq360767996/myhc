requirejs.config({
    baseUrl: 'js',
    urlArgs: '1.0.0',
    paths: {
        ec: '../lib/echarts.min',
        ecPlugin: '../lib/echarts-liquidfill.min',
        text: '../lib/text',
        css: '../lib/require.css.min',
        highcharts: '../lib/highcharts',
        high3D: '../lib/highcharts-3d',
        _: '../lib/lodash.min',
        L: '../lib/leaflet/leaflet',
        iclient: '../lib/leaflet/iclient9-leaflet-es6.min',
        heat: '../lib/leaflet/leaflet-heat',
        markerCluster: '../lib/leaflet/leaflet.markercluster',
        plot: '../lib/leaflet/iclient9-plot-leaflet-es6.min',
        domtoimage: '../lib/dom-to-image.min',
        jqcloud: '../lib/jqcloud',
        vipspa: '../lib/vipspa.min',
        rx_setting: 'zxyp/rx_setting'
    },
    shim: {
        high3D: {
            deps: ['highcharts']
        },
        ecPlugin: {
            deps: ['L']
        },
        iclient: {
            deps: ['L']
        },
        heat: {
            deps: ['L']
        },
        markerCluster: {
            deps: ['L']
        },
        plot: {
            deps: ['L', 'iclient']
        },
        domtoimage: {
            exports: 'domtoimage'
        },
        vipspa: {
            exports: 'vipspa'
        }
    }
});

requirejs(['vipspa'], function (vipspa) {

    let router = {
        'myzs': {
            parent: 'myhc',
            templateUrl: 'views/myhc/myzs.html',
            controller: 'js/myhc/myzs.js'
        },
        'myjz': {
            parent: 'myhc',
            templateUrl: 'views/myhc/myjz.html',
            controller: 'js/myhc/myjz.js'
        },
        'rdwt': {
            parent: 'myhc',
            templateUrl: 'views/myhc/rdwt.html',
            controller: 'js/myhc/rdwt.js'
        },
        'rdwt/setting': {
            parent: 'myhc',
            templateUrl: 'views/myhc/rdwt_setting.html',
            controller: 'js/myhc/rdwt_setting.js'
        },
        'dwjx': {
            parent: 'myhc',
            templateUrl: 'views/myhc/dwjx.html',
            controller: 'js/myhc/dwjx.js'
        },
        'myzd': {
            parent: 'myhc',
            templateUrl: 'views/myhc/myzd.html',
            controller: 'js/myhc/myzd.js'
        },
        'myys': {
            parent: 'myhc',
            templateUrl: 'views/myhc/myys.html',
            controller: 'js/myhc/myys.js'
        },
        'myys/ysxq': {
            parent: 'myhc',
            templateUrl: 'views/myhc/ysxq.html',
            controller: 'js/myhc/ysxq.js'
        },
        'myys/ysxq/detail': {
            parent: 'myhc',
            templateUrl: 'views/myhc/detail.html',
            controller: 'js/myhc/detail.js'
        },
        'dwjx/sqxz': {
            parent: 'myhc',
            templateUrl: 'views/myhc/sqxz.html',
            controller: 'js/myhc/sqxz.js'
        },
        'dwjx/ywgk': {
            parent: 'myhc',
            templateUrl: 'views/myhc/ywgk.html',
            controller: 'js/myhc/ywgk.js'
        },
        'dwjx/jtwt': {
            parent: 'myhc',
            templateUrl: 'views/myhc/jtwt.html',
            controller: 'js/myhc/jtwt.js'
        },
        'dwjx/dwjs': {
            parent: 'myhc',
            templateUrl: 'views/myhc/dwjs.html',
            controller: 'js/myhc/dwjs.js'
        },
        'dwjx/znfx': {
            parent: 'myhc',
            templateUrl: 'views/myhc/znfx.html',
            controller: 'js/myhc/znfx.js'
        },
        'jcj': {
            parent: 'zxyp',
            templateUrl: 'views/zxyp/jcj.html',
            controller: 'js/zxyp/jcj.js'
        },
        'aj': {
            parent: 'zxyp',
            templateUrl: 'views/zxyp/aj.html',
            controller: 'js/zxyp/aj.js'
        },
        'ckfw': {
            parent: 'zxyp',
            templateUrl: 'views/zxyp/ckfw.html',
            controller: 'js/zxyp/ckfw.js'
        },
        'ylld': {
            parent: 'zxyp',
            templateUrl: 'views/zxyp/ylld.html',
            controller: 'js/zxyp/ylld.js'
        },
        'rx': {
            parent: 'zxyp',
            templateUrl: 'views/zxyp/rx.html',
            controller: 'js/zxyp/rx.js'
        },
        'jtsg': {
            parent: 'zxyp',
            templateUrl: 'views/zxyp/jtsg.html',
            controller: 'js/zxyp/jtsg.js'
        },

        'ywfxbg': {
            parent: 'znbg',
            templateUrl: 'views/znbg/ywfxbg.html',
            controller: 'js/znbg/ywfxbg.js'
        },
        'defaults': 'myzs'
    };

    vipspa.start({
        view: '#ui-view',
        errorTemplateId: '#error',
        router: router
    });

    loadMenu(location.hash);

    // 菜单点击事件
    $(".menu").on("click", 'div', function () {
        let $this = $(this), type = $this.attr('type');
        location.hash = vipspa.stringify(type);
        loadMenu(type);
    });

    // 浏览器历史记录改变时触发
    window.addEventListener("popstate", function () {
        loadMenu(location.hash);
    }, false);

    // 上侧tab切换事件
    $(".tab > div").bind("click", function () {
        let $this = $(this), type = $this.attr('type');
        location.hash = vipspa.stringify(type);
        loadMenu(type);
    });

    // 加载菜单
    function loadMenu(type) {
        let $menu = $('.menu'), className = 'header-tab-selected', $tab = $('.tab > div').removeClass(className);
        for (let key in router) {
            if (type.indexOf(key) > -1) {
                let parent = router[key].parent, html = '', arr = [];
                switch (parent) {
                    case 'myhc':
                        arr = ['myzs', 'myjz', 'rdwt', 'dwjx', 'myzd', 'myys'];
                        break;
                    case 'zxyp':
                        arr = ['jcj', 'ckfw', 'jtsg', 'aj', 'rx', 'ylld'];
                        break;
                    case 'slhy':
                        break;
                    case 'znbg':
                        arr = ['ywfxbg', 'zhfxbg'];
                        break;
                }
                $('.tab > div[type="' + arr[0] + '"]').addClass(className);
                arr.map(value => {
                    let className = type.indexOf(value) > -1 ? value + '-menu-hover' : value + '-menu';
                    html += '<div class="' + className + '" type="' + value + '"></div>';
                });
                $menu.empty().append(html);
                return;
            }
        }
    }

    if (sessionStorage.getItem("myKeywords")) {
        var tempTxt = sessionStorage.getItem("myKeywords");
        sessionStorage.removeItem("myKeywords");
        location.hash = vipspa.stringify("myys/ysxq", {txt: tempTxt});
    }
});