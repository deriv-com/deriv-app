import React from 'react';
import { THooks, TPlatforms } from '../../../../types';
import { getHighlightedIconLabel } from './compareAccountsConfig';
import InstrumentsIconWithLabel from './InstrumentsIconWithLabel';
import './InstrumentsLabelHighlighted.scss';

type TInstrumentsLabelHighlighted = {
    isEuRegion: boolean;
    marketType: THooks.AvailableMT5Accounts['market_type'];
    platform: TPlatforms.All;
    shortCode: THooks.AvailableMT5Accounts['shortcode'];
};

const InstrumentsLabelHighlighted = ({ isEuRegion, marketType, platform, shortCode }: TInstrumentsLabelHighlighted) => {
    const iconData = [...getHighlightedIconLabel(platform, isEuRegion, marketType, shortCode)];

    return (
        <div className={'wallets-compare-accounts-outline'} data-testid='dt_compare_cfd_account_outline__container'>
            {iconData.map(item => (
                <InstrumentsIconWithLabel key={item.text} {...item} />
            ))}
        </div>
    );
};

export default InstrumentsLabelHighlighted;
