var cookie={mycookie:{},init:function(){var e=document.cookie;e=e.split("; ");var t=[];for(var n=0,r=e.length;n<r;n++){t=e[n].split("=");this.mycookie[t[0]]=unescape(t[1])}var i=this.attr("lang");this.setlang(i);undefined===this.attr("defaultType")&&this.attr("defaultType","search");undefined===this.attr("defaultEngine")&&this.attr("defaultEngine","google");undefined===this.attr("newin")&&this.attr("newin","1")},attr:function(e,t,n,r){if(typeof t=="undefined")return typeof this.mycookie[e]=="undefined"?undefined:this.mycookie[e];if(typeof n=="undefined")n="Sat, 19 Jan 2037 03:52:43 GMT";else{var i=new Date;i.setTime(i.getTime()+n*24*60*60*1e3);n=i.toGMTString()}r=r?r:"/";t=escape(t);document.cookie=e+"="+t+";expires="+n+";path="+r;this.mycookie[e]=t;return this.mycookie[e]},remove:function(e){var t=this.attr(e);if(undefined!==t){var n=new Date;n.setTime(n.getTime()-1);document.cookie=e+"="+t+";expires="+n.toGMTString();delete this.mycookie[e]}return!0},setlang:function(e){if(undefined===e||"zh"!==e&&"en"!==e){e=undefined===window.navigator.language?window.navigator.browserLanguage:window.navigator.language;return"zh-cn"===e.toLowerCase()?this.attr("lang","zh"):this.attr("lang","en")}return this.attr("lang",e)}};$.toJSONString=JSON.stringify||function(e){var t=typeof e;if(t!=="object"||e===null){t=="string"&&(e='"'+e+'"');return String(e)}var n,r,i=[],s=e&&e.constructor==Array;for(n in e){r=e[n];t=typeof r;t==="string"?r='"'+r+'"':t==="object"&&r!==null&&(r=JSON.stringify(r));i.push((s?"":'"'+n+'":')+String(r))}return(s?"[":"{")+String(i)+(s?"]":"}")};$(function(){function l(e,t,n){try{var r="",i="",s="",u=cookie.attr("bgimg"),a;a=o.placeholder[e];for(var f in o.searches)if(o.searches.hasOwnProperty(f)){s=f==t?"checked":"";i+='<li><label><input type="radio" name="type" value="'+f+'" '+s+">"+o.searches[f][e]+"</label></li>";s=f==t?" current":"";r+='<ul class="'+f+s+'">';keys=o.searches[f].engines;for(var l in keys)if(keys.hasOwnProperty(l)){s=l==n&&f==t?'class="current"':"";r+='<li data="'+l+'" '+s+">"+keys[l][e]+"</li>"}r+="</ul>"}document.title=o.title[e];if(u){$(document.body).css("background-image","url("+u+")");$(".search-wrapper,.appinfo").addClass("trsprt-bg")}$("#switch-lang").html(o.lang[e]);$("#app-name").html(o.title[e]);$("#ico").addClass("ico-"+t);$("#ph").html(a);$("#search-btn").text(o.submit[e]);$("#search-engine-list").html(r);$("#search-cat").html(i);var c=null;if(0===$("#search-engine-list ."+t).length){c=$("#search-engine-list ul:eq(0)");t=c.attr("class");c.addClass("current");cookie.attr("defaultType",t)}if(0===$("#search-engine-list ."+t+" li.current").length){c=$("#search-engine-list ."+t+" li:eq(0)");searchEngine=c.attr("data");c.addClass("current");cookie.attr("defaultEngine",searchEngine)}$("#search-cat input:checked").length||$("#search-cat li:eq(0) label").click();p(t,n);-1!==navigator.userAgent.indexOf("Chrome")&&console.log("%cThanks for your attention!\nYou can visit https://github.com/evecalm/search for uncompressed source code.\nHere is my website http://www.evecalm.com.","font-size: 14px;color:#068;font-weight: bolder;")}catch(h){alert("Init error! You may try to reload this page.")}}function c(){var e="";u=0;s=-1;if(n.length){u=n.length;for(var t=0;t<u;++t)e+="<li>"+n[t]+"</li>";e+='<li id="clear-history">'+o.clearhistory[r]+"</li>"}return e}function h(){$("#sug").css({top:$(".search-form").offset().top+$(".search-form").height(),left:$(".search-form").offset().left})}function p(e,t){var n=o.searches[e].engines[t],r=n.hiddens,i="";$("#search-form").attr("accept-charset",n.charset||"utf-8");$("#search-form").attr("action",n.url);$("#isa").attr("name",n.key);if(r)for(var s in r)r.hasOwnProperty(s)&&(i+='<input type="hidden" name="'+s+'" value="'+r[s]+'">');$("#hiddens").html(i);$("#link").attr("href",n.link)}function d(e,t){if(!f[t])return;var r;e=e.replace(/^\s*|\s*$/g,"");if(e===""){$("#sug").hide();return}r=f[t].replace("@",encodeURIComponent(e));try{$.getJSON(r,function(r){var i=0,s="",o=0,a,f;e=e.toLowerCase();for(f=0,i=n.length;f<i;++f)if(-1!==n[f].toLowerCase().indexOf(e)){++o;s+='<li class="s-h">'+n[f]+"</li>"}f=o;if(t=="shop"){a=r.result;i=Math.min(a.length,10);if(i)for(;f<i;++f)s+="<li>"+a[f][0]+"</li>"}else{a=r.s;i=Math.min(a.length,10);if(i)if(t=="map")for(;f<i;++f)s+="<li>"+a[f].replace(/(\$)|(\d*$)/g," ")+"</li>";else for(;f<i;++f)s+="<li>"+a[f]+"</li>"}i?$("#sug").html(s).show():$("#sug").hide();u=i})}catch(i){u=0}s=-1}cookie.init();var e=cookie.attr("defaultType"),t=cookie.attr("defaultEngine"),n=$.parseJSON(cookie.attr("history"))||[],r=cookie.attr("lang"),i=!1,s=-1,o=window.config,u=0,a="",f={search:"http://suggestion.baidu.com/su?wd=@&p=3&cb=?",music:"http://nssug.baidu.com/su?wd=@&prod=mp3&cb=?",video:"http://nssug.baidu.com/su?wd=@&prod=video&cb=?",question:"http://nssug.baidu.com/su?wd=@&prod=zhidao&cb=?",image:"http://nssug.baidu.com/su?wd=@&ie=utf-8&prod=image&cb=?",map:"http://map.baidu.com/su?wd=@&ie=utf-8&cid=1&type=0&newmap=1&callback=?",doc:"http://nssug.baidu.com/su?wd=@&prod=wenku&oe=utf-8&cb=?",shop:"http://suggest.taobao.com/sug?area=etao&code=utf-8&q=@&callback=?"};!n instanceof Array&&(n=[]);l(r,e,t);h();$("#sug").html(c());$("#isa").on("click focus",function(e){e.stopPropagation();$("#isa,#search-btn").addClass("box-shadow")}).focus();$("#ph").on("click",function(e){e.stopPropagation();$("#isa").focus()});$(document).on("click",function(){$("#sug").hide();$("#isa,#search-btn").removeClass("box-shadow");$("#setting-icon").removeClass("current");$("#setting-panel").hide()});$(document).on("keydown",function(e){if(e.keyCode===36||e.keyCode===83){$("#isa").focus();return!1}});window.onresize=function(){h()};window.onfocus=function(){$("#isa").focus()};window.onblur=function(){$("#sug").hide()};window.onbeforeunload=function(i){cookie.attr("history",$.toJSONString(n));cookie.attr("defaultType",e);cookie.attr("defaultEngine",t);cookie.attr("lang",r)};$("#switch-lang").on("click","span",function(){r=$(this).attr("data");l(r,e,t)});$("#setting-icon").on("click",function(e){e.stopPropagation();$(this).addClass("current");$("#setting-panel").show();$("#bgimg").focus()});$("#set-bgimg").on("click",function(e){e.stopPropagation();var t=$("#bgimg").val(),n=new Image,r,i;r=function(){$(document.body).css("background-image","url("+t+")");$("#bgimg").val("");cookie.attr("bgimg",t);$("#setting-icon").removeClass("current");$("#setting-panel").hide();$(".search-wrapper,.appinfo").addClass("trsprt-bg");n=null};i=function(){$(document.body).css("background-image","");cookie.attr("bgimg","");$(".search-wrapper,.appinfo").removeClass("trsprt-bg");$("#imgerror-tip").html(o.imgloaderror[cookie.attr("lang")]).show();setTimeout(function(){$("#imgerror-tip").hide()},2e3);n=null};n.onerror=i;n.onload=r;t&&(n.src=t)});$("#bgimg").on("keydown",function(e){if(e.keyCode===13){$("#set-bgimg").click();return!1}});$("#setting-panel").on("click",function(e){e.stopPropagation()});$("#isa").on("input propertychange",function(t){if(""===$(this).val()){$("#ph").show();a="";i||$("#sug").html(c()).hide()}else{$("#ph").hide();if(!i&&a!=$(this).val()){a=$(this).val();d(a,e)}}});$("#isa").on("keydown",function(t){var n=!0,r=0,o="",f=$("#sug"),l=$("#ph");t.stopPropagation();i=!1;switch(t.keyCode){case 9:var c,h;if(t.shiftKey){c=$("#search-cat li").length;h=$("#search-cat li input:checked").parents("li").index()|0;++h;h%=c;$("#search-cat li:eq("+h+") label").click();$("#isa").focus()}else{c=$("."+e+" li").length;h=$("."+e+" li.current").index()|0;++h;h%=c;$("."+e+" li:eq("+h+")").click()}n=!1;break;case 13:f.hide();n=!0;break;case 27:f.hide();n=!1;break;case 38:if(!u)return n;i=!0;f.show();l.hide();r=s-1;r<-1&&(r=u-1);$("#sug li:eq("+s+")").removeClass("current");o=-1==r?a:$("#sug li:eq("+r+")").addClass("current").text();$(this).val(o);o===""&&$("#ph").show();s=r;n=!1;break;case 40:if(!u)return n;i=!0;f.show();l.hide();r=s+1;r>=u&&(r=-1);$("#sug li:eq("+s+")").removeClass("current");o=-1==r?a:$("#sug li:eq("+r+")").addClass("current").text();$(this).val(o);o===""&&$("#ph").show();s=r;n=!1;break;default:}return n});$("#sug").on("hover","li",function(){var e=$(this).index();if(e===s)$(this).addClass("current");else{$("#sug li:eq("+s+")").removeClass("current");$("#sug li:eq("+e+")").addClass("current");s=e}});$("#sug").on("click","li",function(e){if(e.srcElement.id==="clear-history"){n=[];u=0;$("#sug").html("").hide();$("#isa").focus();return!1}a=$(this).html();$("#isa").val(a);$("#search-form").submit()});$("#search-cat").on("click","li label",function(){var n=$(this).children("input");if(e!=n.val()){$("#search-engine-list ."+e+" li.current").removeClass("current");$("#search-engine-list ."+e).removeClass("current");$("#ico").removeClass("ico-"+e);e=n.val();$("#ico").addClass("ico-"+e);$("#search-engine-list ."+e).addClass("current");t=$("#search-engine-list ."+e+" li:eq(0)").addClass("current").attr("data");p(e,t)}$("#isa").focus()});$("#search-engine-list").on("click","ul li",function(){if(t!=$(this).attr("data")){$("#search-engine-list ul li.current").removeClass("current");t=$(this).addClass("current").attr("data");p(e,t)}$("#isa").focus()});$("#search-form").on("submit",function(){$("#sug").hide();a=$("#isa").val();if(""===a)return!1;if(" "===a||t==="qiyi"||e==="map"&&t==="baidu"){var r;if(t==="qiyi"){r=$("#search-form").attr("action")+"q_";r+=encodeURIComponent(a);$("#link").attr("href",r)}else if(t==="baidu"){r=$("#search-form").attr("action")+"?newmap=1&ie=utf-8&s=s%26wd%3D";r+=encodeURIComponent(a)+"%26c%3D1";$("#link").attr("href",r)}$("#link")[0].click();return!1}var i=0,s=n.length;if(s>10){n.splice(10,s);s=10}for(;i<s;++i)if(a==n[i]){if(i!==0){n.splice(i,1);n.unshift(a)}break}if(i===s){n.unshift(a);s===10&&n.splice(10,1)}return!0})});