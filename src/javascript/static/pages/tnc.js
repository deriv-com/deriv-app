const tabListener = require('@binary-com/binary-style').tabListener;
const localize    = require('../../_common/localize').localize;
const TNCApproval = require('../../app/pages/user/tnc_approval');

const TermsAndConditions = (() => {
    let sidebar_width;

    const onLoad = () => {
        const container = document.getElementsByClassName('sidebar-collapsible-container')[0];
        if (container) sidebar_width = container.offsetWidth;

        handleActiveTab(); // adds active class
        TNCApproval.requiresTNCApproval(
            $('#btn_accept'),
            () => { $('.tnc_accept').setVisibility(1); },
            () => { $('#tnc_accept').html(localize('Your settings have been updated successfully.')); });
        tabListener();

        initSidebar();

        checkWidth();
        window.onresize = checkWidth;

        $('.currentYear').text(new Date().getFullYear());
    };

    const handleActiveTab = () => {
        const params      = window.location.hash.split('&');
        const hash        = params[0] || '#legal';
        const menu        = '.tab-menu-wrap';
        const content     = '.tab-content-wrapper';

        const parent_active = 'active';
        const child_active  = 'a-active';

        $(menu)
            .find('li')
            .removeClass(parent_active)
            .find('span')
            .removeClass(child_active);

        let $tab_to_show = $(hash);
        // if hash is a subtab or has subtabs
        if ($tab_to_show.find('.tm-li-2').length > 0 || /tm-li-2/.test($(hash).attr('class'))) {
            $tab_to_show =
                $tab_to_show
                    .find('.tm-a-2')
                    .first()
                    .addClass(child_active)
                    .closest('.tm-li');
        }
        $tab_to_show.addClass(parent_active);

        let content_to_show = `div${hash}-content`;
        if ($(content_to_show).length === 0) {
            content_to_show = `div#${$(hash).find('.tm-li-2').first().attr('id')}-content`;
        }
        $(content)
            .find('> div')
            .setVisibility(0)
            .end()
            .find(content_to_show)
            .setVisibility(1);
    };

    const initSidebar = () => {
        const { hash, pathname } = window.location;

        if (!hash) {
            window.history.replaceState({}, '', `${pathname}#legal-binary`);
        } else if ($(`${hash}-link`).is('.has-submenu')) {
            window.history.replaceState({}, '', `${pathname}${hash}-binary`);
        }

        $('.sidebar-collapsible').on('click', sidebarClickHandler);
        updateSidebarDOM();
    };

    const updateSidebarDOM = () => {
        const id = window.location.hash;
        const $li = $(`${id}-link`);
        const $parent_li = $li.closest('.has-submenu');

        if ($parent_li.length) {
            $parent_li.addClass('active').children('a').addClass('selected no-transition');
        }

        $li.addClass('active').find('a').addClass('selected');

        $(`${id}-content`).removeClass('invisible');
    };

    const sidebarClickHandler = (e) => {
        const $target = $(e.target);
        if (!$target.is('a')) return;
        const $submenu = $target.siblings('ul');

        if ($submenu.length) {
            // parent link is clicked
            e.preventDefault();

            if ($submenu.find('.selected').length) {
                // has selected sublink
                $target.removeClass('no-transition').parent('li').toggleClass('active');
            } else {
                window.location.hash = $submenu.find('a')[0].hash;
            }
        }
    };

    const checkWidth = () => {
        const mq = window.matchMedia('(max-width: 1023px)').matches;
        if (mq) {
            $('.sidebar-collapsible').css({ position: 'relative' });
            $(window).off('scroll', stickySidebar);
        } else {
            $(window).on('scroll', stickySidebar);
        }
        return mq;
    };

    const stickySidebar = () => {
        const $sidebar   = $('.sidebar-collapsible');
        const $content   = $('.sidebar-collapsible-content');
        const $container = $('.sidebar-collapsible-container');

        if (!$sidebar.is(':visible')) return;

        if (window.scrollY < $content.offset().top) {
            $sidebar.css({ position: 'relative' });
        } else if (window.scrollY + $sidebar[0].offsetHeight + 20 >=
            $container[0].offsetHeight + $container.offset().top) { // 20 is the padding for content from bottom, to avoid menu snapping back up
            $sidebar.css({ position: 'absolute', bottom: '20px', top: '', width: sidebar_width });
        } else {
            let position_style = 'fixed';
            if (!!window.MSInputMethodContext && !!document.documentMode) { // fix styling for IE11
                position_style = 'static';
            }
            $sidebar.css({ position: position_style, top: '0px', bottom: '', width: sidebar_width });
        }
    };

    const onUnload = () => {
        $('.sidebar-collapsible').off('click');
    };

    return {
        onLoad,
        onUnload,
    };
})();

module.exports = TermsAndConditions;
