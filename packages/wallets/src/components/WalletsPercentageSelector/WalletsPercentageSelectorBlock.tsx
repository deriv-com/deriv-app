import React from 'react';
import classNames from 'classnames';
import { WalletText } from '../Base';

type TWalletsPercentageSelectorBlock = {
    isHighlighted?: boolean;
    label: string;
    onClick: VoidFunction;
};

const WalletsPercentageSelectorBlock = ({ isHighlighted, label, onClick }: TWalletsPercentageSelectorBlock) => {
    return (
        <div className='wallets-percentage-selector-block-container'>
            <WalletText className='wallets-percentage-selector__text' color='prominent' size='xs'>
                {label}
            </WalletText>
            <div
                className={classNames('wallets-percentage-selector-block', {
                    'wallets-percentage-selector-block--highlighted': isHighlighted,
                })}
                onClick={onClick}
            />
        </div>
    );
};

export default WalletsPercentageSelectorBlock;
