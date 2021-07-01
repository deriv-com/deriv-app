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

const Wrapper = ({ children, title }) => (
    <div className='deactivate-account-error'>
        <Text
            as='p'
            line_height='s'
            size='xs'
            weight='bold'
            color='prominent'
            className='deactivate-account-error__title'
        >
            {title}
        </Text>
        {children}
    </div>
);

const Content = ({ currency_icon, loginid, title, value }) => (
    <div className='deactivate-account-error__container'>
        <div className='deactivate-account-error__account-details'>
            <Icon icon={currency_icon} size={24} />
            <div className='deactivate-account-error__account'>
                <Text line_height='s' color='prominent' size='xs'>
                    {title}
                </Text>
                <Text color='prominent' size='xxxs' line_height='xs'>
                    {loginid}
                </Text>
            </div>
        </div>
        <div className='deactivate-account-error__details'>{value}</div>
    </div>
);

const AccountHasBalanceOrOpenPositions = ({
    details,
    mt5_login_list,
    dxtrade_accounts_list,
    client_accounts,
    onBackClick,
}) => {
    const deriv_open_positions = [];
    const deriv_balance = [];
    const mt5_open_positions = [];
    const mt5_balance = [];
    const dxtrade_open_positions = [];
    const dxtrade_balance = [];

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
            <ThemedScrollbars autohide={false}>
                {!!deriv_open_positions.length && (
                    <Wrapper title={localize('You have open positions in these Deriv accounts:')}>
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
                    <Wrapper title={localize('You have funds in these Deriv accounts:')}>
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
                    <Wrapper title={localize('You have open positions in these DMT5 accounts:')}>
                        {mt5_open_positions.map(account => (
                            <Content
                                key={account.login}
                                currency_icon={`IcMt5-${getCFDAccount({
                                    market_type: account.market_type,
                                    sub_account_type: account.sub_account_type,
                                    platform: CFD_PLATFORMS.MT5,
                                })}`}
                                loginid={account.display_login}
                                title={getCFDAccountDisplay({
                                    market_type: account.market_type,
                                    sub_account_type: account.sub_account_type,
                                    platform: CFD_PLATFORMS.MT5,
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
                    <Wrapper title={localize('You have funds in these DMT5 accounts:')}>
                        {mt5_balance.map(account => (
                            <Content
                                key={account.login}
                                currency_icon={`IcMt5-${getCFDAccount({
                                    market_type: account.market_type,
                                    sub_account_type: account.sub_account_type,
                                    platform: CFD_PLATFORMS.MT5,
                                })}`}
                                loginid={account.display_login}
                                title={getCFDAccountDisplay({
                                    market_type: account.market_type,
                                    sub_account_type: account.sub_account_type,
                                    platform: CFD_PLATFORMS.MT5,
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
                    <Wrapper title={localize('You have open positions in these Deriv X accounts:')}>
                        {dxtrade_open_positions.map(account => (
                            <Content
                                key={account.login}
                                currency_icon={`IcDxtrade-${getCFDAccount({
                                    market_type: account.market_type,
                                    sub_account_type: account.sub_account_type,
                                    platform: CFD_PLATFORMS.DXTRADE,
                                })}`}
                                loginid={account.display_login}
                                title={getCFDAccountDisplay({
                                    market_type: account.market_type,
                                    sub_account_type: account.sub_account_type,
                                    platform: CFD_PLATFORMS.DXTRADE,
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
                    <Wrapper title={localize('You have funds in these Deriv X accounts:')}>
                        {dxtrade_balance.map(account => (
                            <Content
                                key={account.login}
                                currency_icon={`IcDxtrade-${getCFDAccount({
                                    market_type: account.market_type,
                                    sub_account_type: account.sub_account_type,
                                    platform: CFD_PLATFORMS.DXTRADE,
                                })}`}
                                loginid={account.display_login}
                                title={getCFDAccountDisplay({
                                    market_type: account.market_type,
                                    sub_account_type: account.sub_account_type,
                                    platform: CFD_PLATFORMS.DXTRADE,
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
            </ThemedScrollbars>
            <div>
                <Button className='deactivate-account-error__button' primary onClick={onBackClick}>
                    {localize('OK')}
                </Button>
            </div>
        </React.Fragment>
    );
};

export default AccountHasBalanceOrOpenPositions;
