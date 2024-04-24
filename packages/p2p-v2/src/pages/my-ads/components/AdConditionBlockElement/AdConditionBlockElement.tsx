import React from 'react';
import clsx from 'clsx';
import { Text, useDevice } from '@deriv-com/ui';
import './AdConditionBlockElement.scss';

type TAdConditionBlockElementProps = {
    isSelected: boolean;
    label: string;
    onClick: (value: number) => void;
    value: number;
};

const AdConditionBlockElement = ({ isSelected, label, onClick, value }: TAdConditionBlockElementProps) => {
    const { isMobile } = useDevice();
    return (
        <div
            className={clsx('p2p-v2-ad-condition-block-element', {
                'p2p-v2-ad-condition-block-element--selected': isSelected,
            })}
            onClick={() => onClick(value)}
        >
            <Text color={isSelected ? 'white' : 'prominent'} size={isMobile ? 'lg' : 'md'}>
                {label}
            </Text>
        </div>
    );
};

export default AdConditionBlockElement;
