import PropTypes from 'prop-types';
import React from 'react';
import { Loading } from '@deriv/components';

const CashierContainer = ({ iframe_height, iframe_url, is_loading }) => {
    return (
        <div className='cashier__wrapper'>
            {is_loading && <Loading is_fullscreen={false} />}
            {iframe_url && (
                <iframe
                    className='cashier__content'
                    height={iframe_height}
                    src={iframe_url}
                    frameBorder='0'
                    scrolling='auto'
                />
            )}
        </div>
    );
};

CashierContainer.propTypes = {
    iframe_height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    iframe_url: PropTypes.string,
    is_loading: PropTypes.bool,
};

export default CashierContainer;
