const Scroll = (() => {
    let $main_container;

    const sidebarScroll = ($container) => {
        $main_container = $container;

        $container.on('click', '#sidebar-nav li', function () {
            const clicked_li = $(this);
            $.scrollTo($(`.section:eq(${clicked_li.index()})`), 500);
            return false;
        });

        if ($container.length) {
            // grab the initial top offset of the navigation
            const $sidebar                   = $container.find('.sidebar');
            const $sidebar_container         = $container.find('.sidebar-container');
            let width                        = $sidebar.width();
            let sticky_navigation_offset_top = $sidebar.offset().top;

            // With thanks:
            // http://www.backslash.gr/content/blog/webdevelopment/6-navigation-menu-that-stays-on-top-with-jquery

            // our function that decides weather the navigation bar should have "fixed" css position or not.
            const sticky_navigation = () => {
                if (!$sidebar.is(':visible')) return;
                if (!width) {
                    width                        = $sidebar.width();
                    sticky_navigation_offset_top = $sidebar.offset().top;
                }
                const scroll_top = $(window).scrollTop(); // our current vertical position from the top

                // if we've scrolled more than the navigation, change its position to fixed to stick to top,
                // otherwise change it back to relative
                if (scroll_top + $sidebar[0].offsetHeight >
                    $sidebar_container[0].offsetHeight + $sidebar_container.offset().top) {
                    $sidebar.css({ position: 'absolute', bottom: 0, top: '', 'max-width': width, 'width': '100%' });
                } else if (scroll_top > sticky_navigation_offset_top) {
                    $sidebar.css({ position: 'fixed', top: 0, bottom: '', 'max-width': width, 'width': '100%' });
                } else {
                    $sidebar.css({ position: 'relative' });
                }
            };

            // run our function on load
            sticky_navigation();

            const sidebar_nav = $sidebar.find('#sidebar-nav');
            const length      = $container.find('.section').length;
            $(window).on('scroll', function () {
                if (!sidebar_nav.is(':visible')) return;
                // and run it again every time you scroll
                sticky_navigation();

                for (let i = 0; i < length; i++) {
                    const section        = $(`.section:eq(${i})`);
                    const section_offset = section.offset();
                    const is_offset_top  = section_offset && $(this).scrollTop() >= section_offset.top - 5;
                    if (($(window).scrollTop() === 0 || is_offset_top) && section.css('display') !== 'none') { // ignore hidden elements
                        sidebar_nav.find('li').removeClass('selected');

                        if ($(window).scrollTop() === 0 || sidebar_nav.width() === 0) {
                            // We're at the top of the screen, so highlight first nav item
                            sidebar_nav.find('li:first-child').addClass('selected');
                        } else if ($(window).scrollTop() + $(window).height() >= $(document).height()) {
                            // We're at bottom of screen so highlight last nav item.
                            sidebar_nav.find('li:last-child').addClass('selected');
                        } else {
                            sidebar_nav.find(`li:eq(${i})`).addClass('selected');
                        }
                    }
                }
            });
        }
    };

    const scrollToTop = () => {
        let is_displaying = false;
        const $scrollup   = $('#scrollup');
        $(document).scroll(function () {
            if ($(this).scrollTop() > 100) {
                if (is_displaying) return;
                $scrollup.fadeIn();
                is_displaying = true;
            } else if (is_displaying) {
                $scrollup.fadeOut();
                is_displaying = false;
            }
        });

        $scrollup.click(() => {
            $.scrollTo(0, 500);
        });
    };

    return {
        sidebarScroll,
        scrollToTop,
        offScroll: () => {
            $(window).off('scroll');
            if ($main_container) {
                $main_container.find('#sidebar-nav li').off('click');
                $main_container = '';
            }
        },
        goToHashSection: () => {
            $('a[href^="#"]').click(function() {
                $.scrollTo($(`a[name="${$(this).attr('href').substr(1)}"]`), 500, { offset: -10 });
                return false;
            });
            const hash = window.location.hash;
            if (hash) $(`a[href="${hash}"]`).click();
        },
        scrollToHashSection: () => {
            const hash = window.location.hash;
            if (hash) $.scrollTo($(hash));
        },
    };
})();

module.exports = Scroll;
