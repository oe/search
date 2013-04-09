// ==UserScript==
// @name           Saiya.Google.Encripted
// @namespace      Saiya.Google.Encripted
// @description    Saiya.Google.Encripted, Make it easier to use google search(optimized for search result including wikipedia & facebook)
// @match          http://www.google.com/*
// @match          http://www.google.com.hk/*
// @match          https://www.google.com/*
// @match          https://www.google.com.hk/*
// @updateURL      https://userscripts.org/scripts/source/138814.meta.js
// @downloadURL    https://userscripts.org/scripts/source/138814.user.js
// @version        0.49
// ==/UserScript==
function proxy(fn) {
    var script = document.createElement('script');
    script.textContent = '(' + fn.toString() + ')(window);';
    document.body.appendChild(script);
}
function main(Global){
    var anchors = document.getElementById("ires").getElementsByTagName('h3'),
        anch = null,
        href = '',
        newHref = null,
        index;

    for(var i=0; i<anchors.length; ++i){
        anch = anchors[i].getElementsByTagName('a');
        if (1 == anch.length) {
            href = anch[0].href;
            if (/*(-1 < (index = href.indexOf('.wikipedia.org')) && index < 14) || */(-1 < (index = href.indexOf('.facebook.com')) && index < 15))
            {
                href = 'https' + href.substr(4);
            }
            newHref = document.createElement('a');
            newHref.innerHTML = 'Click Me➶';
            newHref.href = href;
            newHref.target = '_blank';
            newHref.style.marginRight = '20px';
            newHref.style.color = '#6ab8e6';
            anchors[i].insertBefore(newHref, anch[0]);
        }
    }
}
proxy(main);
