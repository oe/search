
//增加推荐网站，如搜索音乐时推荐 豆瓣电台，QQ电台等等
//增加搜索技巧

//cookies
var cookie = {
	mycookie: {},
	init: function  () {
		var cookie_str = document.cookie;
		cookie_str = cookie_str.split('; ');
		var keyvar = [];
		for (var i = 0,l = cookie_str.length; i < l; i++) {
			keyvar = cookie_str[i].split('=');
			this.mycookie[keyvar[0]] = unescape(keyvar[1]);
		}
		var lang = this.attr('lang');
		this.setlang(lang);
		if (undefined === this.attr('defaultType')) {
			this.attr('defaultType','search');
		}
		if (undefined === this.attr('defaultEngine')) {
			this.attr('defaultEngine','google');
		}
		if (undefined === this.attr('newin')) {
			this.attr('newin','1');
		}
	},
	attr:function  (key,val,expire,path) {
		if (typeof(val) === 'undefined') {
			return typeof(this.mycookie[key])==='undefined' ? undefined : this.mycookie[key];
		}else{
			if (typeof(expire)==='undefined') {
				expire = 'Sat, 19 Jan 2037 03:52:43 GMT';
			} else{
				var date = new Date();
				date.setTime(date.getTime() + expire*24*60*60*1000); //set expire by day
				expire = date.toGMTString();
			}
			path = path ? path : '/';
			val = escape(val);
			document.cookie = key + '=' + val + ';expires=' + expire + ';path=' + path;
			this.mycookie[key] = val;
			return this.mycookie[key];
		}
	},
	remove: function  (key) {
		var val = this.attr(key);
		if (undefined !== val) {
			var date = new Date();
			date.setTime(date.getTime()-1);
			document.cookie = key + '=' + val + ';expires=' + date.toGMTString();
			delete this.mycookie[key];
		}
		return true;
	},
	setlang: function  (lang) {
		if (undefined === lang || ('zh' !== lang && 'en' !== lang)) {
			lang = (undefined ===window.navigator.language) ? window.navigator.browserLanguage : window.navigator.language;
			if ('zh-cn' === lang.toLowerCase()) {
				return this.attr('lang','zh');
			} else{
				return this.attr('lang','en');
			}
		}
		return this.attr('lang',lang);
	}
};

$.toJSONString = JSON.stringify || function (obj) {
    var t = typeof (obj);
    if (t != "object" || obj === null) {
        // simple data type
        if (t == "string") obj = '"'+obj+'"';
        return String(obj);
    }
    else {
        // recurse array or object
        var n, v, json = [], arr = (obj && obj.constructor == Array);
        for (n in obj) {
            v = obj[n]; t = typeof(v);
            if (t == "string") v = '"'+v+'"';
            else if (t == "object" && v !== null) v = JSON.stringify(v);
            json.push((arr ? "" : '"' + n + '":') + String(v));
        }
        return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
    }
};

