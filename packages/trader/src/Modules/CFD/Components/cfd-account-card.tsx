import classNames from 'classnames';
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { Icon, Money, Button, Text, DesktopWrapper, MobileWrapper, Popover } from '@deriv/components';
import { isMobile, mobileOSDetect, getCFDPlatformLabel, CFD_PLATFORMS } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { CFDAccountCopy } from './cfd-account-copy';
import { getDXTradeWebTerminalLink, getMT5WebTerminalLink, getPlatformDXTradeDownloadLink } from '../Helpers/constants';
import {
    TAccountIconValues,
    TSpecBoxProps,
    TPasswordBoxProps,
    TCFDAccountCardActionProps,
    TExistingData,
    TCFDAccountCard,
    TTradingPlatformAccounts,
} from './props.types';
import { DetailsOfEachMT5Loginid } from '@deriv/api-types';

const account_icons: { [key: string]: TAccountIconValues } = {
    mt5: {
        synthetic: 'IcMt5SyntheticPlatform',
        financial: 'IcMt5FinancialPlatform',
        financial_stp: 'IcMt5FinancialStpPlatform',
        cfd: 'IcMt5CfdPlatform',
    },
    dxtrade: {
        synthetic: 'IcDxtradeSyntheticPlatform',
        financial: 'IcDxtradeFinancialPlatform',
        cfd: 'IcMt5CfdPlatform',
    },
};

const AddTradeServerButton = React.forwardRef<HTMLDivElement, { onSelectAccount: () => void; is_disabled?: boolean }>(
    ({ onSelectAccount, is_disabled }, ref) => {
        return (
            <div
                onClick={is_disabled ? () => undefined : onSelectAccount}
                className={classNames('cfd-account-card__add-server', {
                    'cfd-account-card__add-server--disabled': is_disabled,
                })}
                ref={ref}
            >
                <span className='cfd-account-card__add-server--icon'>+</span>
                <Localize i18n_default_text='Add region' />
            </div>
        );
    }
);

AddTradeServerButton.displayName = 'AddTradeServerButton';

const SpecBox = ({ value, is_bold }: TSpecBoxProps) => (
    <div className='cfd-account-card__spec-box'>
        <Text size='xs' weight={is_bold ? 'bold' : ''} className='cfd-account-card__spec-text'>
            {value}
        </Text>
        <CFDAccountCopy text={value} className='cfd-account-card__spec-copy' />
    </div>
);

