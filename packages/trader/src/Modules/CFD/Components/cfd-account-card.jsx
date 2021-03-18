import classNames from 'classnames';
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { Icon, Money, Button, Text, DesktopWrapper, MobileWrapper, Input } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { CFDAccountCopy } from './cfd-account-copy.jsx';
import { getDXTradeWebTerminalLink, getMT5WebTerminalLink } from '../Helpers/constants';

const account_icons = {
    mt5: {
        synthetic: 'IcMt5SyntheticPlatform',
        financial: 'IcMt5FinancialPlatform',
        financial_stp: 'IcMt5FinancialStpPlatform',
    },
    dxtrade: {
        synthetic: 'IcDxtradeSyntheticPlatform',
        financial: 'IcDxtradeFinancialPlatform',
    },
};

const AddTradeServerButton = React.forwardRef(({ onSelectAccount, is_disabled }, ref) => {
    return (
        <div
            onClick={is_disabled ? null : onSelectAccount}
            className={classNames('cfd-account-card__add-server', {
                'cfd-account-card__add-server--disabled': is_disabled,
            })}
            ref={ref}
        >
            <span className='cfd-account-card__add-server--icon'>+</span>
            <Localize i18n_default_text='Add more trade servers' />
        </div>
    );
});

AddTradeServerButton.displayName = 'AddTradeServerButton';

const LoginBadge = ({ login, display_login, platform }) =>
    platform === 'mt5' ? (
        <div className='cfd-account-card__login'>
            <Localize
                i18n_default_text='<0>Account login no.</0><1>{{display_login}}</1>'
                values={{
                    display_login,
                }}
                components={[<span key={0} />, <strong key={1} />]}
            />
            <CFDAccountCopy text={display_login} />
        </div>
    ) : (
        <div className='cfd-account-card__login-input-wrapper'>
            <div className='cfd-account-card__login-input'>
                <Text size='xs'>{localize('Username')}</Text>
                <Input value={login} disabled trailing_icon={<CFDAccountCopy text={login} />} />
            </div>
            <div className='cfd-account-card__login-input'>
                <Text size='xs'>{localize('Account ID')}</Text>
                <Input value={display_login} disabled trailing_icon={<CFDAccountCopy text={display_login} />} />
            </div>
        </div>
    );

const CFDAccountCardAction = ({
    button_label,
    handleClickSwitchAccount,
    has_real_account,
    is_accounts_switcher_on,
    is_button_primary,
    is_disabled,
    is_virtual,
    onSelectAccount,
    type,
}) => {
    if (
        is_virtual &&
        has_real_account &&
        type.category === 'real' &&
        type.type === 'financial_stp' &&
        typeof handleClickSwitchAccount === 'function'
    ) {
        return (
            <div className='cfd-account-card__action-wrapper'>
                <Localize
                    i18n_default_text='<0>Switch to your real account</0><1> to create a DMT5 Financial STP account.</1>'
                    components={[
                        <a
                            className={classNames('cfd-account-card__action-wrapper__link link link--orange', {
                                'cfd-account-card__action-wrapper__link--disabled': is_accounts_switcher_on,
                            })}
                            key={0}
                            onClick={handleClickSwitchAccount}
                        />,
                        <Text key={1} line_height='s' size='xxs' />,
                    ]}
                />
            </div>
        );
    }
    const lbl_add_account =
        type.category === 'real' ? (
            <Localize i18n_default_text='Add real account' />
        ) : (
            <Localize i18n_default_text='Add demo account' />
        );
    const cta_label = button_label || lbl_add_account;
    return (
        <Button
            className='cfd-account-card__account-selection'
            onClick={onSelectAccount}
            type='button'
            is_disabled={is_disabled}
            primary={is_button_primary}
            secondary={!is_button_primary}
            large
        >
            {cta_label}
        </Button>
    );
};

