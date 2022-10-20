import { DetailsOfEachMT5Loginid, Mt5LoginList } from '@deriv/api-types';
import { formatMoney, isMobile } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { observer } from 'mobx-react-lite';
import { Popover, Text } from '@deriv/components';
import { TAccountCategory } from 'Types';
import { useStores } from 'Stores';
import React from 'react';

type TTotalAssets = {
    category: TAccountCategory;
    className?: string;
};

const TotalAssets = ({ category }: TTotalAssets) => {
    const { client, common } = useStores();
    const { account_list, accounts, dxtrade_accounts_list, mt5_login_list, obj_total_balance } = client;
    const { getExchangeRate } = common;

    const [exchanged_rate_cfd_real, setExchangedRateCfdReal] = React.useState(1);
    const [exchanged_rate_demo, setExchangedRateDemo] = React.useState(1);
    const [exchanged_rate_cfd_demo, setExchangedRateCfdDemo] = React.useState(1);

    const isDemo = (account: DetailsOfEachMT5Loginid) => account.account_type === 'demo';

    const cfd_real_currency =
        mt5_login_list.find((mt5_account: DetailsOfEachMT5Loginid) => !isDemo(mt5_account))?.currency ||
        dxtrade_accounts_list.find((mt5_accounts: DetailsOfEachMT5Loginid) => !isDemo(mt5_accounts))?.currency;

    const cfd_demo_currency =
        mt5_login_list.find((mt5_account: DetailsOfEachMT5Loginid) => isDemo(mt5_account))?.currency ||
        dxtrade_accounts_list.find((mt5_account: DetailsOfEachMT5Loginid) => isDemo(mt5_account))?.currency;

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

    const currency = account_total_balance_currency;
    const total_assets = category === 'real' ? getTotalRealAssets() : getTotalDemoAssets();

    return (
        <div className='total-assets'>
            <Text weight='bold' size={isMobile() ? 'xsm' : 'm'} className='total-assets-amount'>
                {formatMoney(currency, total_assets, true)}
            </Text>
            <Text weight='bold' size={isMobile() ? 'xsm' : 'm'} color='prominent' className='total-assets-currency'>
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
                    message={localize(`Total assets in your Options, DMT5 and Deriv X ${category} accounts`)}
                    zIndex={9999}
                />
            </div>
        </div>
    );
};

export default observer(TotalAssets);
