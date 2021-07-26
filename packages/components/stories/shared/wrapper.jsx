import React from 'react';
import PropTypes from 'prop-types';
import Theme from './theme.jsx';
import './styles.scss';

const Wrapper = ({ className, children, is_dark, is_block, is_full_width, has_no_padding, inner_styles }) => {
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
Wrapper.propTypes = {
    is_dark: PropTypes.bool,
    inner_styles: PropTypes.object,
};

export default Wrapper;
