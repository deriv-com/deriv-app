import { useState, useCallback, useEffect, useLayoutEffect } from 'react';

export interface SnapCarouselResult {
    readonly pages: number[];
    readonly activePageIndex: number;
    readonly prev: () => void;
    readonly next: () => void;
    readonly goTo: (pageIndex: number) => void;
    readonly refresh: () => void;
    readonly scrollRef: (el: HTMLElement | null) => void;
}

export interface SnapCarouselOptions {
    readonly axis?: 'x' | 'y';
}

interface SnapCarouselState {
    readonly pages: number[];
    readonly activePageIndex: number;
}

export const useWalletCardCarousel = ({ axis = 'x' }: SnapCarouselOptions = {}): SnapCarouselResult => {
    // const dimension = axis === 'x' ? 'width' : 'height';
    const scrollDimension = axis === 'x' ? 'scrollWidth' : 'scrollHeight';
    const clientDimension = axis === 'x' ? 'clientWidth' : 'clientHeight';
    const nearSidePos = axis === 'x' ? 'left' : 'top';
    // const farSidePos = axis === 'x' ? 'right' : 'bottom';
    const scrollPos = axis === 'x' ? 'scrollLeft' : 'scrollTop';

    const [scrollEl, setScrollEl] = useState<HTMLElement | null>(null);
    // NOTE: `pages` & `activePageIndex` are modelled as a single state object
    // to ensure they don't become out of sync with one another. (i.e. would rather
    // not implicitly rely on set state batching)
    const [{ pages, activePageIndex }, setCarouselState] = useState<SnapCarouselState>({
        pages: [],
        activePageIndex: 0,
    });

    const refreshActivePage = useCallback(
        (calculatedPages: number[]) => {
            if (!scrollEl) {
                return;
            }
            // https://excalidraw.com/#json=1ztbZ26T3ri14SiJBZlt4,Rqa2mjiaYJesnfPYEiBdPQ
            const hasScrolledToEnd =
                Math.floor(scrollEl[scrollDimension] - scrollEl[scrollPos]) <= scrollEl[clientDimension];
            if (hasScrolledToEnd) {
                // If scrolled to the end, set page to last as it may not end up with an
                // offset of 0 due to scroll capping.
                // (it's not quite aligned with how snapping works, but good enough for now)
                setCarouselState({ pages: calculatedPages, activePageIndex: pages.length - 1 });
                return;
            }
            const items = Array.from(scrollEl.children);
            const scrollPort = scrollEl.getBoundingClientRect();
            const offsets = pages.map(page => {
                const leadIndex = page;
                const leadEl = items[leadIndex] as HTMLElement;
                // assert(leadEl instanceof HTMLElement, 'Expected HTMLElement');
                const scrollSpacing = getEffectiveScrollSpacing(scrollEl, leadEl, nearSidePos);
                const rect = leadEl.getBoundingClientRect();
                const offset = rect[nearSidePos] - scrollPort[nearSidePos] - scrollSpacing;
                return Math.abs(offset);
            });
            const minOffset = Math.min(...offsets);
            const nextActivePageIndex = offsets.indexOf(minOffset);
            setCarouselState({ pages: calculatedPages, activePageIndex: nextActivePageIndex });
        },
        [scrollEl, scrollDimension, scrollPos, clientDimension, nearSidePos]
        // [scrollEl, scrollDimension, scrollPos, clientDimension, nearSidePos]
    );

    const getPages = useCallback(() => {
        if (!scrollEl) {
            return;
        }
        const items = Array.from(scrollEl.children) as HTMLElement[];
        const calculatedPages = items.map((item, index) => index);
        refreshActivePage(calculatedPages);
    }, [refreshActivePage, scrollEl]);

    // define pages array in the beginning
    useLayoutEffect(() => {
        getPages();
    }, [getPages]);

    // On scroll we only need to refresh the current page as it won't impact `pages`.
    useEffect(() => {
        const handle = () => {
            // TODO: Consider debouncing / throttling
            refreshActivePage(pages);
        };

        scrollEl?.addEventListener('scroll', handle);
        return () => {
            scrollEl?.removeEventListener('scroll', handle);
        };
    }, [refreshActivePage, pages, scrollEl]);

    const handleGoTo = (index: number) => {
        if (!scrollEl) {
            return;
        }
        const page = pages[index];
        if (!page) {
            return;
        }
        const items = Array.from(scrollEl.children);
        const leadIndex: number | undefined = page;
        const leadEl: Element | undefined = items[leadIndex];
        if (!(leadEl instanceof HTMLElement)) {
            return;
        }
        const scrollSpacing = getEffectiveScrollSpacing(scrollEl, leadEl, nearSidePos);
        // NOTE: I've tried `leadEl.scrollIntoView` but it often fails in chrome on Mac OS.
        scrollEl.scrollTo({
            behavior: 'smooth',
            [nearSidePos]: getOffset(leadEl, leadEl.parentElement)[nearSidePos] - scrollSpacing,
        });
    };

    const handlePrev = () => {
        handleGoTo(activePageIndex - 1);
    };

    const handleNext = () => {
        handleGoTo(activePageIndex + 1);
    };

    return {
        prev: handlePrev,
        next: handleNext,
        goTo: handleGoTo,
        refresh: getPages,
        pages,
        activePageIndex,
        scrollRef: setScrollEl,
    };
};

