import React from 'react';
import { Localize } from '@deriv/translations';
import { Icon, Text } from '@deriv/components';
import { getCurrencyDisplayCode, getPlatformSettings, routes, isMobile } from '@deriv/shared';
import { useStore, observer } from '@deriv/stores';
import { useCashierStore } from '../../stores/useCashierStores';
import './cashier-onboarding.scss';

type TCashierOnboardingSideNoteProps = {
    is_crypto?: boolean;
};

const CashierOnboardingSideNote = observer(({ is_crypto }: TCashierOnboardingSideNoteProps) => {
    const { client, ui } = useStore();
    const { general_store } = useCashierStore();
    const { currency, is_eu, loginid, is_low_risk } = client;
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

    const getHeaderTitle = () => {
        if (is_low_risk && !is_crypto) {
            const regulation_text = is_eu ? 'EU' : 'non-EU';
            return (
                <Localize
                    i18n_default_text='This is your {{regulation_text}} {{currency_code}} account {{loginid}}'
                    values={{ regulation_text, currency_code, loginid }}
                />
            );
        }
        return (
            <Localize
                i18n_default_text='This is your {{currency_code}} account {{loginid}}'
                values={{ currency_code, loginid }}
            />
        );
    };

    return (
        <div>
            <Text
                className='cashier-onboarding-side-note__text'
                color='prominent'
                weight='bold'
                size={isMobile() ? 'xxs' : 'xs'}
                as='p'
            >
                {getHeaderTitle()}
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
});

export default CashierOnboardingSideNote;
