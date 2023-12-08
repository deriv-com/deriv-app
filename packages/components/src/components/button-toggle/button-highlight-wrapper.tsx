import classnames from 'classnames';
import React from 'react';
import { Highlight } from './button-highlight';
import { useIsRtl } from '@deriv/hooks';

type THighlightWrapperProps = Omit<React.HTMLProps<HTMLDivElement>, 'children'> & {
    children: React.ReactElement | React.ReactElement[];
    has_rounded_button?: boolean;
    highlight_color?: string;
};

const class_selector = 'dc-button-menu__button--active';

const HighlightWrapper = ({ children, className, has_rounded_button, ...other_props }: THighlightWrapperProps) => {
    const is_rtl = useIsRtl();
    const default_offset = is_rtl ? -112 : 0;

    const [left, setLeft] = React.useState(default_offset);

    const wrapper_ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (wrapper_ref.current) {
            const active_button_el = wrapper_ref?.current
                ?.getElementsByClassName(class_selector)
                ?.item(0) as HTMLButtonElement;
            !is_rtl ? updateHighlightPosition(active_button_el) : updateHighlightPositionRTL(active_button_el);
        }
        return () => resetHighlight();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        const active_button_el = wrapper_ref?.current
            ?.getElementsByClassName(class_selector)
            ?.item(0) as HTMLButtonElement;
        if (active_button_el) {
            !is_rtl ? updateHighlightPosition(active_button_el) : updateHighlightPositionRTL(active_button_el);
        } else if (left !== default_offset) {
            resetHighlight();
        } // clear highlight when active element doesn't exist
    });

    const onClick = (e: Event, buttonClick: () => void) => {
        if (!e.target) return;
        updateHighlightPosition((e.target as HTMLButtonElement).closest('button'));
        buttonClick?.();
    };

    const resetHighlight = !is_rtl ? () => setLeft(0) : () => setLeft(-112);

    const updateHighlightPositionRTL = (el: HTMLButtonElement | null) => {
        if (!el) return;
        const { offsetLeft } = el;
        if (left !== offsetLeft - 112) setLeft(offsetLeft - 112);
    };

    const updateHighlightPosition = (el: HTMLButtonElement | null) => {
        if (!el) return;
        const { offsetLeft } = el;
        if (left !== offsetLeft) setLeft(offsetLeft);
    };

    const props = {
        className: classnames('dc-button-menu__wrapper', className),
        ...other_props,
    };
    const button_width = (100 / ((Array.isArray(children) && children?.length) || 1)).toFixed(2);

    return (
        <div ref={wrapper_ref} {...props}>
            {React.Children.map(children, child =>
                React.cloneElement(child, {
                    onClick: (e: Event) => onClick(e, child.props.onClick),
                })
            )}
            <Highlight
                has_rounded_button={has_rounded_button || false}
                highlight_color={other_props.highlight_color}
                left={left}
                width={`${button_width}%`}
                default_offset={default_offset}
            />
        </div>
    );
};

export default React.memo(HighlightWrapper);
