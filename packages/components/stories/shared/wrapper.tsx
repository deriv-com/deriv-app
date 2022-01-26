import React from 'react';
import Theme from './theme.jsx';
import './styles.scss';

type WrapperProps = {
    is_dark: boolean;
    inner_styles: unknown;
};

const Wrapper = ({
    className,
    children,
    is_dark,
    is_block,
    is_full_width,
    has_no_padding,
    inner_styles,
}: WrapperProps) => {
    const styles = {
        display: is_block ? 'block' : 'flex',
        justifyContent: 'center',
        maxWidth: is_full_width ? 'none' : '300px',
        margin: '0 auto',
        padding: has_no_padding ? 0 : '30px 15px',
        color: 'var(--text-prominent)',
    };

    return (
        <Theme is_dark={is_dark}>
            <div className={className} style={inner_styles || styles}>
                {children}
            </div>
        </Theme>
    );
};

export default Wrapper;
