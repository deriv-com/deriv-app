import React from 'react';
import { THooks } from '@deriv/library/src/types';
import { getStaticUrl } from '../../../../helpers/urls';
import { MarketTypeDetails } from '../../constants';

export const MT5AccountIcon = ({ account }: { account: THooks.MT5AccountsList }) => {
    const handleClick = () => {
        window.open(getStaticUrl('/dmt5'));
    };
    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        // Fix sonarcloud issue
        if (event.key === 'Enter' || event.key === ' ') {
            handleClick();
        }
    };
    return (
        <div className='cursor-pointer' onClick={handleClick} onKeyDown={handleKeyDown} role='button' tabIndex={0}>
            {MarketTypeDetails[account.market_type || 'all'].icon}
        </div>
    );
};
