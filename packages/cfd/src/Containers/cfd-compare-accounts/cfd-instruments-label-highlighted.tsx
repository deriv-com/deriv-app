import React from 'react';
import InstrumentsIconWithLabel from './instruments-icon-with-label';
import { TInstrumentsIcon, TCompareAccountsCard } from 'Components/props.types';
import { getHighlightedIconLabel } from '../../Helpers/compare-accounts-config';

const CFDInstrumentsLabelHighlighted = ({ trading_platforms }: TCompareAccountsCard) => {
    const iconData: TInstrumentsIcon[] = [...getHighlightedIconLabel(trading_platforms)];

    return (
        <div className={'compare-cfd-account-outline'}>
            {iconData.map(item => (
                <InstrumentsIconWithLabel key={item.text} {...item} className='compare-cfd-account-instrument-icon' />
            ))}
        </div>
    );
};

export default CFDInstrumentsLabelHighlighted;
