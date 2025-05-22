import React from 'react';
import { Text, useDevice } from '@deriv-com/ui';
import getInstrumentsIcons from '../../../../public/images/tradingInstruments';
import './InstrumentsIconWithLabel.scss';

type TInstrumentsIcon = {
    highlighted: boolean;
    icon: keyof ReturnType<typeof getInstrumentsIcons>;
    text: string;
};

const InstrumentsIconWithLabel = ({ highlighted, icon, text }: TInstrumentsIcon) => {
    const { isDesktop, isTablet } = useDevice();

    return (
        <div
            className='wallets-compare-accounts-instrument-icon'
            data-testid='dt_instruments_icon_container'
            style={{
                opacity: highlighted ? '' : '0.2',
            }}
        >
            {getInstrumentsIcons(!isDesktop)[icon]}
            <div className='wallets-compare-accounts-trading-instruments__text'>
                <Text
                    align='start'
                    as='p'
                    lineHeight='xs'
                    size={isTablet ? '2xs' : 'xs'}
                    weight={isDesktop ? 'bold' : 'normal'}
                >
                    {text}
                </Text>
            </div>
        </div>
    );
};

export default InstrumentsIconWithLabel;
