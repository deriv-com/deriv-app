import React, { useCallback, useMemo } from 'react';
import { useTranslations } from '@deriv-com/translations';
import WalletsPercentageSelectorBlock from './WalletsPercentageSelectorBlock';
import './WalletsPercentageSelector.scss';

const percentageBlockCount = 4;
const percentageBlockSize = 100 / percentageBlockCount;

const percentageSelectorOptions = (localize: ReturnType<typeof useTranslations>['localize']) =>
    [...Array(percentageBlockCount).keys()].map(index => ({
        label: index + 1 === percentageBlockCount ? localize('All') : `${((index + 1) * 100) / percentageBlockCount}%`,
        percentage: ((index + 1) * 100) / percentageBlockCount,
    }));

type TWalletsPercentageSelector = {
    amount: number;
    balance: number;
    onChangePercentage: (percentage: number) => void;
};

const WalletsPercentageSelector = ({ amount, balance, onChangePercentage }: TWalletsPercentageSelector) => {
    const balancePercentage = useMemo(() => (balance > 0 ? (amount * 100) / balance : 0), [amount, balance]);
    const { localize } = useTranslations();

    const getBlockFillPercentage = useCallback(
        (blockPercentage: number) => {
            if (balancePercentage >= blockPercentage) return 100;
            if (balancePercentage < blockPercentage - percentageBlockSize) return 0;
            return ((balancePercentage - (blockPercentage - percentageBlockSize)) * 100) / percentageBlockSize;
        },
        [balancePercentage]
    );

    return (
        <div className='wallets-percentage-selector'>
            {percentageSelectorOptions(localize).map((option, index) => (
                <WalletsPercentageSelectorBlock
                    fillPercentage={getBlockFillPercentage(option.percentage)}
                    key={`wallet-percentage-selector__${index}__${option.percentage}`}
                    label={option.label}
                    onClick={() => onChangePercentage(option.percentage)}
                />
            ))}
        </div>
    );
};

export default WalletsPercentageSelector;
