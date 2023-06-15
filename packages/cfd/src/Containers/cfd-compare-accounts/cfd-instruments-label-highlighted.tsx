import React from 'react';
import InstumentsIconWithLabel from './instruments-icon-with-label';
import { TIconData, TModifiedTradingPlatformAvailableAccount } from 'Components/props.types';
import { getHighlightedIconLabel } from '../../Helpers/compare-accounts-config';

type TCFDInstrumentsLabelHighlightedProps = {
    trading_platforms: TModifiedTradingPlatformAvailableAccount;
};

const CFDInstrumentsLabelHighlighted = ({ trading_platforms }: TCFDInstrumentsLabelHighlightedProps) => {
    const iconData: TIconData[] = [...getHighlightedIconLabel(trading_platforms)];

    return (
        <div className={'compare-cfd-account-outline'}>
            {iconData.map(item => (
                <InstumentsIconWithLabel key={item.text} {...item} />
            ))}
        </div>
    );
};

export default CFDInstrumentsLabelHighlighted;
