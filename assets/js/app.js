var __indexOf=[].indexOf||function(t){for(var e=0,i=this.length;i>e;e++)if(e in this&&this[e]===t)return e;return-1};$(function(){var t,e,i,n,o,r,s,a,c,l,u,h,f,g;r="",o="",s="",$.toJSONString=window.JSON&&window.JSON.stringify||(g=function(t){var e,i,n,o,r;if(o=typeof t,"object"!==o||null===t)return"string"===o&&(t='"'+t+'"'),String(t);i=[],e=t&&t.constructor===Array;for(n in t)r=t[n],o=typeof r,"string"===o?r='"'+r+'"':"object"===o&&null!==r&&(r=g(r)),i.push((e?"":'"'+n+'"')+String(r));return e?"["+String(i)+"]":"{"+String(i)+"}"}),n={_cookie:function(){var t,e,i,n,o,r;for(e={},t=document.cookie.split("; "),o=0,r=t.length;r>o;o++)n=t[o],i=n.split("="),e[i[0]]=unescape(i[1]);return e}(),attr:function(t,e,i,n){var o;return void 0===e?void 0===this._cookie[t]?void 0:this._cookie[t]:(void 0===i?i="Sat, 19 Jan 2037 03:52:43 GMT":(o=new Date,o.setTime(o.getTime()+24*i*60*60*1e3),o=o.toGMTString()),n||(n="/"),e=escape(e),document.cookie=""+t+"="+e+";expires="+i+";path="+n,this._cookie[t]=e,this._cookie)},remove:function(t){var e,i;return i=this._cookie[t],null!=i&&(e=new Date,e.setTime(e.getTime-1),document.cookie=""+t+"="+i+";expires="+e.toGMTString()),this._cookie}},l={_MAX:10,_history:function(){var t;return t=n.attr("history"),t=t?$.parseJSON(t):[]}(),add:function(t){return __indexOf.call(this._history,t)<0&&(this._history.unshift(t),this._history.length>this._MAX&&this._history.pop(),n.attr("history",$.toJSONString(this._history))),this},clear:function(){return this._history.length=0,n.attr("history",$.toJSONString(this._history)),this},get:function(){return this._history}},e=function(t){var e,i;i=["en","zh"],i.indexOf(t)>-1&&(e=document.documentElement.className.replace(/lang\-[a-z]+/,""),e+=" lang-"+t,document.documentElement.className=e.replace(/^\s+|\s+$/g,""),null!=n&&n.attr("lang",t),document.title="zh"===t?"综合搜索":"Union Search")},h=function(){$("#sug").css({top:$(".search-form").offset().top+$(".search-form").height(),left:$(".search-form").offset().left})},f=function(t,e,i){var n,o,r,s,a,c,u,h,f,g,d,p,m;if(r=10,n=$("#sug"),o=$("#suglist"),o.html(""),s=0,c=l.get(),a="",i){for(h=0,d=c.length;d>h&&(u=c[h],!(s>=r));h++)++s,a+="<li>"+u+"</li>";$("#clear-history").show()}else{for(f=0,p=c.length;p>f&&(u=c[f],!(s>=r));f++)u.indexOf(t)>-1&&(++s,a+="<li class='s-h'>"+u+"</li>");$("#clear-history").hide()}if(e&&r>s)for(g=0,m=e.length;m>g&&(u=e[g],__indexOf.call(c,u)>=0||(++s,a+="<li>"+u+"</li>",!(s>=r)));g++);s?(o.html(a),n.show()):n.hide()},a=function(t,e,i){var n,o,r;if(r={search:"http://suggestion.baidu.com/su?wd=@&p=3&cb=?",music:"http://nssug.baidu.com/su?wd=@&prod=mp3&cb=?",video:"http://nssug.baidu.com/su?wd=@&prod=video&cb=?",question:"http://nssug.baidu.com/su?wd=@&prod=zhidao&cb=?",image:"http://nssug.baidu.com/su?wd=@&ie=utf-8&prod=image&cb=?",map:"http://map.baidu.com/su?wd=@&ie=utf-8&cid=1&type=0&newmap=1&callback=?",doc:"http://nssug.baidu.com/su?wd=@&prod=wenku&oe=utf-8&cb=?",shop:"http://suggest.taobao.com/sug?area=etao&code=utf-8&q=@&callback=?"},o=r[e],!o)return"function"==typeof i&&i(t),void 0;if(""===e||null==e)return"function"==typeof i&&i(t),void 0;o=o.replace("@",encodeURIComponent(t));try{$.getJSON(o,function(n){var o,r,s,a,c,l,u,h;switch(o=[],e){case"shop":for(u=n.result,s=0,c=u.length;c>s;s++)r=u[s],o.push(r[0]);break;case"map":for(h=n.s,a=0,l=h.length;l>a;a++)r=h[a],o.push($.trim($.trim(r.replace(/(\$+)/g," ")).replace(/\d+$/,"")));break;default:o=n.s}"function"==typeof i&&i(t,o)})}catch(s){n=s,"function"==typeof i&&i(t)}},t=function(t){var e;return e=["64.233.168.97","173.194.124.55","74.125.110.236","173.194.21.233","173.194.124.108"],t.indexOf("www.google.com")>-1?t.replace("www.google.com",e[Math.floor(e.length*Math.random())]):t},i=function(t,e){var i,s,a,c,l,u,h,f,g;if(i=$("#search-engine-list"),null!=e&&(c=i.find(">ul[data-engine-type='"+e+"']")),e&&c.length||(c=i.find(">ul.current"),c.length||(c=i.find(">ul:first"))),e=c.data("engine-type"),$("#search-cat>li[data-type='"+e+"'] input").prop("checked",!0),i.find(">ul.current").removeClass("current"),c.addClass("current"),null!=t&&(a=c.find(">li[data-engine-name='"+t+"']")),t&&a.length||(a=c.find(">li.current"),a.length||(a=c.find(">li:first"))),t=a.data("engine-name"),c.find(">li.current").removeClass("current"),a.addClass("current"),s=$("#search-form"),l=a.data(),s.attr("accept-charset",l.charset||"utf-8"),s.attr("action",l.url),s.attr("origin-action",l.url),$("#isa").attr("name",l.key),$("#link").attr("href",l.link),$("#link").attr("origin-href",l.link),u=l.hiddens,h="",u)for(f in u)g=u[f],h+="<input type='hidden' name='"+f+"' value='"+g+"'>";$("#hiddens").html(h),n.attr("defaultType",e),n.attr("defaultEngine",t),r=e,o=t},c=function(t,e,i){var n;n=new Image,e&&(n.onload=e),i&&(n.onerror=i),n.src=t},u=function(t){t?(document.body.style.backgroundImage="url("+t+")",$("#search-wrapper").addClass("trsprt-bg"),$("#footer").addClass("trsprt-bg")):(document.body.style.backgroundImage="",$("#search-wrapper").removeClass("trsprt-bg"),$("#footer").removeClass("trsprt-bg"))},$("#isa").on("focus",function(t){t.stopPropagation(),$("#isa,#search-btn").addClass("box-shadow")}),function(){var t;t=n.attr("lang"),void 0===t&&(t=null!=window.navigator.language?window.navigator.language:window.navigator.browserLanguage,t="zh-cn"===t.toLowerCase()?"zh":"en"),e(t),i(n.attr("defaultEngine"),n.attr("defaultType")),u(n.attr("bgimg")),setTimeout(function(){var t;$("#isa").focus(),navigator.userAgent.indexOf("Chrome")>-1&&(t="l2v2l6v2e1l1v3l2v3e1v7e1v7e1v7e1l2v6e1l4v5e1l6v4e1l8v3e1l7l3v2e1l9l3v1".replace(/[lve]\d/g,function(t){return Array(-~t[1]).join({l:" ",v:"Love",e:"\n"}[t[0]])}),console.log("%c%s\n%cThanks for your attention!\nYou can visit https://github.com/evecalm/search for uncompressed source code.\nHere is my website http://www.evecalm.com.","color: #ed5565;",t,"font-size: 18px;color:#068;font-weight: 400;"))},0),h()}(),$("#search-engine-list").on("click","li",function(t){var e;return e=$(this),e.hasClass("current")||i(e.data("engine-name")),$("#isa").focus(),t.stopPropagation(),!1}),$("#search-cat").on("click","input",function(t){var e;e=$(this),i(null,e.closest("li").data("type")),$("#isa").focus(),t.stopPropagation()}),$("#search-form").on("submit",function(){var e,i,n,a;return i=$(this),e=$("#link"),$("#sug").hide(),a=$("#isa").val()," "===a?(n=t(e.attr("origin-href")),e.attr("href",n),e[0].click(),!1):""===a?!1:(s=a,l.add(a),n=t(i.attr("origin-action")),"qiyi"===o||"map"===r&&"baidu"===o?(n+="qiyi"===o?"q_"+encodeURIComponent(a):"?newmap=1&ie=utf-8&s=s%26wd%3D"+encodeURIComponent(a)+"%26c%3D1",e.attr("href",n),e[0].click(),!1):(i.attr("action",n),void 0))}),$("#search-wrapper").on("click",function(t){t.stopPropagation(),$("#isa").focus(),$("#sug").hide()}),$("#isa").on("click",function(t){t.stopPropagation(),""===this.value?f("",!1,!0):$("#suglist li").length&&$("#sug").show()}),$("#isa").on("input propertychange",function(){var t;t=$(this).val(),""===t?($("#ph").show(),$("#sug").hide(),$("#suglist").html(""),s=t):($("#ph").hide(),""!==$.trim(t)&&(s=t,a(t,r,f)))}),$("#isa").on("keydown",function(t){var e,i,n,o,r;switch(t.stopPropagation(),t.keyCode){case 9:t.shiftKey?(i=$("#search-cat"),o=i.find(">li input:checked").closest("li").next(),o.length||(o=i.find(">li:first")),o.find("input").trigger("click")):(i=$("#search-engine-list ul.current"),o=i.find(">li.current").next(),o.length||(o=i.find(">li:first")),o.trigger("click")),t.preventDefault();break;case 27:$("#sug").hide();break;case 38:$("#sug").is(":visible")?(t.preventDefault(),e=$("#suglist li.current"),e.length?(n=e.prev(),e.removeClass("current"),n.length||(n=!1)):n=$("#suglist li:last"),n?(n.addClass("current"),r=n.text()):r=s,r=$.trim(r),""===r?$("#ph").show():$("#ph").hide(),$("#isa").val(r)):$("#suglist li").length?(t.preventDefault(),$("#sug").show()):""===s&&f("",!1,!0);break;case 40:$("#sug").is(":visible")?(t.preventDefault(),e=$("#suglist li.current"),e.length?(n=e.next(),e.removeClass("current"),n.length||(n=!1)):n=$("#suglist li:first"),n?(n.addClass("current"),r=n.text()):r=s,r=$.trim(r),""===r?$("#ph").show():$("#ph").hide(),$("#isa").val(r)):$("#suglist li").length?(t.preventDefault(),$("#sug").show()):""===s&&f("",!1,!0)}}),$("#suglist").on("click","li",function(){var t;return t=$(this),t.addClass("current"),$("#ph").hide(),$("#isa").val($.trim(t.text())),$("#search-form").submit(),!1}),$("#suglist").on("hover","li",function(){var t;return t=$(this),t.parent().find("li").removeClass("current"),t.addClass("current"),!1}),$("#clear-history").on("click",function(){l.clear(),$("#suglist").html(""),$("#sug").hide(),$("#isa").focus()}),$("#clear-history").on("hover",function(){$("#suglist li").removeClass("current")}),$("#ph").on("click",function(){return $("#isa").focus(),!1}),$(document).on("click",function(){$("#isa,#search-btn").removeClass("box-shadow"),$("#sug").hide()}),$(document).on("keydown",function(t){if($("#overlay").is(":hidden")){if(36===t.keyCode||83===t.keyCode||70===t.keyCode)return $("#isa").focus(),!1}else 27===t.keyCode&&$("#overlay").trigger("click")}),$("#switch-lang").on("click","b",function(){e($(this).attr("lang"))}),$("#setting-icon").on("click",function(){$("#overlay").fadeIn("fast"),$("#setting-panel").fadeIn("fast"),$("#bgimg").focus()}),$("#bgimg").on("keydown",function(t){switch(t.keyCode){case 13:$("#set-bgimg").trigger("click");break;case 27:t.stopPropagation()}}),$("#set-bgimg").on("click",function(){var t,e;return t=$("#bgimg"),e=$.trim(t.val()),""!==e?c(e,function(){t.val(""),$("#overlay").trigger("click"),n.attr("bgimg",e),u(e)},function(){$("#imgerror-tip").show(),setTimeout(function(){$("#imgerror-tip").hide()},2e3),n.attr("bgimg",""),u("")}):void 0}),$("#overlay").on("click",function(){$("#setting-panel").fadeOut("fast"),$("#usage-content").fadeOut("fast"),$(this).fadeOut("fast"),setTimeout(function(){$("#isa").focus()},0)}),$("#usage").on("click",function(){$("#overlay").fadeIn("fast"),$("#usage-content").fadeIn("fast")}),$("#usage-close").on("click",function(){$("#overlay").trigger("click")}),$(window).on("resize",function(){h()}),$(window).on("focus",function(){$("#overlay").is(":hidden")&&$("#isa").focus()}),$(window).on("blur",function(){$("#sug").hide()})});