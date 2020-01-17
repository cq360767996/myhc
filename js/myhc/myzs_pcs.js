requirejs(
    ["common", "L", "ec", "myzs_animate", "iclient", "markerCluster", "plot"],
    (sugon, L, echarts, animate) => {
        // 所处的责任区code
        let selectedDeptCode = "";
        //日期时间控件
        $("#date1")
            .datetimepicker({
                format: "yyyy-mm",
                autoclose: true,
                todayBtn: true,
                startView: "year",
                minView: "year",
                maxView: "decade",
                language: "zh-CN"
            })
            .change(function () {
                let $control = $(".search-control").val();
                if ($control == "1") {
                    initSideData();
                    initLevelLayer();
                } else {
                    sugon
                        .request(sugon.interFaces.myhc.myzs.DeptId, {
                            deptId: $("#placeCode").val()
                        })
                        .then(result => {
                            switch (currentLevel) {
                                case 2:
                                    getZrqDataByPcsCode(result.CODE, true);
                                    break;
                                case 3:
                                    getDataByZrqCode(result.CODE, true);
                                    break;
                            }
                        });
                }
            });

        $("#date2")
            .datetimepicker({
                format: "yyyy-mm",
                autoclose: true,
                todayBtn: true,
                startView: "year",
                minView: "year",
                maxView: "decade",
                language: "zh-CN"
            })
            .change(function () {
                let $control = $(".search-control").val();
                if ($control == "1") {
                    initSideData();
                    initLevelLayer();
                } else {
                    sugon
                        .request(sugon.interFaces.myhc.myzs.DeptId, {
                            deptId: $("#placeCode").val()
                        })
                        .then(result => {
                            switch (currentLevel) {
                                case 2:
                                    getZrqDataByPcsCode(result.CODE, true);
                                    break;
                                case 3:
                                    getDataByZrqCode(result.CODE, true);
                                    break;
                            }
                        });
                }
            });

        // 获取左侧上部数据
        let getRightUpData = function () {
            let condition = {
                dept: $("#placeCode").val(),
                date1: $("#date1").val(),
                date2: $("#date2").val()
            };
            let ajaxObj = {
                url: sugon.interFaces.myhc.myzs.getLeftData,
                type: "post",
                data: condition,
                async: true
            };
            sugon.requestJson(ajaxObj, function (result) {
                let $div = $(".right-amount1");
                for (let i = 0; i < $div.length; i++) {
                    $div.eq(i).html(result.data[i]);
                }
            });
        };

        // 获取左侧中间数据
        let getRightMidData = function () {
            let condition = {
                deptId: $("#placeCode").val(),
                date1: $("#date1").val(),
                date2: $("#date2").val()
            };
            let ajaxObj = {
                url: sugon.interFaces.myhc.myzs.getRightMidData,
                type: "post",
                data: condition,
                async: true
            };
            sugon.requestJson(ajaxObj, function (result) {
                let data1 = result.data1,
                    data2 = result.data2;
                let $div = $(".right-mid-amount");
                data1.map(function (value, index) {
                    $div.eq(index).html(value);
                });
                let chart = echarts.init(document.getElementById("right-banner-chart"));
                let option = {
                    title: {
                        subtext: "诉求集中\n单位",
                        left: "center",
                        top: "20%",
                        padding: [24, 0],
                        subtextStyle: {
                            color: "#000",
                            fontSize: "14"
                        },
                        textStyle: {
                            color: "#1D84C6"
                        }
                    },
                    tooltip: {
                        show: true
                    },
                    series: [
                        {
                            color: [
                                "#A770B3",
                                "#AF8744",
                                "#ED7D31",
                                "#3A9BBE",
                                "#1D84C6",
                                "#6463AF"
                            ],
                            name: "",
                            type: "pie",
                            clockWise: false,
                            center: ["50%", "50%"],
                            radius: ["40%", "56%"],
                            hoverAnimation: false,
                            itemStyle: {
                                normal: {
                                    label: {
                                        show: true,
                                        position: "outside",
                                        formatter: function (params) {
                                            return params.name + "\n" + params.value;
                                        },
                                        rich: {
                                            white: {
                                                color: "#ddd",
                                                align: "center"
                                            }
                                        }
                                    },
                                    labelLine: {
                                        show: true,
                                        length: 8,
                                        length2: 5
                                    }
                                }
                            },
                            data: data2
                        }
                    ]
                };
                chart.setOption(option);
            });
        };

        // 获取右侧下部数据
        let getRightDownData = function () {
            let condition = {
                deptId: $("#placeCode").val(),
                date1: $("#date1").val(),
                date2: $("#date2").val()
            };
            let ajaxObj = {
                url: sugon.interFaces.myhc.myzs.getRightData,
                type: "post",
                data: condition,
                async: true
            };
            sugon.requestJson(ajaxObj, function (result) {
                let data = result.data;
                let $body = $(".right-panel-body");
                $body.empty();
                for (let i = 0; i < data.length; i++) {
                    $body.append(
                        '<div title="' +
                        data[i].name +
                        '">' +
                        (i + 1) +
                        "、" +
                        data[i].name +
                        "</div>"
                    );
                }
            });
        };

        // 初始化两侧数据
        let initSideData = function () {
            // 加载右上侧数据
            getRightUpData();
            // 加载右中间数据
            getRightMidData();
            // 加载右下侧数据
            getRightDownData();
        };

        // 折叠按钮点击事件
        $(".fold-btn").click(function () {
            $(".select-tab").hide();
            let rightPanel = $(".right-panel");
            let foldBtn = $(".fold-img");
            if (parseInt(rightPanel.css("right")) < 0) {
                $(".right-panel").animate({right: "15px"});
                foldBtn.css("transform", "rotateY(0deg)");
            } else {
                $(".right-panel").animate({right: "-330px"});
                foldBtn.css("transform", "rotateY(180deg)");
            }
        });

        /******************************************************************/

        let map;
        // 分别记录分局、派出所、责任区的zoom、上级code、center
        let zoomArr = [
                {zoom: 10, upDeptCode: "", center: [32.03613281, 118.78211975]}
            ],
            mapLayer = [];
        let pcsLayerGroup = L.layerGroup(),
            pcsMarkerGroup = L.layerGroup(); // 派出所layer相关数据
        let zrqLayerGroup = L.layerGroup(),
            zrqMarkerGroup = L.layerGroup(); // 责任区layer相关数据
        let singleZrqLayerGroup = L.layerGroup(),
            singleZrqMarkerGroup = L.layerGroup(); // 单个责任区layer相关数据
        let currentLevel = "";
        // 聚合点数据
        let markerClusterGroup = L.markerClusterGroup({
                spiderfyOnMaxZoom: false,
                showCoverageOnHover: false,
                zoomToBoundsOnClick: false,
                singleMarkerMode: true
            }),
            queryGroup = L.layerGroup(),
            mapMarkData = [],
            hiddenMapMarkData = [];
        let searchInput; // 输入框文本

        // 圈选相关变量
        let serverUrl, queryPlottingLayer, drawControl, plotting;
        let bounds,
            queryResult = [],
            selectedData = [],
            hiddenSelectedData = [],
            isQuery; // 圈选的数据
        let popMarkerGroup = L.layerGroup(); // 随机跳动的计时器，弹出marker组
        let isRenderSearchChart = false; // 是否渲染查询的echarts图
        let rdwtData = {},
            selected_ywid; // 1.热点问题数据 2.选中的业务id
        // 创建地图
        function createMapL() {
            $(".setting-btn").remove();
            $(".bmq-option").remove();
            $(".search-yw2 > option[value=3]").remove();
            // 创建地图
            map = L.map("mainMap", {
                crs: L.CRS.EPSG4326,
                preferCanvas: false,
                center: [32.03613281, 118.78211975],
                maxZoom: 18,
                minZoom: 10,
                zoom: 14,
                zoomControl: false,
                attributionControl: false,
                closePopupOnClick: false //点击地图不关闭popup框
            });
            mapLayer = L.supermap.wmtsLayer(
                "http://10.33.66.183:2333/iserver/services/map-wmts-GADT/wmts-china",
                {
                    layer: "GADT",
                    style: "default",
                    tilematrixSet: "ChinaPublicServices_GADT",
                    format: "image/png",
                    transparent: true
                }
            );
            mapLayer.addTo(map);
            // 加载所有分局信息
            initPcs(true);
        }

        // 请求地图接口
        function requestMap(attributeFilter, isBounds) {
            return new Promise((resolve, reject) => {
                let url = "http://10.33.66.183:2334/iserver/services/data-gt8/rest/data";
                let params = new SuperMap.GetFeaturesBySQLParameters({
                    queryParameter: {
                        name: "gajg_pcszrq_3201_pg@ORCL_gt8",
                        attributeFilter,
                        fields: isBounds ? ["DWBM", "DWMC", "SMSDRIW", "SMSDRIN", "SMSDRIE", "SMSDRIS"] : ["DWBM", "DWMC"],
                        orderBy: "DWBM"
                    },
                    datasetNames: ["ORCL_gt8:gajg_pcszrq_3201_pg"],
                    toIndex: -1
                });
                L.supermap.featureService(url).getFeaturesBySQL(params, resolve);
            });
        }

        // 鼠标经过边框加粗事件
        function mouseoverEvent(e) {
            $(".bubblefj").css("color", "white");
            map.eachLayer(function (layer) {
                if (layer.options.weight == 2) {
                    layer.setStyle({
                        color: "#386AFB",
                        fillOpacity: 0,
                        weight: 1
                    });
                }
                if (layer._leaflet_id == e.target._leaflet_id) {
                    let $div = $('div.bubblefj[code="' + e.target.options.code + '"]');
                    $div
                        .css("color", "#ffe200")
                        .stop()
                        .animate({top: "5px"}, 200, function () {
                            $div.stop().animate({top: "0"}, 200);
                        });
                    layer.setStyle({
                        weight: 2,
                        fillOpacity: 0.15
                    });
                }
            });
        }

        // 鼠标出去移除加粗效果事件
        function mouseoutEvent() {
            $(".bubblefj").css("color", "white");
            map.eachLayer(function (layer) {
                if (layer.options.weight == 2) {
                    layer.setStyle({
                        color: "#386AFB",
                        fillOpacity: 0,
                        weight: 1
                    });
                }
            });
        }

        // 民意指数鼠标移入事件
        function myzsMouseoverEvent(e) {
            map.eachLayer(function (layer) {
                if (layer.options.weight == 3) {
                    layer.setStyle({
                        color: "#386AFB",
                        fillOpacity: 0.15,
                        weight: 2
                    });
                }
                if (layer._leaflet_id == e.target._leaflet_id) {
                    let $div = $(
                        'div.bubble-marker[code="' + e.target.options.code + '"]'
                    );
                    $div.stop().animate({top: "5px"}, 200, function () {
                        $div.stop().animate({top: "0"}, 200);
                    });
                    layer.setStyle({
                        weight: 3,
                        fillOpacity: 0.3
                    });
                }
            });
        }

        // 民意指数鼠标移出事件
        function myzsMouseoutEvent() {
            map.eachLayer(function (layer) {
                if (layer.options.weight == 3) {
                    layer.setStyle({
                        color: "#386AFB",
                        fillOpacity: 0.15,
                        weight: 2
                    });
                }
            });
        }

        // 单位层级由1 ==》 2
        async function initPcs(isMyzs) {
            let {deptId, deptName, deptCode} = sugon.identityInfo;
            $("#date1").val(sugon.getDate(-6));
            $("#date2").val(sugon.getDate(-1));
            $("#place").val(deptName);
            $("#placeCode").val(deptId);
            requestMap(`DWBM = ${deptCode}`, true).then(serviceResult => {
                let properties = serviceResult.result.features.features[0].properties;
                let center = [(Number(properties.SMSDRIN) + Number(properties.SMSDRIS)) / 2, (Number(properties.SMSDRIE) + Number(properties.SMSDRIW)) / 2];
                zoomArr[2] = {center, zoom: 14, upDeptCode: deptCode};
                map.setView(center, 14);
            });

            $(".pcs-icon").hide();
            $(".pcs-layer").hide();
            // 根据code获取id
            await sugon.request(sugon.interFaces.myhc.myzs.DeptId, {deptCode}).then(result => {
                $("#place").val(result.NAME.replace(result.UP_NAME, ""));
                $("#placeCode").val(result.ID);
            });
            sugon.request(sugon.interFaces.myhc.myzs.getPcsZb, {
                deptId: $("#placeCode").val(),
                date1: $("#date1").val(),
                date2: $("#date2").val()
            }).then(function (result) {
                let $body = $(".right-panel-up-2");
                let nameArr = [
                    "110接处警满意度",
                    "窗口服务满意度",
                    "案件综合评价",
                    "事故综合评价",
                    "12345满意度",
                    "社区民警熟悉率",
                    "社会治安满意度",
                    "公安队伍满意度"
                ];
                $body.empty();
                result.data.map(function (val, index) {
                    if (val) {
                        let html =
                            '<div><div class="right-amount2">' +
                            val +
                            '</div><div class="right-name2">' +
                            nameArr[index] +
                            "</div></div>";
                        $body.append(html);
                    }
                });
            });
            if (isMyzs) {
                getZrqDataByPcsCode(deptCode, true);
            } else {
                // 隐藏左右两侧页面
                $(".right-panel-up")
                    .show()
                    .css("height", "50%");
                $(".right-panel-down").css("height", "50%");
                $(".right-panel-up-1").hide();
                $(".right-panel-up-2").show();
                loadMarkerCluster();
                // 根据派出所code获取责任区数据
                getZrqDataByPcsCode(deptCode);
            }
        }

        // 单位层级由2 ==》 3
        async function level223(deptCode, isMyzs) {
            // 隐藏左右两侧页面
            $(".right-panel-up").hide();
            $(".right-panel-down").css("height", "100%");
            $(".pcs-icon").hide();
            $(".pcs-layer").hide();
            // 根据code获取id
            await sugon.request(sugon.interFaces.myhc.myzs.DeptId, {deptCode}).then(result => {
                $("#place").val(result.NAME.replace(result.UP_NAME, ""));
                $("#placeCode").val(result.ID);
            });
            // 初始化数据panel
            !isMyzs && initDataPanel($(".search-yw").val());
            // 根据派出所code获取责任区数据
            getDataByZrqCode(deptCode, isMyzs);
        }

        //处理geometry数据数组中经纬度 与 leaflet.js API中构建polygon(纬，经)矛盾
        function changeLonAndLat(arr) {
            let result = [];
            for (let k = 0; k < arr.length; k++) {
                let arr1 = [];
                for (let i = 0; i < arr[k].length; i++) {
                    let arr2 = [];
                    for (let j = 0; j < arr[k][i].length; j++) {
                        let arr3 = [];
                        let temp = arr[k][i][j][0];
                        let t1 = arr[k][i][j][0];
                        let t2 = arr[k][i][j][1];
                        temp = t1;
                        t1 = t2;
                        t2 = temp;
                        arr3.push(t1, t2);
                        arr2.push(arr3);
                    }
                    arr1.push(arr2);
                }
                result.push(arr1);
            }
            return result;
        }

        // 诉求分布责任区页面
        function renderSqfbZrqPage(resultData) {
            $(".bubble-marker").remove();
            $(".data-panel").hide();
            $(".data-panel2").hide();
            $(".data-panel3").hide();
            currentLevel = 2;
            // 清空map上的分局数据
            map.removeLayer(pcsLayerGroup);
            map.removeLayer(pcsMarkerGroup);
            pcsLayerGroup = L.layerGroup();
            pcsMarkerGroup = L.layerGroup();
            // 清空派出所layer和marker
            resultData.map(function (val) {
                let resultLayer = L.polygon(changeLonAndLat(val.geometry.coordinates), {
                    color: "#386AFB",
                    fillOpacity: 0,
                    className: "fj-layer",
                    weight: 1,
                    code: val.properties.DWBM
                });
                let center = L.latLngBounds(
                    changeLonAndLat(val.geometry.coordinates)
                ).getCenter();
                let dwmc = val.properties.DWMC.replace($("#place").val(), "");
                let len = dwmc.length * 16 + 30;
                let divIcon = L.divIcon({
                    className: "zrq-icon",
                    html:
                    '<div class="bubblefj" code="' +
                    val.properties.DWBM +
                    '" style="width: ' +
                    len +
                    'px;">' +
                    dwmc +
                    "</div>",
                    iconAnchor: [len / 2, 0]
                });
                let marker = L.marker(center, {icon: divIcon});
                resultLayer.on({
                    mouseover: mouseoverEvent,
                    mouseout: mouseoutEvent,
                    click: function () {
                        let deptCode = val.properties.DWBM;
                        level223(deptCode);
                    }
                });
                zrqLayerGroup.addLayer(resultLayer);
                zrqMarkerGroup.addLayer(marker);
            });
            map.addLayer(zrqLayerGroup);
            map.addLayer(zrqMarkerGroup);
        }

        // 民意指数责任区页面
        function renderMyzsZrqPage(resultData) {
            $(".data-panel").hide();
            $(".data-panel2").hide();
            $(".data-panel3").show();
            currentLevel = 2;
            let condition = {
                deptId: $("#placeCode").val(),
                date1: $("#date1").val(),
                date2: $("#date2").val(),
                type: $(".search-yw2").val()
            };
            sugon
                .request(sugon.interFaces.myhc.myzs.getYlldMapData, condition)
                .then(result => {
                    $(".search-down-panel > button")
                        .removeAttr("class")
                        .addClass("animate-btn-disabled");
                    map.setView(zoomArr[2].center, zoomArr[2].zoom);
                    // 清空map上的分局数据
                    map.removeLayer(zrqLayerGroup);
                    map.removeLayer(zrqMarkerGroup);
                    zrqLayerGroup = L.layerGroup();
                    zrqMarkerGroup = L.layerGroup();
                    let data = [];
                    resultData.map(val1 => {
                        let center = L.latLngBounds(
                            changeLonAndLat(val1.geometry.coordinates)
                            ).getCenter(),
                            obj = {
                                code: val1.properties.DWBM,
                                name: val1.properties.DWMC.replace(/^\S+派出所/g, ""),
                                lat: center.lat,
                                lng: center.lng,
                                data: val1.geometry.coordinates,
                                type: "2",
                                value: ""
                            };
                        result.data.map(val2 => {
                            if (obj.code == val2.code) {
                                obj.value = val2.value;
                                obj.type = val2.type;
                            }
                        });
                        data.push(obj);
                    });
                    // 在添加之前置空
                    data.map(function (val) {
                        let resultLayer = L.polygon(changeLonAndLat(val.data), {
                            color: "#386AFB",
                            weight: 3,
                            fillOpacity: 0,
                            code: val.code
                        });
                        let center = L.latLngBounds(changeLonAndLat(val.data)).getCenter();
                        resultLayer.on(
                            {
                                mouseover: myzsMouseoverEvent,
                                mouseout: myzsMouseoutEvent,
                                click: function () {
                                    level223(val.code, val.code, center, true);
                                }
                            },
                            true
                        );
                        zrqLayerGroup.addLayer(resultLayer);
                        let len = val.name.length * 14 + 20;
                        // let html = val.value ? "" : " style='display:none;'";
                        let divIcon = L.divIcon({
                            html: `<div style="width: ${len}px;" code="${
                                val.code
                                }" class="bubble-marker bubble-marker2">
                                    <div></div>
                                    <div style="display:none;">${Number(
                                val.value
                            ).toFixed(2)}%</div>
                                    <div>${val.name}</div>
                               </div>`,
                            iconAnchor: [len / 2, 30]
                        });
                        let marker = L.marker([val.lat, val.lng], {icon: divIcon});
                        zrqMarkerGroup.addLayer(marker);
                    });
                    map.addLayer(zrqLayerGroup);
                    map.addLayer(zrqMarkerGroup);
                    initRightPanel2($(".search-yw2").val());
                });
            loadMyzsMarker();
        }

        //传入派出所编码 绘制责任区数据
        function getZrqDataByPcsCode(pcsCode, isMyzs) {
            if (isRenderSearchChart) {
                renderSearchChart();
            }
            let subCode = pcsCode.substring(0, 8);
            let sqlParam = new SuperMap.GetFeaturesBySQLParameters({
                queryParameter: {
                    name: "gajg_pcszrq_3201_pg@ORCL_gt8",
                    attributeFilter:
                    "DWBM like '%" + subCode + "%' and DWMC like '%责任区'",
                    fields: ["DWBM", "DWMC"],
                    orderBy: "DWBM"
                },
                datasetNames: ["ORCL_gt8:gajg_pcszrq_3201_pg"],
                fromIndex: 1,
                toIndex: -1
            });
            let url = "http://10.33.66.183:2334/iserver/services/data-gt8/rest/data";
            L.supermap
                .featureService(url)
                .getFeaturesBySQL(sqlParam, function (serviceResult) {
                    let resultData = serviceResult.result.features.features;
                    if (isMyzs) {
                        renderMyzsZrqPage(resultData);
                    } else {
                        renderSqfbZrqPage(resultData);
                    }
                });
        }

        // 诉求分布单个责任区页面
        function renderSqfbSingleZrqPage(resultData, zrqCode) {
            $(".search-pop-panel").hide();
            currentLevel = 3;
            // 清空map上的分局数据
            map.removeLayer(zrqLayerGroup);
            map.removeLayer(zrqMarkerGroup);
            zrqLayerGroup = L.layerGroup();
            zrqMarkerGroup = L.layerGroup();
            // 清空责任区layer和marker
            let bounds = "";
            resultData.map(function (val) {
                let resultLayer = L.polygon(changeLonAndLat(val.geometry.coordinates), {
                    color: "#386AFB",
                    fillOpacity: 0,
                    className: "fj-layer",
                    weight: 1,
                    code: val.properties.DWBM
                });
                let center = L.latLngBounds(
                    changeLonAndLat(val.geometry.coordinates)
                ).getCenter();
                let len = val.properties.DWMC.length * 16 + 30;
                let divIcon = L.divIcon({
                    className: "single-zrq-icon",
                    html:
                    '<div class="bubblefj"  code="' +
                    val.properties.DWBM +
                    '" style="width: ' +
                    len +
                    'px;">' +
                    val.properties.DWMC +
                    "</div>",
                    iconAnchor: [len / 2, 0]
                });
                bounds = resultLayer.getBounds();
                let marker = L.marker(center, {icon: divIcon});
                resultLayer.on("mouseup", function (e) {
                    let which = e.originalEvent.which;
                    if (which == 3) {
                        // 显示左右两侧页面
                        $(".data-panel").hide();
                        $(".right-panel-up")
                            .show()
                            .css("height", "50%");
                        $(".right-panel-down").css("height", "50%");
                        $(".right-panel-up-1").hide();
                        $(".right-panel-up-2").show();
                        // 移除责任区图层
                        map.removeLayer(singleZrqLayerGroup);
                        map.removeLayer(singleZrqMarkerGroup);
                        map.removeLayer(queryGroup);
                        singleZrqLayerGroup = L.layerGroup();
                        singleZrqMarkerGroup = L.layerGroup();
                        queryGroup = L.layerGroup();
                        // 清空派出所layer和marker
                        $(".single-zrq-icon").hide();
                        $(".single-zrq-layer").hide();
                        // 右键时，记录上级id
                        sugon.requestJson(
                            {
                                type: "POST",
                                url: sugon.interFaces.myhc.myzs.DeptId,
                                async: false,
                                data: {deptCode: zrqCode, isZrq2Pcs: true}
                            },
                            function (result) {
                                $("#place").val(result.UP_NAME);
                                $("#placeCode").val(result.UP_ID);
                            }
                        );
                        loadMarkerCluster();
                        getZrqDataByPcsCode(zoomArr[2].upDeptCode);

                        // 重设中心店和zoom值
                        map.setView(zoomArr[2].center, zoomArr[2].zoom);
                    }
                });
                singleZrqLayerGroup.addLayer(resultLayer);
                singleZrqMarkerGroup.addLayer(marker);
            });
            map.addLayer(singleZrqLayerGroup);
            map.addLayer(singleZrqMarkerGroup);
            map.fitBounds(bounds);
        }

        // 民意指数单个责任区页面
        function renderMyzsSingleZrqPage(resultData) {
            $(".data-panel4").hide();
            currentLevel = 3;
            // 清空责任区图层
            map.removeLayer(zrqLayerGroup);
            map.removeLayer(zrqMarkerGroup);
            map.removeLayer(markerClusterGroup);
            zrqLayerGroup = L.layerGroup();
            zrqMarkerGroup = L.layerGroup();
            markerClusterGroup = L.layerGroup();

            // 清空当前图层
            map.removeLayer(singleZrqLayerGroup);
            map.removeLayer(singleZrqMarkerGroup);
            singleZrqLayerGroup = L.layerGroup();
            singleZrqMarkerGroup = L.layerGroup();
            // 清空责任区layer和marker
            let bounds = "";
            resultData.map(function (val) {
                let resultLayer = L.polygon(changeLonAndLat(val.geometry.coordinates), {
                    color: "#386AFB",
                    weight: 3,
                    fillOpacity: 0.15
                });
                let center = L.latLngBounds(
                    changeLonAndLat(val.geometry.coordinates)
                ).getCenter();
                let len =
                    val.properties.DWMC.replace(/^\S+派出所/g, "").length * 16 + 30;
                let divIcon = L.divIcon({
                    html: `<div style="width: ${len}px;" class="bubble-marker bubble-marker2">
                                <div></div>
                                <div style="display: none;"></div>
                                <div class="zrq-popup-marker" code="${val.properties.DWBM}">${val.properties.DWMC.replace(
                        /^\S+派出所/g,
                        ""
                    )}</div>
                           </div>`,
                    iconAnchor: [len / 2, 30]
                });
                bounds = resultLayer.getBounds();
                let marker = L.marker(center, {icon: divIcon});
                resultLayer.on("mouseup", function (e) {
                    let deptId = $("#placeCode").val();
                    let which = e.originalEvent.which;
                    if (which == 3) {
                        $(".data-panel4").hide();
                        $(".zrq-popup-marker-origin").remove();
                        // 移除责任区图层
                        map.removeLayer(singleZrqLayerGroup);
                        map.removeLayer(singleZrqMarkerGroup);
                        map.removeLayer(markerClusterGroup);
                        singleZrqLayerGroup = L.layerGroup();
                        singleZrqMarkerGroup = L.layerGroup();
                        markerClusterGroup = L.layerGroup();
                        // 右键时，记录上级id
                        sugon.requestJson(
                            {
                                type: "POST",
                                url: sugon.interFaces.myhc.myzs.DeptId,
                                async: false,
                                data: {deptId: deptId}
                            },
                            function (result) {
                                $("#place").val(result.UP_NAME);
                                $("#placeCode").val(result.UP_ID);
                            }
                        );
                        getZrqDataByPcsCode(zoomArr[2].upDeptCode, true);

                        // 重设中心店和zoom值
                        map.setView(zoomArr[2].center, zoomArr[2].zoom);
                    }
                });
                singleZrqLayerGroup.addLayer(resultLayer);
                singleZrqMarkerGroup.addLayer(marker);
            });
            loadMyzsMarker();
            map.addLayer(singleZrqLayerGroup);
            map.addLayer(singleZrqMarkerGroup);
            map.fitBounds(bounds);
            initRightPanel2($(".search-yw2").val());
        }

        // 根据责任区id获取责任区边界
        function getDataByZrqCode(zrqCode, isMyzs) {
            if (searchInput) {
                isRenderSearchChart = false;
            }
            let sqlParam = new SuperMap.GetFeaturesBySQLParameters({
                queryParameter: {
                    name: "gajg_pcszrq_3201_pg@ORCL_gt8",
                    attributeFilter: "DWBM = '" + zrqCode + "' and DWMC like '%责任区'",
                    fields: ["DWBM", "DWMC"],
                    orderBy: "DWBM"
                },
                datasetNames: ["ORCL_gt8:gajg_pcszrq_3201_pg"],
                fromIndex: 1,
                toIndex: -1
            });
            let url = "http://10.33.66.183:2334/iserver/services/data-gt8/rest/data";
            L.supermap
                .featureService(url)
                .getFeaturesBySQL(sqlParam, function (serviceResult) {
                    let resultData = serviceResult.result.features.features;
                    if (isMyzs) {
                        renderMyzsSingleZrqPage(resultData);
                    } else {
                        renderSqfbSingleZrqPage(resultData, zrqCode);
                    }
                });
        }

        // 初始化数据面板
        function initDataPanel(type) {
            $(".data-panel").show();
            initSearch(type);
            initTab(type);
        }

        // 初始化查询面板
        function initSearch(type) {
            let $search = $(".data-panel-search");
            $search.empty();
            $search.append($("<span/>").html("业务类型："));
            let data = getSearchData(type);
            data.map(function (value, index) {
                let $div = $("<div/>");
                if (index < 1) {
                    $div.addClass("search-selected");
                }
                $search.append($div.html(value));
            });
        }

        // 获取查询栏的数据
        function getSearchData(type) {
            let data = [],
                countData = [0, 0, 0, 0, 0];
            if (isQuery) {
                selectedData.map(function (value) {
                    countData[0]++;
                    switch (value.sjly) {
                        case "110接处警":
                            countData[1]++;
                            break;
                        case "案件":
                            countData[2]++;
                            break;
                        case "12345热线":
                            countData[3]++;
                            break;
                    }
                });
                switch (type) {
                    case "0":
                        data = [
                            "全部(" + countData[0] + ")",
                            "110接处警(" + countData[1] + ")",
                            "案件(" + countData[2] + ")",
                            "12345热线(" + countData[3] + ")"
                        ];
                        break;
                    case "1":
                        data = ["110接处警(" + countData[1] + ")"];
                        break;
                    case "2":
                        data = ["案件(" + countData[2] + ")"];
                        break;
                    case "3":
                        data = ["12345热线(" + countData[3] + ")"];
                        break;
                }
            } else {
                sugon.requestJson(
                    {
                        type: "post",
                        url: sugon.interFaces.myhc.myzs.getMapCount,
                        async: false,
                        data: {
                            deptId: $("#placeCode").val(),
                            date1: $("#date1").val(),
                            date2: $("#date2").val(),
                            type: type,
                            keyword: searchInput
                        }
                    },
                    function (result) {
                        data = result.data;
                    }
                );
            }
            return data;
        }

        // 获取表单数据
        function getTabData(type, pageNum) {
            type = type || 0;
            pageNum = pageNum || 1;
            let data = [];
            if (isQuery) {
                // 请求责任区接口
                let splitData = [[], [], [], [], []];
                selectedData.map(function (value) {
                    splitData[0].push(value);
                    switch (value.sjly) {
                        case "110接处警":
                            splitData[1].push(value);
                            break;
                        case "案件":
                            splitData[2].push(value);
                            break;
                        case "12345热线":
                            splitData[3].push(value);
                            break;
                    }
                });
                for (let i = (pageNum - 1) * 100; i < pageNum * 100; i++) {
                    if (splitData[type][i]) {
                        data.push(splitData[type][i]);
                    }
                }
            } else {
                sugon.requestJson(
                    {
                        type: "post",
                        url: sugon.interFaces.myhc.myzs.getDetailMapData,
                        async: false,
                        data: {
                            deptId: $("#placeCode").val(),
                            date1: $("#date1").val(),
                            date2: $("#date2").val(),
                            type: type,
                            pageNum: pageNum,
                            keyword: searchInput || ""
                        }
                    },
                    function (result) {
                        data = result.data;
                    }
                );
            }
            return data;
        }

        // 初始化tab面板
        function initTab(type, pageNum, searchType) {
            searchType = searchType || 0;
            let $tab = $(".data-panel .data-panel-tab");
            let header1 = "",
                header2 = "";
            let realType = type == 0 ? searchType : Number(type);
            switch (realType) {
                case 0:
                    header1 = "数据来源";
                    header2 = "业务类型";
                    break;
                case 1:
                    header1 = "警情类别";
                    header2 = "诉求内容";
                    break;
                case 2:
                    header1 = "案件类别";
                    header2 = "案件名称";
                    break;
                case 3:
                    header1 = "业务类型";
                    header2 = "诉求目的";
                    break;
            }

            $tab.empty();
            $tab.append(
                '<div class="data-tab-header"><div class="col1">序号</div>' +
                '<div class="col2">时间</div><div class="col3">诉求人</div><div class="col4">' +
                header1 +
                '</div><div class="col5">' +
                header2 +
                "</div</div>"
            );
            let data = getTabData(realType, pageNum);
            // 移除派出所层级marker
            map.removeLayer(markerClusterGroup);
            markerClusterGroup = L.markerClusterGroup({
                spiderfyOnMaxZoom: false,
                showCoverageOnHover: false,
                zoomToBoundsOnClick: false,
                singleMarkerMode: true
            });
            // 移除当前层级marker
            map.removeLayer(queryGroup);
            queryGroup = L.layerGroup();
            data.map(function (value, index) {
                let $div = $("<div/>")
                    .addClass("data-panel-tab-row")
                    .attr("ywid", value.ywid);
                $div.append(
                    $("<div/>")
                        .addClass("col1")
                        .html(index + 1)
                );
                $div.append(
                    $("<div/>")
                        .addClass("col2")
                        .html(value["sj"])
                );
                $div.append(
                    $("<div/>")
                        .addClass("col3")
                        .html(value["sqr"])
                );
                $div.append(
                    $("<div/>")
                        .addClass("col4")
                        .html(value["sjly"])
                );
                $div.append(
                    $("<div/>")
                        .addClass("col5")
                        .attr("title", value["ywlx"])
                        .html(value["ywlx"])
                );
                $tab.append($div);
                let icon;

                let str = "";
                switch (value.sjly) {
                    case "110接处警":
                        str += "<p>姓名：" + value.sqr + "</p>";
                        str += "<p>电话：" + value.dh + "</p>";
                        str += "<p>接警时间：" + value.sj + "</p>";
                        str += "<p>报警地址：" + value.bjdz + "</p>";
                        str += "<p>报警内容：" + value.bjnr + "</p>";
                        str += "<p>警情类型：" + value.ywlx + "</p>";
                        str += "<p>短信回复：" + value.inmsg + "</p>";
                        str += "<p>群众诉求：" + value.lynr + "</p>";
                        icon = L.icon({
                            iconUrl: "../../img/myhc/myzs/location_aj.png",
                            popupAnchor: [10, 5]
                        });
                        break;
                    case "案件":
                        str += "<p>案件名称：" + value.ajmc + "</p>";
                        str += "<p>业务类型：" + value.ywlx + "</p>";
                        str += "<p>案件地址：" + value.ajdz + "</p>";
                        str += "<p>受理时间：" + value.sj + "</p>";
                        str += "<p>案件类别：" + value.ajlb + "</p>";
                        str += "<p>工单标签：" + value.tag + "</p>";
                        str += '<div class="pop-divider"></div>';
                        value.person.map(function (val) {
                            str += "<p>姓名：" + val.xm + "</p>";
                            str += "<p>联系电话：" + val.dh + "</p>";
                            str += "<p>群众诉求：" + val.lynr + "</p>";
                            str += '<div class="pop-divider"></div>';
                        });
                        icon = L.icon({
                            iconUrl: "../../img/myhc/myzs/location_jcj.png",
                            popupAnchor: [10, 5]
                        });
                        break;
                    case "12345热线":
                        str += "<p>姓名：" + (value.sqr || "") + "</p>";
                        str += "<p>电话：" + (value.dh || "") + "</p>";
                        str += "<p>诉求时间：" + (value.sj || "") + "</p>";
                        str += "<p>具体地址：" + (value.jtdz || "") + "</p>";
                        str += "<p>诉求业务：" + (value.sqyw || "") + "</p>";
                        str += "<p>诉求问题：" + (value.sqwt || "") + "</p>";
                        str += "<p>诉求内容：" + (value.sqnr || "") + "</p>";
                        icon = L.icon({
                            iconUrl: "../../img/myhc/myzs/location_12345.png",
                            popupAnchor: [10, 5]
                        });
                        break;
                }
                let resultLayer = L.marker([value.lat, value.lng], {icon: icon});
                resultLayer.bindPopup(
                    '<div ywid="' +
                    value.ywid +
                    '" class="pop-map-mark-header">' +
                    value.sjly +
                    '</div><div class="pop-map-mark-body">' +
                    str +
                    "</div>"
                );
                resultLayer.on("popupopen", function (e) {
                    let content = e.popup._content;
                    let reg = /ywid\="\S*"/;
                    let resultArr = content.match(reg);
                    let ywid = "";
                    if (resultArr) {
                        ywid = resultArr[0].substring(6, resultArr[0].length - 1).trim();
                    }
                    if (ywid) {
                        let tabRow = $(".data-panel-tab-row"),
                            className = "data-panel-tab-row-hover";
                        tabRow.removeClass(className);
                        for (let i = 0; i < tabRow.length; i++) {
                            let row = tabRow.eq(i);
                            if (row.attr("ywid") == ywid) {
                                row.addClass(className);
                            }
                        }
                    }
                });
                resultLayer.on("popupclose", function (e) {
                    $(".data-panel-tab-row").removeClass("data-panel-tab-row-hover");
                });
                queryGroup.addLayer(resultLayer);
            });
            queryGroup.addTo(map);
            let pageStr = $(".search-selected").html();
            let totalCount = pageStr.substring(
                pageStr.indexOf("(") + 1,
                pageStr.lastIndexOf(")")
            );
            let pages =
                totalCount % 100 == 0
                    ? parseInt(totalCount / 100)
                    : parseInt(totalCount / 100) + 1;
            sugon.renderNav($(".nav-container"), pageNum, pages, function (page) {
                initTab(type, page);
            });
        }

        // 处理颜色和icon
        function handleColorAndIcon(data) {
            data = Number(data);
            let result = {
                color: "",
                icon: ""
            };
            if (data > 0) {
                result.icon = "glyphicon-arrow-up";
                result.color = "banner-color1";
            } else if (data == 0) {
                result.icon = "glyphicon-minus";
                result.color = "banner-color4";
            } else {
                result.icon = "glyphicon-arrow-down";
                result.color = "banner-color2";
            }
            return result;
        }

        // 根据图层等级刷新对于的layer
        function initLevelLayer() {
            switch (currentLevel) {
                case 2:
                    loadMarkerCluster();
                    break;
                case 3:
                    initDataPanel($(".search-yw").val());
                    break;
                case 4:
                    initSearchPanel();
                    break;
            }
        }

        // 移除所有图层
        function removeAllLayers() {
            map.eachLayer(function (layer) {
                if (layer._leaflet_id != mapLayer._leaflet_id) {
                    map.removeLayer(layer);
                }
            });
        }

        // 初始化查询面板
        function initSearchPanel() {
            currentLevel = 4;
            removeAllLayers();
            initDataPanel($(".search-yw").val());
        }

        // 加载聚合图
        function loadMarkerCluster() {
            map.removeLayer(markerClusterGroup);
            markerClusterGroup = L.markerClusterGroup({
                spiderfyOnMaxZoom: false,
                showCoverageOnHover: false,
                zoomToBoundsOnClick: false,
                singleMarkerMode: true
            });
            sugon.requestJson(
                {
                    type: "post",
                    url: sugon.interFaces.myhc.myzs.getMapData,
                    data: {
                        deptId: $("#placeCode").val(),
                        date1: $("#date1").val(),
                        date2: $("#date2").val(),
                        type: $(".search-yw").val(),
                        keyword: searchInput
                    },
                    async: true
                },
                function (result) {
                    result.data.map(function (value) {
                        markerClusterGroup.addLayer(L.marker(value));
                    });
                }
            );
            markerClusterGroup.addTo(map);
        }

        // 加载民意指数点位图
        function loadMyzsMarker() {
            map.removeLayer(markerClusterGroup);
            markerClusterGroup = L.layerGroup();
            sugon.requestJson(
                {
                    type: "post",
                    url: sugon.interFaces.myhc.myzs.getYlldDetailMapData,
                    data: {
                        deptId: $("#placeCode").val(),
                        date1: $("#date1").val(),
                        date2: $("#date2").val(),
                        type: $(".search-yw2").val()
                    },
                    async: true
                },
                function (result) {
                    rdwtData = result;
                    renderMyzsMarker(rdwtData.data);
                }
            );
        }

        // 渲染民意指数点位图
        function renderMyzsMarker(data, isQuery) {
            markerClusterGroup = L.layerGroup();
            $(".data-panel3")
                .show()
                .attr("isQuery", isQuery ? 1 : 0);
            $(".data-panel-banner3").html(rdwtData.content);
            let $body = $(".data-panel-tab3").empty()
                .append(`<div class="data-tab-header">
                            <div class="col11">序号</div>
                            <div class="col11">时间</div>
                            <div class="col11">诉求人</div>
                            <div class="col11">诉求类型</div>
                         </div>`);
            data.map((val, index) => {
                let row = `<div class="data-panel-tab-row" ywid="${val.ywid}">
                                      <div class="col11">${index + 1}</div>
                                      <div class="col11">${val.sj}</div>
                                      <div class="col11">${val.sqr}</div>
                                      <div class="col11">${val.ywlb}</div>
                                   </div>`;
                $body.append(row);
                let icon = L.icon({
                    className: "zrq-popup-marker-normal",
                    iconUrl: `../../img/myhc/myzs/location_12345.png`,
                    popupAnchor: [10, 5]
                });
                let marker = L.marker([val.lat, val.lng], {
                    icon: icon,
                    ywid: val.ywid
                });
                let bjnr = val.num == 2 ? `<p>报警内容：${val.bjnr}</p>` : "";
                let bindHtml = `<div ywid="${val.ywid}" class="pop-map-mark-header">诉求信息
                                        </div><div class="pop-map-mark-body">
                                            <p>姓名：${val.sqr}</p>
                                            <p>电话：${val.dh}</p>
                                            <p>诉求时间：${val.sj}</p>
                                            <p>业务归口：${val.ywgk}</p>
                                            <p>诉求来源：${val.sqlb}</p>
                                            <p>诉求地址：${val.sqdz}</p>
                                            ${bjnr}
                                            <p>诉求内容：${val.sqnr}</p>
                                        </div>`;
                marker.bindPopup(bindHtml);
                marker.on({
                    popupopen: function (e) {
                        let ywid = e.target.options.ywid;
                        $(".data-panel3 .data-panel-tab-row").each(function (index, dom) {
                            let $dom = $(dom);
                            if ($dom.attr("ywid") == ywid) {
                                $dom.addClass("data-panel-tab-row-hover");
                            }
                        });
                    },
                    popupclose: function () {
                        $(".data-panel3 .data-panel-tab-row").removeClass(
                            "data-panel-tab-row-hover"
                        );
                    }
                });
                markerClusterGroup.addLayer(marker);
                map.addLayer(markerClusterGroup);
            });
            markerClusterGroup.addTo(map);
        }

        // 加载工具
        function loadGj(index) {
            let defaultStyle = plotting.getDefaultStyle();
            defaultStyle.defaultFlag = true;
            defaultStyle.lineColor = "#ff0000";
            queryResult = [];
            drawControl.handler.disable();
            drawControl.handler.libID = 0;
            drawControl.handler.serverUrl = serverUrl;
            switch (index) {
                case "1":
                    drawControl.handler.code = 26;
                    break;
                case "2":
                    drawControl.handler.code = 29;
                    break;
                case "3":
                    drawControl.handler.code = 32;
                    break;
            }
            drawControl.handler.enable();
        }

        // 加载查询的echarts图
        function renderSearchChart() {
            let $panel = $(".search-pop-panel");
            if (isRenderSearchChart) {
                $panel.show();
            } else {
                $panel.hide();
            }
            sugon.requestJson(
                {
                    type: "post",
                    url: sugon.interFaces.myhc.myzs.getRightMidData,
                    data: {
                        deptId: $("#placeCode").val(),
                        date1: $("#date1").val(),
                        date2: $("#date2").val(),
                        keyword: searchInput
                    },
                    async: true
                },
                function (result) {
                    let data1 = result.data1;
                    data1.map(function (val, index) {
                        $(".left-mid-amount")
                            .eq(index)
                            .html(val);
                    });
                    reRenderChart(result.data2);
                }
            );
        }

        // 重新渲染echarts图
        function reRenderChart(data) {
            let chart = echarts.init(document.getElementById("search-pop-chart"));
            let xData = [],
                yData = [],
                min = 0,
                max = 0,
                isSet,
                isShow = false,
                startValue = 0,
                endValue = 100;
            if (data.length == 0) {
                isSet = false;
                xData.push("无数据");
                yData.push(0);
            } else {
                min = Number(data[0].value);
                max = Number(data[0].value);
                isSet = true;
                for (let i = 0; i < data.length; i++) {
                    min = Math.min(min, data[i].value);
                    max = Math.max(max, data[i].value);
                    xData.push(data[i].name);
                    yData.push(data[i].value);
                }
            }
            if (data.length > 5) {
                isShow = true;
                endValue = Math.floor((5 / data.length) * 100);
            }

            let diff = (max - min) / 2;
            min = Number(min - diff).toFixed(2);
            max = Number(max + diff).toFixed(2);
            let option = {
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "shadow"
                    }
                },
                color: ["#1e9eb7"],
                dataZoom: [
                    {
                        type: "inside",
                        start: startValue,
                        end: endValue,
                        zoomOnMouseWheel: false
                    },
                    {
                        show: isShow,
                        type: "slider",
                        start: startValue,
                        end: endValue,
                        height: 7,
                        bottom: 0,
                        handelSize: 0,
                        zoomLock: true,
                        textStyle: false
                    }
                ],
                grid: {
                    left: 0,
                    top: 10,
                    bottom: "5%",
                    right: 0,
                    containLabel: true
                },
                xAxis: [
                    {
                        type: "category",
                        axisTick: {show: false},
                        splitArea: {show: false},
                        data: xData,
                        axisLabel: {
                            interval: 0,
                            textStyle: {
                                color: "#000"
                            },
                            formatter: function (param) {
                                return sugon.handleStrLineFeed(param);
                            }
                        },
                        axisLine: {
                            lineStyle: {
                                color: "#d5d8e1"
                            }
                        }
                    }
                ],
                yAxis: [
                    {
                        type: "value",
                        min: isSet ? min : "",
                        max: isSet ? max : "",
                        axisTick: {show: false},
                        splitLine: {
                            lineStyle: {
                                color: "#d5d8e1"
                            }
                        },
                        splitArea: {show: false},
                        splitNumber: 5,
                        axisLabel: {
                            textStyle: {
                                color: "#000"
                            }
                        },
                        axisLine: {
                            lineStyle: {
                                color: "#d5d8e1"
                            }
                        }
                    }
                ],
                series: [
                    {
                        type: "bar",
                        barWidth: 20,
                        data: yData
                    }
                ]
            };
            chart.setOption(option);
        }

        // 复位页面
        function resetPage(type, isSearch) {
            $(".search-pop-panel").hide();
            $(".search-down-panel > button")
                .removeAttr("class")
                .addClass("animate-btn-disabled");
            let $control = $(".search-control").val();
            if ($control == "1") {
                let searchYw = $(".search-yw");
                let searchGj = $(".search-gj");
                $(".data-panel2").hide();
                $(".toolbar-panel3").hide();
                map.off("click");
                $(".toolbar-panel3 > div").removeClass("toolbar-panel3-hover");
                if (!isSearch) {
                    isRenderSearchChart = false;
                    $(".search-pop-panel").hide();
                    searchInput = "";
                    $(".search-input").val("");
                    searchYw.removeAttr("disabled");
                    searchGj.removeAttr("disabled");
                }
                type = type || 0;
                searchYw.val(type);
                $(".analysis-btn").hide();
                isQuery = false;
                $(".toolbar-panel2").hide();
                $(".pop-rdwtfx").hide();
                $(".toolbar-panel2-pop").hide();
                searchGj.val(0);
                $(".toolbar-panel2 > div").removeClass("toolbar-panel2-hover");
                removeAllLayers();
                bounds = "";
                map.off("moveend");
                if (drawControl) {
                    drawControl.handler.disable();
                }
                $(".right-panel-up-2").hide();
                $(".right-panel-up-3").hide();
                $(".right-panel-up-1").show();
                $(".right-panel-up")
                    .show()
                    .css("height", "70%");
                $(".right-panel-down").css("height", "30%");
                $(".data-panel").hide();
                queryGroup = L.layerGroup();
                map.setView(zoomArr[2].center, zoomArr[2].zoom);
                initPcs();
            } else {
                sugon.request(sugon.interFaces.myhc.myzs.DeptId).then(result => {
                    $("#placeCode").val(result.ID);
                    $("#place").val(result.NAME);
                    $(".data-panel2").hide();
                    $(".data-panel3").hide();
                    $(".data-panel4").hide();
                    $(".toolbar-panel3").hide();
                    $(".search-pop-panel").hide();
                    $(".search-yw2").val(1);
                    $(".search-gj").val(0);
                    map.off("click");
                    removeAllLayers();
                    initPcs(true);
                });
            }
        }

        // 清除圈选页面
        function clearPage() {
            $(".data-panel2").hide();
            if (currentLevel == 3) {
                if (drawControl) {
                    drawControl.handler.disable();
                }
                $(".data-panel3").hide();
                $(".data-panel4").hide();
                $(".search-gj").val(0);
                $(".data-panel").hide();
                map.removeLayer(queryGroup);
                queryGroup = L.layerGroup();
                map.removeLayer(markerClusterGroup);
                markerClusterGroup = L.layerGroup();
                map.removeLayer(queryPlottingLayer);
                $(".pop-rdwtfx").hide();
            }
            if (currentLevel == 5) {
                $(".toolbar-panel2 > div").removeClass("toolbar-panel2-hover");
                $(".toolbar-panel2-pop").hide();
                map.removeLayer(popMarkerGroup);
            }
            if ($(".toolbar-panel3").css("display") === "block") {
                $(".toolbar-panel3 > div").removeClass("toolbar-panel3-hover");
            }
        }

        // 加载plot图
        function loadPlot(isMyzs) {
            serverUrl =
                "http://10.33.66.183:2334/iserver/services/plot-jingyong/rest/plot/";
            queryPlottingLayer = L.supermap.plotting.plottingLayer("plot", serverUrl);
            queryPlottingLayer.addTo(map);
            drawControl = L.supermap.plotting.drawControl(queryPlottingLayer);
            drawControl.addTo(map);
            plotting = L.supermap.plotting.getControl(map, serverUrl);
            loadSymbolLib(isMyzs);
        }

        function loadSymbolLib(isMyzs) {
            let symbolLibManager = plotting.getSymbolLibManager();
            symbolLibManager.libIDs = [421];
            symbolLibManager.on(
                SuperMap.Plot.Event.initializecompleted,
                isMyzs
                    ? myzsSymbolLibInitializeCompleted
                    : sqfbSymbolLibInitializeCompleted
            );
            symbolLibManager.initializeAsync();
            drawControl.on(SuperMap.Plot.Event.featureadded, function (event) {
                let layer = event.feature;
                let latLngs = layer.getLatLngs();
                let symbolType = layer.symbolType;
                // queryPlottingLayer.removeFeatures(layer);
                if (symbolType === SuperMap.Plot.SymbolType.ARBITRARYPOLYGONSYMBOL) {
                    queryResult = L.supermap.plotting
                        .query(map)
                        .getGObjectsInPolygon(latLngs);
                }
                if (symbolType === SuperMap.Plot.SymbolType.CIRCLESYMBOL) {
                    let radius = Math.sqrt(
                        Math.pow(latLngs[1].lng - latLngs[0].lng, 2) +
                        Math.pow(latLngs[1].lat - latLngs[0].lat, 2)
                    );
                    queryResult = L.supermap.plotting
                        .query(map)
                        .getGObjectsInCircle(latLngs[0], radius);
                }
                if (symbolType === SuperMap.Plot.SymbolType.RECTANGLESYMBOL) {
                    queryResult = L.supermap.plotting
                        .query(map)
                        .getGObjectsInRect(latLngs[0], latLngs[1]);
                }
                if (queryResult && queryResult.length !== 0) {
                    selectedData = [];
                    hiddenSelectedData = [];
                    queryResult.map(function (value1) {
                        mapMarkData.map(function (value2) {
                            if (value1.uuid == value2.ywid) {
                                selectedData.push(value2);
                            }
                        });
                        hiddenMapMarkData.map(value2 => {
                            if (value1.uuid == value2.ywid) {
                                hiddenSelectedData.push(value2);
                            }
                        });
                    });
                    if (isMyzs) {
                        rdwtData.content = rdwtData.content.replace(
                            /[0-9]+/g,
                            selectedData.length
                        );
                        renderMyzsMarker(selectedData, true);
                    } else {
                        isQuery = true;
                        initDataPanel($(".search-yw").val());
                    }
                }
                drawControl.handler.disable();
                $(".search-gj").val(0);
            });
        }

        // 诉求分布symbol初始化完成事件
        function sqfbSymbolLibInitializeCompleted() {
            let libID = 421;
            let code = 20100;
            SuperMap.Plot.PlottingUtil.getDataFromServer(
                serverUrl,
                libID,
                code,
                null,
                {},
                null,
                function (res) {
                    let newBounds = map.getBounds();
                    if (!bounds || JSON.stringify(bounds) != JSON.stringify(newBounds)) {
                        // 判断边界非空或者相等
                        bounds = newBounds;
                    }
                    // 加载图形数据
                    sugon.requestJson(
                        {
                            type: "post",
                            url: sugon.interFaces.myhc.myzs.getMapDataByBounds,
                            data: {
                                northEast: JSON.stringify(bounds._northEast),
                                southWest: JSON.stringify(bounds._southWest),
                                date1: $("#date1").val(),
                                date2: $("#date2").val(),
                                type: $(".search-yw").val(),
                                deptCode: sugon.identityInfo.deptCode
                            },
                            async: true
                        },
                        function (result) {
                            mapMarkData = result.data;
                            result.data.map(function (value) {
                                let latLngs = [];
                                latLngs.push(L.latLng(value.lat, value.lng));
                                queryPlottingLayer.createSymbol(
                                    libID,
                                    code,
                                    latLngs,
                                    value.ywid,
                                    {
                                        color: "transparent"
                                    },
                                    {symbolData: res.result, serverUrl: serverUrl}
                                );
                            });
                        }
                    );
                },
                null
            );
        }

        // 民意指数symbol初始化完成事件
        function myzsSymbolLibInitializeCompleted() {
            let libID = 421;
            let code = 20100;
            SuperMap.Plot.PlottingUtil.getDataFromServer(
                serverUrl,
                libID,
                code,
                null,
                {},
                null,
                function (res) {
                    let newBounds = map.getBounds();
                    if (!bounds || JSON.stringify(bounds) != JSON.stringify(newBounds)) {
                        // 判断边界非空或者相等
                        bounds = newBounds;
                    }
                    // 加载图形数据
                    sugon.requestJson(
                        {
                            type: "post",
                            url: sugon.interFaces.myhc.myzs.getYlldDetailMapDataByBound,
                            data: {
                                northEast: JSON.stringify(bounds._northEast),
                                southWest: JSON.stringify(bounds._southWest),
                                date1: $("#date1").val(),
                                date2: $("#date2").val(),
                                type: $(".search-yw2").val(),
                                deptCode: sugon.identityInfo.deptCode
                            },
                            async: true
                        },
                        function (result) {
                            rdwtData = result;
                            mapMarkData = result.data;
                            hiddenMapMarkData = result.data0;
                            let data = result.data.concat(hiddenMapMarkData);
                            data.map(function (value) {
                                let latLngs = [];
                                latLngs.push(L.latLng(value.lat, value.lng));
                                queryPlottingLayer.createSymbol(
                                    libID,
                                    code,
                                    latLngs,
                                    value.ywid,
                                    {
                                        color: "transparent"
                                    },
                                    {symbolData: res.result, serverUrl: serverUrl}
                                );
                            });
                        }
                    );
                },
                null
            );
        }




        // 查询功能
        function searchFunc() {
            $(".search-control").val(1);
            let inputVal = $(".search-input").val();
            let reg = /\S/;
            if (reg.test(inputVal)) {
                $(".search-pop-nav").remove();
                $("#search-pop-chart").css("height", "calc(100% - 120px)");
                $(".right-panel-panel2").hide();
                $(".right-panel-panel").show();
                $(".analysis-btn").hide();
                searchInput = inputVal;
                $(".keyword-search").html(
                    '包含“<span style="color: #1d84c6;">' +
                    searchInput +
                    "</span>”的群众诉求共计："
                );
                let type = 0;
                let searchYw = $(".search-yw");
                let searchGj = $(".search-gj");
                searchYw.attr("disabled", "disabled").val(type);
                searchGj.attr("disabled", "disabled");
                sugon.requestJson(
                    {
                        type: "post",
                        url: sugon.interFaces.myhc.myzs.getMapCount,
                        async: false,
                        data: {
                            deptId: $("#placeCode").val(),
                            date1: $("#date1").val(),
                            date2: $("#date2").val(),
                            type: type,
                            keyword: searchInput
                        }
                    },
                    function (result) {
                        let totalCount = result.data[0].substring(
                            result.data[0].indexOf("(") + 1,
                            result.data[0].lastIndexOf(")")
                        );
                        if (totalCount < 50) {
                            $(".search-pop-panel").hide();
                            removeAllLayers();
                            initDataPanel(type);
                        } else {
                            isRenderSearchChart = true;
                            resetPage(type, true);
                        }
                    }
                );
            }
        }

        // 回复marker的颜色
        function recoverMarker() {
            map.eachLayer(function (layer) {
                if (
                    layer._popup &&
                    layer.options.icon.options.iconUrl.indexOf("selected") > -1
                ) {
                    rdwtData.data.map(val => {
                        if (layer.options.ywid == val.ywid && layer.setIcon) {
                            layer.setIcon(
                                L.icon({
                                    iconUrl: `../../img/myhc/myzs/location_12345.png`,
                                    popupAnchor: [10, 5]
                                })
                            );
                        }
                    });
                }
            });
        }

        // 诉求分布工具切换事件
        function sqfbGjChange(index) {
            let $panel3 = $(".toolbar-panel3");
            $panel3.hide();
            map.off("click");
            $(".analysis-btn").show();
            $(".data-panel").hide();
            removeAllLayers();
            map.setZoom(16, {animate: false});
            let $searchYw = $(".search-yw");
            if ($searchYw.val() == 4) {
                $searchYw.val(0);
                $(".toolbar-panel2").hide();
                $(".toolbar-panel2-pop").hide();
            }

            // 绑定移动事件
            map.on("moveend", function () {
                if (currentLevel == 3) {
                    if (drawControl) {
                        drawControl.handler.disable();
                    }
                    $(".search-gj").val(0);
                }
            });
            currentLevel = 3;
            loadPlot();
            loadGj(index);
        }

        // 民意指数工具切换事件
        function myzsGjChange(index) {
            let $panel3 = $(".toolbar-panel3");
            if (index == 4) {
                removeAllLayers();
                $panel3
                    .show()
                    .off()
                    .on("click", "div", function (e) {
                        let $target = $(e.target),
                            className = "toolbar-panel3-hover";
                        $target.hasClass(className)
                            ? $target.removeClass(className)
                            : $target.addClass(className);
                        let $hover = $(".toolbar-panel3-hover"),
                            typeArr = [],
                            $panel2 = $(".data-panel2");
                        $hover.each((index, dom) => {
                            let indexOfDiv = $(dom).index(".toolbar-panel3 > div");
                            typeArr.push(indexOfDiv);
                        });

                        if (typeArr.length > 0) {
                            map.off("click").on("click", function (e) {
                                $panel2.show();
                                map.closePopup();
                            });
                        } else {
                            $panel2.hide();
                            map.off("click");
                        }
                    });
            } else {
                map.off("click");
                removeAllLayers();
                map.setZoom(15, {animate: false});

                // 绑定移动事件
                map.on("moveend", function () {
                    if (currentLevel == 3) {
                        if (drawControl) {
                            drawControl.handler.disable();
                        }
                        $(".search-gj").val(0);
                    }
                });
                currentLevel = 3;
                loadPlot(true);
                loadGj(index);
            }
        }

        // 初始化右侧面板
        function initRightPanel2(type) {
            let deptId = $("#placeCode").val(),
                date1 = $("#date1").val(),
                date2 = $("#date2").val();
            let option = {deptId, date1, date2, type};
            let optionArr = [
                {deptId, date1, date2, type: 1},
                {deptId, date1, date2, type: 2}
            ];
            optionArr.map(val => {
                initYlldRight1(val);
            });
            initYlldRight2(option);
            // initYlldRight3(option);
            initYlldRight4(option);
        }

        // 初始化右1面板
        function initYlldRight1(condition) {
            sugon
                .request(sugon.interFaces.myhc.myzs.getYlldMapRight1, condition)
                .then(result => {
                    let data = result,
                        $container = $(".right-up-banner2").eq(condition.type - 1);
                    $container.find(".right-up-banner-left2").html(data.data[0] + "%");
                    let $body = $container.find(".right-up-banner-right2").empty();
                    let colorIconArr = [];
                    for (let i = 0, len = data.data.length; i < len; i++) {
                        if (i === 4 || i === 6) {
                            data.data[i] = -data.data[i];
                        }
                        colorIconArr.push(handleColorAndIcon(data.data[i]));
                        data.data[i] = Math.abs(Number(data.data[i]));
                    }
                    let html = `<div><span>同比</span>
                                    <div class="${colorIconArr[1].color}">
                                    <i class="glyphicon ${
                        colorIconArr[1].icon
                        }"></i><strong>${data.data[1]}%</strong>
                                    </div>
                                </div>
                                <div><span>环比</span>
                                    <div class="${colorIconArr[2].color}">
                                    <i class="glyphicon ${
                        colorIconArr[2].icon
                        }"></i><strong>${data.data[2]}%</strong>
                                    </div>
                                </div>`;
                    $body.append(html);
                    let text = `<span style="margin-left: 5px;">市局排名:
                                    <strong class="${colorIconArr[3].color}">${
                        data.data[3]
                        }</strong>名
                                </span>
                                ${
                        data.data[4] == 0
                            ? ""
                            : `<i class="glyphicon ${
                                colorIconArr[4].icon
                                } ${colorIconArr[4].color}"></i>
                                    <strong class="${colorIconArr[4].color}">${
                                data.data[4]
                                }</strong>`
                        }`;
                    switch (data.type) {
                        case "0":
                            text = "";
                            break;
                        case "1":
                            text = `<span style="margin-left: 5px;">
                                    市局排名:<strong class="${
                                colorIconArr[3].color
                                }">${data.data[3]}</strong>名
                                </span>
                                <span style="margin-left: 15px;">
                                    较上期:<i class="glyphicon ${
                                colorIconArr[4].icon
                                } ${colorIconArr[4].color}"></i>
                                        <strong class="${
                                colorIconArr[4].color
                                }">${data.data[4]}</strong>
                                </span>`;
                            break;
                        case "2":
                            text += `<span style="margin-left: 10px;">
                                    分局排名:<strong class="${
                                colorIconArr[5].color
                                }">${data.data[5]}</strong>名
                                 </span>${
                                data.data[6] == 0
                                    ? ""
                                    : `<i class="glyphicon ${
                                        colorIconArr[6].color
                                        } ${colorIconArr[6].icon}"></i>
                                 <strong class="${colorIconArr[6].color}">${
                                        data.data[6]
                                        }</strong>`
                                }`;
                            break;
                        case "4":
                            text += `<span style="margin-left: 10px;">
                                    所队排名:<strong class="${
                                colorIconArr[5].color
                                }">${data.data[5]}</strong>名
                                 </span>
                                 ${
                                data.data[6] == 0
                                    ? ""
                                    : `<i class="glyphicon ${
                                        colorIconArr[6].color
                                        } ${colorIconArr[6].icon}"></i>
                                 <strong class="${colorIconArr[6].color}">${
                                        data.data[6]
                                        }</strong>`
                                }`;
                            break;
                    }
                    $container.css("height", text ? "125px" : "100px");
                    $container.find(".banner-pop").remove();
                    let $div = $("<div/>").addClass("banner-pop");
                    $div.append(text).appendTo($container);
                });
        }

        // 初始化右2面板
        function initYlldRight2(condition) {
            sugon
                .request(sugon.interFaces.myhc.myzs.getYlldMapRight2, condition)
                .then(result => {
                    let data = result.data,
                        sum = 0;
                    data.map(val => {
                        sum += Number(val.value);
                    });
                    let chart = echarts.init(document.getElementById("right-ybfx"));
                    let option = {
                        title: {
                            text: sum,
                            subtext: "有效样本量",
                            left: "center",
                            top: "25%",
                            padding: [24, 0],
                            subtextStyle: {
                                color: "#000",
                                fontSize: "14"
                            },
                            textStyle: {
                                color: "#1D84C6"
                            }
                        },
                        tooltip: {
                            show: true
                        },
                        series: [
                            {
                                color: [
                                    "#A770B3",
                                    "#AF8744",
                                    "#ED7D31",
                                    "#3A9BBE",
                                    "#1D84C6",
                                    "#6463AF"
                                ],
                                name: "",
                                type: "pie",
                                clockWise: false,
                                center: ["50%", "50%"],
                                radius: ["40%", "56%"],
                                hoverAnimation: false,
                                itemStyle: {
                                    normal: {
                                        label: {
                                            show: true,
                                            position: "outside",
                                            formatter: function (params) {
                                                return params.name + "\n" + params.value;
                                            },
                                            rich: {
                                                white: {
                                                    color: "#ddd",
                                                    align: "center"
                                                }
                                            }
                                        },
                                        labelLine: {
                                            show: true,
                                            length: 8,
                                            length2: 5
                                        }
                                    }
                                },
                                data: data
                            }
                        ]
                    };
                    chart.setOption(option);
                    chart.resize();
                });
        }

        // 初始化右3面板
        function initYlldRight3(condition) {
            condition.id || (condition.id = "");
            sugon
                .request(sugon.interFaces.myhc.myzs.getYlldMapRight3, condition)
                .then(result => {
                    let data = result.data;
                    let chart = echarts.init(document.getElementById("right-sqfl"));
                    let xData = [],
                        yData = [],
                        colorArr = ["#4e99dd", "#E28C51", "#6eaba3"];
                    data.map((val, index) => {
                        let {id, value} = val;
                        xData.push(val.name);
                        yData.push({
                            id,
                            value,
                            itemStyle: {
                                color: colorArr[index]
                            }
                        });
                    });
                    let option = {
                        tooltip: {
                            trigger: "axis",
                            axisPointer: {
                                type: "shadow"
                            }
                        },
                        grid: {
                            left: 10,
                            top: 30,
                            right: 20,
                            bottom: 10,
                            containLabel: true
                        },
                        xAxis: [
                            {
                                type: "category",
                                axisTick: {show: false},
                                splitArea: {show: false},
                                data: xData,
                                axisLabel: {
                                    interval: 0,
                                    textStyle: {
                                        color: "#000"
                                    }
                                },
                                axisLine: {
                                    lineStyle: {
                                        color: "#d5d8e1"
                                    }
                                }
                            }
                        ],
                        yAxis: [
                            {
                                type: "value",
                                axisTick: {show: false},
                                splitLine: {
                                    lineStyle: {
                                        color: "#d5d8e1"
                                    }
                                },
                                splitArea: {show: false},
                                splitNumber: 5,
                                axisLabel: {
                                    formatter: "{value}",
                                    textStyle: {
                                        color: "#000"
                                    }
                                },
                                axisLine: {
                                    lineStyle: {
                                        color: "#d5d8e1"
                                    }
                                }
                            }
                        ],
                        series: [
                            {
                                type: "bar",
                                barWidth: 30,
                                data: yData,
                                label: {
                                    show: true,
                                    position: "top",
                                    color: "#000",
                                    fontSize: 16
                                }
                            }
                        ]
                    };
                    chart.setOption(option);
                    chart.off();
                    chart.on("click", param => {
                        if (param.data.id) {
                            condition.id = param.data.id;
                            initYlldRight3(condition);
                            $(".img-sqfl").show();
                        }
                    });
                });
        }

        // 初始化右4面板
        function initYlldRight4(condition, color = "#027ecb") {
            condition.orderBy || (condition.orderBy = "asc");
            sugon
                .request(sugon.interFaces.myhc.myzs.getYlldMapRight4, condition)
                .then(result => {
                    let data = result.data;
                    let $body = $(".right-phb").empty();
                    data.map(val => {
                        $body.append(
                            `<div><div>第${val.order}名</div><div>${val.name}</div><div>${val.value}%</div></div>`
                        );
                    });
                    $(".right-phb > div > div:nth-child(3)").css("color", color);
                });
        }

        // 渲染热点问题面板
        function renderRdwtPanel(result) {
            let $body = $(".data-panel4").empty(),
                html = "";
            html += `<div class="data-panel-header4">
                            <img src="../../img/myhc/myzs/cube.png">
                            <span>区域群众诉求</span>
                            <i class="glyphicon glyphicon-remove"></i>
                        </div><h5>区域热点问题：</h5>`;
            result.data1.map((val, index) => {
                html += `<p ywid="${val.ywid}">${index + 1}、${val.name}</p>`;
            });
            html += `<h5>问题预警：</h5>`;
            html += "<div class='clear-div'></div>";
            result.data2.map((val, index) => {
                let colorAndIcon = handleColorAndIcon(val.trend),
                    inc = val.trend > 0 ? "上升" : "下降";
                html += `<div class="rdwt-row">
                            <div>${index + 1}、${val.name}</div>
                            <div>词频： ${val.value}</div>
                            <div>较上期呈:<span class="${
                    colorAndIcon.color
                    }">${inc}趋势</span><i class="glyphicon ${
                    colorAndIcon.icon
                    } ${colorAndIcon.color}"></i></div>
                         </div>`;
            });
            $body.append(html);
        }

        // 页面入口
        $(function () {
            // 加载地图
            createMapL();
        });

        // 禁用全局右击事件
        $("#mainMap").bind("contextmenu", function () {
            return false;
        });

        // 业务下拉框改变事件
        $(".toolbar-panel").on("change", ".search-yw", function () {
            let index = $(this).val();
            if (currentLevel == 5) {
                resetPage(index);
            } else {
                initLevelLayer();
            }
        });

        // 左下查询条件改变事件
        $(".data-panel-search").on("click", "div", function (e) {
            let $div = $(".data-panel-search > div");
            let index = $div.index(e.target);
            if (!$(e.target).hasClass("search-selected")) {
                $div.removeClass("search-selected");
                $(e.target).addClass("search-selected");
                initTab($(".search-yw").val(), "", index);
            }
        });

        // 数据panel关闭事件
        $(".data-panel .data-panel-header > i").click(function () {
            $(".data-panel").hide();
        });

        // 数据panel2关闭事件
        $(".data-panel2 .data-panel-header > i").click(function () {
            $(".data-panel2").hide();
        });

        // 诉求分类返回按钮
        $("body").on("click", ".img-sqfl", e => {
            let conditon = {
                deptId: $("#placeCode").val(),
                date1: $("#date1").val(),
                date2: $("#date2").val(),
                type: $(".search-yw2").val()
            };
            initYlldRight3(conditon);
            $(e.target).hide();
        });

        // 排行榜排序方式按钮
        $(".right-header").on("click", ".img-phb", e => {
            let $target = $(e.target),
                className = "img-phb-rotate",
                condition = {
                    deptId: $("#placeCode").val(),
                    date1: $("#date1").val(),
                    date2: $("#date2").val(),
                    type: $(".search-yw2").val(),
                    orderBy: ""
                },
                color;
            if ($target.hasClass(className)) {
                condition.orderBy = "asc";
                color = "#027ecb";
                $target.removeClass(className);
            } else {
                condition.orderBy = "desc";
                $target.addClass(className);
                color = "#ED5554";
            }
            initYlldRight4(condition, color);
        });

        // 工具切换时
        $(".search-gj").on("change", function () {
            let index = $(this).val(),
                type = $(".search-control").val();
            $(".search-down-panel > button")
                .removeAttr("class")
                .addClass("animate-btn-disabled");
            type == "1" ? sqfbGjChange(index) : myzsGjChange(index);
        });

        // 清除按钮事件
        $(".search-clear").click(function () {
            clearPage();
        });

        // 复位按钮事件
        $(".search-reset").click(function () {
            resetPage();
        });

        // 查询按钮事件
        $(".search-btn").click(function () {
            searchFunc();
        });

        // 回车查询事件
        $(".search-input").on("keyup", function (e) {
            if (e.keyCode == 13) {
                searchFunc();
            }
        });

        // 左下tab点击事件
        $(".data-panel .data-panel-tab").on(
            "click",
            ".data-panel-tab-row",
            function (e) {
                let $target = $(e.target);
                $target = $target.hasClass("data-panel-tab-row")
                    ? $target
                    : $target.parent();
                let ywid = $target.attr("ywid");
                for (let key in queryGroup._layers) {
                    if (queryGroup._layers[key]._popup._content.indexOf(ywid) > 0) {
                        queryGroup._layers[key].openPopup();
                    }
                }
            }
        );

        // 左下tab点击事件
        $(".data-panel2 .data-panel-tab").on(
            "click",
            ".data-panel-tab-row",
            function (e) {
                let $target = $(e.target);
                $target = $target.hasClass("data-panel-tab-row")
                    ? $target
                    : $target.parent();
                let ywid = $target.attr("ywid");
            }
        );

        // 左下tab点击事件
        $(".data-panel3 .data-panel-tab3").on(
            "click",
            ".data-panel-tab-row",
            function (e) {
                let $target = $(e.target);
                $target = $target.hasClass("data-panel-tab-row")
                    ? $target
                    : $target.parent();
                let ywid = $target.attr("ywid");
                for (let key in markerClusterGroup._layers) {
                    if (
                        markerClusterGroup._layers[key]._popup._content.indexOf(ywid) > 0
                    ) {
                        markerClusterGroup._layers[key].openPopup();
                    }
                }
            }
        );

        // 分析按钮点击事件
        $(".analysis-btn").click(function () {
            let keywordArr = [],
                timesArr = [],
                idArr = {},
                result = [];
            selectedData.map(function (value) {
                let sqwtArr = (value.sqwt || "").split(",");
                sqwtArr.map(function (value1) {
                    let index = keywordArr.indexOf(value1);
                    if (index == -1 && value1) {
                        timesArr[keywordArr.length] = 1;
                        keywordArr.push(value1);
                        idArr[value1] = idArr[value1] || [];
                        idArr[value1].push(value.ywid);
                    } else {
                        if (value1) {
                            timesArr[index]++;
                        }
                    }
                });
            });
            keywordArr.map(function (value, index) {
                let obj = {name: value, value: timesArr[index], id: idArr[value]};
                result.push(obj);
            });
            result.map(function (val1, i) {
                result.map(function (val2, j) {
                    if (val1.value > val2.value) {
                        let temp = result[i];
                        result[i] = result[j];
                        result[j] = temp;
                    }
                });
            });
            let $container = $(".pop-rdwtfx");
            let $body = $('<div class="pop-map-mark-body"></div>');
            $container
                .show()
                .empty()
                .append(
                    $(
                        '<div class="pop-map-mark-header">区域热点问题<i class="glyphicon glyphicon-remove"></i></div>'
                    )
                );
            let size = result.length < 4 ? result.length : 3;
            for (let i = 0; i < size; i++) {
                $body.append(
                    '<p ywid="' +
                    result[i].id +
                    '">' +
                    (i + 1) +
                    "、该区域" +
                    result[i].name +
                    "问题较为突出。    " +
                    result[i].value +
                    "件</p>"
                );
            }
            $body.appendTo($container);
        });

        // 热点问题分析弹出页关闭事件
        $(".pop-rdwtfx").on("click", ".pop-map-mark-header > i", function () {
            $(".pop-rdwtfx").hide();
        });

        // 分析弹出页点击事件
        $(".pop-rdwtfx").on("click", ".pop-map-mark-body > p", function () {
            let $this = $(this);
            let idArr = $this.attr("ywid").split(",");
            map.eachLayer(function (layer) {
                if (layer._popup) {
                    let content = layer._popup._content;
                    idArr.map(function (val) {
                        if (content.indexOf(val) > -1) {
                            if (layer.setIcon) {
                                layer.setIcon(
                                    L.icon({
                                        iconUrl: "../../img/myhc/myzs/location_selected.png",
                                        popupAnchor: [10, 5]
                                    })
                                );
                            }
                        }
                    });
                }
            });
        });

        // 面板第四列控制下拉框改变时间
        $(".search-control").on("change", function () {
            $(".search-down-panel > button")
                .removeAttr("class")
                .addClass("animate-btn-disabled");
            let $this = $(this),
                index = $this.val(),
                yw1 = $(".search-yw"),
                yw2 = $(".search-yw2"),
                $toolbar = $(".toolbar-panel > div:nth-child(5)"),
                bmqOption = $(".bmq-option");
            if (index == 1) {
                yw2.hide();
                yw1.show();
                $toolbar.css(
                    "background",
                    "url('../../img/myhc/myzs/service.png') no-repeat 0 50%"
                );
                bmqOption.hide();
                initPcs();
            } else {
                yw1.hide();
                yw2.show();
                bmqOption.show();
                $toolbar.css("background", "none");
                removeAllLayers();
                initPcs(true);
            }
        });

        // 业务2改变时间
        $(".toolbar-panel").on("change", ".search-yw2", function () {
            initPcs(true);
        });

        // data-panel3关闭按钮事件
        $(".data-panel-header3 > i").click(() => {
            $(".data-panel3").hide();
        });

        // 热点问题弹出页
        $(".analysis-btn3").click(() => {
            $(".data-panel3").hide();
            $(".data-panel4").show();
            let flag = $(".data-panel3").attr("isQuery");
            if (flag == "1") {
                let bound = map.getBounds();
                let idArr = [],
                    id0Arr = [];
                selectedData.map(val => {
                    idArr.push(val.ywid);
                });
                hiddenSelectedData.map(val => {
                    id0Arr.push(val.ywid);
                });
                let condition = {
                    deptId: $("#placeCode").val(),
                    date1: $("#date1").val(),
                    date2: $("#date2").val(),
                    northEast: JSON.stringify(bound._northEast),
                    southWest: JSON.stringify(bound._southWest),
                    type: $(".search-yw2").val(),
                    ids: idArr.join(","),
                    ids0: id0Arr.join(","),
                    deptCode: sugon.identityInfo.deptCode
                };
                sugon
                    .request(sugon.interFaces.myhc.myzs.getYlldRdsjByBound, condition)
                    .then(result => {
                        renderRdwtPanel(result);
                    });
            } else {
                renderRdwtPanel(rdwtData);
            }
        });

        // 热点问题弹出页关闭
        $(".data-panel4").on("click", ".data-panel-header4 > i", () => {
            $(".data-panel4").hide();
            $(".data-panel3").show();
            recoverMarker();
        });

        // 热点问题p标签点击事件
        $(".data-panel4").on("click", "p", e => {
            let $target = $(e.target);
            $(".data-panel4 > p").css("background-color", "transparent");
            $target.css("background-color", "#409cf1");
            recoverMarker();
            selected_ywid = $(e.target).attr("ywid");
            let arr = selected_ywid.split(" ");
            map.eachLayer(function (layer) {
                if (layer._popup) {
                    arr.map(val => {
                        if (layer.options.ywid == val && layer.setIcon) {
                            layer.setIcon(
                                L.icon({
                                    iconUrl: "../../img/myhc/myzs/location_selected.png",
                                    popupAnchor: [10, 5]
                                })
                            );
                        }
                    });
                }
            });
        });

        // 下拉按钮事件
        $(".btn-up-down > div").on("click", e => {
            let $target = $(e.target),
                className = $target.attr("class"),
                up = "btn-up",
                down = "btn-down",
                newClassName,
                $panel = $(".data-panel3"),
                height,
                mapHeight = $("#mainMap").height(),
                $tab = $(".data-tab-container"),
                overflow;
            if (className == up) {
                newClassName = down;
                height = "110px";
                overflow = "auto";
            } else {
                newClassName = up;
                height = `${mapHeight - 180}px`;
                overflow = "hidden";
            }
            $target.removeClass(className).addClass(newClassName);
            $panel.animate({height: height});
            $tab.css("overflow", overflow);
        });

        // 右侧面板弹出页事件
        $(".right-up-banner2").on("click", function () {
            let $this = $(this),
                index = $this.index(".right-up-banner2"),
                title = index === 0 ? "社会治安" : "公安队伍",
                condition = {
                    deptId: $("#placeCode").val(),
                    date1: $("#date1").val(),
                    date2: $("#date2").val(),
                    type: index + 1
                };
            sugon.renderDialog({
                width: 600,
                height: 400,
                ele: `<div id="right-sqfl"></div>
                      <img src="../../img/myhc/myzs/return-btn.png" class="img-sqfl">`,
                title: `${title}满意度群众不满意诉求`
            });
            $(".simple_shade").remove();
            initYlldRight3(condition);
        });

        // 责任区点击事件
        $("#ui-view").on("click", ".zrq-popup-marker", async e => {
            const $target = $(e.target);
            selectedDeptCode = $target.attr("code");
            const showZrqMap = $target.attr("showZrqMap");
            let attr = "";
            $(".zrq-popup-marker-origin").remove();
            if (showZrqMap == 1) {
                $(".zrq-popup-marker-normal").show();
                attr = 0;
            } else {
                $(".zrq-popup-marker-normal").hide();

                const result = await sugon.request(sugon.interFaces.myhc.myzs.getZrqMap, {
                    deptCode: selectedDeptCode,
                    date1: $("#date1").val(),
                    date2: $("#date2").val()
                });

                result.data.map(val => {
                    const icon = L.icon({
                        className: "zrq-popup-marker-origin",
                        iconUrl: `../../img/myhc/myzs/animate/zrq/${val.type}.png`,
                        popupAnchor: [25, 25]
                    });
                    const marker = L.marker([val.lat, val.lng], {icon});
                    map.addLayer(marker);
                });
                attr = 1;
            }
            $target.attr("showZrqMap", attr);
        });

        // 责任区动效入口
        $("#ui-view").on("click", ".zrq-popup-marker-origin", e => {
            const params = {deptCode: selectedDeptCode, date1: $("#date1").val(), date2: $("#date2").val()};
            animate(params);
        });
    }
);