const PasswordBox = ({ platform, onClick }: TPasswordBoxProps) => (
    <div className='cfd-account-card__password-box'>
        <div className='cfd-account-card__password-text'>
            <Popover
                alignment='right'
                message={localize(
                    'Use these credentials to log in to your {{platform}} account on the website and mobile apps.',
                    {
                        platform: getCFDPlatformLabel(platform),
                    }
                )}
                classNameBubble='cfd-account-card__password-tooltip'
            >
                <Text size='xs'>•••••••••••••••</Text>
            </Popover>
        </div>
        <Popover alignment='bottom' message={localize('Change Password')}>
            <Button
                className='cfd-account-card__password-action toolbar__btn--icon'
                transparent
                onClick={onClick}
                icon={
                    <Icon
                        icon='IcEdit'
                        className='da-article__learn-more-icon'
                        custom_color='var(--text-less-prominent)'
                    />
                }
            />
        </Popover>
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
    platform,
    title,
}: TCFDAccountCardActionProps) => {
    if (
        is_virtual &&
        type.category === 'real' &&
        typeof handleClickSwitchAccount === 'function' &&
        (platform === CFD_PLATFORMS.MT5 ? has_real_account && type.type === 'financial_stp' : true)
    ) {
        return (
            <div className='cfd-account-card__action-wrapper'>
                <Localize
                    i18n_default_text='<0>Switch to your real account</0><1> to create a {{platform}} {{account_title}} account.</1>'
                    values={{
                        platform: getCFDPlatformLabel(platform),
                        account_title: title,
                    }}
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
    has_cfd_account_error,
    has_real_account,
    is_accounts_switcher_on,
    is_button_primary,
    is_disabled,
    is_logged_in,
    is_virtual,
    is_eu,
    onHover,
    platform,
    specs,
    title,
    type,
    onSelectAccount,
    onClickFund,
    onPasswordManager,
    should_show_trade_servers,
    toggleAccountsDialog,
    toggleShouldShowRealAccountsList,
}: TCFDAccountCard) => {
    const platform_icon = is_eu ? 'cfd' : type.type;
    const icon: any = type.type ? <Icon icon={account_icons[type.platform][platform_icon]} size={64} /> : null;
    const has_popular_banner: boolean =
        type.type === 'synthetic' &&
        type.category === 'real' &&
        (platform === CFD_PLATFORMS.MT5 ? !existing_data : true);
    const has_demo_banner: boolean = type.category === 'demo';
    const has_server_banner =
        is_logged_in &&
        existing_data &&
        type.category === 'real' &&
        type.type === 'synthetic' &&
        (existing_data as DetailsOfEachMT5Loginid)?.server_info;

    const is_real_synthetic_account: boolean =
        type.type === 'synthetic' && type.category === 'real' && type.platform === 'mt5';
    const get_server_region = (existing_data as DetailsOfEachMT5Loginid)?.server_info?.geolocation?.region;
    const get_server_environment = (existing_data as DetailsOfEachMT5Loginid)?.server_info?.environment;

    const ref = React.useRef<HTMLDivElement | null>(null);
    const wrapper_ref = React.useRef<HTMLDivElement | null>(null);
    const button_ref = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
        const ref_current = ref?.current;
        const button_ref_current = button_ref?.current;
        if (existing_data) {
            const show = () => {
                onHover?.((existing_data as DetailsOfEachMT5Loginid).group);
            };

            ref_current?.addEventListener('mouseenter', show);
            button_ref_current?.addEventListener('mouseenter', show);

            return () => {
                ref_current?.removeEventListener('mouseenter', show);
                button_ref_current?.removeEventListener('mouseenter', () => show);
            };
        }
        return () => {
            // Curly brackets could not be empty due to the sonarcloud code smells
        };
    }, [onHover, existing_data]);

    const getServerName: (value: TExistingData) => string = React.useCallback(server => {
        if (server) {
            const server_region = (server as DetailsOfEachMT5Loginid).server_info?.geolocation?.region;
            if (server_region) {
                return `${server_region} ${
                    (server as DetailsOfEachMT5Loginid)?.server_info?.geolocation?.sequence === 1
                        ? ''
                        : (server as DetailsOfEachMT5Loginid)?.server_info?.geolocation?.sequence
                }`;
            }
        }
        return '';
    }, []);

    const createFullServerNames: () => string = () => {
        let region_string = '';
        let server_number = '';
        const server_environment = get_server_environment ? get_server_environment.toLowerCase() : '';

        if (is_real_synthetic_account && get_server_region) {
            region_string = `-${get_server_region.toLowerCase()}`;
        }
        if (server_environment !== '' && is_real_synthetic_account) {
            server_number = server_environment.split('server')[1];
        }
        return `${type.category}-${type.type}${region_string}${server_number}`;
    };

    const handleClickSwitchAccount: () => void = () => {
        toggleShouldShowRealAccountsList?.(true);
        toggleAccountsDialog?.(true);
    };

    const getDxtradeDownloadLink: () => string = () => {
        const os = mobileOSDetect();
        if (os === 'iOS') {
            return getPlatformDXTradeDownloadLink('ios');
        }
        return getPlatformDXTradeDownloadLink('android');
    };

    const is_web_terminal_unsupported = isMobile() && platform === CFD_PLATFORMS.DXTRADE;
    const tbody_content =
        platform === CFD_PLATFORMS.MT5 ? (
            <React.Fragment>
                <tr className='cfd-account-card__login-specs-table-row'>
                    <td className='cfd-account-card__login-specs-table-attribute'>
                        <div className='cfd-account-card--paragraph'>{localize('Broker')}</div>
                    </td>
                    <td className='cfd-account-card__login-specs-table-data'>
                        <div className='cfd-account-card--paragraph'>
                            <SpecBox value={'Deriv Limited'} />
                        </div>
                    </td>
                </tr>
                <tr className='cfd-account-card__login-specs-table-row'>
                    <td className='cfd-account-card__login-specs-table-attribute'>
                        <div className='cfd-account-card--paragraph'>{localize('Server')}</div>
                    </td>
                    <td className='cfd-account-card__login-specs-table-data'>
                        <div className='cfd-account-card--paragraph'>
                            <SpecBox value={(existing_data as DetailsOfEachMT5Loginid)?.server_info?.environment} />
                        </div>
                    </td>
                </tr>
                <tr className='cfd-account-card__login-specs-table-row'>
                    <td className='cfd-account-card__login-specs-table-attribute'>
                        <div className='cfd-account-card--paragraph'>{localize('Login ID')}</div>
                    </td>
                    <td className='cfd-account-card__login-specs-table-data'>
                        <div className='cfd-account-card--paragraph'>
                            <SpecBox value={(existing_data as TTradingPlatformAccounts)?.display_login} />
                        </div>
                    </td>
                </tr>
            </React.Fragment>
        ) : (
            <React.Fragment>
                <tr className='cfd-account-card__login-specs-table-row'>
                    <td className='cfd-account-card__login-specs-table-attribute'>
                        <div className='cfd-account-card--paragraph'>{localize('Username')}</div>
                    </td>
                    <td className='cfd-account-card__login-specs-table-data'>
                        <div className='cfd-account-card--paragraph'>
                            <SpecBox value={existing_data?.login} is_bold />
                        </div>
                    </td>
                </tr>
            </React.Fragment>
        );

    return (
        <div ref={wrapper_ref} className='cfd-account-card__wrapper'>
            <div
                className={classNames('cfd-account-card', { 'cfd-account-card__logged-out': !is_logged_in })}
                ref={ref}
                id={createFullServerNames()}
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
                    className={classNames('cfd-account-card__type', {
                        'cfd-account-card__type--has-banner': has_banner || has_popular_banner || has_server_banner,
                    })}
                    id={`${platform === CFD_PLATFORMS.DXTRADE ? CFD_PLATFORMS.DXTRADE : CFD_PLATFORMS.MT5}_${
                        type.category
                    }_${type.type}`}
                >
                    {icon}
                    <div className='cfd-account-card__type--description'>
                        <Text size='xxl' className='cfd-account-card--heading'>
                            {title}
                        </Text>
                        {(!existing_data || !is_logged_in) && (
                            <p className='cfd-account-card--paragraph'>{descriptor}</p>
                        )}
                        {existing_data?.display_balance && is_logged_in && (
                            <Text size='xxl' className='cfd-account-card--balance'>
                                <Money
                                    amount={existing_data.display_balance}
                                    currency={existing_data.currency}
                                    has_sign={existing_data.balance && existing_data.balance < 0}
                                    show_currency
                                />
                            </Text>
                        )}
                        {(existing_data as TTradingPlatformAccounts)?.display_login && is_logged_in && (
                            <Text color='less-prominent' size='xxxs' line_height='s'>
                                {(existing_data as TTradingPlatformAccounts)?.display_login}
                            </Text>
                        )}
                    </div>
                </div>
                {existing_data && <div className='cfd-account-card__divider' />}
                <div className='cfd-account-card__cta'>
                    <div className='cfd-account-card__cta-wrapper'>
                        {existing_data?.login && is_logged_in ? (
                            <React.Fragment>
                                <div className='cfd-account-card__login-specs'>
                                    <table className='cfd-account-card__login-specs-table'>
                                        <tbody>
                                            {tbody_content}
                                            <tr className='cfd-account-card__login-specs-table-row cfd-account-card__login-specs-table-row--account-id'>
                                                <td className='cfd-account-card__login-specs-table-attribute'>
                                                    <div className='cfd-account-card--paragraph'>
                                                        {localize('Password')}
                                                    </div>
                                                </td>
                                                <td className='cfd-account-card__login-specs-table-data'>
                                                    <div className='cfd-account-card--paragraph'>
                                                        <PasswordBox
                                                            platform={platform}
                                                            onClick={() => {
                                                                onPasswordManager(
                                                                    existing_data?.login,
                                                                    title,
                                                                    type.category,
                                                                    type.type,
                                                                    (existing_data as DetailsOfEachMT5Loginid)?.server
                                                                );
                                                            }}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </React.Fragment>
                        ) : (
                            <div className='cfd-account-card__specs'>
                                <table className='cfd-account-card__specs-table'>
                                    <tbody>
                                        {typeof specs !== 'undefined' &&
                                            Object.keys(specs).map((spec_attribute, idx) => (
                                                <tr key={idx} className='cfd-account-card__specs-table-row'>
                                                    <td className='cfd-account-card__specs-table-attribute'>
                                                        <p className='cfd-account-card--paragraph'>
                                                            {specs[spec_attribute].key()}
                                                        </p>
                                                    </td>
                                                    <td className='cfd-account-card__specs-table-data'>
                                                        <p className='cfd-account-card--paragraph'>
                                                            {specs[spec_attribute].value()}
                                                        </p>
                                                    </td>
                                                </tr>
                                            ))}
                                        {has_server_banner &&
                                            existing_data &&
                                            type.type === 'synthetic' &&
                                            type.category === 'real' && (
                                                <tr
                                                    key={(existing_data as DetailsOfEachMT5Loginid).server}
                                                    className='cfd-account-card__specs-table-row'
                                                >
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
                            </div>
                        )}
                        {!existing_data && has_cfd_account && (
                            <Button
                                className='cfd-account-card__account-selection'
                                onClick={onSelectAccount}
                                type='button'
                            >
                                <Localize i18n_default_text='Select' />
                            </Button>
                        )}
                        {existing_data && is_logged_in && !is_web_terminal_unsupported && (
                            <a
                                className='dc-btn cfd-account-card__account-selection cfd-account-card__account-selection--primary'
                                type='button'
                                href={
                                    platform === CFD_PLATFORMS.DXTRADE
                                        ? getDXTradeWebTerminalLink(type.category)
                                        : getMT5WebTerminalLink({
                                              category: type.category,
                                              loginid: (existing_data as TTradingPlatformAccounts).display_login,
                                              server_name: (existing_data as DetailsOfEachMT5Loginid)?.server_info
                                                  ?.environment,
                                          })
                                }
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                <Localize i18n_default_text='Trade on web terminal' />
                            </a>
                        )}
                        {existing_data && is_logged_in && is_web_terminal_unsupported && (
                            <a
                                className='dc-btn cfd-account-card__account-selection cfd-account-card__account-selection--primary'
                                type='button'
                                href={getDxtradeDownloadLink()}
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                <Localize i18n_default_text='Download the app' />
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
                                platform={platform}
                                title={title}
                            />
                        )}
                    </div>
                </div>
                <React.Fragment>
                    {should_show_trade_servers && (
                        <MobileWrapper>
                            <AddTradeServerButton
                                ref={button_ref}
                                onSelectAccount={onSelectAccount}
                                is_disabled={has_cfd_account_error}
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
                        is_disabled={has_cfd_account_error}
                    />
                </CSSTransition>
            </DesktopWrapper>
        </div>
    );
};

export { CFDAccountCard };
