// ==UserScript==
// @name           Easy Access of Google Search
// @namespace      Saiya.Google.link
// @description    Make it easier to use google search(including cse)
// @match          *://www.google.com/search*
// @match          *://www.google.com.hk/search*
// @match          *://www.google.com/cse*
// @match          http://www.baidu.com/s*
// @updateURL      http://app.evecalm.com/search/googlelink.meta.js
// @downloadURL    http://app.evecalm.com/search/googlelink.user.js
// @version        0.56
// ==/UserScript==
function proxy(fn) {
	var script = document.createElement('script');
	script.textContent = '(' + fn.toString() + ')(window);';
	document.body.appendChild(script);
}
function main(Global){
	var resultBody;
	if (location.host === 'www.baidu.com') {
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
	if (location.href.indexOf('//www.google.com/cse')) {
		function removeCseRedirect () {
			var anchors = Array.prototype.slice.apply(document.querySelectorAll('#cse-body a.gs-title')); //for cse results
			anchors.forEach(function (el) {
				el.setAttribute('data-cturl','');
				el.setAttribute('target','_blank');
			});
		}
		document.body.addEventListener('DOMSubtreeModified',function  (event) {
			clearTimeout(removeCseRedirect.tId);
			if (!document.querySelector('#cse-body')) return;
			removeCseRedirect.tId = setTimeout(removeCseRedirect, 450);
		},false);
	} else {
		resultBody = document.querySelector('#main');
		function removeRedirect () {
			var anchors = Array.prototype.slice.apply(document.querySelectorAll('#ires h3 a')), // google search results' links
				caches = Array.prototype.slice.apply(document.querySelectorAll('#ires .action-menu-panel ul a')); // for webcaches' links
			anchors.forEach(function (el) {
				anchors[i].onmousedown = null;
			});
			caches.forEach(function (el) {
				caches[i].href = caches[i].href.replace('http://','https://');
				caches[i].onmousedown = null;
			})
		}
		resultBody.addEventListener('DOMSubtreeModified',function  (event) {
			clearTimeout(removeRedirect.tId);
			removeRedirect.tId = setTimeout(removeRedirect, 350);
		},false);
	}
};
proxy(main);