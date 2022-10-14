import * as React from 'react';
import Joyride from 'react-joyride';
import ToggleAccountType from 'Components/toggle-account-type';
import { tour_step_config, tour_styles, tour_step_locale, tour_styles_dark_mode } from 'Constants/tour-steps-config';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import CFDAccounts from 'Components/CFDs';
import { TAccountCategory } from 'Types';
import { Localize, localize } from '@deriv/translations';
import { Button } from '@deriv/components';
import { useHistory } from 'react-router-dom';
import { routes, isDemo } from '@deriv/shared';
import TotalAssets from 'Components/total-assets';
import './index.scss';
import { DetailsOfEachMT5Loginid, Mt5LoginList } from '@deriv/api-types';

const TradingHub = () => {
    const { ui, client, common } = useStores();
    const { is_dark_mode_on, is_tour_open, toggleIsTourOpen } = ui;
    const { obj_total_balance, dxtrade_accounts_list, mt5_login_list, accounts, account_list } = client;
    const { getExchangeRate } = common;

    const history = useHistory();
    /*TODO: We need to show this component whenever user click on tour guide button*/
    const [account_type, setAccountType] = React.useState<TAccountCategory>('demo');
    const [exchanged_rate_cfd_real, setExchangedRateCfdReal] = React.useState(1);
    const [exchanged_rate_demo, setExchangedRateDemo] = React.useState(1);
    const [exchanged_rate_cfd_demo, setExchangedRateCfdDemo] = React.useState(1);

    const accountTypeChange = (event: any) => {
        setAccountType(event.target.value);
    };

    tour_step_locale.last = (
        <Localize
            i18n_default_text='OK'
            onClick={() => {
                toggleIsTourOpen();
            }}
        />
    );

    tour_step_locale.back = (
        <Button
            has_effect
            text={localize('Repeat tour')}
            secondary
            medium
            onClick={() => {
                history.push(routes.onboarding);
                toggleIsTourOpen();
            }}
        />
    );
    const cfd_real_currency =
        mt5_login_list.find((mt5_accounts: Mt5LoginList) => !isDemo(mt5_accounts))?.currency ||
        dxtrade_accounts_list.find((mt5_accounts: Mt5LoginList) => !isDemo(mt5_accounts))?.currency;

    const cfd_demo_currency =
        mt5_login_list.find((mt5_accounts: Mt5LoginList) => isDemo(mt5_accounts))?.currency ||
        dxtrade_accounts_list.find((mt5_accounts: Mt5LoginList) => isDemo(mt5_accounts))?.currency;

    React.useEffect(() => {
        const getCurrentExchangeRate = (
            currency: string,
            setExchangeRate: React.Dispatch<React.SetStateAction<number>>
        ) => {
            getExchangeRate(currency, account_total_balance_currency).then((res: number) => {
                setExchangeRate(res);
            });
        };
        if (cfd_real_currency !== account_total_balance_currency) {
            getCurrentExchangeRate(cfd_real_currency, setExchangedRateCfdReal);
        }
        if (vrtc_currency !== account_total_balance_currency) {
            getCurrentExchangeRate(vrtc_currency, setExchangedRateDemo);
        }
        if (cfd_demo_currency !== account_total_balance_currency) {
            getCurrentExchangeRate(cfd_demo_currency, setExchangedRateCfdDemo);
        }
    }, []);

    const vrtc_loginid = account_list.find((account: { is_virtual: boolean }) => account.is_virtual).loginid;
    const vrtc_currency = accounts[vrtc_loginid] ? accounts[vrtc_loginid].currency : 'USD';
    const account_total_balance_currency = obj_total_balance.currency;

    const getTotalBalanceCfd = (mt5_accounts: Mt5LoginList, is_demo: boolean, exchange_rate: number) => {
        return mt5_accounts
            .filter((mt5_account: DetailsOfEachMT5Loginid) => (is_demo ? isDemo(mt5_account) : !isDemo(mt5_account)))
            .reduce(
                (
                    total: {
                        balance: number;
                    },
                    mt5_account: DetailsOfEachMT5Loginid
                ) => {
                    total.balance += (mt5_account?.balance ?? 1) * exchange_rate;
                    return total;
                },
                { balance: 0 }
            );
    };

    const getTotalDemoAssets = (): number => {
        const vrtc_balance = accounts[vrtc_loginid] ? accounts[vrtc_loginid].balance : 0;
        const mt5_demo_total = getTotalBalanceCfd(mt5_login_list, true, exchanged_rate_cfd_demo);
        const dxtrade_demo_total = getTotalBalanceCfd(dxtrade_accounts_list, true, exchanged_rate_cfd_demo);

        const total =
            (vrtc_currency !== account_total_balance_currency ? vrtc_balance * exchanged_rate_demo : vrtc_balance) +
            mt5_demo_total.balance +
            dxtrade_demo_total.balance;

        return total;
    };

    const getTotalRealAssets = (): number => {
        const mt5_total = getTotalBalanceCfd(mt5_login_list, false, exchanged_rate_cfd_real);
        const dxtrade_total = getTotalBalanceCfd(dxtrade_accounts_list, false, exchanged_rate_cfd_real);

        let total = obj_total_balance.amount_real;

        total += obj_total_balance.amount_mt5 > 0 ? obj_total_balance.amount_mt5 : mt5_total.balance;
        total += obj_total_balance.amount_dxtrade > 0 ? obj_total_balance.amount_dxtrade : dxtrade_total.balance;

        return total;
    };

    return (
        <React.Fragment>
            <div className='trading-hub__header'>
                <div className='trading-hub__header--right'>
                    <TotalAssets
                        amount={account_type === 'demo' ? getTotalDemoAssets() : getTotalRealAssets()}
                        currency={obj_total_balance.currency}
                        category={account_type}
                    />
                    <ToggleAccountType
                        accountTypeChange={(event: any) => accountTypeChange(event)}
                        value={account_type}
                    />
                </div>
            </div>

            <div className='trading-hub__body'>
                <CFDAccounts account_type={account_type} />
            </div>
            <Joyride
                run={is_tour_open}
                continuous
                disableScrolling
                hideCloseButton
                disableCloseOnEsc
                steps={tour_step_config}
                styles={is_dark_mode_on ? tour_styles_dark_mode : tour_styles}
                locale={tour_step_locale}
                floaterProps={{
                    disableAnimation: true,
                }}
            />
        </React.Fragment>
    );
};

export default observer(TradingHub);
