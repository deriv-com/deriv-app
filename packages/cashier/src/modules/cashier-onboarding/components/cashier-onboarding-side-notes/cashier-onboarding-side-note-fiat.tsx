import React from 'react';
import { Text } from '@deriv/components';
import { getCurrencyDisplayCode } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';

const CashierOnboardingSideNoteFiat: React.FC = observer(() => {
    const { client } = useStore();
    const { currency, loginid, is_eu, is_low_risk } = client;
    const currency_code = getCurrencyDisplayCode(currency);
    const regulation_text = is_eu ? 'EU' : 'non-EU';

    const onClick = () => {
        window.LC_API.open_chat_window();
    };

    return (
        <>
            <Text className='cashier-onboarding-side-notes__text' color='prominent' weight='bold' size='xs' as='p'>
                {is_low_risk && (
                    <Localize
                        i18n_default_text='This is your {{regulation_text}} {{currency_code}} account {{loginid}}'
                        values={{ regulation_text, currency_code, loginid }}
                    />
                )}
                {!is_low_risk && (
                    <Localize
                        i18n_default_text='This is your {{currency_code}} account {{loginid}}'
                        values={{ currency_code, loginid }}
                    />
                )}
            </Text>
            <Text className='cashier-onboarding-side-notes__text' size='xxs' as='p'>
                <Localize
                    i18n_default_text='If you want to change your account currency, please contact us via <0>live chat</0>.'
                    components={[
                        <span
                            key={0}
                            className='link link--orange cashier-onboarding-side-notes__text-nowrap'
                            onClick={onClick}
                        />,
                    ]}
                />
            </Text>
        </>
    );
});

export default CashierOnboardingSideNoteFiat;
