import classNames from 'classnames';
import React, { CSSProperties, HTMLProps } from 'react';
import { isEmptyObject } from '@deriv/shared';

type TTextProps = Omit<HTMLProps<HTMLElement>, 'size'> & {
    align?: string;
    weight?: string;
    line_height?: string;
    styles?: CSSProperties;
    size?: string;
};

const Text = ({
    children,
    size = 's',
    color = 'general',
    align = 'left',
    weight = 'normal',
    line_height = 'm',
    as,
    className,
    styles,
    ...props
}: TTextProps) => {
    const class_styles = {
        '--text-size': `var(--text-size-${size})`,
        '--text-color': `var(--text-${color})`,
        '--text-lh': `var(--text-lh-${line_height})`,
        '--text-weight': `var(--text-weight-${weight})`,
        '--text-align': `var(--text-align-${align})`,
    };
    const [style, setStyle] = React.useState(class_styles);
    React.useEffect(() => {
        if (!isEmptyObject(styles)) {
            const combined_style = { ...class_styles, ...styles };
            setStyle(combined_style);
        } else {
            setStyle(class_styles);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [size, color, line_height, weight, align]);
    const class_names = classNames('dc-text', className);
    return React.createElement(as || 'span', { className: class_names, style, ...props }, children);
};

export default Text;
