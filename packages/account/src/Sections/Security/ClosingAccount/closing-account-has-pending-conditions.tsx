import React from 'react';
import { Button, Icon, Money, Text, ThemedScrollbars } from '@deriv/components';
import { CFD_PLATFORMS, formatMoney, getCFDAccount, getCFDAccountDisplay } from '@deriv/shared';
import { DetailsOfEachMT5Loginid } from '@deriv/api-types';
import { localize, Localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import { TAccounts } from 'Types';

type TPendingAccountDetails = {
    balance?: number;
    currency?: string;
    display_login?: string;
    positions?: number;
    withdrawals?: number;
};

type TDetailsOfDerivAccount = TAccounts & TPendingAccountDetails;
type TDetailsOfMT5Account = DetailsOfEachMT5Loginid & TPendingAccountDetails;
type TDetailsOfDerivXAccount = TDetailsOfMT5Account & { account_id?: string };

type TWrapperProps = {
    children: React.ReactNode;
    title: string;
    desc?: React.ReactNode;
};

type TContentProps = {
    currency_icon: string;
    loginid?: string;
    title?: string;
    value: React.ReactNode;
};

type TClosingAccountHasPendingConditionsProps = {
    details?: {
        pending_withdrawals?: Record<string, number>;
        open_positions?: Record<string, number>;
        balance?: Record<string, { balance: number; currency: string }>;
    };
    onBackClick: () => void;
};

const Wrapper = ({ children, title, desc }: TWrapperProps) => (
    <div className='closing-account-error'>
        <Text as='p' line_height='s' size='xs' weight='bold' color='prominent' className='closing-account-error__title'>
            {title}
        </Text>
        {desc && (
            <Text as='p' size='xxs' className='closing-account-error__description'>
                {desc}
            </Text>
        )}
        <div className='closing-account-error__wrapper'>{children}</div>
    </div>
);

const Content = ({ currency_icon, loginid, title, value }: TContentProps) => (
    <div className='closing-account-error__container'>
        <div className='closing-account-error__account-details'>
            <Icon icon={currency_icon} size={24} />
            <div className='closing-account-error__account'>
                <Text line_height='s' color='prominent' size='xs'>
                    {title}
                </Text>
                <Text color='prominent' size='xxxs' line_height='xs'>
                    {loginid}
                </Text>
            </div>
        </div>
        <Text className='closing-account-error__details' color='prominent' size='xs' line_height='s' align='right'>
            {value}
        </Text>
    </div>
);

const getDerivAccount = (client_accounts: TAccounts[], login_id: string) =>
    client_accounts.find(client_account => client_account.loginid === login_id);

const getCurrMT5Account = (mt5_login_list: DetailsOfEachMT5Loginid[], login_id: string) =>
    mt5_login_list.find(account_obj => account_obj.login === login_id);

const getCurrDxtradeAccount = (dxtrade_accounts_list: TDetailsOfDerivXAccount[], login_id: string) =>
    dxtrade_accounts_list.find(account_obj => account_obj.account_id === login_id);

const ClosingAccountHasPendingConditions = observer(
    ({ details, onBackClick }: TClosingAccountHasPendingConditionsProps) => {
        const { client } = useStore();
        const { dxtrade_accounts_list, mt5_login_list, account_list, is_eu } = client;

        const deriv_open_positions: TDetailsOfDerivAccount[] = [];
        const deriv_balance: TDetailsOfDerivAccount[] = [];
        const account_pending_withdrawals: TDetailsOfDerivAccount[] = [];

        const mt5_open_positions: TDetailsOfMT5Account[] = [];
        const mt5_balance: TDetailsOfMT5Account[] = [];

        const dxtrade_open_positions: TDetailsOfDerivXAccount[] = [];
        const dxtrade_balance: TDetailsOfDerivXAccount[] = [];

        if (details?.pending_withdrawals) {
            Object.keys(details.pending_withdrawals).forEach(login_id => {
                const info = {
                    withdrawals: details.pending_withdrawals?.[login_id],
                };
                const deriv_account = getDerivAccount(account_list, login_id);
                if (deriv_account) {
                    account_pending_withdrawals.push({ ...deriv_account, ...info });
                }
            });
        }
        if (details?.open_positions) {
            Object.keys(details?.open_positions).forEach(login_id => {
                const info = {
                    positions: details.open_positions?.[login_id],
                };
                const deriv_account = getDerivAccount(account_list, login_id);
                if (deriv_account) {
                    deriv_open_positions.push({ ...deriv_account, ...info });
                } else {
                    const mt5_account = getCurrMT5Account(mt5_login_list, login_id);
                    if (mt5_account) {
                        mt5_open_positions.push({ ...mt5_account, ...info });
                    }

                    const dxtrade_account = getCurrDxtradeAccount(dxtrade_accounts_list, login_id);
                    if (dxtrade_account) {
                        dxtrade_open_positions.push({ ...dxtrade_account, ...info });
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
                    deriv_balance.push({ ...deriv_account, ...info });
                } else {
                    const mt5_account = getCurrMT5Account(mt5_login_list, login_id);
                    if (mt5_account) {
                        mt5_balance.push({ ...mt5_account, ...info });
                    }

                    const dxtrade_account = getCurrDxtradeAccount(dxtrade_accounts_list, login_id);
                    if (dxtrade_account) {
                        dxtrade_balance.push({ ...dxtrade_account, ...info });
                    }
                }
            });
        }
        return (
            <React.Fragment>
                <ThemedScrollbars autohide={false} width='43rem'>
                    {!!deriv_open_positions.length && (
                        <Wrapper title={localize('Please close your positions in the following Deriv account(s):')}>
                            {deriv_open_positions.map(account => (
                                <Content
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
                        </Wrapper>
                    )}
                    {!!deriv_balance.length && (
                        <Wrapper title={localize('Please withdraw your funds from the following Deriv account(s):')}>
                            {deriv_balance.map(account => (
                                <Content
                                    key={account.loginid}
                                    currency_icon={`IcCurrency-${account.icon}`}
                                    loginid={account.loginid}
                                    title={account.title}
                                    value={
                                        account.currency && (
                                            <Money
                                                currency={account.currency}
                                                amount={formatMoney(account.currency, account.balance ?? 0, true)}
                                                should_format={false}
                                            />
                                        )
                                    }
                                />
                            ))}
                        </Wrapper>
                    )}
                    {!!mt5_open_positions.length && (
                        <Wrapper title={localize('Please close your positions in the following Deriv MT5 account(s):')}>
                            {mt5_open_positions.map(account => (
                                <Content
                                    key={account.login}
                                    currency_icon={`IcMt5-${getCFDAccount({
                                        market_type: account.market_type,
                                        sub_account_type: account.sub_account_type,
                                        platform: CFD_PLATFORMS.MT5,
                                        is_eu,
                                    })}`}
                                    loginid={account.display_login}
                                    title={
                                        getCFDAccountDisplay({
                                            market_type: account.market_type,
                                            sub_account_type: account.sub_account_type,
                                            platform: CFD_PLATFORMS.MT5,
                                            is_eu,
                                        }) ?? ''
                                    }
                                    value={
                                        <Localize
                                            i18n_default_text='{{number_of_positions}} position(s)'
                                            values={{ number_of_positions: account.positions }}
                                        />
                                    }
                                />
                            ))}
                        </Wrapper>
                    )}
                    {!!mt5_balance.length && (
                        <Wrapper
                            title={localize('Please withdraw your funds from the following Deriv MT5 account(s):')}
                        >
                            {mt5_balance.map(account => (
                                <Content
                                    key={account.login}
                                    currency_icon={`IcMt5-${getCFDAccount({
                                        market_type: account.market_type,
                                        sub_account_type: account.sub_account_type,
                                        platform: CFD_PLATFORMS.MT5,
                                        is_eu,
                                    })}`}
                                    loginid={account.display_login}
                                    title={
                                        getCFDAccountDisplay({
                                            market_type: account.market_type,
                                            sub_account_type: account.sub_account_type,
                                            platform: CFD_PLATFORMS.MT5,
                                            is_eu,
                                        }) ?? ''
                                    }
                                    value={
                                        account.currency && (
                                            <Money
                                                currency={account.currency}
                                                amount={formatMoney(account.currency, account.balance ?? 0, true)}
                                                should_format={false}
                                            />
                                        )
                                    }
                                />
                            ))}
                        </Wrapper>
                    )}
                    {!!dxtrade_open_positions.length && (
                        <Wrapper title={localize('Please close your positions in the following Deriv X account(s):')}>
                            {dxtrade_open_positions.map(account => (
                                <Content
                                    key={account.login}
                                    currency_icon={`IcDxtrade-${getCFDAccount({
                                        market_type: account.market_type,
                                        sub_account_type: account.sub_account_type,
                                        platform: CFD_PLATFORMS.DXTRADE,
                                        is_eu,
                                    })}`}
                                    loginid={account.display_login}
                                    title={
                                        getCFDAccountDisplay({
                                            market_type: account.market_type,
                                            sub_account_type: account.sub_account_type,
                                            platform: CFD_PLATFORMS.DXTRADE,
                                            is_eu,
                                        }) ?? ''
                                    }
                                    value={
                                        <Localize
                                            i18n_default_text='{{number_of_positions}} position(s)'
                                            values={{ number_of_positions: account.positions }}
                                        />
                                    }
                                />
                            ))}
                        </Wrapper>
                    )}
                    {!!dxtrade_balance.length && (
                        <Wrapper title={localize('Please withdraw your funds from the following Deriv X account(s):')}>
                            {dxtrade_balance.map(account => (
                                <Content
                                    key={account.login}
                                    currency_icon={`IcDxtrade-${getCFDAccount({
                                        market_type: account.market_type,
                                        sub_account_type: account.sub_account_type,
                                        platform: CFD_PLATFORMS.DXTRADE,
                                        is_eu,
                                    })}`}
                                    loginid={account.display_login}
                                    title={
                                        getCFDAccountDisplay({
                                            market_type: account.market_type,
                                            sub_account_type: account.sub_account_type,
                                            platform: CFD_PLATFORMS.DXTRADE,
                                            is_eu,
                                        }) ?? ''
                                    }
                                    value={
                                        account.currency && (
                                            <Money
                                                currency={account.currency}
                                                amount={formatMoney(account.currency, account.balance ?? 0, true)}
                                                should_format={false}
                                            />
                                        )
                                    }
                                />
                            ))}
                        </Wrapper>
                    )}
                    {!!account_pending_withdrawals.length && (
                        <Wrapper
                            title={localize('Pending withdrawal request:')}
                            desc={
                                <Localize
                                    i18n_default_text='We are still processing your withdrawal request.<0 />Please wait for the transaction to be completed before deactivating your account.'
                                    components={[<br key={0} />]}
                                />
                            }
                        >
                            {account_pending_withdrawals.map(account => (
                                <Content
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
                        </Wrapper>
                    )}
                </ThemedScrollbars>
                <div>
                    <Button className='closing-account-error__button' primary onClick={onBackClick}>
                        {localize('OK')}
                    </Button>
                </div>
            </React.Fragment>
        );
    }
);

export default ClosingAccountHasPendingConditions;
