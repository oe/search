
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
	searchSug = 'baidu',
	val = '',
	lang = 'zh',
	config = null,
	currentType = '',
	currentEngine = '';
//init
$(function  () {
	$('#isa').focus();
	cookie.init();
	init_argv();
	init_SearchList();
	set_sug_pos();
	//hide sug list
	$(document).on('click',function  () {
		$('#sug').hide();
	});
	//reset sug list pos
	$(window).on('resize',function  () {
		set_sug_pos();
	});
	//placeholder behavior
	$('#ph').on('mousedown focus',function  () {
		$('#isa').focus();
		return false;
	});
	//switch lang
	$('#switch-lang').on('click','span',function  () {
		var lang = $(this).attr('data');
		cookie.setlang(lang);
		init_SearchList();
	});
	//input box value change realtime event
	$('#isa').on('input propertychange',function  () {
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
	//input box foucus & click event
	$('#isa').on('focus click',function  (event) {
		event.stopPropagation();
		$('#isa,#submit').addClass('box-shadow');
	});
	//input box blur event
	$('#isa').on('blur',function  () {
		$('#isa,#submit').removeClass('box-shadow');
	});
	//input box direction key and esc key event
	$('#isa').on('keydown',function  (event) {
		var ret = true;
		isArrowKey = false;
		if (len) {
			var newIndex = 0;
			var text = '';
			switch(event.keyCode){
				case 27: //esc
					$('#sug').hide();
					ret = false;
					break;
				case 38: //up
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
					isArrowKey = true;
					$('#sug').show();
					$('#ph').hide();
					newIndex = currentIndex + 1;
					if (newIndex >= len ) {
						newIndex = -1;
					}
					$('#sug li:eq('+ currentIndex + ')').removeClass('current');
					text = (-1 == newIndex) ? val : $('#sug li:eq('+ newIndex + ')').addClass('current').text();
					// val = text;
					$(this).val(text);
					currentIndex = newIndex;
					ret = false;
					break;
				default:
					break;
			}
		}else{
			if (13 == event.keyCode) {
				$('#search-form').submit();
				ret = false;
			}
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
		// event.stopPropagation();
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
			alert('No input!');
			return false;
		}else if (' ' === val) {
			$('#link')[0].click();
			return false;
		} else{
			return true;
		}
	});
});
//get sug list
function getSug (word) {
	searchSug = searchSug.toLowerCase();
	word = encodeURIComponent(word);
	if (suggestionFun[searchSug]) {
		try{
			suggestionFun[searchSug](word)
		}catch(e){
			len = 0;
		}
	}
	currentIndex = -1;
}
var suggestionFun = {
	'baidu': function  (word) {
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
	'google': function  (word) {
		var url = 'http://www.google.com.hk/s?hl=zh-cn&sugexp=llsin&q=' + word + '&call=?';
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
	'youdao': function  (word) {
		var url = 'http://www.youdao.com/tglsuggest2/tglsuggest.s?keyfrom=web.index.suggest&rn=10&h=17&query=' + word + '&o=?';
		$.getJSON(url,function  (json) {
			len = json.song.length;
			var str = '';
			for( var i = 0; i < len; ++i){
				str += '<li>' + json.song[i].songname +' <i>by</i> ' + json.song[i].artistname + '</li>';
			}
			$('#sug').html(str);
			if (len) {
				$('#sug').show();
			} else{
				$('#sug').hide();
			}
		});
	},
	'baidumusic': function  (word) {
		var url = 'http://sug.music.baidu.com/info/suggestion?format=json&word=' + word + '&callback=?';
		$.getJSON(url,function  (json) {
			len = json.song.length;
			var str = '';
			for( var i = 0; i < len; ++i){
				str += '<li>' + json.song[i].songname +' <i>by</i> ' + json.song[i].artistname + '</li>';
			}
			$('#sug').html(str);
			if (len) {
				$('#sug').show();
			} else{
				$('#sug').hide();
			}
		});
	},
	'bing': function  (word) {
		// body...
	},
	'so': function  (word) {
		// body...
	},
	'etao': function  (word) {
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
	},
	'amazon': function  (word) {
		// body...
	},
	'360buy': function  (word) {
		// body...
	},
	'soku': function  (word) {
		// body...
	}
};

function init_argv () {
	currentType = cookie.attr('defaultType');
	currentEngine = cookie.attr('defaultEngine');
}
//init app
function init_SearchList () {
	try{
		config = $.ajax({url:'assets/se.json',async:false}).responseText;
		config = $.parseJSON(config);
		var lists = '';
		var types = '';
		var current = '';
		var lang = cookie.attr('lang');
		var ph = config['placeholder'][lang];
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
		if (0 === $('#search-cat input:checked').length) {
			//TODO
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