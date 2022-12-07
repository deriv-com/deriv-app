import React from 'react';
import { Text } from '@deriv/components';
import './asset-summary.scss';

const AssetSummary = () => {
    return (
        <div className='asset-summary'>
            <Text align='right' size='xs' line_height='s'>
                Total asset
            </Text>
            <Text
                size='m'
                weight='bold'
                styles={{ color: 'var(--text-profit-success)' }}
            >{`1,000,000,000.00 USD`}</Text>
        </div>
    );
};

export default AssetSummary;
