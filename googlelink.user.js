// ==UserScript==
// @name           Saiya.Google.Encripted
// @namespace      Saiya.Google.Encripted
// @description    Saiya.Google.Encripted, Make it easier to use google search(optimized for search result including wikipedia & facebook)
// @match          http://www.google.com/*
// @match          http://www.google.com.hk/*
// @match          https://www.google.com/*
// @match          https://www.google.com.hk/*
// @updateURL      http://app.evecalm.com/search/googlelink.meta.js
// @downloadURL    http://app.evecalm.com/search/googlelink.user.js
// @version        0.51
// ==/UserScript==
function proxy(fn) {
	var script = document.createElement('script');
	script.textContent = '(' + fn.toString() + ')(window);';
	document.body.appendChild(script);
}
function main(Global){
	var anchors = document.querySelectorAll('#ires h3 a'),
		caches = document.querySelectorAll('#ires .action-menu-panel ul a'),
		i,
		j,
		nullFun = function  () {
			return true;
		};
	for (i = 0,j = anchors.length; i < j; ++i) {
		anchors[i].onmousedown = nullFun;
		if (caches[i]) {
			caches[i].href = caches[i].href.replace('http://','https://');
			caches[i].onmousedown = nullFun;
		}
	}
}
proxy(main);
