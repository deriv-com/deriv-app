import React from 'react';
import { SideNote } from '@deriv/components';
import { getCurrencyDisplayCode } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';

const CashierOnboardingSideNoteFiat: React.FC = observer(() => {
    const { client } = useStore();
    const { currency, loginid, is_eu, is_low_risk } = client;
    const currency_code = getCurrencyDisplayCode(currency);
    const regulation_text = is_eu ? 'EU' : 'non-EU';

    return (
        <SideNote
            title={
                is_low_risk
                    ? localize('This is your {{regulation_text}} {{currency_code}} account {{loginid}}', {
                          regulation_text,
                          currency_code,
                          loginid,
                      })
                    : localize('This is your {{currency_code}} account {{loginid}}', { currency_code, loginid })
            }
            description={
                <Localize
                    i18n_default_text='If you want to change your account currency, please contact us via <0>live chat</0>.'
                    components={[
                        <a key={0} className='link link--orange' onClick={() => window.LC_API.open_chat_window()} />,
                    ]}
                />
            }
        />
    );
});

export default CashierOnboardingSideNoteFiat;
