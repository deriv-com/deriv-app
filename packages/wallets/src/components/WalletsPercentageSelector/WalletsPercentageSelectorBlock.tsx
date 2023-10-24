import React from 'react';
import { WalletText } from '../Base';
import './WalletsPercentageSelector.scss';

type TWalletsPercentageSelectorBlock = {
    fillPercentage: number;
    label: string;
    onClick: VoidFunction;
};

const WalletsPercentageSelectorBlock = ({ fillPercentage, label, onClick }: TWalletsPercentageSelectorBlock) => {
    return (
        <div className='wallets-percentage-selector-block-container'>
            <div className='wallets-percentage-selector__text'>
                <WalletText color='prominent' size='xs'>
                    {label}
                </WalletText>
            </div>
            <div className='wallets-percentage-selector-block' onClick={onClick}>
                <div className='wallets-percentage-selector-block__fill' style={{ width: `${fillPercentage}%` }} />
            </div>
        </div>
    );
};

export default WalletsPercentageSelectorBlock;
