import React, { useState } from 'react';
import { WalletText } from '../../../../../../components';
import './WithdrawalPercentageSelector.scss';

type TProps = {
    balance: number;
    message?: string;
    percentageBlockCount?: number;
};

const getPercentageBlocks = (blockCount: number, onBlockClick: (value: number) => void) => {
    return [...Array(blockCount).keys()].map(index => {
        const value = (index + 1) / blockCount;
        return (
            <div className='withdrawal-percentage-selector__block' key={value}>
                <div className='withdrawal-percentage-selector__block-value'>{value * 100}%</div>
                <div className='withdrawal-percentage-selector__block-bar' onClick={() => onBlockClick(value)} />
            </div>
        );
    });
};

const WithdrawalPercentageSelector: React.FC<TProps> = ({ balance, message, percentageBlockCount = 4 }) => {
    const [fraction, setFraction] = useState(0);

    const handleOnClick = (value: number) => {
        setFraction(1);
    };

    return (
        <div className='withdrawal-percentage-selector'>
            <div className='withdrawal-percentage-selector__container'>
                {getPercentageBlocks(percentageBlockCount, handleOnClick)}
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
