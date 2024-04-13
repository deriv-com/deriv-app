import React from 'react';
import { AD_CONDITION_CONTENT, AD_CONDITION_TYPES } from '@/constants';
import { AdConditionBlockElement } from '../AdConditionBlockElement';
import { AdConditionContentHeader } from '../AdConditionContentHeader';

type TAdConditionBlockSelectorProps = {
    onClick: (value: number) => void;
    selectedValue?: number;
    type: typeof AD_CONDITION_TYPES[keyof typeof AD_CONDITION_TYPES];
};
const AdConditionBlockSelector = ({ onClick, selectedValue, type }: TAdConditionBlockSelectorProps) => {
    return (
        <div className='flex flex-col gap-[0.8rem] mb-[2.4rem]'>
            <AdConditionContentHeader type={type} />
            <div className='flex gap-[1.6rem]'>
                {AD_CONDITION_CONTENT[type]?.options?.map(option => (
                    <AdConditionBlockElement
                        isSelected={selectedValue === option.value}
                        key={option.value}
                        label={option.label}
                        onClick={onClick}
                        value={option.value}
                    />
                ))}
            </div>
        </div>
    );
};

export default AdConditionBlockSelector;
