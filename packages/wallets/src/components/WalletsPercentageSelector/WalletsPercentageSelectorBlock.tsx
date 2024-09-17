import React from 'react';
import { Text } from '@deriv-com/ui';
import './WalletsPercentageSelector.scss';

type TWalletsPercentageSelectorBlock = {
    fillPercentage: number;
    label: string;
    onClick: VoidFunction;
};

const WalletsPercentageSelectorBlock = ({ fillPercentage, label, onClick }: TWalletsPercentageSelectorBlock) => {
    return (
        <div className='wallets-percentage-selector-block-container'>
            <Text color='prominent' size='xs'>
                {label}
            </Text>
            <div className='wallets-percentage-selector-block' onClick={onClick}>
                <div className='wallets-percentage-selector-block__fill' style={{ width: `${fillPercentage}%` }} />
            </div>
        </div>
    );
};

export default WalletsPercentageSelectorBlock;
