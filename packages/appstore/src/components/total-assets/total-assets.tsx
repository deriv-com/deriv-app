import { DetailsOfEachMT5Loginid, Mt5LoginList } from '@deriv/api-types';
import { formatMoney, isMobile } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { observer } from 'mobx-react-lite';
import { Popover, Text } from '@deriv/components';
import { TAccountCategory } from 'Types';
import { useStores } from 'Stores';
import React from 'react';
import classNames from 'classnames';

type TTotalAssets = {
    category: TAccountCategory;
    className?: string;
};

const TotalAssets = ({ category }: TTotalAssets) => {
    const { client, common } = useStores();
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
    const account_total_balance_currency = category === 'demo' ? vrtc_currency : obj_total_balance.currency;

    React.useEffect(() => {
        const getCurrentExchangeRate = (
            currency: string,
            setExchangeRate: React.Dispatch<React.SetStateAction<number>>
        ) => {
            getExchangeRate(currency, account_total_balance_currency).then((res: number) => {
                setExchangeRate(res);
            });
        };
        if (category === 'real') {
            getCurrentExchangeRate(cfd_real_currency, setExchangedRateCfdReal);
            setTotalAssets(getTotalRealAssets());
        } else if (category === 'demo') {
            getCurrentExchangeRate(vrtc_currency, setExchangedRateDemo);
            setTotalAssets(getTotalDemoAssets());
        } else if (cfd_demo_currency !== account_total_balance_currency) {
            getCurrentExchangeRate(cfd_demo_currency, setExchangedRateCfdDemo);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category]);

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
        ? localize(`Total assets in your Multipliers and DMT5 ${category} accounts`)
        : localize(`Total assets in your Options, DMT5 and Deriv X ${category} accounts`);

    return (
        <div className='total-assets'>
            <Text
                weight='bold'
                size={isMobile() ? 'xsm' : 'm'}
                className={classNames({
                    'total-assets-amount': category === 'demo' && !has_active_real_account,
                    'total-assets-no-amount': category === 'real' && !has_active_real_account,
                    'total-assets-real': category === 'real' && has_active_real_account,
                    'total-assets-demo': category === 'demo' && has_active_real_account,
                })}
            >
                {formatMoney(currency, total_assets, true)}
            </Text>
            <Text
                weight='bold'
                size={isMobile() ? 'xsm' : 'm'}
                color='prominent'
                className={classNames({
                    'total-assets-currency': category === 'demo' && !has_active_real_account,
                    'total-assets-no-currency': category === 'real' && !has_active_real_account,
                    'total-assets-real': category === 'real' && has_active_real_account,
                    'total-assets-demo': category === 'demo' && has_active_real_account,
                })}
            >
                {currency}
            </Text>
            <div>
                <Popover
                    alignment='left'
                    className='total-assets-tooltip'
                    classNameBubble='total-assets-tooltip--msg'
                    icon='info'
                    disable_message_icon
                    is_bubble_hover_enabled
                    message={is_eu_popover_text}
                    zIndex={9999}
                />
            </div>
        </div>
    );
};

export default observer(TotalAssets);
