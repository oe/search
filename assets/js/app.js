var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

$(function() {
  var adjustUrl, changeLang, changeSearchEngine, cookie, currentEngineType, getSuggestion, searchHistory, setSugPos, showSuggestion, toJSONString;
  currentEngineType = '';
  $.toJSONString = (window.JSON && window.JSON.stringify) || (toJSONString = function(obj) {
    var arr, json, n, t, v;
    t = typeof obj;
    if (t !== "object" || obj === null) {
      if (t === "string") {
        obj = '"' + obj + '"';
      }
      return String(obj);
    } else {
      json = [];
      arr = obj && obj.constructor === Array;
      for (n in obj) {
        v = obj[n];
        t = typeof v;
        if (t === 'string') {
          v = '"' + v + '"';
        } else {
          if (t === 'object' && v !== null) {
            v = toJSONString(v);
          }
        }
        json.push((arr ? '' : '"' + n + '"') + String(v));
      }
      if (arr) {
        return '[' + String(json) + ']';
      } else {
        return '{' + String(json) + '}';
      }
    }
  });
  cookie = {
    _cookie: (function() {
      var cookieArr, obj, pair, v, _i, _len;
      obj = {};
      cookieArr = document.cookie.split('; ');
      for (_i = 0, _len = cookieArr.length; _i < _len; _i++) {
        v = cookieArr[_i];
        pair = v.split('=');
        obj[pair[0]] = unescape(pair[1]);
      }
      return obj;
    })(),
    attr: function(key, val, expire, path) {
      var date;
      if (val === void 0) {
        if (this._cookie[key] === void 0) {
          return void 0;
        } else {
          return this._cookie[key];
        }
      }
      if (expire === void 0) {
        expire = 'Sat, 19 Jan 2037 03:52:43 GMT';
      } else {
        date = new Date();
        date.setTime(date.getTime() + expire * 24 * 60 * 60 * 1000);
        date = date.toGMTString();
      }
      if (!path) {
        path = '/';
      }
      val = escape(val);
      document.cookie = "" + key + "=" + val + ";expires=" + expire + ";path=" + path;
      this._cookie[key] = val;
      return this._cookie;
    },
    remove: function(key) {
      var date, val;
      val = this._cookie[key];
      if (val != null) {
        date = new Date();
        date.setTime(date.getTime - 1);
        document.cookie = "" + key + "=" + val + ";expires=" + (date.toGMTString());
      }
      return this._cookie;
    }
  };
  searchHistory = {
    _MAX: 10,
    _history: (function() {
      var hsty;
      hsty = cookie.attr('history');
      return hsty = hsty ? $.parseJSON(hsty) : [];
    })(),
    add: function(kwd) {
      if (__indexOf.call(this._history, kwd) < 0) {
        this._history.unshift(kwd);
        if (this._history.length > this._MAX) {
          this._history.pop();
        }
        cookie.attr('history', $.toJSONString(this._history));
      }
      console.log(this._history);
      return this;
    },
    clear: function() {
      this._history.length = 0;
      cookie.attr('history', $.toJSONString(this._history));
      return this;
    },
    get: function() {
      return this._history;
    }
  };
  changeLang = function(lang) {
    var cls, langArr;
    langArr = ['en', 'zh'];
    if (langArr.indexOf(lang) > -1) {
      cls = document.documentElement.className.replace(/lang\-[a-z]+/, '');
      cls += " lang-" + lang;
      document.documentElement.className = cls.replace(/^\s+|\s+$/g, '');
      return cookie != null ? cookie.attr('lang', lang) : void 0;
    }
  };
  setSugPos = function() {
    $('#sug').css({
      'top': $('.search-form').offset().top + $('.search-form').height(),
      'left': $('.search-form').offset().left
    });
  };
  /**
   * show keyword suggestion list
   * @param  {String} kwd            关键字
   * @param  {Array}  data           百度建议的关键字列表
   * @param  {Boolean} showAllHistory 是否显示所有搜索历史
   * @return {undefined}                无返回值
  */

  showSuggestion = function(kwd, data, showAllHistory) {
    var $sug, $suglist, MAX, len, listHtml, shistory, v, _i, _j, _k, _len, _len1, _len2;
    MAX = 10;
    $sug = $('#sug');
    $suglist = $('#suglist');
    $suglist.html('');
    len = 0;
    shistory = searchHistory.get();
    listHtml = '';
    if (showAllHistory) {
      for (_i = 0, _len = shistory.length; _i < _len; _i++) {
        v = shistory[_i];
        if (len >= MAX) {
          break;
        }
        ++len;
        listHtml += "<li>" + v + "</li>";
      }
    } else {
      for (_j = 0, _len1 = shistory.length; _j < _len1; _j++) {
        v = shistory[_j];
        if (len >= MAX) {
          break;
        }
        if (v.indexOf(kwd) > -1) {
          ++len;
          listHtml += "<li class='s-h'>" + v + "</li>";
        }
      }
    }
    if (data && len < MAX) {
      for (_k = 0, _len2 = data.length; _k < _len2; _k++) {
        v = data[_k];
        ++len;
        listHtml += "<li>" + v + "</li>";
        if (len >= MAX) {
          break;
        }
      }
    }
    if (len) {
      $suglist.html(listHtml);
      $sug.show();
    } else {
      $sug.hide();
    }
  };
  getSuggestion = function(kwd, type, cb) {
    var e, url, urlTbl;
    urlTbl = {
      'search': 'http://suggestion.baidu.com/su?wd=@&p=3&cb=?',
      'music': 'http://nssug.baidu.com/su?wd=@&prod=mp3&cb=?',
      'video': 'http://nssug.baidu.com/su?wd=@&prod=video&cb=?',
      'question': 'http://nssug.baidu.com/su?wd=@&prod=zhidao&cb=?',
      'image': 'http://nssug.baidu.com/su?wd=@&ie=utf-8&prod=image&cb=?',
      'map': 'http://map.baidu.com/su?wd=@&ie=utf-8&cid=1&type=0&newmap=1&callback=?',
      'doc': 'http://nssug.baidu.com/su?wd=@&prod=wenku&oe=utf-8&cb=?',
      'shop': 'http://suggest.taobao.com/sug?area=etao&code=utf-8&q=@&callback=?'
    };
    url = urlTbl[type];
    if (!url) {
      if (typeof cb === "function") {
        cb(kwd);
      }
      return;
    }
    if (type === '' || (type == null)) {
      if (typeof cb === "function") {
        cb(kwd);
      }
      return;
    }
    url = url.replace('@', encodeURIComponent(kwd));
    try {
      $.getJSON(url, function(res) {
        var data, i, _i, _j, _len, _len1, _ref, _ref1;
        data = [];
        switch (type) {
          case 'shop':
            _ref = res.result;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              i = _ref[_i];
              data.push(i[0]);
            }
            break;
          case 'map':
            _ref1 = res.s;
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              i = _ref1[_j];
              data.push(i.replace(/(\$)|(\d*$)/g, ' '));
            }
            break;
          default:
            data = res.s;
        }
        if (typeof cb === "function") {
          cb(kwd, data);
        }
      });
    } catch (_error) {
      e = _error;
      if (typeof cb === "function") {
        cb(kwd);
      }
    }
  };
  adjustUrl = function(url) {
    var gHosts;
    gHosts = ['64.233.168.97', '173.194.124.55', '74.125.110.236', '173.194.21.233', '173.194.124.108'];
    if (url.indexOf('www.google.com') > -1) {
      return url.replace('www.google.com', gHosts[Math.floor(gHosts.length * Math.random())]);
    } else {
      return url;
    }
  };
  changeSearchEngine = function(engineName, typeName) {
    var $engineList, $form, $newEngine, $newType, data, hiddens, html, k, v;
    $engineList = $('#search-engine-list');
    if (typeName != null) {
      $newType = $engineList.find(">ul[data-engine-type='" + typeName + "']");
    }
    if (!typeName || !$newType.length) {
      $newType = $engineList.find(">ul.current");
      if (!$newType.length) {
        $newType = $engineList.find('>ul:first');
      }
    }
    typeName = $newType.data('engine-type');
    $("#search-cat>li[data-type='" + typeName + "'] input").prop('checked', true);
    $engineList.find('>ul.current').removeClass('current');
    $newType.addClass('current');
    if (engineName != null) {
      $newEngine = $newType.find(">li[data-engine-name='" + engineName + "']");
    }
    if (!engineName || !$newEngine.length) {
      $newEngine = $newType.find('>li.current');
      if (!$newEngine.length) {
        $newEngine = $newType.find('>li:first');
      }
    }
    engineName = $newEngine.data('engine-name');
    $newType.find('>li.current').removeClass('current');
    $newEngine.addClass('current');
    $form = $('#search-form');
    data = $newEngine.data();
    $form.attr('accept-charset', data['charset'] || 'utf-8');
    $form.attr('action', data['url']);
    $form.attr('origin-action', data['url']);
    $('#isa').attr('name', data['key']);
    $('#link').attr('href', data['link']);
    $('#link').attr('origin-href', data['link']);
    hiddens = data.hiddens;
    html = '';
    if (hiddens) {
      for (k in hiddens) {
        v = hiddens[k];
        html += "<input type='hidden' name='" + k + "' value='" + v + "'>";
      }
    }
    $('#hiddens').html(html);
    cookie.attr('defaultType', typeName);
    cookie.attr('defaultEngine', engineName);
    currentEngineType = typeName;
  };
  $('#search-engine-list').on('click', 'li', function(e) {
    var $this;
    $this = $(this);
    if (!$this.hasClass('current')) {
      changeSearchEngine($this.data('engine-name'));
    }
    $('#isa').focus();
    e.stopPropagation();
    return false;
  });
  $('#search-cat').on('click', 'input', function(e) {
    var $this;
    $this = $(this);
    changeSearchEngine(null, $this.closest('li').data('type'));
    $('#isa').focus();
    e.stopPropagation();
  });
  $('#search-form').on('submit', function(e) {
    var $link, $this, val;
    val = $('#isa').val();
    if (val === ' ') {
      $link = $('#link');
      $link.attr('href', adjustUrl($link.attr('origin-href')));
      $link[0].click();
      return false;
    } else if (val === '') {
      return false;
    } else {
      searchHistory.add(val);
      $this = $(this);
      $this.attr('action', adjustUrl($this.attr('origin-action')));
    }
  });
  $('#isa').on('focus', function(e) {
    e.stopPropagation();
    $('#isa,#search-btn').addClass('box-shadow');
  });
  $('#search-wrapper').on('click', function(e) {
    e.stopPropagation();
    $('#isa').focus();
  });
  $(document).on('click', function(e) {
    $('#isa,#search-btn').removeClass('box-shadow');
  });
  $('#isa').on('input propertychange', function(e) {
    var val;
    val = $(this).val();
    if (val === '') {
      $('#ph').show();
    } else {
      $('#ph').hide();
      if ($.trim(val) !== '') {
        getSuggestion(val, currentEngineType, showSuggestion);
      }
    }
  });
  $('#clear-history').on('click', function(e) {
    searchHistory.clear();
    $('#suglist').html('');
    $('#sug').hide();
    $('#isa').focus();
  });
  $('#isa').on('keydown', function(e) {
    var $engineList, $nextEngine;
    e.stopPropagation();
    if (e.keyCode === 9) {
      if (e.shiftKey) {
        $engineList = $('#search-cat');
        $nextEngine = $engineList.find('>li input:checked').closest('li').next();
        if (!$nextEngine.length) {
          $nextEngine = $engineList.find('>li:first');
        }
        $nextEngine.find('input').trigger('click');
      } else {
        $engineList = $('#search-engine-list ul.current');
        $nextEngine = $engineList.find('>li.current').next();
        if (!$nextEngine.length) {
          $nextEngine = $engineList.find('>li:first');
        }
        $nextEngine.trigger('click');
      }
      e.preventDefault();
    }
  });
  $('#ph').on('click', function(e) {
    $('#isa').focus();
    return false;
  });
  $(document).on('keydown', function(e) {
    if (e.keyCode === 36 || e.keyCode === 83) {
      $('#isa').focus();
      return false;
    }
  });
  $('#switch-lang').on('click', 'b', function() {
    changeLang($(this).attr('lang'));
  });
  $(window).on('resize', function() {
    setSugPos();
  });
  $(window).on('focus', function() {
    $('#isa').focus();
  });
  (function() {
    var lang;
    lang = cookie.attr('lang');
    if (lang === void 0) {
      lang = window.navigator.language != null ? window.navigator.language : window.navigator.browserLanguage;
      lang = lang.toLowerCase() === 'zh-cn' ? 'zh' : 'en';
    }
    changeLang(lang);
    changeSearchEngine(cookie.attr('defaultEngine'), cookie.attr('defaultType'));
    setTimeout(function() {
      $('#isa').focus();
    }, 0);
    setSugPos();
  })();
});

 //# sourceMappingURL=app.js.map