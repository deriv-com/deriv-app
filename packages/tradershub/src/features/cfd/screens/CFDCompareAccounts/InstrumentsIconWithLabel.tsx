import React, { FC } from 'react';
import InstrumentsIcons from '@/assets/cfd/tradingInstruments';
import { Text } from '@deriv-com/ui';

type TInstrumentsIcon = {
    highlighted: boolean;
    icon: keyof typeof InstrumentsIcons;
    isAsterisk?: boolean;
    text: string;
};

const InstrumentsIconWithLabel: FC<TInstrumentsIcon> = ({ highlighted, icon, isAsterisk, text }) => {
    const InstrumentIcon = InstrumentsIcons[icon];
    return (
        <div
            className='flex items-center m-2 cursor-not-allowed'
            data-testid='dt_instruments_icon_container'
            style={{
                opacity: highlighted ? '' : '0.2',
            }}
        >
            <InstrumentIcon height={24} width={24} />
            <div className='ml-5'>
                <Text className='text-xs lg:text-sm' weight='bold'>
                    {text}
                </Text>
            </div>
            {isAsterisk && <span className='relative text-lg top-2 text-brand-red-light'>*</span>}
        </div>
    );
};

export default InstrumentsIconWithLabel;
