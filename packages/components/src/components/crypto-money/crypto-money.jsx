import PropTypes from 'prop-types';
import React, { useState } from 'react';

const CryptoMoney = ({
    realValue,
    toggleValue,
}) => {
    const [cryptoToggleView, setCryptoToggleView] = useState(true);

    const toggleCryptoValue = (e) => {
        e.preventDefault();
        setCryptoToggleView(!cryptoToggleView);
    };

    return (
        <span onClick={toggleCryptoValue}>
            {cryptoToggleView ? toggleValue : realValue}
        </span>
    );
};

CryptoMoney.propTypes = {
    realValue  : PropTypes.string,
    toggleValue: PropTypes.string,
};

export default CryptoMoney;
