import PropTypes from 'prop-types';
import React, { useState } from 'react';
import Popover from '../popover';

const CryptoMoney = ({
    realValue,
    toggleValue,
}) => {
    
    const [cryptoToggleView, setCryptoToggleView] = useState(false);

    return (
        <>
            <Popover
                alignment='top'
                className='crypto-popover'
                message={realValue}
                is_open={cryptoToggleView}
                disable_target_icon
            >
                <span onMouseEnter={() => setCryptoToggleView(true)} onMouseLeave={() => setCryptoToggleView(false)}>
                    {toggleValue}
                </span>
            </Popover>
        </>
    );
};

CryptoMoney.propTypes = {
    realValue  : PropTypes.string,
    toggleValue: PropTypes.string,
};

export default CryptoMoney;
