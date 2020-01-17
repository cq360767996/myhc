define(["common"], sugon => {
  // 计时器
  let timer;
  // 缓存数据
  let cacheData = [];
  // 当前加载的索引
  let currentIndex = 0;
  // 获取主容器，然后解绑所有事件
  const $uiView = $("#ui-view").off();
  // 全局状态
  const state = new Proxy(
    { stepIntoLoop: false },
    {
      set(target, key, value, receiver) {
        // 已经进入循环序列
        if (key === "stepIntoLoop" && value) {
          $(".box-popup__ball").addClass("not-regular");
          // 开始飞入
          flyIn();
        }
        return Reflect.set(target, key, value, receiver);
      }
    }
  );

  // 初始化组件
  const initComponent = async params => {
    $(".zrq-popup-marker-origin").each((index, dom) => {
      const $dom = $(dom);
      const src = $dom.attr("src");
      const newSrc = src.substring(0, src.indexOf(".png")) + "_animate.png";
      $dom.attr("src", newSrc);
      $dom.addClass("zrq-popup-marker-animate");
    });
    const result = await sugon.request(
      sugon.interFaces.myhc.myzs.getZrqAnimation,
      params
    );
    const data = mapNameWithIcon(result.data);
    const space = parseInt(9 / data.length);
    const gap = 9 - data.length;
    if (space === 1) {
      let acc = 0;
      cacheData = data.map((val, index) => {
        if (index % 2 === 1 && acc < gap) {
          acc++;
        }
        val.type = index + acc;
        return val;
      });
    } else {
      cacheData = data.map((val, index) => {
        val.type = index * space;
        return val;
      });
    }
    // 先清空状态
    closeComponent();

    $uiView.append(`
    <div class="box-popup">
      <div class="box-popup__ball">
        <img />
      </div>
    </div>`);
    // 开启球体运动
    startBall();
  };

  // 映射名称与icon关系
  function mapNameWithIcon(data) {
    const strategies = [
      { name: "微警务评价", icon: 1 },
      { name: "微信调查", icon: 2 },
      { name: "党代表", icon: 3 },
      { name: "人大代表", icon: 3 },
      { name: "政协委员", icon: 3 },
      { name: "12345热线", icon: 7 },
      { name: "短信回访", icon: 5 },
      { name: "电话回访", icon: 6 },
      { name: "二维码门牌", icon: 4 }
    ];
    return data.map(v1 => {
      strategies.map(v2 => {
        if (v1.name === v2.name) {
          const icon = v2.icon;
          v1 = { ...v1, icon };
        }
      });
      return v1;
    });
  }

  // 处理飞入效果
  function flyIn() {
    const val = cacheData[currentIndex];
    $(".box-popup").append(`
    <div
      class="box-popup__tips--${cacheData[currentIndex].type}"
      current-index="${currentIndex}">
      <div class="box-popup__tips">
        <div>
          <img src="../../img/myhc/myzs/animate/icon${val.icon}.png" />
        </div>
        <div class="text-area"></div>
      </div>
    </div>`);
  }

  // 球效果
  function startBall() {
    const supplyZero = value =>
      value < 10 ? `00${value}` : value < 100 ? `0${value}` : value;

    // 图片index
    let picIndex = 0;
    timer = window.setInterval(() => {
      if (state.stepIntoLoop) {
        if (picIndex === 130) {
          picIndex = 0;
        }
        $(".box-popup__ball >img").attr(
          "src",
          `../../img/myhc/myzs/animate/earth/earth${supplyZero(picIndex)}.png`
        );
      } else {
        if (picIndex === 31) {
          picIndex = 0;
          state.stepIntoLoop = true;
        } else {
          $(".box-popup__ball >img").attr(
            "src",
            `../../img/myhc/myzs/animate/earth_appear/earth_appear${
              picIndex < 10 ? `0${picIndex}` : picIndex
            }.png`
          );
        }
      }
      picIndex++;
    }, 50);
  }

  // 关闭组件
  function closeComponent() {
    // 1.移除容器 2.清空计时器 3.重置tips的index 4.重置是否开始循环
    $(".box-popup").remove();
    window.clearInterval(timer);
    currentIndex = 0;
    state.stepIntoLoop = false;
  }

  // 处理关闭组件带来的effect
  function useEffect() {
    $(".zrq-popup-marker-origin").each((index, dom) => {
      const $dom = $(dom);
      const src = $dom.attr("src");
      const newSrc = src.substring(0, src.indexOf("_animate.png")) + ".png";
      console.log(newSrc);
      $dom.attr("src", newSrc);
      $dom.addClass("zrq-popup-marker-animate");
    });
  }

  // 监听标签动画结束事件
  $uiView.on("webkitAnimationEnd", ".box-popup > div", e => {
    const $currentTarget = $(e.currentTarget);
    const $target = $(e.target);
    const type = $target.attr("current-index");
    if (
      type &&
      type < cacheData.length &&
      !$target.hasClass("box-popup__ball") &&
      !$target.hasClass("text-fadeIn") &&
      !$target.hasClass("box-popup__tips")
    ) {
      const val = cacheData[currentIndex];
      $currentTarget.find(".box-popup__tips").addClass("not-regular");
      $currentTarget.find(".text-area")
        .html(` <div class="text-fadeIn">${val.name}</div>
                <div class="text-fadeIn">${val.value}</div>`);
      currentIndex++;
      // 最后一个不再继续飞入了
      type != cacheData.length - 1 && flyIn();
    }
  });

  // 取消右键默认
  $uiView.on("contextmenu", ".box-popup", () => false);

  // 右键外面关闭组件
  $uiView.on("mouseup", ".box-popup", e => {
    if (e.which === 3) {
      const $target = $(e.currentTarget);
      if ($(".box-popup").length > 0 && $target.hasClass("box-popup")) {
        closeComponent();
        useEffect();
      }
    }
  });

  return initComponent;
});
