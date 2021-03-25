import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { isEmptyObject } from '@deriv/shared';

const Text = ({ children, size, color, align, weight, line_height, as, className, styles, ...props }) => {
    const [style, setStyle] = React.useState({});
    React.useEffect(() => {
        const class_styles = {
            '--text-size': `var(--text-size-${size || 's'})`,
            '--text-color': `var(--text-${color || 'general'})`,
            '--text-lh': `var(--text-lh-${line_height || 'm'})`,
            '--text-weight': `var(--text-weight-${weight || 'normal'})`,
            '--text-align': `var(--text-align-${align || 'left'})`,
        };
        if (!isEmptyObject(styles)) {
            const combined_style = { ...class_styles, ...styles };
            setStyle(combined_style);
        } else {
            setStyle(class_styles);
        }
    }, [size, color, line_height, weight, align]);
    const class_names = classNames('dc-text', className);
    return React.createElement(as || 'span', { className: class_names, style, ...props }, children);
};

Text.propTypes = {
    line_height: PropTypes.string,
    size: PropTypes.string,
};

export default Text;
