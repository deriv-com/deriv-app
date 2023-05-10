import React from 'react';
import { Text } from '@deriv/components';
import { getCurrencyDisplayCode } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import { SideNoteCard } from '../../../../components/side-note-card';

const CashierOnboardingSideNoteFiat: React.FC = observer(() => {
    const { client, ui } = useStore();
    const { currency, loginid, is_eu, is_low_risk } = client;
    const { is_mobile } = ui;
    const currency_code = getCurrencyDisplayCode(currency);
    const regulation_text = is_eu ? 'EU' : 'non-EU';

    return (
        <SideNoteCard
            title={
                is_low_risk
                    ? localize('This is your {{regulation_text}} {{currency_code}} account {{loginid}}', {
                          regulation_text,
                          currency_code,
                          loginid,
                      })
                    : localize('This is your {{currency_code}} account {{loginid}}', { currency_code, loginid })
            }
            hide_paddings={!is_mobile}
            description={
                <Localize
                    i18n_default_text='If you want to change your account currency, please contact us via <0>live chat</0>.'
                    components={[
                        <Text
                            key={0}
                            color='red'
                            size={is_mobile ? 'xxxs' : 'xxs'}
                            className='cashier-onboarding-side-notes__link'
                            onClick={() => window.LC_API.open_chat_window()}
                        />,
                    ]}
                />
            }
        />
    );
});

export default CashierOnboardingSideNoteFiat;
