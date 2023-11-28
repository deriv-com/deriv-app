import React from 'react';
import { WalletText } from '../../../../components';
import InstrumentsIcons from '../../../../public/images/tradingInstruments';
import './InstrumentsIconWithLabel.scss';

type TInstrumentsIcon = {
    className: string;
    highlighted: boolean;
    icon: keyof typeof InstrumentsIcons;
    isAsterisk?: boolean;
    text: string;
};

const InstrumentsIconWithLabel = ({ className, highlighted, icon, isAsterisk, text }: TInstrumentsIcon) => {
    const InstrumentIcon = InstrumentsIcons[icon];
    return (
        <div
            className={className}
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
            {/* TODO: isAsterisk not needed in style block  */}
            {isAsterisk && (
                <span
                    className='wallets-compare-accounts-trading-instruments__span'
                    style={{ display: isAsterisk ? 'block' : 'none' }}
                >
                    *
                </span>
            )}
        </div>
    );
};

export default InstrumentsIconWithLabel;
