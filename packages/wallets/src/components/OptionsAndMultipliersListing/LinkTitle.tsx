import React, { ComponentProps } from 'react';
import { getStaticUrl, getUrlSmartTrader } from '../../helpers/urls';
import { WalletMarketIcon } from '../WalletMarketIcon';

const LinkTitle: React.FC<{ platform: ComponentProps<typeof WalletMarketIcon>['icon'] }> = ({ platform }) => {
    const handleClick = (event: React.KeyboardEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
        event.persist();
        switch (platform) {
            case 'trader':
                window.open(getStaticUrl(`/dtrader`));
                break;
            case 'bot':
                window.open(getStaticUrl(`/dbot`));
                break;
            case 'smarttrader':
                window.open(getUrlSmartTrader());
                break;
            case 'derivgo':
                window.open(getStaticUrl('/deriv-go'));
                break;
            default:
                break;
        }
    };

    return (
        <div
            className='wallets-options-and-multipliers-listing__content__icon'
            data-testid='dt_wallet_link_title'
            onClick={handleClick}
            // Fix sonarcloud issue
            onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => {
                if (event.key === 'Enter') {
                    handleClick(event);
                }
            }}
        >
            <WalletMarketIcon icon={platform} size='lg' />
        </div>
    );
};

export default LinkTitle;
