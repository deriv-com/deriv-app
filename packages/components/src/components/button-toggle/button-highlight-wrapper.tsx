import classnames from 'classnames';
import React from 'react';
import { Highlight } from './button-highlight';

type THighlightWrapperProps = Omit<React.HTMLProps<HTMLDivElement>, 'children'> & {
    children: React.ReactElement | React.ReactElement[];
    has_rounded_button?: boolean;
    highlight_color?: string;
};

const class_selector = 'dc-button-menu__button--active';

const HighlightWrapper = ({ children, className, has_rounded_button, ...other_props }: THighlightWrapperProps) => {
    const [left, setLeft] = React.useState(0);

    const wrapper_ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (wrapper_ref.current) {
            const active_button_el = wrapper_ref?.current
                ?.getElementsByClassName(class_selector)
                ?.item(0) as HTMLButtonElement;
            updateHighlightPosition(active_button_el);
        }
        return () => resetHighlight();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        const active_button_el = wrapper_ref?.current
            ?.getElementsByClassName(class_selector)
            ?.item(0) as HTMLButtonElement;
        if (active_button_el) updateHighlightPosition(active_button_el);
        else if (left !== 0) resetHighlight(); // clear highlight when active element doesn't exist
    });

    const onClick = (e: Event, buttonClick: () => void) => {
        if (!e.target) return;
        updateHighlightPosition((e.target as HTMLButtonElement).closest('button'));
        buttonClick?.();
    };

    const resetHighlight = () => setLeft(0);

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
            />
        </div>
    );
};

export default React.memo(HighlightWrapper);
