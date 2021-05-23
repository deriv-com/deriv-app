import PropTypes from 'prop-types';
import React from 'react';

const CashierContainer = ({ iframe_height, iframe_url }) => {
    return (
        <div className='cashier__wrapper'>
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
};

export default CashierContainer;
