(function(){var t=[].indexOf||function(t){for(var e=0,i=this.length;i>e;e++)if(e in this&&this[e]===t)return e;return-1};$(function(){var e,i,n,o,r,s,a,c,l,u,h,f,g,d;s="",r="",a="",$.toJSONString=window.JSON&&window.JSON.stringify||(d=function(t){var e,i,n,o,r;if(o=typeof t,"object"!==o||null===t)return"string"===o&&(t='"'+t+'"'),String(t);i=[],e=t&&t.constructor===Array;for(n in t)r=t[n],o=typeof r,"string"===o?r='"'+r+'"':"object"===o&&null!==r&&(r=d(r)),i.push((e?"":'"'+n+'"')+String(r));return e?"["+String(i)+"]":"{"+String(i)+"}"}),o=function(){return window.localStorage?{_loc:window.localStorage,attr:function(t,e){if(void 0===e){if(void 0===t)return;return this._loc.getItem(""+t)}return this._loc.setItem(""+t,""+e)},remove:function(t){return this._loc.removeItem(""+t)}}:{_cookie:function(){var t,e,i,n,o,r;for(e={},t=document.cookie.split("; "),o=0,r=t.length;r>o;o++)n=t[o],i=n.split("="),e[i[0]]=unescape(i[1]);return e}(),attr:function(t,e,i,n){var o;return void 0===e?this._cookie[t]:(void 0===i?i="Sat, 19 Jan 2037 03:52:43 GMT":(o=new Date,o.setTime(o.getTime()+24*i*60*60*1e3),o=o.toGMTString()),n||(n="/"),e=escape(e),document.cookie=""+t+"="+e+";expires="+i+";path="+n,this._cookie[t]=e,this._cookie)},remove:function(t){var e,i;return i=this._cookie[t],null!=i&&(e=new Date,delete this._cookie[t],e.setTime(e.getTime-1),document.cookie=""+t+"="+i+";expires="+e.toGMTString()),this._cookie}}}(),u={_MAX:10,_history:function(){var t;return t=o.attr("history"),t=t?$.parseJSON(t):[]}(),add:function(e){return t.call(this._history,e)<0&&(this._history.unshift(e),this._history.length>this._MAX&&this._history.pop(),o.attr("history",$.toJSONString(this._history))),this},clear:function(){return this._history.length=0,o.attr("history",$.toJSONString(this._history)),this},get:function(){return this._history}},i=function(t){var e,i;i=["en","zh"],i.indexOf(t)>-1&&(e=document.documentElement.className.replace(/lang\-[a-z]+/,""),e+=" lang-"+t,document.documentElement.className=e.replace(/^\s+|\s+$/g,""),null!=o&&o.attr("lang",t),document.title="zh"===t?"综合搜索":"Union Search")},f=function(){$("#sug").css({top:$(".search-form").offset().top+$(".search-form").height(),left:$(".search-form").offset().left})},g=function(e,i,n){var o,r,s,a,c,l,h,f,g,d,p,m,v;if(s=10,o=$("#sug"),r=$("#suglist"),r.html(""),a=0,l=u.get(),c="",n){for(f=0,p=l.length;p>f&&(h=l[f],!(a>=s));f++)++a,c+="<li>"+h+"</li>";$("#clear-history").show()}else{for(g=0,m=l.length;m>g&&(h=l[g],!(a>=s));g++)h.indexOf(e)>-1&&(++a,c+="<li class='s-h'>"+h+"</li>");$("#clear-history").hide()}if(i&&s>a)for(d=0,v=i.length;v>d&&(h=i[d],t.call(l,h)>=0||(++a,c+="<li>"+h+"</li>",!(a>=s)));d++);a?(r.html(c),o.show()):o.hide()},c=function(t,e,i){var n,o,r;if(r={search:"http://suggestion.baidu.com/su?wd=@&p=3&cb=?",music:"http://nssug.baidu.com/su?wd=@&prod=mp3&cb=?",video:"http://nssug.baidu.com/su?wd=@&prod=video&cb=?",question:"http://nssug.baidu.com/su?wd=@&prod=zhidao&cb=?",image:"http://nssug.baidu.com/su?wd=@&ie=utf-8&prod=image&cb=?",map:"http://map.baidu.com/su?wd=@&ie=utf-8&cid=1&type=0&newmap=1&callback=?",doc:"http://nssug.baidu.com/su?wd=@&prod=wenku&oe=utf-8&cb=?",shop:"http://suggest.taobao.com/sug?area=etao&code=utf-8&q=@&callback=?"},o=r[e],!o)return void("function"==typeof i&&i(t));if(""===e||null==e)return void("function"==typeof i&&i(t));o=o.replace("@",encodeURIComponent(t));try{$.getJSON(o,function(n){var o,r,s,a,c,l,u,h;switch(o=[],e){case"shop":for(u=n.result,s=0,c=u.length;c>s;s++)r=u[s],o.push(r[0]);break;case"map":for(h=n.s,a=0,l=h.length;l>a;a++)r=h[a],o.push($.trim($.trim(r.replace(/(\$+)/g," ")).replace(/\d+$/,"")));break;default:o=n.s}"function"==typeof i&&i(t,o)})}catch(s){n=s,"function"==typeof i&&i(t)}},e=function(t){var e;return e=["64.233.168.97","173.194.124.55","74.125.110.236","173.194.120.64","74.125.192.115","74.125.198.84","74.125.129.51","74.125.239.189","173.194.120.86","74.125.133.95","173.194.120.75","173.194.195.120","173.194.193.141","74.125.201.82",""],t.indexOf("www.google.com")>-1?t.replace("www.google.com",e[Math.floor(e.length*Math.random())]):t},n=function(t,e){var i,n,a,c,l,u,h,f,g;if(i=$("#search-engine-list"),null!=e&&(c=i.find(">ul[data-engine-type='"+e+"']")),e&&c.length||(c=i.find(">ul.current"),c.length||(c=i.find(">ul:first"))),e=c.data("engine-type"),$("#search-cat>li[data-type='"+e+"'] input").prop("checked",!0),i.find(">ul.current").removeClass("current"),c.addClass("current"),null!=t&&(a=c.find(">li[data-engine-name='"+t+"']")),t&&a.length||(a=c.find(">li.current"),a.length||(a=c.find(">li:first"))),t=a.data("engine-name"),c.find(">li.current").removeClass("current"),a.addClass("current"),n=$("#search-form"),l=a.data(),n.attr("accept-charset",l.charset||"utf-8"),n.attr("action",l.url),n.attr("origin-action",l.url),$("#isa").attr("name",l.key),$("#link").attr("href",l.link),$("#link").attr("origin-href",l.link),u=l.hiddens,h="",u)for(f in u)g=u[f],h+="<input type='hidden' name='"+f+"' value='"+g+"'>";$("#hiddens").html(h),o.attr("defaultType",e),o.attr("defaultEngine",t),s=e,r=t},l=function(t,e,i){var n;n=new Image,e&&(n.onload=e),i&&(n.onerror=i),n.src=t},h=function(t){t?(document.body.style.backgroundImage="url("+t+")",$("#search-wrapper").addClass("trsprt-bg"),$("#footer").addClass("trsprt-bg")):(document.body.style.backgroundImage="",$("#search-wrapper").removeClass("trsprt-bg"),$("#footer").removeClass("trsprt-bg"))},$("#isa").on("focus",function(t){t.stopPropagation(),$("#isa,#search-btn").addClass("box-shadow")}),function(){var t;t=o.attr("lang"),void 0===t&&(t=null!=window.navigator.language?window.navigator.language:window.navigator.browserLanguage,t="zh-cn"===t.toLowerCase()?"zh":"en"),i(t),n(o.attr("defaultEngine"),o.attr("defaultType")),h(o.attr("bgimg")),setTimeout(function(){var t;$("#isa").focus(),navigator.userAgent.indexOf("Chrome")>-1&&(t="l2v2l6v2e1l1v3l2v3e1v7e1v7e1v7e1l2v6e1l4v5e1l6v4e1l8v3e1l7l3v2e1l9l3v1".replace(/[lve]\d/g,function(t){return Array(-~t[1]).join({l:" ",v:"Love",e:"\n"}[t[0]])}),console.log("%c%s\n%cThanks for your attention!\nYou can visit https://github.com/evecalm/search for uncompressed source code.\nHere is my website http://www.evecalm.com.","color: #ed5565;",t,"font-size: 18px;color:#068;font-weight: 400;"))},0),f()}(),$("#search-engine-list").on("click","li",function(t){var e;return e=$(this),e.hasClass("current")||n(e.data("engine-name")),$("#isa").focus(),t.stopPropagation(),!1}),$("#search-cat").on("click","input",function(t){var e;e=$(this),n(null,e.closest("li").data("type")),$("#isa").focus(),t.stopPropagation()}),$("#search-form").on("submit",function(t){var i,n,o,c;return n=$(this),i=$("#link"),$("#sug").hide(),c=$("#isa").val()," "===c?(o=e(i.attr("origin-href")),i.attr("href",o),i[0].click(),!1):""===c?!1:(a=c,u.add(c),o=e(n.attr("origin-action")),"qiyi"===r||"map"===s&&"baidu"===r?(o+="qiyi"===r?"q_"+encodeURIComponent(c):"?newmap=1&ie=utf-8&s=s%26wd%3D"+encodeURIComponent(c)+"%26c%3D1",i.attr("href",o),i[0].click(),!1):void n.attr("action",o))}),$("#search-wrapper").on("click",function(t){t.stopPropagation(),$("#isa").focus(),$("#sug").hide()}),$("#isa").on("click",function(t){t.stopPropagation(),""===this.value?g("",!1,!0):$("#suglist li").length&&$("#sug").show()}),$("#isa").on("input propertychange",function(t){var e;e=$(this).val(),""===e?($("#ph").show(),$("#sug").hide(),$("#suglist").html(""),a=e):($("#ph").hide(),""!==$.trim(e)&&(a=e,c(e,s,g)))}),$("#isa").on("keydown",function(t){var e,i,n,o,r;switch(t.stopPropagation(),t.keyCode){case 9:t.shiftKey?(i=$("#search-cat"),o=i.find(">li input:checked").closest("li").next(),o.length||(o=i.find(">li:first")),o.find("input").trigger("click")):(i=$("#search-engine-list ul.current"),o=i.find(">li.current").next(),o.length||(o=i.find(">li:first")),o.trigger("click")),t.preventDefault();break;case 27:$("#sug").hide();break;case 38:$("#sug").is(":visible")?(t.preventDefault(),e=$("#suglist li.current"),e.length?(n=e.prev(),e.removeClass("current"),n.length||(n=!1)):n=$("#suglist li:last"),n?(n.addClass("current"),r=n.text()):r=a,r=$.trim(r),""===r?$("#ph").show():$("#ph").hide(),$("#isa").val(r)):$("#suglist li").length?(t.preventDefault(),$("#sug").show()):""===a&&g("",!1,!0);break;case 40:$("#sug").is(":visible")?(t.preventDefault(),e=$("#suglist li.current"),e.length?(n=e.next(),e.removeClass("current"),n.length||(n=!1)):n=$("#suglist li:first"),n?(n.addClass("current"),r=n.text()):r=a,r=$.trim(r),""===r?$("#ph").show():$("#ph").hide(),$("#isa").val(r)):$("#suglist li").length?(t.preventDefault(),$("#sug").show()):""===a&&g("",!1,!0)}}),$("#suglist").on("click","li",function(){var t;return t=$(this),t.addClass("current"),$("#ph").hide(),$("#isa").val($.trim(t.text())),$("#search-form").submit(),!1}),$("#suglist").on("hover","li",function(){var t;return t=$(this),t.parent().find("li").removeClass("current"),t.addClass("current"),!1}),$("#clear-history").on("click",function(t){u.clear(),$("#suglist").html(""),$("#sug").hide(),$("#isa").focus()}),$("#clear-history").on("hover",function(t){$("#suglist li").removeClass("current")}),$("#ph").on("click",function(t){return $("#isa").focus(),!1}),$(document).on("click",function(t){$("#isa,#search-btn").removeClass("box-shadow"),$("#sug").hide()}),$(document).on("keydown",function(t){if($("#overlay").is(":hidden")){if(36===t.keyCode||83===t.keyCode||70===t.keyCode)return $("#isa").focus(),!1}else 27===t.keyCode&&$("#overlay").trigger("click")}),$("#switch-lang").on("click","b",function(){i($(this).attr("lang"))}),$("#setting-icon").on("click",function(){$("#overlay").fadeIn("fast"),$("#setting-panel").fadeIn("fast"),$("#bgimg").focus()}),$("#bgimg").on("keydown",function(t){switch(t.keyCode){case 13:$("#set-bgimg").trigger("click");break;case 27:t.stopPropagation()}}),$("#set-bgimg").on("click",function(){var t,e;return t=$("#bgimg"),e=$.trim(t.val()),""!==e?l(e,function(){t.val(""),$("#overlay").trigger("click"),o.attr("bgimg",e),h(e)},function(){$("#imgerror-tip").show(),setTimeout(function(){$("#imgerror-tip").hide()},2e3),o.attr("bgimg",""),h("")}):void 0}),$("#overlay").on("click",function(){$("#setting-panel").fadeOut("fast"),$("#usage-content").fadeOut("fast"),$(this).fadeOut("fast"),setTimeout(function(){$("#isa").focus()},0)}),$("#usage").on("click",function(){$("#overlay").fadeIn("fast"),$("#usage-content").fadeIn("fast")}),$("#usage-close").on("click",function(){$("#overlay").trigger("click")}),$(window).on("resize",function(){f()}),$(window).on("focus",function(){$("#overlay").is(":hidden")&&$("#isa").focus()}),$(window).on("blur",function(){$("#sug").hide()})})}).call(this);