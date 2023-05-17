import classNames from 'classnames';
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { Icon, Money, Button, Text, DesktopWrapper, MobileWrapper, Popover } from '@deriv/components';
import { isMobile, mobileOSDetect, getCFDPlatformLabel, CFD_PLATFORMS, isDesktop } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { connect } from '../Stores/connect';
import RootStore from '../Stores/index';
import { CFDAccountCopy } from './cfd-account-copy';
import { getDXTradeWebTerminalLink, getPlatformDXTradeDownloadLink } from '../Helpers/constants';
import {
    TAccountIconValues,
    TSpecBoxProps,
    TPasswordBoxProps,
    TCFDAccountCardActionProps,
    TCFDAccountCard,
    TTradingPlatformAccounts,
    TTradingPlatformAvailableAccount,
} from './props.types';
import { DetailsOfEachMT5Loginid } from '@deriv/api-types';
import { FormikValues } from 'formik';

const account_icons: { [key: string]: TAccountIconValues } = {
    mt5: {
        synthetic: 'IcMt5SyntheticPlatform',
        financial: 'IcMt5FinancialPlatform',
        financial_stp: 'IcMt5FinancialStpPlatform',
        cfd: 'IcMt5CfdPlatform',
        all: 'IcMt5SwapFreePlatform',
    },
    // TODO: Line 30, 31 and 32 should be removed after real released.
    dxtrade: {
        synthetic: 'IcDxtradeSyntheticPlatform',
        financial: 'IcDxtradeFinancialPlatform',
        cfd: 'IcMt5CfdPlatform',
        all: 'IcDxtradeDerivxPlatform',
    },
};

const AddAccountButton = React.forwardRef<HTMLDivElement, { onSelectAccount: () => void; is_disabled?: boolean }>(
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
                <Localize i18n_default_text='Add account' />
            </div>
        );
    }
);

AddAccountButton.displayName = 'AddAccountButton';

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
                className='cfd-account-card__password-action'
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
    real_account_creation_unlock_date,
    setShouldShowCooldownModal,
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
                        account_title: title === 'Deriv X' ? '' : title,
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
            onClick={() => {
                if (real_account_creation_unlock_date) {
                    setShouldShowCooldownModal(true);
                } else {
                    onSelectAccount();
                }
            }}
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

