import classNames from 'classnames';
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { Icon, Money, Button, Text, DesktopWrapper, MobileWrapper } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { Mt5AccountCopy } from './mt5-account-copy.jsx';
import { getMT5WebTerminalLink } from '../Helpers/constants';

const account_icons = {
    synthetic: 'IcMt5SyntheticPlatform',
    financial: 'IcMt5FinancialPlatform',
    financial_stp: 'IcMt5FinancialStpPlatform',
};

const AddTradeServerButton = React.forwardRef(({ onSelectAccount, is_disabled }, ref) => {
    return (
        <div
            onClick={is_disabled ? null : onSelectAccount}
            className={classNames('mt5-account-card__add-server', {
                'mt5-account-card__add-server--disabled': is_disabled,
            })}
            ref={ref}
        >
            <span className='mt5-account-card__add-server--icon'>+</span>
            <Localize i18n_default_text='Add more trade servers' />
        </div>
    );
});

AddTradeServerButton.displayName = 'AddTradeServerButton';

const LoginBadge = ({ display_login }) => (
    <div className='mt5-account-card__login'>
        <Localize
            i18n_default_text='<0>Account login no.</0><1>{{display_login}}</1>'
            values={{
                display_login,
            }}
            components={[<span key={0} />, <strong key={1} />]}
        />
        <Mt5AccountCopy text={display_login} />
    </div>
);

const MT5AccountCardAction = ({
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
            <div className='mt5-account-card__action-wrapper'>
                <Localize
                    i18n_default_text='<0>Switch to your real account</0><1> to create a DMT5 Financial STP account.</1>'
                    components={[
                        <a
                            className={classNames('mt5-account-card__action-wrapper__link link link--orange', {
                                'mt5-account-card__action-wrapper__link--disabled': is_accounts_switcher_on,
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
            className='mt5-account-card__account-selection'
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

const MT5AccountCard = ({
    button_label,
    commission_message,
    descriptor,
    is_hovered,
    existing_data,
    has_mt5_account,
    has_mt5_account_error,
    has_real_account,
    is_accounts_switcher_on,
    is_button_primary,
    is_disabled,
    is_logged_in,
    is_virtual,
    onHover,
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
    const icon = type.type ? <Icon icon={account_icons[type.type]} size={64} /> : null;
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

    return (
        <div
            ref={wrapper_ref}
            className={classNames('mt5-account-card__wrapper', {
                'mt5-account-card__wrapper-shrinked':
                    is_trade_server_button_visible &&
                    type.category === 'real' &&
                    (!should_show_trade_servers || !is_hovered),
            })}
        >
            <div
                className={classNames('mt5-account-card', { 'mt5-account-card__logged-out': !is_logged_in })}
                ref={ref}
            >
                {has_popular_banner && (
                    <div className='mt5-account-card__banner'>
                        <Localize i18n_default_text='Most popular' />
                    </div>
                )}
                {has_demo_banner && (
                    <div className='mt5-account-card__banner mt5-account-card__banner--demo'>
                        <Localize i18n_default_text='DEMO' />
                    </div>
                )}
                {has_server_banner && (
                    <div className='mt5-account-card__banner mt5-account-card__banner--server'>
                        {getServerName(existing_data)}
                    </div>
                )}
                <div
                    className={classNames('mt5-account-card__type', {
                        'mt5-account-card__type--has-banner': has_popular_banner || has_demo_banner,
                    })}
                    id={`mt5_${type.category}_${type.type}`}
                >
                    {icon}
                    <div className='mt5-account-card__type--description'>
                        <h1 className='mt5-account-card--heading'>{title}</h1>
                        {(!existing_data || !is_logged_in) && (
                            <p className='mt5-account-card--paragraph'>{descriptor}</p>
                        )}
                        {existing_data && existing_data.display_balance && is_logged_in && (
                            <p className='mt5-account-card--balance'>
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

                <div className='mt5-account-card__cta'>
                    <div className='mt5-account-card__specs'>
                        <table className='mt5-account-card__specs-table'>
                            <tbody>
                                {Object.keys(specs).map((spec_attribute, idx) => (
                                    <tr key={idx} className='mt5-account-card__specs-table-row'>
                                        <td className='mt5-account-card__specs-table-attribute'>
                                            <p className='mt5-account-card--paragraph'>{spec_attribute}</p>
                                        </td>
                                        <td className='mt5-account-card__specs-table-data'>
                                            <p className='mt5-account-card--paragraph'>{specs[spec_attribute]}</p>
                                        </td>
                                    </tr>
                                ))}
                                {has_server_banner &&
                                    existing_data &&
                                    type.type === 'synthetic' &&
                                    type.category === 'real' && (
                                        <tr key={existing_data.server} className='mt5-account-card__specs-table-row'>
                                            <td className='mt5-account-card__specs-table-attribute'>
                                                <p className='mt5-account-card--paragraph'>
                                                    <Localize i18n_default_text='Trade server: ' />
                                                </p>
                                            </td>
                                            <td className='mt5-account-card__specs-table-data'>
                                                <p className='mt5-account-card--paragraph'>
                                                    {getServerName(existing_data)}
                                                </p>
                                            </td>
                                        </tr>
                                    )}
                            </tbody>
                        </table>
                    </div>

                    {existing_data?.login && is_logged_in && <LoginBadge display_login={existing_data.display_login} />}

                    {((!existing_data && commission_message) || !is_logged_in) && (
                        <div className='mt5-account-card__commission'>
                            <Text as='p' color='general' size='xs' styles={{ margin: '1.6rem auto' }}>
                                {commission_message}
                            </Text>
                        </div>
                    )}
                    {existing_data && is_logged_in && (
                        <div className='mt5-account-card__manage'>
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
                    {!existing_data && has_mt5_account && (
                        <Button className='mt5-account-card__account-selection' onClick={onSelectAccount} type='button'>
                            <Localize i18n_default_text='Select' />
                        </Button>
                    )}
                    {existing_data && is_logged_in && (
                        <a
                            className='dc-btn mt5-account-card__account-selection mt5-account-card__account-selection--primary'
                            type='button'
                            href={getMT5WebTerminalLink({
                                category: type.category,
                                loginid: existing_data.display_login,
                            })}
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            <Localize i18n_default_text='Trade on web terminal' />
                        </a>
                    )}
                    {!existing_data && !has_mt5_account && is_logged_in && (
                        <MT5AccountCardAction
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
                    classNames='mt5-account-card__add-server'
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

export { MT5AccountCard };
