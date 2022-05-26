import React from 'react';
import { Localize } from '@deriv/translations';
import { Icon, Text } from '@deriv/components';
import { getCurrencyDisplayCode, routes } from '@deriv/shared';
import 'Sass/cashier-default.scss';

const notes = (is_crypto, can_change_fiat_currency, currency, openRealAccountSignup, setDepositTarget) => {
    const notes_array = [];

    const currency_code = getCurrencyDisplayCode(currency);

    if (is_crypto) {
        notes_array.push(
            <Localize i18n_default_text='This is your {{currency_code}} account.' values={{ currency_code }} />
        );
    } else {
        notes_array.push(
            <Localize
                i18n_default_text='Your fiat account currency is set to {{currency_code}}.'
                values={{ currency_code }}
            />
        );
    }

    if (is_crypto) {
        notes_array.push(
            <Localize
                i18n_default_text="Don't want to trade in {{currency_code}}? You can open another cryptocurrency account."
                values={{ currency_code }}
            />
        );
    } else if (can_change_fiat_currency) {
        notes_array.push(
            <Localize
                i18n_default_text='You can <0>set a new currency</0> before you deposit for the first time or create a real DMT5 or Deriv X account.'
                components={[
                    <a key={0} className='link link--orange' onClick={() => openRealAccountSignup('manage')} />,
                ]}
            />
        );
    }

    notes_array.push(
        <Localize
            i18n_default_text="You can no longer change your account currency because you've made a deposit into your fiat account or created a real DMT5 or Deriv X account. Please contact us via <0>live chat</0> for clarification."
            components={[
                <span
                    key={0}
                    className='link link--orange cashier-default-side-note__text-nowrap'
                    onClick={() => window.LC_API.open_chat_window()}
                />,
            ]}
        />
    );

    if (is_crypto) {
        notes_array.push(
            <div
                className='cashier-default-side-note__link'
                onClick={() => {
                    setDepositTarget(routes.cashier_deposit);
                    openRealAccountSignup('add_crypto');
                }}
            >
                <Text size='xxs' color='red'>
                    <Localize i18n_default_text='Manage your accounts ' />
                </Text>
                <Icon icon='IcChevronRight' color='red' />
            </div>
        );
    }

    return notes_array;
};
