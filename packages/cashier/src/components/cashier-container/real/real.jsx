import PropTypes from 'prop-types';
import React from 'react';
import { Loading } from '@deriv/components';
import { connect } from 'Stores/connect';

const Real = ({ iframe_height, iframe_url, clearIframe, is_dark_mode_on, is_loading }) => {
    React.useEffect(() => {
        return () => {
            clearIframe();
        };
    }, [clearIframe]);

    return (
        <div className='cashier__wrapper'>
            {is_loading && <Loading is_fullscreen />}
            {iframe_url && (
                <iframe
                    className='cashier__content'
                    height={iframe_height}
                    src={`${iframe_url}&DarkMode=${is_dark_mode_on ? 'on' : 'off'}`}
                    frameBorder='0'
                    scrolling='auto'
                    data-testid='doughflow_section'
                />
            )}
        </div>
    );
};

Real.propTypes = {
    is_dark_mode_on: PropTypes.bool,
    iframe_height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    iframe_url: PropTypes.string,
    clearIframe: PropTypes.func,
    is_loading: PropTypes.bool,
};

export default connect(({ ui }) => ({
    is_dark_mode_on: ui.is_dark_mode_on,
}))(Real);
