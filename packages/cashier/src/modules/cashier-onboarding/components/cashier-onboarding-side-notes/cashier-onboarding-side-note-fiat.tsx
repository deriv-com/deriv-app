import React from 'react';
import { Text } from '@deriv/components';
import { getCurrencyDisplayCode } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';

const CashierOnboardingSideNoteFiat: React.FC = observer(() => {
    const { client } = useStore();
    const { currency } = client;
    const currency_code = getCurrencyDisplayCode(currency);

    const onClick = () => {
        window.LC_API.open_chat_window();
    };

    return (
        <>
            <Text className='cashier-onboarding-side-notes__text' color='prominent' weight='bold' size='xs' as='p'>
                <Localize
                    i18n_default_text='Your fiat account currency is set to {{currency_code}}.'
                    values={{ currency_code }}
                />
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
