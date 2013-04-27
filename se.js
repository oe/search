
//增加推荐网站，如搜索音乐时推荐 豆瓣电台，QQ电台等等
//增加搜索技巧

$.fn.selectRange = function(start, end) {
	return this.each(function() {
		if (this.setSelectionRange) {
			this.focus();
			this.setSelectionRange(start, end);
		} else if (this.createTextRange) {
			var range = this.createTextRange();
			range.collapse(true);
			range.moveEnd('character', end);
			range.moveStart('character', start);
			range.select();
		}
	});
};
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
//length for sug list
var len = 0,
	currentIndex = -1,
	isArrowKey = false,
	val = '',
	config = null,
	currentType = '',
	currentEngine = '';
//init
$(function  () {
	cookie.init();
	init_argv();
	init_SearchList();
	set_sug_pos();
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
	$(window).on('resize',function  () {
		set_sug_pos();
	});
	//window blur
	$(window).on('blur',function  () {
		$('#sug').hide();
	});
	//window focus
	$(window).on('focus',function  () {
		$('#isa').focus();
	});
	//switch lang
	$('#switch-lang').on('click','span',function  () {
		cookie.setlang($(this).attr('data'));
		init_SearchList();
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
			$('#sug').hide();
			val = '';
		} else{
			$('#ph').hide();
			if (!isArrowKey) {
				if(val != $(this).val()){
					val = $(this).val();
					getSug(val);
				}
			}
		}
	});
	//input box direction key and other controller key event
	$('#isa').on('keydown',function  (event) {
		var ret = true,
			newIndex = 0,
			text = '';
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
				$('#sug').hide();
				ret = false;
				break;
			case 38: //up
				if (!len) return ret;
				isArrowKey = true;
				$('#sug').show();
				$('#ph').hide();
				newIndex = currentIndex - 1;
				if (newIndex < -1 ) {
					newIndex = len - 1;
				}
				$('#sug li:eq('+ currentIndex + ')').removeClass('current');
				text = (-1 == newIndex) ? val : $('#sug li:eq('+ newIndex + ')').addClass('current').text();
				$(this).val(text);
				currentIndex = newIndex;
				ret = false;
				break;
			case 40: //down
				if (!len) return ret;
				isArrowKey = true;
				$('#sug').show();
				$('#ph').hide();
				newIndex = currentIndex + 1;
				if (newIndex >= len ) {
					newIndex = -1;
				}
				$('#sug li:eq('+ currentIndex + ')').removeClass('current');
				text = (-1 == newIndex) ? val : $('#sug li:eq('+ newIndex + ')').addClass('current').text();
				$(this).val(text);
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
			changeSearchEngine();
		}
		$('#isa').focus();
	});
	//switch search engine
	$('#search-engine-list').on('click','ul li',function  () {
		if (currentEngine != $(this).attr('data')) {
			$('#search-engine-list ul li.current').removeClass('current');
			currentEngine = $(this).addClass('current').attr('data');
			changeSearchEngine();
		}
		$('#isa').focus();
	});
	//search submit
	$('#search-form').on('submit',function  () {
		$('#sug').hide();
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
			return true;
		}
	});
});
//get sug list
function getSug (word) {
	word = encodeURIComponent(word);
	if (suggestionFun[currentType]) {
		try{
			suggestionFun[currentType](word);
		}catch(e){
			len = 0;
		}
	}
	currentIndex = -1;
}
var suggestionFun = {
	'search': function  (word) {
		var url = 'http://suggestion.baidu.com/su?wd=' + word + '&p=3&cb=?';
		$.getJSON(url,function  (json) {
			len = json.s.length;
			var str = '';
			for( var i = 0; i < len; ++i){
				str += '<li>' + json.s[i] + '</li>';
			}
			$('#sug').html(str);
			if (len) {
				$('#sug').show();
			} else{
				$('#sug').hide();
			}
		});
	},
	'music': function  (word) {
		var url = 'http://nssug.baidu.com/su?wd=' + word + '&prod=mp3&cb=?';
		$.getJSON(url,function  (json) {
			len = json.s.length;
			var str = '';
			for( var i = 0; i < len; ++i){
				str += '<li>' + json.s[i] + '</li>';
			}
			$('#sug').html(str);
			if (len) {
				$('#sug').show();
			} else{
				$('#sug').hide();
			}
		});
	},
	'video': function  (word) {
		var url = 'http://nssug.baidu.com/su?wd=' + word + '&prod=video&cb=?';
		$.getJSON(url,function  (json) {
			len = json.s.length;
			var str = '';
			for( var i = 0; i < len; ++i){
				str += '<li>' + json.s[i] + '</li>';
			}
			$('#sug').html(str);
			if (len) {
				$('#sug').show();
			} else{
				$('#sug').hide();
			}
		});
	},
	'question': function  (word) {
		var url = 'http://nssug.baidu.com/su?wd=' + word + '&prod=zhidao&cb=?';
		$.getJSON(url,function  (json) {
			len = json.s.length;
			var str = '';
			for( var i = 0; i < len; ++i){
				str += '<li>' + json.s[i] + '</li>';
			}
			$('#sug').html(str);
			if (len) {
				$('#sug').show();
			} else{
				$('#sug').hide();
			}
		});
	},
	'image': function  (word) {
		var url = 'http://nssug.baidu.com/su?wd=' + word + '&ie=utf-8&prod=image&cb=?';
		$.getJSON(url,function  (json) {
			len = json.s.length;
			var str = '';
			for( var i = 0; i < len; ++i){
				str += '<li>' + json.s[i] + '</li>';
			}
			$('#sug').html(str);
			if (len) {
				$('#sug').show();
			} else{
				$('#sug').hide();
			}
		});
	},
	'map': function  (word) {
		var url = 'http://map.baidu.com/su?wd=' + word + '&ie=utf-8&cid=1&type=0&newmap=1&callback=?';
		$.getJSON(url,function  (json) {
			len = json.s.length;
			var str = '',
				sugword;
			for( var i = 0; i < len; ++i){
				sugword = $.trim(json.s[i].replace(/\$/g,' '));
				sugword = $.trim(sugword.replace(/ \d*$/,''));
				str += '<li>' + sugword + '</li>';
			}
			$('#sug').html(str);
			if (len) {
				$('#sug').show();
			} else{
				$('#sug').hide();
			}
		});
	},
	'doc': function  (word) {
		var url = 'http://nssug.baidu.com/su?wd=' + word + '&prod=wenku&oe=utf-8&cb=?';
		$.getJSON(url,function  (json) {
			len = json.s.length;
			var str = '';
			for( var i = 0; i < len; ++i){
				str += '<li>' + json.s[i] + '</li>';
			}
			$('#sug').html(str);
			if (len) {
				$('#sug').show();
			} else{
				$('#sug').hide();
			}
		});
	},
	'shop': function  (word) {
		var url = 'http://suggest.taobao.com/sug?area=etao&code=utf-8&q=' + word + '&callback=?';
		$.getJSON(url,function  (json) {
			len = json.result.length;
			var str = '';
			for( var i = 0; i < len; ++i){
				str += '<li>' + json.result[i][0] + '</li>';
			}
			$('#sug').html(str);
			if (len) {
				$('#sug').show();
			} else{
				$('#sug').hide();
			}
		});
	}
};

