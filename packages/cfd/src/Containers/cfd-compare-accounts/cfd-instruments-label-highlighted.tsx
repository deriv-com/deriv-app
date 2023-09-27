import React from 'react';
import InstrumentsIconWithLabel from './instruments-icon-with-label';
import { TInstrumentsIcon, TCompareAccountsCard } from 'Components/props.types';
import { getHighlightedIconLabel } from '../../Helpers/compare-accounts-config';
import { useStore } from '@deriv/stores';

const CFDInstrumentsLabelHighlighted = ({ trading_platforms, is_demo }: TCompareAccountsCard) => {
    const { traders_hub } = useStore();
    const selected_region = traders_hub.selected_region;

    const iconData: TInstrumentsIcon[] = [...getHighlightedIconLabel(trading_platforms, selected_region, is_demo)];

    return (
        <div className={'compare-cfd-account-outline'} data-testid='dt_compare_cfd_account_outline__container'>
            {iconData.map(item => (
                <InstrumentsIconWithLabel key={item.text} {...item} className='compare-cfd-account-instrument-icon' />
            ))}
        </div>
    );
};

export default CFDInstrumentsLabelHighlighted;
