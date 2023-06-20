import React from 'react';
import InstumentsIconWithLabel from './instruments-icon-with-label';
import { TIconData, TCompareAccountsCard } from 'Components/props.types';
import { getHighlightedIconLabel } from '../../Helpers/compare-accounts-config';

const CFDInstrumentsLabelHighlighted = ({ trading_platforms }: TCompareAccountsCard) => {
    const iconData: TIconData[] = [...getHighlightedIconLabel(trading_platforms)];

    return (
        <div className={'compare-cfd-account-outline'}>
            {iconData.map(item => (
                <InstumentsIconWithLabel key={item.text} {...item} className='compare-cfd-account-instrument-icon' />
            ))}
        </div>
    );
};

export default CFDInstrumentsLabelHighlighted;
