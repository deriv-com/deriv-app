import React from 'react';
import { getStaticUrl } from '@/helpers';
import { useRegulationFlags } from '@/hooks';
import { THooks } from '@/types';
import { MarketType, MarketTypeDetails } from '@cfd/constants';

export const MT5AccountIcon = ({ account }: { account: THooks.MT5AccountsList }) => {
    const { isEU } = useRegulationFlags();

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
