import React from 'react';
import { Text, Button, Icon, Money } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import WalletIcon from 'Assets/svgs/wallet';
import { getCurrencyDisplayCode, isMobile, getCurrencyName, getCFDAccountDisplay, isBot } from '@deriv/shared';
import classNames from 'classnames';
import { RouteComponentProps } from 'react-router';

type Icountry_standpoint = {
    is_united_kingdom: boolean;
    is_isle_of_man: boolean;
};

type Igeolocation = {
    region: any;
    sequence: number;
};
type Iserver_info = {
    geolocation: Igeolocation;
};
type Iserver = {
    server_info: Iserver_info;
};

type TOptionsAccountprops = RouteComponentProps & {
    currency_icon: string | undefined;
    loginid_text: string;
    balance?: string;
    account_button?: string;
    currency?: string;
    display_type: string;
    has_balance?: boolean;
    has_reset_balance?: boolean;
    is_disabled?: boolean;
    is_virtual?: boolean;
    title?: string;
    country_standpoint: Icountry_standpoint;
    is_eu?: string;
    market_type?: string;
    server?: Iserver;
    sub_account_type?: string;
    has_error?: string;
    platform?: string;
    is_dark_mode_on?: string;
    shortcode?: string;
    should_show_server_name?: string;
    onClickResetVirtualBalance: () => void;
    selected_loginid?: string;
    redirectAccount: () => void;
    activeAccount?: string;
    onClickDeposit?: () => void;
};

type TCurrentDisplay = {
    country_standpoint: Icountry_standpoint;
    currency?: string;
    loginid: string;
    is_virtual?: boolean;
};

type TAccountDisplay = {
    is_eu?: string;
    market_type?: string;
    server?: Iserver;
    sub_account_type?: string;
    has_error?: string;
    platform?: string;
    is_dark_mode_on?: string;
    shortcode?: string;
    should_show_server_name?: string;
};

const CurrencyDisplay = ({ country_standpoint, currency, loginid, is_virtual }: TCurrentDisplay) => {
    const user_is_from_this_country_list = Object.values(country_standpoint).includes(true);
    const account_type = loginid.replace(/\d/g, '');

    if (user_is_from_this_country_list) {
        if (account_type === 'MLT') {
            return <Localize i18n_default_text='Options' />;
        } else if (account_type === 'MX') {
            if (country_standpoint.is_united_kingdom) {
                return <Localize i18n_default_text='Gaming' />;
            }
            if (country_standpoint.is_isle_of_man) {
                return getCurrencyName(currency);
            }
            return <Localize i18n_default_text='Synthetic' />;
        } else if (account_type === 'MF') {
            return <Localize i18n_default_text='Multipliers' />;
        }
    }

    if (is_virtual) {
        return <Localize i18n_default_text='Demo' />;
    }

    if (!currency) {
        return <Localize i18n_default_text='No currency assigned' />;
    }

    return getCurrencyName(currency);
};

const AccountDisplay = ({
    has_error,
    market_type,
    sub_account_type,
    platform,
    server,
    is_dark_mode_on,
    is_eu,
    shortcode,
    should_show_server_name,
}: TAccountDisplay) => {
    // TODO: Remove once account with error has market_type and sub_account_type in details response
    const getServerName = React.useCallback(
        (account: { server_info: { geolocation: { region: any; sequence: number } } }) => {
            if (account) {
                const server_region = account.server_info?.geolocation?.region;
                if (server_region) {
                    return `${server_region} ${
                        account?.server_info?.geolocation?.sequence === 1
                            ? ''
                            : account?.server_info?.geolocation?.sequence
                    }`;
                }
            }
            return '';
        },
        []
    );
    if (has_error)
        return (
            <div>
                <Text color='disabled' size='xs'>
                    <Localize i18n_default_text='Unavailable' />
                </Text>
                {server?.server_info?.geolocation &&
                    should_show_server_name &&
                    market_type === 'synthetic' &&
                    shortcode === 'svg' && (
                        <Text color='less-prominent' size='xxs' className='badge-server badge-server--disabled'>
                            {getServerName(server)}
                        </Text>
                    )}
            </div>
        );
    return (
        <div>
            {getCFDAccountDisplay({ market_type, sub_account_type, platform, is_eu, shortcode })}
            {server?.server_info?.geolocation &&
                should_show_server_name &&
                market_type === 'synthetic' &&
                shortcode === 'svg' && (
                    <Text
                        color={is_dark_mode_on ? 'general' : 'colored-background'}
                        size='xxs'
                        className={classNames('badge-server', {
                            'badge-server-bot': isBot(),
                        })}
                    >
                        {getServerName(server)}
                    </Text>
                )}
        </div>
    );
};

