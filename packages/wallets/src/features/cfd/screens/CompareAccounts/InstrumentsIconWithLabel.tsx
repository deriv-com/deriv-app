import React from 'react';
import { useDevice } from '@deriv-com/ui';
import { WalletText } from '../../../../components';
import getInstrumentsIcons from '../../../../public/images/tradingInstruments';
import './InstrumentsIconWithLabel.scss';

type TInstrumentsIcon = {
    highlighted: boolean;
    icon: keyof ReturnType<typeof getInstrumentsIcons>;
    isAsterisk?: boolean;
    text: string;
};

const InstrumentsIconWithLabel = ({ highlighted, icon, isAsterisk, text }: TInstrumentsIcon) => {
    const { isDesktop } = useDevice();

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
                <WalletText align='left' as='p' lineHeight='xs' size='xs' weight={isDesktop ? 'bold' : 'normal'}>
                    {text}
                </WalletText>
            </div>
            {isAsterisk && <span className='wallets-compare-accounts-trading-instruments__span'>*</span>}
        </div>
    );
};

export default InstrumentsIconWithLabel;
