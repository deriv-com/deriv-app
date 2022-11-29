import React from 'react';
import { observer } from 'mobx-react-lite';
import { Localize } from '@deriv/translations';
import { Icon, Text } from '@deriv/components';
import { getCurrencyDisplayCode, getPlatformSettings, routes } from '@deriv/shared';
import { useStore } from '@deriv/stores';
import './cashier-onboarding.scss';

const CashierOnboardingSideNote = ({ is_crypto }) => {
    const {
        client,
        ui,
        modules: {
            cashier: { general_store },
        },
    } = useStore();
    const { currency } = client;
    const { openRealAccountSignup } = ui;
    const { setDepositTarget } = general_store;

    const currency_code = getCurrencyDisplayCode(currency);

    const getSideNoteDescription = () => {
        if (is_crypto) {
            return (
                <Localize
                    i18n_default_text="Don't want to trade in {{currency_code}}? You can open another cryptocurrency account."
                    values={{ currency_code }}
                />
            );
        }

        return (
            <Localize
                i18n_default_text='If you want to change your account currency, please contact us via <0>live chat</0>.'
                components={[
                    <span
                        key={0}
                        className='link link--orange cashier-onboarding-side-note__text-nowrap'
                        onClick={() => window.LC_API.open_chat_window()}
                    />,
                ]}
                values={{ platform_name_dxtrade: getPlatformSettings('dxtrade').name }}
            />
        );
    };

    return (
        <div>
            <Text className='cashier-onboarding-side-note__text' color='prominent' weight='bold' sixe='xs' as='p'>
                {is_crypto ? (
                    <Localize i18n_default_text='This is your {{currency_code}} account.' values={{ currency_code }} />
                ) : (
                    <Localize
                        i18n_default_text='Your fiat account currency is set to {{currency_code}}.'
                        values={{ currency_code }}
                    />
                )}
            </Text>
            <Text className='cashier-onboarding-side-note__text' size='xxs' as='p' data-testid='dt_side_note_text'>
                {getSideNoteDescription()}
            </Text>
            {is_crypto && (
                <div
                    data-testid='dt_cashier_onboarding_side_note_link'
                    className='cashier-onboarding-side-note__link'
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
            )}
        </div>
    );
};

export default observer(CashierOnboardingSideNote);
