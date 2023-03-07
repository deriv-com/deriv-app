import React from 'react';
import { observer } from 'mobx-react-lite';
import { Text, Popover } from '@deriv/components';
import { localize } from '@deriv/translations';
import { isMobile } from '@deriv/shared';
import BalanceText from 'Components/elements/text/balance-text';
import { useStores } from 'Stores';
import './asset-summary.scss';
import TotalAssetsLoader from 'Components/pre-loader/total-assets-loader';

const AssetSummary = () => {
    const { traders_hub, client, common } = useStores();
    const {
        selected_account_type,
        platform_real_balance,
        cfd_demo_balance,
        platform_demo_balance,
        cfd_real_balance,
        is_eu_user,
        no_CR_account,
        no_MF_account,
    } = traders_hub;
    const { is_logging_in, is_switching, current_fiat_currency, has_fiat } = client;
    const { getExchangeRate } = common;

    const crypto_is_first = current_fiat_currency !== platform_real_balance.currency;
    const crypto_is_first_and_has_fiat = has_fiat && crypto_is_first;
    const real_balance_currency_if_crypto_account_first =
        crypto_is_first && crypto_is_first_and_has_fiat ? current_fiat_currency : 'USD';
    const total_assets_currency = current_fiat_currency ?? real_balance_currency_if_crypto_account_first;

    const [exchanged_rate_crypto_real, setExchangedRateCryptoReal] = React.useState(1);
    const [exchanged_rate_cfd_real, setExchangedRateCfdReal] = React.useState(1);
    const [exchanged_rate_cfd_demo, setExchangedRateCfdDemo] = React.useState(1);

    React.useEffect(() => {
        const getCurrentExchangeRate = (
            currency: string,
            setExchangeRate: React.Dispatch<React.SetStateAction<number>>,
            base_currency: string = total_assets_currency
        ) => {
            if (currency) {
                getExchangeRate(currency, base_currency).then((res: number) => {
                    setExchangeRate(res);
                });
            }
        };

        if (crypto_is_first) {
            getCurrentExchangeRate(platform_real_balance.currency, setExchangedRateCryptoReal);
        }
        if (cfd_real_balance.currency !== total_assets_currency) {
            getCurrentExchangeRate(cfd_real_balance.currency, setExchangedRateCfdReal);
        }
        if (cfd_demo_balance.currency !== platform_demo_balance.currency) {
            getCurrentExchangeRate(cfd_demo_balance.currency, setExchangedRateCfdDemo, platform_demo_balance.currency);
        }
    }, [
        cfd_demo_balance.currency,
        cfd_real_balance.currency,
        crypto_is_first_and_has_fiat,
        getExchangeRate,
        platform_demo_balance.currency,
        platform_real_balance.currency,
        total_assets_currency,
        real_balance_currency_if_crypto_account_first,
        crypto_is_first,
    ]);

    const getTotalBalance = () => {
        if (selected_account_type === 'real') {
            return {
                balance:
                    (crypto_is_first
                        ? platform_real_balance.balance * exchanged_rate_crypto_real
                        : platform_real_balance.balance) +
                    cfd_real_balance.balance * exchanged_rate_cfd_real,
                // currency: real_balance_currency_if_crypto_account_first,
                currency: total_assets_currency,
            };
        }

        return {
            balance: platform_demo_balance.balance + cfd_demo_balance.balance * exchanged_rate_cfd_demo,
            currency: platform_demo_balance.currency,
        };
    };

    const has_active_related_deriv_account = !((no_CR_account && !is_eu_user) || (no_MF_account && is_eu_user)); // if selected region is non-eu, check active cr accounts, if selected region is eu- check active mf accounts
    const eu_account = is_eu_user && !no_MF_account;
    const cr_account = !is_eu_user && !no_CR_account;

    //dont show loader if user has no respective regional account
    if ((is_switching || is_logging_in) && (eu_account || cr_account)) {
        return (
            <React.Fragment>
                <div className='asset-summary__container content-loader'>
                    <TotalAssetsLoader />
                </div>
            </React.Fragment>
        );
    }

    return (
        <div className='asset-summary'>
            {has_active_related_deriv_account || selected_account_type === 'demo' ? (
                <React.Fragment>
                    {!isMobile() ? (
                        <Text align='right' size='xs' line_height='s'>
                            {localize('Total assets')}
                        </Text>
                    ) : null}
                    <Popover
                        alignment={isMobile() ? 'top' : 'left'}
                        message={localize('Total assets in all your accounts')}
                        zIndex={9999}
                        is_bubble_hover_enabled
                    >
                        <BalanceText
                            currency={getTotalBalance().currency}
                            balance={getTotalBalance().balance}
                            underline_style='dotted'
                        />
                    </Popover>
                </React.Fragment>
            ) : null}
        </div>
    );
};

export default observer(AssetSummary);
