import classNames from 'classnames';
import React from 'react';
import { isEmptyObject } from '@deriv/shared';

type TextProps = {
    line_height: string;
    size: string;
};

const Text = ({ children, size, color, align, weight, line_height, as, className, styles, ...props }: TextProps) => {
    const class_styles = {
        '--text-size': `var(--text-size-${size || 's'})`,
        '--text-color': `var(--text-${color || 'general'})`,
        '--text-lh': `var(--text-lh-${line_height || 'm'})`,
        '--text-weight': `var(--text-weight-${weight || 'normal'})`,
        '--text-align': `var(--text-align-${align || 'left'})`,
    };
    const [style, setStyle] = React.useState(class_styles);
    React.useEffect(() => {
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

export default Text;
