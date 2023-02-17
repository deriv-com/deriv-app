import React, { RefObject } from 'react';

export const useBlockScroll = (target_ref?: RefObject<HTMLElement>) => {
    React.useEffect(() => {
        if (!target_ref) return undefined;

        const getScrollableParentElement: (prop: HTMLElement | null) => HTMLElement | null = (
            elem: HTMLElement | null
        ) => {
            if (!elem) return null;
            if (elem.classList.contains('dc-themed-scrollbars') && elem.scrollHeight > elem.clientHeight) return elem;
            return getScrollableParentElement(elem.parentElement);
        };

        const scrollable_parent = getScrollableParentElement(target_ref.current);
        const is_firefox_browser = navigator.userAgent.indexOf('Firefox') > -1;
        // No width offset is necessary in Firefox Browsers
        const content_width_style = is_firefox_browser ? '100%' : 'calc(100% - 5px)';

        if (scrollable_parent) {
            scrollable_parent.style.overflow = 'hidden';
            scrollable_parent.style.width = content_width_style;
        }

        return () => {
            if (!scrollable_parent) return;
            scrollable_parent.style.removeProperty('overflow');
            scrollable_parent.style.removeProperty('width');
        };
    }, [target_ref]);
};
