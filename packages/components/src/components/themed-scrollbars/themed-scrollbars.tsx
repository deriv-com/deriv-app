import classNames from 'classnames';
import React, { RefObject, UIEventHandler } from 'react';
import { useHover } from '../../hooks/use-hover';

type TThemedScrollbars = {
    autohide?: boolean;
    className?: string;
    has_horizontal?: boolean;
    height?: number | string;
    is_bypassed?: boolean;
    is_only_horizontal?: boolean;
    is_only_horizontal_overlay?: boolean;
    is_scrollbar_hidden?: boolean;
    onScroll?: UIEventHandler<HTMLDivElement>;
    refSetter?: RefObject<HTMLDivElement & SVGSVGElement> | null;
    style?: React.CSSProperties;
    scroll_height?: number;
    should_scroll_to_selected?: boolean;
    width?: string;
    testId?: string;
};

const ThemedScrollbars = ({
    autohide = true,
    children,
    className,
    has_horizontal,
    height,
    is_bypassed,
    is_only_horizontal,
    is_only_horizontal_overlay,
    is_scrollbar_hidden,
    testId = 'dt_themed_scrollbars',
    onScroll,
    refSetter = null,
    style = {},
    scroll_height,
    should_scroll_to_selected = false,
    width,
}: React.PropsWithChildren<TThemedScrollbars>) => {
    const [hoverRef, isHovered] = useHover<HTMLDivElement & SVGSVGElement>(refSetter, false);

    React.useEffect(() => {
        if (should_scroll_to_selected && scroll_height) {
            hoverRef?.current?.scrollTo(0, scroll_height);
        }
    }, [scroll_height, hoverRef, should_scroll_to_selected]);

    if (is_bypassed) return children as JSX.Element;

    return (
        <div
            data-testid={testId}
            ref={hoverRef}
            className={classNames('dc-themed-scrollbars', className, {
                'dc-themed-scrollbars__autohide': autohide,
                'dc-themed-scrollbars__autohide--is-hovered': autohide && isHovered,
                'dc-themed-scrollbars--has-horizontal': has_horizontal,
                'dc-themed-scrollbars--only-horizontal': is_only_horizontal,
                'dc-themed-scrollbars--only-horizontal-overlay': is_only_horizontal_overlay,
                'dc-themed-scrollbars--hidden-scrollbar': is_scrollbar_hidden,
            })}
            style={{
                maxHeight: height || '100%',
                maxWidth: width || 'none',
                ...style,
            }}
            onScroll={onScroll}
        >
            {children}
        </div>
    );
};

export default ThemedScrollbars;
