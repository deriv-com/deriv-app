import React from 'react';
import { Text, Popover } from '@deriv/components';
import './asset-summary.scss';
import { localize } from '@deriv/translations';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import { DetailsOfEachMT5Loginid, Mt5LoginList } from '@deriv/api-types';
import { formatMoney, isMobile } from '@deriv/shared';
import classNames from 'classnames';

const AssetSummary = () => {
    const { client, common, tradinghub } = useStores();
    const {
        account_list,
        accounts,
        dxtrade_accounts_list,
        mt5_login_list,
        obj_total_balance,
        has_active_real_account,
        is_eu,
    } = client;
    const { getExchangeRate } = common;
    const { selected_account_type } = tradinghub;

    const [exchanged_rate_cfd_real, setExchangedRateCfdReal] = React.useState(1);
    const [exchanged_rate_demo, setExchangedRateDemo] = React.useState(1);
    const [exchanged_rate_cfd_demo, setExchangedRateCfdDemo] = React.useState(1);
    const [total_assets, setTotalAssets] = React.useState(0);

    const isDemo = (account: DetailsOfEachMT5Loginid) => account.account_type === 'demo';

    const cfd_real_currency =
        mt5_login_list?.find((mt5_account: DetailsOfEachMT5Loginid) => !isDemo(mt5_account))?.currency ||
        dxtrade_accounts_list.find((mt5_accounts: DetailsOfEachMT5Loginid) => !isDemo(mt5_accounts))?.currency;

    const cfd_demo_currency =
        mt5_login_list?.find((mt5_account: DetailsOfEachMT5Loginid) => isDemo(mt5_account))?.currency ||
        dxtrade_accounts_list.find((mt5_account: DetailsOfEachMT5Loginid) => isDemo(mt5_account))?.currency;

    const vrtc_loginid = account_list.find((account: { is_virtual: boolean }) => account.is_virtual).loginid;
    const vrtc_currency = accounts[vrtc_loginid] ? accounts[vrtc_loginid].currency : 'USD';
    const account_total_balance_currency =
        selected_account_type === 'demo' ? vrtc_currency : obj_total_balance.currency;

    React.useEffect(() => {
        const getCurrentExchangeRate = (
            currency: string,
            setExchangeRate: React.Dispatch<React.SetStateAction<number>>
        ) => {
            getExchangeRate(currency, account_total_balance_currency).then((res: number) => {
                setExchangeRate(res);
            });
        };
        if (selected_account_type === 'real') {
            getCurrentExchangeRate(cfd_real_currency, setExchangedRateCfdReal);
            setTotalAssets(getTotalRealAssets());
        } else if (selected_account_type === 'demo') {
            getCurrentExchangeRate(vrtc_currency, setExchangedRateDemo);
            setTotalAssets(getTotalDemoAssets());
        } else if (cfd_demo_currency !== account_total_balance_currency) {
            getCurrentExchangeRate(cfd_demo_currency, setExchangedRateCfdDemo);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selected_account_type]);

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
                    total.balance += (mt5_account?.balance || 0) * (exchange_rate || 1);
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

        total +=
            obj_total_balance.amount_mt5 > 0 && obj_total_balance.amount_mt5 !== 0
                ? obj_total_balance.amount_mt5
                : mt5_total.balance || 0;
        total +=
            obj_total_balance.amount_dxtrade > 0 && obj_total_balance.amount_dxtrade !== 0
                ? obj_total_balance.amount_dxtrade
                : dxtrade_total.balance || 0;

        return total;
    };

    const currency = account_total_balance_currency;
    const is_eu_popover_text = is_eu
        ? localize(`Total assets in your Multipliers and DMT5 ${selected_account_type} accounts`)
        : localize(`Total assets in your Options, Deriv MT5 and Deriv X ${selected_account_type} accounts`);

    return (
        <div className='asset-summary'>
            {has_active_real_account || selected_account_type === 'demo' ? (
                <>
                    {!isMobile() ? (
                        <Text align='right' size='xs' line_height='s'>
                            {localize('Total assets')}
                        </Text>
                    ) : null}
                    <div className='asset-summary--total'>
                        <Popover alignment='left' message={is_eu_popover_text}>
                            <Text
                                weight='bold'
                                size='m'
                                className={classNames({
                                    'asset-summary-amount':
                                        selected_account_type === 'demo' && !has_active_real_account,
                                    'asset-summary-no-amount':
                                        selected_account_type === 'real' && !has_active_real_account,
                                    'asset-summary-real': selected_account_type === 'real' && has_active_real_account,
                                    'asset-summary-demo': selected_account_type === 'demo' && has_active_real_account,
                                })}
                            >
                                {formatMoney(currency, total_assets, true)}
                            </Text>
                            <Text
                                weight='bold'
                                size='m'
                                color='prominent'
                                className={classNames({
                                    'asset-summary-currency':
                                        selected_account_type === 'demo' && !has_active_real_account,
                                    'asset-summary-no-currency':
                                        selected_account_type === 'real' && !has_active_real_account,
                                    'asset-summary-real': selected_account_type === 'real' && has_active_real_account,
                                    'asset-summary-demo': selected_account_type === 'demo' && has_active_real_account,
                                })}
                            >
                                {currency}
                            </Text>
                        </Popover>
                    </div>
                </>
            ) : null}
        </div>
    );
};

export default observer(AssetSummary);