// Like `el.getBoundingClientRect()` but ignores scroll.
// It's similar to `offsetLeft` / `offsetTop`, but offers some of the virtues of `getBoundingClientRect`
// such as factoring in CSS transforms & handling wrapped inline elements.
// https://codepen.io/riscarrott/pen/ZEjyyay
// https://w3c.github.io/csswg-drafts/cssom-view/#dom-htmlelement-offsetleft
// https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetLeft
const getOffset = (el: Element, relativeTo?: Element | null) => {
    const rect = getOffsetRect(el);
    if (!relativeTo) {
        return rect;
    }
    const relativeRect = getOffsetRect(relativeTo);
    return {
        left: rect.left - relativeRect.left,
        top: rect.top - relativeRect.top,
        right: rect.right - relativeRect.left,
        bottom: rect.bottom - relativeRect.top,
        width: rect.width,
        height: rect.height,
    };
};

const getOffsetRect = (el: Element) => {
    const rect = el.getBoundingClientRect();
    let scrollLeft = 0;
    let scrollTop = 0;
    let parentEl = el.parentElement;
    while (parentEl) {
        scrollLeft += parentEl.scrollLeft;
        scrollTop += parentEl.scrollTop;
        parentEl = parentEl.parentElement;
    }
    const left = rect.left + scrollLeft;
    const top = rect.top + scrollTop;
    return {
        left,
        top,
        right: left + rect.width,
        bottom: top + rect.height,
        width: rect.width,
        height: rect.height,
    };
};

//  `window.getComputedStyle` gives us the *computed* value for scroll-padding-* so we have
// to convert it to the used value (i.e. px value) ourselves :(
// https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-padding
const getScrollPaddingUsedValue = (el: HTMLElement, pos: 'left' | 'top') => {
    const style = window.getComputedStyle(el);
    const scrollPadding = style.getPropertyValue(`scroll-padding-${pos}`);
    if (scrollPadding === 'auto') {
        return 0;
    }
    if (scrollPadding.endsWith('px')) {
        const value = parseInt(scrollPadding);
        return value;
    }
    if (scrollPadding.endsWith('%')) {
        const value = parseInt(scrollPadding);
        return (el.clientWidth / 100) * value;
    }
    // e.g. calc(10% + 10px) // NOTE: We could in theory resolve this...
    // throw new Error(invalidMsg);
    return 0;
};

// Unlike scroll-padding, scroll-margin doesn't support <percentage> values, so we should always
// get back a px value, meaning it's effectively already the *used* value.
// https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-margin
const getScrollMarginUsedValue = (el: HTMLElement, pos: 'left' | 'top') => {
    const style = window.getComputedStyle(el);
    const scrollMargin = style.getPropertyValue(`scroll-margin-${pos}`);
    const value = parseInt(scrollMargin);
    return value;
};

// The 'effective' scroll spacing is the actual scroll padding + margin that will be used for a
// given item after factoring in whether there is enough scroll width available.
const getEffectiveScrollSpacing = (scrollEl: HTMLElement, itemEl: HTMLElement, pos: 'left' | 'top') => {
    const scrollPadding = getScrollPaddingUsedValue(scrollEl, pos);
    const scrollMargin = getScrollMarginUsedValue(itemEl, pos);
    const rect = getOffset(itemEl, itemEl.parentElement);
    return Math.min(scrollPadding + scrollMargin, rect[pos]);
};
