var indexOf=[].indexOf||function(t){for(var e=0,n=this.length;n>e;e++)if(e in this&&this[e]===t)return e;return-1};$(function(){var t,e,n,i,r,o,s,a,c,l,u,h,g,d,f,m,p,v;a="",s="",c="",document.addEventListener("touchstart",function(){},!0),n="",t=680,h=window.innerWidth<t,h&&$("#search-form").attr("target","_self"),l=[],$.toJSONString=window.JSON&&window.JSON.stringify||(v=function(t){var e,n,i,r,o;if(r=typeof t,"object"!==r||null===t)return"string"===r&&(t='"'+t+'"'),String(t);n=[],e=t&&t.constructor===Array;for(i in t)o=t[i],r=typeof o,"string"===r?o='"'+o+'"':"object"===r&&null!==o&&(o=v(o)),n.push((e?"":'"'+i+'"')+String(o));return e?"["+String(n)+"]":"{"+String(n)+"}"}),o=function(){return window.localStorage?{_loc:window.localStorage,attr:function(t,e){if(void 0===e){if(void 0===t)return;return this._loc.getItem(""+t)}return this._loc.setItem(""+t,""+e)},remove:function(t){return this._loc.removeItem(""+t)}}:{_cookie:function(){var t,e,n,i,r,o;for(i={},t=document.cookie.split("; "),e=0,n=t.length;n>e;e++)o=t[e],r=o.split("="),i[r[0]]=unescape(r[1]);return i}(),attr:function(t,e,n,i){var r;return void 0===e?this._cookie[t]:(void 0===n?n="Sat, 19 Jan 2037 03:52:43 GMT":(r=new Date,r.setTime(r.getTime()+24*n*60*60*1e3),r=r.toGMTString()),i||(i="/"),e=escape(e),document.cookie=t+"="+e+";expires="+n+";path="+i,this._cookie[t]=e,this._cookie)},remove:function(t){var e,n;return n=this._cookie[t],null!=n&&(e=new Date,delete this._cookie[t],e.setTime(e.getTime-1),document.cookie=t+"="+n+";expires="+e.toGMTString()),this._cookie}}}(),d={_MAX:10,_history:function(){var t;return t=o.attr("history"),t=t?$.parseJSON(t):[]}(),add:function(t){return indexOf.call(this._history,t)<0&&(this._history.unshift(t),this._history.length>this._MAX&&this._history.pop(),o.attr("history",$.toJSONString(this._history))),this},clear:function(){return this._history.length=0,o.attr("history",$.toJSONString(this._history)),this},get:function(){return this._history}},i=function(t){var e,i;i=["en","zh"],i.indexOf(t)>-1&&(n=t,e=document.documentElement.className.replace(/lang\-[a-z]+/,""),e+=" lang-"+t,document.documentElement.className=e.replace(/^\s+|\s+$/g,""),null!=o&&o.attr("lang",t),"zh"===t?document.title="综合搜索":document.title="Union Search")},m=function(){$("#sug").css({top:$(".search-form").offset().top+$(".search-form").height(),left:$(".search-form").offset().left})},p=function(t,e,n){var i,r,o,s,a,c,l,u,h,g,f,m,p;if(o=10,i=$("#sug"),r=$("#suglist"),r.html(""),c=0,m=d.get(),g="",n){for(s=0,l=m.length;l>s&&(p=m[s],!(c>=o));s++)++c,g+="<li>"+p+"</li>";$("#clear-history").show()}else{for(a=0,u=m.length;u>a&&(p=m[a],!(c>=o));a++)p.indexOf(t)>-1&&(++c,g+="<li class='s-h'>"+p+"</li>");$("#clear-history").hide()}if(e&&o>c)for(f=0,h=e.length;h>f&&(p=e[f],indexOf.call(m,p)>=0||(++c,g+="<li>"+p+"</li>",!(c>=o)));f++);c?(r.html(g),i.show()):i.hide()},u=function(t,e,n){var i,r,o;if(o={search:"http://suggestion.baidu.com/su?wd=@&p=3&cb=?",music:"http://nssug.baidu.com/su?wd=@&prod=mp3&cb=?",video:"http://nssug.baidu.com/su?wd=@&prod=video&cb=?",question:"http://nssug.baidu.com/su?wd=@&prod=zhidao&cb=?",image:"http://nssug.baidu.com/su?wd=@&ie=utf-8&prod=image&cb=?",map:"http://map.baidu.com/su?wd=@&ie=utf-8&cid=1&type=0&newmap=1&callback=?",doc:"http://nssug.baidu.com/su?wd=@&prod=wenku&oe=utf-8&cb=?",shop:"http://suggest.taobao.com/sug?area=etao&code=utf-8&q=@&callback=?"},r=o[e],!r)return void("function"==typeof n&&n(t));if(""===e||null==e)return void("function"==typeof n&&n(t));r=r.replace("@",encodeURIComponent(t));try{$.getJSON(r,function(i){var r,o,s,a,c,l,u,h;switch(r=[],e){case"shop":for(u=i.result,s=0,c=u.length;c>s;s++)o=u[s],r.push(o[0]);break;case"map":for(h=i.s,a=0,l=h.length;l>a;a++)o=h[a],r.push($.trim($.trim(o.replace(/(\$+)/g," ")).replace(/\d+$/,"")));break;default:r=i.s}"function"==typeof n&&n(t,r)})}catch(s){i=s,"function"==typeof n&&n(t)}},e=function(t){return t.indexOf("www.google.com")>-1&&l.length?t.replace("www.google.com",l[Math.floor(l.length*Math.random())]):t},r=function(t,e){var i,r,c,l,u,h,g,d,f,m;if(i=$("#search-engine-list"),null!=e&&(u=i.find(">ul[data-engine-type='"+e+"']")),e&&u.length||(u=i.find(">ul.current"),u.length||(u=i.find(">ul:first"))),e=u.data("engine-type"),r=$("#search-cat>li[data-type='"+e+"']"),r.addClass("current"),$("#ico").attr("class","ico ico-"+e),r.find("input").prop("checked",!0),i.find(">ul.current").removeClass("current"),u.addClass("current"),null!=t&&(l=u.find(">li[data-engine-name='"+t+"']")),t&&l.length||(l=u.find(">li.current"),l.length||(l=u.find(">li:first"))),t=l.data("engine-name"),u.find(">li.current").removeClass("current"),l.addClass("current"),$(".search-powered-by").text(r.find("span."+n).text()+" / "+l.find("span."+n).text()),c=$("#search-form"),h=l.data(),c.attr("accept-charset",h.charset||"utf-8"),c.attr("action",h.url),c.attr("origin-action",h.url),$("#isa").attr("name",h.key),$("#link").attr("href",h.link),$("#link").attr("origin-href",h.link),g=h.hiddens,d="",g)for(f in g)m=g[f],d+="<input type='hidden' name='"+f+"' value='"+m+"'>";$("#hiddens").html(d),o.attr("defaultType",e),o.attr("defaultEngine",t),a=e,s=t},g=function(t,e,n){var i;i=new Image,e&&(i.onload=e),n&&(i.onerror=n),i.src=t},f=function(t){t?(document.body.style.backgroundImage="url("+t+")",$("#search-wrapper").addClass("trsprt-bg"),$("#footer").addClass("trsprt-bg")):(document.body.style.backgroundImage="",$("#search-wrapper").removeClass("trsprt-bg"),$("#footer").removeClass("trsprt-bg"))},$("#isa").on("focus",function(t){t.stopPropagation(),$("#isa,#search-btn").addClass("box-shadow")}),$("#search-engine-list").on("click","li",function(t){var e;return e=$(this),e.hasClass("current")||r(e.data("engine-name")),h&&($("#overlay").hide(),$("#search-engine-list").removeClass("show"),$("#search-cat").removeClass("show")),$("#isa").focus(),t.stopPropagation(),!1}),$("#search-cat").on("click","input",function(t){var e,n,i;n=$(this),i=n.closest("li").data("type"),e=n.closest("li"),r(null,e.data("type")),e.siblings().removeClass("current"),e.addClass("current"),!h&&$("#isa").focus(),t.stopPropagation()}),$("#search-form").on("submit",function(t){var n,i,r,o;return i=$(this),n=$("#link"),$("#sug").hide(),o=$("#isa").val()," "===o?(r=e(n.attr("origin-href")),n.attr("href",r),n[0].click(),!1):""===o?!1:(c=o,d.add(o),r=e(i.attr("origin-action")),"qiyi"===s||"map"===a&&"baidu"===s?(r+="qiyi"===s?"q_"+encodeURIComponent(o):"?newmap=1&ie=utf-8&s=s%26wd%3D"+encodeURIComponent(o)+"%26c%3D1",n.attr("href",r),n[0].click(),!1):void i.attr("action",r))}),$("#isa").on("click",function(t){t.stopPropagation(),""===this.value?p("",!1,!0):$("#suglist li").length&&$("#sug").show()}),$("#isa").on("input propertychange",function(t){var e;e=$(this).val(),""===e?($("#sug").hide(),$("#suglist").html(""),c=e):""!==$.trim(e)&&(c=e,u(e,a,p))}),$("#isa").on("keydown",function(t){var e,n,i,r,o;switch(t.stopPropagation(),t.keyCode){case 9:t.shiftKey?(n=$("#search-cat"),r=n.find(">li input:checked").closest("li").next(),r.length||(r=n.find(">li:first")),r.find("input").trigger("click")):(n=$("#search-engine-list ul.current"),r=n.find(">li.current").next(),r.length||(r=n.find(">li:first")),r.trigger("click")),t.preventDefault();break;case 27:$("#sug").hide();break;case 38:$("#sug").is(":visible")?(t.preventDefault(),e=$("#suglist li.current"),e.length?(i=e.prev(),e.removeClass("current"),i.length||(i=!1)):i=$("#suglist li:last"),i?(i.addClass("current"),o=i.text()):o=c,o=$.trim(o),$("#isa").val(o)):$("#suglist li").length?(t.preventDefault(),$("#sug").show()):""===c&&p("",!1,!0);break;case 40:$("#sug").is(":visible")?(t.preventDefault(),e=$("#suglist li.current"),e.length?(i=e.next(),e.removeClass("current"),i.length||(i=!1)):i=$("#suglist li:first"),i?(i.addClass("current"),o=i.text()):o=c,o=$.trim(o),$("#isa").val(o)):$("#suglist li").length?(t.preventDefault(),$("#sug").show()):""===c&&p("",!1,!0)}}),$("#suglist").on("click","li",function(){var t;return t=$(this),t.addClass("current"),$("#isa").val($.trim(t.text())),$("#search-form").submit(),!1}),$("#suglist").on("hover","li",function(){var t;return t=$(this),t.parent().find("li").removeClass("current"),t.addClass("current"),!1}),$("#clear-history").on("click",function(t){d.clear(),$("#suglist").html(""),$("#sug").hide(),$("#isa").focus()}),$("#clear-history").on("hover",function(t){$("#suglist li").removeClass("current")}),$(document).on("click",function(t){$("#isa,#search-btn").removeClass("box-shadow"),$("#sug").hide()}),$(document).on("keydown",function(t){if($("#overlay").is(":hidden")){if(36===t.keyCode||83===t.keyCode||70===t.keyCode)return $("#isa").focus(),!1}else 27===t.keyCode&&$("#overlay").trigger("click")}),$("#switch-lang").on("click","b",function(){i($(this).attr("lang"))}),$("#setting-icon").on("click",function(){$("#overlay").fadeIn("fast"),$("#setting-panel").fadeIn("fast"),$("#bgimg").focus()}),$("#bgimg").on("keydown",function(t){switch(t.keyCode){case 13:$("#set-bgimg").trigger("click");break;case 27:t.stopPropagation()}}),$("#set-bgimg").on("click",function(){var t,e;return t=$("#bgimg"),e=$.trim(t.val()),""!==e?g(e,function(){t.val(""),$("#overlay").trigger("click"),o.attr("bgimg",e),f(e)},function(){$("#imgerror-tip").show(),setTimeout(function(){$("#imgerror-tip").hide()},2e3),o.attr("bgimg",""),f("")}):void 0}),$("#overlay").on("click",function(){$("#setting-panel").fadeOut("fast"),$("#usage-content").fadeOut("fast"),h&&($("#search-engine-list").removeClass("show"),$("#search-cat").removeClass("show")),$(this).fadeOut("fast"),setTimeout(function(){$("#isa").focus()},0)}),$("#usage").on("click",function(){$("#overlay").fadeIn("fast"),$("#usage-content").fadeIn("fast")}),$("#usage-close").on("click",function(){$("#overlay").trigger("click")}),$("#hamburger").on("click",function(){return $("#overlay").show(),$("#search-engine-list").addClass("show"),$("#search-cat").addClass("show"),!1}),$("#search-with").on("click",function(){$("#hamburger").trigger("click")}),$(window).on("resize",function(){h=window.innerWidth<t,h&&$("#search-form").attr("target","_self"),m()}),$(window).on("focus",function(){$("#overlay").is(":hidden")&&$("#isa").focus()}),$(window).on("blur",function(){$("#sug").hide()}),function(){var t;t=o.attr("lang"),l=$.parseJSON(o.attr("ghosts")||"[]"),t||(t=null!=window.navigator.language?window.navigator.language:window.navigator.browserLanguage,t="zh-cn"===t.toLowerCase()?"zh":"en"),i(t),r(o.attr("defaultEngine"),o.attr("defaultType")),f(o.attr("bgimg")),$.getJSON("assets/google.json",function(t){$.isArray(t)&&(l=t,o.attr("ghosts",$.toJSONString(t)))}),setTimeout(function(){var t;$("#isa").focus(),navigator.userAgent.indexOf("Chrome")>-1&&(t="l2v2l6v2e1l1v3l2v3e1v7e1v7e1v7e1l2v6e1l4v5e1l6v4e1l8v3e1l7l3v2e1l9l3v1".replace(/[lve]\d/g,function(t){return Array(-~t[1]).join({l:" ",v:"Love",e:"\n"}[t[0]])}),console.log("%c%s\n%cThanks for your attention!\nYou can visit https://github.com/evecalm/search for uncompressed source code.\nHere is my website http://www.evecalm.com.","color: #ed5565;",t,"font-size: 18px;color:#068;font-weight: 400;"))},0),m()}()});
