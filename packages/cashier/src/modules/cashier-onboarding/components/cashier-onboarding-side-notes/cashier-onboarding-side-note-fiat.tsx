import React, { useMemo } from 'react';
import { Text } from '@deriv/components';
import { getCurrencyDisplayCode } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';

const CashierOnboardingSideNoteFiat: React.FC = observer(() => {
    const { client, ui } = useStore();
    const { is_mobile } = ui;
    const { currency, loginid, is_eu, is_low_risk } = client;
    const currency_code = getCurrencyDisplayCode(currency);

    const low_risk_title = useMemo(() => {
        const regulation_text = is_eu ? 'EU' : 'non-EU';

        return localize('This is your {{regulation_text}} {{currency_code}} account {{loginid}}', {
            regulation_text,
            currency_code,
            loginid,
        });
    }, [currency_code, is_eu, loginid]);

    const non_low_risk_title = useMemo(
        () => localize('This is your {{currency_code}} account {{loginid}}', { currency_code, loginid }),
        [currency_code, loginid]
    );

    return (
        <div className='cashier-onboarding-side-notes__content'>
            <Text color='prominent' weight='bold' size={is_mobile ? 'xxs' : 'xs'}>
                {is_low_risk && low_risk_title}
                {!is_low_risk && non_low_risk_title}
            </Text>
            <Text size={is_mobile ? 'xxxs' : 'xxs'}>
                <Localize
                    i18n_default_text='If you want to change your account currency, please contact us via <0>live chat</0>.'
                    components={[
                        <span
                            key={0}
                            className='link link--orange cashier-onboarding-side-notes__text-nowrap'
                            onClick={() => window.LC_API.open_chat_window()}
                        />,
                    ]}
                />
            </Text>
        </div>
    );
});

export default CashierOnboardingSideNoteFiat;
