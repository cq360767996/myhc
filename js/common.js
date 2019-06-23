define([], function () {
    var base = {};

    base.isPublished = false;

    base.server = "../";

    base.interFaces = {
        "myjz": {
            //下拉树
            "Tree": {localUrl: "./static/json/Tree.json", remoteUrl: base.server + "/myjz/getDwTree"},
            //民意矩阵中间数据
            "List": {localUrl: "./static/json/List.json", remoteUrl: base.server + "/myjz/getMyjz"},
            //查询栏日期默认值
            "Date": {localUrl: "./static/json/Date.json", remoteUrl: base.server + "/myjz/getRecentDate"},
            //极坐标弹窗接口
            "Window1": {localUrl: "./static/json/Window1.json", remoteUrl: base.server + "/myjz/getMyjzDialogData"},
            //环形图弹窗接口
            "Window2": {localUrl: "./static/json/Window2.json", remoteUrl: base.server + "/myjz/getMyjzDialogData"},
            //雷达图弹窗接口
            "Window3": {localUrl: "./static/json/Window3.json", remoteUrl: base.server + "/myjz/getMyjzDialogData"},
            //部门列表
            "bmList": {localUrl: "./static/json/bmList.json", remoteUrl: base.server + "/myjz/getMyjz"}
        },
        "dwjx": {
            //初始化标签
            "Tab": {localUrl: "./static/json/Tab.json", remoteUrl: base.server + "/dwjx/getNavigor"},
            //初始化标签
            "Chart": {localUrl: "./static/json/Chart.json", remoteUrl: base.server + "/dwjx/getChartData"},
            //下拉树
            "Tree": {localUrl: "./static/json/Tree.json", remoteUrl: base.server + "/dwjx/getDwTree"},
            //二级标签
            "Tab2": {localUrl: "./static/json/Tab2.json", remoteUrl: base.server + "/dwjx/getNavigor"},
            //标红功能
            "Keywords": {localUrl: "./static/json/Keywords.json", remoteUrl: base.server + "/dwjx/search"},
            //可操作图表
            "TopChart": {localUrl: "./static/json/TopChart.json", remoteUrl: base.server + "/dwjx/getNavigor"},
            //其他图标数据
            "OtherCharts": {localUrl: "./static/json/OtherCharts.json", remoteUrl: base.server + "/dwjx/getChartData"}
        },
        "myzs": {
            //下拉树
            "Tree": {localUrl: "./static/json/Tree.json", remoteUrl: base.server + "/myzs/getDwTree"}
        },
        "myys": {
            //民意热词
            "HotWords": {localUrl: "./static/json/HotWords.json", remoteUrl: base.server + "/myys/getReSouList"},
            //热搜-换一换
            "SearchList": {localUrl: "./static/json/SearchList.json", remoteUrl: base.server + "/myys/getReSouList"},
            //查询列表
            "DataList": {localUrl: "./static/json/DataList.json", remoteUrl: base.server + "/myys/search"},
            // 更新查询列表缓存
            "cacheDataList": {localUrl: "./static/json/DataList.json", remoteUrl: base.server + "/myys/cacheSearch"},
            //详情
            "Detail": {localUrl: "./static/json/Detail.json", remoteUrl: base.server + "/myys/getDetail"},
            // 缓存详情页
            "cacheDetail": {localUrl: "./static/json/Detail.json", remoteUrl: base.server + "/myys/cacheDetail"},
            // 弹出详细信息
            "PopDetail": {localUrl: "./static/json/Detail.json", remoteUrl: base.server + "myys/getPopDetail"},
            //详情表格
            "Grid": {localUrl: "./static/json/Grid.json", remoteUrl: base.server + "/myys/getGrid"},
            // 更新详情表格
            "cacheGrid": {localUrl: "./static/json/Grid.json", remoteUrl: base.server + "/myys/cacheGrid"},
            //详情表格
            "saveKeyWord": {localUrl: "./static/json/Grid.json", remoteUrl: base.server + "/myys/saveKeyWord"}
        },
        "rdwt": {
            "Tree": {remoteUrl: base.server + "/myrd/getDwTree"}, // 加载树
            "RdList": {localUrl: "./static/json/rdwt.json", remoteUrl: base.server + "myrd/getRdwtList"}, // 获取左侧数据
            "Rdwt": {localUrl: "./static/json/ChartData.json", remoteUrl: base.server + "myrd/getWtTrend"}, // 加载热点问题
            "Sqxz": {localUrl: "./static/json/ChartData.json", remoteUrl: base.server + "myrd/getSqxzFx"}, // 加载诉求性质
            "Sjly": {localUrl: "./static/json/ChartData.json", remoteUrl: base.server + "myrd/getSjlyFx"}, // 加载数据来源
            "Jtwt": {localUrl: "./static/json/ChartData.json", remoteUrl: base.server + "myrd/getTagAnalysis"}, // 加载具体问题
            "Dwfx": {localUrl: "./static/json/ChartData.json", remoteUrl: base.server + "myrd/getTagAnalysisByDw"}, // 加载单位分析
            "Rcfx": {localUrl: "./static/json/ChartData.json", remoteUrl: base.server + "myrd/getFkrcFx"}, // 加载热词分析
            // "exportReport" : {localUrl: "./static/json/ChartData.json", remoteUrl: base.server + "myrd/exportReport"}, // 导出报告
            "getTags": {localUrl: "./static/json/getTags.json", remoteUrl: base.server + "myrd/getTags"}, // 获取初始化查询条件
            "getTab": {localUrl: "./static/json/TabData.json", remoteUrl: base.server + "myrd/getTableData"}, // 加载表单数据,
            "getRightList": {
                localUrl: "./static/json/rightData.json",
                remoteUrl: base.server + "myrd/getSelectedTableData"
            }, // 获取右侧list
            "getDetail": {localUrl: "./static/json/getDetail.json", remoteUrl: base.server + "myrd/preview"}, // 加载详细信息
            "publish": {localUrl: "./static/json/getDetail.json", remoteUrl: base.server + "myrd/publish"}, // 发布数据,
            "getJcj": {localUrl: './static/json/rdwt/jcj.json', remoteUrl: base.server + "myrd/ranking"}, // 获取接处警数据
            "getCkfw": {localUrl: './static/json/rdwt/jcj.json', remoteUrl: base.server + "myrd/ranking"}, // 获取窗口服务数据
            "getAj": {localUrl: './static/json/rdwt/jcj.json', remoteUrl: base.server + "myrd/ranking"}, // 获取案件数据
            "getMjsxl": {localUrl: './static/json/rdwt/sxl.json', remoteUrl: base.server + "myrd/ranking"} // 获取社区民警熟悉率数据

        },
        "zxyp": {
            "aj": {
                "Tree": {localUrl: "./static/json/Tree.json", remoteUrl: base.server + "zxyp/aj/getDwTree"}, // 加载树
                "getZbzs": {localUrl: "./static/json/aj/zbzs.json", remoteUrl: base.server + "zxyp/aj/zbzs"}, // 加载指标展示
                "getHfrc": {localUrl: "./static/json/aj/hfrc.json", remoteUrl: base.server + "zxyp/aj/hfrc"}, // 加载热词
                "getZhpjzsfxTrend": {
                    localUrl: "./static/json/aj/zhpjzsfxTrend.json",
                    remoteUrl: base.server + 'zxyp/aj/zhpjzsfxTrend'
                }, // 加载趋势分析
                "getZhpjzsfx": {
                    localUrl: "./static/json/aj/zhpjzsfx.json",
                    remoteUrl: base.server + 'zxyp/aj/zhpjzsfx'
                }, // 加载案件综合评价指数分析
                "getHjwtfx": {localUrl: "./static/json/aj/hjwtfx.json", remoteUrl: base.server + 'zxyp/aj/hjwtfx'}, // 加载环节问题分析
                "getAjdwfb": {localUrl: "./static/json/aj/ajdwfb.json", remoteUrl: base.server + 'zxyp/aj/ajdwfb'}, // 加载案件问题单位分布
                "getAjbljtwtfx": {
                    localUrl: "./static/json/aj/ajbljtwtfx.json",
                    remoteUrl: base.server + 'zxyp/aj/ajbljtwtfx'
                }, // 加载办案小助手-案件办理具体问题分析
                "getZxfxpjzs": {
                    localUrl: "./static/json/aj/zxfxpjzs.json",
                    remoteUrl: base.server + 'zxyp/aj/zxfxpjzs'
                }, // 加载专项分析评价指数
                "getZsmyb": {localUrl: "./static/json/aj/zsmyb.json", remoteUrl: base.server + 'zxyp/aj/zsmyb'}, // 加载案件办理综合评价指数满意榜
                "getZxfxzhpjzs": {
                    localUrl: "./static/json/aj/zxfxzhpjzs.json",
                    remoteUrl: base.server + 'zxyp/aj/zxfxzhpjzs'
                }, // 加载弹出框案件综合评价指数分析分析
                "getZxgf": {localUrl: "./static/json/aj/zxgf.json", remoteUrl: base.server + 'zxyp/aj/zxgf'} // 加载执行规范
            },
            "jcj": {
                // 加载树
                "Tree": {localUrl: "./static/json/Tree.json", remoteUrl: base.server + "zxyp/jcj/getDwTree"},
                //左上文本
                "Txt": {localUrl: "./static/json/jcj/Txt.json", remoteUrl: base.server + "zxyp/jcj/zbzs"},
                //知识库
                "Zsk": {localUrl: "./static/json/jcj/Zsk.json", remoteUrl: base.server + "zxyp/jcj/zsk"},
                //下滑预警
                "Xhyj": {localUrl: "./static/json/jcj/Xhyj.json", remoteUrl: base.server + "zxyp/jcj/xhyjfx"},
                //排行榜
                "Rank": {localUrl: "./static/json/jcj/Rank.json", remoteUrl: base.server + "zxyp/jcj/jcjmydrank"},
                //标签云
                "Tag": {localUrl: "./static/json/jcj/Tag.json", remoteUrl: base.server + "zxyp/jcj/rcfx"},
                //满意度
                "Myd": {localUrl: "./static/json/jcj/Myd.json", remoteUrl: base.server + "zxyp/jcj/jcjmydfxTrend"},
                //单位情况
                "Dwqk": {localUrl: "./static/json/jcj/Dwqk.json", remoteUrl: base.server + "zxyp/jcj/jcjdwqk"},
                //雷达图1
                "Rador1": {localUrl: "./static/json/jcj/Rador.json", remoteUrl: base.server + "zxyp/jcj/jcjmydfx"},
                //雷达图2
                "Rador2": {localUrl: "./static/json/jcj/Rador.json", remoteUrl: base.server + "zxyp/jcj/jcjmydsdfx"},
                //警情分析
                "Jqfx": {localUrl: "./static/json/jcj/Jqfx.json", remoteUrl: base.server + "zxyp/jcj/jqfx"},
                //环节问题
                "Hjwt": {localUrl: "./static/json/jcj/Jqfx.json", remoteUrl: base.server + "zxyp/jcj/jqjtwtfx"},
                //问题单位
                "Wtdw": {localUrl: "./static/json/jcj/Wtdw.json", remoteUrl: base.server + "zxyp/jcj/jqjtwtdwfx"},
                //警情类型
                "Jqlx": {localUrl: "./static/json/jcj/Jqlx.json", remoteUrl: base.server + "zxyp/jcj/jcjjqlxsd"},
                //视频
                "Video": {localUrl: "./static/json/jcj/Video.json", remoteUrl: base.server + "zxyp/jcj/videoList"},
                //弹窗民警信息
                "User": {localUrl: "./static/json/jcj/User.json", remoteUrl: base.server + "zxyp/jcj/mjxx"},
                //弹窗标签云
                "Tag2": {localUrl: "./static/json/jcj/Tag.json", remoteUrl: base.server + "zxyp/jcj/mjcy"},
                //弹窗折线图
                "Line": {localUrl: "./static/json/ylld/Ylld.json", remoteUrl: base.server + "zxyp/jcj/cjtsfx"},
                //弹窗雷达-左
                "Rador3": {localUrl: "./static/json/jcj/Rador.json", remoteUrl: base.server + "zxyp/jcj/jcjmydfx"},
                //弹窗雷达-右
                "Rador4": {localUrl: "./static/json/jcj/Rador.json", remoteUrl: base.server + "zxyp/jcj/jcjmydsdfx"},
                // 一般工单量走势分析
                "getGdzsgx": {localUrl: "./static/json/rx/Chart.json", remoteUrl: base.server + "zxyp/jcj/getGdzsgx"},
                // 一般工单业务分析
                "getGdywfx": {localUrl: "./static/json/rx/Chart.json", remoteUrl: base.server + "zxyp/jcj/getGdywfx"},
                // 一般工单各单位情况
                "getGddwfb": {localUrl: "./static/json/rx/Sqdwfb.json", remoteUrl: base.server + "zxyp/jcj/getGddwfb"},
            },
            "ckfw": {
                //左上文本
                "Txt": {localUrl: "./static/json/jcj/Txt.json", remoteUrl: base.server + "zxyp/ckfw/zbzs"},
                //满意度走势
                "Myd": {localUrl: "./static/json/jcj/Myd.json", remoteUrl: base.server + "zxyp/ckfw/ckfwmydtrend"},
                //单位情况
                "Dwqk": {localUrl: "./static/json/jcj/Dwqk.json", remoteUrl: base.server + "zxyp/ckfw/ckfwmyddwqk"},
                //雷达图
                "Rador": {localUrl: "./static/json/jcj/Rador.json", remoteUrl: base.server + "zxyp/ckfw/ckfwmydfx"},
                //具体问题
                "Jtwt": {localUrl: "./static/json/jcj/Jqfx.json", remoteUrl: base.server + "zxyp/ckfw/ckfwjtwtfx"},
                //案件问题
                "Ajwt": {localUrl: "./static/json/ckfw/Ajwt.json", remoteUrl: base.server + "zxyp/ckfw/ajwtdwfx"},
                //排行榜按钮
                "Menu": {localUrl: "./static/json/ckfw/Menu.json", remoteUrl: base.server + "zxyp/ckfw/mydrankbutton"},
                //排行榜
                "Rank": {localUrl: "./static/json/ckfw/Rank.json", remoteUrl: base.server + "zxyp/ckfw/mydrankmenu"},
                //中上文本
                "Yw": {localUrl: "./static/json/ckfw/Yw.json", remoteUrl: base.server + "zxyp/ckfw/flzbzs"},
                //词云
                "Tag": {localUrl: "./static/json/jcj/Tag.json", remoteUrl: base.server + "zxyp/ckfw/rcfx"},
                //问题预测
                "Ckfw": {localUrl: "./static/json/ckfw/Ckfw.json", remoteUrl: base.server + "zxyp/ckfw/ckfwwtyc"},
                // 一般工单量走势分析
                "getGdzsgx": {localUrl: "./static/json/rx/Chart.json", remoteUrl: base.server + "zxyp/ckfw/getGdzsgx"},
                // 一般工单业务分析
                "getGdywfx": {localUrl: "./static/json/rx/Chart.json", remoteUrl: base.server + "zxyp/ckfw/getGdywfx"},
                // 一般工单各单位情况
                "getGddwfb": {localUrl: "./static/json/rx/Sqdwfb.json", remoteUrl: base.server + "zxyp/ckfw/getGddwfb"}
            },
            "ylld": {
                // 加载树
                "Tree": {localUrl: "./static/json/Tree.json", remoteUrl: base.server + "zxyp/ylld/getDwTree"},
                //左上文本
                "Txt": {localUrl: "./static/json/ylld/Txt.json", remoteUrl: base.server + "zxyp/ylld/zbzs"},
                //排行榜
                "Rank": {localUrl: "./static/json/ylld/Rank.json", remoteUrl: base.server + "zxyp/ylld/zjjml"},
                //社会治安满意度
                "Shza": {localUrl: "./static/json/ckfw/Ckfw.json", remoteUrl: base.server + "zxyp/ylld/jtwt"},
                //单位情况分析
                "Rdfx": {localUrl: "./static/json/ylld/Rdfx.json", remoteUrl: base.server + "zxyp/ylld/dwqkfx"},
                //一率两度走势
                "Ylld": {localUrl: "./static/json/ylld/Ylld.json", remoteUrl: base.server + "zxyp/ylld/ylldTrend"},
                //多维解析-左
                "Dwjxz": {localUrl: "./static/json/jcj/Jqfx.json", remoteUrl: base.server + "zxyp/ylld/getDwjs"},
                //多维解析-右
                "Info": {localUrl: "./static/json/ylld/Info.json", remoteUrl: base.server + "zxyp/ylld/getDwjsInfo"},
                //走访助手
                "Zfzs": {localUrl: "./static/json/ylld/Zfzs.json", remoteUrl: base.server + "zxyp/ylld/zfzs"},
                //推送
                "Ts": {localUrl: "./static/json/ylld/Ts.json", remoteUrl: base.server + "zxyp/ylld/kchts"},
                "Zsfx": {localUrl: "./static/json/ylld/Zsfx.json", remoteUrl: base.server + "zxyp/ylld/getZsfx"},
                "Dyqkfx": {localUrl: "./static/json/ylld/Dyqkfx.json", remoteUrl: base.server + "zxyp/ylld/getDyqkfx"},
                "Dyzj": {localUrl: "./static/json/ylld/Dyzj.json", remoteUrl: base.server + "zxyp/ylld/getDyzj"}
            },
            "rx": {
                // 加载树
                "Tree": {localUrl: "./static/json/Tree.json", remoteUrl: base.server + "zxyp/rx/getDwTree"},
                //左上文本
                "Txt": {localUrl: "./static/json/jcj/Txt.json", remoteUrl: base.server + "zxyp/rx/zbzs"},
                //热词
                "Tag": {localUrl: "./static/json/jcj/Tag.json", remoteUrl: base.server + "zxyp/rx/rc"},
                //热线分析
                "Rxfx": {localUrl: "./static/json/jcj/Myd.json", remoteUrl: base.server + "zxyp/rx/mydAndBdFx"},
                //热点事件排行榜
                "Rank": {localUrl: "./static/json/rx/Rank.json", remoteUrl: base.server + "zxyp/rx/rdsjRank"},
                // 群众诉求量
                "Qzsql": {localUrl: "./static/json/rx/Chart.json", remoteUrl: base.server + "zxyp/rx/sqlTrend"},
                // 诉求性质分析
                "Sqxz": {localUrl: "./static/json/rx/Chart.json", remoteUrl: base.server + "zxyp/rx/sqxzfx"},
                // 诉求单位分布
                "Sqdwfb": {localUrl: "./static/json/rx/Sqdwfb.json", remoteUrl: base.server + "zxyp/rx/sqdwfb"},
                // 办事效能分析
                "Bsxn": {localUrl: "./static/json/rx/Point.json", remoteUrl: base.server + "zxyp/rx/xnfx"},
                // 12345工单办理优秀案例
                "getYxal": {localUrl: "./static/json/rx/yxal.json", remoteUrl: "zxyp/rx/getYxal"},
                // 12345工单办理优秀案例弹出页
                "getPopupYxal": {localUrl: "./static/json/rx/popupYxal.json", remoteUrl: "zxyp/rx/getPopupYxal"},
                // 热点专题
                "Rdzt": {localUrl: "./static/json/rx/Rdzt.json", remoteUrl: base.server + "zxyp/rx/rdzt"},
                // 诉求性质分析
                "Zhpjzs": {localUrl: "./static/json/aj/hjwtfx.json", remoteUrl: base.server + "zxyp/rx/popsqxz"},
                // 各单位诉求量及满意度分析
                "Myd": {localUrl: "./static/json/jcj/Myd.json", remoteUrl: base.server + "zxyp/rx/popdwfx"},
                // 群众诉求走势分析
                "Qzsqzsgx": {localUrl: "./static/json/jcj/Myd.json", remoteUrl: base.server + "zxyp/rx/poptrend"},
                popup: {
                    getTop: {
                        localUrl: "./static/json/rx/top.json", remoteUrl: base.server + "zxyp/rx/popup/getTop"
                    },
                    getMidLeft: {
                        localUrl: "./static/json/rx/Chart.json", remoteUrl: base.server + "zxyp/rx/popup/getMidLeft"
                    },
                    getMidRightTop: {
                        localUrl: "./static/json/rx/midRightTop.json",
                        remoteUrl: base.server + "zxyp/rx/popup/getMidRightTop"
                    },
                    getMidRight: {
                        localUrl: "./static/json/rx/midRight.json", remoteUrl: base.server + "zxyp/rx/popup/getMidRight"
                    },
                    getBottomLeft: {
                        localUrl: "./static/json/rx/bottomLeft.json",
                        remoteUrl: base.server + "zxyp/rx/popup/getBottomLeft"
                    },
                    getBottomRight: {
                        localUrl: "./static/json/rx/bottomRight.json",
                        remoteUrl: base.server + "zxyp/rx/popup/getBottomRight"
                    },
                }
            },
            "jtsg": {
                // 树结构
                "Tree": {localUrl: "./static/json/Tree.json", remoteUrl: base.server + "zxyp/jcj/getDwTree"},
                // 左上指标
                "left1": {localUrl: "./static/json/jtsg/left1.json", remoteUrl: base.server + "zxyp/jtsg/getJqAndJtsg"},
                // 左下满意度走势分析
                "left2": {localUrl: "./static/json/jtsg/left2.json", remoteUrl: base.server + "zxyp/jtsg/getMydzsfx"},
                // 中1-1交通警情分析
                "mid1_1": {localUrl: "./static/json/jtsg/left2.json", remoteUrl: base.server + "zxyp/jtsg/getJtjqfx"},
                // 中1-2具体问题分析
                "mid1_2": {localUrl: "./static/json/jtsg/left2.json", remoteUrl: base.server + "zxyp/jtsg/getJtwtfx"},
                // 中1-3具体问题单位分布
                "mid1_3": {
                    localUrl: "./static/json/jtsg/mid1-3.json",
                    remoteUrl: base.server + "zxyp/jtsg/getJtwtdwfb"
                },
                // 中2-1窗口服务满意度
                "mid2_1": {
                    localUrl: "./static/json/jtsg/mid2-1.json",
                    remoteUrl: base.server + "zxyp/jtsg/getJtsgclzhpj"
                },
                // 中2-2环节问题分析
                "mid2_2": {localUrl: "./static/json/jtsg/left2.json", remoteUrl: base.server + "zxyp/jtsg/getHjwtfx"},
                // 中2-3环节问题单位分布
                "mid2_3": {
                    localUrl: "./static/json/jtsg/mid1-3.json",
                    remoteUrl: base.server + "zxyp/jtsg/getHjwtdwfx"
                },
                // 右1满意度下滑预警分析
                "right1": {
                    localUrl: "./static/json/jtsg/right1.json",
                    remoteUrl: base.server + "zxyp/jtsg//getMydxhyj"
                },
                // 右1综合评价排行榜
                "right2": {localUrl: "./static/json/jtsg/right2.json", remoteUrl: base.server + "zxyp/jtsg/getZhpjphb"},
            }
        },
        znbg: {
            ywfxbg: {
                submitSetting: { // 设置接口
                    localUrl: "./static/json/ywfxbg/submitSetting.json",
                    remoteUrl: base.server + "znbg/ywfxbg/submitSetting"
                },

                generateReport: { // 生成报告
                    localUrl: "./static/json/ywfxbg/generateReport.json",
                    remoteUrl: base.server + "znbg/ywfxbg/generateReport"
                },

                getFileList: { // 获取文件列表
                    localUrl: "./static/json/ywfxbg/getFileList.json",
                    remoteUrl: base.server + "znbg/ywfxbg/getFileList"
                },
                preview: {
                    initTitle: {
                        localUrl: './static/json/ywfxbg/preview/title.json',
                        remoteUrl: base.server + 'znbg/ywfxbg/preview/initTitle'
                    },
                    init1_1: {
                        localUrl: './static/json/ywfxbg/preview/1_1.json',
                        remoteUrl: base.server + 'znbg/ywfxbg/preview/init1_1'
                    },
                    init1_2: {
                        localUrl: './static/json/ywfxbg/preview/1_2.json',
                        remoteUrl: base.server + 'znbg/ywfxbg/preview/init1_2'
                    },
                    init2_1: {
                        localUrl: './static/json/ywfxbg/preview/2_1.json',
                        remoteUrl: base.server + 'znbg/ywfxbg/preview/init2_1'
                    },
                    init2_2: {
                        localUrl: './static/json/ywfxbg/preview/2_2.json',
                        remoteUrl: base.server + 'znbg/ywfxbg/preview/init2_2'
                    },
                    init3_1: {
                        localUrl: './static/json/ywfxbg/preview/3_1.json',
                        remoteUrl: base.server + 'znbg/ywfxbg/preview/init3_1'
                    },
                    init3_2: {
                        localUrl: './static/json/ywfxbg/preview/3_2.json',
                        remoteUrl: base.server + 'znbg/ywfxbg/preview/init3_2'
                    },
                    init4_1: {
                        localUrl: './static/json/ywfxbg/preview/4_1.json',
                        remoteUrl: base.server + 'znbg/ywfxbg/preview/init4_1'
                    },
                    init4_2: {
                        localUrl: './static/json/ywfxbg/preview/4_2.json',
                        remoteUrl: base.server + 'znbg/ywfxbg/preview/init4_2'
                    },
                }
            }
        }
    };

    base.getHtmlArg = function (name, defaultValue) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return defaultValue;
    };

    base.getUrlParam = function (name, defaultValue) {
        var str = window.location.hash.substring(window.location.hash.indexOf(name) + name.length + 1, window.location.hash.length);
        return decodeURI(str);
    };

    base.getParam = function (name) {
        var strArr = window.location.hash.split('?');
        var result = {};
        if (strArr[1]) {
            var dataArr = strArr[1].split('&');
            if (dataArr) {
                for (var i = 0; i < dataArr.length; i++) {
                    var arr = dataArr[i].split('=');
                    result[arr[0]] = arr[1];
                }
            }
        }
        return result[name] ? decodeURI(result[name]) : '';
    };

    base.backFill = function (data) {
        for (var key in data) {
            $("#" + key).html(data[key]);
        }
    };

    base.requestJson = function (urlOrInterfaceObj, callBack) {
        var url, currentPage = window.location.hash;
        if (typeof urlOrInterfaceObj.url == "string") {
            url = urlOrInterfaceObj.url;
        } else {
            url = base.isPublished ? urlOrInterfaceObj.url.remoteUrl : urlOrInterfaceObj.url.localUrl;
        }
        if (!base.isPublished) {
            urlOrInterfaceObj.type = "GET";
        }
        var config = {
            type: urlOrInterfaceObj.type,
            url: url,
            data: urlOrInterfaceObj.data,
            dataType: "json",
            async: urlOrInterfaceObj.async ? urlOrInterfaceObj.async : false,
            traditional: true,
            success: function (result) {
                if (result != null) {
                    if (window.location.hash == currentPage) {
                        callBack(result);
                    }
                } else {
                    console.log("无数据");
                }
                config = null;
            },
            error: function () {
                //接口调用失败
            }
        };
        $.ajax(config);
    };

    base.opacityAnimate = function (ele, text, speed, time) {
        window.setInterval(function () {
            $("#" + ele).animate({opacity: 0}, speed * 1000, function () {
                $("#" + ele).html(text);
                $("#" + ele).animate({opacity: 1}, speed * 1000);
            });
        }, time * 1000);
    };

    base.showDialog = function (option) {
        window.dialogParams = option.params;
        var tempW = option.width + "px", tempH = option.height + "px", tempL = "-" + ((option.width / 2) + "px"),
            tempT = "-" + ((option.height / 2) + "px");
        var tempID = "showDialog" + Math.floor(Math.random() * 10000 + 1);
        $("#ui-view").append(
            "<div class='simple_shade'></div>" +
            "<div class='simple_showDialog' id=" + tempID + ">" +
            "<i class='simple_close glyphicon glyphicon-remove'></i>" +
            "<div class='simple_content'></div>" +
            "</div>"
        );
        $("#" + tempID).css("width", tempW);
        $("#" + tempID).css("height", tempH);
        $("#" + tempID).css("marginTop", tempT);
        $("#" + tempID).css("marginLeft", tempL);
        $("#" + tempID).find(".simple_content").html(option.ele);
        $("#" + tempID).find(".simple_close").unbind().bind("click", function () {
            $(".simple_shade").remove();
            $("#" + tempID).remove();
        });
    };

    // 带有标题的弹出框
    base.renderDialog = function (option) {
        window.dialogParams = option.params;
        var tempW = option.width + "px", tempH = option.height + "px", tempL = "-" + ((option.width / 2) + "px"),
            tempT = "-" + ((option.height / 2) + "px");
        var tempID = "showDialog" + Math.floor(Math.random() * 10000 + 1);
        $("#ui-view").append(
            "<div class='simple_shade'></div>" +
            "<div class='simple_showDialog' id=" + tempID + ">" +
            "<div class='simple_showDialog_header'>" + option.title +
            "<i class='simple_close glyphicon glyphicon-remove'></i>" +
            "</div>" +
            "<div class='simple_content'></div>" +
            "</div>"
        );
        $("#" + tempID).css("width", tempW);
        $("#" + tempID).css("height", tempH);
        $("#" + tempID).css("marginTop", tempT);
        $("#" + tempID).css("marginLeft", tempL);
        $("#" + tempID).find(".simple_content").html(option.ele);
        $("#" + tempID).find(".simple_close").unbind().bind("click", function () {
            $(".simple_shade").remove();
            $("#" + tempID).remove();
        });
    };

    // 提示框组件
    base.showMessage = function (msg, type) {
        var divClass, iClass;
        switch (type) {
            case 'warning':
                divClass = 'pop-message-warning';
                iClass = 'glyphicon-exclamation-sign';
                break;
            case 'success':
                divClass = 'pop-message-success';
                iClass = 'glyphicon-ok-sign';
                break;
            case 'error':
                divClass = 'pop-message-error';
                iClass = 'glyphicon-remove-sign';
                break;
            default:
                divClass = 'pop-message-default';
                iClass = 'glyphicon-info-sign';
                break;
        }
        $('#ui-view').append('<div class="pop-message ' + divClass + '">' +
            '<i class="glyphicon ' + iClass + '"></i>' +
            '<span class="pop-message-context">' + msg + '</span></div>');
        setTimeout(function () {
            $('.pop-message').remove();
        }, 3000);
    };

    // 分页组件
    base.renderNav = function ($div, pageNum, totalPage, callback) {
        $div.addClass('com-nav');
        pageNum = pageNum || 1;
        totalPage = totalPage || 0;
        pageNum = pageNum < 0 ? 1 : pageNum;
        pageNum = pageNum > totalPage ? totalPage : pageNum;
        var arr = [];
        if (totalPage == 1 || totalPage == 0) {
            arr = [{value: 1, selected: true}];
        } else if (totalPage == 2) {
            if (pageNum == 1) {
                arr = [{value: 1, selected: true}, {value: 2, selected: false}];
            } else {
                arr = [{value: 1, selected: false}, {value: 2, selected: true}];
            }
        } else {
            if (pageNum == 1) {
                arr = [{value: 1, selected: true}, {value: 2, selected: false}];
            } else if (pageNum == totalPage) {
                arr = [{value: pageNum - 1, selected: false}, {value: pageNum, selected: true}];
            } else {
                for (var i = 0; i < 3; i++) {
                    arr.push({value: pageNum - 1 + i, selected: i == 1});
                }
            }
        }
        renderChild(arr);

        function renderChild(dataArr) {
            $div.empty();
            $div.append($('<div/>').html('&lt;'));
            dataArr.map(function (val) {
                if (val.selected) {
                    $div.append($('<div/>').html(val.value).addClass('com-nav-selected'));
                } else {
                    $div.append($('<div/>').html(val.value));
                }

            });
            $div.append($('<div/>').html('&gt;'));
        }

        // 绑定点击事件
        $('.com-nav > div').unbind().bind('click', function (e) {
            var key = e.target.innerHTML, toPage;
            switch (key) {
                case '&lt;':
                    toPage = 1;
                    break;
                case '&gt;':
                    toPage = totalPage;
                    break;
                default:
                    toPage = key;
                    break;
            }
            base.renderNav($div, toPage, totalPage, callback);
            callback(toPage);
        });
    };

    base.initRightMenu = function () {
        requirejs(['text!../views/myhc/rightMenu.html'], function (ele) {
            $(".rightPannel").html(ele);
        });
    };

    base.getLabelVal = function (val) {
        if (val.length == 1) {
            val = "   " + val;
        } else if (val.length == 2) {
            val = "  " + val;
        } else if (val.length == 3) {
            val = " " + val;
        } else {
            val = val;
        }
        return val;
    };

    base.getSearchList = function (data) {
        var result = {};
        result.data = data;
        $(".grid").empty();
        for (var i = 0; i < result.data.length; i++) {
            var thumbnail = "", thumbnailShow = "myThumbnail hid";
            var moudleInfo = "how", secondEle = "";
            if (result.data[i].type == 1) {
                if (result.data[i].url.indexOf("dwjx") == -1) {
                    thumbnail = "../../img/myhc/myys/" + result.data[i].url + "_thumbnail.png";
                    thumbnailShow = "myThumbnail show";
                    moudleInfo = "sow";
                    var tempStr1 = "", tempStr2 = "";
                    if (result.data[i].url == "myzs") {
                        tempStr1 = "民意指数：";
                        tempStr2 = "执法公信力指数等民意指数分析";
                    } else if (result.data[i].url == "myjz") {
                        tempStr1 = "民意矩阵：";
                        tempStr2 = "社会治安满意度、公安队伍满意度、社会民警熟悉率等分析";
                    } else if (result.data[i].url == "rdwt") {
                        tempStr1 = "热点问题：";
                        tempStr2 = "民意诉求及热点问题分析";
                    }
                    secondEle =
                        "<div class='secondRow'>" +
                        "<div class='" + moudleInfo + "'><span class='lab'>" + tempStr1 + "</span><span class='val'>" + tempStr2 + "</span></div>" +
                        "</div>";
                } else {
                    thumbnail = "../../img/myhc/myys/dwjx_thumbnail.png";
                    thumbnailShow = "myThumbnail show";
                    moudleInfo = "low";
                    secondEle =
                        "<div class='secondRow'>" +
                        "<div class='" + moudleInfo + "' id='sqxz'><span class='lab'>模块：</span><span class='val'>诉求性质分析模式</span></div>" +

                        "<div class='" + moudleInfo + "' id='ywgk'><span class='lab'>模块：</span><span class='val'>业务归口分析模式</span></div>" +

                        "<div class='" + moudleInfo + "' id='jtwt'><span class='lab'>模块：</span><span class='val'>具体问题分析模式</span></div>" +

                        "<div class='" + moudleInfo + "' id='dwjs'><span class='lab'>模块：</span><span class='val'>队伍管理分析模式</span></div>" +
                        "</div>";
                }
            } else {
                secondEle =
                    "<div class='secondRow'>" +
                    "<div class='" + moudleInfo + "'><span class='lab'>" + result.data[i].name2 + "</span><span class='val'>" + result.data[i].value2 + "</span></div>" +

                    "<div class='" + moudleInfo + "'><span class='lab'>" + result.data[i].name3 + "</span><span class='val'>" + result.data[i].value3 + "</span></div>" +

                    "<div class='" + moudleInfo + "'><span class='lab'>" + result.data[i].name4 + "</span><span class='val'>" + result.data[i].value4 + "</span></div>" +
                    "</div>";
            }
            var eleStr =
                "<div class='row' id=" + result.data[i].id + " type=" + result.data[i].type + " url=" + result.data[i].url + " name=" + result.data[i].codeName + " mold=" + result.data[i].mold + " >" +
                "<div class='firstRow'>" +
                "<div><span class='lab'>" + result.data[i].name1 + "</span><span class='val'>" + result.data[i].value1 + "</span></div>" +

                "<div class='" + thumbnailShow + "'><img src=" + thumbnail + " /></div>" +
                "</div>";
            eleStr += secondEle + "</div>";
            $(".grid").append(eleStr);
        }
    };

    return base;
});
