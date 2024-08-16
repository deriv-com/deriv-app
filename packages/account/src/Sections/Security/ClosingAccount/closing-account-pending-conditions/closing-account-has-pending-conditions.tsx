import { Fragment } from 'react';
import { DetailsOfEachMT5Loginid } from '@deriv/api-types';
import { Button, Money, ThemedScrollbars } from '@deriv/components';
import { CFD_PLATFORMS } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv-com/translations';
import { FormatUtils, CurrencyConstants } from '@deriv-com/utils';
import {
    TAccounts,
    TDetailsOfDerivAccount,
    TDetailsOfDerivXAccount,
    TDetailsOfMT5Account,
    TDetailsOfCtraderAccount,
} from '../../../../Types';
import ClosingAccountPendingContent from './closing-account-pending-content';
import ClosingAccountPendingWrapper from './closing-account-pending-wrapper';
import ClosingAccountPendingBalance from './closing-account-pending-balance';
import ClosingAccountPendingPositions from './closing-account-pending-positions';

type TDetails = {
    pending_withdrawals?: Record<string, number>;
    open_positions?: Record<string, number>;
    balance?: Record<string, { balance: number; currency: string }>;
};

type TClosingAccountHasPendingConditionsProps = {
    details: TDetails | null;
    onConfirm: () => void;
};

const getDerivAccount = (client_accounts: TAccounts[], login_id: string) =>
    client_accounts.find(client_account => client_account.loginid === login_id);

const getCurrentMT5Account = (mt5_login_list: DetailsOfEachMT5Loginid[], login_id: string) =>
    mt5_login_list.find(account_obj => account_obj.login === login_id);

const getCurrentDxTradeOrCtraderAccount = (
    accounts_list: Array<TDetailsOfDerivXAccount | TDetailsOfCtraderAccount>,
    login_id: string
) => accounts_list.find(account_obj => account_obj.account_id === login_id);