const CFDAccountCardComponent = ({
    button_label,
    commission_message,
    descriptor,
    dxtrade_tokens,
    existing_accounts_data,
    has_banner,
    has_cfd_account_error,
    has_real_account,
    is_accounts_switcher_on,
    is_button_primary,
    is_disabled,
    is_eu,
    is_logged_in,
    is_virtual,
    isEligibleForMoreDemoMt5Svg,
    isEligibleForMoreRealMt5,
    onClickFund,
    onPasswordManager,
    onSelectAccount,
    platform,
    setAccountType,
    setJurisdictionSelectedShortcode,
    setIsAcuityModalOpen,
    setMT5TradeAccount,
    specs,
    title,
    toggleAccountsDialog,
    toggleCFDVerificationModal,
    toggleMT5TradeModal,
    toggleShouldShowRealAccountsList,
    type,
    updateAccountStatus,
    real_account_creation_unlock_date,
    setShouldShowCooldownModal,
    setAppstorePlatform,
    show_eu_related_content,
}: TCFDAccountCard) => {
    const existing_data = existing_accounts_data?.length ? existing_accounts_data?.[0] : existing_accounts_data;

    const should_show_extra_add_account_button =
        is_logged_in &&
        !show_eu_related_content &&
        platform === CFD_PLATFORMS.MT5 &&
        (type.category === 'demo'
            ? isEligibleForMoreDemoMt5Svg(type.type as TTradingPlatformAvailableAccount['market_type'] | 'synthetic') &&
              !!existing_data
            : isEligibleForMoreRealMt5(type.type as TTradingPlatformAvailableAccount['market_type'] | 'synthetic') &&
              !!existing_data);

    const platform_icon = show_eu_related_content && platform === CFD_PLATFORMS.MT5 ? 'cfd' : type.type;

    const icon: React.ReactNode | null = type.type ? (
        <Icon icon={account_icons[type.platform][platform_icon]} size={64} />
    ) : null;
    const has_popular_banner: boolean = type.type === 'synthetic';
    const has_demo_banner: boolean = type.category === 'demo';
    const has_server_banner =
        is_logged_in &&
        existing_data &&
        type.category === 'real' &&
        type.type === 'synthetic' &&
        (existing_data as DetailsOfEachMT5Loginid)?.server_info;

    const ref = React.useRef<HTMLDivElement | null>(null);
    const wrapper_ref = React.useRef<HTMLDivElement | null>(null);
    const button_ref = React.useRef<HTMLDivElement | null>(null);

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

    const checkMultipleSvgAcc = () => {
        const all_svg_acc: DetailsOfEachMT5Loginid[] = [];
        existing_accounts_data?.map(acc => {
            if (acc.landing_company_short === 'svg') {
                if (all_svg_acc.length) {
                    all_svg_acc.forEach(svg_acc => {
                        if (svg_acc.server !== acc.server) all_svg_acc.push(acc);
                        return all_svg_acc;
                    });
                } else {
                    all_svg_acc.push(acc);
                }
            }
        });
        return all_svg_acc;
    };

    const getServerName: (value: DetailsOfEachMT5Loginid) => string = React.useCallback(server => {
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

    const getBannerStatus = (account: DetailsOfEachMT5Loginid) => {
        const { landing_company_short, status } = account;
        if (landing_company_short && status && ['proof_failed', 'verification_pending'].includes(status)) {
            const should_show_pending_button = status === 'verification_pending';
            return (
                <Button
                    className='dc-btn cfd-account-card__account-selection cfd-account-card__account-selection--primary'
                    type='button'
                    onClick={() => {
                        setAccountType({
                            category: type.category,
                            type: type.type,
                        });
                        setJurisdictionSelectedShortcode(landing_company_short);
                        updateAccountStatus();
                        toggleCFDVerificationModal();
                    }}
                    primary
                    large
                    disabled={should_show_pending_button}
                >
                    {should_show_pending_button ? (
                        <Localize i18n_default_text='Pending verification' />
                    ) : (
                        <Localize i18n_default_text='Resubmit document' />
                    )}
                </Button>
            );
        }
        return null;
    };

    const is_web_terminal_unsupported = isMobile() && platform === CFD_PLATFORMS.DXTRADE;
    const tbody_content = platform === CFD_PLATFORMS.DXTRADE && (
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
                        {platform === CFD_PLATFORMS.DXTRADE ? (
                            (!existing_data || !is_logged_in) && (
                                <p className='cfd-account-card--paragraph'>{descriptor}</p>
                            )
                        ) : (
                            <p className='cfd-account-card--paragraph'>{descriptor}</p>
                        )}
                        {existing_data?.display_balance && is_logged_in && platform === CFD_PLATFORMS.DXTRADE && (
                            <Text size='xxl' className='cfd-account-card__balance--value'>
                                <Money
                                    amount={existing_data.display_balance}
                                    currency={existing_data.currency}
                                    has_sign={existing_data.balance ? existing_data.balance < 0 : false}
                                    show_currency
                                />
                            </Text>
                        )}
                        {(existing_data as TTradingPlatformAccounts)?.display_login &&
                            is_logged_in &&
                            platform === CFD_PLATFORMS.DXTRADE && (
                                <Text color='less-prominent' size='xxxs' line_height='s'>
                                    {(existing_data as TTradingPlatformAccounts)?.display_login}
                                </Text>
                            )}
                    </div>
                </div>
                {platform === CFD_PLATFORMS.MT5 && isDesktop() && is_logged_in && (
                    <div className='cfd-account-card__acuity-container'>
                        {type.type === 'financial' && (
                            <Button
                                onClick={() => setIsAcuityModalOpen(true)}
                                className='cfd-account-card__acuity-banner'
                                type='button'
                                transparent
                            >
                                <div className='cfd-account-card__acuity-banner--wrapper'>
                                    <Icon icon='icMt5Acuity' />
                                    <Text as='p' size='xxs' weight='bold' color='prominent'>
                                        <Localize i18n_default_text='Get Acuity trading tools' />
                                    </Text>
                                    <Icon icon='IcAddOutline' color='secondary' />
                                </div>
                            </Button>
                        )}
                    </div>
                )}
                {existing_data && <div className='cfd-account-card__divider' />}

                <div className='cfd-account-card__cta' style={!existing_data?.login ? { marginTop: 'auto' } : {}}>
                    <div className='cfd-account-card__cta-wrapper'>
                        {platform === CFD_PLATFORMS.DXTRADE && (!existing_data?.login || !is_logged_in) && (
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
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {existing_data?.login &&
                            is_logged_in &&
                            platform === CFD_PLATFORMS.MT5 &&
                            type.category === 'demo' &&
                            existing_accounts_data?.length &&
                            existing_accounts_data?.map((acc: FormikValues, index: number) => (
                                <div className='cfd-account-card__item' key={index}>
                                    {acc?.display_balance && is_logged_in && acc.landing_company_short === 'labuan' && (
                                        <div className='cfd-account-card__item--banner'>
                                            <Localize i18n_default_text={'Labuan'} />
                                        </div>
                                    )}
                                    {(acc as TTradingPlatformAccounts)?.display_login && (
                                        <div
                                            className={`cfd-account-card--login-id${
                                                acc.landing_company_short === 'labuan' ? '' : '-demo'
                                            }`}
                                        >
                                            <Text size='xxxs' weight='bold'>
                                                {(acc as TTradingPlatformAccounts)?.display_login}
                                            </Text>
                                        </div>
                                    )}
                                    {acc?.display_balance && is_logged_in && (
                                        <div className='cfd-account-card__balance'>
                                            <Text size='xxl' className='cfd-account-card__balance--value'>
                                                <Money
                                                    amount={acc.display_balance}
                                                    currency={acc.currency}
                                                    has_sign={!!acc.balance && acc.balance < 0}
                                                    show_currency
                                                />
                                            </Text>
                                        </div>
                                    )}
                                    <div className='cfd-account-card__manage--mt5'>
                                        {acc && is_logged_in && (
                                            <Button onClick={() => onClickFund(acc)} type='button' secondary>
                                                <Localize i18n_default_text='Top up' />
                                            </Button>
                                        )}
                                        {acc && is_logged_in && !is_web_terminal_unsupported && (
                                            <Button
                                                className='dc-btn cfd-account-card__account-selection cfd-account-card__account-selection--primary'
                                                type='button'
                                                onClick={() => {
                                                    setAppstorePlatform(platform);
                                                    toggleMT5TradeModal();
                                                    setMT5TradeAccount(acc);
                                                }}
                                                primary
                                                large
                                            >
                                                <Localize i18n_default_text='Trade' />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        {existing_data?.login &&
                            is_logged_in &&
                            platform === CFD_PLATFORMS.MT5 &&
                            !existing_accounts_data?.length &&
                            type.category === 'demo' && (
                                <div className='cfd-account-card__item'>
                                    {(existing_data as TTradingPlatformAccounts)?.display_login && (
                                        <div className='cfd-account-card--login-id-demo'>
                                            <Text size='xxxs' weight='bold'>
                                                {(existing_data as TTradingPlatformAccounts)?.display_login}
                                            </Text>
                                        </div>
                                    )}
                                    {existing_data?.display_balance && is_logged_in && (
                                        <div className='cfd-account-card__balance'>
                                            <Text size='xxl' className='cfd-account-card__balance--value'>
                                                <Money
                                                    amount={existing_data.display_balance}
                                                    currency={existing_data.currency}
                                                    has_sign={!!existing_data.balance && existing_data.balance < 0}
                                                    show_currency
                                                />
                                            </Text>
                                        </div>
                                    )}
                                    <div className='cfd-account-card__manage--mt5'>
                                        {existing_data && is_logged_in && (
                                            <Button onClick={() => onClickFund(existing_data)} type='button' secondary>
                                                <Localize i18n_default_text='Top up' />
                                            </Button>
                                        )}
                                        {existing_data && is_logged_in && !is_web_terminal_unsupported && (
                                            <Button
                                                className='dc-btn cfd-account-card__account-selection cfd-account-card__account-selection--primary'
                                                type='button'
                                                onClick={() => {
                                                    setAppstorePlatform(platform);
                                                    toggleMT5TradeModal();
                                                    setMT5TradeAccount(existing_data);
                                                }}
                                                primary
                                                large
                                            >
                                                <Localize i18n_default_text='Trade' />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            )}
                        {existing_data?.login &&
                            is_logged_in &&
                            platform === CFD_PLATFORMS.MT5 &&
                            type.category === 'real' &&
                            existing_accounts_data?.map((acc: FormikValues, index: number) => (
                                <div className='cfd-account-card__item' key={index}>
                                    {existing_data?.display_balance && is_logged_in && !show_eu_related_content && (
                                        <div className='cfd-account-card__item--banner'>
                                            <Localize
                                                i18n_default_text={
                                                    acc.landing_company_short &&
                                                    !['svg', 'bvi'].includes(acc?.landing_company_short)
                                                        ? acc.landing_company_short?.charAt(0).toUpperCase() +
                                                          acc.landing_company_short.slice(1)
                                                        : acc.landing_company_short?.toUpperCase()
                                                }
                                            />
                                        </div>
                                    )}
                                    {(acc as TTradingPlatformAccounts)?.display_login && (
                                        <div className='cfd-account-card--login-id'>
                                            <Text size='xxxs' weight='bold'>
                                                {(acc as TTradingPlatformAccounts)?.display_login}
                                            </Text>
                                        </div>
                                    )}
                                    {existing_data?.display_balance && is_logged_in && (
                                        <div className='cfd-account-card__balance'>
                                            <Text size='xxl' className='cfd-account-card__balance--value'>
                                                <Money
                                                    amount={acc.display_balance}
                                                    currency={acc.currency}
                                                    has_sign={!!acc.balance && acc.balance < 0}
                                                    show_currency
                                                />
                                            </Text>
                                            {checkMultipleSvgAcc()?.length > 1 &&
                                                acc.landing_company_short === 'svg' && (
                                                    <Text
                                                        className='cfd-account-card__balance--region'
                                                        color='colored-background'
                                                        size='xxxs'
                                                        weight='bold'
                                                    >
                                                        {getServerName(acc)}
                                                    </Text>
                                                )}
                                        </div>
                                    )}
                                    <div className='cfd-account-card__manage--mt5'>
                                        {getBannerStatus(acc) ?? (
                                            <React.Fragment>
                                                {existing_data && is_logged_in && (
                                                    <Button
                                                        onClick={() => {
                                                            const selected_account_data = existing_accounts_data?.find(
                                                                data =>
                                                                    data.landing_company_short ===
                                                                        acc.landing_company_short &&
                                                                    data.login === acc.login
                                                            );

                                                            onClickFund(
                                                                selected_account_data as DetailsOfEachMT5Loginid
                                                            );
                                                        }}
                                                        type='button'
                                                        secondary
                                                    >
                                                        <Localize i18n_default_text='Top up' />
                                                    </Button>
                                                )}
                                                {existing_data && is_logged_in && !is_web_terminal_unsupported && (
                                                    <Button
                                                        className='dc-btn cfd-account-card__account-selection cfd-account-card__account-selection--primary'
                                                        type='button'
                                                        onClick={() => {
                                                            const selected_account_data = existing_accounts_data?.find(
                                                                data =>
                                                                    data.landing_company_short ===
                                                                        acc.landing_company_short &&
                                                                    data.login === acc.login
                                                            );
                                                            setAppstorePlatform(platform);
                                                            toggleMT5TradeModal();
                                                            setMT5TradeAccount(selected_account_data);
                                                        }}
                                                        primary
                                                        large
                                                    >
                                                        <Localize i18n_default_text='Trade' />
                                                    </Button>
                                                )}
                                            </React.Fragment>
                                        )}
                                    </div>
                                </div>
                            ))}
                        {existing_data?.login && is_logged_in && platform === CFD_PLATFORMS.DXTRADE && (
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
                        )}
                        {((!existing_data && commission_message) || !is_logged_in) &&
                            platform === CFD_PLATFORMS.DXTRADE && (
                                <div className='cfd-account-card__commission'>
                                    <Text as='p' color='general' size='xs' styles={{ margin: '1.6rem auto' }}>
                                        {commission_message}
                                    </Text>
                                </div>
                            )}
                        {existing_data && is_logged_in && platform === CFD_PLATFORMS.DXTRADE && (
                            <div className='cfd-account-card__manage'>
                                <Button onClick={() => onClickFund(existing_data)} type='button' secondary>
                                    {type.category === 'real' && <Localize i18n_default_text='Fund transfer' />}
                                    {type.category === 'demo' && <Localize i18n_default_text='Top up' />}
                                </Button>
                            </div>
                        )}
                        {existing_data &&
                            is_logged_in &&
                            !is_web_terminal_unsupported &&
                            platform === CFD_PLATFORMS.DXTRADE && (
                                <a
                                    className='dc-btn cfd-account-card__account-selection cfd-account-card__account-selection--primary'
                                    type='button'
                                    href={getDXTradeWebTerminalLink(
                                        type.category,
                                        dxtrade_tokens[type.category as 'demo' | 'real']
                                    )}
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
                        {!existing_data && is_logged_in && (
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
                                real_account_creation_unlock_date={real_account_creation_unlock_date}
                                setShouldShowCooldownModal={setShouldShowCooldownModal}
                            />
                        )}
                    </div>
                </div>
                <React.Fragment>
                    {should_show_extra_add_account_button && (
                        <MobileWrapper>
                            <AddAccountButton
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
                    in={should_show_extra_add_account_button}
                    timeout={0}
                    classNames='cfd-account-card__add-server'
                    unmountOnExit
                >
                    <AddAccountButton
                        ref={button_ref}
                        onSelectAccount={onSelectAccount}
                        is_disabled={has_cfd_account_error}
                    />
                </CSSTransition>
            </DesktopWrapper>
        </div>
    );
};

const CFDAccountCard = connect(({ modules: { cfd }, client, ui, common, traders_hub }: RootStore) => ({
    dxtrade_tokens: cfd.dxtrade_tokens,
    isEligibleForMoreDemoMt5Svg: client.isEligibleForMoreDemoMt5Svg,
    isEligibleForMoreRealMt5: client.isEligibleForMoreRealMt5,
    setAccountType: cfd.setAccountType,
    setJurisdictionSelectedShortcode: cfd.setJurisdictionSelectedShortcode,
    setIsAcuityModalOpen: ui.setIsAcuityModalOpen,
    setMT5TradeAccount: cfd.setMT5TradeAccount,
    setAppstorePlatform: common.setAppstorePlatform,
    toggleCFDVerificationModal: cfd.toggleCFDVerificationModal,
    updateAccountStatus: client.updateAccountStatus,
    show_eu_related_content: traders_hub.show_eu_related_content,
}))(CFDAccountCardComponent);

export { CFDAccountCard };
