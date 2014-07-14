do ->
  obj2String = (obj)->
    if obj then JSON.stringify(obj) else ''
    # if not obj
    #   return ''
    # res = []
    # for own k, v of obj
    #   res.push '"' + k + '":"' + v + '"'
    # '{' + res.join(',') + '}'

  getLan = (opt)->
    "<span class='en'>#{opt.en}</span><span class='zh'>#{opt.zh}</span>"

  tpl = '''
  <div class="setting-container">
    <div id="switch-lang" class="switch-lang">
      {{=getLan(config.langswitch)}}
    </div>
    <div class="setting-icon" id="setting-icon">☸</div>
    <div class="setting-panel" id="setting-panel">
      <div id="setting-tip" class="setting-tip">
        <a href="http://desk.zol.com.cn" target="_blank">
          {{=getLan(config.setBgimg)}}
        </a>
      </div>
      <input type="text" id="bgimg">
      <input type="button" value="OK" id="set-bgimg">
      <div id="imgerror-tip" class="imgerror-tip">
        {{=getLan(config.imgloaderror)}}
      </div>
    </div>
  </div>
  <div class="search-container">
    <div class="search-wrapper" id="search-wrapper">
      <div class="app-name">{{=getLan(config.title)}}</div>
      <div class="search-engine-list clearfix" id="search-engine-list">
        {{ var cur = true; _.each(config.searches, function(val, key){ }}
          <ul data-engine-type="{{=key}}" class="{{=cur ? 'current' : ''}}">
            {{ _.each(val.engines, function(v, k){ }}
              <li class="{{=cur ? 'current' : ''}}" data-engine-name="{{=k}}" data-link="{{=v.link}}" data-key="{{=v.key}}" data-charset="{{=v.charset||'utf-8'}}" data-url="{{=v.url}}" data-hiddens='{{=obj2String(v.hiddens)}}'>
                {{ cur = false; }}
                {{=getLan(v)}}
              </li>
            {{ }) }}
          </ul>
        {{ }) }}
      </div>
      <form class="search-form clearfix" id="search-form" target="_blank" accept-charset="utf-8">
        <div class="hide" id="hiddens"></div>
        <div class="input">
          <span class="ico ico-search" id="ico"></span>
          <input type="text" class="input-box" name="q" id="isa" autocomplete="off" autofocus speech="speech" x-webkit-speech="x-webkit-speech" x-webkit-grammar="builtin:search">
          <button class="submit" type="submit" id="search-btn">{{=getLan(config.submit)}}</button>
          <label class="ph" for="isa" id="ph">{{=getLan(config.placeholder)}}</label>
        </div>
      </form>
      <div class="hide">
        <a href="https://www.google.com" id="link" rel="noreferrer" target="_blank"></a>
      </div>
      <ul class="search-cat clearfix" id="search-cat">
        {{ cur = true; _.each(config.searches, function(val, key){ }}
          <li data-type="{{=key}}"><label>
            <input type="radio" name="type" {{=cur? 'checked': ''}}>
            {{ cur = false; }}
            {{=getLan(val)}}
          </label></li>
        {{ }) }}
      </ul>
    </div>
    <div class="sug" id="sug">
      <ul id="suglist" class="suglist"></ul>
      <div id="clear-history">{{=getLan(config.clearhistory)}}</div>
    </div>
  </div>
  <div class="setting-mask" id="setting-mask"></div>
  <div class="appinfo">
    Copyright © <a href="http://www.evecalm.com" target="_blank">夏影 ❤ 2011-{{=new Date().getFullYear()}}</a> <a href="http://www.evecalm.com/2013/04/union-search.html" target="_blank">Help/Feedback</a>
  </div>
  '''

  document.getElementById('content').innerHTML = _.template tpl, config:config,obj2String:obj2String, getLan:getLan






