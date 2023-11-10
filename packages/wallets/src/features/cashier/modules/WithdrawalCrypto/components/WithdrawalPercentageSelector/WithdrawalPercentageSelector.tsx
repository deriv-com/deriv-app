import React, { useState } from 'react';
import classNames from 'classnames';
import { WalletText } from '../../../../../../components';
import './WithdrawalPercentageSelector.scss';

type TProps = {
    balance: number;
    message?: string;
    percentageBlockCount?: number;
};

const getPercentageBlocks = (fraction: number, blockCount: number, onClick: (value: number) => void) => {
    return [...Array(blockCount).keys()].map(index => {
        const value = (index + 1) / blockCount;
        return (
            <div className='wallets-withdrawal-percentage-selector__block' key={value}>
                <div className='wallets-withdrawal-percentage-selector__block-value'>{value * 100}%</div>
                <div
                    className={classNames('wallets-withdrawal-percentage-selector__block-bar', {
                        'wallets-withdrawal-percentage-selector__block-bar--active': value <= fraction,
                    })}
                    onClick={() => {
                        onClick(value);
                    }}
                />
            </div>
        );
    });
};

const WithdrawalPercentageSelector: React.FC<TProps> = ({ message, percentageBlockCount = 4 }) => {
    const [fraction, setFraction] = useState(0);

    const handleOnClick = (value: number) => {
        setFraction(oldFraction => (oldFraction === value ? oldFraction - 0.25 : value));
    };

    return (
        <div className='wallets-withdrawal-percentage-selector'>
            <div className='wallets-withdrawal-percentage-selector__container'>
                {getPercentageBlocks(fraction, percentageBlockCount, handleOnClick)}
            </div>
            {message && (
                <WalletText color='less-prominent' size='xs'>
                    {message}
                </WalletText>
            )}
        </div>
    );
};

export default WithdrawalPercentageSelector;
