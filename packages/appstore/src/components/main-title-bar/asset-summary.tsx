import React from 'react';
import { Text, Popover } from '@deriv/components';
import { localize } from '@deriv/translations';
import { isMobile } from '@deriv/shared';
import BalanceText from 'Components/elements/text/balance-text';
// import { useStores } from 'Stores';
import { observer, useStore } from '@deriv/stores';
import './asset-summary.scss';
import TotalAssetsLoader from 'Components/pre-loader/total-assets-loader';

const AssetSummary = observer(() => {
    const { traders_hub, client, common }: any = useStore();
    const {
        selected_account_type,
        platform_real_balance,
        cfd_demo_balance,
        platform_demo_balance,
        cfd_real_balance,
        is_eu_user,
        no_CR_account,
        no_MF_account,
        updateExchangeRates,
        exchange_rates_2,
    } = traders_hub;
    const { is_logging_in, is_switching } = client;
    const { getExchangeRate } = common;

    const [exchanged_rate_cfd_real, setExchangedRateCfdReal] = React.useState(1);
    const [exchanged_rate_cfd_demo, setExchangedRateCfdDemo] = React.useState(1);
    const { exchange_rates } = useStore();

    React.useEffect(() => {
        updateExchangeRates(exchange_rates.data);
    }, [exchange_rates.data]);

    React.useEffect(() => {
        const getCurrentExchangeRate = (
            currency: string,
            setExchangeRate: React.Dispatch<React.SetStateAction<number>>,
            base_currency = platform_real_balance.currency
        ) => {
            if (currency) {
                getExchangeRate(currency, base_currency).then((res: number) => {
                    setExchangeRate(res);
                });
            }
        };

        if (cfd_real_balance.currency !== platform_real_balance.currency) {
            getCurrentExchangeRate(cfd_real_balance.currency, setExchangedRateCfdReal);
        }
        if (cfd_demo_balance.currency !== platform_demo_balance.currency) {
            getCurrentExchangeRate(cfd_demo_balance.currency, setExchangedRateCfdDemo, platform_demo_balance.currency);
        }
    }, [
        cfd_demo_balance.currency,
        cfd_real_balance.currency,
        getExchangeRate,
        platform_demo_balance.currency,
        platform_real_balance.currency,
    ]);

    const getTotalBalance = () => {
        if (selected_account_type === 'real') {
            return {
                balance: platform_real_balance.balance + cfd_real_balance.balance * exchanged_rate_cfd_real,
                currency: platform_real_balance.currency,
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
            <div
                style={{
                    backgroundColor: 'red',
                    fontSize: 20,
                    padding: 50,
                    position: 'fixed',
                    zIndex: 9999,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    overflow: 'scroll',
                }}
            >
                <p>data from useStore: {JSON.stringify(exchange_rates.data)}</p>
                <hr />
                <p>data from traders hub store: {JSON.stringify(exchange_rates_2)}</p>
            </div>
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
});

export default AssetSummary;
