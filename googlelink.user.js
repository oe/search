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
// @version        0.52
// ==/UserScript==
function proxy(fn) {
	var script = document.createElement('script');
	script.textContent = '(' + fn.toString() + ')(window);';
	document.body.appendChild(script);
}
function main(Global){
	var csebody = document.querySelector('#cse-body'),
		i = 0,
		j = 0,
		anchors = null,
		caches = null;
	if (csebody) {
		i = 0;
		csebody.addEventListener('DOMSubtreeModified',function  (event) {
			anchors = document.querySelectorAll('#cse-body a.gs-title'); //for cse results
			j = anchors.length;
			for (; i < j; ++i) {
				console.log(i);
				anchors[i].setAttribute('data-cturl','');
				anchors[i].setAttribute('target','_blank');
			}
		},false);
	} else {
		anchors = document.querySelectorAll('#ires h3 a'); // google search results' links
		caches = document.querySelectorAll('#ires .action-menu-panel ul a'); // for webcaches' links
		for (i = 0,j = anchors.length; i < j; ++i) {
			anchors[i].onmousedown = null;
			if (caches[i]) {
				caches[i].href = caches[i].href.replace('http://','https://');
				caches[i].onmousedown = null;
			}
		}
	}
}
proxy(main);
