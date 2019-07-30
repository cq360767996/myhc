define([], function() {
  var base = {};

  base.isPublished = false;

  base.server = "../";

  base.interFaces = {
    myzs: {
      //下拉树
      Tree: {
        localUrl: "../../static/json/Tree.json",
        remoteUrl: base.server + "/myzs/getDwTree"
      },
      // 根据单位code获取单位id
      DeptId: { remoteUrl: base.server + "/myzs/getDeptId" },
      // 加载左侧数据
      getLeftData: { remoteUrl: base.server + "/myzs/getLeftData" },
      // 加载右侧中间部分数据
      getRightMidData: { remoteUrl: base.server + "/myzs/getRightMidData" },
      // 加载右侧数据
      getRightData: { remoteUrl: base.server + "/myrd/getRdwtList" },
      // 获取指标组成
      getZbzc: {
        localUrl: "../../static/json/myzs/pop-zbzs.json",
        remoteUrl: base.server + "/myzs/getZbzc"
      },
      // 指标展示悬停弹框
      getZbzcDetail: {
        localUrl: "../../static/json/myzs/pop-zbzs-detail.json",
        remoteUrl: base.server + "/myzs/getZbzcDetail"
      },
      // 执法公信力走势分析
      getZfgxl: { remoteUrl: base.server + "/myzs/getZfgxl" },
      // 单位情况
      getDwqk: { remoteUrl: base.server + "/myzs/getDwqk" },
      // 根据单位id获取单位层级
      getDwLevel: { remoteUrl: base.server + "/myzs/getDwLevel" },
      // 社会治安满意度调查情况
      getMyd: {
        localUrl: "../../static/json/myd.json",
        remoteUrl: base.server + "myzs/getMyd"
      },
      // 获取数据录入初始化数据
      getSjlr: {
        localUrl: "../../static/json/myzs/pop1.json",
        remoteUrl: base.server + "myzs/getSjlr"
      },
      // 提交数据录入
      submitSjlr: {
        localUrl: "../../static/json/myzs/success.json",
        remoteUrl: base.server + "myzs/submitSjlr"
      },
      // 获取系数配置初始化数据
      getXspz: {
        localUrl: "../../static/json/myzs/pop2.json",
        remoteUrl: base.server + "myzs/getXspz"
      },
      // 重置系数配置
      resetXspz: {
        localUrl: "../../static/json/myzs/pop2.json",
        remoteUrl: base.server + "myzs/resetXspz"
      },
      // 提交系数配置
      submitXspz: {
        localUrl: "../../static/json/myzs/success.json",
        remoteUrl: base.server + "myzs/submitXspz"
      },
      // 获取展示配置初始化数据
      getZspz: {
        localUrl: "../../static/json/myzs/pop3.json",
        remoteUrl: base.server + "myzs/getZspz"
      },
      // 重置展示配置
      resetZspz: {
        localUrl: "../../static/json/myzs/pop3.json",
        remoteUrl: base.server + "myzs/resetZspz"
      },
      // 计算展示配置数据
      calcZspz: {
        localUrl: "../../static/json/myzs/pop3.json",
        remoteUrl: base.server + "myzs/calcZspz"
      },
      // 提交展示配置
      submitZspz: {
        localUrl: "../../static/json/myzs/success.json",
        remoteUrl: base.server + "myzs/submitZspz"
      },
      getPoint: {
        localUrl: "../../static/json/myzs/success.json",
        remoteUrl: base.server + "myzs/getTestJwd"
      },
      getMapData: {
        localUrl: "../../static/json/myzs/success.json",
        remoteUrl: base.server + "myzs/getMapData"
      },
      getPcsZb: {
        localUrl: "../../static/json/myzs/success.json",
        remoteUrl: base.server + "myzs/getPcsZb"
      },
      getDetailMapData: {
        localUrl: "../../static/json/myzs/success.json",
        remoteUrl: base.server + "myzs/getDetailMapData"
      },
      getMapCount: {
        localUrl: "../../static/json/myzs/success.json",
        remoteUrl: base.server + "myzs/getMapCount"
      },
      getMapDataByBounds: {
        localUrl: "../../static/json/myzs/success.json",
        remoteUrl: base.server + "myzs/getMapDataByBounds"
      },
      getCkfw: {
        localUrl: "../../static/json/myzs/success.json",
        remoteUrl: base.server + "myzs/getCkfw"
      },
      getCkMapData: {
        localUrl: "../../static/json/myzs/success.json",
        remoteUrl: base.server + "myzs/getCkMapData"
      },
      getCkfwq: {
        remoteUrl: base.server + "myzs/getCkfwq"
      },
      getCkDetail: {
        remoteUrl: base.server + "myzs/getCkDetail"
      },
      getPointByCode: {
        remoteUrl: base.server + "myzs/getPointByCode"
      },
      getCkRdwtDetail: {
        remoteUrl: base.server + "myzs/getCkRdwtDetail"
      },
      getCkfwqDetail: {
        remoteUrl: base.server + "myzs/getCkfwqDetail"
      },
      getCkfwqZb: {
        localUrl: "../../static/json/myzs/getCkfwqZb.json",
        remoteUrl: base.server + "myzs/getCkfwqZb"
      },
      getCkfwqRybd: {
        localUrl: "../../static/json/myzs/getCkfwqRank.json",
        remoteUrl: base.server + "myzs/getCkfwqRybd"
      },
      getCkfwqDwbd: {
        localUrl: "../../static/json/myzs/getCkfwqRank.json",
        remoteUrl: base.server + "myzs/getCkfwqDwbd"
      },
      getCkfwqRankPopup: {
        localUrl: "../../static/json/myzs/getCkfwqRankPopup.json",
        remoteUrl: base.server + "myzs/getCkfwqRankPopup"
      },
      getBmfwq: {
        localUrl: "../../static/json/myzs/getBmfwq.json",
        remoteUrl: base.server + "myzs/getBmfwq"
      }
    },
    myjz: {
      //下拉树
      Tree: {
        localUrl: "./static/json/Tree.json",
        remoteUrl: base.server + "/myjz/getDwTree"
      },
      //民意矩阵中间数据
      List: {
        localUrl: "./static/json/List.json",
        remoteUrl: base.server + "/myjz/getMyjz"
      },
      //查询栏日期默认值
      Date: {
        localUrl: "./static/json/Date.json",
        remoteUrl: base.server + "/myjz/getRecentDate"
      },
      //极坐标弹窗接口
      Window1: {
        localUrl: "./static/json/Window1.json",
        remoteUrl: base.server + "/myjz/getMyjzDialogData"
      },
      //环形图弹窗接口
      Window2: {
        localUrl: "./static/json/Window2.json",
        remoteUrl: base.server + "/myjz/getMyjzDialogData"
      },
      //雷达图弹窗接口
      Window3: {
        localUrl: "./static/json/Window3.json",
        remoteUrl: base.server + "/myjz/getMyjzDialogData"
      },
      //部门列表
      bmList: {
        localUrl: "./static/json/bmList.json",
        remoteUrl: base.server + "/myjz/getMyjz"
      }
    },
    dwjx: {
      //初始化标签
      Tab: {
        localUrl: "./static/json/Tab.json",
        remoteUrl: base.server + "/dwjx/getNavigor"
      },
      //初始化标签
      Chart: {
        localUrl: "./static/json/Chart.json",
        remoteUrl: base.server + "/dwjx/getChartData"
      },
      //下拉树
      Tree: {
        localUrl: "./static/json/Tree.json",
        remoteUrl: base.server + "/dwjx/getDwTree"
      },
      //二级标签
      Tab2: {
        localUrl: "./static/json/Tab2.json",
        remoteUrl: base.server + "/dwjx/getNavigor"
      },
      //标红功能
      Keywords: {
        localUrl: "./static/json/Keywords.json",
        remoteUrl: base.server + "/dwjx/search"
      },
      //可操作图表
      TopChart: {
        localUrl: "./static/json/TopChart.json",
        remoteUrl: base.server + "/dwjx/getNavigor"
      },
      //其他图标数据
      OtherCharts: {
        localUrl: "./static/json/OtherCharts.json",
        remoteUrl: base.server + "/dwjx/getChartData"
      }
    },
    myys: {
      //民意热词
      HotWords: {
        localUrl: "./static/json/HotWords.json",
        remoteUrl: base.server + "/myys/getReSouList"
      },
      //热搜-换一换
      SearchList: {
        localUrl: "./static/json/SearchList.json",
        remoteUrl: base.server + "/myys/getReSouList"
      },
      //查询列表
      DataList: {
        localUrl: "./static/json/DataList.json",
        remoteUrl: base.server + "/myys/search"
      },
      // 更新查询列表缓存
      cacheDataList: {
        localUrl: "./static/json/DataList.json",
        remoteUrl: base.server + "/myys/cacheSearch"
      },
      //详情
      Detail: {
        localUrl: "./static/json/Detail.json",
        remoteUrl: base.server + "/myys/getDetail"
      },
      // 缓存详情页
      cacheDetail: {
        localUrl: "./static/json/Detail.json",
        remoteUrl: base.server + "/myys/cacheDetail"
      },
      // 弹出详细信息
      PopDetail: {
        localUrl: "./static/json/Detail.json",
        remoteUrl: base.server + "myys/getPopDetail"
      },
      //详情表格
      Grid: {
        localUrl: "./static/json/Grid.json",
        remoteUrl: base.server + "/myys/getGrid"
      },
      // 更新详情表格
      cacheGrid: {
        localUrl: "./static/json/Grid.json",
        remoteUrl: base.server + "/myys/cacheGrid"
      },
      //详情表格
      saveKeyWord: {
        localUrl: "./static/json/Grid.json",
        remoteUrl: base.server + "/myys/saveKeyWord"
      }
    },
    rdwt: {
      Tree: { remoteUrl: base.server + "/myrd/getDwTree" }, // 加载树
      RdList: {
        localUrl: "./static/json/rdwt.json",
        remoteUrl: base.server + "myrd/getRdwtList"
      }, // 获取左侧数据
      Rdwt: {
        localUrl: "./static/json/ChartData.json",
        remoteUrl: base.server + "myrd/getWtTrend"
      }, // 加载热点问题
      Sqxz: {
        localUrl: "./static/json/ChartData.json",
        remoteUrl: base.server + "myrd/getSqxzFx"
      }, // 加载诉求性质
      Sjly: {
        localUrl: "./static/json/ChartData.json",
        remoteUrl: base.server + "myrd/getSjlyFx"
      }, // 加载数据来源
      Jtwt: {
        localUrl: "./static/json/ChartData.json",
        remoteUrl: base.server + "myrd/getTagAnalysis"
      }, // 加载具体问题
      Dwfx: {
        localUrl: "./static/json/ChartData.json",
        remoteUrl: base.server + "myrd/getTagAnalysisByDw"
      }, // 加载单位分析
      Rcfx: {
        localUrl: "./static/json/ChartData.json",
        remoteUrl: base.server + "myrd/getFkrcFx"
      }, // 加载热词分析
      // "exportReport" : {localUrl: "./static/json/ChartData.json", remoteUrl: base.server + "myrd/exportReport"}, // 导出报告
      getTags: {
        localUrl: "./static/json/getTags.json",
        remoteUrl: base.server + "myrd/getTags"
      }, // 获取初始化查询条件
      getTab: {
        localUrl: "./static/json/TabData.json",
        remoteUrl: base.server + "myrd/getTableData"
      }, // 加载表单数据,
      getRightList: {
        localUrl: "./static/json/rightData.json",
        remoteUrl: base.server + "myrd/getSelectedTableData"
      }, // 获取右侧list
      getDetail: {
        localUrl: "./static/json/getDetail.json",
        remoteUrl: base.server + "myrd/preview"
      }, // 加载详细信息
      publish: {
        localUrl: "./static/json/getDetail.json",
        remoteUrl: base.server + "myrd/publish"
      }, // 发布数据,
      getJcj: {
        localUrl: "./static/json/rdwt/jcj.json",
        remoteUrl: base.server + "myrd/ranking"
      }, // 获取接处警数据
      getCkfw: {
        localUrl: "./static/json/rdwt/jcj.json",
        remoteUrl: base.server + "myrd/ranking"
      }, // 获取窗口服务数据
      getAj: {
        localUrl: "./static/json/rdwt/jcj.json",
        remoteUrl: base.server + "myrd/ranking"
      }, // 获取案件数据
      getMjsxl: {
        localUrl: "./static/json/rdwt/sxl.json",
        remoteUrl: base.server + "myrd/ranking"
      } // 获取社区民警熟悉率数据
    },
    zxyp: {
      aj: {
        Tree: {
          localUrl: "./static/json/Tree.json",
          remoteUrl: base.server + "zxyp/aj/getDwTree"
        }, // 加载树
        getZbzs: {
          localUrl: "./static/json/aj/zbzs.json",
          remoteUrl: base.server + "zxyp/aj/zbzs"
        }, // 加载指标展示
        getHfrc: {
          localUrl: "./static/json/aj/hfrc.json",
          remoteUrl: base.server + "zxyp/aj/hfrc"
        }, // 加载热词
        getZhpjzsfxTrend: {
          localUrl: "./static/json/aj/zhpjzsfxTrend.json",
          remoteUrl: base.server + "zxyp/aj/zhpjzsfxTrend"
        }, // 加载趋势分析
        getZhpjzsfx: {
          localUrl: "./static/json/aj/zhpjzsfx.json",
          remoteUrl: base.server + "zxyp/aj/zhpjzsfx"
        }, // 加载案件综合评价指数分析
        getHjwtfx: {
          localUrl: "./static/json/aj/hjwtfx.json",
          remoteUrl: base.server + "zxyp/aj/hjwtfx"
        }, // 加载环节问题分析
        getAjdwfb: {
          localUrl: "./static/json/aj/ajdwfb.json",
          remoteUrl: base.server + "zxyp/aj/ajdwfb"
        }, // 加载案件问题单位分布
        getAjbljtwtfx: {
          localUrl: "./static/json/aj/ajbljtwtfx.json",
          remoteUrl: base.server + "zxyp/aj/ajbljtwtfx"
        }, // 加载办案小助手-案件办理具体问题分析
        getZxfxpjzs: {
          localUrl: "./static/json/aj/zxfxpjzs.json",
          remoteUrl: base.server + "zxyp/aj/zxfxpjzs"
        }, // 加载专项分析评价指数
        getZsmyb: {
          localUrl: "./static/json/aj/zsmyb.json",
          remoteUrl: base.server + "zxyp/aj/zsmyb"
        }, // 加载案件办理综合评价指数满意榜
        getZxfxzhpjzs: {
          localUrl: "./static/json/aj/zxfxzhpjzs.json",
          remoteUrl: base.server + "zxyp/aj/zxfxzhpjzs"
        }, // 加载弹出框案件综合评价指数分析分析
        getZxgf: {
          localUrl: "./static/json/aj/zxgf.json",
          remoteUrl: base.server + "zxyp/aj/zxgf"
        } // 加载执行规范
      },
      jcj: {
        // 加载树
        Tree: {
          localUrl: "./static/json/Tree.json",
          remoteUrl: base.server + "zxyp/jcj/getDwTree"
        },
        //左上文本
        Txt: {
          localUrl: "./static/json/jcj/Txt.json",
          remoteUrl: base.server + "zxyp/jcj/zbzs"
        },
        //知识库
        Zsk: {
          localUrl: "./static/json/jcj/Zsk.json",
          remoteUrl: base.server + "zxyp/jcj/zsk"
        },
        //下滑预警
        Xhyj: {
          localUrl: "./static/json/jcj/Xhyj.json",
          remoteUrl: base.server + "zxyp/jcj/xhyjfx"
        },
        //排行榜
        Rank: {
          localUrl: "./static/json/jcj/Rank.json",
          remoteUrl: base.server + "zxyp/jcj/jcjmydrank"
        },
        //标签云
        Tag: {
          localUrl: "./static/json/jcj/Tag.json",
          remoteUrl: base.server + "zxyp/jcj/rcfx"
        },
        //满意度
        Myd: {
          localUrl: "./static/json/jcj/Myd.json",
          remoteUrl: base.server + "zxyp/jcj/jcjmydfxTrend"
        },
        //单位情况
        Dwqk: {
          localUrl: "./static/json/jcj/Dwqk.json",
          remoteUrl: base.server + "zxyp/jcj/jcjdwqk"
        },
        //雷达图1
        Rador1: {
          localUrl: "./static/json/jcj/Rador.json",
          remoteUrl: base.server + "zxyp/jcj/jcjmydfx"
        },
        //雷达图2
        Rador2: {
          localUrl: "./static/json/jcj/Rador.json",
          remoteUrl: base.server + "zxyp/jcj/jcjmydsdfx"
        },
        //警情分析
        Jqfx: {
          localUrl: "./static/json/jcj/Jqfx.json",
          remoteUrl: base.server + "zxyp/jcj/jqfx"
        },
        //环节问题
        Hjwt: {
          localUrl: "./static/json/jcj/Jqfx.json",
          remoteUrl: base.server + "zxyp/jcj/jqjtwtfx"
        },
        //问题单位
        Wtdw: {
          localUrl: "./static/json/jcj/Wtdw.json",
          remoteUrl: base.server + "zxyp/jcj/jqjtwtdwfx"
        },
        //警情类型
        Jqlx: {
          localUrl: "./static/json/jcj/Jqlx.json",
          remoteUrl: base.server + "zxyp/jcj/jcjjqlxsd"
        },
        //视频
        Video: {
          localUrl: "./static/json/jcj/Video.json",
          remoteUrl: base.server + "zxyp/jcj/videoList"
        },
        //弹窗民警信息
        User: {
          localUrl: "./static/json/jcj/User.json",
          remoteUrl: base.server + "zxyp/jcj/mjxx"
        },
        //弹窗标签云
        Tag2: {
          localUrl: "./static/json/jcj/Tag.json",
          remoteUrl: base.server + "zxyp/jcj/mjcy"
        },
        //弹窗折线图
        Line: {
          localUrl: "./static/json/ylld/Ylld.json",
          remoteUrl: base.server + "zxyp/jcj/cjtsfx"
        },
        //弹窗雷达-左
        Rador3: {
          localUrl: "./static/json/jcj/Rador.json",
          remoteUrl: base.server + "zxyp/jcj/jcjmydfx"
        },
        //弹窗雷达-右
        Rador4: {
          localUrl: "./static/json/jcj/Rador.json",
          remoteUrl: base.server + "zxyp/jcj/jcjmydsdfx"
        },
        // 一般工单量走势分析
        getGdzsgx: {
          localUrl: "./static/json/rx/Chart.json",
          remoteUrl: base.server + "zxyp/jcj/getGdzsgx"
        },
        // 一般工单业务分析
        getGdywfx: {
          localUrl: "./static/json/rx/Chart.json",
          remoteUrl: base.server + "zxyp/jcj/getGdywfx"
        },
        // 一般工单各单位情况
        getGddwfb: {
          localUrl: "./static/json/rx/Sqdwfb.json",
          remoteUrl: base.server + "zxyp/jcj/getGddwfb"
        }
      },
      ckfw: {
        //左上文本
        Txt: {
          localUrl: "./static/json/jcj/Txt.json",
          remoteUrl: base.server + "zxyp/ckfw/zbzs"
        },
        //满意度走势
        Myd: {
          localUrl: "./static/json/jcj/Myd.json",
          remoteUrl: base.server + "zxyp/ckfw/ckfwmydtrend"
        },
        //单位情况
        Dwqk: {
          localUrl: "./static/json/jcj/Dwqk.json",
          remoteUrl: base.server + "zxyp/ckfw/ckfwmyddwqk"
        },
        //雷达图
        Rador: {
          localUrl: "./static/json/jcj/Rador.json",
          remoteUrl: base.server + "zxyp/ckfw/ckfwmydfx"
        },
        //具体问题
        Jtwt: {
          localUrl: "./static/json/jcj/Jqfx.json",
          remoteUrl: base.server + "zxyp/ckfw/ckfwjtwtfx"
        },
        //案件问题
        Ajwt: {
          localUrl: "./static/json/ckfw/Ajwt.json",
          remoteUrl: base.server + "zxyp/ckfw/ajwtdwfx"
        },
        //排行榜按钮
        Menu: {
          localUrl: "./static/json/ckfw/Menu.json",
          remoteUrl: base.server + "zxyp/ckfw/mydrankbutton"
        },
        //排行榜
        Rank: {
          localUrl: "./static/json/ckfw/Rank.json",
          remoteUrl: base.server + "zxyp/ckfw/mydrankmenu"
        },
        //中上文本
        Yw: {
          localUrl: "./static/json/ckfw/Yw.json",
          remoteUrl: base.server + "zxyp/ckfw/flzbzs"
        },
        //词云
        Tag: {
          localUrl: "./static/json/jcj/Tag.json",
          remoteUrl: base.server + "zxyp/ckfw/rcfx"
        },
        //问题预测
        Ckfw: {
          localUrl: "./static/json/ckfw/Ckfw.json",
          remoteUrl: base.server + "zxyp/ckfw/ckfwwtyc"
        },
        // 一般工单量走势分析
        getGdzsgx: {
          localUrl: "./static/json/rx/Chart.json",
          remoteUrl: base.server + "zxyp/ckfw/getGdzsgx"
        },
        // 一般工单业务分析
        getGdywfx: {
          localUrl: "./static/json/rx/Chart.json",
          remoteUrl: base.server + "zxyp/ckfw/getGdywfx"
        },
        // 一般工单各单位情况
        getGddwfb: {
          localUrl: "./static/json/rx/Sqdwfb.json",
          remoteUrl: base.server + "zxyp/ckfw/getGddwfb"
        }
      },
      ylld: {
        // 加载树
        Tree: {
          localUrl: "./static/json/Tree.json",
          remoteUrl: base.server + "zxyp/ylld/getDwTree"
        },
        //左上文本
        Txt: {
          localUrl: "./static/json/ylld/Txt.json",
          remoteUrl: base.server + "zxyp/ylld/zbzs"
        },
        //排行榜
        Rank: {
          localUrl: "./static/json/ylld/Rank.json",
          remoteUrl: base.server + "zxyp/ylld/zjjml"
        },
        //社会治安满意度
        Shza: {
          localUrl: "./static/json/ckfw/Ckfw.json",
          remoteUrl: base.server + "zxyp/ylld/jtwt"
        },
        //单位情况分析
        Rdfx: {
          localUrl: "./static/json/ylld/Rdfx.json",
          remoteUrl: base.server + "zxyp/ylld/dwqkfx"
        },
        //一率两度走势
        Ylld: {
          localUrl: "./static/json/ylld/Ylld.json",
          remoteUrl: base.server + "zxyp/ylld/ylldTrend"
        },
        //多维解析-左
        Dwjxz: {
          localUrl: "./static/json/jcj/Jqfx.json",
          remoteUrl: base.server + "zxyp/ylld/getDwjs"
        },
        //多维解析-右
        Info: {
          localUrl: "./static/json/ylld/Info.json",
          remoteUrl: base.server + "zxyp/ylld/getDwjsInfo"
        },
        //走访助手
        Zfzs: {
          localUrl: "./static/json/ylld/Zfzs.json",
          remoteUrl: base.server + "zxyp/ylld/zfzs"
        },
        //推送
        Ts: {
          localUrl: "./static/json/ylld/Ts.json",
          remoteUrl: base.server + "zxyp/ylld/kchts"
        },
        Zsfx: {
          localUrl: "./static/json/ylld/Zsfx.json",
          remoteUrl: base.server + "zxyp/ylld/getZsfx"
        },
        Dyqkfx: {
          localUrl: "./static/json/ylld/Dyqkfx.json",
          remoteUrl: base.server + "zxyp/ylld/getDyqkfx"
        },
        Dyzj: {
          localUrl: "./static/json/ylld/Dyzj.json",
          remoteUrl: base.server + "zxyp/ylld/getDyzj"
        }
      },
      rx: {
        // 加载树
        Tree: {
          localUrl: "./static/json/Tree.json",
          remoteUrl: base.server + "zxyp/rx/getDwTree"
        },
        //左上文本
        Txt: {
          localUrl: "./static/json/jcj/Txt.json",
          remoteUrl: base.server + "zxyp/rx/zbzs"
        },
        //热词
        Tag: {
          localUrl: "./static/json/jcj/Tag.json",
          remoteUrl: base.server + "zxyp/rx/rc"
        },
        //热线分析
        Rxfx: {
          localUrl: "./static/json/jcj/Myd.json",
          remoteUrl: base.server + "zxyp/rx/mydAndBdFx"
        },
        //热点事件排行榜
        Rank: {
          localUrl: "./static/json/rx/Rank.json",
          remoteUrl: base.server + "zxyp/rx/rdsjRank"
        },
        // 群众诉求量
        Qzsql: {
          localUrl: "./static/json/rx/Chart.json",
          remoteUrl: base.server + "zxyp/rx/sqlTrend"
        },
        // 诉求性质分析
        Sqxz: {
          localUrl: "./static/json/rx/Chart.json",
          remoteUrl: base.server + "zxyp/rx/sqxzfx"
        },
        // 诉求单位分布
        Sqdwfb: {
          localUrl: "./static/json/rx/Sqdwfb.json",
          remoteUrl: base.server + "zxyp/rx/sqdwfb"
        },
        // 办事效能分析
        Bsxn: {
          localUrl: "./static/json/rx/Point.json",
          remoteUrl: base.server + "zxyp/rx/xnfx"
        },
        // 12345工单办理优秀案例
        getYxal: {
          localUrl: "./static/json/rx/yxal.json",
          remoteUrl: "zxyp/rx/getYxal"
        },
        // 12345工单办理优秀案例弹出页
        getPopupYxal: {
          localUrl: "./static/json/rx/popupYxal.json",
          remoteUrl: "zxyp/rx/getPopupYxal"
        },
        // 热点专题
        Rdzt: {
          localUrl: "./static/json/rx/Rdzt.json",
          remoteUrl: base.server + "zxyp/rx/rdzt"
        },
        // 诉求性质分析
        Zhpjzs: {
          localUrl: "./static/json/aj/hjwtfx.json",
          remoteUrl: base.server + "zxyp/rx/popsqxz"
        },
        // 各单位诉求量及满意度分析
        Myd: {
          localUrl: "./static/json/jcj/Myd.json",
          remoteUrl: base.server + "zxyp/rx/popdwfx"
        },
        // 群众诉求走势分析
        Qzsqzsgx: {
          localUrl: "./static/json/jcj/Myd.json",
          remoteUrl: base.server + "zxyp/rx/poptrend"
        },
        popup: {
          getTop: {
            localUrl: "./static/json/rx/top.json",
            remoteUrl: base.server + "zxyp/rx/popup/getTop"
          },
          getMidLeft: {
            localUrl: "./static/json/rx/Chart.json",
            remoteUrl: base.server + "zxyp/rx/popup/getMidLeft"
          },
          getMidRightTop: {
            localUrl: "./static/json/rx/midRightTop.json",
            remoteUrl: base.server + "zxyp/rx/popup/getMidRightTop"
          },
          getMidRight: {
            localUrl: "./static/json/rx/midRight.json",
            remoteUrl: base.server + "zxyp/rx/popup/getMidRight"
          },
          getBottomLeft: {
            localUrl: "./static/json/rx/bottomLeft.json",
            remoteUrl: base.server + "zxyp/rx/popup/getBottomLeft"
          },
          getBottomRight: {
            localUrl: "./static/json/rx/bottomRight.json",
            remoteUrl: base.server + "zxyp/rx/popup/getBottomRight"
          }
        },
        setting: {
          left1: {
            localUrl: "./static/json/rx/setting/left1.json",
            remoteUrl: base.server + "zxyp/rx/setting/left1"
          },
          left2: {
            localUrl: "./static/json/rx/setting/left2.json",
            remoteUrl: base.server + "zxyp/rx/setting/left2"
          },
          right1: {
            localUrl: "./static/json/rx/setting/right1.json",
            remoteUrl: base.server + "zxyp/rx/setting/right1"
          },
          right2: {
            localUrl: "./static/json/rx/setting/right2.json",
            remoteUrl: base.server + "zxyp/rx/setting/right2"
          },
          addRight1: {
            localUrl: "./static/json/myzs/success.json",
            remoteUrl: base.server + "zxyp/rx/setting/addRight1"
          },
          deleteRight1: {
            localUrl: "./static/json/myzs/success.json",
            remoteUrl: base.server + "zxyp/rx/setting/deleteRight1"
          },
          addRight2: {
            localUrl: "./static/json/myzs/success.json",
            remoteUrl: base.server + "zxyp/rx/setting/addRight2"
          }
        }
      },
      jtsg: {
        // 树结构
        Tree: {
          localUrl: "./static/json/Tree.json",
          remoteUrl: base.server + "zxyp/jcj/getDwTree"
        },
        // 左上指标
        left1: {
          localUrl: "./static/json/jtsg/left1.json",
          remoteUrl: base.server + "zxyp/jtsg/getJqAndJtsg"
        },
        // 左下满意度走势分析
        left2: {
          localUrl: "./static/json/jtsg/left2.json",
          remoteUrl: base.server + "zxyp/jtsg/getMydzsfx"
        },
        // 中1-1交通警情分析
        mid1_1: {
          localUrl: "./static/json/jtsg/left2.json",
          remoteUrl: base.server + "zxyp/jtsg/getJtjqfx"
        },
        // 中1-2具体问题分析
        mid1_2: {
          localUrl: "./static/json/jtsg/left2.json",
          remoteUrl: base.server + "zxyp/jtsg/getJtwtfx"
        },
        // 中1-3具体问题单位分布
        mid1_3: {
          localUrl: "./static/json/jtsg/mid1-3.json",
          remoteUrl: base.server + "zxyp/jtsg/getJtwtdwfb"
        },
        // 中2-1窗口服务满意度
        mid2_1: {
          localUrl: "./static/json/jtsg/mid2-1.json",
          remoteUrl: base.server + "zxyp/jtsg/getJtsgclzhpj"
        },
        // 中2-2环节问题分析
        mid2_2: {
          localUrl: "./static/json/jtsg/left2.json",
          remoteUrl: base.server + "zxyp/jtsg/getHjwtfx"
        },
        // 中2-3环节问题单位分布
        mid2_3: {
          localUrl: "./static/json/jtsg/mid1-3.json",
          remoteUrl: base.server + "zxyp/jtsg/getHjwtdwfx"
        },
        // 右1满意度下滑预警分析
        right1: {
          localUrl: "./static/json/jtsg/right1.json",
          remoteUrl: base.server + "zxyp/jtsg//getMydxhyj"
        },
        // 右1综合评价排行榜
        right2: {
          localUrl: "./static/json/jtsg/right2.json",
          remoteUrl: base.server + "zxyp/jtsg/getZhpjphb"
        }
      }
    },
    znbg: {
      ywfxbg: {
        submitSetting: {
          // 设置接口
          localUrl: "./static/json/ywfxbg/submitSetting.json",
          remoteUrl: base.server + "znbg/ywfxbg/submitSetting"
        },
        generateReport: {
          // 生成报告
          localUrl: "./static/json/ywfxbg/generateReport.json",
          remoteUrl: base.server + "znbg/ywfxbg/generateReport"
        },
        getFileList: {
          // 获取文件列表
          localUrl: "./static/json/ywfxbg/getFileList.json",
          remoteUrl: base.server + "znbg/ywfxbg/getFileList"
        },
        postImg: {
          localUrl: "./static/json/ywfxbg/postImg.json",
          remoteUrl: base.server + "znbg/ywfxbg/postImg"
        },
        getJcjPreview: {
          localUrl: "./static/json/ywfxbg/jcjPreview.json",
          remoteUrl: base.server + "znbg/ywfxbg/getJcjPreview"
        },
        getAjPreview: {
          localUrl: "./static/json/ywfxbg/ajPreview.json",
          remoteUrl: base.server + "znbg/ywfxbg/getAjPreview"
        },
        getRxPreview: {
          localUrl: "./static/json/ywfxbg/rxPreview.json",
          remoteUrl: base.server + "znbg/ywfxbg/getRxPreview"
        },
        getJtsgPreview: {
          localUrl: "./static/json/ywfxbg/jtsgPreview.json",
          remoteUrl: base.server + "znbg/ywfxbg/getJtsgPreview"
        },
        uploadImg: {
          localUrl: "./static/json/ywfxbg/uploadImg.json",
          remoteUrl: base.server + "znbg/ywfxbg/uploadImg"
        },
        deleteReport: {
          // 删除报告
          localUrl: "./static/json/ywfxbg/deleteReport.json",
          remoteUrl: base.server + "znbg/ywfxbg/deleteReport"
        }
      }
    }
  };

  base.getHtmlArg = function(name, defaultValue) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return defaultValue;
  };

  base.getUrlParam = function(name, defaultValue) {
    var str = window.location.hash.substring(
      window.location.hash.indexOf(name) + name.length + 1,
      window.location.hash.length
    );
    return decodeURI(str);
  };

  base.getParam = function(name) {
    var strArr = window.location.hash.split("?");
    var result = {};
    if (strArr[1]) {
      var dataArr = strArr[1].split("&");
      if (dataArr) {
        for (var i = 0; i < dataArr.length; i++) {
          var arr = dataArr[i].split("=");
          result[arr[0]] = arr[1];
        }
      }
    }
    return result[name] ? decodeURI(result[name]) : "";
  };

  base.backFill = function(data) {
    for (var key in data) {
      $("#" + key).html(data[key]);
    }
  };

  base.requestJson = function(urlOrInterfaceObj, callBack) {
    var url,
      currentPage = window.location.hash;
    if (typeof urlOrInterfaceObj.url == "string") {
      url = urlOrInterfaceObj.url;
    } else {
      url = base.isPublished
        ? urlOrInterfaceObj.url.remoteUrl
        : urlOrInterfaceObj.url.localUrl;
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
      success: function(result) {
        if (result != null) {
          if (window.location.hash == currentPage && callBack) {
            callBack(result);
          }
        } else {
          console.log("无数据");
        }
        config = null;
      },
      error: function() {
        //接口调用失败
      }
    };
    $.ajax(config);
  };

  // 利用promise请求
  base.request = function(url, data) {
    return new Promise((resolve, reject) => {
      let option = {
        url,
        type: "get",
        data,
        success: resolve,
        error: reject,
        dataType: "json",
        traditional: true
      };
      option.url = base.isPublished ? url.remoteUrl : url.localUrl;
      option.type = base.isPublished ? "post" : "get";
      $.ajax(option);
    });
  };

  base.opacityAnimate = function(ele, text, speed, time) {
    window.setInterval(function() {
      $("#" + ele).animate({ opacity: 0 }, speed * 1000, function() {
        $("#" + ele).html(text);
        $("#" + ele).animate({ opacity: 1 }, speed * 1000);
      });
    }, time * 1000);
  };

  base.showDialog = function(option) {
    window.dialogParams = option.params;
    var tempW = option.width + "px",
      tempH = option.height + "px",
      tempL = "-" + (option.width / 2 + "px"),
      tempT = "-" + (option.height / 2 + "px");
    var tempID = "showDialog" + Math.floor(Math.random() * 10000 + 1);
    $("#ui-view").append(
      "<div class='simple_shade'></div>" +
        "<div class='simple_showDialog' id=" +
        tempID +
        ">" +
        "<i class='simple_close glyphicon glyphicon-remove'></i>" +
        "<div class='simple_content'></div>" +
        "</div>"
    );
    $("#" + tempID).css("width", tempW);
    $("#" + tempID).css("height", tempH);
    $("#" + tempID).css("marginTop", tempT);
    $("#" + tempID).css("marginLeft", tempL);
    $("#" + tempID)
      .find(".simple_content")
      .html(option.ele);
    $("#" + tempID)
      .find(".simple_close")
      .unbind()
      .bind("click", function() {
        $(".simple_shade").remove();
        $("#" + tempID).remove();
      });
  };

  // 带有标题的弹出框
  base.renderDialog = function(option) {
    window.dialogParams = option.params;
    var tempW = option.width + "px",
      tempH = option.height + "px",
      tempL = "-" + (option.width / 2 + "px"),
      tempT = "-" + (option.height / 2 + "px");
    var tempID = "showDialog" + Math.floor(Math.random() * 10000 + 1);
    $("#ui-view").append(
      "<div class='simple_shade'></div>" +
        "<div class='simple_showDialog' id=" +
        tempID +
        ">" +
        "<div class='simple_showDialog_header'>" +
        option.title +
        "<i class='simple_close glyphicon glyphicon-remove'></i>" +
        "</div>" +
        "<div class='simple_content'></div>" +
        "</div>"
    );
    $("#" + tempID).css("width", tempW);
    $("#" + tempID).css("height", tempH);
    $("#" + tempID).css("marginTop", tempT);
    $("#" + tempID).css("marginLeft", tempL);
    $("#" + tempID)
      .find(".simple_content")
      .html(option.ele);
    $("#" + tempID)
      .find(".simple_close")
      .unbind()
      .bind("click", function() {
        $(".simple_shade").remove();
        $("#" + tempID).remove();
      });
  };

  // 提示框组件
  base.showMessage = function(msg, type) {
    var divClass, iClass;
    switch (type) {
      case "warning":
        divClass = "pop-message-warning";
        iClass = "glyphicon-exclamation-sign";
        break;
      case "success":
        divClass = "pop-message-success";
        iClass = "glyphicon-ok-sign";
        break;
      case "error":
        divClass = "pop-message-error";
        iClass = "glyphicon-remove-sign";
        break;
      default:
        divClass = "pop-message-default";
        iClass = "glyphicon-info-sign";
        break;
    }
    $("#ui-view").append(
      '<div class="pop-message ' +
        divClass +
        '">' +
        '<i class="glyphicon ' +
        iClass +
        '"></i>' +
        '<span class="pop-message-context">' +
        msg +
        "</span></div>"
    );
    setTimeout(function() {
      $(".pop-message").remove();
    }, 3000);
  };

  // 分页组件
  base.renderNav = function($div, pageNum, totalPage, callback) {
    $div.addClass("com-nav");
    pageNum = pageNum || 1;
    totalPage = totalPage || 0;
    pageNum = pageNum < 0 ? 1 : pageNum;
    pageNum = pageNum > totalPage ? totalPage : pageNum;
    var arr = [];
    if (totalPage == 1 || totalPage == 0) {
      arr = [{ value: 1, selected: true }];
    } else if (totalPage == 2) {
      if (pageNum == 1) {
        arr = [{ value: 1, selected: true }, { value: 2, selected: false }];
      } else {
        arr = [{ value: 1, selected: false }, { value: 2, selected: true }];
      }
    } else {
      if (pageNum == 1) {
        arr = [{ value: 1, selected: true }, { value: 2, selected: false }];
      } else if (pageNum == totalPage) {
        arr = [
          { value: pageNum - 1, selected: false },
          { value: pageNum, selected: true }
        ];
      } else {
        for (var i = 0; i < 3; i++) {
          arr.push({ value: pageNum - 1 + i, selected: i == 1 });
        }
      }
    }
    renderChild(arr);

    function renderChild(dataArr) {
      $div.empty();
      $div.append($("<div/>").html("&lt;"));
      dataArr.map(function(val) {
        if (val.selected) {
          $div.append(
            $("<div/>")
              .html(val.value)
              .addClass("com-nav-selected")
          );
        } else {
          $div.append($("<div/>").html(val.value));
        }
      });
      $div.append($("<div/>").html("&gt;"));
    }

    // 绑定点击事件
    $div
      .find("div")
      .unbind()
      .bind("click", function(e) {
        var key = e.target.innerHTML,
          toPage;
        switch (key) {
          case "&lt;":
            toPage = 1;
            break;
          case "&gt;":
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

  // 加载中页面组件
  base.renderLoading = () => {
    $("#ui-view").append(
      $("<aside/>")
        .addClass("loading")
        .append("<div></div>")
    );
  };

  // 移出加载组件
  base.removeLoading = () => {
    $(".loading").remove();
  };

  // 生成uuid
  base.uuid = function() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
  };

  base.initRightMenu = function() {
    requirejs(["text!../views/myhc/rightMenu.html"], function(ele) {
      $(".rightPannel").html(ele);
    });
  };

  base.getLabelVal = function(val) {
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

  return base;
});
