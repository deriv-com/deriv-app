import React from 'react';
import { WalletText } from '../../../../components';
import InstrumentsIcons from '../../../../public/images/tradingInstruments';
import './InstrumentsIconWithLabel.scss';

type TInstrumentsIcon = {
    highlighted: boolean;
    icon: keyof typeof InstrumentsIcons;
    isAsterisk?: boolean;
    text: string;
};

const InstrumentsIconWithLabel = ({ highlighted, icon, isAsterisk, text }: TInstrumentsIcon) => {
    const InstrumentIcon = InstrumentsIcons[icon];
    return (
        <div
            className='wallets-compare-accounts-instrument-icon'
            data-testid='dt_instruments_icon_container'
            style={{
                opacity: highlighted ? '' : '0.2',
            }}
        >
            <InstrumentIcon height={24} width={24} />
            <div className='wallets-compare-accounts-trading-instruments__text'>
                <WalletText align='left' as='p' lineHeight='xs' size='xs' weight='bold'>
                    {text}
                </WalletText>
            </div>
            {isAsterisk && <span className='wallets-compare-accounts-trading-instruments__span'>*</span>}
        </div>
    );
};

export default InstrumentsIconWithLabel;
