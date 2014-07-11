(function() {
  var getLan, obj2String, tpl;
  obj2String = function(obj) {
    if (obj) {
      return JSON.stringify(obj);
    } else {
      return '';
    }
  };
  getLan = function(opt) {
    return "<span class='en'>" + opt.en + "</span><span class='zh'>" + opt.zh + "</span>";
  };
  tpl = '<div class="setting-container">\n  <div id="switch-lang" class="switch-lang">\n    {{=getLan(config.langswitch)}}\n  </div>\n  <div class="setting-icon" id="setting-icon">☸</div>\n  <div class="setting-panel" id="setting-panel">\n    <div id="setting-tip" class="setting-tip">\n      <a href="http://desk.zol.com.cn" target="_blank">\n        {{=getLan(config.setBgimg)}}\n      </a>\n    </div>\n    <input type="text" id="bgimg">\n    <input type="button" value="OK" id="set-bgimg">\n    <div id="imgerror-tip" class="imgerror-tip">\n      {{=getLan(config.imgloaderror)}}\n    </div>\n  </div>\n</div>\n<div class="search-container">\n  <div class="search-wrapper" id="search-wrapper">\n    <div class="app-name">{{=getLan(config.title)}}</div>\n    <div class="search-engine-list clearfix" id="search-engine-list">\n      {{ var cur = true; _.each(config.searches, function(val, key){ }}\n        <ul data-engine-type="{{=key}}" class="{{=cur ? \'current\' : \'\'}}">\n          {{ _.each(val.engines, function(v, k){ }}\n            <li class="{{=cur ? \'current\' : \'\'}}" data-engine-name="{{=k}}" data-link="{{=v.link}}" data-key="{{=v.key}}" data-charset="{{=v.charset||\'utf-8\'}}" data-url="{{=v.url}}" data-hiddens=\'{{=obj2String(v.hiddens)}}\'>\n              {{ cur = false; }}\n              {{=getLan(v)}}\n            </li>\n          {{ }) }}\n        </ul>\n      {{ }) }}\n    </div>\n    <form class="search-form clearfix" id="search-form" target="_blank" accept-charset="utf-8">\n      <div class="hide" id="hiddens"></div>\n      <div class="input">\n        <span class="ico ico-search" id="ico"></span>\n        <input type="text" class="input-box" name="q" id="isa" autocomplete="off" autofocus speech="speech" x-webkit-speech="x-webkit-speech" x-webkit-grammar="builtin:search">\n        <button class="submit" type="submit" id="search-btn">{{=getLan(config.submit)}}</button>\n        <label class="ph" for="isa" id="ph">{{=getLan(config.placeholder)}}</label>\n      </div>\n    </form>\n    <div class="hide">\n      <a href="https://www.google.com" id="link" rel="noreferrer" target="_blank"></a>\n    </div>\n    <ul class="search-cat clearfix" id="search-cat">\n      {{ cur = true; _.each(config.searches, function(val, key){ }}\n        <li data-type="{{=key}}"><label>\n          <input type="radio" name="type" {{=cur? \'checked\': \'\'}}>\n          {{ cur = false; }}\n          {{=getLan(val)}}\n        </label></li>\n      {{ }) }}\n    </ul>\n  </div>\n</div>\n<div class="setting-mask" id="setting-mask"></div>\n<div class="appinfo">\n  Copyright © <a href="http://www.evecalm.com" target="_blank">夏影 ❤ 2011-{{=new Date().getFullYear()}}</a> <a href="http://www.evecalm.com/2013/04/union-search.html" target="_blank">Help/Feedback</a>\n</div>';
  return document.getElementById('content').innerHTML = _.template(tpl, {
    config: config,
    obj2String: obj2String,
    getLan: getLan
  });
})();

 //# sourceMappingURL=tpl.js.map