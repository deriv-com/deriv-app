import React from 'react';

export const useBlockScroll = target_ref => {
    React.useEffect(() => {
        if (!target_ref) return undefined;

        const getScrollableParentElement = elem => {
            if (!elem) return null;
            if (elem.classList.contains('dc-themed-scrollbars') && elem.scrollHeight > elem.clientHeight) return elem;
            return getScrollableParentElement(elem.parentElement);
        };

        const scrollable_parent = getScrollableParentElement(target_ref.current);
        // Scroll bar width. Firefox - 10px, other browsers - 5px
        const is_firefox_browser = navigator.userAgent.indexOf('Firefox') > -1;
        const content_width_style = `calc(100% - ${is_firefox_browser ? '10px' : '5px'})`;

        if (scrollable_parent) {
            scrollable_parent.style.overflowY = 'hidden';
            scrollable_parent.style.width = content_width_style;
        }

        return () => {
            if (!scrollable_parent) return;

            scrollable_parent.style.removeProperty('overflow');
            scrollable_parent.style.removeProperty('width');
        };
    }, [target_ref]);
};
