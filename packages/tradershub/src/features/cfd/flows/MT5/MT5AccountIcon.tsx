import React from 'react';
import { useRegulationFlags } from '@/hooks';
import { THooks } from '@/types';
import { MarketType, MarketTypeDetails } from '@cfd/constants';
import { URLUtils } from '@deriv-com/utils';

export const MT5AccountIcon = ({ account }: { account: THooks.MT5AccountsList }) => {
    const { getDerivStaticURL } = URLUtils;
    const { isEU } = useRegulationFlags();

    const handleClick = () => {
        window.open(getDerivStaticURL('/dmt5'));
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
