const tabListener        = require('@binary-com/binary-style').tabListener;
const getElementById     = require('./common_functions').getElementById;
const Url                = require('./url');
const applyToAllElements = require('./utility').applyToAllElements;

const TabSelector = (() => {
    // obj_tabs will be built in the following format:
    // obj_tabs = { first_tab_group_selector_id: { id_tabs: [ id_of_tab_one, id_of_tab_two ] }
    // we will use id_tabs to handle which tab to show when going to the left or right tab
    let obj_tabs = {};

    const onLoad = () => {
        tabListener();
        obj_tabs = {};
        applyToAllElements('.tab-selector-wrapper .tm-ul', (tab_selector) => {
            const tab_selector_id = tab_selector.getAttribute('id');
            applyToAllElements('.tm-li', (tab) => {
                if (!/tab-selector/.test(tab.className)) {
                    const tab_id = tab.getAttribute('id');
                    if (!obj_tabs[tab_selector_id]) {
                        obj_tabs[tab_selector_id] = { id_tabs: [] };
                    }
                    if (!obj_tabs[tab_selector_id].circles) {
                        obj_tabs[tab_selector_id].circles = getElementById(`${tab_selector_id}_circles`).children;
                    }
                    obj_tabs[tab_selector_id].id_tabs.push(tab_id);
                }
                tab.addEventListener('click', slideSelectorOnMenuClick);
            }, '', tab_selector);
        });
        // set initial width and margin-left of tab selector
        repositionSelector();
        window.addEventListener('resize', repositionSelector);

        applyToAllElements('.go-left', (element) => {
            element.addEventListener('click', goLeft);
        });
        applyToAllElements('.go-right', (element) => {
            element.addEventListener('click', goRight);
        });
    };

    const repositionSelector = () => {
        const params_hash = Url.paramsHash();
        Object.keys(obj_tabs).forEach((tab_id) => {
            const id_to_show = params_hash[tab_id] || obj_tabs[tab_id].id_tabs[0];
            const el_to_show = getElementById(id_to_show);
            if (el_to_show.parentNode) {
                const selector = el_to_show.parentNode.getAttribute('id');
                changeTab({ selector, el_to_show });
            }
        });
    };

    const slideSelectorOnMenuClick = (e) => {
        if (e.target.nodeName !== 'A' || /a-active/.test(e.target.classList)) {
            return;
        }
        const selector      = e.target.closest('ul').getAttribute('id');
        const current_index = obj_tabs[selector].id_tabs.indexOf(e.target.parentNode.getAttribute('id'));
        slideSelector(selector, e.target);
        Array.from(obj_tabs[selector].circles).forEach((circle, idx) => {
            if (idx === current_index) {
                circle.classList.add('selected');
            } else {
                circle.classList.remove('selected');
            }
        });
        updateURL(selector, e.target.parentNode.getAttribute('id'));
    };

    const updateURL = (selector, tab_id) => {
        Url.updateParamsWithoutReload({
            [selector]: tab_id,
        }, true);
    };

    const goLeft = (e) => {
        changeTab({ selector: e.target.getAttribute('data-parent'), direction: 'left' });
    };

    const goRight = (e) => {
        changeTab({ selector: e.target.getAttribute('data-parent'), direction: 'right' });
    };

    const changeTab = (options) => {
        const params_hash     = Url.paramsHash();
        const arr_id_tabs     = obj_tabs[options.selector].id_tabs;
        const id_selected_tab = params_hash[options.selector] || obj_tabs[options.selector].id_tabs[0];
        const current_index   = arr_id_tabs.indexOf(id_selected_tab);
        let index_to_show = current_index;
        if (options.direction) {
            if (options.direction === 'left') {
                index_to_show = current_index > 0 ? current_index - 1 : arr_id_tabs.length - 1;
            } else {
                index_to_show = current_index === arr_id_tabs.length - 1 ? 0 : current_index + 1;
            }
            options.el_to_show = getElementById(arr_id_tabs[index_to_show]);
            updateURL(options.selector, arr_id_tabs[index_to_show]);
        }

        if (!options.el_to_show || !options.selector) {
            return;
        }

        selectCircle(options.selector, current_index, index_to_show);
        slideSelector(options.selector, options.el_to_show);
        options.el_to_show.getElementsByTagName('a')[0].click();

        if (params_hash.section) {
            setTimeout(() => { $.scrollTo($(`#${params_hash.section}`), 500, { offset: -10 }); }, 500);
        }
    };

    const slideSelector = (selector, el_to_show) => {
        getElementById(`${selector}_selector`).setAttribute('style', `width: ${el_to_show.offsetWidth}px; margin-left: ${el_to_show.offsetLeft}px;`);
    };

    const selectCircle = (selector, old_index, index_to_show) => {
        if (obj_tabs[selector].circles.length > 1) {
            obj_tabs[selector].circles[old_index].classList.remove('selected');
            obj_tabs[selector].circles[index_to_show].classList.add('selected');
        }
    };

    const updateTabDisplay = () => {
        applyToAllElements('.tab-menu', (el_tab_menu) => {
            // hide tabs if there is only one tab visible
            const ul = el_tab_menu.querySelector('ul');
            if (ul) {
                const visible_tabs = Array.from(ul.children).filter(el => (
                    !el.classList.contains('tab-selector')
                    && (!el.dataset.show
                        || el.dataset.show && el.classList.contains('data-show-visible'))
                ));
                if (visible_tabs.length <= 1) el_tab_menu.setVisibility(0);
            }
            // resize tab selector
            if (el_tab_menu.querySelector('.tab-selector')) {
                repositionSelector();
            }
        });
    };

    const onUnload = () => {
        window.removeEventListener('resize', repositionSelector);

        applyToAllElements('.tm-li', (element) => {
            element.removeEventListener('click', slideSelectorOnMenuClick);
        });

        applyToAllElements('.go-left', (element) => {
            element.removeEventListener('click', goLeft);
        });
        applyToAllElements('.go-right', (element) => {
            element.removeEventListener('click', goRight);
        });
    };

    const onChangeTab = (fn) => {
        applyToAllElements('.go-left', (element) => {
            element.addEventListener('click', (e) => {
                fn({ selector: e.target.getAttribute('data-parent'), direction: 'left' });
            });
        });
        applyToAllElements('.go-right', (element) => {
            element.addEventListener('click', (e) => {
                fn({ selector: e.target.getAttribute('data-parent'), direction: 'right' });
            });
        });
    };

    return {
        onChangeTab,
        onLoad,
        onUnload,
        repositionSelector,
        slideSelector,
        updateTabDisplay,
    };
})();

module.exports = TabSelector;
