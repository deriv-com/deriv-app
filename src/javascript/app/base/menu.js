const Client             = require('./client');
const BinarySocket       = require('./socket');
const getElementById     = require('../../_common/common_functions').getElementById;
const applyToAllElements = require('../../_common/utility').applyToAllElements;
const findParent         = require('../../_common/utility').findParent;
const getPropertyValue   = require('../../_common/utility').getPropertyValue;
require('../../_common/lib/mmenu/jquery.mmenu.min.all.js');

const Menu = (() => {
    const init = () => {
        const menu_top = getElementById('menu-top');

        applyToAllElements('li', (el) => { el.classList.remove('active', 'active-parent'); }, '', menu_top);
        if (Client.isLoggedIn()) {
            BinarySocket.wait('landing_company').then((response) => {
                const financial_shortcode = getPropertyValue(response, ['landing_company', 'financial_company', 'shortcode']);
                // client is virtual and they are allowed to have a financial account
                // or client is real and current account is financial
                const has_financial_markets = Client.get('is_virtual') ? !!(financial_shortcode) : Client.get('landing_company_shortcode') === financial_shortcode;
                applyToAllElements('.financial-only', (el) => {
                    el.setVisibility(has_financial_markets);
                });
            });
        }

        const menu_top_item_for_page =  Array.from(menu_top.getElementsByTagName('a'))
            .find(link => !/invisible/.test(findParent(link, 'li').classList) && link.href !== 'javascript:;' && window.location.pathname.indexOf(link.pathname.replace(/\.html/, '')) >= 0 && link.target !== '_blank');

        if (menu_top_item_for_page) {
            findParent(menu_top_item_for_page, 'li').classList.add('active');
            // if it's a sub-menu item, also make the parent active
            // can't use the class active because it will make all children <a> orange
            const menu_parent = findParent(menu_top_item_for_page, '.nav-dropdown-toggle');
            if (menu_parent) {
                menu_parent.classList.add('active-parent');
            }
        }
    };

    const makeMobileMenu = () => {
        // avoid creating mobile menu in desktop view as it duplicates menu items with the same id
        if (getElementById('mobile-menu-container').offsetParent) {
            $('#mobile-menu').mmenu({
                position       : 'right',
                zposition      : 'front',
                slidingSubmenus: false,
                searchfield    : true,
                onClick        : { close: true },
            }, { selectedClass: 'active' });
        }
    };

    return {
        init,
        makeMobileMenu,
    };
})();

module.exports = Menu;
