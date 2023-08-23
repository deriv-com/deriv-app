import React from 'react';
import { TWalletInfo } from 'Types';
import { Text, WalletCard } from '@deriv/components';
import { useCurrencyConfig, useCreateWallet } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import { getWalletCurrencyIcon } from '@deriv/utils';
import wallet_description_mapper from 'Constants/wallet_description_mapper';

type TAddWalletCard = {
    wallet_info: React.PropsWithChildren<TWalletInfo>;
};

const AddWalletCard = observer(({ wallet_info }: TAddWalletCard) => {
    const { ui } = useStore();
    const { is_dark_mode_on } = ui;
    const { currency, landing_company_name, is_added, gradient_card_class } = wallet_info;
    const { getConfig } = useCurrencyConfig();
    const currency_config = getConfig(currency);
    const { mutate: createWallet } = useCreateWallet();

    const wallet_details = {
        currency,
        icon: getWalletCurrencyIcon(currency, is_dark_mode_on),
        icon_type: currency_config?.type,
        jurisdiction_title: landing_company_name?.toUpperCase(),
        name: currency_config?.name,
        gradient_class: gradient_card_class,
    };

    return (
        <div className='add-wallets__card'>
            <div className='add-wallets__card-wrapper'>
                <WalletCard
                    wallet={wallet_details}
                    size='medium'
                    state={is_added ? 'added' : 'add'}
                    onClick={() =>
                        !is_added &&
                        createWallet({
                            payload: { currency, account_type: currency_config?.is_crypto ? 'crypto' : 'doughflow' },
                        })
                    }
                />
                <div className='add-wallets__card-description'>
                    <Text as='h3' weight='bold' color='prominent' className='add-wallets__card-description__header'>
                        {`${currency_config?.display_code} Wallet`}
                    </Text>
                    <Text as='p' size='xs' className='add-wallets__card-description__text'>
                        {wallet_description_mapper[currency]}
                    </Text>
                </div>
            </div>
        </div>
    );
});

export default AddWalletCard;
