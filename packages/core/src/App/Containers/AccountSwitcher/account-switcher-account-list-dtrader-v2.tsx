import classNames from 'classnames';
import React from 'react';
import { Money } from '@deriv/components';
import { Text, Button } from '@deriv-com/quill-ui';
import { formatMoney, getCurrencyName, getCFDAccountDisplay, getCurrencyDisplayCode } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import {
    CurrencyBusdIcon,
    CurrencyAudIcon,
    CurrencyBchIcon,
    CurrencyUsdtIcon,
    CurrencyBtcIcon,
    CurrencyEthIcon,
    CurrencyLtcIcon,
    CurrencyUsdcIcon,
    CurrencyUsdIcon,
    CurrencyEurIcon,
    CurrencyGbpIcon,
    CurrencyPlaceholderIcon,
    CurrencyDemoIcon,
    CurrencyMultiCollateralDaiIcon,
    CurrencyEursIcon,
    CurrencyIdkIcon,
    CurrencyPaxIcon,
    CurrencyTusdIcon,
    CurrencyUsdkIcon,
    CurrencyXrpIcon,
} from '@deriv/quill-icons';

type TAccountListDTraderV2 = {
    balance?: number;
    currency?: string;
    display_type?: string;
    has_balance?: boolean;
    has_error?: boolean;
    has_reset_balance?: boolean;
    is_disabled?: boolean;
    is_virtual?: boolean;
    is_eu?: boolean;
    loginid?: string;
    market_type?: string;
    redirectAccount?: () => void;
    onClickResetVirtualBalance?: () => Promise<void>;
    selected_loginid?: number | string;
    server?: any;
    shortcode?: string;
    sub_account_type?: string;
    platform?: string;
    should_show_server_name?: boolean;
};
const AccountListDTraderV2 = ({
    balance,
    currency,
    display_type,
    has_balance,
    has_error,
    has_reset_balance,
    is_disabled,
    is_virtual,
    is_eu,
    loginid,
    market_type,
    redirectAccount,
    onClickResetVirtualBalance,
    selected_loginid,
    server,
    shortcode,
    sub_account_type,
    platform,
    should_show_server_name,
}: TAccountListDTraderV2) => {
    // TODO: remove function into the config?
    const getAccountIcon = (
        currency?: string,
        is_virtual?: boolean,
        size?: React.ComponentProps<typeof CurrencyDemoIcon>['iconSize']
    ) => {
        if (is_virtual) return <CurrencyDemoIcon iconSize={size} />;
        if (!currency) return <CurrencyPlaceholderIcon iconSize={size} />;

        const key = currency.toUpperCase();
        const config = {
            AUD: <CurrencyAudIcon iconSize={size} />,
            BCH: <CurrencyBchIcon iconSize={size} />,
            BUSD: <CurrencyBusdIcon iconSize={size} />,
            DAI: <CurrencyMultiCollateralDaiIcon iconSize={size} />,
            TUSDT: <CurrencyUsdtIcon iconSize={size} />,
            UST: <CurrencyUsdtIcon iconSize={size} />,
            EUSDT: <CurrencyUsdtIcon iconSize={size} />,
            BTC: <CurrencyBtcIcon iconSize={size} />,
            ETH: <CurrencyEthIcon iconSize={size} />,
            LTC: <CurrencyLtcIcon iconSize={size} />,
            USDC: <CurrencyUsdcIcon iconSize={size} />,
            USD: <CurrencyUsdIcon iconSize={size} />,
            EUR: <CurrencyEurIcon iconSize={size} />,
            GBP: <CurrencyGbpIcon iconSize={size} />,
            EURS: <CurrencyEursIcon iconSize={size} />,
            IDK: <CurrencyIdkIcon iconSize={size} />,
            PAX: <CurrencyPaxIcon iconSize={size} />,
            TUSD: <CurrencyTusdIcon iconSize={size} />,
            USDK: <CurrencyUsdkIcon iconSize={size} />,
            XRP: <CurrencyXrpIcon iconSize={size} />,
        };

        return config[key as keyof typeof config] ?? <CurrencyPlaceholderIcon iconSize={size} />;
    };

    return (
        <React.Fragment>
            <div
                id={`dt_${loginid}`}
                className={classNames('acc-switcher-dtrader__account', {
                    'acc-switcher-dtrader__account--selected': loginid === selected_loginid,
                    'acc-switcher-dtrader__account--disabled': is_disabled,
                })}
                onClick={() => {
                    if (!is_disabled) redirectAccount?.();
                }}
            >
                {getAccountIcon(currency, is_virtual, 'sm')}
                <div className='acc-switcher-dtrader__account__info'>
                    {display_type === 'currency' ? (
                        <Text size='sm' color='quill-typography__color--default'>
                            <CurrencyDisplay currency={currency} loginid={loginid} is_virtual={is_virtual} />
                        </Text>
                    ) : (
                        <AccountDisplay
                            is_eu={is_eu}
                            market_type={market_type}
                            server={server}
                            sub_account_type={sub_account_type}
                            has_error={has_error}
                            platform={platform}
                            shortcode={shortcode}
                            should_show_server_name={should_show_server_name}
                        />
                    )}
                    <Text size='sm' color='quill-typography__color--disabled' as='span'>
                        {loginid}
                    </Text>
                </div>
                {has_reset_balance ? (
                    <Button
                        disabled={is_disabled}
                        color='white'
                        label={<Localize i18n_default_text='Reset balance' />}
                        onClick={e => {
                            e.stopPropagation();
                            onClickResetVirtualBalance?.();
                        }}
                        size='sm'
                        type='button'
                        variant='secondary'
                    />
                ) : (
                    has_balance &&
                    currency && (
                        <Text size='sm' color='quill-typography__color--default'>
                            <Money
                                currency={getCurrencyDisplayCode(currency)}
                                amount={formatMoney(currency, Number(balance), true)}
                                should_format={false}
                                show_currency
                            />
                        </Text>
                    )
                )}
            </div>
        </React.Fragment>
    );
};

