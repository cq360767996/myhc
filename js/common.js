define([], function() {
  var base = {};

  base.isPublished = false;

  base.remotePath = "../";
  base.localPath = "./static/json/";

  base.interFaces = {
    myzs: {
      //下拉树
      Tree: {
        localUrl: base.localPath + "Tree.json",
        remoteUrl: base.remotePath + "myzs/getDwTree"
      },
      // 根据单位code获取单位id
      DeptId: { remoteUrl: base.remotePath + "myzs/getDwInfo" },
      // 加载左侧数据
      getLeftData: { remoteUrl: base.remotePath + "myzs/getLeftData" },
      // 加载右侧中间部分数据
      getRightMidData: { remoteUrl: base.remotePath + "myzs/getRightMidData" },
      // 加载右侧数据
      getRightData: { remoteUrl: base.remotePath + "rdwt/getCkRdwtList" },
      // 获取指标组成
      getZbzc: {
        localUrl: base.localPath + "myzs/pop-zbzs.json",
        remoteUrl: base.remotePath + "myzs/getZbzc"
      },
      // 指标展示悬停弹框
      getZbzcDetail: {
        localUrl: base.localPath + "myzs/pop-zbzs-detail.json",
        remoteUrl: base.remotePath + "myzs/getZbzcDetail"
      },
      // 执法公信力走势分析
      getZfgxl: { remoteUrl: base.remotePath + "myzs/getZfgxl" },
      // 单位情况
      getDwqk: { remoteUrl: base.remotePath + "myzs/getDwqk" },
      // 根据单位id获取单位层级
      getDwLevel: { remoteUrl: base.remotePath + "myzs/getDwLevel" },
      // 社会治安满意度调查情况
      getMyd: {
        localUrl: base.localPath + "myd.json",
        remoteUrl: base.remotePath + "myzs/getMyd"
      },
      // 获取数据录入初始化数据
      getSjlr: {
        localUrl: base.localPath + "myzs/pop1.json",
        remoteUrl: base.remotePath + "myzs/getSjlr"
      },
      // 提交数据录入
      submitSjlr: {
        localUrl: base.localPath + "myzs/success.json",
        remoteUrl: base.remotePath + "myzs/submitSjlr"
      },
      // 获取系数配置初始化数据
      getXspz: {
        localUrl: base.localPath + "myzs/pop2.json",
        remoteUrl: base.remotePath + "myzs/getXspz"
      },
      // 重置系数配置
      resetXspz: {
        localUrl: base.localPath + "myzs/pop2.json",
        remoteUrl: base.remotePath + "myzs/resetXspz"
      },
      // 提交系数配置
      submitXspz: {
        localUrl: base.localPath + "myzs/success.json",
        remoteUrl: base.remotePath + "myzs/submitXspz"
      },
      // 获取展示配置初始化数据
      getZspz: {
        localUrl: base.localPath + "myzs/pop3.json",
        remoteUrl: base.remotePath + "myzs/getZspz"
      },
      // 重置展示配置
      resetZspz: {
        localUrl: base.localPath + "myzs/pop3.json",
        remoteUrl: base.remotePath + "myzs/resetZspz"
      },
      // 计算展示配置数据
      calcZspz: {
        localUrl: base.localPath + "myzs/pop3.json",
        remoteUrl: base.remotePath + "myzs/calcZspz"
      },
      // 提交展示配置
      submitZspz: {
        localUrl: base.localPath + "myzs/success.json",
        remoteUrl: base.remotePath + "myzs/submitZspz"
      },
      getPoint: {
        localUrl: base.localPath + "myzs/success.json",
        remoteUrl: base.remotePath + "myzs/getTestJwd"
      },
      getMapData: {
        localUrl: base.localPath + "myzs/success.json",
        remoteUrl: base.remotePath + "myzs/getMapData"
      },
      getPcsZb: {
        localUrl: base.localPath + "myzs/success.json",
        remoteUrl: base.remotePath + "myzs/getPcsZb"
      },
      getDetailMapData: {
        localUrl: base.localPath + "myzs/success.json",
        remoteUrl: base.remotePath + "myzs/getDetailMapData"
      },
      getMapCount: {
        localUrl: base.localPath + "myzs/success.json",
        remoteUrl: base.remotePath + "myzs/getMapCount"
      },
      getMapDataByBounds: {
        localUrl: base.localPath + "myzs/success.json",
        remoteUrl: base.remotePath + "myzs/getMapDataByBounds"
      },
      getCkfw: {
        localUrl: base.localPath + "myzs/success.json",
        remoteUrl: base.remotePath + "myzs/getCkfw"
      },
      getCkMapData: {
        localUrl: base.localPath + "myzs/success.json",
        remoteUrl: base.remotePath + "myzs/getCkMapData"
      },
      getCkfwq: {
        remoteUrl: base.remotePath + "myzs/getCkfwq"
      },
      getCkDetail: {
        remoteUrl: base.remotePath + "myzs/getCkDetail"
      },
      getPointByCode: {
        remoteUrl: base.remotePath + "myzs/getPointByCode"
      },
      getCkRdwtDetail: {
        remoteUrl: base.remotePath + "myzs/getCkRdwtDetail"
      },
      getCkfwqDetail: {
        remoteUrl: base.remotePath + "myzs/getCkfwqDetail"
      },
      getCkfwqZb: {
        localUrl: base.localPath + "myzs/getCkfwqZb.json",
        remoteUrl: base.remotePath + "myzs/getCkfwqZb"
      },
      getCkfwqRybd: {
        localUrl: base.localPath + "myzs/getCkfwqRank.json",
        remoteUrl: base.remotePath + "myzs/getCkfwqRybd"
      },
      getCkfwqDwbd: {
        localUrl: base.localPath + "myzs/getCkfwqRank.json",
        remoteUrl: base.remotePath + "myzs/getCkfwqDwbd"
      },
      getCkfwqRankPopup: {
        localUrl: base.localPath + "myzs/getCkfwqRankPopup.json",
        remoteUrl: base.remotePath + "myzs/getCkfwqRankPopup"
      },
      getBmfwq: {
        localUrl: base.localPath + "myzs/getBmfwq.json",
        remoteUrl: base.remotePath + "myzs/getBmfwq"
      },
      getYlldMapData: {
        localUrl: base.localPath + "myzs/getBmfwq.json",
        remoteUrl: base.remotePath + "myzs/getYlldMapData"
      },
      getYlldMapRight1: {
        localUrl: base.localPath + "myzs/getBmfwq.json",
        remoteUrl: base.remotePath + "myzs/getYlldMapRight1"
      },
      getYlldMapRight2: {
        localUrl: base.localPath + "myzs/getBmfwq.json",
        remoteUrl: base.remotePath + "myzs/getYlldMapRight2"
      },
      getYlldMapRight3: {
        localUrl: base.localPath + "myzs/getBmfwq.json",
        remoteUrl: base.remotePath + "myzs/getYlldMapRight3"
      },
      getYlldMapRight4: {
        localUrl: base.localPath + "myzs/getBmfwq.json",
        remoteUrl: base.remotePath + "myzs/getYlldMapRight4"
      },
      getYlldDetailMapData: {
        localUrl: base.localPath + "myzs/getBmfwq.json",
        remoteUrl: base.remotePath + "myzs/getYlldDetailMapData"
      },
      getYlldPcsData: {
        localUrl: base.localPath + "myzs/getBmfwq.json",
        remoteUrl: base.remotePath + "myzs/getYlldPcsData"
      },
      getYlldDetailMapDataByBound: {
        localUrl: base.localPath + "myzs/getBmfwq.json",
        remoteUrl: base.remotePath + "myzs/getYlldDetailMapDataByBound"
      },
      getYlldRdsjByBound: {
        localUrl: base.localPath + "myzs/getBmfwq.json",
        remoteUrl: base.remotePath + "myzs/getYlldRdsjByBound"
      }
    },
    myjz: {
      //下拉树
      Tree: {
        localUrl: base.localPath + "Tree.json",
        remoteUrl: base.remotePath + "myjz/getDwTree"
      },
      //民意矩阵中间数据
      List: {
        localUrl: base.localPath + "List.json",
        remoteUrl: base.remotePath + "myjz/getMyjz"
      },
      //查询栏日期默认值
      Date: {
        localUrl: base.localPath + "Date.json",
        remoteUrl: base.remotePath + "myjz/getRecentDate"
      },
      //极坐标弹窗接口
      Window1: {
        localUrl: base.localPath + "Window1.json",
        remoteUrl: base.remotePath + "myjz/getMyjzDialogData"
      },
      //环形图弹窗接口
      Window2: {
        localUrl: base.localPath + "Window2.json",
        remoteUrl: base.remotePath + "myjz/getMyjzDialogData"
      },
      //雷达图弹窗接口
      Window3: {
        localUrl: base.localPath + "Window3.json",
        remoteUrl: base.remotePath + "myjz/getMyjzDialogData"
      },
      //部门列表
      bmList: {
        localUrl: base.localPath + "bmList.json",
        remoteUrl: base.remotePath + "myjz/getMyjz"
      }
    },
    dwjx: {
      //初始化标签
      Tab: {
        localUrl: base.localPath + "Tab.json",
        remoteUrl: base.remotePath + "dwjx/getNavigor"
      },
      //初始化标签
      Chart: {
        localUrl: base.localPath + "Chart.json",
        remoteUrl: base.remotePath + "dwjx/getChartData"
      },
      //下拉树
      Tree: {
        localUrl: base.localPath + "Tree.json",
        remoteUrl: base.remotePath + "dwjx/getDwTree"
      },
      //二级标签
      Tab2: {
        localUrl: base.localPath + "Tab2.json",
        remoteUrl: base.remotePath + "dwjx/getNavigor"
      },
      //标红功能
      Keywords: {
        localUrl: base.localPath + "Keywords.json",
        remoteUrl: base.remotePath + "dwjx/search"
      },
      //可操作图表
      TopChart: {
        localUrl: base.localPath + "TopChart.json",
        remoteUrl: base.remotePath + "dwjx/getNavigor"
      },
      //其他图标数据
      OtherCharts: {
        localUrl: base.localPath + "OtherCharts.json",
        remoteUrl: base.remotePath + "dwjx/getChartData"
      }
    },
    myys: {
      //民意热词
      HotWords: {
        localUrl: base.localPath + "HotWords.json",
        remoteUrl: base.remotePath + "myys/getReSouList"
      },
      //热搜-换一换
      SearchList: {
        localUrl: base.localPath + "SearchList.json",
        remoteUrl: base.remotePath + "myys/getReSouList"
      },
      //查询列表
      DataList: {
        localUrl: base.localPath + "DataList.json",
        remoteUrl: base.remotePath + "myys/search"
      },
      // 更新查询列表缓存
      cacheDataList: {
        localUrl: base.localPath + "DataList.json",
        remoteUrl: base.remotePath + "myys/cacheSearch"
      },
      //详情
      Detail: {
        localUrl: base.localPath + "Detail.json",
        remoteUrl: base.remotePath + "myys/getDetail"
      },
      // 缓存详情页
      cacheDetail: {
        localUrl: base.localPath + "Detail.json",
        remoteUrl: base.remotePath + "myys/cacheDetail"
      },
      // 弹出详细信息
      PopDetail: {
        localUrl: base.localPath + "Detail.json",
        remoteUrl: base.remotePath + "myys/getPopDetail"
      },
      //详情表格
      Grid: {
        localUrl: base.localPath + "Grid.json",
        remoteUrl: base.remotePath + "myys/getGrid"
      },
      // 更新详情表格
      cacheGrid: {
        localUrl: base.localPath + "Grid.json",
        remoteUrl: base.remotePath + "myys/cacheGrid"
      },
      //详情表格
      saveKeyWord: {
        localUrl: base.localPath + "Grid.json",
        remoteUrl: base.remotePath + "myys/saveKeyWord"
      }
    },
    rdwt: {
      tree: {
        localUrl: base.localPath + "Tree.json",
        remoteUrl: base.remotePath + "myzs/getDwTree"
      },
      getMidData: {
        localUrl: base.localPath + "rdwt/midData.json",
        remoteUrl: base.remotePath + "rdwt/getRdwtList"
      },
      getChart1: {
        localUrl: base.localPath + "ylld/chart.json",
        remoteUrl: base.remotePath + "rdwt/getTrend"
      },
      getChart2: {
        localUrl: base.localPath + "ylld/chart.json",
        remoteUrl: base.remotePath + "rdwt/getSqxz"
      },
      getChart3: {
        localUrl: base.localPath + "ylld/chart.json",
        remoteUrl: base.remotePath + "rdwt/getWt"
      },
      getChart4: {
        localUrl: base.localPath + "ylld/chart.json",
        remoteUrl: base.remotePath + "rdwt/getDwfb"
      },
      getLeft: {
        localUrl: base.localPath + "rdwt/left.json",
        remoteUrl: base.remotePath + "rdwt/getTableData"
      },
      getRight: {
        localUrl: base.localPath + "rdwt/right.json",
        remoteUrl: base.remotePath + "rdwt/getSelectedTableData"
      },
      getPreview: {
        localUrl: base.localPath + "rdwt/preview.json",
        remoteUrl: base.remotePath + "rdwt/preview"
      },
      publish: {
        localUrl: base.localPath + "rdwt/publish.json",
        remoteUrl: base.remotePath + "rdwt/publish"
      },
      getPopMenu: {
        localUrl: base.localPath + "rdwt/tags.json",
        remoteUrl: base.remotePath + "rdwt/getTags"
      },
      // 获取接处警数据
      getJcj: {
        localUrl: base.localPath + "rdwt/jcj.json",
        remoteUrl: base.remotePath + "rdwt/ranking"
      },
      // 获取窗口服务数据
      getCkfw: {
        localUrl: base.localPath + "rdwt/jcj.json",
        remoteUrl: base.remotePath + "rdwt/ranking"
      },
      // 获取案件数据
      getAj: {
        localUrl: base.localPath + "rdwt/jcj.json",
        remoteUrl: base.remotePath + "rdwt/ranking"
      },
      // 获取社区民警熟悉率数据
      getMjsxl: {
        localUrl: base.localPath + "rdwt/sxl.json",
        remoteUrl: base.remotePath + "rdwt/ranking"
      }
    },
    myhc: {
      myzd: {
        getCount: {
          localUrl: base.localPath + "myzd/getCount.json",
          remoteUrl: base.remotePath + "myhc/myzd/getSummary"
        },
        getLeft1: {
          localUrl: base.localPath + "chartTemplate.json",
          remoteUrl: base.remotePath + "myhc/myzd/getLeft1"
        },
        getLeft2: {
          localUrl: base.localPath + "chartTemplate.json",
          remoteUrl: base.remotePath + "myhc/myzd/getLeft2"
        },
        getMid1: {
          localUrl: base.localPath + "myzd/mid1.json",
          remoteUrl: base.remotePath + "myhc/myzd/getMid1"
        },
        getMid2: {
          localUrl: base.localPath + "chartTemplate.json",
          remoteUrl: base.remotePath + "myhc/myzd/getMid2"
        },
        getMid3: {
          localUrl: base.localPath + "chartTemplate.json",
          remoteUrl: base.remotePath + "myhc/myzd/getMid3"
        },
        getRight1: {
          localUrl: base.localPath + "chartTemplate.json",
          remoteUrl: base.remotePath + "myhc/myzd/getRight1"
        },
        getRight2: {
          localUrl: base.localPath + "jcj/Tag.json",
          remoteUrl: base.remotePath + "myhc/myzd/getRight2"
        }
      }
    },
    zxyp: {
      aj: {
        Tree: {
          localUrl: base.localPath + "Tree.json",
          remoteUrl: base.remotePath + "zxyp/aj/getDwTree"
        }, // 加载树
        getZbzs: {
          localUrl: base.localPath + "aj/zbzs.json",
          remoteUrl: base.remotePath + "zxyp/aj/zbzs"
        }, // 加载指标展示
        getHfrc: {
          localUrl: base.localPath + "aj/hfrc.json",
          remoteUrl: base.remotePath + "zxyp/aj/hfrc"
        }, // 加载热词
        getZhpjzsfxTrend: {
          localUrl: base.localPath + "aj/zhpjzsfxTrend.json",
          remoteUrl: base.remotePath + "zxyp/aj/zhpjzsfxTrend"
        }, // 加载趋势分析
        getZhpjzsfx: {
          localUrl: base.localPath + "aj/zhpjzsfx.json",
          remoteUrl: base.remotePath + "zxyp/aj/zhpjzsfx"
        }, // 加载案件综合评价指数分析
        getHjwtfx: {
          localUrl: base.localPath + "aj/hjwtfx.json",
          remoteUrl: base.remotePath + "zxyp/aj/hjwtfx"
        }, // 加载环节问题分析
        getAjdwfb: {
          localUrl: base.localPath + "aj/ajdwfb.json",
          remoteUrl: base.remotePath + "zxyp/aj/ajdwfb"
        }, // 加载案件问题单位分布
        getAjbljtwtfx: {
          localUrl: base.localPath + "aj/ajbljtwtfx.json",
          remoteUrl: base.remotePath + "zxyp/aj/ajbljtwtfx"
        }, // 加载办案小助手-案件办理具体问题分析
        getZxfxpjzs: {
          localUrl: base.localPath + "aj/zxfxpjzs.json",
          remoteUrl: base.remotePath + "zxyp/aj/zxfxpjzs"
        }, // 加载专项分析评价指数
        getZsmyb: {
          localUrl: base.localPath + "aj/zsmyb.json",
          remoteUrl: base.remotePath + "zxyp/aj/zsmyb"
        }, // 加载案件办理综合评价指数满意榜
        getZxfxzhpjzs: {
          localUrl: base.localPath + "aj/zxfxzhpjzs.json",
          remoteUrl: base.remotePath + "zxyp/aj/zxfxzhpjzs"
        }, // 加载弹出框案件综合评价指数分析分析
        getZxgf: {
          localUrl: base.localPath + "aj/zxgf.json",
          remoteUrl: base.remotePath + "zxyp/aj/zxgf"
        } // 加载执行规范
      },
      jcj: {
        // 加载树
        Tree: {
          localUrl: base.localPath + "Tree.json",
          remoteUrl: base.remotePath + "zxyp/jcj/getDwTree"
        },
        //左上文本
        Txt: {
          localUrl: base.localPath + "jcj/Txt.json",
          remoteUrl: base.remotePath + "zxyp/jcj/zbzs"
        },
        //知识库
        Zsk: {
          localUrl: base.localPath + "jcj/Zsk.json",
          remoteUrl: base.remotePath + "zxyp/jcj/zsk"
        },
        //下滑预警
        Xhyj: {
          localUrl: base.localPath + "jcj/Xhyj.json",
          remoteUrl: base.remotePath + "zxyp/jcj/xhyjfx"
        },
        //排行榜
        Rank: {
          localUrl: base.localPath + "jcj/Rank.json",
          remoteUrl: base.remotePath + "zxyp/jcj/jcjmydrank"
        },
        //标签云
        Tag: {
          localUrl: base.localPath + "jcj/Tag.json",
          remoteUrl: base.remotePath + "zxyp/jcj/rcfx"
        },
        //满意度
        Myd: {
          localUrl: base.localPath + "jcj/Myd.json",
          remoteUrl: base.remotePath + "zxyp/jcj/jcjmydfxTrend"
        },
        //单位情况
        Dwqk: {
          localUrl: base.localPath + "jcj/Dwqk.json",
          remoteUrl: base.remotePath + "zxyp/jcj/jcjdwqk"
        },
        //雷达图1
        Rador1: {
          localUrl: base.localPath + "jcj/Rador.json",
          remoteUrl: base.remotePath + "zxyp/jcj/jcjmydfx"
        },
        //雷达图2
        Rador2: {
          localUrl: base.localPath + "jcj/Rador.json",
          remoteUrl: base.remotePath + "zxyp/jcj/jcjmydsdfx"
        },
        //警情分析
        Jqfx: {
          localUrl: base.localPath + "jcj/Jqfx.json",
          remoteUrl: base.remotePath + "zxyp/jcj/jqfx"
        },
        //环节问题
        Hjwt: {
          localUrl: base.localPath + "jcj/Jqfx.json",
          remoteUrl: base.remotePath + "zxyp/jcj/jqjtwtfx"
        },
        //问题单位
        Wtdw: {
          localUrl: base.localPath + "jcj/Wtdw.json",
          remoteUrl: base.remotePath + "zxyp/jcj/jqjtwtdwfx"
        },
        //警情类型
        Jqlx: {
          localUrl: base.localPath + "jcj/Jqlx.json",
          remoteUrl: base.remotePath + "zxyp/jcj/jcjjqlxsd"
        },
        //视频
        Video: {
          localUrl: base.localPath + "jcj/Video.json",
          remoteUrl: base.remotePath + "zxyp/jcj/videoList"
        },
        //弹窗民警信息
        User: {
          localUrl: base.localPath + "jcj/User.json",
          remoteUrl: base.remotePath + "zxyp/jcj/mjxx"
        },
        //弹窗标签云
        Tag2: {
          localUrl: base.localPath + "jcj/Tag.json",
          remoteUrl: base.remotePath + "zxyp/jcj/mjcy"
        },
        //弹窗折线图
        Line: {
          localUrl: base.localPath + "ylld/Ylld.json",
          remoteUrl: base.remotePath + "zxyp/jcj/cjtsfx"
        },
        //弹窗雷达-左
        Rador3: {
          localUrl: base.localPath + "jcj/Rador.json",
          remoteUrl: base.remotePath + "zxyp/jcj/jcjmydfx"
        },
        //弹窗雷达-右
        Rador4: {
          localUrl: base.localPath + "jcj/Rador.json",
          remoteUrl: base.remotePath + "zxyp/jcj/jcjmydsdfx"
        },
        // 一般工单量走势分析
        getGdzsgx: {
          localUrl: base.localPath + "rx/Chart.json",
          remoteUrl: base.remotePath + "zxyp/jcj/getGdzsgx"
        },
        // 一般工单业务分析
        getGdywfx: {
          localUrl: base.localPath + "rx/Chart.json",
          remoteUrl: base.remotePath + "zxyp/jcj/getGdywfx"
        },
        // 一般工单各单位情况
        getGddwfb: {
          localUrl: base.localPath + "rx/Sqdwfb.json",
          remoteUrl: base.remotePath + "zxyp/jcj/getGddwfb"
        }
      },
      ckfw: {
        //左上文本
        Txt: {
          localUrl: base.localPath + "jcj/Txt.json",
          remoteUrl: base.remotePath + "zxyp/ckfw/zbzs"
        },
        //满意度走势
        Myd: {
          localUrl: base.localPath + "jcj/Myd.json",
          remoteUrl: base.remotePath + "zxyp/ckfw/ckfwmydtrend"
        },
        //单位情况
        Dwqk: {
          localUrl: base.localPath + "jcj/Dwqk.json",
          remoteUrl: base.remotePath + "zxyp/ckfw/ckfwmyddwqk"
        },
        //雷达图
        Rador: {
          localUrl: base.localPath + "jcj/Rador.json",
          remoteUrl: base.remotePath + "zxyp/ckfw/ckfwmydfx"
        },
        //具体问题
        Jtwt: {
          localUrl: base.localPath + "jcj/Jqfx.json",
          remoteUrl: base.remotePath + "zxyp/ckfw/ckfwjtwtfx"
        },
        //案件问题
        Ajwt: {
          localUrl: base.localPath + "ckfw/Ajwt.json",
          remoteUrl: base.remotePath + "zxyp/ckfw/ajwtdwfx"
        },
        //排行榜按钮
        Menu: {
          localUrl: base.localPath + "ckfw/Menu.json",
          remoteUrl: base.remotePath + "zxyp/ckfw/mydrankbutton"
        },
        //排行榜
        Rank: {
          localUrl: base.localPath + "ckfw/Rank.json",
          remoteUrl: base.remotePath + "zxyp/ckfw/mydrankmenu"
        },
        //中上文本
        Yw: {
          localUrl: base.localPath + "ckfw/Yw.json",
          remoteUrl: base.remotePath + "zxyp/ckfw/flzbzs"
        },
        //词云
        Tag: {
          localUrl: base.localPath + "jcj/Tag.json",
          remoteUrl: base.remotePath + "zxyp/ckfw/rcfx"
        },
        //问题预测
        Ckfw: {
          localUrl: base.localPath + "ckfw/Ckfw.json",
          remoteUrl: base.remotePath + "zxyp/ckfw/ckfwwtyc"
        },
        // 一般工单量走势分析
        getGdzsgx: {
          localUrl: base.localPath + "rx/Chart.json",
          remoteUrl: base.remotePath + "zxyp/ckfw/getGdzsgx"
        },
        // 一般工单业务分析
        getGdywfx: {
          localUrl: base.localPath + "rx/Chart.json",
          remoteUrl: base.remotePath + "zxyp/ckfw/getGdywfx"
        },
        // 一般工单各单位情况
        getGddwfb: {
          localUrl: base.localPath + "rx/Sqdwfb.json",
          remoteUrl: base.remotePath + "zxyp/ckfw/getGddwfb"
        }
      },
      ylld: {
        // 加载树
        Tree: {
          localUrl: base.localPath + "Tree.json",
          remoteUrl: base.remotePath + "zxyp/ylld/getDwTree"
        },
        //左上文本
        Txt: {
          localUrl: base.localPath + "ylld/Txt.json",
          remoteUrl: base.remotePath + "zxyp/ylld/zbzs"
        },
        //排行榜
        Rank: {
          localUrl: base.localPath + "ylld/Rank.json",
          remoteUrl: base.remotePath + "zxyp/ylld/zjjml"
        },
        //社会治安满意度
        Shza: {
          localUrl: base.localPath + "ckfw/Ckfw.json",
          remoteUrl: base.remotePath + "zxyp/ylld/jtwt"
        },
        //单位情况分析
        Rdfx: {
          localUrl: base.localPath + "ylld/Rdfx.json",
          remoteUrl: base.remotePath + "zxyp/ylld/dwqkfx"
        },
        //一率两度走势
        Ylld: {
          localUrl: base.localPath + "ylld/Ylld.json",
          remoteUrl: base.remotePath + "zxyp/ylld/ylldTrend"
        },
        //多维解析-左
        Dwjxz: {
          localUrl: base.localPath + "jcj/Jqfx.json",
          remoteUrl: base.remotePath + "zxyp/ylld/getDwjs"
        },
        //多维解析-右
        Info: {
          localUrl: base.localPath + "ylld/Info.json",
          remoteUrl: base.remotePath + "zxyp/ylld/getDwjsInfo"
        },
        //走访助手
        Zfzs: {
          localUrl: base.localPath + "ylld/Zfzs.json",
          remoteUrl: base.remotePath + "zxyp/ylld/zfzs"
        },
        //推送
        Ts: {
          localUrl: base.localPath + "ylld/Ts.json",
          remoteUrl: base.remotePath + "zxyp/ylld/kchts"
        },
        Zsfx: {
          localUrl: base.localPath + "ylld/Zsfx.json",
          remoteUrl: base.remotePath + "zxyp/ylld/getZsfx"
        },
        Dyqkfx: {
          localUrl: base.localPath + "ylld/Dyqkfx.json",
          remoteUrl: base.remotePath + "zxyp/ylld/getDyqkfx"
        },
        Dyzj: {
          localUrl: base.localPath + "ylld/Dyzj.json",
          remoteUrl: base.remotePath + "zxyp/ylld/getDyzj"
        },
        initMidLeft: {
          localUrl: base.localPath + "ylld/chart.json",
          remoteUrl: base.remotePath + "zxyp/ylld/getMydfxLeft"
        },
        initMidRight: {
          localUrl: base.localPath + "ylld/chart.json",
          remoteUrl: base.remotePath + "zxyp/ylld/getMydfxRight"
        },
        initMid3: {
          localUrl: base.localPath + "ylld/chart.json",
          remoteUrl: base.remotePath + "zxyp/ylld/getSxl"
        },
        initRight1: {
          localUrl: base.localPath + "ylld/Dcybfx.json",
          remoteUrl: base.remotePath + "zxyp/ylld/getDcybfx"
        },
        initRight2: {
          localUrl: base.localPath + "ylld/Jmhd.json",
          remoteUrl: base.remotePath + "zxyp/ylld/getJmhd"
        },
        initRight3: {
          localUrl: base.localPath + "ylld/chart.json",
          remoteUrl: base.remotePath + "zxyp/ylld/getPhb"
        },
        initSelector: {
          localUrl: base.localPath + "ylld/dept.json",
          remoteUrl: base.remotePath + "zxyp/ylld/getPhbDw"
        }
      },
      rx: {
        // 加载树
        Tree: {
          localUrl: base.localPath + "Tree.json",
          remoteUrl: base.remotePath + "zxyp/rx/getDwTree"
        },
        //左上文本
        Txt: {
          localUrl: base.localPath + "jcj/Txt.json",
          remoteUrl: base.remotePath + "zxyp/rx/zbzs"
        },
        //热词
        Tag: {
          localUrl: base.localPath + "jcj/Tag.json",
          remoteUrl: base.remotePath + "zxyp/rx/rc"
        },
        //热线分析
        Rxfx: {
          localUrl: base.localPath + "jcj/Myd.json",
          remoteUrl: base.remotePath + "zxyp/rx/mydAndBdFx"
        },
        //热点事件排行榜
        Rank: {
          localUrl: base.localPath + "rx/Rank.json",
          remoteUrl: base.remotePath + "zxyp/rx/rdsjRank"
        },
        // 群众诉求量
        Qzsql: {
          localUrl: base.localPath + "rx/Chart.json",
          remoteUrl: base.remotePath + "zxyp/rx/sqlTrend"
        },
        // 诉求性质分析
        Sqxz: {
          localUrl: base.localPath + "rx/Chart.json",
          remoteUrl: base.remotePath + "zxyp/rx/sqxzfx"
        },
        // 诉求单位分布
        Sqdwfb: {
          localUrl: base.localPath + "rx/Sqdwfb.json",
          remoteUrl: base.remotePath + "zxyp/rx/sqdwfb"
        },
        // 办事效能分析
        Bsxn: {
          localUrl: base.localPath + "rx/Point.json",
          remoteUrl: base.remotePath + "zxyp/rx/xnfx"
        },
        // 12345工单办理优秀案例
        getYxal: {
          localUrl: base.localPath + "rx/yxal.json",
          remoteUrl: "zxyp/rx/getYxal"
        },
        // 12345工单办理优秀案例弹出页
        getPopupYxal: {
          localUrl: base.localPath + "rx/popupYxal.json",
          remoteUrl: "zxyp/rx/getPopupYxal"
        },
        // 热点专题
        Rdzt: {
          localUrl: base.localPath + "rx/Rdzt.json",
          remoteUrl: base.remotePath + "zxyp/rx/rdzt"
        },
        // 诉求性质分析
        Zhpjzs: {
          localUrl: base.localPath + "aj/hjwtfx.json",
          remoteUrl: base.remotePath + "zxyp/rx/popsqxz"
        },
        // 各单位诉求量及满意度分析
        Myd: {
          localUrl: base.localPath + "jcj/Myd.json",
          remoteUrl: base.remotePath + "zxyp/rx/popdwfx"
        },
        // 群众诉求走势分析
        Qzsqzsgx: {
          localUrl: base.localPath + "jcj/Myd.json",
          remoteUrl: base.remotePath + "zxyp/rx/poptrend"
        },
        popup: {
          getTop: {
            localUrl: base.localPath + "rx/top.json",
            remoteUrl: base.remotePath + "zxyp/rx/popup/getTop"
          },
          getMidLeft: {
            localUrl: base.localPath + "rx/Chart.json",
            remoteUrl: base.remotePath + "zxyp/rx/popup/getMidLeft"
          },
          getMidRightTop: {
            localUrl: base.localPath + "rx/midRightTop.json",
            remoteUrl: base.remotePath + "zxyp/rx/popup/getMidRightTop"
          },
          getMidRight: {
            localUrl: base.localPath + "rx/midRight.json",
            remoteUrl: base.remotePath + "zxyp/rx/popup/getMidRight"
          },
          getBottomLeft: {
            localUrl: base.localPath + "rx/bottomLeft.json",
            remoteUrl: base.remotePath + "zxyp/rx/popup/getBottomLeft"
          },
          getBottomRight: {
            localUrl: base.localPath + "rx/bottomRight.json",
            remoteUrl: base.remotePath + "zxyp/rx/popup/getBottomRight"
          }
        },
        setting: {
          left1: {
            localUrl: base.localPath + "rx/setting/left1.json",
            remoteUrl: base.remotePath + "zxyp/rx/setting/left1"
          },
          left2: {
            localUrl: base.localPath + "rx/setting/left2.json",
            remoteUrl: base.remotePath + "zxyp/rx/setting/left2"
          },
          right1: {
            localUrl: base.localPath + "rx/setting/right1.json",
            remoteUrl: base.remotePath + "zxyp/rx/setting/right1"
          },
          right2: {
            localUrl: base.localPath + "rx/setting/right2.json",
            remoteUrl: base.remotePath + "zxyp/rx/setting/right2"
          },
          addRight1: {
            localUrl: base.localPath + "myzs/success.json",
            remoteUrl: base.remotePath + "zxyp/rx/setting/addRight1"
          },
          deleteRight1: {
            localUrl: base.localPath + "myzs/success.json",
            remoteUrl: base.remotePath + "zxyp/rx/setting/deleteRight1"
          },
          addRight2: {
            localUrl: base.localPath + "myzs/success.json",
            remoteUrl: base.remotePath + "zxyp/rx/setting/addRight2"
          }
        }
      },
      jtsg: {
        // 树结构
        Tree: {
          localUrl: base.localPath + "Tree.json",
          remoteUrl: base.remotePath + "zxyp/jcj/getDwTree"
        },
        // 左上指标
        left1: {
          localUrl: base.localPath + "jtsg/left1.json",
          remoteUrl: base.remotePath + "zxyp/jtsg/getJqAndJtsg"
        },
        // 左下满意度走势分析
        left2: {
          localUrl: base.localPath + "jtsg/left2.json",
          remoteUrl: base.remotePath + "zxyp/jtsg/getMydzsfx"
        },
        // 中1-1交通警情分析
        mid1_1: {
          localUrl: base.localPath + "jtsg/left2.json",
          remoteUrl: base.remotePath + "zxyp/jtsg/getJtjqfx"
        },
        // 中1-2具体问题分析
        mid1_2: {
          localUrl: base.localPath + "jtsg/left2.json",
          remoteUrl: base.remotePath + "zxyp/jtsg/getJtwtfx"
        },
        // 中1-3具体问题单位分布
        mid1_3: {
          localUrl: base.localPath + "jtsg/mid1-3.json",
          remoteUrl: base.remotePath + "zxyp/jtsg/getJtwtdwfb"
        },
        // 中2-1窗口服务满意度
        mid2_1: {
          localUrl: base.localPath + "jtsg/mid2-1.json",
          remoteUrl: base.remotePath + "zxyp/jtsg/getJtsgclzhpj"
        },
        // 中2-2环节问题分析
        mid2_2: {
          localUrl: base.localPath + "jtsg/left2.json",
          remoteUrl: base.remotePath + "zxyp/jtsg/getHjwtfx"
        },
        // 中2-3环节问题单位分布
        mid2_3: {
          localUrl: base.localPath + "jtsg/mid1-3.json",
          remoteUrl: base.remotePath + "zxyp/jtsg/getHjwtdwfx"
        },
        // 右1满意度下滑预警分析
        right1: {
          localUrl: base.localPath + "jtsg/right1.json",
          remoteUrl: base.remotePath + "zxyp/jtsg//getMydxhyj"
        },
        // 右1综合评价排行榜
        right2: {
          localUrl: base.localPath + "jtsg/right2.json",
          remoteUrl: base.remotePath + "zxyp/jtsg/getZhpjphb"
        }
      }
    },
    slhy: {
      pjda: {
        initTop: {
          localUrl: base.localPath + "pjda/initTop.json",
          remoteUrl: base.remotePath + "slhy/pjda/initTop"
        },
        initMid: {
          localUrl: base.localPath + "pjda/initMid.json",
          remoteUrl: base.remotePath + "slhy/pjda/initMid"
        },
        initTimeLine: {
          localUrl: base.localPath + "pjda/initTimeLine.json",
          remoteUrl: base.remotePath + "slhy/pjda/initTimeLine"
        },
        getBottomDetail: {
          localUrl: base.localPath + "pjda/getBottomDetail.json",
          remoteUrl: base.remotePath + "slhy/pjda/getBottomDetail"
        }
      }
    },
    znbg: {
      ywfxbg: {
        submitSetting: {
          // 设置接口
          localUrl: base.localPath + "ywfxbg/submitSetting.json",
          remoteUrl: base.remotePath + "znbg/ywfxbg/submitSetting"
        },
        generateReport: {
          // 生成报告
          localUrl: base.localPath + "ywfxbg/generateReport.json",
          remoteUrl: base.remotePath + "znbg/ywfxbg/generateReport"
        },
        getFileList: {
          // 获取文件列表
          localUrl: base.localPath + "ywfxbg/getFileList.json",
          remoteUrl: base.remotePath + "znbg/ywfxbg/getFileList"
        },
        postImg: {
          localUrl: base.localPath + "ywfxbg/postImg.json",
          remoteUrl: base.remotePath + "znbg/ywfxbg/postImg"
        },
        getJcjPreview: {
          localUrl: base.localPath + "ywfxbg/jcjPreview.json",
          remoteUrl: base.remotePath + "znbg/ywfxbg/getJcjPreview"
        },
        getCkPreview: {
          localUrl: base.localPath + "ywfxbg/ckPreview.json",
          remoteUrl: base.remotePath + "znbg/ywfxbg/getCkPreview"
        },
        getAjPreview: {
          localUrl: base.localPath + "ywfxbg/ajPreview.json",
          remoteUrl: base.remotePath + "znbg/ywfxbg/getAjPreview"
        },
        getRxPreview: {
          localUrl: base.localPath + "ywfxbg/rxPreview.json",
          remoteUrl: base.remotePath + "znbg/ywfxbg/getRxPreview"
        },
        getJtsgPreview: {
          localUrl: base.localPath + "ywfxbg/jtsgPreview.json",
          remoteUrl: base.remotePath + "znbg/ywfxbg/getJtsgPreview"
        },
        getYlldPreview: {
          localUrl: base.localPath + "ywfxbg/ylldPreview.json",
          remoteUrl: base.remotePath + "znbg/ywfxbg/getYlldPreview"
        },
        uploadImg: {
          localUrl: base.localPath + "ywfxbg/uploadImg.json",
          remoteUrl: base.remotePath + "znbg/ywfxbg/uploadImg"
        },
        // 删除报告
        deleteReport: {
          localUrl: base.localPath + "ywfxbg/deleteReport.json",
          remoteUrl: base.remotePath + "znbg/ywfxbg/deleteReport"
        }
      },
      zhfxbg: {
        getLeft: {
          localUrl: base.localPath + "zhfxbg/getLeft.json",
          remoteUrl: base.remotePath + "znbg/zhfxbg/getLeft"
        },
        // 生成报告
        generateReport: {
          localUrl: base.localPath + "zhfxbg/generateReport.json",
          remoteUrl: base.remotePath + "znbg/zhfxbg/generateReport"
        },
        // 获取文件列表
        getFileList: {
          localUrl: base.localPath + "ywfxbg/getFileList.json",
          remoteUrl: base.remotePath + "znbg/zhfxbg/getFileList"
        },
        uploadImg: {
          localUrl: base.localPath + "ywfxbg/uploadImg.json",
          remoteUrl: base.remotePath + "znbg/zhfxbg/uploadImg"
        },
        // 删除报告
        deleteReport: {
          localUrl: base.localPath + "ywfxbg/deleteReport.json",
          remoteUrl: base.remotePath + "znbg/zhfxbg/deleteReport"
        },
        getPreview: {
          localUrl: base.localPath + "zhfxbg/getPreview.json",
          remoteUrl: base.remotePath + "znbg/zhfxbg/getPreview"
        },
        postImg: {
          localUrl: base.localPath + "ywfxbg/postImg.json",
          remoteUrl: base.remotePath + "znbg/zhfxbg/postImg"
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

  // 解析hash值里面的参数
  base.getParam = function(name) {
    let result = {};
    name.replace(/\?(.*)/g, function($1, $2) {
      $2.split("&").map(val => {
        let arr = val.split("=");
        result[arr[0]] = arr[1];
      });
    });
    return result;
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
      headers: { Token: base.identityInfo.token },
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
      error: function(result) {
        if (result.status === 302) {
          sessionStorage.clear();
          location.href = base.isPublished ? "/" : "login.html";
        }
      }
    };
    $.ajax(config);
  };

  // 利用promise请求
  base.request = function(url, data, config) {
    return new Promise((resolve, reject) => {
      let option = {
        url,
        type: "get",
        data,
        success: resolve,
        error: function(result) {
          if (result.status === 302) {
            sessionStorage.clear();
            location.href = base.isPublished ? "/" : "login.html";
          }
          reject(result);
        },
        dataType: "json",
        headers: { Token: base.identityInfo.token },
        traditional: true
      };
      let finalOpt = {};
      Object.assign(finalOpt, option, config);
      finalOpt.url = base.isPublished ? url.remoteUrl : url.localUrl;
      finalOpt.type = base.isPublished ? "post" : "get";
      $.ajax(finalOpt);
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
    $("body").append(
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
  base.renderNav = function($div, pageNum = 1, totalPage = 0, callback) {
    $div.addClass("com-nav");
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

  // 处理最大值和最小值
  base.handleMinAndMax = function(arr = [], isNotPercent) {
    let result = { min: null, max: null };
    if (arr.length > 0) {
      result.min = Number(arr[0]);
      result.max = Number(arr[0]);
      arr.map(val => {
        result.min = Math.min(result.min, Number(val));
        result.max = Math.max(result.max, Number(val));
      });
      let diff = (result.max - result.min) / 2;
      result.min =
        result.min - diff < 0 ? 0 : Number(result.min - diff).toFixed(2);
      result.max = Number(result.max + diff).toFixed(2);
      if (!isNotPercent) {
        result.max = result.max > 100 ? 100 : result.max;
      }
    }
    return result;
  };

  // 处理字符串换行
  base.handleStrLineFeed = function(str = "", perChar = 4) {
    let result = "";
    for (let i = 0, len = str.length; i < len; i++) {
      result += i % perChar == perChar - 1 ? str[i] + "\n" : str[i];
    }
    return result;
  };

  // 获取当前时间并加减固定月份
  base.getDate = function(difference) {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var sum = year * 12 + month + difference;
    var resultYear = parseInt(sum / 12);
    var resultMonth = sum % 12;
    if (resultMonth == 0) {
      return resultYear - 1 + "-12";
    } else {
      resultMonth = resultMonth < 10 ? "0" + resultMonth : resultMonth;
      return resultYear + "-" + resultMonth;
    }
  };

  // 防抖函数
  base.debounce = (fn, wait) => {
    let timeout = null;
    return function() {
      timeout !== null && clearTimeout(timeout);
      timeout = setTimeout(fn, wait);
    };
  };

  // 节流函数
  base.throttle = function(fn, delay) {
    var prev = Date.now();
    return function() {
      var context = this;
      var args = arguments;
      var now = Date.now();
      if (now - prev >= delay) {
        fn.apply(context, args);
        prev = Date.now();
      }
    };
  };

  // 初始化日期控件
  base.initDateInput = (id, date) => {
    $(`#${id}`)
      .val(date)
      .datetimepicker({
        format: "yyyy-mm",
        autoclose: true,
        todayBtn: true,
        startView: "year",
        minView: "year",
        maxView: "decade",
        endDate: base.getDate(-1),
        language: "zh-CN"
      });
  };
  // 初始化查询栏
  base.initSearchBar = ({ date1 = -7, date2 = -1, cb = null }) => {
    return new Promise((resolve, reject) => {
      const $deptTree = $("#dept-tree");
      const $deptName = $("#dept-name");
      const $deptId = $("#dept-id");
      base.request(base.interFaces.rdwt.tree).then(result => {
        //渲染树
        $deptTree.css("width", $deptName.outerWidth()).treeview({
          data: result.data,
          levels: 1,
          onNodeSelected: function(event, node) {
            $deptName.val(node.text);
            $deptId.val(node.id);
            $deptTree.css("visibility", "hidden");
          },
          showCheckbox: false //是否显示多选
        });
      });
      // 为单位名称绑定点击事件
      $("#dept-name").on("click", () => {
        $deptTree.css(
          "visibility",
          $deptTree.css("visibility") === "hidden" ? "visible" : "hidden"
        );
      });
      base.initDateInput("date1", base.getDate(date1));
      base.initDateInput("date2", base.getDate(date2));
      $deptId.val("2014110416460086100000002942");
      $deptName.val("南京市公安局");
      // 绑定查询按钮回调事件
      typeof cb === "function" &&
        $(".search-btn")
          .off()
          .on("click", cb);
      resolve();
    });
  };

  base.initRightMenu = params => {
    window.rightParams = params;
    requirejs(["text!../views/myhc/rightMenu.html"], ele => {
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
