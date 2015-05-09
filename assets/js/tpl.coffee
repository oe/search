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
  <div class="overlay" id="overlay"></div>
  <div class="hamburger" id="hamburger"></div>
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
      <h1 class="app-name">{{=getLan(config.title)}}</h1>
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
          <input type="text" class="input-box" name="q" id="isa" autocomplete="off" autofocus speech>
          <span class="submit" id="search-btn">
            <button type="submit" >{{=getLan(config.submit)}}</button>
          </span>
          
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
      <div class="search-with">
        <span class="zh">由 <strong class="search-powered-by"></strong> 提供搜索结果</span>
          <span class="en">Search with <strong class="search-powered-by"></strong></span>
      </div>
    </div>
    <div class="sug" id="sug">
      <ul id="suglist" class="suglist"></ul>
      <div id="clear-history">{{=getLan(config.clearhistory)}}</div>
    </div>
  </div>
  <div class="usage-content" id="usage-content">
    <div class="usage-close" id="usage-close">&times;</div>
    <h3><span class="en">Usage<small>(for desktop only)</small></span><span class="zh">使用帮助<small>(仅应用于桌面端)</small></span></h3>
    <h4><span class="en">Shortcuts</span><span class="zh">快捷键</span></h4>
    <ol>
      <li>
        <kbd>Tab</kbd>
        <span class="en">Switch Search Engine</span>
        <span class="zh">切换搜索引擎</span>
      </li>
      <li>
        <kbd>Shift</kbd> +
        <kbd>Tab</kbd>
        <span class="en">Switch Search Category</span>
        <span class="zh">切换搜索类别</span>
      </li>
      <li>
        <kbd>Home</kbd> /
        <kbd>F</kbd> /
        <kbd>S</kbd>
        <span class="en">Focus on Search Box</span>
        <span class="zh">快速聚焦到搜索框</span>
      </li>
    </ol>
    <h4><span class="en">Switch Language</span><span class="zh">切换语言</span></h4>
    <p>
      <span class="en">Click "English/中文" at the right top corner to switch language</span>
      <span class="zh">点击右上角的“English/中文”来切换应用语言</span>
    </p>
    <h4><span class="en">Open Search Engine Offical Site</span><span class="zh">打开搜索引擎官网</span></h4>
    <p>
      <span class="en">Type *one* space and press enter key</span>
      <span class="zh">输入一个空格, 按回车键即可</span>
    </p>
    <h4><span class="en">Set Backgrount Image</span><span class="zh">设置背景图片</span></h4>
    <p>
      <span class="en">Click "☸" at the right top corner, then paste image's url into then input box and press enter key!</span>
      <span class="zh">点击右上角的“☸”, 在显示出来的输入框中输入图片地址按回车键即可.</span>
    </p>
  </div>
  <div class="footer" id="footer">
    Copyright © <a href="http://www.evecalm.com" target="_blank" class="official-site">夏影 ❤ 2011-{{=new Date().getFullYear()}}</a> /
    <a class="usage" id="usage">{{=getLan(config.usage)}}</a> /
    <a href="http://www.evecalm.com/2013/04/union-search.html" target="_blank">{{=getLan(config.feedback)}}</a>
  </div>
  '''
  if typeof module is undefined
    document.getElementById('content').innerHTML = _.template tpl, config:config, obj2String:obj2String, getLan:getLan
  else
    _ = require '../libs/underscore.js'
    config = require 'config.js'
    module.exports = ->
      _.template tpl, config: config, obj2String: obj2String, getLan: getLan
  