function init_argv () {
	currentType = cookie.attr('defaultType');
	currentEngine = cookie.attr('defaultEngine');
}
//init app
function init_SearchList () {
	try{
		var lists = '',
			lang = cookie.attr('lang'),
			types = '',
			current = '',
			bgimg = cookie.attr('bgimg'),
			ph;
		config = $.ajax({url:'assets/se.json',async:false}).responseText;
		config = $.parseJSON(config);
		ph= config['placeholder'][lang];
		for (var key in config['searches']) {
			if (config['searches'].hasOwnProperty(key)) {
				current = (key == currentType) ? 'checked' : '';
				types += '<li><label><input type="radio" name="type" value="' + key + '" '+ current+'>' + config['searches'][key][lang] + '</label></li>';
				current = (key == currentType) ? ' current' : '';
				lists += '<ul class="'+ key + current +'">';
				keys = config['searches'][key]['engines'];
				for (var ke in keys) {
					if (keys.hasOwnProperty(ke)) {
						current = (ke == currentEngine && key == currentType) ? 'class="current"' : '';
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
		$('#ico').addClass('ico-' + currentType);
		$('#ph').html(ph);
		$('#search-btn').text(config['submit'][lang]);
		$('#search-engine-list').html(lists);
		$('#search-cat').html(types);
		var $current = null;
		if(0 === $('#search-engine-list .' + currentType).length){
			$current = $('#search-engine-list ul:eq(0)');
			currentType = $current.attr('class');
			$current.addClass('current');
			cookie.attr('defaultType',currentType);
		}
		if (0 === $('#search-engine-list .' + currentType + ' li.current').length) {
			$current = $('#search-engine-list .' + currentType + ' li:eq(0)');
			currentEngine = $current.attr('data');
			$current.addClass('current');
			cookie.attr('defaultEngine',currentEngine);
		}
		if (!$('#search-cat input:checked').length) {
			$('#search-cat li:eq(0) label').click();
		}
		changeSearchEngine();
	}catch(e){
		alert('init error!');
	}
}

//set sug list position
function set_sug_pos () {
	$('#sug').css({'top':$('.search-form').offset().top + $('.search-form').height(),'left':$('.search-form').offset().left});
}
//change engine type
function changeSearchEngine(){
	var engine = config['searches'][currentType]['engines'][currentEngine];
	$('#search-form').attr('accept-charset',engine['charset']);
	$('#search-form').attr('action',engine['url']);
	$('#isa').attr('name',engine['key']);
	var hiddens = '';
	for (var nn in engine['hiddens']){
		if (engine['hiddens'].hasOwnProperty(nn)) {
			hiddens += '<input type="hidden" name="' + nn + '" value="' + engine['hiddens'][nn] + '">';
		}
	}
	$('#hiddens').html(hiddens);
	$('#link').attr('href',engine['link']);
}