import React, { useCallback, useMemo } from 'react';
import PercentageSelectorBlock from './PercentageSelectorBlock';
import styles from './PercentageSelector.module.scss';

const percentageBlockCount = 4;
const percentageBlockSize = 100 / percentageBlockCount;

const percentageSelectorOptions = [...Array(percentageBlockCount).keys()].map(index => ({
    label: index + 1 === percentageBlockCount ? 'All' : `${((index + 1) * 100) / percentageBlockCount}%`,
    percentage: ((index + 1) * 100) / percentageBlockCount,
}));

type TPercentageSelector = {
    amount: number;
    balance: number;
    onChangePercentage: (percentage: number) => void;
};

const PercentageSelector: React.FC<TPercentageSelector> = ({ amount, balance, onChangePercentage }) => {
    const balancePercentage = useMemo(() => (balance > 0 ? (amount * 100) / balance : 0), [amount, balance]);

    const getBlockFillPercentage = useCallback(
        (blockPercentage: number) => {
            if (balancePercentage >= blockPercentage) return 100;
            if (balancePercentage < blockPercentage - percentageBlockSize) return 0;
            return ((balancePercentage - (blockPercentage - percentageBlockSize)) * 100) / percentageBlockSize;
        },
        [balancePercentage]
    );

    return (
        <div className={styles.container}>
            {percentageSelectorOptions.map(option => (
                <PercentageSelectorBlock
                    fillPercentage={getBlockFillPercentage(option.percentage)}
                    key={`percentage-selector__${option.percentage}`}
                    label={option.label}
                    onClick={() => onChangePercentage(option.percentage)}
                />
            ))}
        </div>
    );
};

export default PercentageSelector;