const OptionsAccount = ({
    currency_icon,
    loginid_text,
    balance,
    currency,
    display_type,
    has_reset_balance,
    is_disabled,
    is_virtual,
    country_standpoint,
    is_eu,
    market_type,
    server,
    sub_account_type,
    has_error,
    platform,
    is_dark_mode_on,
    shortcode,
    should_show_server_name,
    onClickResetVirtualBalance,
    redirectAccount,
    activeAccount,
    onClickDeposit,
}: TOptionsAccountprops) => {
    const currency_badge = currency ? currency_icon : 'IcCurrencyUnknown';
    return (
        <div
            className={classNames('account-container', {
                'account-container-active': activeAccount === loginid_text,
                'account-container-disabled': activeAccount !== loginid_text,
            })}
            onClick={redirectAccount}
        >
            <div className='account-container--icon'>
                <Icon
                    icon={is_virtual ? 'IcCurrencyVirtual' : currency_badge}
                    className={'acc-switcher__id-icon'}
                    size={40}
                />
            </div>
            <div className='account-container--account-details-wrapper'>
                <div className='account-container--account-details-wrapper--name-number'>
                    <Text
                        size='xxs'
                        line_height='l'
                        className='account-container--account-details-wrapper--name-number--name'
                        weight='bold'
                    >
                        {display_type === 'currency' ? (
                            <CurrencyDisplay
                                country_standpoint={country_standpoint}
                                currency={currency}
                                loginid={loginid_text}
                                is_virtual={is_virtual}
                            />
                        ) : (
                            <AccountDisplay
                                is_eu={is_eu}
                                market_type={market_type}
                                server={server}
                                sub_account_type={sub_account_type}
                                has_error={has_error}
                                platform={platform}
                                is_dark_mode_on={is_dark_mode_on}
                                shortcode={shortcode}
                                should_show_server_name={should_show_server_name}
                            />
                        )}
                    </Text>
                    <Text
                        size='xxxs'
                        line_height='s'
                        className='account-container--account-details-wrapper--name-number--number'
                    >
                        {loginid_text}
                    </Text>
                </div>

                <Text
                    size='s'
                    line_height='l'
                    weight='bold'
                    className='account-container--account-details-wrapper--balance'
                >
                    {`${balance} ${getCurrencyDisplayCode(currency)}`}
                </Text>
            </div>
            <div className='account-container--account-reset-button-wrapper'>
                {has_reset_balance ? (
                    <Button
                        is_disabled={is_disabled}
                        onClick={(e: React.ChangeEvent<HTMLInputElement>) => {
                            e.stopPropagation();
                            onClickResetVirtualBalance();
                        }}
                        className='acc-switcher__reset-account-btn'
                        secondary
                        small
                    >
                        {localize('Reset')}
                    </Button>
                ) : (
                    <Button
                        is_disabled={is_disabled}
                        onClick={onClickDeposit}
                        className='acc-switcher__reset-account-btn'
                        secondary
                        small
                    >
                        {localize('Deposit')}
                    </Button>
                )}
            </div>
            {isMobile() && getCurrencyDisplayCode(currency) !== 'Demo' && (
                <div className='account-container--dropdown'>
                    <WalletIcon icon={'DropDown'} />
                </div>
            )}
        </div>
    );
};

export default OptionsAccount;