const CurrencyDisplay = ({
    currency,
    loginid,
    is_virtual,
}: Pick<TAccountListDTraderV2, 'currency' | 'loginid' | 'is_virtual'>) => {
    const account_type = loginid?.replace(/\d/g, '');

    if (account_type === 'MF') {
        return <Localize i18n_default_text='Multipliers' />;
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
    is_eu,
    shortcode,
    should_show_server_name,
}: Pick<
    TAccountListDTraderV2,
    | 'has_error'
    | 'market_type'
    | 'sub_account_type'
    | 'platform'
    | 'server'
    | 'is_eu'
    | 'shortcode'
    | 'should_show_server_name'
>) => {
    // TODO: Check unused css
    const account_title = getCFDAccountDisplay({
        market_type,
        sub_account_type,
        platform,
        is_eu,
        shortcode,
    } as Parameters<typeof getCFDAccountDisplay>[0]);
    // TODO: Remove once account with error has market_type and sub_account_type in details response
    const getServerName = React.useCallback(
        (account?: { server_info?: { geolocation?: { region: string; sequence?: number } } }) => {
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
                <Text color='disabled' size='sm'>
                    <Localize i18n_default_text='Unavailable' />
                </Text>
                {server?.server_info?.geolocation &&
                    should_show_server_name &&
                    market_type === 'synthetic' &&
                    shortcode === 'svg' && (
                        <Text color='less-prominent' size='sm' className='badge-server badge-server--disabled'>
                            {getServerName(server)}
                        </Text>
                    )}
            </div>
        );

    return (
        <div>
            {/* TODO: Remove below condition once deriv x changes are completed */}
            {platform === 'dxtrade' && account_title === 'Derived' ? (
                <Localize i18n_default_text='Synthetic' />
            ) : (
                account_title
            )}
            {server?.server_info?.geolocation &&
                should_show_server_name &&
                market_type === 'synthetic' &&
                shortcode === 'svg' && <Text size='sm'>{getServerName(server)}</Text>}
        </div>
    );
};

export default AccountListDTraderV2;
