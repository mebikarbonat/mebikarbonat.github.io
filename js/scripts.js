/* Muhammad Azizi Mohd Ariffin - personal site
   Vanilla JS: copyright year, active contents highlight, back-to-top reveal.
   No jQuery, no Bootstrap. */
(function () {
    'use strict';

    var yearEl = document.getElementById('year');
    if (yearEl) { yearEl.textContent = new Date().getFullYear(); }

    var toTop = document.querySelector('.to-top');
    function onScroll() {
        if (!toTop) { return; }
        if (window.scrollY > 600) { toTop.classList.add('is-visible'); }
        else { toTop.classList.remove('is-visible'); }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    var links = Array.prototype.slice.call(document.querySelectorAll('.toc-list a'));
    var targets = [];
    links.forEach(function (a) {
        var href = a.getAttribute('href') || '';
        if (href.charAt(0) !== '#') { return; }
        var el = document.getElementById(href.slice(1));
        if (el) { targets.push(el); }
    });

    if (targets.length && 'IntersectionObserver' in window) {
        var ratios = {};
        var setCurrent = function (id) {
            links.forEach(function (a) {
                if (a.getAttribute('href') === '#' + id) { a.setAttribute('aria-current', 'true'); }
                else { a.removeAttribute('aria-current'); }
            });
        };
        var pick = function () {
            var best = null, bestRatio = 0;
            Object.keys(ratios).forEach(function (id) {
                if (ratios[id] > bestRatio) { bestRatio = ratios[id]; best = id; }
            });
            if (best) { setCurrent(best); }
        };
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                ratios[entry.target.id] = entry.isIntersecting ? entry.intersectionRatio : 0;
            });
            pick();
        }, { rootMargin: '-12% 0px -55% 0px', threshold: [0, 0.1, 0.35, 0.7, 1] });
        targets.forEach(function (t) { observer.observe(t); });
    }
})();
