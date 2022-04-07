import PropTypes from 'prop-types';
import React from 'react';
import { Loading } from '@deriv/components';
import 'Sass/cashier-container.scss';

const CashierContainer = ({ iframe_height, iframe_url, clearIframe, is_loading }) => {
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
                    src={iframe_url}
                    frameBorder='0'
                    scrolling='auto'
                    data-testid='doughflow_section'
                />
            )}
        </div>
    );
};

CashierContainer.propTypes = {
    iframe_height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    iframe_url: PropTypes.string,
    clearIframe: PropTypes.func,
    is_loading: PropTypes.bool,
};

export default CashierContainer;
