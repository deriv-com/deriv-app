import React, { useCallback, useEffect, useState } from 'react';
import WalletsPercentageSelectorBlock from './WalletsPercentageSelectorBlock';
import './WalletsPercentageSelector.scss';

type TWalletsPercentageSelector = {
    amount: number;
    balance: number;
    onChangePercentage: (percentage: number) => void;
};

const WalletsPercentageSelector = ({ amount, balance, onChangePercentage }: TWalletsPercentageSelector) => {
    const [selectedPercentage, setSelectedPercentage] = useState<number>(0);
    const [isSetWithPercentageSelector, setIsSetWithPercentageSelector] = useState(false);

    useEffect(() => {
        if (isSetWithPercentageSelector) setIsSetWithPercentageSelector(false);
    }, [amount, balance, isSetWithPercentageSelector]);

    const getIsHightlighted = useCallback(
        (percentage: number) => {
            return isSetWithPercentageSelector && percentage <= selectedPercentage;
        },
        [isSetWithPercentageSelector, selectedPercentage]
    );

    const onClick = useCallback(
        (percentage: number) => {
            setSelectedPercentage(percentage);
            setIsSetWithPercentageSelector(true);
            onChangePercentage(percentage);
        },
        [onChangePercentage]
    );

    const percentageSelectorOptions = [
        {
            label: '25%',
            percentage: 25,
        },
        {
            label: '50%',
            percentage: 50,
        },
        {
            label: '75%',
            percentage: 75,
        },
        {
            label: 'All',
            percentage: 100,
        },
    ] as const;

    return (
        <div className='wallets-percentage-selector'>
            {percentageSelectorOptions.map((option, index) => (
                <WalletsPercentageSelectorBlock
                    isHighlighted={getIsHightlighted(option.percentage)}
                    key={index}
                    label={option.label}
                    onClick={() => onClick(option.percentage)}
                />
            ))}
        </div>
    );
};

export default WalletsPercentageSelector;
