import React from 'react';
import { Text, StaticUrl, Button } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import ListingContainer from 'Components/containers/listing-container';
import { isCryptocurrency, routes } from '@deriv/shared';
import { TWalletAccount } from 'Types';
import { useStore, observer } from '@deriv/stores';
import { useHistory } from 'react-router';
import WalletFiatCFD from './wallet-fiat-cfd';

type TProps = {
    wallet_account: TWalletAccount;
    fiat_wallet_currency?: string;
};

const WalletCFDsListing = observer(({ wallet_account, fiat_wallet_currency = 'USD' }: TProps) => {
    const history = useHistory();
    const {
        modules: { cfd },
        ui,
    } = useStore();

    const { currency } = wallet_account;

    const { toggleCompareAccountsModal } = cfd;
    const { is_mobile } = ui;
    const accounts_sub_text =
        wallet_account.landing_company_name === 'svg' ? localize('Compare accounts') : localize('Account information');

    const is_fiat = !isCryptocurrency(currency) && currency !== 'USDT';

    const CryptoCFDs = () => (
        <div className='wallet-content__cfd-crypto'>
            <Text size='s' weight='bold' line_height='xxl' as='p' className='wallet-content__cfd-crypto-title'>
                <Localize
                    i18n_default_text='To trade CFDs, you’ll need to use your {{fiat_wallet_currency}} Wallet. Click Transfer to move your {{currency}} to your {{fiat_wallet_currency}} Wallet.'
                    values={{ fiat_wallet_currency, currency }}
                />
            </Text>
            <Button
                onClick={(e: MouseEvent) => {
                    e.stopPropagation();
                    history.push(routes.cashier_acc_transfer);
                }}
                className='wallet-content__cfd-crypto-button'
                primary_light
            >
                {localize('Transfer')}
            </Button>
        </div>
    );

    return (
        <ListingContainer
            className='wallet-content__border-reset'
            title={
                !is_mobile && (
                    <div className='cfd-accounts__title'>
                        <Text size='sm' line_height='m' weight='bold' color='prominent'>
                            {localize('CFDs')}
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
            {is_fiat ? <WalletFiatCFD wallet_account={wallet_account} /> : <CryptoCFDs />}
        </ListingContainer>
    );
});

export default WalletCFDsListing;
