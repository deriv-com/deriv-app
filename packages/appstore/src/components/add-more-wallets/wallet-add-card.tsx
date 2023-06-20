import React from 'react';
import { Text, WalletCard } from '@deriv/components';
import { useCurrencyConfig, useDisplayAvailableWallets } from '@deriv/hooks';
import { getAddWalletDetails } from 'Constants/add-wallet-card-content';

type TWalletInfo = {
    wallet_info: NonNullable<ReturnType<typeof useDisplayAvailableWallets>['data']>[number];
};

const AddWalletCard = ({ wallet_info }: React.PropsWithChildren<TWalletInfo>) => {
    const { getConfig } = useCurrencyConfig();
    const { currency, landing_company_shortcode, is_added } = wallet_info;
    const { title, description } = getAddWalletDetails(currency);

    const wallet_details = {
        currency,
        icon: getConfig(currency)?.icon,
        icon_type: 'app',
        jurisdiction_title: landing_company_shortcode?.toUpperCase(),
        name: getConfig(currency)?.name,
    };

    return (
        <div className='add-wallets__card'>
            <div className='add-wallets__card-wrapper'>
                <div className='add-wallets__card-description'>
                    <WalletCard wallet={wallet_details} size='medium' state={is_added ? 'added' : 'add'} />
                    <Text as='h3' size='s' weight='bold'>
                        {title}
                    </Text>
                    <Text as='p' size='xs'>
                        {description}
                    </Text>
                </div>
            </div>
        </div>
    );
};

export default AddWalletCard;
