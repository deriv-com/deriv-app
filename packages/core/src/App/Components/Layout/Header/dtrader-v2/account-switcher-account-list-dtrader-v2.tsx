import classNames from 'classnames';
import React from 'react';
import { Money } from '@deriv/components';
import { Text, Button } from '@deriv-com/quill-ui';
import { formatMoney, getCurrencyDisplayCode } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import {
    getAccountIcon,
    getAccountTitle,
} from 'App/Components/Layout/Header/dtrader-v2/Utils/account-switcher-dtrader-v2-utils';

type TAccountListDTraderV2 = {
    balance?: number;
    currency?: string;
    has_balance?: boolean;
    has_reset_balance?: boolean;
    is_disabled?: boolean;
    is_virtual?: boolean | number;
    loginid?: string;
    onClickResetVirtualBalance?: () => Promise<void>;
    redirectAccount?: () => void;
    selected_loginid?: number | string;
};
const AccountListDTraderV2 = ({
    balance,
    currency,
    has_balance,
    has_reset_balance,
    is_disabled,
    is_virtual,
    loginid,
    onClickResetVirtualBalance,
    redirectAccount,
    selected_loginid,
}: TAccountListDTraderV2) => (
    <div
        className={classNames('acc-switcher-dtrader__account', {
            'acc-switcher-dtrader__account--selected': loginid === selected_loginid,
            'acc-switcher-dtrader__account--disabled': is_disabled,
        })}
        onClick={() => {
            if (!is_disabled) redirectAccount?.();
        }}
    >
        {getAccountIcon({ currency, is_virtual: !!is_virtual, size: 'sm' })}
        <div className='acc-switcher-dtrader__account__info'>
            <Text size='sm' color='quill-typography__color--default'>
                {getAccountTitle({ currency, loginid, is_virtual: !!is_virtual, show_no_currency: true })}
            </Text>
            <Text size='sm' as='span' color='quill-typography__color--subtle'>
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

export default AccountListDTraderV2;
