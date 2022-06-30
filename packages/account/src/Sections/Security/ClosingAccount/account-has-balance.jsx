import React from 'react';
import { Button, Icon, Money, ThemedScrollbars, Text } from '@deriv/components';
import { formatMoney, getCFDAccount, getCFDAccountDisplay, CFD_PLATFORMS } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';

const getDerivAccount = (client_accounts, login_id) =>
    client_accounts.find(client_account => client_account.loginid === login_id);

const getCurrMT5Account = (mt5_login_list, login_id) =>
    mt5_login_list.find(account_obj => account_obj.login === login_id);

const getCurrDxtradeAccount = (dxtrade_accounts_list, login_id) =>
    dxtrade_accounts_list.find(account_obj => account_obj.account_id === login_id);

const Wrapper = ({ children, title, desc }) => (
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

const Content = ({ currency_icon, loginid, title, value }) => (
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

const AccountHasPendingConditions = ({
    details,
    mt5_login_list,
    dxtrade_accounts_list,
    client_accounts,
    onBackClick,
    is_eu,
}) => {
    const deriv_open_positions = [];
    const deriv_balance = [];
    const mt5_open_positions = [];
    const mt5_balance = [];
    const account_pending_withdrawals = [];
    const dxtrade_open_positions = [];
    const dxtrade_balance = [];

    if (details.pending_withdrawals) {
        Object.keys(details.pending_withdrawals).forEach(login_id => {
            const info = {
                withdrawals: details.pending_withdrawals[login_id],
            };
            const deriv_account = getDerivAccount(client_accounts, login_id);
            if (deriv_account) {
                account_pending_withdrawals.push({ ...deriv_account, ...info });
            }
        });
    }
    if (details.open_positions) {
        Object.keys(details.open_positions).forEach(login_id => {
            const info = {
                positions: details.open_positions[login_id],
            };
            const deriv_account = getDerivAccount(client_accounts, login_id);
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
    if (details.balance) {
        Object.keys(details.balance).forEach(login_id => {
            const info = {
                balance: details.balance[login_id].balance,
                currency: details.balance[login_id].currency,
            };
            const deriv_account = getDerivAccount(client_accounts, login_id);
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
                                    <Money
                                        currency={account.currency}
                                        amount={formatMoney(account.currency, account.balance, true)}
                                        should_format={false}
                                    />
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
                                title={getCFDAccountDisplay({
                                    market_type: account.market_type,
                                    sub_account_type: account.sub_account_type,
                                    platform: CFD_PLATFORMS.MT5,
                                    is_eu,
                                })}
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
                    <Wrapper title={localize('Please withdraw your funds from the following Deriv MT5 account(s):')}>
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
                                title={getCFDAccountDisplay({
                                    market_type: account.market_type,
                                    sub_account_type: account.sub_account_type,
                                    platform: CFD_PLATFORMS.MT5,
                                    is_eu,
                                })}
                                value={
                                    <Money
                                        currency={account.currency}
                                        amount={formatMoney(account.currency, account.balance, true)}
                                        should_format={false}
                                    />
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
                                title={getCFDAccountDisplay({
                                    market_type: account.market_type,
                                    sub_account_type: account.sub_account_type,
                                    platform: CFD_PLATFORMS.DXTRADE,
                                    is_eu,
                                })}
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
                                title={getCFDAccountDisplay({
                                    market_type: account.market_type,
                                    sub_account_type: account.sub_account_type,
                                    platform: CFD_PLATFORMS.DXTRADE,
                                    is_eu,
                                })}
                                value={
                                    <Money
                                        currency={account.currency}
                                        amount={formatMoney(account.currency, account.balance, true)}
                                        should_format={false}
                                    />
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
};

export default AccountHasPendingConditions;
