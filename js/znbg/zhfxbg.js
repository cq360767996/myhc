/* Created by handsome qiu */
requirejs(
  ["common", "ec", "domtoimage", "jqcloud"],
  (sugon, ec, domtoimage) => {
    let rightPanelData; // 右侧数据
    // 全局查询尺度
    let searchRuler = {};
    let popFunc = {
      initBarX(data, id, render3Words) {
        let xData = [],
          yData = [];
        data.map(val => {
          xData.push(val.name);
          yData.push(val.value);
        });
        let option = {
          animation: false,
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow"
            }
          },
          grid: {
            left: 0,
            top: 20,
            right: 0,
            bottom: 10,
            containLabel: true
          },
          xAxis: [
            {
              type: "category",
              axisTick: { show: false },
              splitArea: { show: false },
              data: xData,
              axisLabel: {
                color: "#000",
                interval: 0,
                formatter: param => {
                  let prefix = render3Words ? 3 : 4;
                  let tempStr = "";
                  if (param.length > prefix) {
                    for (var i = 0; i < param.length; i++) {
                      if (i % prefix == prefix - 1) {
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
                color: "#000"
              }
            }
          ],
          yAxis: [
            {
              type: "value",
              show: true,
              splitNumber: 3,
              splitLine: {
                show: false
              },
              axisTick: { show: false },
              axisLabel: {
                formatter: "{value}"
              }
            }
          ],
          series: [
            {
              type: "bar",
              barWidth: 15,
              color: "#3A9BBE",
              label: {
                show: true,
                position: "top",
                color: "#000"
              },
              data: yData
            }
          ]
        };
        let chart = ec.init(document.getElementById(id));
        chart.setOption(option, true);
      },
      initAnnual(data, id, withPercent, withPosition, withCenter) {
        let dom = document.getElementById(id);
        let chart = ec.init(dom);
        let total = 0;
        data.map(val => {
          total += Number(val.value);
        });
        let option = {
          animation: false,
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
              center: ["50%", withPosition ? "60%" : "50%"],
              radius: ["40%", "56%"],
              hoverAnimation: false,
              itemStyle: {
                normal: {
                  label: {
                    show: true,
                    position: "outside",
                    rich: {
                      white: {
                        color: "#ddd",
                        align: "center"
                      }
                    },
                    formatter: "{b}：\n{c}" + (withPercent ? "%" : "")
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
        if (withCenter) {
          option.title = {
            text: total,
            subtext: "诉求总量",
            left: "center",
            top: "35%",
            padding: [0, 0],
            subtextStyle: {
              color: "#000",
              fontSize: 12
            },
            textStyle: {
              color: "#1D84C6",
              fontSize: 14
            }
          };
        }
        chart.setOption(option, true);
      },
      initTab(data, id, hide) {
        let len;
        if (data.length > 0) {
          len = data[0].length;
        }
        let $body = $("#" + id),
          $chart = $("<chart/>"),
          className;
        if (hide) {
          className = "tab-container-hidden";
          $(`#${id}`).css({
            width: 122 + (len - 1) * 81 + "px",
            height: data.length * 32 + "px"
          });
        } else {
          className = "tab-container-block";
          $chart.css("font-size", "12px");
        }
        $chart.addClass(className);
        data.map(val1 => {
          let $row = $("<row/>");
          val1.map(val2 => {
            $row.append(`<cell>${val2}</cell>`);
          });
          $chart.append($row);
        });
        $body.empty().append($chart);
      },
      initBarWithLine(rawData, id, isDisplay) {
        let data = rawData.data1,
          lineData = rawData.data2,
          tag1 = rawData.tag1,
          tag2 = rawData.tag2,
          xData = [],
          yData = [],
          uuid = sugon.uuid(),
          fontSize = isDisplay ? 12 : 14,
          margin = isDisplay ? 19 : 50;
        $("#" + id).empty().append(`<div style="font-size: ${fontSize}px;
                                 height: 30px;line-height:30px;color:#000;">
                              <div style="width: 20px;height:20px;float:left;margin-top:5px;
                                   background-color:#3A9BBE;margin-left:${margin}px;">
                              </div>
                              <div style="margin-left:5px;float:left;">${tag1}</div>
                              <div style="width: 30px;height:2px;margin-left:15px;
                                margin-top: 14px;float:left;background-color:red;">
                              </div>
                              <div style="margin-left:5px;float:left;">${tag2}</div>
                          </div>
                          <div id="${uuid}" style="height: calc(100% - 30px);"></div>`);
        data.map(val => {
          xData.push(val.name);
          yData.push(val.value);
        });
        let minAndMax = sugon.handleMinAndMax(yData);
        let option = {
          animation: false,
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow"
            }
          },
          grid: {
            left: 0,
            top: 20,
            right: 0,
            bottom: isDisplay ? 0 : 10,
            containLabel: true
          },
          xAxis: [
            {
              type: "category",
              axisTick: { show: false },
              splitArea: { show: false },
              data: xData,
              axisLabel: {
                color: "#000",
                interval: 0,
                formatter: param => {
                  let prefix;
                  if (isDisplay) {
                    prefix = 1;
                  } else {
                    prefix = data.length > 10 ? 2 : 4;
                  }
                  let tempStr = "";
                  if (param.length > prefix) {
                    for (var i = 0; i < param.length; i++) {
                      if (i % prefix == prefix - 1) {
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
                color: "#000"
              }
            }
          ],
          yAxis: [
            {
              type: "value",
              show: true,
              splitNumber: 3,
              min: minAndMax.min,
              max: minAndMax.max,
              splitLine: {
                show: false
              },
              axisTick: { show: false },
              axisLabel: {
                formatter: "{value}"
              }
            }
          ],
          series: [
            {
              type: "bar",
              barWidth: 15,
              color: "#3A9BBE",
              label: {
                show: !isDisplay,
                position: "top",
                color: "#000"
              },
              data: yData,
              markLine: {
                label: {
                  show: false
                },
                lineStyle: {
                  color: "#ff0000",
                  width: "1",
                  type: "dashed"
                },
                data: [
                  {
                    xAxis: -1,
                    yAxis: lineData
                  },
                  {
                    xAxis: data.length,
                    yAxis: lineData
                  }
                ]
              }
            }
          ]
        };
        let chart = ec.init(document.getElementById(uuid));
        chart.setOption(option, true);
      },
      postImg() {
        // 把img生成的img图片传给后台
        domtoimage
          .toJpeg(document.getElementById("pop-container"))
          .then(dataUrl => {
            if (sugon.isPublished) {
              return sugon.request(sugon.interFaces.znbg.zhfxbg.postImg, {
                uuid: searchRuler.uuid,
                url: dataUrl,
                username: sugon.identityInfo.username
              });
            } else {
              return new Promise((resolve, reject) => {
                let a = document.createElement("a");
                a.href = dataUrl;
                a.style.display = "none";
                a.download = "xx.jpg";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                resolve();
              });
            }
          })
          .then(result => {
            initRightPanel();
            $(".loading").remove();
            sugon.showMessage("报告已生成！", "success");
          });
      },
      initPopPage(condition) {
        let $body = $("#pop-container").show();
        sugon
          .request(sugon.interFaces.znbg.zhfxbg.getPreview, condition)
          .then(result => {
            // title
            result.title.data.map((val, index) => {
              $(".header-val")
                .eq(index)
                .html(val);
            });
            // data1
            result.data1.data.map((val, index) => {
              $(".cell-val")
                .eq(index)
                .html(index === 3 ? val + "%" : val);
            });
            // data2
            $(".fieldset1 article").html(result.data2.content);
            this.initBarWithLine(result.data2.data1, "chart1", true);
            this.initBarWithLine(result.data2.data2, "chart2", true);
            this.initBarWithLine(result.data2.data3, "chart3", true);
            // data3
            $(".fieldset2 article").html(result.data3.content);
            this.initTab(result.data3.data, "tab1");
            // data4
            this.initTab(result.data4.data, "tab2");
            $(".fieldset3 article")
              .eq(0)
              .html(result.data4.content);
            // data5
            $(".fieldset3 article")
              .eq(1)
              .html(result.data5.content1);
            this.initAnnual(result.data5.data1, "chart4");
            $(".fieldset4 article")
              .eq(0)
              .html(result.data5.content2);
            this.initAnnual(result.data5.data2, "chart5");
            $(".fieldset4 article")
              .eq(1)
              .html(result.data5.content3);
            // data6
            $(".fieldset4 article")
              .eq(2)
              .html(result.data6.content);
            this.initBarX(result.data6.data, "chart6", true);
            // data7
            $(".fieldset4 article")
              .eq(3)
              .html(result.data7);
            if (condition.content === undefined) {
              $body.css({
                top: "50%",
                left: "50%",
                "margin-left": "-720px",
                "margin-top": "-360px",
                "z-index": "3"
              });
              let $i = $("#pop-container > header > div:nth-child(3) i").show(),
                $mask = $(".pop-mask").show();
              $i.unbind().bind("click", e => {
                // 绑定关闭按钮
                $i.hide();
                $mask.hide();
                $body
                  .css("top", 0)
                  .css("left", 0)
                  .css("margin-top", 0)
                  .css("margin-left", 0)
                  .css("z-index", -2)
                  .hide();
              });
              $(".loading").remove();
            } else {
              this.postImg();
            }
          });
      }
    };

    //获取树数据
    function getTree() {
      var treeData = [];
      let { deptCode, role } = sugon.identityInfo;
      sugon.requestJson(
        {
          type: "POST",
          url: sugon.interFaces.common.getDeptTree,
          data: { deptCode, role }
        },
        function(result) {
          treeData = result.data;
        }
      );
      return treeData;
    }

    // 初始化查询栏
    function initSearchBar() {
      let $date1 = $("#date1"),
        $date2 = $("#date2"),
        $deptId = $("#deptId"),
        $deptName = $("#deptName"),
        $leftTree = $(".left-tree");
      let lastMonth = sugon.getDate(-1);
      $date1.val((searchRuler.date1 = sugon.getDate(-4)));
      $date2.val((searchRuler.date2 = sugon.getDate(-2)));
      $deptId.val((searchRuler.deptId = "2014110416460086100000002942"));
      $deptName.val((searchRuler.deptName = "南京市公安局"));

      $date1
        .datetimepicker({
          format: "yyyy-mm",
          autoclose: true,
          todayBtn: true,
          startView: "year",
          minView: "year",
          maxView: "decade",
          endDate: lastMonth,
          language: "zh-CN"
        })
        .change(() => {
          searchRuler.date1 = $("#date1").val();
          initLeft();
        });
      $date2
        .datetimepicker({
          format: "yyyy-mm",
          autoclose: true,
          todayBtn: true,
          startView: "year",
          minView: "year",
          maxView: "decade",
          endDate: lastMonth,
          language: "zh-CN"
        })
        .change(() => {
          searchRuler.date2 = $("#date2").val();
          initLeft();
        });
      let offset = $deptName.offset();
      // 设置下拉框宽度
      $leftTree
        .css("width", $deptName.outerWidth())
        .css("left", offset.left - 100)
        .css("top", offset.top - 40)
        .treeview({
          data: getTree(),
          levels: 1,
          onNodeSelected: function(event, node) {
            $deptName.val((searchRuler.deptName = node.text));
            $deptId.val((searchRuler.deptId = node.id));
            initLeft();
            $leftTree.css("visibility", "hidden");
          },
          showCheckbox: false //是否显示多选
        });
      $deptName.click(function() {
        $leftTree.css("visibility", "visible");
      });
    }

    // 初始化右侧文件列表
    function initRightPanel() {
      sugon.requestJson(
        {
          type: "post",
          url: sugon.interFaces.znbg.zhfxbg.getFileList,
          data: {
            deptId: searchRuler.deptId,
            username: sugon.identityInfo.username
          }
        },
        result => {
          rightPanelData = result.data;
          let html = "";
          result.data.map(val => {
            html += `<div url="${val.url}" containImg="${val.containImg}">
                      <div><img src="../../img/znbg/checkbox.png"></div>
                      <div>
                      <img src="../../img/znbg/word.png">
                      <span>${val.name}</span>
                      </div>
                      <div>${val.date}</div>
                      <div>
                      <img class="report-preview" src="../../img/znbg/preview.png">
                      <img class="report-download" src="../../img/znbg/download.png">
                      <img class="report-delete" src="../../img/znbg/delete.png">
                      </div>
                    </div>`;
          });
          $(".tab-body")
            .empty()
            .append(html);
        }
      );
    }

    // 生成报告
    function generateReport(uuid, codeArr) {
      searchRuler.code = codeArr.join(",");
      searchRuler.content = $(".textarea-div").val();
      searchRuler.uuid = uuid;
      let params = { username: sugon.identityInfo.username };
      Object.assign(params, searchRuler);
      popFunc.initPopPage(searchRuler);
      sugon
        .request(sugon.interFaces.znbg.zhfxbg.generateReport, params)
        .then(result => {
          let $body = $(".hidden-chart").empty();
          if (result.data.length > 0) {
            result.data.map(val => {
              let id = sugon.uuid();
              $body.append($("<div/>").attr("id", id));
              let $id = $("#" + id);
              switch (val.type) {
                case "0.1":
                  popFunc.initTab(val.data, id, true);
                  break;
                case "1":
                  val.data.length > 10 && $(`#${id}`).css("width", "600px");
                  popFunc.initBarX(val.data, id, true);
                  break;
                case "2":
                  popFunc.initBarWithLine(val.data, id);
                  break;
                case "3":
                  popFunc.initAnnual(val.data, id, true);
                  break;
              }
            });
          }
          setTimeout(drawImage, 2000, result, uuid);
        });
    }

    // 上传图片
    function uploadImg(id, imgUrl, uuid) {
      if (sugon.isPublished) {
        sugon
          .request(sugon.interFaces.znbg.zhfxbg.uploadImg, {
            uuid: uuid,
            id: id,
            img: imgUrl
          })
          .then(result => {
            if (result.code) {
              initRightPanel();
            }
          });
      } else {
        let img = new Image();
        img.src = imgUrl;
        document.body.appendChild(img);
      }
    }

    // 遍历图片
    function drawImage(result, uuid) {
      $(".hidden-chart > div").each((index, dom) => {
        if ($(dom).attr("_echarts_instance_")) {
          uploadImg(
            result.data[index].id,
            ec.getInstanceByDom(dom).getDataURL(),
            uuid
          );
        } else {
          domtoimage.toPng(dom).then(imgUrl => {
            uploadImg(result.data[index].id, imgUrl, uuid);
          });
        }
      });
    }

    // 刷新左侧面板
    function initLeft() {
      let { deptId, date1, date2 } = searchRuler;
      sugon
        .request(sugon.interFaces.znbg.zhfxbg.getLeft, { deptId, date1, date2 })
        .then(result => {
          let $article = $(".article-div").empty(),
            $checkbox = $(".checkbox-div");
          result.data.map((val1, index) => {
            let $div = $("<div/>"),
              $span = "";
            val1.map(val2 => {
              $span += `<span class="span-div" code="${val2.value}">
              <img src="../../img/znbg/checkbox_hover.png">
              <span>${val2.name}</span>
            </span>`;
            });
            $div.append($span).appendTo($article.eq(index));
          });
          $checkbox.attr("src", "../../img/znbg/checkbox_hover.png");
        });
    }

    // 程序入口
    $(function() {
      initSearchBar();
      initLeft();
      initRightPanel();
    });

    // 全选按钮事件
    $(".checkbox-div").click(e => {
      let $target = $(e.target),
        checkboxOn = "../../img/znbg/checkbox_hover.png",
        checkboxOff = "../../img/znbg/checkbox.png",
        $selectSingle = $target
          .parent()
          .next()
          .find("img"),
        checkSelect =
          $target.attr("src").indexOf("hover") > -1 ? checkboxOff : checkboxOn;
      $selectSingle.attr("src", checkSelect);
      $target.attr("src", checkSelect);
    });

    // 单选按钮事件
    $("fieldset").on("click", ".span-div", e => {
      let $target = $(e.target),
        checkboxOn = "../../img/znbg/checkbox_hover.png",
        checkboxOff = "../../img/znbg/checkbox.png";
      if (!$target.hasClass("span-div")) {
        $target = $target.parent();
      }
      let $img = $target.find("img"),
        $parent = $target.parent().parent(),
        $innerImg = $parent.find("img"),
        $selectAll = $parent.prev().find(".checkbox-div"),
        hoverTimes = 0,
        len = $innerImg.length;
      $img.attr(
        "src",
        $img.attr("src").indexOf("hover") > -1 ? checkboxOff : checkboxOn
      );
      for (let i = 0; i < len; i++) {
        let imgUrl = $innerImg.eq(i).attr("src");
        imgUrl.indexOf("hover") > -1 && hoverTimes++;
      }
      $selectAll.attr("src", hoverTimes === 0 ? checkboxOff : checkboxOn);
    });

    // 切换按钮事件
    $(".setting-ul > li > div").on("click", e => {
      let $target = $(e.target),
        className = $target.attr("class"),
        switchOn = "switch-on",
        switchOff = "switch-off";
      $target.removeClass(className);
      $target.addClass(className == switchOn ? switchOff : switchOn);
    });

    // textarea失焦事件
    $(".textarea-div").on("blur", e => {
      let $target = $(e.target),
        text = $target.val(),
        reg = /\S/,
        checkboxOn = "../../img/znbg/checkbox_hover.png",
        checkboxOff = "../../img/znbg/checkbox.png";
      $target
        .parent()
        .prev()
        .find("img")
        .eq(0)
        .attr("src", reg.test(text) ? checkboxOn : checkboxOff);
    });

    // 预览事件
    $(".tab-body").on("click", ".report-preview", e => {
      let $target = $(e.target),
        offset = $target.offset(),
        containImg = $target
          .parent()
          .parent()
          .attr("containImg"),
        url = $target
          .parent()
          .parent()
          .attr("url"),
        selectedRow,
        $preview = $(".pop-menu-preview");
      if ($preview.length === 0) {
        for (let i = 0, len = rightPanelData.length; i < len; i++) {
          if (rightPanelData[i].url === url) {
            selectedRow = rightPanelData[i];
            break;
          }
        }
        if (containImg === "1") {
          $("#ui-view").append(
            '<div class="pop-menu pop-menu-preview" style="top: ' +
              (offset.top - 38) +
              "px;left: " +
              (offset.left - 128) +
              'px;"><a class="simple-pre">简报预览</a><a href="' +
              selectedRow.pdfUrl +
              '" target="_blank">报告预览</a></div>'
          );
          // 绑定点击事件
          $(".pop-menu-preview > a")
            .unbind()
            .bind("click", e => {
              $(".pop-menu-preview").remove();
              if ($(e.target).hasClass("simple-pre")) {
                let { deptId, date1, date2, uuid, type } = selectedRow;
                sugon.renderLoading();
                popFunc.initPopPage({ deptId, date1, date2, uuid }, type);
              }
            });
        } else {
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = selectedRow.pdfUrl;
          link.target = "_blank";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } else {
        $preview.remove();
      }
    });

    // 下载事件
    $(".tab-body").on("click", ".report-download", e => {
      let $target = $(e.target),
        offset = $target.offset(),
        containImg = $target
          .parent()
          .parent()
          .attr("containImg"),
        url = $target
          .parent()
          .parent()
          .attr("url"),
        selectedRow,
        $download = $(".pop-menu-download");
      if ($download.length === 0) {
        for (let i = 0, len = rightPanelData.length; i < len; i++) {
          if (rightPanelData[i].url === url) {
            selectedRow = rightPanelData[i];
            break;
          }
        }
        if (containImg === "1") {
          $("#ui-view").append(
            '<div class="pop-menu pop-menu-download" style="top: ' +
              (offset.top - 38) +
              "px;left: " +
              (offset.left - 128) +
              'px;"><a href="' +
              selectedRow.imgUrl +
              '" download="' +
              selectedRow.fileName2 +
              '">简报下载</a><a href="' +
              selectedRow.url +
              '" download="' +
              selectedRow.fileName1 +
              '">报告下载</a></div>'
          );
          // 绑定点击事件
          $(".pop-menu-download > a")
            .unbind()
            .bind("click", e => {
              $(".pop-menu-download").remove();
            });
        } else {
          let link = document.createElement("a");
          link.style.display = "none";
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
    $(".tab-body").on("click", ".report-delete", e => {
      let $target = $(e.target),
        id = $target
          .parent()
          .parent()
          .attr("url"),
        selectedRow;
      for (let i = 0, len = rightPanelData.length; i < len; i++) {
        if (rightPanelData[i].url === id) {
          selectedRow = rightPanelData[i];
          break;
        }
      }
      let { url, imgUrl, pdfUrl, uuid } = selectedRow;
      sugon
        .request(sugon.interFaces.znbg.zhfxbg.deleteReport, {
          url,
          imgUrl,
          pdfUrl,
          uuid
        })
        .then(result => {
          initRightPanel();
          result.code
            ? sugon.showMessage("删除成功！", "success")
            : sugon.showMessage("删除失败！", "error");
        });
    });

    $(".report-generator").on("click", () => {
      let $span = $(".span-div"),
        codeArr = [];
      $span.each((index, ele) => {
        let $ele = $(ele);
        $ele
          .find("img")
          .attr("src")
          .indexOf("hover") > -1 && codeArr.push($ele.attr("code"));
      });
      if (codeArr.length !== 0) {
        sugon.renderLoading();
        generateReport(sugon.uuid(), codeArr);
      }
    });
  }
);
