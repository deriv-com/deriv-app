import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Highlight } from './button-highlight.jsx';

const class_selector = 'dc-button-menu__button--active';

const HighlightWrapper = ({ children, className, has_rounded_button, ...other_props }) => {
    const [left, setLeft] = React.useState(0);

    const wrapper_ref = React.useRef();

    React.useEffect(() => {
        if (wrapper_ref.current) {
            const active_button_el = [...wrapper_ref.current.getElementsByClassName(class_selector)][0];
            updateHighlightPosition(active_button_el);
        }
        return () => resetHighlight();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        const active_button_el = [...wrapper_ref.current?.getElementsByClassName(class_selector)][0];
        if (active_button_el) updateHighlightPosition(active_button_el);
        else if (left !== 0) resetHighlight(); // clear highlight when active element doesn't exist
    });

    const onClick = (e, buttonClick) => {
        if (!e.target) return;
        updateHighlightPosition(e.target.closest('button'));
        if (typeof buttonClick === 'function') {
            buttonClick();
        }
    };

    const resetHighlight = () => setLeft(0);

    const updateHighlightPosition = el => {
        if (!el) return;
        const { offsetLeft } = el;
        if (left !== offsetLeft) setLeft(offsetLeft);
    };

    const props = {
        className: classnames('dc-button-menu__wrapper', className),
        ...other_props,
    };
    const button_width = (100 / children.length).toFixed(2);

    return (
        <div ref={wrapper_ref} {...props}>
            {React.Children.map(children, child =>
                React.cloneElement(child, {
                    onClick: e => onClick(e, child.props.onClick),
                })
            )}
            <Highlight
                has_rounded_button={has_rounded_button}
                highlight_color={other_props?.highlight_color}
                left={left}
                width={`${button_width}%`}
            />
        </div>
    );
};

HighlightWrapper.propTypes = {
    children: PropTypes.array,
    className: PropTypes.string,
    has_rounded_button: PropTypes.bool,
};

export default React.memo(HighlightWrapper);