const CFDAccountCard = ({
    button_label,
    commission_message,
    descriptor,
    is_hovered,
    existing_data,
    has_banner,
    has_cfd_account,
    has_mt5_account_error,
    has_real_account,
    is_accounts_switcher_on,
    is_button_primary,
    is_disabled,
    is_logged_in,
    is_virtual,
    onHover,
    platform,
    specs,
    title,
    type,
    onSelectAccount,
    onClickFund,
    onPasswordManager,
    should_show_trade_servers,
    is_trade_server_button_visible,
    toggleAccountsDialog,
    toggleShouldShowRealAccountsList,
    trading_servers,
}) => {
    const icon = type.type ? <Icon icon={account_icons[type.platform][type.type]} size={64} /> : null;
    const has_popular_banner = type.type === 'synthetic' && type.category === 'real' && !existing_data;
    const has_demo_banner = type.category === 'demo';
    const has_server_banner =
        is_logged_in &&
        existing_data &&
        type.category === 'real' &&
        type.type === 'synthetic' &&
        trading_servers.some(server => server.id === existing_data.server);

    const ref = React.useRef();
    const wrapper_ref = React.useRef();
    const button_ref = React.useRef();

    React.useEffect(() => {
        if (existing_data) {
            const show = () => {
                onHover?.(existing_data.group);
            };

            ref.current.addEventListener('mouseenter', show);
            button_ref?.current?.addEventListener('mouseenter', show);

            return () => {
                ref.current.removeEventListener('mouseenter', show);
                button_ref?.current?.removeEventListener('mouseenter', () => show);
            };
        }
        return () => {};
    }, [onHover]);

    const getServerName = React.useCallback(
        data => {
            const server = trading_servers?.find(s => s.id === data.server);
            if (server) {
                return `${server.geolocation.region} ${
                    server.geolocation.sequence === 1 ? '' : server.geolocation.sequence
                }`;
            }

            return '';
        },
        [existing_data, trading_servers]
    );

    const handleClickSwitchAccount = () => {
        toggleShouldShowRealAccountsList(true);
        toggleAccountsDialog(true);
    };

    const is_web_terminal_unsupported = isMobile() && platform === 'dxtrade';

    return (
        <div
            ref={wrapper_ref}
            className={classNames('cfd-account-card__wrapper', {
                'cfd-account-card__wrapper-shrinked':
                    is_trade_server_button_visible &&
                    type.category === 'real' &&
                    (!should_show_trade_servers || !is_hovered),
            })}
        >
            <div
                className={classNames('cfd-account-card', { 'cfd-account-card__logged-out': !is_logged_in })}
                ref={ref}
            >
                {has_popular_banner && (
                    <div className='cfd-account-card__banner'>
                        <Localize i18n_default_text='Most popular' />
                    </div>
                )}
                {has_demo_banner && (
                    <div className='cfd-account-card__banner cfd-account-card__banner--demo'>
                        <Localize i18n_default_text='DEMO' />
                    </div>
                )}
                {has_server_banner && (
                    <div className='cfd-account-card__banner cfd-account-card__banner--server'>
                        {getServerName(existing_data)}
                    </div>
                )}
                <div
                    className='cfd-account-card__type'
                    id={`${platform === 'dxtrade' ? 'dxtrade' : 'mt5'}_${type.category}_${type.type}`}
                >
                    {icon}
                    <div className='cfd-account-card__type--description'>
                        <h1 className='cfd-account-card--heading'>{title}</h1>
                        {(!existing_data || !is_logged_in) && (
                            <p
                                className={classNames('cfd-account-card--paragraph', {
                                    'cfd-account-card--paragraph-has-banner':
                                        has_banner || has_popular_banner || has_server_banner,
                                })}
                            >
                                {descriptor}
                            </p>
                        )}
                        {existing_data && existing_data.display_balance && is_logged_in && (
                            <p className='cfd-account-card--balance'>
                                <Money
                                    amount={existing_data.display_balance}
                                    currency={existing_data.currency}
                                    has_sign={existing_data.balance < 0}
                                    show_currency
                                />
                            </p>
                        )}
                    </div>
                </div>

                <div className='cfd-account-card__cta'>
                    <div className='cfd-account-card__specs'>
                        <table className='cfd-account-card__specs-table'>
                            <tbody>
                                {Object.keys(specs || {}).map((spec_attribute, idx) => (
                                    <tr key={idx} className='cfd-account-card__specs-table-row'>
                                        <td className='cfd-account-card__specs-table-attribute'>
                                            <p className='cfd-account-card--paragraph'>{spec_attribute}</p>
                                        </td>
                                        <td className='cfd-account-card__specs-table-data'>
                                            <p className='cfd-account-card--paragraph'>{specs[spec_attribute]}</p>
                                        </td>
                                    </tr>
                                ))}
                                {has_server_banner &&
                                    existing_data &&
                                    type.type === 'synthetic' &&
                                    type.category === 'real' && (
                                        <tr key={existing_data.server} className='cfd-account-card__specs-table-row'>
                                            <td className='cfd-account-card__specs-table-attribute'>
                                                <p className='cfd-account-card--paragraph'>
                                                    <Localize i18n_default_text='Trade server: ' />
                                                </p>
                                            </td>
                                            <td className='cfd-account-card__specs-table-data'>
                                                <p className='cfd-account-card--paragraph'>
                                                    {getServerName(existing_data)}
                                                </p>
                                            </td>
                                        </tr>
                                    )}
                            </tbody>
                        </table>
                    </div>

                    {existing_data?.login && is_logged_in && (
                        <LoginBadge
                            login={existing_data.login}
                            display_login={existing_data.display_login}
                            platform={type.platform}
                        />
                    )}

                    {((!existing_data && commission_message) || !is_logged_in) && (
                        <div className='cfd-account-card__commission'>
                            <Text as='p' color='general' size='xs' styles={{ margin: '1.6rem auto' }}>
                                {commission_message}
                            </Text>
                        </div>
                    )}
                    {existing_data && is_logged_in && (
                        <div className='cfd-account-card__manage'>
                            <Button onClick={() => onClickFund(existing_data)} type='button' secondary>
                                {type.category === 'real' && <Localize i18n_default_text='Fund transfer' />}
                                {type.category === 'demo' && <Localize i18n_default_text='Fund top up' />}
                            </Button>
                            <Button
                                onClick={() => {
                                    onPasswordManager(
                                        existing_data.login,
                                        title,
                                        type.category,
                                        type.type,
                                        existing_data.server
                                    );
                                }}
                                type='button'
                                secondary
                            >
                                <Localize i18n_default_text='Password' />
                            </Button>
                        </div>
                    )}
                    {!existing_data && has_cfd_account && (
                        <Button className='cfd-account-card__account-selection' onClick={onSelectAccount} type='button'>
                            <Localize i18n_default_text='Select' />
                        </Button>
                    )}
                    {existing_data && is_logged_in && !is_web_terminal_unsupported && (
                        <a
                            className='dc-btn cfd-account-card__account-selection cfd-account-card__account-selection--primary'
                            type='button'
                            href={
                                platform === 'dxtrade'
                                    ? getDXTradeWebTerminalLink()
                                    : getMT5WebTerminalLink({
                                          category: type.category,
                                          loginid: existing_data.display_login,
                                      })
                            }
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            <Localize i18n_default_text='Trade on web terminal' />
                        </a>
                    )}
                    {!existing_data && !has_cfd_account && is_logged_in && (
                        <CFDAccountCardAction
                            button_label={button_label}
                            handleClickSwitchAccount={handleClickSwitchAccount}
                            has_real_account={has_real_account}
                            is_accounts_switcher_on={is_accounts_switcher_on}
                            is_button_primary={is_button_primary}
                            is_disabled={is_disabled}
                            is_virtual={is_virtual}
                            onSelectAccount={onSelectAccount}
                            type={type}
                        />
                    )}
                </div>
                <React.Fragment>
                    {should_show_trade_servers && (
                        <MobileWrapper>
                            <AddTradeServerButton
                                ref={button_ref}
                                onSelectAccount={onSelectAccount}
                                is_disabled={has_mt5_account_error}
                            />
                        </MobileWrapper>
                    )}
                </React.Fragment>
            </div>
            <DesktopWrapper>
                <CSSTransition
                    in={is_hovered && should_show_trade_servers}
                    timeout={0}
                    classNames='cfd-account-card__add-server'
                    unmountOnExit
                >
                    <AddTradeServerButton
                        ref={button_ref}
                        onSelectAccount={onSelectAccount}
                        is_disabled={has_mt5_account_error}
                    />
                </CSSTransition>
            </DesktopWrapper>
        </div>
    );
};

export { CFDAccountCard };
