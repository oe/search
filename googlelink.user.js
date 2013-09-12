// ==UserScript==
// @name           Easy Access of Google Search
// @namespace      Saiya.Google.link
// @description    Make it easier to use google search(including cse)
// @match          *://www.google.com/*
// @match          *://www.google.com.hk/*
// @match          http://www.baidu.com/s*
// @updateURL      http://app.evecalm.com/search/googlelink.meta.js
// @downloadURL    http://app.evecalm.com/search/googlelink.user.js
// @version        0.54
// ==/UserScript==
function proxy(fn) {
	var script = document.createElement('script');
	script.textContent = '(' + fn.toString() + ')(window);';
	document.body.appendChild(script);
}
function main(Global){
	var host = location.host,
		csebody = document.querySelector('#cse-body'),
		i = 0,
		j = 0,
		anchors = null,
		caches = null;
	if (host === 'www.baidu.com') {
		var tg = document.querySelectorAll('.ec_pp_f,.ec_bdtg,.ad-layout-row,.ecl-weigou-nav-buy');
		if (tg.length) {
			tg = Array.prototype.slice.call(tg);
			tg.forEach(function (ele) {
				ele.remove();
			});
		}
		document.querySelector('#ec_im_container').remove();
		document.querySelector('#ecl-weigou-view-container').remove();
		document.querySelector('#ecl-weigou-nav-buy-transfer').remove();
		return;
	}
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
// main(window);
