
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
			if ('zh-CN' === lang) {
				return this.attr('lang','zh');
			} else{
				return this.attr('lang','en');
			}
		}
		return this.attr('lang',lang);
	}
};
//length for sug list
var len = 0;
var currentIndex = -1;
var isArrorKey = false;
var searchSug = 'baidu';
var val = '';
var lang = 'zh';
var config = null;
var currentType = '';
var currentEngine = '';
//init
$(function  () {
	$('#isa').focus();
	cookie.init();
	init_argure();
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
	// $.ctrl = function(key, callback, args){  
	//     var isCtrl = false;  
	//     $(document).keydown(function(e){  
	//         if (e.which === 17)   
	//             isCtrl = true;  
	//         if (e.which === key.charCodeAt(0) && isCtrl === true) {  
	//             callback.apply(this, args);  
	//             return false;  
	//         }  
	//     }).keyup(function(e){  
	//         if (e.which === 17)   
	//             isCtrl = false;  
	//     });  
	// };
	// $.ctrl('q',function  () {
	// 	$('#isa').focus();
	// },null);
	// $(document).on('keydown',function  (e) {
	// 	e = e || event;
	// 	var isCtrl = false;
	// 	if (e.which === 17) {
	// 	    isCtrl = true;
	// 	}
	// 	// alert(e.ctrlKey);
	// 	// var isCtrl = e.ctrlKey;
	// 	if (isCtrl && (113 === e.which)) {
	// 	    $('#isa').focus();
	// 	}
	// });
	//placeholder behavior
	$('#ph').on('mousedown focus select',function  () {
		$('#isa').focus();
		return false;
	});
	//switch lang
	$('#switch-lang span').live('click',function  () {
		var lang = $(this).attr('data');
		cookie.setlang(lang);
		init_SearchList();
	});
	//input box value change realtime event
	$('#isa').on('input propertychange',function  () {
		if ('' === $(this).val()) {
			$('#ph').show();
			$('#sug').hide();
			// if ($('#isa').hasClass('delete')) {
			// 	$('#isa').removeClass('delete');
			// }
			// $('#delete').removeClass('show');
			val = '';
		} else{
			// $('#delete').addClass('show');
			// if (!$('#isa').hasClass('delete')) {
			// 	$('#isa').addClass('delete');
			// }
			$('#ph').hide();
			if (!isArrorKey) {
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
		isArrorKey = false;
		if (len) {
			var newIndex = 0;
			var text = '';
			switch(event.keyCode){
				case 13:
					$('#search-form').submit();
					ret = false;
					break;
				case 27:
					$('#sug').hide();
					ret = false;
					break;
				case 38:
					isArrorKey = true;
					$('#sug').show();
					$('#ph').hide();
					newIndex = currentIndex - 1;
					if (newIndex < -1 ) {
						newIndex = len - 1;
					}
					$('#sug li:eq('+ currentIndex + ')').removeClass('current');
					text = (-1 == newIndex) ? val : $('#sug li:eq('+ newIndex + ')').addClass('current').text();
					// val = text;
					$(this).val(text);
					currentIndex = newIndex;
					ret = false;
					break;
				case 40:
					isArrorKey = true;
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
	$('#sug li').live('hover',function  () {
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
	$('#sug li').live('click',function  (event) {
		// event.stopPropagation();
		val = $(this).html();
		$('#isa').val(val);
		submit_search();
	});
	//switch search type
	$('#search-cat li label').live('click',function  () {
		var radio = $(this).children('input');
		if(currentType != radio.val()){
			$('#search-list .' + currentType + ' li.current').removeClass('current');
			$('#search-list .' + currentType).removeClass('current');
			$('#ico').removeClass('ico-' + currentType);
			currentType = radio.val();
			$('#ico').addClass('ico-' + currentType);
			$('#search-list .' + currentType).addClass('current');
			currentEngine = $('#search-list .' + currentType + ' li:eq(0)').addClass('current').attr('data');
			changeSearchEngine();
		}
		$('#isa').focus();
	});
	//switch search engine
	$('#search-list ul li').live('click',function  () {
		if (currentEngine != $(this).attr('data')) {
			$('#search-list ul li.current').removeClass('current');
			currentEngine = $(this).addClass('current').attr('data');
			changeSearchEngine();
		}
		$('#isa').focus();
	});
	//search submit
	$('#search-form').on('submit',function  () {
		return submit_search();
	});
});
//get sug list
function getSug (str) {
	var url = '';
	var metod = null;
	searchSug = searchSug.toLowerCase();
	switch(searchSug){
		case 'baidu':
			url = 'http://suggestion.baidu.com/su?wd=' + str + '&p=3&cb=?';
			method = parse_baidu;
			break;
		case 'google':
			url = 'http://www.google.com.hk/s?hl=zh-cn&sugexp=llsin&q=' + str + '&call=?';
			method = parse_google;
			break;
		case 'youdao':
			url = 'http://www.youdao.com/tglsuggest2/tglsuggest.s?keyfrom=web.index.suggest&rn=10&h=17&query=' + str + '&o=?';
			// url = 'http://www.youdao.com/suggest2/suggest.s?query=' + str + '&keyfrom=web.suggest&rn=10&o=?';
			method = parse_youdao;//.updateCall;
			break;
		case 'baidumusic':
			url = 'http://sug.music.baidu.com/info/suggestion?format=json&word='+ str +'&callback=?';
			method = parse_baiduMusic;
			break;
		case 'bing':
			break;
		case 'so':
			break;
		case 'etao':
			url = 'http://suggest.taobao.com/sug?area=etao&code=utf-8&q=' + str + '&callback=?';
			method = parse_etao;
			break;
		case 'amazon':
			break;
		case '360buy':
			break;
		case 'soku':
			break;
		default:
			len = 0;
			return;
	}
	try{
		$.getJSON(url,method);
	}catch(e){
		len = 0;
	}
	currentIndex = -1;
}
//sug list from baidu
function parse_baidu (json) {
	try{
		len = json.s.length;
		var str = '';
		for( var i = 0; i < len; ++i){
			str += '<li>' + json.s[i] + '</li>';
		}
		$('#sug').html(str);
	}catch(e){
		len = 0;
	}
	if (len) {
		$('#sug').show();
	} else{
		$('#sug').hide();
	}
}
//sug list from google
function parse_google (json) {
	try{
		len = json.s.length;
		var str = '';
		for( var i = 0; i < len; ++i){
			str += '<li>' + json.s[i] + '</li>';
		}
		$('#sug').html(str);
	}catch(e){
		len = 0;
	}
	if (len) {
		$('#sug').show();
	} else{
		$('#sug').hide();
	}
}
//parse baidu music sug list
function parse_baiduMusic (json) {
	try{
		len = json.song.length;
		var str = '';
		for( var i = 0; i < len; ++i){
			str += '<li>' + json.song[i].songname +' <i>by</i> ' + json.song[i].artistname + '</li>';
		}
		$('#sug').html(str);
	}catch(e){
		len = 0;
	}
	if (len) {
		$('#sug').show();
	} else{
		$('#sug').hide();
	}
}
//sug list from etao
function parse_etao  (json) {
	try{
		len = json.result.length;
		var str = '';
		for( var i = 0; i < len; ++i){
			str += '<li>' + json.result[i][0] + '</li>';
		}
		$('#sug').html(str);
	}catch(e){
		len = 0;
	}
	if (len) {
		$('#sug').show();
	} else{
		$('#sug').hide();
	}
}
function init_argure () {
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
		$('#ico').addClass('ico-' + currentType);
		$('#ph').html(ph);
		$('#search-list').html(lists);
		$('#search-cat').html(types);
		var $current = null;
		if(0 === $('#search-list .' + currentType).length){
			$current = $('#search-list ul:eq(0)');
			currentType = $current.attr('class');
			$current.addClass('current');
			cookie.attr('defaultType',currentType);
		}
		if (0 === $('#search-list .' + currentType + ' li.current').length) {
			$current = $('#search-list .' + currentType + ' li:eq(0)');
			currentEngine = $current.attr('data');
			$current.addClass('current');
			cookie.attr('defaultEngine',currentEngine);
		}
		if (0 === $('#search-cat input:checked').length) {
			
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
//submit form
function submit_search () {
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
	// return false;
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