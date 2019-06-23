(function($) {
	"use strict";
	$.fn.jQCloud = function(word_array, options) {
		// 瀹瑰櫒鍏冪礌鐨勫紩鐢�
		var $this = this;
		// 閮藉凡ID鍛藉悕 閬垮厤澶氫釜鏍囩涔嬮棿鐨勭鎾�
		var cloud_namespace = $this.attr('id') || Math.floor((Math.random() * 1000000)).toString(36);

		// 榛樿閫夐」鍊�
		var default_options = {
			width: $this.width(),
			height: $this.height(),
			center: {
				x: ((options && options.width) ? options.width : $this.width()) / 2.0,
				y: ((options && options.height) ? options.height : $this.height()) / 2.0
			},
			delayedMode: word_array.length > 50,
			shape: false, // 榛樿涓烘き鍦嗗舰鐘�
			encodeURI: true,
			removeOverflowing: true
		};

		options = $.extend(default_options, options || {});

		// 鈥渏qcloud鈥濈被娣诲姞鍒板鍣ㄧ畝鍗曠殑CSS鏍峰紡,璁剧疆瀹瑰櫒瀹藉害/楂樺害
		$this.addClass("jqcloud").width(options.width).height(options.height);

		// 瀹瑰櫒鐨凜SS浣嶇疆涓嶈兘涓衡€滈潤鎬佲€�
		if ($this.css("position") === "static") {
			$this.css("position", "relative");
		}

		var drawWordCloud = function() {
			//Helper鍑芥暟鏉ユ祴璇曞鏋滀竴涓厓绱犻噸鍙�
			var hitTest = function(elem, other_elems) {
				// 涓や袱閲嶅彔妫€娴�
				var overlapping = function(a, b) {
					if (Math.abs(2.0 * a.offsetLeft + a.offsetWidth - 2.0 * b.offsetLeft - b.offsetWidth) < a.offsetWidth + b.offsetWidth) {
						if (Math.abs(2.0 * a.offsetTop + a.offsetHeight - 2.0 * b.offsetTop - b.offsetHeight) < a.offsetHeight + b.offsetHeight) {
							return true;
						}
					}
					return false;
				};
				var i = 0;
				// 妫€鏌ュ厓绱犻噸鍙犱竴涓帴涓€涓�,鍋滄骞惰繑鍥瀎alse涓€鏃﹀彂鐜伴噸鍙�
				for (i = 0; i < other_elems.length; i++) {
					if (overlapping(elem, other_elems[i])) {
						return true;
					}
				}
				return false;
			};

			// 纭繚姣忎竴涓噸閲忎箣鍓嶆槸涓€涓暟瀛楁帓搴�
			for (var i = 0; i < word_array.length; i++) {
				word_array[i].weight = parseFloat(word_array[i].weight, 10);
			}

			// 鎺掑簭word_array浠庢渶楂樼殑璇嶄綋閲嶆渶浣庣殑涓€涓�
			word_array.sort(function(a, b) {
				if (a.weight < b.weight) {
					return 1;
				} else if (a.weight > b.weight) {
					return -1;
				} else {
					return 0;
				}
			});

			var step = (options.shape === "rectangular") ? 18.0 : 2.0,
				already_placed_words = [],
				aspect_ratio = options.width / options.height;

			// 鍑芥暟鐢讳竴璇�,鍦ㄨ灪鏃嬮€氳繃绉诲姩瀹�,鐩村埌鎵惧埌涓€涓悎閫傜殑绌哄湴鏂广€傝繖灏嗘槸杩唬姣忎釜鍗曡瘝銆�
			var drawOneWord = function(index, word) {
				// 瀹氫箟璺ㄨ秺鐨処D灞炴€�,灏嗚繖涓瘝,鍜岀浉鍏崇殑jQuery閫夋嫨鍣ㄥ瓧绗︿覆
				var word_id = cloud_namespace + "_word_" + index,
					word_selector = "#" + word_id,
					angle = 6.28 * Math.random(),
					radius = 0.0,

					// Only used if option.shape == 'rectangular'
					steps_in_direction = 0.0,
					quarter_turns = 0.0,

					weight = 5,
					custom_class = "",
					inner_html = "",
					word_span;
	

				// 鎵╁睍璇峢tml閫夐」榛樿鍊�
				word.html = $.extend(word.html, {
					id: word_id
				});

				// 濡傛灉鎸囧畾鐨勮嚜瀹氫箟绫�,鎶婂畠浠斁鍦ㄤ竴涓彉閲忓苟灏嗗畠浠巋tml attrs,閬垮厤鐢眏QCloud瑕嗙洊绫�
				if (word.html && word.html["class"]) {
					custom_class = word.html["class"];
					delete word.html["class"];
				}

				// 妫€鏌ユ槸鍚in(閲嶉噺)> max(閲嶉噺)鍚﹀垯浣跨敤榛樿
				if (word_array[0].weight > word_array[word_array.length - 1].weight) {
					// 绾挎€ф槧灏勫師浣撻噸涓€涓鏁ｇ殑瑙勬ā浠�1鍒�10
					weight = Math.round((word.weight - word_array[word_array.length - 1].weight) /
						(word_array[0].weight - word_array[word_array.length - 1].weight) * 9.0) + 1;
				}
				word_span = $('<span>').attr(word.html).addClass('w' + weight + " " + custom_class);

				// 濡傛灉鍗曡瘝娣诲姞閾炬帴銆倁rl灞炴€ц缃�
				if (word.link) {
					//濡傛灉閾炬帴鏄竴涓瓧绗︿覆,鐒跺悗浣跨敤瀹冧綔涓篽ref閾炬帴
					if (typeof word.link === "string") {
						word.link = {
							href: word.link
						};
					}

					// 鎵╁睍閾炬帴鐨刪tml閫夐」榛樿鍊�
					if (options.encodeURI) {
						word.link = $.extend(word.link, {
							href: encodeURI(word.link.href).replace(/'/g, "%27")
						});
					}

					inner_html = $('<a>').attr(word.link).text(word.text);
				} else {
					inner_html = word.text;
				}
				word_span.append(inner_html);

				// 灏嗗鐞嗙▼搴忕粦瀹氬埌鍗曡瘝
				if (!!word.handlers) {
					for (var prop in word.handlers) {
						if (word.handlers.hasOwnProperty(prop) && typeof word.handlers[prop] === 'function') {
							$(word_span).bind(prop, word.handlers[prop]);
						}
					}
				}

				$this.append(word_span);

				var width = word_span.width(),
					height = word_span.height(),
					left = options.center.x - width / 2.0,
					top = options.center.y - height / 2.0;

				// 淇濆瓨鏍峰紡灞炴€х殑寮曠敤,鑾峰緱鏇村ソ鐨勬€ц兘
				var word_style = word_span[0].style;
				word_style.position = "absolute";
				word_style.left = left + "px";
				word_style.top = top + "px";

				while (hitTest(word_span[0], already_placed_words)) {
					// 閫夋嫨褰㈢姸鏄煩褰㈢殑绉诲姩杩欎釜璇嶅湪涓€涓煩褰㈣灪鏃�
					if (options.shape === "rectangular") {
						steps_in_direction++;
						if (steps_in_direction * step > (1 + Math.floor(quarter_turns / 2.0)) * step * ((quarter_turns % 4 % 2) === 0 ? 1 : aspect_ratio)) {
							steps_in_direction = 0.0;
							quarter_turns++;
						}
						switch (quarter_turns % 4) {
							case 1:
								left += step * aspect_ratio + Math.random() * 2.0;
								break;
							case 2:
								top -= step + Math.random() * 2.0;
								break;
							case 3:
								left -= step * aspect_ratio + Math.random() * 2.0;
								break;
							case 0:
								top += step + Math.random() * 2.0;
								break;
						}
					} else { // 榛樿璁剧疆:妞渾铻烘棆褰㈢姸
						radius += step;
						angle += (index % 2 === 0 ? 1 : -1) * step;

						left = options.center.x - (width / 2.0) + (radius * Math.cos(angle)) * aspect_ratio;
						top = options.center.y + radius * Math.sin(angle) - (height / 2.0);
					}
					word_style.left = left + "px";
					word_style.top = top + "px";
				}

				// 涓嶅憟鐜拌瘝濡傛灉澶栭潰灏嗗鍣ㄧ殑涓€閮ㄥ垎
				if (options.removeOverflowing && (left < 0 || top < 0 || (left + width) > options.width || (top + height) > options.height)) {
					word_span.remove()
					return;
				}


				already_placed_words.push(word_span[0]);

				// 濡傛灉鐜版湁璋冪敤鍥炶皟
				if ($.isFunction(word.afterWordRender)) {
					word.afterWordRender.call(word_span);
				}
			};

			var drawOneWordDelayed = function(index) {
				index = index || 0;
				if (!$this.is(':visible')) { // 濡傛灉涓嶅彲瑙侊紝閭ｄ箞涓嶈璇曞浘鎷�
					setTimeout(function() {
						drawOneWordDelayed(index);
					}, 10);
					return;
				}
				if (index < word_array.length) {
					drawOneWord(index, word_array[index]);
					setTimeout(function() {
						drawOneWordDelayed(index + 1);
					}, 10);
				} else {
					if ($.isFunction(options.afterCloudRender)) {
						options.afterCloudRender.call($this);
					}
				}
			};

			// 杩唬drawOneWord涓婃瘡涓€涓瓧銆傝凯浠ｇ殑鏂瑰紡瀹屾垚鍙栧喅浜庣粯鍥炬ā寮�(delayedMode鏄湡鎴栧亣鐨�)
			if (options.delayedMode) {
				drawOneWordDelayed();
			} else {
				$.each(word_array, drawOneWord);
				if ($.isFunction(options.afterCloudRender)) {
					options.afterCloudRender.call($this);
				}
			}
		};

		// 寤惰繜鎵ц,浠ヤ究鍦ㄦ祻瑙堝櫒鍙互娓叉煋浜戠敾鎺ㄧ畻鐨勫己鍖栬瘝鍓嶇殑椤甸潰
		setTimeout(function() {
			drawWordCloud();
		}, 10);
		return $this;
	};
})(jQuery);