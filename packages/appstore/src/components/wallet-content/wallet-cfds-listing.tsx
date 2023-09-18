import React from 'react';
import { Text, StaticUrl } from '@deriv/components';
import { useActiveWallet } from '@deriv/hooks';
import { useStore, observer } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import ListingContainer from 'Components/containers/listing-container';
import { isCryptocurrency } from '@deriv/shared';
import PlatformLoader from 'Components/pre-loader/platform-loader';
import WalletCryptoCFD from './wallet-crypto-cfd';
import WalletFiatCFD from './wallet-fiat-cfd';
import './wallet-content.scss';

const WalletCFDsListing = observer(() => {
    const {
        client,
        modules: { cfd },
        ui,
    } = useStore();

    const { toggleCompareAccountsModal } = cfd;
    const { is_landing_company_loaded, is_logging_in, is_switching } = client;
    const { is_mobile } = ui;

    const wallet_account = useActiveWallet();

    if (!wallet_account || !is_landing_company_loaded || is_switching || is_logging_in)
        return (
            <div className='wallet-content__loader'>
                <PlatformLoader />
            </div>
        );

    const { currency, landing_company_name, is_virtual } = wallet_account;
    const accounts_sub_text =
        landing_company_name === 'svg' || is_virtual ? (
            <Localize i18n_default_text='Compare accounts' />
        ) : (
            <Localize i18n_default_text='Account information' />
        );

    const is_fiat = !isCryptocurrency(currency) && currency !== 'USDT';

    return (
        <ListingContainer
            className='wallet-content__border-reset wallet-content__cfd'
            title={
                !is_mobile && (
                    <div className='cfd-accounts__title'>
                        <Text size='sm' weight='bold' color='prominent'>
                            <Localize i18n_default_text='CFDs' />
                        </Text>
                        <div className='cfd-accounts__compare-table-title' onClick={toggleCompareAccountsModal}>
                            <Text key={0} color='red' size='xxs' weight='bold' styles={{ marginLeft: '1rem' }}>
                                {accounts_sub_text}
                            </Text>
                        </div>
                    </div>
                )
            }
            description={
                <Text size='xs' line_height='s'>
                    <Localize
                        i18n_default_text={
                            'Trade with leverage and tight spreads for better returns on trades. <0>Learn more</0>'
                        }
                        components={[<StaticUrl key={0} className='options' href='/trade-types/cfds' />]}
                    />
                </Text>
            }
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