$(function  () {
	cookie.init();
	var currentType = cookie.attr('defaultType'),
		currentEngine = cookie.attr('defaultEngine'),
		history = $.parseJSON(cookie.attr('history')) || [],
		lang = cookie.attr('lang'),
		isArrowKey = false,
		currentIndex = -1,
		config = null,
		len = 0,
		val = '',
		urls = {
			'search'	: 'http://suggestion.baidu.com/su?wd=@&p=3&cb=?',
			'music'		: 'http://nssug.baidu.com/su?wd=@&prod=mp3&cb=?',
			'video'		: 'http://nssug.baidu.com/su?wd=@&prod=video&cb=?',
			'question'	: 'http://nssug.baidu.com/su?wd=@&prod=zhidao&cb=?',
			'image'		: 'http://nssug.baidu.com/su?wd=@&ie=utf-8&prod=image&cb=?',
			'map'		: 'http://map.baidu.com/su?wd=@&ie=utf-8&cid=1&type=0&newmap=1&callback=?',
			'doc'		: 'http://nssug.baidu.com/su?wd=@&prod=wenku&oe=utf-8&cb=?',
			'shop'		: 'http://suggest.taobao.com/sug?area=etao&code=utf-8&q=@&callback=?'
		};
	if (!history instanceof Array) history = [];
	//init app
	function initApp (lang, typeName, engineName) {
		try{
			var lists = '',
				types = '',
				current = '',
				bgimg = cookie.attr('bgimg'),
				ph;
			if (!config) {
				config = $.ajax({url:'assets/se.json',async:false}).responseText;
				config = $.parseJSON(config);
			}
			ph= config['placeholder'][lang];
			for (var key in config['searches']) {
				if (config['searches'].hasOwnProperty(key)) {
					current = (key == typeName) ? 'checked' : '';
					types += '<li><label><input type="radio" name="type" value="' + key + '" '+ current+'>' + config['searches'][key][lang] + '</label></li>';
					current = (key == typeName) ? ' current' : '';
					lists += '<ul class="'+ key + current +'">';
					keys = config['searches'][key]['engines'];
					for (var ke in keys) {
						if (keys.hasOwnProperty(ke)) {
							current = (ke == engineName && key == typeName) ? 'class="current"' : '';
							lists += '<li data="' + ke + '" '+ current +'>' + keys[ke][lang] + '</li>';
						}
					}
					lists += '</ul>';
				}
			}
			document.title = config['title'][lang];
			if (bgimg) {
				$(document.body).css('background-image','url(' + bgimg + ')');
				$('.search-wrapper,.appinfo').addClass('trsprt-bg');
			}
			$('#switch-lang').html(config['lang'][lang]);
			$('#app-name').html(config['title'][lang]);
			$('#ico').addClass('ico-' + typeName);
			$('#ph').html(ph);
			$('#search-btn').text(config['submit'][lang]);
			$('#search-engine-list').html(lists);
			$('#search-cat').html(types);
			var $current = null;
			if(0 === $('#search-engine-list .' + typeName).length){
				$current = $('#search-engine-list ul:eq(0)');
				typeName = $current.attr('class');
				$current.addClass('current');
				cookie.attr('defaultType',typeName);
			}
			if (0 === $('#search-engine-list .' + typeName + ' li.current').length) {
				$current = $('#search-engine-list .' + typeName + ' li:eq(0)');
				searchEngine = $current.attr('data');
				$current.addClass('current');
				cookie.attr('defaultEngine',searchEngine);
			}
			if (!$('#search-cat input:checked').length) {
				$('#search-cat li:eq(0) label').click();
			}
			changeSearchEngine(typeName,engineName);
		}catch(e){
			alert('Init error! You may try to reload this page.');
		}
	}

	function getHistoryList () {
		var str = '';
		len = 0;
		currentIndex = -1;
		if (history.length) {
			len = history.length;
			for (var i = 0; i < len; ++i) {
				str += '<li>' + history[i] + '</li>';	
			}
			str += '<li id="clear-history">' + config['clearhistory'][lang] + '</li>';
		}
		return str;
	}
	//set sug list position
	function setSugPos () {
		$('#sug').css({'top':$('.search-form').offset().top + $('.search-form').height(),'left':$('.search-form').offset().left});
	}
	//change engine type
	function changeSearchEngine(typeName,engineName){
		var engine = config['searches'][typeName]['engines'][engineName],
			hiddens = '';
		$('#search-form').attr('accept-charset',engine['charset']);
		$('#search-form').attr('action',engine['url']);
		$('#isa').attr('name',engine['key']);
		for (var nn in engine['hiddens']){
			if (engine['hiddens'].hasOwnProperty(nn)) {
				hiddens += '<input type="hidden" name="' + nn + '" value="' + engine['hiddens'][nn] + '">';
			}
		}
		$('#hiddens').html(hiddens);
		$('#link').attr('href',engine['link']);
	}

	function getSuggestion (keyword,type) {
		if (!urls[type]) return;
		var url;
		keyword = encodeURIComponent(keyword);

		url = urls[type].replace('@',keyword);
		try{
			$.getJSON(url,function  (json) {
				var length = 0,
					str = '',
					data,i;
				if (type == 'shop') {
					data = json.result;
					length = data.length;
					if (length) {
						for(i = 0; i < length; ++i){
							str += '<li>' + data[i][0] + '</li>';
						}
					}
				} else{
					data = json.s;
					length = data.length;
					if (length) {
						if (type == 'map') {
							for(i = 0; i < length; ++i){
								str += '<li>' + data[i].replace(/(\$)|(\d*$)/g,' ') + '</li>';
							}
						} else{
							for (i = 0; i < length; ++i) {
								str += '<li>' + data[i] + '</li>';
							}
						}
					}
				}
				if (length) {
					$('#sug').html(str).show();
				} else{
					$('#sug').hide();
				}
				len = length;
			})
		} catch(e) {
			len = 0;
		}
		currentIndex = -1;
	}

	initApp(lang,currentType,currentEngine);
	setSugPos();
	$('#sug').html(getHistoryList());
	//input box foucus & click event
	$('#isa').on('click focus',function  (event) {
		event.stopPropagation();
		$('#isa,#search-btn').addClass('box-shadow');
	}).focus();
	//input box blur event
	$('#ph').on('click',function  (event) {
		event.stopPropagation();
		$('#isa').focus();
	});
	//hide sug list
	$(document).on('click',function  () {
		$('#sug').hide();
		$('#isa,#search-btn').removeClass('box-shadow');
		$('#setting-icon').removeClass('current');
		$('#setting-panel').hide();
	});
	$(document).on('keydown',function  (event) {
		if (event.keyCode === 36) {
			$('#isa').focus();
		}
	});
	//reset sug list pos
	window.onresize = function  () {
		setSugPos();
	};
	//window focus
	window.onfocus = function  () {
		$('#isa').focus();
	};
	//window blur
	window.onblur = function(){
		$('#sug').hide();
	};
	//save data to cookie
	window.onbeforeunload = function  (e) {
		cookie.attr('history',$.toJSONString(history));
		cookie.attr('defaultType',currentType);	
		cookie.attr('defaultEngine',currentEngine);	
		cookie.attr('lang',lang);	
	};
	//switch lang
	$('#switch-lang').on('click','span',function  () {
		lang = $(this).attr('data');
		initApp(lang,currentType,currentEngine);
	});
	//setting panel
	$('#setting-icon').on('click',function  (event) {
		event.stopPropagation();
		$(this).addClass('current');
		$('#setting-panel').show();
		$('#bgimg').focus();
	});
	//set background image
	$('#set-bgimg').on('click',function  (event) {
		event.stopPropagation();
		var url = $('#bgimg').val(),
			img = new Image(),
			imgload,
			imgerror;
		imgload = function  () {
			$(document.body).css('background-image','url(' + url + ')');
			$('#bgimg').val('');
			cookie.attr('bgimg',url);
			$('#setting-icon').removeClass('current');
			$('#setting-panel').hide();
			$('.search-wrapper,.appinfo').addClass('trsprt-bg');
			img = null;
		};
		imgerror = function  () {
			$(document.body).css('background-image','');
			cookie.attr('bgimg','');
			$('.search-wrapper,.appinfo').removeClass('trsprt-bg');
			$('#imgerror-tip').html(config.imgloaderror[cookie.attr('lang')]).show();
			setTimeout(function() {$('#imgerror-tip').hide();}, 2000);
			img = null;
		};
		img.onerror = imgerror;
		img.onload = imgload;
		if (url) {
			img.src = url;
		}
	});
	$('#bgimg').on('keydown',function  (event) {
		if (event.keyCode === 13) {
			$('#set-bgimg').click();
			return false;
		}
	});
	$('#setting-panel').on('click',function  (event) {
		event.stopPropagation();
	});
	//input box value change realtime event
	$('#isa').on('input propertychange',function  (event) {
		if ('' === $(this).val()) {
			$('#ph').show();
			val = '';
			if(!isArrowKey)	$('#sug').html(getHistoryList()).hide();
		} else{
			$('#ph').hide();
			if (!isArrowKey && val != $(this).val()) {
				val = $(this).val();
				getSuggestion (val,currentType);
			}
		}
	});
	//input box direction key and other controller key event
	$('#isa').on('keydown',function  (event) {
		var ret = true,
			newIndex = 0,
			text = '',
			$sug = $('#sug'),
			$ph = $('#ph');
		isArrowKey = false;
		switch(event.keyCode){
			case 9: //Tab
				var llen,index;
				if (event.shiftKey) {
					llen = $('#search-cat li').length;
					index = $('#search-cat li input:checked').parents('li').index() | 0;
					++index;
					index %= llen;
					$('#search-cat li:eq(' + index + ') label').click();
					$('#isa').focus();
				} else{
					llen = $('.' + currentType + ' li').length;
					index = $('.' + currentType + ' li.current').index() | 0;
					++index;
					index %= llen;
					$('.' + currentType + ' li:eq(' + index + ')').click();
				}
				ret = false;
				break;
			case 27: //esc
				$sug.hide();
				ret = false;
				break;
			case 38: //up
				if (!len) return ret;
				isArrowKey = true;
				$sug.show();
				$ph.hide();
				newIndex = currentIndex - 1;
				if (newIndex < -1 ) {
					newIndex = len - 1;
				}
				$('#sug li:eq('+ currentIndex + ')').removeClass('current');
				text = (-1 == newIndex) ? val : $('#sug li:eq('+ newIndex + ')').addClass('current').text();
				$(this).val(text);
				if (text === '') $('#ph').show();
				currentIndex = newIndex;
				ret = false;
				break;
			case 40: //down
				if (!len) return ret;
				isArrowKey = true;
				$sug.show();
				$ph.hide();
				newIndex = currentIndex + 1;
				if (newIndex >= len ) {
					newIndex = -1;
				}
				$('#sug li:eq('+ currentIndex + ')').removeClass('current');
				text = (-1 == newIndex) ? val : $('#sug li:eq('+ newIndex + ')').addClass('current').text();
				$(this).val(text);
				if (text === '') $('#ph').show();
				currentIndex = newIndex;
				ret = false;
				break;
			default:
				break;
		}
		return ret;
	});
	//sug list hover event
	$('#sug').on('hover','li',function  () {
		var newIndex = $(this).index();
		if (newIndex === currentIndex) {
			$(this).addClass('current');
		} else{
			$('#sug li:eq('+ currentIndex + ')').removeClass('current');
			$('#sug li:eq('+ newIndex + ')').addClass('current');
			currentIndex = newIndex;
		}
	});
	//sug list item click
	$('#sug').on('click','li',function  (event) {
		console.log(event);
		if (event.srcElement.id == 'clear-history') {
			history = [];
			len = 0;
			$('#sug').html('').hide();
			$('#isa').focus();
			return false;
		}
		val = $(this).html();
		$('#isa').val(val);
		$('#search-form').submit();
	});
	//switch search type
	$('#search-cat').on('click','li label',function  () {
		var radio = $(this).children('input');
		if(currentType != radio.val()){
			$('#search-engine-list .' + currentType + ' li.current').removeClass('current');
			$('#search-engine-list .' + currentType).removeClass('current');
			$('#ico').removeClass('ico-' + currentType);
			currentType = radio.val();
			$('#ico').addClass('ico-' + currentType);
			$('#search-engine-list .' + currentType).addClass('current');
			currentEngine = $('#search-engine-list .' + currentType + ' li:eq(0)').addClass('current').attr('data');
			changeSearchEngine(currentType,currentEngine);
		}
		$('#isa').focus();
	});
	//switch search engine
	$('#search-engine-list').on('click','ul li',function  () {
		if (currentEngine != $(this).attr('data')) {
			$('#search-engine-list ul li.current').removeClass('current');
			currentEngine = $(this).addClass('current').attr('data');
			changeSearchEngine(currentType,currentEngine);
		}
		$('#isa').focus();
	});
	//search submit
	$('#search-form').on('submit',function  () {
		// $('#sug').hide();
		val = $('#isa').val();
		if ('' === val) {
			return false;
		}else if (' ' === val ||
			currentEngine === 'qiyi' ||
			(currentType === 'map' && currentEngine === 'baidu')) {
			var href;
			if(currentEngine === 'qiyi'){
				href = $('#search-form').attr('action') + 'q_';
				href += encodeURIComponent(val);
				$('#link').attr('href',href);
			} else if(currentEngine === 'baidu') {
				href = $('#search-form').attr('action') + '?newmap=1&ie=utf-8&s=s%26wd%3D';
				href += encodeURIComponent(val) + '%26c%3D1';
				$('#link').attr('href',href);
			}
			$('#link')[0].click();
			return false;
		} else{
			var i = 0,
				length = history.length;
			for (; i < length; ++i) {
				if (val == history[i]) {
					if (i != 0) {
						history.splice(i,1);
						history.unshift(val);
					}
					break;
				}
			}
			if (i == length) {
				if(length > 9){
					history.splice(9,length - 10);
				}
				history.unshift(val);
			}
			return true;
		}
	});
});


