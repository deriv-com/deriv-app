const isVisible     = require('./common_functions').isVisible;
const Url           = require('./url');
const createElement = require('./utility').createElement;

/*
    adds anchor links to elements with data-anchor attribute
    created anchors work similarly to native anchors,
    but rely on URL params instead

    HOW TO USE:
        <h1 data-anchor>Some title</h1>
*/

const ScrollToAnchor = (() => {
    let id_occurrence_count = {};

    const init = () => {
        addAnchorsToElements();
        const target = getAnchorTargetElement();

        // remove query param if loaded onto a page without target element
        if (!target || !isVisible(target)) {
            Url.updateParamsWithoutReload({
                anchor: null,
            }, true);
        } else {
            scrollToAnchorInQuery();
        }
    };

    const encode = (str) => {
        const encoded = str.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
        let appendix = '';
        if (id_occurrence_count[encoded]) {
            appendix = `-${++id_occurrence_count[encoded]}`;
        } else {
            id_occurrence_count[encoded] = 1;
        }
        return encodeURI(`${encoded}${appendix}`);
    };

    const makeAnchorLink = (id) => {
        const url = new URL(window.location);
        url.search = `anchor=${id}`;

        return createElement('a', {
            class: 'data-anchor-link',
            href : url.href,
        });
    };

    const addAnchorsToElements = () => {
        const els = document.querySelectorAll('[data-anchor]');
        els.forEach(el => {
            if (el.querySelector('.data-anchor-link')) return;
            const title = el.getAttribute('data-anchor') === 'true' ? el.innerText : el.getAttribute('data-anchor'); // use data-anchor value else use innerText
            const id = encode(title);
            el.dataset.anchor = id;
            const anchor_link = makeAnchorLink(id);
            el.appendChild(anchor_link);
            anchor_link.addEventListener('click', (e) => {
                e.preventDefault();
                scrollToEl(el);
                Url.updateParamsWithoutReload({
                    anchor: id,
                }, true);
            });
        });
    };

    const scrollToEl = (el) => {
        $.scrollTo(el, 500, { offset: -10 });
    };

    const getAnchorTargetElement = () => {
        const id = Url.paramsHash().anchor;
        if (!id) return null;
        return document.querySelector(`[data-anchor="${id}"]`);
    };

    const scrollToAnchorInQuery = () => {
        const el = getAnchorTargetElement();
        if (!el) return;
        window.setTimeout(() => {
            scrollToEl(el);
        }, 100);
    };

    const cleanup = () => {
        id_occurrence_count = {};
    };

    return {
        init,
        cleanup,
    };
})();

module.exports = ScrollToAnchor;
