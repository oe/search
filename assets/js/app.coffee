$ ->
  langArr = ['en','zh']
  changeLang = (lang)->
    if langArr.indexOf(lang) > -1
      document.documentElement.className = "lang-#{lang}"
      cookie?.attr 'lang', lang

  cookie =
    _cookie: do ->
      obj = {}
      cookieArr = document.cookie.split '; '
      for v in cookieArr
        pair = v.split '='
        obj[ pair[0] ] = unescape pair[1]
      obj
    # expire为有效天数
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
      
    remove: (key)->
      val = @_cookie[ key ]
      if val?
        date = new Date()
        date.setTime date.getTime - 1
        document.cookie = "#{key}=#{val};expires=#{date.toGMTString()}"
      @_cookie

  init = ->
    lang = cookie.attr 'lang'
    if lang is undefined
      lang = if window.navigator.language? then window.navigator.language else window.navigator.browserLanguage
      lang = if lang.toLowerCase() is 'zh-cn' then 'zh' else 'en'
    changeLang lang
    # searchHistory;
    cookie.attr('defaultType', 'search') if cookie.attr('defaultType') is undefined

  setSugPos = ->
    $('#sug').css
      'top':$('.search-form').offset().top + $('.search-form').height()
      'left':$('.search-form').offset().left
    return

  # 更改搜索引擎
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
    $('#isa').attr 'name', data['key']
    $('#link').attr 'href', data['link']

    hiddens = $.parseJSON data.hiddens if data.hiddens
    html = ''
    if hiddens
      for k, v of hiddens
        html += "<input type='hidden' name='#{k}' value='#{v}'>"
    $('#hiddens').html str

    return
  # 展示搜索建议
  showSuggestion = (data, searchHistory)->
    $sug = $ '#sug'
    if data is undefined
      $sug.hide()
      return

  # 获取搜索建议
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
  

  $('#isa').on 'click focus', (e)->
    e.stopPropagation()
    $('#isa,#search-btn').addClass 'box-shadow'
    return
  # //input box value change realtime event, Emulate html5 palceholder
  # //event 'propertychange' is for ie, 'input' is for others
  $('#isa').on 'input propertychange',(e)->
    console.log 'hahah'
    if $(this).val() is ''
      $('#ph').show()
      # if(!isArrowKey) then $('#sug').html(getHistoryList()).hide();
    else
      $('#ph').hide()
      # if (!isArrowKey && val != $(this).val()) {
        # val = $(this).val();
        # getSuggestion (val,currentType);
    return
  # //input box blur event
  $('#ph').on 'click', (e)->
    console.log 'click'
    e.stopPropagation()
    $('#isa').focus()
    return
  $(document).on 'keydown',(e)->
    # // 36 is the keycode of "Home" key, 83 is the keycode of "s" key
    if e.keyCode is 36 or e.keyCode is 83
      $('#isa').focus()
      return false

    

    

  return
      
      
