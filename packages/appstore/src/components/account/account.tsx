import React from 'react';
import { RouteComponentProps } from 'react-router';
import classNames from 'classnames';
import { Text, Button, Icon, Money } from '@deriv/components';
import {
    getCurrencyDisplayCode,
    isMobile,
    getCurrencyName,
    getCFDAccountDisplay,
    isBot,
    formatMoney,
} from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import WalletIcon from 'Assets/svgs/wallet';

type TCountryStandpoint = {
    is_united_kingdom: boolean;
    is_isle_of_man: boolean;
};

type TGeoLocation = {
    region: any;
    sequence: number;
};
type TServerInfo = {
    geolocation: TGeoLocation;
};
type TServer = {
    server_info: TServerInfo;
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
    country_standpoint: TCountryStandpoint;
    is_eu?: string;
    market_type?: string;
    server?: TServer;
    sub_account_type?: string;
    has_error?: string;
    platform?: string;
    is_dark_mode_on?: string;
    shortcode?: string;
    should_show_server_name?: string;
    onClickResetVirtualBalance: () => void;
    selected_loginid?: string;
    redirectAccount?: () => void;
    activeAccount?: string;
    onClickDeposit?: () => void;
    switchAccountModal?: () => void;
    is_modal?: boolean;
};

type TCurrentDisplay = {
    country_standpoint: TCountryStandpoint;
    currency?: string;
    loginid: string;
    is_virtual?: boolean;
};

type TAccountDisplay = {
    is_eu?: string;
    market_type?: string;
    server?: TServer;
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
    has_balance,
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
    switchAccountModal,
    is_modal,
}: TOptionsAccountprops) => {
    const currency_badge = currency ? currency_icon : 'IcCurrencyUnknown';
    return (
        <div
            className={classNames('account-container', {
                'account-container-active': activeAccount === loginid_text,
                'account-container-disabled': activeAccount !== loginid_text,
                'account-container-modal': is_modal,
            })}
            onClick={redirectAccount}
        >
            <div className='account-container__icon'>
                <Icon
                    icon={is_virtual ? 'IcCurrencyVirtual' : currency_badge}
                    className={'acc-switcher__id-icon'}
                    size={isMobile() ? 30 : 40}
                />
            </div>
            <div className='account-container__details-wrapper'>
                <Text
                    size={isMobile() ? 'xxxs' : 'xxs'}
                    line_height={isMobile() ? 's' : 'l'}
                    className='account-container__details-wrapper--name'
                    weight={is_modal ? '' : 'bold'}
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
                {!is_modal && (
                    <Text
                        size={isMobile() ? 'xxxxs' : 'xxxs'}
                        line_height={isMobile() ? 'xs' : 's'}
                        weight='bold'
                        className='account-container__details-wrapper--number'
                    >
                        {loginid_text}
                    </Text>
                )}
                <Text
                    size={isMobile() ? 'xs' : 's'}
                    // eslint-disable-next-line no-nested-ternary
                    line_height={isMobile() ? 'xs' : 'l'}
                    weight='bold'
                    className='account-container__details-wrapper--balance'
                >
                    {currency && (
                        <Money
                            currency={getCurrencyDisplayCode(currency)}
                            amount={formatMoney(currency, balance, true)}
                            should_format={false}
                            show_currency
                        />
                    )}
                </Text>
            </div>
            {!is_modal && (
                <div className='account-container__button-wrapper'>
                    {has_reset_balance ? (
                        <Button
                            is_disabled={is_disabled}
                            onClick={(e: React.ChangeEvent<HTMLInputElement>) => {
                                e.stopPropagation();
                                onClickResetVirtualBalance();
                            }}
                            secondary
                            small
                        >
                            {localize('Reset')}
                        </Button>
                    ) : (
                        has_balance && (
                            <Button is_disabled={is_disabled} onClick={onClickDeposit} secondary small>
                                {localize('Deposit')}
                            </Button>
                        )
                    )}
                </div>
            )}
            {!is_modal && isMobile() && !is_virtual && (
                <div className='account-container__dropdown'>
                    <WalletIcon icon={'DropDown'} onClick={switchAccountModal} />
                </div>
            )}
        </div>
    );
};

export default OptionsAccount;
