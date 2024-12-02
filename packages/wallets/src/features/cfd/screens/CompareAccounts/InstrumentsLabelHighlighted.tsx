import React from 'react';
import { useTranslations } from '@deriv-com/translations';
import { TPlatforms } from '../../../../types';
import { getHighlightedIconLabel } from './compareAccountsConfig';
import InstrumentsIconWithLabel from './InstrumentsIconWithLabel';
import './InstrumentsLabelHighlighted.scss';

type TInstrumentsLabelHighlighted = {
    instruments?: string[];
    isEuRegion: boolean;
    platform: TPlatforms.All;
};

const InstrumentsLabelHighlighted = ({ instruments, isEuRegion, platform }: TInstrumentsLabelHighlighted) => {
    const { localize } = useTranslations();
    const iconData = [...getHighlightedIconLabel({ instruments, isEuRegion, localize, platform })];
    const filteredIconData = isEuRegion ? iconData.filter(item => item.highlighted) : iconData;

    return (
        <div className='wallets-compare-accounts-outline' data-testid='dt_compare_cfd_account_outline__container'>
            {filteredIconData.map(item => (
                <InstrumentsIconWithLabel key={item.text} {...item} />
            ))}
        </div>
    );
};

export default InstrumentsLabelHighlighted;
