import React from 'react';
import { Text, StaticUrl } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import ListingContainer from 'Components/containers/listing-container';
import { isCryptocurrency } from '@deriv/shared';
import { useStore, observer } from '@deriv/stores';
import WalletFiatCFD from './wallet-fiat-cfd';
import { useActiveWallet } from '@deriv/hooks';
import PlatformLoader from 'Components/pre-loader/platform-loader';
import WalletCryptoCFD from './wallet-crypto-cfd';

const WalletCFDsListing = observer(() => {
    const {
        modules: { cfd },
        ui,
        client,
    } = useStore();
    const wallet_account = useActiveWallet();

    const currency = wallet_account?.currency;

    const { toggleCompareAccountsModal } = cfd;
    const { is_mobile } = ui;
    const { is_landing_company_loaded, is_logging_in, is_switching } = client;

    if (!wallet_account || !is_landing_company_loaded || is_switching || is_logging_in)
        return (
            <div className='wallet-content__loader'>
                <PlatformLoader />
            </div>
        );

    const accounts_sub_text =
        wallet_account.landing_company_name === 'svg' || wallet_account.is_virtual
            ? localize('Compare accounts')
            : localize('Account information');

    const is_fiat = !isCryptocurrency(currency) && currency !== 'USDT';

    const cfd_title = !is_mobile && (
        <div className='cfd-accounts__title'>
            <Text size='sm' weight='bold' color='prominent'>
                {localize('CFDs')}
            </Text>
            <div className='cfd-accounts__compare-table-title' onClick={toggleCompareAccountsModal}>
                <Text key={0} color='red' size='xxs' weight='bold' styles={{ marginLeft: '1rem' }}>
                    {accounts_sub_text}
                </Text>
            </div>
        </div>
    );

    const cfd_description = (
        <Text size='xs' line_height='s'>
            <Localize
                i18n_default_text={
                    'Trade with leverage and tight spreads for better returns on trades. <0>Learn more</0>'
                }
                components={[<StaticUrl key={0} className='options' href='/trade-types/cfds' />]}
            />
        </Text>
    );

    return (
        <ListingContainer
            className='wallet-content__border-reset wallet-content__cfd'
            title={cfd_title}
            description={cfd_description}
            is_outside_grid_container={!is_fiat}
        >
            {is_mobile && (
                <div className='cfd-accounts__compare-table-title' onClick={toggleCompareAccountsModal}>
                    <Text size='xs' color='red' weight='bold' line_height='s'>
                        {accounts_sub_text}
                    </Text>
                </div>
            )}
            {is_fiat ? <WalletFiatCFD wallet_account={wallet_account} /> : <WalletCryptoCFD />}
        </ListingContainer>
    );
});

export default WalletCFDsListing;
