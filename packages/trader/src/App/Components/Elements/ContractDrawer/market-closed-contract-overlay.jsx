import React from 'react';
import PropTypes from 'prop-types';
import { Text } from '@deriv/components';

const MarketClosedContractOverlay = ({ validation_error }) => (
    <div className='contract-card__market-closed'>
        <Text align='center' as='p' className='contract-card__market-closed__title' weight='bold'>
            {validation_error}
        </Text>
    </div>
);

MarketClosedContractOverlay.propTypes = {
    symbol: PropTypes.string,
};

export default MarketClosedContractOverlay;