const ClosingAccountHasPendingConditions = observer(
    ({ details, onConfirm }: TClosingAccountHasPendingConditionsProps) => {
        const { client } = useStore();
        const { dxtrade_accounts_list, mt5_login_list, account_list, ctrader_accounts_list } = client;

        let deriv_open_positions: TDetailsOfDerivAccount[] = [];
        let deriv_balance: TDetailsOfDerivAccount[] = [];
        let account_pending_withdrawals: TDetailsOfDerivAccount[] = [];

        let mt5_open_positions: TDetailsOfMT5Account[] = [];
        let mt5_balance: TDetailsOfMT5Account[] = [];

        let dxtrade_open_positions: TDetailsOfDerivXAccount[] = [];
        let dxtrade_balance: TDetailsOfDerivXAccount[] = [];

        let ctrader_open_positions: TDetailsOfCtraderAccount[] = [];
        let ctrader_balance: TDetailsOfCtraderAccount[] = [];

        if (details?.pending_withdrawals) {
            Object.keys(details.pending_withdrawals).forEach(login_id => {
                const info = {
                    withdrawals: details.pending_withdrawals?.[login_id],
                };
                const deriv_account = getDerivAccount(account_list, login_id);
                if (deriv_account) {
                    account_pending_withdrawals = [...account_pending_withdrawals, { ...deriv_account, ...info }];
                }
            });
        }

        if (details?.open_positions) {
            Object.keys(details.open_positions).forEach(login_id => {
                const info = {
                    positions: details.open_positions?.[login_id],
                };
                const deriv_account = getDerivAccount(account_list, login_id);
                if (deriv_account) {
                    deriv_open_positions = [...deriv_open_positions, { ...deriv_account, ...info }];
                } else {
                    const mt5_account = getCurrentMT5Account(mt5_login_list, login_id);
                    if (mt5_account) {
                        mt5_open_positions = [...mt5_open_positions, { ...mt5_account, ...info }];
                    }

                    const dxtrade_account = getCurrentDxTradeOrCtraderAccount(dxtrade_accounts_list, login_id);
                    if (dxtrade_account) {
                        dxtrade_open_positions = [...dxtrade_open_positions, { ...dxtrade_account, ...info }];
                    }

                    const ctrader_account = getCurrentDxTradeOrCtraderAccount(ctrader_accounts_list, login_id);
                    if (ctrader_account) {
                        ctrader_open_positions = [...ctrader_open_positions, { ...ctrader_account, ...info }];
                    }
                }
            });
        }

        if (details?.balance) {
            Object.keys(details.balance).forEach(login_id => {
                const info = {
                    balance: details.balance?.[login_id].balance,
                    currency: details.balance?.[login_id].currency,
                };
                const deriv_account = getDerivAccount(account_list, login_id);
                if (deriv_account) {
                    deriv_balance = [...deriv_balance, { ...deriv_account, ...info }];
                } else {
                    const mt5_account = getCurrentMT5Account(mt5_login_list, login_id);
                    if (mt5_account) {
                        mt5_balance = [...mt5_balance, { ...mt5_account, ...info }];
                    }

                    const dxtrade_account = getCurrentDxTradeOrCtraderAccount(dxtrade_accounts_list, login_id);
                    if (dxtrade_account) {
                        dxtrade_balance = [...dxtrade_balance, { ...dxtrade_account, ...info }];
                    }

                    const ctrader_account = getCurrentDxTradeOrCtraderAccount(ctrader_accounts_list, login_id);
                    if (ctrader_account) {
                        ctrader_balance = [...ctrader_balance, { ...ctrader_account, ...info }];
                    }
                }
            });
        }

        return (
            <Fragment>
                <ThemedScrollbars autohide={false} width='43rem'>
                    {!!deriv_open_positions.length && (
                        <ClosingAccountPendingWrapper
                            title={
                                <Localize i18n_default_text='Please close your positions in the following Deriv account(s):' />
                            }
                        >
                            {deriv_open_positions.map(account => (
                                <ClosingAccountPendingContent
                                    key={account.loginid}
                                    currency_icon={`IcCurrency-${account.icon}`}
                                    loginid={account.loginid}
                                    title={account.title}
                                    value={
                                        <Localize
                                            i18n_default_text='{{number_of_positions}} position(s)'
                                            values={{ number_of_positions: account.positions }}
                                        />
                                    }
                                />
                            ))}
                        </ClosingAccountPendingWrapper>
                    )}
                    {!!deriv_balance.length && (
                        <ClosingAccountPendingWrapper
                            title={
                                <Localize i18n_default_text='Please withdraw your funds from the following Deriv account(s):' />
                            }
                        >
                            {deriv_balance.map(account => (
                                <ClosingAccountPendingContent
                                    key={account.loginid}
                                    currency_icon={`IcCurrency-${account.icon}`}
                                    loginid={account.loginid}
                                    title={account.title}
                                    value={
                                        account.currency && (
                                            <Money
                                                currency={account.currency}
                                                amount={FormatUtils.formatMoney(account.balance ?? 0, {
                                                    currency: account.currency as CurrencyConstants.Currency,
                                                })}
                                                should_format={false}
                                            />
                                        )
                                    }
                                />
                            ))}
                        </ClosingAccountPendingWrapper>
                    )}
                    {!!mt5_open_positions.length && (
                        <ClosingAccountPendingPositions
                            platform={CFD_PLATFORMS.MT5}
                            open_positions={mt5_open_positions}
                        />
                    )}

                    {!!mt5_balance.length && (
                        <ClosingAccountPendingBalance platform={CFD_PLATFORMS.MT5} account_balance={mt5_balance} />
                    )}
                    {!!dxtrade_open_positions.length && (
                        <ClosingAccountPendingPositions
                            platform={CFD_PLATFORMS.DXTRADE}
                            open_positions={dxtrade_open_positions}
                        />
                    )}
                    {!!dxtrade_balance.length && (
                        <ClosingAccountPendingBalance
                            platform={CFD_PLATFORMS.DXTRADE}
                            account_balance={dxtrade_balance}
                        />
                    )}
                    {!!ctrader_open_positions.length && (
                        <ClosingAccountPendingPositions
                            platform={CFD_PLATFORMS.CTRADER}
                            open_positions={ctrader_open_positions}
                        />
                    )}
                    {!!ctrader_balance.length && (
                        <ClosingAccountPendingBalance
                            platform={CFD_PLATFORMS.CTRADER}
                            account_balance={ctrader_balance}
                        />
                    )}
                    {!!account_pending_withdrawals.length && (
                        <ClosingAccountPendingWrapper
                            title={<Localize i18n_default_text='Pending withdrawal request:' />}
                            description={
                                <Localize
                                    i18n_default_text='We are still processing your withdrawal request.<0 />Please wait for the transaction to be completed before deactivating your account.'
                                    components={[<br key={0} />]}
                                />
                            }
                        >
                            {account_pending_withdrawals.map(account => (
                                <ClosingAccountPendingContent
                                    key={account.loginid}
                                    currency_icon={`IcCurrency-${account.icon}`}
                                    loginid={account.loginid}
                                    title={account.title}
                                    value={
                                        <Localize
                                            i18n_default_text='{{pending_withdrawals}} pending withdrawal(s)'
                                            values={{ pending_withdrawals: account.withdrawals }}
                                        />
                                    }
                                />
                            ))}
                        </ClosingAccountPendingWrapper>
                    )}
                </ThemedScrollbars>
                <div>
                    <Button className='closing-account-error__button' primary onClick={onConfirm}>
                        <Localize i18n_default_text='OK' />
                    </Button>
                </div>
            </Fragment>
        );
    }
);

export default ClosingAccountHasPendingConditions;
