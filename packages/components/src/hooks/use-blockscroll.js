import React from 'react';

export const useBlockScroll = target_ref => {
    React.useEffect(() => {
        if (!target_ref) return undefined;

        // Firefox Scrollbars doesn't take widths. Using the current logic of offsetting
        // scrollbar widths will cause scrollable container to move in firefox
        const is_unsupported_browser = navigator.userAgent.indexOf('Firefox') > -1;

        const getScrollableParentElement = elem => {
            if (!elem) return null;

            if (elem.classList.contains('dc-themed-scrollbars') && elem.scrollHeight > elem.clientHeight) return elem;
            return getScrollableParentElement(elem.parentElement);
        };

        const scrollable_parent = getScrollableParentElement(target_ref.current);

        const content_width_style = 'calc(100% - 5px)'; // 5px is the width of scrollbar

        if (scrollable_parent) {
            scrollable_parent.style.overflow = 'hidden';
            if (!is_unsupported_browser) {
                scrollable_parent.style.width = content_width_style;
            }
        }

        return () => {
            if (!scrollable_parent) return;

            scrollable_parent.style.removeProperty('overflow');
            scrollable_parent.style.removeProperty('width');
        };
    }, [target_ref]);
};
