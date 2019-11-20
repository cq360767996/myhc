define(["ec"], function(ec) {
  const remotePath = "../",
    localPath = "./static/json/";
  return {
    // 调试版还是发布版
    isPublished: false,
    // 菜单权限配置文件
    menuConfig: {
      // 交警
      jj: ["myzd", "jcj", "aj", "rx", "ylld", "zhfxbg"],
      // 治安
      za: [
        "myzd",
        "jcj",
        "ckfw",
        "jtsg",
        "rx",
        "ylld",
        "zhzs",
        "pjda",
        "zhfxbg"
      ],
      // 人口
      rk: ["myzd", "jcj", "jtsg", "aj", "rx", "ylld", "zhzs", "pjda", "zhfxbg"],
      // 出入境
      crj: [
        "myzd",
        "jcj",
        "jtsg",
        "aj",
        "rx",
        "ylld",
        "zhzs",
        "pjda",
        "zhfxbg"
      ],
      // 巡特警
      xtj: [
        "myzd",
        "ckfw",
        "jtsg",
        "aj",
        "rx",
        "ylld",
        "zhzs",
        "pjda",
        "zhfxbg"
      ],
      // 刑侦局
      xzj: [
        "myzd",
        "jcj",
        "ckfw",
        "jtsg",
        "rx",
        "ylld",
        "zhzs",
        "pjda",
        "zhfxbg"
      ],
      // 指挥中心
      zhzx: [
        "myzd",
        "ckfw",
        "jtsg",
        "aj",
        "rx",
        "ylld",
        "zhzs",
        "pjda",
        "zhfxbg"
      ],
      // 法制
      fz: ["myzd", "ckfw", "jtsg", "rx", "ylld", "zhzs", "pjda", "zhfxbg"],
      // 督查纪检
      dcjj: ["myzd", "ylld", "zhzs", "pjda", "zhfxbg"],
      // 交警大队
      jjdd: ["myzd", "jcj", "ckfw", "rx", "aj", "ylld", "zhfxbg"],
      // 派出所
      pcs: ["myzd", "rx", "jtsg"],
      // 警务站
      jwz: ["myzd", "jtsg", "rx", "zhfxbg"]
    },
    // 所有接口
    interFaces: {
      common: {
        getDeptTree: {
          localUrl: localPath + "Tree.json",
          remoteUrl: remotePath + "common/getDeptTree"
        }
      },
      myhc: {
        myzs: {
          // 根据单位code获取单位id
          DeptId: { remoteUrl: remotePath + "myhc/myzs/getDwInfo" },
          // 加载左侧数据
          getLeftData: { remoteUrl: remotePath + "myhc/myzs/getLeftData" },
          // 加载右侧中间部分数据
          getRightMidData: {
            remoteUrl: remotePath + "myhc/myzs/getRightMidData"
          },
          // 加载右侧数据
          getRightData: { remoteUrl: remotePath + "myhc/rdwt/getCkRdwtList" },
          // 获取指标组成
          getZbzc: {
            localUrl: localPath + "myzs/pop-zbzs.json",
            remoteUrl: remotePath + "myhc/myzs/getZbzc"
          },
          // 指标展示悬停弹框
          getZbzcDetail: {
            localUrl: localPath + "myzs/pop-zbzs-detail.json",
            remoteUrl: remotePath + "myhc/myzs/getZbzcDetail"
          },
          // 执法公信力走势分析
          getZfgxl: { remoteUrl: remotePath + "myhc/myzs/getZfgxl" },
          // 单位情况
          getDwqk: { remoteUrl: remotePath + "myhc/myzs/getDwqk" },
          // 根据单位id获取单位层级
          getDwLevel: { remoteUrl: remotePath + "myhc/myzs/getDwLevel" },
          // 社会治安满意度调查情况
          getMyd: {
            localUrl: localPath + "myd.json",
            remoteUrl: remotePath + "myhc/myzs/getMyd"
          },
          // 获取数据录入初始化数据
          getSjlr: {
            localUrl: localPath + "myzs/pop1.json",
            remoteUrl: remotePath + "myhc/myzs/getSjlr"
          },
          // 提交数据录入
          submitSjlr: {
            localUrl: localPath + "myzs/success.json",
            remoteUrl: remotePath + "myhc/myzs/submitSjlr"
          },
          // 获取系数配置初始化数据
          getXspz: {
            localUrl: localPath + "myzs/pop2.json",
            remoteUrl: remotePath + "myhc/myzs/getXspz"
          },
          // 重置系数配置
          resetXspz: {
            localUrl: localPath + "myzs/pop2.json",
            remoteUrl: remotePath + "myhc/myzs/resetXspz"
          },
          // 提交系数配置
          submitXspz: {
            localUrl: localPath + "myzs/success.json",
            remoteUrl: remotePath + "myhc/myzs/submitXspz"
          },
          // 获取展示配置初始化数据
          getZspz: {
            localUrl: localPath + "myzs/pop3.json",
            remoteUrl: remotePath + "myhc/myzs/getZspz"
          },
          // 重置展示配置
          resetZspz: {
            localUrl: localPath + "myzs/pop3.json",
            remoteUrl: remotePath + "myhc/myzs/resetZspz"
          },
          // 计算展示配置数据
          calcZspz: {
            localUrl: localPath + "myzs/pop3.json",
            remoteUrl: remotePath + "myhc/myzs/calcZspz"
          },
          // 提交展示配置
          submitZspz: {
            localUrl: localPath + "myzs/success.json",
            remoteUrl: remotePath + "myhc/myzs/submitZspz"
          },
          getPoint: {
            localUrl: localPath + "myzs/success.json",
            remoteUrl: remotePath + "myhc/myzs/getTestJwd"
          },
          getMapData: {
            localUrl: localPath + "myzs/success.json",
            remoteUrl: remotePath + "myhc/myzs/getMapData"
          },
          getPcsZb: {
            localUrl: localPath + "myzs/success.json",
            remoteUrl: remotePath + "myhc/myzs/getPcsZb"
          },
          getDetailMapData: {
            localUrl: localPath + "myzs/success.json",
            remoteUrl: remotePath + "myhc/myzs/getDetailMapData"
          },
          getMapCount: {
            localUrl: localPath + "myzs/success.json",
            remoteUrl: remotePath + "myhc/myzs/getMapCount"
          },
          getMapDataByBounds: {
            localUrl: localPath + "myzs/success.json",
            remoteUrl: remotePath + "myhc/myzs/getMapDataByBounds"
          },
          getCkfw: {
            localUrl: localPath + "myzs/success.json",
            remoteUrl: remotePath + "myhc/myzs/getCkfw"
          },
          getCkMapData: {
            localUrl: localPath + "myzs/success.json",
            remoteUrl: remotePath + "myhc/myzs/getCkMapData"
          },
          getCkfwq: {
            remoteUrl: remotePath + "myhc/myzs/getCkfwq"
          },
          getCkDetail: {
            remoteUrl: remotePath + "myhc/myzs/getCkDetail"
          },
          getPointByCode: {
            remoteUrl: remotePath + "myhc/myzs/getPointByCode"
          },
          getCkRdwtDetail: {
            remoteUrl: remotePath + "myhc/myzs/getCkRdwtDetail"
          },
          getCkfwqDetail: {
            remoteUrl: remotePath + "myhc/myzs/getCkfwqDetail"
          },
          getCkfwqZb: {
            localUrl: localPath + "myzs/getCkfwqZb.json",
            remoteUrl: remotePath + "myhc/myzs/getCkfwqZb"
          },
          getCkfwqRybd: {
            localUrl: localPath + "myzs/getCkfwqRank.json",
            remoteUrl: remotePath + "myhc/myzs/getCkfwqRybd"
          },
          getCkfwqDwbd: {
            localUrl: localPath + "myzs/getCkfwqRank.json",
            remoteUrl: remotePath + "myhc/myzs/getCkfwqDwbd"
          },
          getCkfwqRankPopup: {
            localUrl: localPath + "myzs/getCkfwqRankPopup.json",
            remoteUrl: remotePath + "myhc/myzs/getCkfwqRankPopup"
          },
          getBmfwq: {
            localUrl: localPath + "myzs/getBmfwq.json",
            remoteUrl: remotePath + "myhc/myzs/getBmfwq"
          },
          getYlldMapData: {
            localUrl: localPath + "myzs/getBmfwq.json",
            remoteUrl: remotePath + "myhc/myzs/getYlldMapData"
          },
          getYlldMapRight1: {
            localUrl: localPath + "myzs/getBmfwq.json",
            remoteUrl: remotePath + "myhc/myzs/getYlldMapRight1"
          },
          getYlldMapRight2: {
            localUrl: localPath + "myzs/getBmfwq.json",
            remoteUrl: remotePath + "myhc/myzs/getYlldMapRight2"
          },
          getYlldMapRight3: {
            localUrl: localPath + "myzs/getBmfwq.json",
            remoteUrl: remotePath + "myhc/myzs/getYlldMapRight3"
          },
          getYlldMapRight4: {
            localUrl: localPath + "myzs/getBmfwq.json",
            remoteUrl: remotePath + "myhc/myzs/getYlldMapRight4"
          },
          getYlldDetailMapData: {
            localUrl: localPath + "myzs/getBmfwq.json",
            remoteUrl: remotePath + "myhc/myzs/getYlldDetailMapData"
          },
          getYlldPcsData: {
            localUrl: localPath + "myzs/getBmfwq.json",
            remoteUrl: remotePath + "myhc/myzs/getYlldPcsData"
          },
          getYlldDetailMapDataByBound: {
            localUrl: localPath + "myzs/getBmfwq.json",
            remoteUrl: remotePath + "myhc/myzs/getYlldDetailMapDataByBound"
          },
          getYlldRdsjByBound: {
            localUrl: localPath + "myzs/getBmfwq.json",
            remoteUrl: remotePath + "myhc/myzs/getYlldRdsjByBound"
          }
        },
        myjz: {
          //民意矩阵中间数据
          List: {
            localUrl: localPath + "List.json",
            remoteUrl: remotePath + "myhc/myjz/getMyjz"
          },
          //查询栏日期默认值
          Date: {
            localUrl: localPath + "Date.json",
            remoteUrl: remotePath + "myhc/myjz/getRecentDate"
          },
          //极坐标弹窗接口
          Window1: {
            localUrl: localPath + "Window1.json",
            remoteUrl: remotePath + "myhc/myjz/getMyjzDialogData"
          },
          //环形图弹窗接口
          Window2: {
            localUrl: localPath + "Window2.json",
            remoteUrl: remotePath + "myhc/myjz/getMyjzDialogData"
          },
          //雷达图弹窗接口
          Window3: {
            localUrl: localPath + "Window3.json",
            remoteUrl: remotePath + "myhc/myjz/getMyjzDialogData"
          },
          //部门列表
          bmList: {
            localUrl: localPath + "bmList.json",
            remoteUrl: remotePath + "myhc/myjz/getMyjz"
          }
        },
        dwjx: {
          //初始化标签
          Tab: {
            localUrl: localPath + "Tab.json",
            remoteUrl: remotePath + "myhc/dwjx/getNavigor"
          },
          //初始化标签
          Chart: {
            localUrl: localPath + "Chart.json",
            remoteUrl: remotePath + "myhc/dwjx/getChartData"
          },
          //二级标签
          Tab2: {
            localUrl: localPath + "Tab2.json",
            remoteUrl: remotePath + "myhc/dwjx/getNavigor"
          },
          //标红功能
          Keywords: {
            localUrl: localPath + "Keywords.json",
            remoteUrl: remotePath + "myhc/dwjx/search"
          },
          //可操作图表
          TopChart: {
            localUrl: localPath + "TopChart.json",
            remoteUrl: remotePath + "myhc/dwjx/getNavigor"
          },
          //其他图标数据
          OtherCharts: {
            localUrl: localPath + "OtherCharts.json",
            remoteUrl: remotePath + "myhc/dwjx/getChartData"
          }
        },
        myys: {
          //民意热词
          HotWords: {
            localUrl: localPath + "HotWords.json",
            remoteUrl: remotePath + "myhc/myys/getReSouList"
          },
          //查询列表
          DataList: {
            localUrl: localPath + "DataList.json",
            remoteUrl: remotePath + "myhc/myys/search"
          },
          esSearch: {
            localUrl: localPath + "esSearch.json",
            remoteUrl: remotePath + "myhc/myys/esSearch"
          },
          //详情
          Detail: {
            localUrl: localPath + "Detail.json",
            remoteUrl: remotePath + "myhc/myys/getDetail"
          },
          // 弹出详细信息
          PopDetail: {
            localUrl: localPath + "getPopDetail.json",
            remoteUrl: remotePath + "myhc/myys/getPopDetail"
          },
          //详情表格
          Grid: {
            localUrl: localPath + "Grid.json",
            remoteUrl: remotePath + "myhc/myys/getGrid"
          },
          //详情表格
          saveKeyWord: {
            localUrl: localPath + "Grid.json",
            remoteUrl: remotePath + "myhc/myys/saveKeyWord"
          }
        },
        rdwt: {
          getMidData: {
            localUrl: localPath + "rdwt/midData.json",
            remoteUrl: remotePath + "myhc/rdwt/getRdwtList"
          },
          getChart1: {
            localUrl: localPath + "ylld/chart.json",
            remoteUrl: remotePath + "myhc/rdwt/getTrend"
          },
          getChart2: {
            localUrl: localPath + "ylld/chart.json",
            remoteUrl: remotePath + "myhc/rdwt/getSqxz"
          },
          getChart3: {
            localUrl: localPath + "ylld/chart.json",
            remoteUrl: remotePath + "myhc/rdwt/getWt"
          },
          getChart4: {
            localUrl: localPath + "ylld/chart.json",
            remoteUrl: remotePath + "myhc/rdwt/getDwfb"
          },
          getLeft: {
            localUrl: localPath + "rdwt/left.json",
            remoteUrl: remotePath + "myhc/rdwt/getTableData"
          },
          getRight: {
            localUrl: localPath + "rdwt/right.json",
            remoteUrl: remotePath + "myhc/rdwt/getSelectedTableData"
          },
          getPreview: {
            localUrl: localPath + "rdwt/preview.json",
            remoteUrl: remotePath + "myhc/rdwt/preview"
          },
          publish: {
            localUrl: localPath + "rdwt/publish.json",
            remoteUrl: remotePath + "myhc/rdwt/publish"
          },
          getPopMenu: {
            localUrl: localPath + "rdwt/tags.json",
            remoteUrl: remotePath + "myhc/rdwt/getTags"
          },
          // 获取接处警数据
          getJcj: {
            localUrl: localPath + "rdwt/jcj.json",
            remoteUrl: remotePath + "myhc/rdwt/ranking"
          },
          // 获取窗口服务数据
          getCkfw: {
            localUrl: localPath + "rdwt/jcj.json",
            remoteUrl: remotePath + "myhc/rdwt/ranking"
          },
          // 获取案件数据
          getAj: {
            localUrl: localPath + "rdwt/jcj.json",
            remoteUrl: remotePath + "myhc/rdwt/ranking"
          },
          // 获取社区民警熟悉率数据
          getMjsxl: {
            localUrl: localPath + "rdwt/sxl.json",
            remoteUrl: remotePath + "myhc/rdwt/ranking"
          }
        },
        myzd: {
          getCount: {
            localUrl: localPath + "myzd/getCount.json",
            remoteUrl: remotePath + "myhc/myzd/getSummary"
          },
          getLeft1: {
            localUrl: localPath + "chartTemplate.json",
            remoteUrl: remotePath + "myhc/myzd/getLeft1"
          },
          getLeft2: {
            localUrl: localPath + "chartTemplate.json",
            remoteUrl: remotePath + "myhc/myzd/getLeft2"
          },
          getMid1: {
            localUrl: localPath + "myzd/mid1.json",
            remoteUrl: remotePath + "myhc/myzd/getMid1"
          },
          getMid2: {
            localUrl: localPath + "chartTemplate.json",
            remoteUrl: remotePath + "myhc/myzd/getMid2"
          },
          getMid3: {
            localUrl: localPath + "chartTemplate.json",
            remoteUrl: remotePath + "myhc/myzd/getMid3"
          },
          getRight1: {
            localUrl: localPath + "chartTemplate.json",
            remoteUrl: remotePath + "myhc/myzd/getRight1"
          },
          getRight2: {
            localUrl: localPath + "jcj/Tag.json",
            remoteUrl: remotePath + "myhc/myzd/getRight2"
          }
        }
      },
      zxyp: {
        aj: {
          getZbzs: {
            localUrl: localPath + "aj/zbzs.json",
            remoteUrl: remotePath + "zxyp/aj/zbzs"
          }, // 加载指标展示
          getHfrc: {
            localUrl: localPath + "aj/hfrc.json",
            remoteUrl: remotePath + "zxyp/aj/hfrc"
          }, // 加载热词
          getZhpjzsfxTrend: {
            localUrl: localPath + "aj/zhpjzsfxTrend.json",
            remoteUrl: remotePath + "zxyp/aj/zhpjzsfxTrend"
          }, // 加载趋势分析
          getZhpjzsfx: {
            localUrl: localPath + "aj/zhpjzsfx.json",
            remoteUrl: remotePath + "zxyp/aj/zhpjzsfx"
          }, // 加载案件综合评价指数分析
          getHjwtfx: {
            localUrl: localPath + "aj/hjwtfx.json",
            remoteUrl: remotePath + "zxyp/aj/hjwtfx"
          }, // 加载环节问题分析
          getAjdwfb: {
            localUrl: localPath + "aj/ajdwfb.json",
            remoteUrl: remotePath + "zxyp/aj/ajdwfb"
          }, // 加载案件问题单位分布
          getAjbljtwtfx: {
            localUrl: localPath + "aj/ajbljtwtfx.json",
            remoteUrl: remotePath + "zxyp/aj/ajbljtwtfx"
          }, // 加载办案小助手-案件办理具体问题分析
          getZxfxpjzs: {
            localUrl: localPath + "aj/zxfxpjzs.json",
            remoteUrl: remotePath + "zxyp/aj/zxfxpjzs"
          }, // 加载专项分析评价指数
          getZsmyb: {
            localUrl: localPath + "aj/zsmyb.json",
            remoteUrl: remotePath + "zxyp/aj/zsmyb"
          }, // 加载案件办理综合评价指数满意榜
          getZxfxzhpjzs: {
            localUrl: localPath + "aj/zxfxzhpjzs.json",
            remoteUrl: remotePath + "zxyp/aj/zxfxzhpjzs"
          }, // 加载弹出框案件综合评价指数分析分析
          getZxgf: {
            localUrl: localPath + "aj/zxgf.json",
            remoteUrl: remotePath + "zxyp/aj/zxgf"
          } // 加载执行规范
        },
        jcj: {
          //左上文本
          Txt: {
            localUrl: localPath + "jcj/Txt.json",
            remoteUrl: remotePath + "zxyp/jcj/zbzs"
          },
          //知识库
          Zsk: {
            localUrl: localPath + "jcj/Zsk.json",
            remoteUrl: remotePath + "zxyp/jcj/zsk"
          },
          //下滑预警
          Xhyj: {
            localUrl: localPath + "jcj/Xhyj.json",
            remoteUrl: remotePath + "zxyp/jcj/xhyjfx"
          },
          //排行榜
          Rank: {
            localUrl: localPath + "jcj/Rank.json",
            remoteUrl: remotePath + "zxyp/jcj/jcjmydrank"
          },
          //标签云
          Tag: {
            localUrl: localPath + "jcj/Tag.json",
            remoteUrl: remotePath + "zxyp/jcj/rcfx"
          },
          //满意度
          Myd: {
            localUrl: localPath + "jcj/Myd.json",
            remoteUrl: remotePath + "zxyp/jcj/jcjmydfxTrend"
          },
          //单位情况
          Dwqk: {
            localUrl: localPath + "jcj/Dwqk.json",
            remoteUrl: remotePath + "zxyp/jcj/jcjdwqk"
          },
          //雷达图1
          Rador1: {
            localUrl: localPath + "jcj/Rador.json",
            remoteUrl: remotePath + "zxyp/jcj/jcjmydfx"
          },
          //雷达图2
          Rador2: {
            localUrl: localPath + "jcj/Rador.json",
            remoteUrl: remotePath + "zxyp/jcj/jcjmydsdfx"
          },
          //警情分析
          Jqfx: {
            localUrl: localPath + "jcj/Jqfx.json",
            remoteUrl: remotePath + "zxyp/jcj/jqfx"
          },
          //环节问题
          Hjwt: {
            localUrl: localPath + "jcj/Jqfx.json",
            remoteUrl: remotePath + "zxyp/jcj/jqjtwtfx"
          },
          //问题单位
          Wtdw: {
            localUrl: localPath + "jcj/Wtdw.json",
            remoteUrl: remotePath + "zxyp/jcj/jqjtwtdwfx"
          },
          //警情类型
          Jqlx: {
            localUrl: localPath + "jcj/Jqlx.json",
            remoteUrl: remotePath + "zxyp/jcj/jcjjqlxsd"
          },
          //视频
          Video: {
            localUrl: localPath + "jcj/Video.json",
            remoteUrl: remotePath + "zxyp/jcj/videoList"
          },
          //弹窗民警信息
          User: {
            localUrl: localPath + "jcj/User.json",
            remoteUrl: remotePath + "zxyp/jcj/mjxx"
          },
          //弹窗标签云
          Tag2: {
            localUrl: localPath + "jcj/Tag.json",
            remoteUrl: remotePath + "zxyp/jcj/mjcy"
          },
          //弹窗折线图
          Line: {
            localUrl: localPath + "ylld/Ylld.json",
            remoteUrl: remotePath + "zxyp/jcj/cjtsfx"
          },
          //弹窗雷达-左
          Rador3: {
            localUrl: localPath + "jcj/Rador.json",
            remoteUrl: remotePath + "zxyp/jcj/jcjmydfx"
          },
          //弹窗雷达-右
          Rador4: {
            localUrl: localPath + "jcj/Rador.json",
            remoteUrl: remotePath + "zxyp/jcj/jcjmydsdfx"
          },
          // 一般工单量走势分析
          getGdzsgx: {
            localUrl: localPath + "rx/Chart.json",
            remoteUrl: remotePath + "zxyp/jcj/getGdzsgx"
          },
          // 一般工单业务分析
          getGdywfx: {
            localUrl: localPath + "rx/Chart.json",
            remoteUrl: remotePath + "zxyp/jcj/getGdywfx"
          },
          // 一般工单各单位情况
          getGddwfb: {
            localUrl: localPath + "rx/Sqdwfb.json",
            remoteUrl: remotePath + "zxyp/jcj/getGddwfb"
          }
        },
        ckfw: {
          //左上文本
          Txt: {
            localUrl: localPath + "jcj/Txt.json",
            remoteUrl: remotePath + "zxyp/ckfw/zbzs"
          },
          //满意度走势
          Myd: {
            localUrl: localPath + "jcj/Myd.json",
            remoteUrl: remotePath + "zxyp/ckfw/ckfwmydtrend"
          },
          //单位情况
          Dwqk: {
            localUrl: localPath + "jcj/Dwqk.json",
            remoteUrl: remotePath + "zxyp/ckfw/ckfwmyddwqk"
          },
          //雷达图
          Rador: {
            localUrl: localPath + "jcj/Rador.json",
            remoteUrl: remotePath + "zxyp/ckfw/ckfwmydfx"
          },
          //具体问题
          Jtwt: {
            localUrl: localPath + "jcj/Jqfx.json",
            remoteUrl: remotePath + "zxyp/ckfw/ckfwjtwtfx"
          },
          //案件问题
          Ajwt: {
            localUrl: localPath + "ckfw/Ajwt.json",
            remoteUrl: remotePath + "zxyp/ckfw/ajwtdwfx"
          },
          //排行榜按钮
          Menu: {
            localUrl: localPath + "ckfw/Menu.json",
            remoteUrl: remotePath + "zxyp/ckfw/mydrankbutton"
          },
          //排行榜
          Rank: {
            localUrl: localPath + "ckfw/Rank.json",
            remoteUrl: remotePath + "zxyp/ckfw/mydrankmenu"
          },
          //中上文本
          Yw: {
            localUrl: localPath + "ckfw/Yw.json",
            remoteUrl: remotePath + "zxyp/ckfw/flzbzs"
          },
          //词云
          Tag: {
            localUrl: localPath + "jcj/Tag.json",
            remoteUrl: remotePath + "zxyp/ckfw/rcfx"
          },
          //问题预测
          Ckfw: {
            localUrl: localPath + "ckfw/Ckfw.json",
            remoteUrl: remotePath + "zxyp/ckfw/ckfwwtyc"
          },
          // 一般工单量走势分析
          getGdzsgx: {
            localUrl: localPath + "rx/Chart.json",
            remoteUrl: remotePath + "zxyp/ckfw/getGdzsgx"
          },
          // 一般工单业务分析
          getGdywfx: {
            localUrl: localPath + "rx/Chart.json",
            remoteUrl: remotePath + "zxyp/ckfw/getGdywfx"
          },
          // 一般工单各单位情况
          getGddwfb: {
            localUrl: localPath + "rx/Sqdwfb.json",
            remoteUrl: remotePath + "zxyp/ckfw/getGddwfb"
          }
        },
        ylld: {
          //左上文本
          Txt: {
            localUrl: localPath + "ylld/Txt.json",
            remoteUrl: remotePath + "zxyp/ylld/zbzs"
          },
          //排行榜
          Rank: {
            localUrl: localPath + "ylld/Rank.json",
            remoteUrl: remotePath + "zxyp/ylld/zjjml"
          },
          //社会治安满意度
          Shza: {
            localUrl: localPath + "ckfw/Ckfw.json",
            remoteUrl: remotePath + "zxyp/ylld/jtwt"
          },
          //单位情况分析
          Rdfx: {
            localUrl: localPath + "ylld/Rdfx.json",
            remoteUrl: remotePath + "zxyp/ylld/dwqkfx"
          },
          //一率两度走势
          Ylld: {
            localUrl: localPath + "ylld/Ylld.json",
            remoteUrl: remotePath + "zxyp/ylld/ylldTrend"
          },
          //多维解析-左
          Dwjxz: {
            localUrl: localPath + "jcj/Jqfx.json",
            remoteUrl: remotePath + "zxyp/ylld/getDwjs"
          },
          //多维解析-右
          Info: {
            localUrl: localPath + "ylld/Info.json",
            remoteUrl: remotePath + "zxyp/ylld/getDwjsInfo"
          },
          //走访助手
          Zfzs: {
            localUrl: localPath + "ylld/Zfzs.json",
            remoteUrl: remotePath + "zxyp/ylld/zfzs"
          },
          //推送
          Ts: {
            localUrl: localPath + "ylld/Ts.json",
            remoteUrl: remotePath + "zxyp/ylld/kchts"
          },
          Zsfx: {
            localUrl: localPath + "ylld/Zsfx.json",
            remoteUrl: remotePath + "zxyp/ylld/getZsfx"
          },
          Dyqkfx: {
            localUrl: localPath + "ylld/Dyqkfx.json",
            remoteUrl: remotePath + "zxyp/ylld/getDyqkfx"
          },
          Dyzj: {
            localUrl: localPath + "ylld/Dyzj.json",
            remoteUrl: remotePath + "zxyp/ylld/getDyzj"
          },
          initMidLeft: {
            localUrl: localPath + "ylld/chart.json",
            remoteUrl: remotePath + "zxyp/ylld/getMydfxLeft"
          },
          initMidRight: {
            localUrl: localPath + "ylld/chart.json",
            remoteUrl: remotePath + "zxyp/ylld/getMydfxRight"
          },
          initMid3: {
            localUrl: localPath + "ylld/chart.json",
            remoteUrl: remotePath + "zxyp/ylld/getSxl"
          },
          initRight1: {
            localUrl: localPath + "ylld/Dcybfx.json",
            remoteUrl: remotePath + "zxyp/ylld/getDcybfx"
          },
          initRight2: {
            localUrl: localPath + "ylld/Jmhd.json",
            remoteUrl: remotePath + "zxyp/ylld/getJmhd"
          },
          initRight3: {
            localUrl: localPath + "ylld/chart.json",
            remoteUrl: remotePath + "zxyp/ylld/getPhb"
          },
          initSelector: {
            localUrl: localPath + "ylld/dept.json",
            remoteUrl: remotePath + "zxyp/ylld/getPhbDw"
          }
        },
        rx: {
          //左上文本
          Txt: {
            localUrl: localPath + "jcj/Txt.json",
            remoteUrl: remotePath + "zxyp/rx/zbzs"
          },
          //热词
          Tag: {
            localUrl: localPath + "jcj/Tag.json",
            remoteUrl: remotePath + "zxyp/rx/rc"
          },
          //热线分析
          Rxfx: {
            localUrl: localPath + "jcj/Myd.json",
            remoteUrl: remotePath + "zxyp/rx/mydAndBdFx"
          },
          //热点事件排行榜
          Rank: {
            localUrl: localPath + "rx/Rank.json",
            remoteUrl: remotePath + "zxyp/rx/rdsjRank"
          },
          // 群众诉求量
          Qzsql: {
            localUrl: localPath + "rx/Chart.json",
            remoteUrl: remotePath + "zxyp/rx/sqlTrend"
          },
          // 诉求性质分析
          Sqxz: {
            localUrl: localPath + "rx/Chart.json",
            remoteUrl: remotePath + "zxyp/rx/sqxzfx"
          },
          // 诉求单位分布
          Sqdwfb: {
            localUrl: localPath + "rx/Sqdwfb.json",
            remoteUrl: remotePath + "zxyp/rx/sqdwfb"
          },
          // 办事效能分析
          Bsxn: {
            localUrl: localPath + "rx/Point.json",
            remoteUrl: remotePath + "zxyp/rx/xnfx"
          },
          // 12345工单办理优秀案例
          getYxal: {
            localUrl: localPath + "rx/yxal.json",
            remoteUrl: "zxyp/rx/getYxal"
          },
          // 12345工单办理优秀案例弹出页
          getPopupYxal: {
            localUrl: localPath + "rx/popupYxal.json",
            remoteUrl: "zxyp/rx/getPopupYxal"
          },
          // 热点专题
          Rdzt: {
            localUrl: localPath + "rx/Rdzt.json",
            remoteUrl: remotePath + "zxyp/rx/rdzt"
          },
          // 诉求性质分析
          Zhpjzs: {
            localUrl: localPath + "aj/hjwtfx.json",
            remoteUrl: remotePath + "zxyp/rx/popsqxz"
          },
          // 各单位诉求量及满意度分析
          Myd: {
            localUrl: localPath + "jcj/Myd.json",
            remoteUrl: remotePath + "zxyp/rx/popdwfx"
          },
          // 群众诉求走势分析
          Qzsqzsgx: {
            localUrl: localPath + "jcj/Myd.json",
            remoteUrl: remotePath + "zxyp/rx/poptrend"
          },
          popup: {
            getTop: {
              localUrl: localPath + "rx/top.json",
              remoteUrl: remotePath + "zxyp/rx/popup/getTop"
            },
            getMidLeft: {
              localUrl: localPath + "rx/Chart.json",
              remoteUrl: remotePath + "zxyp/rx/popup/getMidLeft"
            },
            getMidRightTop: {
              localUrl: localPath + "rx/midRightTop.json",
              remoteUrl: remotePath + "zxyp/rx/popup/getMidRightTop"
            },
            getMidRight: {
              localUrl: localPath + "rx/midRight.json",
              remoteUrl: remotePath + "zxyp/rx/popup/getMidRight"
            },
            getBottomLeft: {
              localUrl: localPath + "rx/bottomLeft.json",
              remoteUrl: remotePath + "zxyp/rx/popup/getBottomLeft"
            },
            getBottomRight: {
              localUrl: localPath + "rx/bottomRight.json",
              remoteUrl: remotePath + "zxyp/rx/popup/getBottomRight"
            }
          },
          setting: {
            left1: {
              localUrl: localPath + "rx/setting/left1.json",
              remoteUrl: remotePath + "zxyp/rx/setting/left1"
            },
            left2: {
              localUrl: localPath + "rx/setting/left2.json",
              remoteUrl: remotePath + "zxyp/rx/setting/left2"
            },
            right1: {
              localUrl: localPath + "rx/setting/right1.json",
              remoteUrl: remotePath + "zxyp/rx/setting/right1"
            },
            right2: {
              localUrl: localPath + "rx/setting/right2.json",
              remoteUrl: remotePath + "zxyp/rx/setting/right2"
            },
            addRight1: {
              localUrl: localPath + "myzs/success.json",
              remoteUrl: remotePath + "zxyp/rx/setting/addRight1"
            },
            deleteRight1: {
              localUrl: localPath + "myzs/success.json",
              remoteUrl: remotePath + "zxyp/rx/setting/deleteRight1"
            },
            addRight2: {
              localUrl: localPath + "myzs/success.json",
              remoteUrl: remotePath + "zxyp/rx/setting/addRight2"
            }
          }
        },
        jtsg: {
          // 左上指标
          left1: {
            localUrl: localPath + "jtsg/left1.json",
            remoteUrl: remotePath + "zxyp/jtsg/getJqAndJtsg"
          },
          // 左下满意度走势分析
          left2: {
            localUrl: localPath + "jtsg/left2.json",
            remoteUrl: remotePath + "zxyp/jtsg/getMydzsfx"
          },
          // 中1-1交通警情分析
          mid1_1: {
            localUrl: localPath + "jtsg/left2.json",
            remoteUrl: remotePath + "zxyp/jtsg/getJtjqfx"
          },
          // 中1-2具体问题分析
          mid1_2: {
            localUrl: localPath + "jtsg/left2.json",
            remoteUrl: remotePath + "zxyp/jtsg/getJtwtfx"
          },
          // 中1-3具体问题单位分布
          mid1_3: {
            localUrl: localPath + "jtsg/mid1-3.json",
            remoteUrl: remotePath + "zxyp/jtsg/getJtwtdwfb"
          },
          // 中2-1窗口服务满意度
          mid2_1: {
            localUrl: localPath + "jtsg/mid2-1.json",
            remoteUrl: remotePath + "zxyp/jtsg/getJtsgclzhpj"
          },
          // 中2-2环节问题分析
          mid2_2: {
            localUrl: localPath + "jtsg/left2.json",
            remoteUrl: remotePath + "zxyp/jtsg/getHjwtfx"
          },
          // 中2-3环节问题单位分布
          mid2_3: {
            localUrl: localPath + "jtsg/mid1-3.json",
            remoteUrl: remotePath + "zxyp/jtsg/getHjwtdwfx"
          },
          // 右1满意度下滑预警分析
          right1: {
            localUrl: localPath + "jtsg/right1.json",
            remoteUrl: remotePath + "zxyp/jtsg//getMydxhyj"
          },
          // 右1综合评价排行榜
          right2: {
            localUrl: localPath + "jtsg/right2.json",
            remoteUrl: remotePath + "zxyp/jtsg/getZhpjphb"
          }
        }
      },
      slhy: {
        pjda: {
          initTop: {
            localUrl: localPath + "pjda/initTop.json",
            remoteUrl: remotePath + "slhy/pjda/initTop"
          },
          initMid: {
            localUrl: localPath + "pjda/initMid.json",
            remoteUrl: remotePath + "slhy/pjda/initMid"
          },
          initTimeLine: {
            localUrl: localPath + "pjda/initTimeLine.json",
            remoteUrl: remotePath + "slhy/pjda/initTimeLine"
          },
          getBottomDetail: {
            localUrl: localPath + "pjda/getBottomDetail.json",
            remoteUrl: remotePath + "slhy/pjda/getBottomDetail"
          }
        }
      },
      znbg: {
        ywfxbg: {
          submitSetting: {
            // 设置接口
            localUrl: localPath + "ywfxbg/submitSetting.json",
            remoteUrl: remotePath + "znbg/ywfxbg/submitSetting"
          },
          generateReport: {
            // 生成报告
            localUrl: localPath + "ywfxbg/generateReport.json",
            remoteUrl: remotePath + "znbg/ywfxbg/generateReport"
          },
          getFileList: {
            // 获取文件列表
            localUrl: localPath + "ywfxbg/getFileList.json",
            remoteUrl: remotePath + "znbg/ywfxbg/getFileList"
          },
          postImg: {
            localUrl: localPath + "ywfxbg/postImg.json",
            remoteUrl: remotePath + "znbg/ywfxbg/postImg"
          },
          getJcjPreview: {
            localUrl: localPath + "ywfxbg/jcjPreview.json",
            remoteUrl: remotePath + "znbg/ywfxbg/getJcjPreview"
          },
          getCkPreview: {
            localUrl: localPath + "ywfxbg/ckPreview.json",
            remoteUrl: remotePath + "znbg/ywfxbg/getCkPreview"
          },
          getAjPreview: {
            localUrl: localPath + "ywfxbg/ajPreview.json",
            remoteUrl: remotePath + "znbg/ywfxbg/getAjPreview"
          },
          getRxPreview: {
            localUrl: localPath + "ywfxbg/rxPreview.json",
            remoteUrl: remotePath + "znbg/ywfxbg/getRxPreview"
          },
          getJtsgPreview: {
            localUrl: localPath + "ywfxbg/jtsgPreview.json",
            remoteUrl: remotePath + "znbg/ywfxbg/getJtsgPreview"
          },
          getYlldPreview: {
            localUrl: localPath + "ywfxbg/ylldPreview.json",
            remoteUrl: remotePath + "znbg/ywfxbg/getYlldPreview"
          },
          uploadImg: {
            localUrl: localPath + "ywfxbg/uploadImg.json",
            remoteUrl: remotePath + "znbg/ywfxbg/uploadImg"
          },
          // 删除报告
          deleteReport: {
            localUrl: localPath + "ywfxbg/deleteReport.json",
            remoteUrl: remotePath + "znbg/ywfxbg/deleteReport"
          }
        },
        zhfxbg: {
          getLeft: {
            localUrl: localPath + "zhfxbg/getLeft.json",
            remoteUrl: remotePath + "znbg/zhfxbg/getLeft"
          },
          // 生成报告
          generateReport: {
            localUrl: localPath + "zhfxbg/generateReport.json",
            remoteUrl: remotePath + "znbg/zhfxbg/generateReport"
          },
          // 获取文件列表
          getFileList: {
            localUrl: localPath + "ywfxbg/getFileList.json",
            remoteUrl: remotePath + "znbg/zhfxbg/getFileList"
          },
          uploadImg: {
            localUrl: localPath + "ywfxbg/uploadImg.json",
            remoteUrl: remotePath + "znbg/zhfxbg/uploadImg"
          },
          // 删除报告
          deleteReport: {
            localUrl: localPath + "ywfxbg/deleteReport.json",
            remoteUrl: remotePath + "znbg/zhfxbg/deleteReport"
          },
          getPreview: {
            localUrl: localPath + "zhfxbg/getPreview.json",
            remoteUrl: remotePath + "znbg/zhfxbg/getPreview"
          },
          postImg: {
            localUrl: localPath + "ywfxbg/postImg.json",
            remoteUrl: remotePath + "znbg/zhfxbg/postImg"
          }
        }
      },
      system: {
        user: {
          query: {
            localUrl: localPath + "user/getUserList.json",
            remoteUrl: remotePath + "system/user/getUserList"
          },
          detele: {
            localUrl: remotePath + "user/deleteUser",
            remoteUrl: remotePath + "system/user/deleteUser"
          },
          addUser: {
            localUrl: remotePath + "user/addUser",
            remoteUrl: remotePath + "system/user/addUser"
          },
          resetPassword: {
            localUrl: remotePath + "user/resetPassword",
            remoteUrl: remotePath + "system/user/resetPassword"
          },
          getRole: {
            localUrl: localPath + "user/getRole.json",
            remoteUrl: remotePath + "system/user/getRole"
          },
          submitRole: {
            localUrl: remotePath + "user/submitRole",
            remoteUrl: remotePath + "system/user/submitRole"
          },
          getDeptTree: {
            localUrl: localPath + "Tree.json",
            remoteUrl: remotePath + "system/user/getDeptTree"
          }
        },
        notification: {
          getTree: {
            localUrl: localPath + "Tree.json",
            remoteUrl: remotePath + "system/notification/getTree"
          },
          getAll: {
            localUrl: localPath + "user/alert/getAll.json",
            remoteUrl: remotePath + "system/notification/getAll"
          },
          submit: {
            localUrl: localPath + "200.json",
            remoteUrl: remotePath + "system/notification/submit"
          },
          getDetail: {
            localUrl: localPath + "user/alert/getDetail.json",
            remoteUrl: remotePath + "system/notification/getDetail"
          },
          delete: {
            localUrl: localPath + "200.json",
            remoteUrl: remotePath + "system/notification/delete"
          },
          send: {
            localUrl: localPath + "200.json",
            remoteUrl: remotePath + "system/notification/send"
          }
        }
      }
    },
    getUrlParam(name) {
      var str = window.location.hash.substring(
        window.location.hash.indexOf(name) + name.length + 1,
        window.location.hash.length
      );
      return decodeURI(str);
    },
    // 解析hash值里面的参数
    getParam(name) {
      let result = {};
      name.replace(/\?(.*)/g, function($1, $2) {
        $2.split("&").map(val => {
          let arr = val.split("=");
          result[arr[0]] = arr[1];
        });
      });
      return result;
    },
    requestJson(urlOrInterfaceObj, callBack) {
      var url,
        currentPage = window.location.hash;
      if (typeof urlOrInterfaceObj.url == "string") {
        url = urlOrInterfaceObj.url;
      } else {
        url = this.isPublished
          ? urlOrInterfaceObj.url.remoteUrl
          : urlOrInterfaceObj.url.localUrl;
      }
      if (!this.isPublished) {
        urlOrInterfaceObj.type = "GET";
      }
      var config = {
        type: urlOrInterfaceObj.type,
        url: url,
        data: urlOrInterfaceObj.data,
        dataType: "json",
        async: urlOrInterfaceObj.async ? urlOrInterfaceObj.async : false,
        traditional: true,
        headers: { Token: this.identityInfo.token },
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
            location.href = this.isPublished ? "/" : "login.html";
          }
        }
      };
      $.ajax(config);
    },
    // 利用promise请求
    request(url, data, config) {
      return new Promise((resolve, reject) => {
        let option = {
          url,
          type: "get",
          data,
          success: resolve,
          error: function(result) {
            if (result.status === 302) {
              sessionStorage.clear();
              location.href = this.isPublished ? "/" : "login.html";
            }
            reject(result);
          },
          dataType: "json",
          headers: { Token: this.identityInfo.token },
          traditional: true
        };
        let finalOpt = {};
        Object.assign(finalOpt, option, config);
        finalOpt.url = this.isPublished ? url.remoteUrl : url.localUrl;
        finalOpt.type = this.isPublished ? "post" : "get";
        $.ajax(finalOpt);
      });
    },
    showDialog(option) {
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
    },
    // 带有标题的弹出框
    renderDialog(option) {
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
    },
    // 提示框组件
    showMessage(msg, type) {
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
    },
    // 分页组件
    renderNav($div, pageNum = 1, totalPage = 0, callback) {
      let _this = this;
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
          _this.renderNav($div, toPage, totalPage, callback);
          callback(toPage);
        });
    },
    // 加载中页面组件
    renderLoading() {
      $("#ui-view").append(
        $("<aside/>")
          .addClass("loading")
          .append("<div></div>")
      );
    },
    // 生成uuid
    uuid() {
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
    },
    // 处理最大值和最小值
    handleMinAndMax: function(arr = [], isNotPercent) {
      let result = { min: null, max: null };
      if (arr.length > 0) {
        result.min = Number(arr[0]);
        result.max = Number(arr[0]);
        arr.map(val => {
          if (typeof val === "object") {
            result.min = Math.min(result.min, Number(val.value));
            result.max = Math.max(result.max, Number(val.value));
          } else {
            result.min = Math.min(result.min, Number(val));
            result.max = Math.max(result.max, Number(val));
          }
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
    },
    // 处理字符串换行
    handleStrLineFeed: function(str = "", perChar = 4) {
      let result = "";
      for (let i = 0, len = str.length; i < len; i++) {
        result += i % perChar == perChar - 1 ? str[i] + "\n" : str[i];
      }
      return result;
    },
    // 获取当前时间并加减固定月份
    getDate: function(difference = 0) {
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
    },
    // 获取今天的日期
    getToday: function() {
      // 是否比9大
      function handleZero(val) {
        return val < 10 ? "0" + val : val;
      }
      let date = new Date();
      let year = date.getFullYear();
      let month = handleZero(date.getMonth() + 1);
      let day = handleZero(date.getDate());
      let hour = handleZero(date.getHours());
      let minute = handleZero(date.getMinutes());
      let second = handleZero(date.getSeconds());
      return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    },
    // 防抖函数
    debounce: (fn, wait) => {
      let timeout = null;
      return function() {
        timeout !== null && clearTimeout(timeout);
        timeout = setTimeout(fn, wait);
      };
    },
    // 渲染echarts图
    renderChart({ id, option, data = [], cb }) {
      let chart = ec.init(document.getElementById(id));
      if (data instanceof Array && data.length > 0) {
        if (cb instanceof Function) {
          chart.off();
          chart.on("click", cb);
        }
      } else {
        option = {
          title: {
            show: true,
            text: "无数据",
            left: "center",
            top: "middle",
            textStyle: {
              color: "#000",
              fontSize: 20
            }
          }
        };
      }
      chart.setOption(option, true);
    },
    // 节流函数
    throttle: function(fn, delay) {
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
    },
    // 初始化日期控件
    initDateInput(id, date) {
      $(`#${id}`)
        .val(date)
        .datetimepicker({
          format: "yyyy-mm",
          autoclose: true,
          todayBtn: false,
          startView: "year",
          minView: "year",
          maxView: "decade",
          endDate: this.getDate(-1),
          language: "zh-CN"
        });
    },
    // 初始化查询栏
    initSearchBar({ date1 = -7, date2 = -1, cb = null, type = "" }) {
      return new Promise(async (resolve, reject) => {
        const $deptTree = $("#dept-tree");
        const $deptName = $("#dept-name");
        const $deptId = $("#dept-id");
        let { deptId, role } = this.identityInfo;
        let treeData;
        await this.request(this.interFaces.common.getDeptTree, {
          deptId,
          role,
          type
        }).then(result => {
          treeData = result.data;
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
        $deptName.off().on("click", () => {
          $deptTree.css(
            "visibility",
            $deptTree.css("visibility") === "hidden" ? "visible" : "hidden"
          );
        });
        this.initDateInput("date1", this.getDate(date1));
        this.initDateInput("date2", this.getDate(date2));
        $deptId.val(treeData[0].id);
        $deptName.val(treeData[0].text);
        // 绑定查询按钮回调事件
        typeof cb === "function" &&
          $(".search-btn")
            .off()
            .on("click", cb);
        resolve();
      });
    },
    initRightMenu(params) {
      window.rightParams = params;
      requirejs(["text!../views/myhc/rightMenu.html"], ele => {
        $(".rightPannel").html(ele);
      });
    },
    getLabelVal(val) {
      if (val.length == 1) {
        val = "   " + val;
      } else if (val.length == 2) {
        val = "  " + val;
      } else if (val.length == 3) {
        val = " " + val;
      }
      return val;
    }
  };
});
