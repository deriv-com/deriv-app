import React from 'react';
import { getStaticUrl } from '../../../../helpers/urls';
import { THooks } from '../../../../types';
import { MarketTypeDetails } from '../../constants';

export const MT5AccountIcon = ({ account }: { account: THooks.SortedMT5Accounts }) => {
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
