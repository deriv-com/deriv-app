import PropTypes from 'prop-types';
import React, { useState } from 'react';
import Popover from 'Components/popover/popover.jsx';

const CryptoMoney = ({ real_value, toggled_value }) => {
    const [crypto_toggle_view, setCryptoToggleView] = useState(false);

    return (
        <>
            <Popover
                alignment='top'
                className='crypto-popover'
                message={real_value}
                is_open={crypto_toggle_view}
                disable_target_icon
            >
                <span onMouseEnter={() => setCryptoToggleView(true)} onMouseLeave={() => setCryptoToggleView(false)}>
                    {toggled_value}
                </span>
            </Popover>
        </>
    );
};

CryptoMoney.propTypes = {
    real_value: PropTypes.string,
    toggled_value: PropTypes.string,
};

export default CryptoMoney;
