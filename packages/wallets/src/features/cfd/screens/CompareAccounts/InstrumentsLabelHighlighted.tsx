import React from 'react';
import { getHighlightedIconLabel } from './compareAccountsConfig';
import { CFD_PLATFORMS, MARKET_TYPE } from './constants';
import InstrumentsIconWithLabel from './InstrumentsIconWithLabel';
import './InstrumentsLabelHighlighted.scss';

type TInstrumentsLabelHighlighted = {
    isDemo: boolean; // TODO: remove this prop
    marketType: typeof MARKET_TYPE[keyof typeof MARKET_TYPE];
    platform: typeof CFD_PLATFORMS[keyof typeof CFD_PLATFORMS];
    shortCode: string;
};

const InstrumentsLabelHighlighted = ({ marketType, platform, shortCode }: TInstrumentsLabelHighlighted) => {
    // const { traders_hub } = useStore();
    // const selected_region = traders_hub.selected_region;

    const selectedRegion = 'Non-EU';

    const iconData = [...getHighlightedIconLabel(platform, marketType, shortCode, selectedRegion)];

    return (
        <div className={'wallets-compare-accounts-outline'} data-testid='dt_compare_cfd_account_outline__container'>
            {iconData.map(item => (
                <InstrumentsIconWithLabel
                    key={item.text}
                    {...item}
                    className='wallets-compare-accounts-instrument-icon'
                />
            ))}
        </div>
    );
};

export default InstrumentsLabelHighlighted;
