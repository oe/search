$ ->
  langArr = ['en','zh']
  searchHistory = []
  # history length
  HISTORYLEN = 10
  changeLang = (lang)->
    if langArr.indexOf(lang) > -1
      cls = document.documentElement.className.replace /lang\-[a-z]+/,''
      cls += " lang-#{lang}"
      document.documentElement.className = cls.replace /^\s+|\s+$/g, ''
      cookie?.attr 'lang', lang

  # cookie utility
  cookie =
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
        return if @_cookie[ key ] is undefined then undefined else @_cookie[ key ]

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
        date.setTime date.getTime - 1
        document.cookie = "#{key}=#{val};expires=#{date.toGMTString()}"
      @_cookie

  # adjust suggestion list's postion
  setSugPos = ->
    $('#sug').css
      'top':$('.search-form').offset().top + $('.search-form').height()
      'left':$('.search-form').offset().left
    return

  # show keyword suggestion list
  showSuggestion = (data, searchHistory)->
    $sug = $ '#sug'
    if data is undefined
      $sug.hide()
      return

  # get keyword suggestion from baidu
  getSuggestion = (kwd, type)->
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
      showSuggestion()
      return
    if type is '' or not type?
      showSuggestion()
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
            for i in res.s
              data.push i.replace /(\$)|(\d*$)/g, ' '
          else
            data = res.s
        showSuggestion data
        return
      return
    catch e
      showSuggestion()
      return
  
  # adjust url, mainly for google
  adjustUrl = (url)->
    gHosts = [
      '64.233.168.97'
      '173.194.124.55'
      '74.125.110.236'
      '173.194.21.233'
      '173.194.124.108'
    ]
    if url.indexOf('www.google.com') > -1
      url.replace 'www.google.com', gHosts[ Math.floor(gHosts.length * Math.random()) ]
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
    $("#search-cat>li[data-type='#{typeName}'] input").prop 'checked', true
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
    return
  
  # switch engine
  $('#search-engine-list').on 'click', 'li', (e)->
    $this = $ this
    unless $this.hasClass('current')
      changeSearchEngine $this.data 'engine-name'
    do $('#isa').focus
    do e.stopPropagation
    return false

  # switch engine type
  $('#search-cat').on 'click', 'input', (e)->
    $this = $ this
    # unless $this.prop 'checked'
    changeSearchEngine null, $this.closest('li').data 'type'
    do $('#isa').focus
    do e.stopPropagation
    return

  # on form submit
  $('#search-form').on 'submit', (e)->
    if $('#isa').val() is ' '
      $link = $ '#link'
      $link.attr 'href', adjustUrl $link.attr 'origin-href'
      do $link[0].click
      return false
    else
      $this = $ this
      $this.attr 'action', adjustUrl $this.attr 'origin-action'
      return

  # add box-shadow to search box when focus
  $('#isa').on 'focus', (e)->
    do e.stopPropagation
    $('#isa,#search-btn').addClass 'box-shadow'
    return

  $('#search-wrapper').on 'click', (e)->
    do e.stopPropagation
    do $('#isa').focus
    return
  
  # remove box-shadow when blur
  $(document).on 'click', (e)->
    $('#isa,#search-btn').removeClass 'box-shadow'
    return

  # input box value change realtime event, Emulate html5 palceholder
  #   event 'propertychange' is for ie, 'input' is for others
  $('#isa').on 'input propertychange',(e)->
    if $(this).val() is ''
      $('#ph').show()
      # if(!isArrowKey) then $('#sug').html(getHistoryList()).hide();
    else
      $('#ph').hide()
      # if (!isArrowKey && val != $(this).val()) {
        # val = $(this).val();
        # getSuggestion (val,currentType);
    return

  # stop keydown event propagation
  $('#isa').on 'keydown', (e)->
    do e.stopPropagation
    # Tab key
    if e.keyCode is 9
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
    return

  # placelholder click for browser not support css pointer-event
  $('#ph').on 'click', (e)->
    $('#isa').focus()
    return false

  # bind shortcut key 'home' key and 's' key to focus on search box
  #     when search box blured
  $(document).on 'keydown',(e)->
    # 36 is the keycode of "Home" key, 83 is the keycode of "s" key
    if e.keyCode is 36 or e.keyCode is 83
      $('#isa').focus()
      return false

  # switch language
  $('#switch-lang').on 'click', 'b', ->
    changeLang $(this).attr 'lang'
    return
  
  # init
  do ->
    lang = cookie.attr 'lang'
    if lang is undefined
      lang = if window.navigator.language? then window.navigator.language else window.navigator.browserLanguage
      lang = if lang.toLowerCase() is 'zh-cn' then 'zh' else 'en'
    changeLang lang
    searchHistory = cookie.attr 'history'
    searchHistory = if searchHistory  then $.parseJSON('searchHistory') else []
    changeSearchEngine cookie.attr('defaultEngine'), cookie.attr('defaultType')
    setTimeout ->
      do $('#isa').focus
      return
    , 0
    return
    

  return
      
      
