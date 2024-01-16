import React from 'react';
import { useUIContext } from '../../../../components';
import { getStaticUrl } from '../../../../helpers/urls';
import useRegionFlags from '../../../../hooks/useRegionFlags';
import { THooks } from '../../../../types';
import { MarketType, MarketTypeDetails } from '../../constants';

export const MT5AccountIcon = ({ account }: { account: THooks.MT5AccountsList }) => {
    const { getUIState } = useUIContext();
    const activeRegion = getUIState('region');

    const { isEU } = useRegionFlags(activeRegion);

    const handleClick = () => {
        window.open(getStaticUrl('/dmt5'));
    };
    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        // Fix sonarcloud issue
        if (event.key === 'Enter' || event.key === ' ') {
            handleClick();
        }
    };

    const marketTypeDetails = MarketTypeDetails(isEU)[account.market_type ?? MarketType.ALL];

    const icon = marketTypeDetails?.icon ?? null;

    return (
        <div className='cursor-pointer' onClick={handleClick} onKeyDown={handleKeyDown} role='button' tabIndex={0}>
            {icon}
        </div>
    );
};
