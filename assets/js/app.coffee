$ ->
  currentEngineType = ''
  currentEngineName = ''
  currentKwd = ''
  ###*
   * 修正触屏设备css的active伪类无效果的问题
   * ＊IE 9以下不支持 addEventListener 方法
  ###
  document.addEventListener and document.addEventListener 'touchstart', ->
    return
  , true
  # 当前语言
  appLang = '';

  # 移动设备屏幕宽度断点
  MOBILE_BREAK_POINT = 680

  isMobile = window.innerWidth < MOBILE_BREAK_POINT

  isMobile and $('#search-form').attr 'target', '_self'

  gHosts = []
  # enable JSONString for old browser
  $.toJSONString = (window.JSON and window.JSON.stringify ) or ( toJSONString = (obj)->
    t = typeof obj
    if t isnt "object" or obj is null
      if t is "string" then obj = '"'+obj+'"'
      return String obj
    else
      json = []
      arr = obj && obj.constructor is Array
      for n, v of obj
        t = typeof v
        if t is 'string'
          v = '"' + v + '"'
        else
          if t is 'object' and v isnt null
            v = toJSONString v
        json.push (if arr then '' else '"' + n + '"') + String v

      if arr
        return '[' + String(json) + ']'
      else
        return '{' + String(json) + '}'
  )

  # cookie utility
  cookie = do ->
    if window.localStorage
      {
        _loc: window.localStorage
        attr: (key, val)->
          if val is undefined
            return if key is undefined
            return @_loc.getItem "#{key}"
          else
            @_loc.setItem "#{key}", "#{val}"
        remove: (key)->
          @_loc.removeItem "#{key}"

      }
    else
      {
        _cookie: do ->
          obj = {}
          cookieArr = document.cookie.split '; '
          for v in cookieArr
            pair = v.split '='
            obj[ pair[0] ] = unescape pair[1]
          obj
        # get or set cookie
        #   expire is count by day
        attr: (key, val, expire, path)->
          if val is undefined
            return @_cookie[ key ]

          if expire is undefined
            expire = 'Sat, 19 Jan 2037 03:52:43 GMT'
          else
            date = new Date()
            date.setTime date.getTime() + expire * 24 * 60 * 60 * 1000
            date = date.toGMTString()

          path = '/' if not path
          val = escape val
          document.cookie = "#{key}=#{val};expires=#{expire};path=#{path}"
          @_cookie[ key ] = val
          @_cookie
        # remove cookie
        remove: (key)->
          val = @_cookie[ key ]
          if val?
            date = new Date()
            delete @_cookie[ key ]
            date.setTime date.getTime - 1
            document.cookie = "#{key}=#{val};expires=#{date.toGMTString()}"
          @_cookie
        # ...
      }


  # search history utility
  searchHistory =
    _MAX: 10
    _history: do->
      hsty = cookie.attr 'history'
      hsty = if hsty  then $.parseJSON(hsty) else []
    add: (kwd)->
      if kwd not in this._history
        this._history.unshift kwd
        if this._history.length > this._MAX
          do this._history.pop
        cookie.attr 'history', $.toJSONString this._history
      this
    clear: ->
      this._history.length = 0
      cookie.attr 'history', $.toJSONString this._history
      this
    get: ->
      this._history

  # change language
  changeLang = (lang)->
    langArr = ['en', 'zh']
    if lang in langArr
      appLang = lang
      cls = document.documentElement.className.replace /lang\-[a-z]+/, ''
      cls += " lang-#{lang}"
      document.documentElement.className = cls.replace /^\s+|\s+$/g, ''
      cookie?.attr 'lang', lang
      if lang is 'zh'
        document.title = '综合搜索'
      else
        document.title = 'Union Search'
    return

  # adjust suggestion list's postion
  setSugPos = ->
    $('#sug').css
      'top':$('.search-form').offset().top + $('.search-form').height()
      'left':$('.search-form').offset().left
    return

  ###*
   * show keyword suggestion list
   * @param  {String} kwd            关键字
   * @param  {Array}  data           百度建议的关键字列表
   * @param  {Boolean} showAllHistory 是否显示所有搜索历史
   * @return {undefined}                无返回值
  ###
  showSuggestion = (kwd, data, showAllHistory)->
    MAX = 10
    $sug = $ '#sug'
    $suglist = $ '#suglist'
    $suglist.html ''
    len = 0
    shistory = do searchHistory.get
    listHtml = ''
    if showAllHistory
      for v in shistory
        if len >= MAX then break
        ++len
        listHtml += "<li>#{v}</li>"
      do $('#clear-history').show
    else
      for v in shistory
        if len >= MAX then break
        if v.indexOf(kwd) > -1
          ++len
          listHtml += "<li class='s-h'>#{v}</li>"
      do $('#clear-history').hide
    if data and len < MAX
      for v in data
        # remove duplicated item
        if v in shistory then continue
        ++len
        listHtml += "<li>#{v}</li>"
        if len >= MAX then break
    if len
      $suglist.html listHtml
      do $sug.show
    else
      do $sug.hide
    return

  # get keyword suggestion from baidu
  getSuggestion = (kwd, type, cb)->
    urlTbl =
      'search'  : 'http://suggestion.baidu.com/su?wd=@&p=3&cb=?'
      'music'   : 'http://nssug.baidu.com/su?wd=@&prod=mp3&cb=?'
      'video'   : 'http://nssug.baidu.com/su?wd=@&prod=video&cb=?'
      'question'  : 'http://nssug.baidu.com/su?wd=@&prod=zhidao&cb=?'
      'image'   : 'http://nssug.baidu.com/su?wd=@&ie=utf-8&prod=image&cb=?'
      'map'   : 'http://map.baidu.com/su?wd=@&ie=utf-8&cid=1&type=0&newmap=1&callback=?'
      'doc'   : 'http://nssug.baidu.com/su?wd=@&prod=wenku&oe=utf-8&cb=?'
      'shop'    : 'http://suggest.taobao.com/sug?area=etao&code=utf-8&q=@&callback=?'

    url = urlTbl[ type ]
    if not url
      cb? kwd
      return
    if type is '' or not type?
      cb? kwd
      return
    url = url.replace '@', encodeURIComponent kwd
    try
      $.getJSON url, (res)->
        data = []
        switch type
          when 'shop'
            for i in res.result
              data.push i[0]
          when 'map'
            # remove '$' and trailing numbers
            for i in res.s
              data.push $.trim $.trim(i.replace(/(\$+)/g, ' ')).replace(/\d+$/, '')
          else
            data = res.s
        cb? kwd, data
        return
      return
    catch e
      cb? kwd
      return

  # adjust url, mainly for google
  adjustUrl = (url)->
    if url.indexOf('http://www.google.com') > -1 and gHosts.length
      url.replace 'http://www.google.com', gHosts[ Math.floor(gHosts.length * Math.random()) ]
    else
      url

  # switch search engine
  changeSearchEngine = (engineName, typeName)->
    $engineList = $ '#search-engine-list'
    if typeName?
      $newType = $engineList.find ">ul[data-engine-type='#{typeName}']"
    if not typeName or not $newType.length
      $newType = $engineList.find ">ul.current"
      if not $newType.length
        $newType = $engineList.find '>ul:first'
    typeName = $newType.data 'engine-type'
    $engineType = $ "#search-cat>li[data-type='#{typeName}']"
    $engineType.addClass 'current'
    $('#ico').attr 'class', 'ico ico-' + typeName
    $engineType.find('input').prop 'checked', true
    $engineList.find('>ul.current').removeClass 'current'
    $newType.addClass 'current'
    if engineName?
      $newEngine = $newType.find ">li[data-engine-name='#{engineName}']"
    if not engineName or not $newEngine.length
      $newEngine = $newType.find '>li.current'
      if not $newEngine.length
        $newEngine = $newType.find '>li:first'
    engineName = $newEngine.data 'engine-name'
    $newType.find('>li.current').removeClass 'current'
    $newEngine.addClass 'current'


    $('.search-powered-by').text $engineType.find('span.' + appLang).text() + ' / ' + $newEngine.find('span.' + appLang).text()

    $form = $ '#search-form'
    data = $newEngine.data()
    $form.attr 'accept-charset', data['charset'] || 'utf-8'
    $form.attr 'action', data['url']
    $form.attr 'origin-action', data['url']
    $('#isa').attr 'name', data['key']
    $('#link').attr 'href', data['link']
    $('#link').attr 'origin-href', data['link']

    hiddens = data.hiddens
    html = ''
    if hiddens
      for k, v of hiddens
        html += "<input type='hidden' name='#{k}' value='#{v}'>"
    $('#hiddens').html html

    cookie.attr 'defaultType', typeName
    cookie.attr 'defaultEngine', engineName
    currentEngineType = typeName
    currentEngineName = engineName
    return

  # load image
  loadImg = (imgUrl, done, fail)->
    img = new Image
    img.onload = done if done
    img.onerror = fail if fail
    img.src = imgUrl
    return
  # set document.body background image
  setBgImg = (imgUrl)->
    if imgUrl
      document.body.style.backgroundImage = "url(#{imgUrl})"
      $('#search-wrapper').addClass 'trsprt-bg'
      $('#footer').addClass 'trsprt-bg'
    else
      document.body.style.backgroundImage = ''
      $('#search-wrapper').removeClass 'trsprt-bg'
      $('#footer').removeClass 'trsprt-bg'
    return
  # add box-shadow to search box when focus
  $('#isa').on 'focus', (e)->
    do e.stopPropagation
    $('#isa,#search-btn').addClass 'box-shadow'
    return

  
  # switch engine
  $('#search-engine-list').on 'click', 'li', (e)->
    $this = $ this
    unless $this.hasClass('current')
      changeSearchEngine $this.data 'engine-name'

    if isMobile
      do $('#overlay').hide
      $('#search-engine-list').removeClass 'show'
      $('#search-cat').removeClass 'show'

    do $('#isa').focus
    do e.stopPropagation
    return false

  # switch engine type
  $('#search-cat').on 'click', 'input', (e)->
    $this = $ this
    # unless $this.prop 'checked'
    engineType = $this.closest('li').data 'type'
    $li = $this.closest 'li'
    changeSearchEngine null, $li.data 'type'
    $li.siblings().removeClass 'current'
    $li.addClass 'current'
    not isMobile and do $('#isa').focus
    do e.stopPropagation
    return

  # on form submit
  $('#search-form').on 'submit', (e)->
    $this = $ this
    $link = $ '#link'
    do $('#sug').hide
    val = do $('#isa').val
    if val is ' '
      href = adjustUrl $link.attr 'origin-href'
      $link.attr 'href', href
      do $link[0].click
      return false
    else if val is ''
      return false
    else
      # update current kwd
      currentKwd = val
      searchHistory.add val
      href = adjustUrl $this.attr 'origin-action'
      if currentEngineName is 'qiyi' or (currentEngineType is 'map' and currentEngineName is 'baidu')
        if currentEngineName is 'qiyi'
          href += "q_#{encodeURIComponent(val)}"
        else
          href += "?newmap=1&ie=utf-8&s=s%26wd%3D#{encodeURIComponent(val)}%26c%3D1"
        $link.attr 'href', href
        do $link[0].click
        return false
      else
        $this.attr 'action', href
      return



  # search box click
  $('#isa').on 'click', (e)->
    do e.stopPropagation
    if this.value is ''
      showSuggestion '', false, true
    else if $('#suglist li').length
      do $('#sug').show
    return
  # input box value change realtime event, Emulate html5 palceholder
  #   event 'propertychange' is for ie, 'input' is for others
  $('#isa').on 'input propertychange', (e)->
    val = do $(this).val
    if val is ''
      do $('#sug').hide
      $('#suglist').html ''
      # update current kwd
      currentKwd = val
    else
      if $.trim(val) isnt ''
        # update current kwd
        currentKwd = val
        getSuggestion val, currentEngineType, showSuggestion
    return
  # stop keydown event propagation
  $('#isa').on 'keydown', (e)->
    do e.stopPropagation
    switch e.keyCode
      # Tab key
      when 9
        if e.shiftKey
          $engineList = $ '#search-cat'
          $nextEngine = do $engineList.find('>li input:checked').closest('li').next
          unless $nextEngine.length
            $nextEngine = $engineList.find '>li:first'
          $nextEngine.find('input').trigger 'click'
        else
          $engineList = $ '#search-engine-list ul.current'
          $nextEngine = do $engineList.find('>li.current').next
          unless $nextEngine.length
            $nextEngine = $engineList.find '>li:first'
          $nextEngine.trigger 'click'
        do e.preventDefault
      # Escape key
      when 27
        do $('#sug').hide
      # up key
      when 38
        if $('#sug').is ':visible'
          do e.preventDefault
          $curt = $ '#suglist li.current'
          if $curt.length
            $next = do $curt.prev
            $curt.removeClass 'current'
            $next = false if not $next.length
          else
            $next = $ '#suglist li:last'
          if $next
            $next.addClass 'current'
            kwd = do $next.text
          else
            kwd = currentKwd
          kwd = $.trim kwd
          $('#isa').val kwd
        else
          if $('#suglist li').length
            do e.preventDefault
            do $('#sug').show
          else if currentKwd is ''
            showSuggestion '', false, true
      # down key
      when 40
        if $('#sug').is ':visible'
          do e.preventDefault
          $curt = $ '#suglist li.current'
          if $curt.length
            $next = do $curt.next
            $curt.removeClass 'current'
            $next = false if not $next.length
          else
            $next = $ '#suglist li:first'
          if $next
            $next.addClass 'current'
            kwd = do $next.text
          else
            kwd = currentKwd
          kwd = $.trim kwd
          $('#isa').val kwd
        else
          if $('#suglist li').length
            do e.preventDefault
            do $('#sug').show
          else if currentKwd is ''
            showSuggestion '', false, true
    return
  # suggestion list click
  $('#suglist').on 'click', 'li', ->
    $this = $ this
    $this.addClass 'current'
    $('#isa').val $.trim $this.text()
    do $('#search-form').submit
    return false

  # suggestion list hover
  $('#suglist').on 'hover', 'li', ->
    $this = $ this
    $this.parent().find('li').removeClass 'current'
    $this.addClass 'current'
    return false
  # clear search history
  $('#clear-history').on 'click', (e)->
    do searchHistory.clear
    $('#suglist').html ''
    do $('#sug').hide
    do $('#isa').focus
    return
  # clear search history
  $('#clear-history').on 'hover', (e)->
    $('#suglist li').removeClass 'current'
    return

  # remove box-shadow when blur
  $(document).on 'click', (e)->
    $('#isa,#search-btn').removeClass 'box-shadow'
    do $('#sug').hide
    return
  # bind shortcut key 'home' key and 's' 'f' key to focus on search box
  #     when search box blured
  $(document).on 'keydown', (e)->
    if $('#overlay').is ':hidden'
      # 36 for "Home" key
      # 83 for "s" key
      # 70 for "f" key
      if e.keyCode is 36 or e.keyCode is 83 or e.keyCode is 70
        $('#isa').focus()
        return false
    else
      if e.keyCode is 27
        $('#overlay').trigger 'click'
    return


  # switch language
  $('#switch-lang').on 'click', 'b', ->
    changeLang $(this).attr 'lang'
    return

  $('#setting-icon').on 'click', ->
    $('#overlay').fadeIn 'fast'
    $('#setting-panel').fadeIn 'fast'
    do $('#bgimg').focus
    return
  $('#bgimg').on 'keydown', (e)->
    switch e.keyCode
      when 13
        $('#set-bgimg').trigger 'click'
      when 27
        do e.stopPropagation
    return

  $('#set-bgimg').on 'click', ->
    $imginput = $ '#bgimg'
    imgUrl = $.trim $imginput.val()
    if imgUrl is '' then return
    loadImg imgUrl, ->
      $imginput.val ''
      $('#overlay').trigger 'click'
      cookie.attr 'bgimg', imgUrl
      setBgImg imgUrl
      return
    , ->
      do $('#imgerror-tip').show
      setTimeout ->
        do $('#imgerror-tip').hide
        return
      , 2000
      cookie.attr 'bgimg', ''
      setBgImg ''
      return
  # overlay click
  $('#overlay').on 'click', ->
    $('#setting-panel').fadeOut 'fast'
    $('#usage-content').fadeOut 'fast'

    if isMobile
      $('#search-engine-list').removeClass 'show'
      $('#search-cat').removeClass 'show'

    $(this).fadeOut 'fast'
    setTimeout ->
      do $('#isa').focus
      return
    , 0
    return
  
  $('#usage').on 'click', ->
    $('#overlay').fadeIn 'fast'
    $('#usage-content').fadeIn 'fast'
    return
  $('#usage-close').on 'click', ->
    $('#overlay').trigger 'click'
    return

  # hamburger menu
  $('#hamburger').on 'click', ->
    do $('#overlay').show
    $('#search-engine-list').addClass 'show'
    $('#search-cat').addClass 'show'
    return false

  # click search-with
  $('#search-with').on 'click', ->
    $('#hamburger').trigger 'click'
    return

  # reset suglist pos when window resize
  $(window).on 'resize', ->
    isMobile = window.innerWidth < MOBILE_BREAK_POINT
    isMobile and $('#search-form').attr 'target', '_self'
    do setSugPos
    return
  # focus on search box when window actived
  $(window).on 'focus', ->
    if $('#overlay').is ':hidden'
      do $('#isa').focus
    return
  # focus on search box when window actived
  $(window).on 'blur', ->
    do $('#sug').hide
    return
  # init
  do ->
    lang = cookie.attr 'lang'
    gHosts = $.parseJSON cookie.attr('ghosts') or '[]'
    unless lang
      lang = if window.navigator.language? then window.navigator.language else window.navigator.browserLanguage
      lang = if lang.toLowerCase() is 'zh-cn' then 'zh' else 'en'
    changeLang lang
    changeSearchEngine cookie.attr('defaultEngine'), cookie.attr('defaultType')
    setBgImg cookie.attr 'bgimg'
    # 从服务器端获取最新的google ip
    $.getJSON 'assets/google.json', (res)->
      if $.isArray res
        gHosts = res
        cookie.attr 'ghosts', $.toJSONString res
      return
    setTimeout ->
      do $('#isa').focus
      if navigator.userAgent.indexOf('Chrome') > -1
        heartString = ("l2v2l6v2e1l1v3l2v3e1v7e1v7e1v7e1l2v6e1l4v5e1l6v4e1l8v3e1l7l3v2e1l9l3v1").replace /[lve]\d/g, (a)-> Array(-~a[1]).join({l:" ", v:"Love", e:"\n"}[a[0]])
        console.log '%c%s\n%cThanks for your attention!\nYou can visit https://github.com/evecalm/search for uncompressed source code.\nHere is my website http://www.evecalm.com.', 'color: #ed5565;', heartString, 'font-size: 18px;color:#068;font-weight: 400;'
      return
    , 0
    do setSugPos
    return

  return


