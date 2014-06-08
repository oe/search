do ->
  obj2String = (obj)->
    if not obj
      return ''
    res = []
    for own k, v of obj
      res.push '"' + k + '":"' + v + '"'
    '{' + res.join(',') + '}'

  tpl = '''
  <div class="setting-container">
    <div id="switch-lang" class="switch-lang">
      <span class="en">English/<b>中文</b></span>
      <span class="zh"><b>English</b>/中文</span>
    </div>
    <div class="setting-icon" id="setting-icon">☸</div>
    <div class="setting-panel" id="setting-panel">
      <div id="setting-tip" class="setting-tip">
        <a href="http://desk.zol.com.cn" target="_blank">
          <span class="en">Set bg-img</span><span class="zh">设置背景图片</span>
        </a>
      </div>
      <input type="text" id="bgimg">
      <input type="button" value="OK" id="set-bgimg">
      <div id="imgerror-tip" class="imgerror-tip">
        <span class="en">{{=config.imgloaderror.en}}</span><span class="zh">{{=config.imgloaderror.zh}}</span>
      </div>
    </div>
  </div>
  <div class="search-container">
    <div class="search-wrapper" id="search-wrapper">
      <div class="app-name"><span class="en">{{=config.title.en}}</span><span class="zh">{{=config.title.zh}}</span></div>
      <div class="search-engine-list clearfix" id="search-engine-list">
        {{ var cur = true; _.each(config.searches, function(val, key){ }}
          <ul data-engine-type="{{=key}}" class="{{=cur ? 'current' : ''}}">
            {{ _.each(val.engines, function(v, k){ }}
              <li class="{{=cur ? 'current' : ''}}" data-engine-name="{{=k}}" data-link="{{=v.link}}" data-key="{{=v.key}}" data-charset="{{=v.charset||'utf-8'}}" data-url="{{=v.url}}" data-hiddens="{{=obj2String(v.hiddens)}}">
                {{ cur = false; }}
                <span class="en">{{=v.en}}</span><span class="zh">{{=v.zh}}</span>
              </li>
            {{ }) }}
          </ul>
        {{ }) }}
      </div>
      <form action="https://www.google.com/search" class="search-form clearfix" id="search-form" target="_blank" accept-charset="utf-8">
        <div class="hide" id="hiddens"></div>
        <div class="input">
          <span class="ico ico-search" id="ico"></span>
          <input type="text" class="input-box box-shadow" name="q" id="isa" autocomplete="off" autofocus speech="speech" x-webkit-speech="x-webkit-speech" x-webkit-grammar="builtin:search">
          <button class="submit box-shadow" type="submit" id="search-btn"><span class="en">{{=config.submit.en}}</span><span class="zh">{{=config.submit.zh}}</span></button>
          <label class="ph" for="isa" id="ph"><span class="en">{{=config.placeholder.en}}</span><span class="zh">{{=config.placeholder.zh}}</span></label>
        </div>
      </form>
      <div class="hide">
        <a href="https://www.google.com" id="link" rel="noreferrer" target="_blank"></a>
      </div>
      <ul class="search-cat clearfix" id="search-cat">
        {{ cur = true; _.each(config.searches, function(val, key){ }}
          <li><label>
            <input type="radio" name="type" value="{{=key}}" {{=cur? 'checked': ''}}>
            {{ cur = false; }}
            <span class="en">{{=val.en}}</span><span class="zh">{{=val.zh}}</span>
          </label></li>
        {{ }) }}
      </ul>
    </div>
  </div>
  <div class="setting-mask" id="setting-mask"></div>
  <div class="appinfo">
    Copyright © <a href="http://www.evecalm.com" target="_blank">夏影 ❤ 2011-{{=new Date().getFullYear()}}</a> <a href="http://www.evecalm.com/2013/04/union-search.html" target="_blank">Help/Feedback</a>
  </div>
  '''

  document.getElementById('content').innerHTML = _.template tpl, config:config,obj2String:obj2String






