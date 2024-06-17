import classNames from 'classnames';
import React from 'react';
import { Money } from '@deriv/components';
import { Text, Button } from '@deriv-com/quill-ui';
import { formatMoney, getCFDAccountDisplay, getCurrencyDisplayCode } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import {
    getAccountIcon,
    getAccountTitle,
} from 'App/Components/Layout/Header/dtrader-v2/Utils/account-switcher-dtrader-v2-utils';

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
}: TAccountListDTraderV2) => (
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
                    {getAccountTitle({ currency, loginid, is_virtual })}
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
);

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
